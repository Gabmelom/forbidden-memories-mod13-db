#!/usr/bin/env python3
"""Import locally supplied Mod 13 card images as normalized WebP."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import tempfile
from pathlib import Path
from typing import Any, Final


CARD_COUNT: Final = 722
MAX_DIMENSION: Final = 1600
WEBP_QUALITY: Final = 92
SUPPORTED_EXTENSIONS: Final = {".webp", ".png", ".jpg", ".jpeg"}

try:
    from PIL import Image
except ImportError:
    Image = None  # type: ignore[assignment]


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import a local card-image directory into public/mods/mod13/cards"
    )
    parser.add_argument("source_directory", help="Directory containing ID-named images")
    return parser.parse_args()


def card_id_from_filename(path: Path) -> int | None:
    exact_match = re.fullmatch(r"0*(\d{1,3})", path.stem)
    leading_match = re.match(r"^0*(\d{1,3})(?:[-_. ]|$)", path.stem)
    match = exact_match or leading_match
    if not match:
        return None
    card_id = int(match.group(1))
    return card_id if 1 <= card_id <= CARD_COUNT else None


def discover_images(source_directory: Path) -> dict[int, Path]:
    candidates: dict[int, list[Path]] = {}
    for path in sorted(source_directory.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        card_id = card_id_from_filename(path)
        if card_id is not None:
            candidates.setdefault(card_id, []).append(path)

    duplicates = {card_id: paths for card_id, paths in candidates.items() if len(paths) > 1}
    if duplicates:
        print("Multiple source images matched the same card ID:", file=sys.stderr)
        for card_id, paths in sorted(duplicates.items()):
            print(f"- #{card_id}: {', '.join(str(path) for path in paths)}", file=sys.stderr)
        raise ValueError("Resolve duplicate source-image IDs before importing")
    return {card_id: paths[0] for card_id, paths in candidates.items()}


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
    """Return True when the image was resized."""
    if Image is None:
        if source.suffix.lower() == ".webp":
            copy_atomically(source, destination)
            return False
        raise RuntimeError(
            f"Pillow is required to convert {source.suffix} images. "
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


def read_card_names(cards_path: Path) -> dict[int, str]:
    records: Any = json.loads(cards_path.read_text(encoding="utf-8"))
    if not isinstance(records, list):
        raise ValueError("src/data/mod13/cards.json must be an array")
    return {
        record["id"]: record["name"]
        for record in records
        if isinstance(record, dict)
        and isinstance(record.get("id"), int)
        and isinstance(record.get("name"), str)
    }


def main() -> int:
    arguments = parse_arguments()
    project_root = Path(__file__).resolve().parents[1]
    source_directory = Path(arguments.source_directory).expanduser().resolve()
    destination_directory = project_root / "public" / "mods" / "mod13" / "cards"

    if not source_directory.is_dir():
        print(f"Source directory does not exist: {source_directory}", file=sys.stderr)
        return 1
    if source_directory == destination_directory.resolve():
        print("Source directory must be different from public/mods/mod13/cards", file=sys.stderr)
        return 1

    try:
        images = discover_images(source_directory)
        if not images:
            raise ValueError(
                "No supported ID-named images were found. Use names such as 1.webp or 082.png."
            )

        destination_directory.mkdir(parents=True, exist_ok=True)
        resized = 0
        for card_id, source in sorted(images.items()):
            destination = destination_directory / f"{card_id:03d}.webp"
            resized += int(convert_to_webp(source, destination))

        card_names = read_card_names(project_root / "src" / "data" / "mod13" / "cards.json")
        present_ids = {
            card_id
            for card_id in range(1, CARD_COUNT + 1)
            if (destination_directory / f"{card_id:03d}.webp").is_file()
        }
        missing_ids = sorted(set(range(1, CARD_COUNT + 1)) - present_ids)

        print(f"Images discovered: {len(images)}")
        print(f"Images imported: {len(images)}")
        print(f"Images resized: {resized}")
        print(f"Present after import: {len(present_ids)}")
        print(f"Missing: {len(missing_ids)}")
        if missing_ids:
            print("\nMissing:")
            for card_id in missing_ids:
                print(f"{card_id:03d}.webp  #{card_id} {card_names.get(card_id, 'Unknown card')}")
        return 0
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as error:
        print(f"Card image import failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
