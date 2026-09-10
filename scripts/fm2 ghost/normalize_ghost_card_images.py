#!/usr/bin/env python3
"""Normalize FM2 Ghost card artwork names without recompressing the images.

The harvested files use names such as ``1.jpg``, but their contents are
already WebP. This script validates the complete 1..722 set and renames it to
the zero-padded filenames consumed by the app, such as ``001.webp``.

Run without ``--apply`` to preview the operation first.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Final


CARD_COUNT: Final = 722
WEBP_HEADER_LENGTH: Final = 12


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Rename FM2 Ghost card artwork from <ID>.jpg to <ID:03d>.webp"
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Perform the renames. Without this flag, only a dry run is shown.",
    )
    return parser.parse_args()


def card_id_from_path(path: Path) -> int | None:
    if not path.stem.isdecimal():
        return None
    card_id = int(path.stem)
    return card_id if 1 <= card_id <= CARD_COUNT else None


def is_webp(path: Path) -> bool:
    with path.open("rb") as image_file:
        header = image_file.read(WEBP_HEADER_LENGTH)
    return len(header) == WEBP_HEADER_LENGTH and header[:4] == b"RIFF" and header[8:] == b"WEBP"


def discover_by_id(directory: Path, suffix: str) -> tuple[dict[int, Path], list[Path]]:
    candidates: dict[int, list[Path]] = {}
    invalid_names: list[Path] = []

    for path in sorted(directory.iterdir()):
        if not path.is_file() or path.suffix.lower() != suffix:
            continue
        card_id = card_id_from_path(path)
        if card_id is None:
            invalid_names.append(path)
            continue
        candidates.setdefault(card_id, []).append(path)

    duplicates = {card_id: paths for card_id, paths in candidates.items() if len(paths) > 1}
    if duplicates:
        details = "; ".join(
            f"#{card_id}: {', '.join(path.name for path in paths)}"
            for card_id, paths in sorted(duplicates.items())
        )
        raise ValueError(f"Multiple {suffix} files matched the same card ID: {details}")

    return {card_id: paths[0] for card_id, paths in candidates.items()}, invalid_names


def validate_and_plan(directory: Path) -> tuple[list[tuple[Path, Path]], int]:
    sources, invalid_jpg_names = discover_by_id(directory, ".jpg")
    destinations, invalid_webp_names = discover_by_id(directory, ".webp")

    invalid_names = invalid_jpg_names + invalid_webp_names
    if invalid_names:
        raise ValueError(
            "Card image filenames must contain only an ID from 1 to 722: "
            + ", ".join(path.name for path in invalid_names)
        )

    collisions = sorted(set(sources) & set(destinations))
    if collisions:
        raise ValueError(
            "Both source and destination files exist for card IDs: "
            + ", ".join(str(card_id) for card_id in collisions)
        )

    present_ids = set(sources) | set(destinations)
    expected_ids = set(range(1, CARD_COUNT + 1))
    missing_ids = sorted(expected_ids - present_ids)
    unexpected_ids = sorted(present_ids - expected_ids)
    if missing_ids or unexpected_ids:
        parts = []
        if missing_ids:
            parts.append("missing IDs: " + ", ".join(str(card_id) for card_id in missing_ids))
        if unexpected_ids:
            parts.append("unexpected IDs: " + ", ".join(str(card_id) for card_id in unexpected_ids))
        raise ValueError("Incomplete card image set (" + "; ".join(parts) + ")")

    invalid_webp_content = [
        path.name
        for path in [*sources.values(), *destinations.values()]
        if not is_webp(path)
    ]
    if invalid_webp_content:
        raise ValueError(
            "These files are not WebP images and require conversion: "
            + ", ".join(invalid_webp_content)
        )

    plan = [
        (source, directory / f"{card_id:03d}.webp")
        for card_id, source in sorted(sources.items())
    ]
    return plan, len(destinations)


def apply_renames(plan: list[tuple[Path, Path]]) -> None:
    completed: list[tuple[Path, Path]] = []
    try:
        for source, destination in plan:
            source.rename(destination)
            completed.append((source, destination))
    except OSError as error:
        rollback_errors: list[str] = []
        for source, destination in reversed(completed):
            try:
                destination.rename(source)
            except OSError as rollback_error:
                rollback_errors.append(f"{destination.name}: {rollback_error}")
        message = f"Rename failed after {len(completed)} files: {error}"
        if rollback_errors:
            message += "; rollback also failed for " + ", ".join(rollback_errors)
        raise RuntimeError(message) from error


def main() -> int:
    arguments = parse_arguments()
    project_root = Path(__file__).resolve().parents[2]
    image_directory = project_root / "public" / "mods" / "fm2-ghost" / "cards"

    if not image_directory.is_dir():
        print(f"Card image directory does not exist: {image_directory}", file=sys.stderr)
        return 1

    try:
        plan, already_normalized = validate_and_plan(image_directory)
        print(f"Validated WebP images: {CARD_COUNT}")
        print(f"Already normalized: {already_normalized}")
        print(f"Renames required: {len(plan)}")

        if not plan:
            print("No changes needed.")
            return 0

        if not arguments.apply:
            print(f"First: {plan[0][0].name} -> {plan[0][1].name}")
            print(f"Last:  {plan[-1][0].name} -> {plan[-1][1].name}")
            print("Dry run only. Re-run with --apply to rename the files.")
            return 0

        apply_renames(plan)

        remaining_plan, normalized_count = validate_and_plan(image_directory)
        if remaining_plan or normalized_count != CARD_COUNT:
            raise RuntimeError("Post-rename validation did not find the complete normalized set")

        print(f"Renamed: {len(plan)}")
        print(f"Normalized images present: {normalized_count}")
        return 0
    except (OSError, RuntimeError, ValueError) as error:
        print(f"Ghost card image normalization failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
