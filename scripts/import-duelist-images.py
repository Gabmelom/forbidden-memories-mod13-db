#!/usr/bin/env python3
"""Import locally supplied duelist portraits using verified slug/name matches."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import tempfile
import unicodedata
from pathlib import Path
from typing import Any, Final


MAX_DIMENSION: Final = 1024
WEBP_QUALITY: Final = 92
SUPPORTED_EXTENSIONS: Final = {".webp", ".png", ".jpg", ".jpeg", ".bmp"}

try:
    from PIL import Image
except ImportError:
    Image = None  # type: ignore[assignment]


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import a local duelist-portrait directory into public/duelists"
    )
    parser.add_argument("source_directory", help="Directory containing duelist portraits")
    return parser.parse_args()


def normalize_label(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii").casefold()
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", ascii_value))


def read_duelists(path: Path) -> list[dict[str, Any]]:
    records: Any = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(records, list) or len(records) != 39:
        raise ValueError("src/data/duelists.json must contain exactly 39 duelists")
    for record in records:
        if (
            not isinstance(record, dict)
            or not isinstance(record.get("name"), str)
            or not isinstance(record.get("slug"), str)
        ):
            raise ValueError("Every duelist must have string name and slug fields")
    return records


def discover_matches(
    source_directory: Path,
    duelists: list[dict[str, Any]],
) -> tuple[dict[str, Path], list[tuple[Path, str]], dict[str, list[Path]]]:
    slug_lookup = {duelist["slug"].casefold(): duelist["slug"] for duelist in duelists}
    id_lookup = {
        duelist["id"]: duelist["slug"]
        for duelist in duelists
        if isinstance(duelist.get("id"), int)
    }
    normalized_name_lookup: dict[str, list[str]] = {}
    for duelist in duelists:
        normalized_name_lookup.setdefault(normalize_label(duelist["name"]), []).append(
            duelist["slug"]
        )

    candidates: dict[str, list[Path]] = {}
    unmatched: list[tuple[Path, str]] = []
    for path in sorted(source_directory.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue

        exact_slug = slug_lookup.get(path.stem.casefold())
        if exact_slug:
            candidates.setdefault(exact_slug, []).append(path)
            continue

        numeric_match = re.fullmatch(r"0*(\d+)", path.stem)
        if numeric_match:
            duelist_id = int(numeric_match.group(1))
            id_slug = id_lookup.get(duelist_id)
            if id_slug:
                candidates.setdefault(id_slug, []).append(path)
            else:
                unmatched.append((path, f"no duelist with numeric ID {duelist_id}"))
            continue

        normalized_matches = normalized_name_lookup.get(normalize_label(path.stem), [])
        if len(normalized_matches) == 1:
            candidates.setdefault(normalized_matches[0], []).append(path)
        elif len(normalized_matches) > 1:
            unmatched.append((path, "normalized name is ambiguous"))
        else:
            unmatched.append((path, "no exact slug or normalized-name match"))

    conflicts = {slug: paths for slug, paths in candidates.items() if len(paths) > 1}
    matches = {slug: paths[0] for slug, paths in candidates.items() if len(paths) == 1}
    return matches, unmatched, conflicts


def copy_atomically(source: Path, destination: Path) -> None:
    with tempfile.NamedTemporaryFile(
        dir=destination.parent,
        prefix=f"{destination.name}.",
        suffix=".tmp",
        delete=False,
    ) as temporary_file:
        temporary_path = Path(temporary_file.name)
    try:
        shutil.copy2(source, temporary_path)
        temporary_path.replace(destination)
    finally:
        temporary_path.unlink(missing_ok=True)


def convert_to_webp(source: Path, destination: Path) -> bool:
    """Return True when an oversized portrait was resized."""
    if Image is None:
        if source.suffix.lower() == ".webp":
            copy_atomically(source, destination)
            return False
        raise RuntimeError(
            f"Pillow is required to convert {source.suffix} portraits. "
            "Install it with 'python -m pip install Pillow' or supply WebP files."
        )

    with Image.open(source) as image:
        should_resize = max(image.size) > MAX_DIMENSION
        if source.suffix.lower() == ".webp" and not should_resize:
            copy_atomically(source, destination)
            return False

        converted = image.copy()
        if should_resize:
            converted.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
        if converted.mode not in {"RGB", "RGBA"}:
            converted = converted.convert("RGBA" if "transparency" in converted.info else "RGB")

        with tempfile.NamedTemporaryFile(
            dir=destination.parent,
            prefix=f"{destination.name}.",
            suffix=".webp",
            delete=False,
        ) as temporary_file:
            temporary_path = Path(temporary_file.name)
        try:
            converted.save(temporary_path, "WEBP", quality=WEBP_QUALITY, method=6)
            temporary_path.replace(destination)
        finally:
            temporary_path.unlink(missing_ok=True)
        return should_resize


def main() -> int:
    arguments = parse_arguments()
    project_root = Path(__file__).resolve().parents[1]
    source_directory = Path(arguments.source_directory).expanduser().resolve()
    destination_directory = project_root / "public" / "duelists"

    if not source_directory.is_dir():
        print(f"Source directory does not exist: {source_directory}", file=sys.stderr)
        return 1
    if source_directory == destination_directory.resolve():
        print("Source directory must be different from public/duelists", file=sys.stderr)
        return 1

    try:
        duelists = read_duelists(project_root / "src" / "data" / "duelists.json")
        matches, unmatched, conflicts = discover_matches(source_directory, duelists)
        if not matches and not unmatched and not conflicts:
            raise ValueError("No supported portrait files were found")

        destination_directory.mkdir(parents=True, exist_ok=True)
        resized = 0
        for slug, source in sorted(matches.items()):
            resized += int(convert_to_webp(source, destination_directory / f"{slug}.webp"))

        if conflicts:
            print("\nConflicting portraits skipped:")
            for slug, paths in sorted(conflicts.items()):
                print(f"- {slug}: {', '.join(str(path) for path in paths)}")
        if unmatched:
            print("\nUnmatched files:")
            for path, reason in unmatched:
                print(f"- {path} — {reason}")

        missing = [
            duelist
            for duelist in duelists
            if not (destination_directory / f"{duelist['slug']}.webp").is_file()
        ]
        print(f"\nPortraits matched: {len(matches)}")
        print(f"Portraits imported: {len(matches)}")
        print(f"Portraits resized: {resized}")
        print(f"Unmatched files: {len(unmatched)}")
        print(f"Conflicts: {len(conflicts)}")
        print(f"Duelists still missing portraits: {len(missing)}")
        if missing:
            print("\nMissing portraits:")
            for duelist in missing:
                print(f"- {duelist['slug']} — {duelist['name']}")
        return 0
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as error:
        print(f"Duelist portrait import failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
