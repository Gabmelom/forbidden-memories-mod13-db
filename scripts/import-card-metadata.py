#!/usr/bin/env python3
"""Merge open-source Forbidden Memories card metadata by numeric card ID."""

from __future__ import annotations

import argparse
import json
import re
import sys
import tempfile
import unicodedata
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any, Final


CARD_COUNT: Final = 722
SOURCE_URL: Final = (
    "https://raw.githubusercontent.com/sg4e/YGOFM-gamedata/"
    "master/sqlite/json/cardinfo.json"
)
NON_MONSTER_TYPES: Final = {"Magic", "Trap"}


class ImportValidationError(RuntimeError):
    """Raised when source or merged card data fails validation."""


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import card metadata from sg4e/YGOFM-gamedata by numeric ID"
    )
    parser.add_argument(
        "--source",
        help="Optional local cardinfo.json path; defaults to downloading upstream",
    )
    return parser.parse_args()


def load_json_file(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ImportValidationError(f"Could not read JSON from {path}: {error}") from error


def download_source(url: str) -> Any:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "FM-Mod-13-DB-card-metadata-importer/1.0"},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            if response.status != 200:
                raise ImportValidationError(
                    f"Metadata download returned HTTP {response.status}"
                )
            return json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
        raise ImportValidationError(f"Could not download metadata from {url}: {error}") from error


def require_complete_id_set(records: Any, id_field: str, label: str) -> dict[int, dict[str, Any]]:
    if not isinstance(records, list):
        raise ImportValidationError(f"{label} must be a JSON array")
    if len(records) != CARD_COUNT:
        raise ImportValidationError(
            f"{label} contains {len(records)} cards; expected exactly {CARD_COUNT}"
        )

    ids: list[int] = []
    indexed: dict[int, dict[str, Any]] = {}
    for index, record in enumerate(records):
        if not isinstance(record, dict):
            raise ImportValidationError(f"{label} record {index + 1} is not an object")
        card_id = record.get(id_field)
        if isinstance(card_id, bool) or not isinstance(card_id, int):
            raise ImportValidationError(
                f"{label} record {index + 1} has a non-numeric {id_field}"
            )
        ids.append(card_id)
        indexed[card_id] = record

    duplicate_ids = sorted(card_id for card_id, count in Counter(ids).items() if count > 1)
    missing_ids = sorted(set(range(1, CARD_COUNT + 1)) - set(ids))
    unexpected_ids = sorted(set(ids) - set(range(1, CARD_COUNT + 1)))
    mismatch_messages: list[str] = []
    if duplicate_ids:
        mismatch_messages.append(f"duplicate IDs: {duplicate_ids}")
    if missing_ids:
        mismatch_messages.append(f"missing IDs: {missing_ids}")
    if unexpected_ids:
        mismatch_messages.append(f"unexpected IDs: {unexpected_ids}")
    if mismatch_messages:
        raise ImportValidationError(f"{label} card-ID mismatch: {'; '.join(mismatch_messages)}")
    return indexed


def normalize_name(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    without_marks = "".join(char for char in normalized if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", "", without_marks.casefold())


def optional_string(record: dict[str, Any], field: str, card_id: int) -> str | None:
    value = record.get(field)
    if value is not None and not isinstance(value, str):
        raise ImportValidationError(
            f"Source card ID {card_id} has invalid {field}: expected string or null"
        )
    return value


def optional_integer(record: dict[str, Any], field: str, card_id: int) -> int | None:
    value = record.get(field)
    if value is not None and (isinstance(value, bool) or not isinstance(value, int)):
        raise ImportValidationError(
            f"Source card ID {card_id} has invalid {field}: expected integer or null"
        )
    return value


def merge_cards(
    extracted_names: dict[int, dict[str, Any]],
    source_cards: dict[int, dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[tuple[int, str, str, bool]]]:
    merged: list[dict[str, Any]] = []
    name_differences: list[tuple[int, str, str, bool]] = []

    for card_id in range(1, CARD_COUNT + 1):
        extracted = extracted_names[card_id]
        source = source_cards[card_id]
        extracted_name = extracted.get("name")
        source_name = source.get("cardName")
        if not isinstance(extracted_name, str) or not extracted_name.strip():
            if not isinstance(source_name, str) or not source_name.strip():
                raise ImportValidationError(f"Card ID {card_id} has no usable name")
            chosen_name = source_name
        else:
            chosen_name = extracted_name

        if not isinstance(source_name, str) or not source_name.strip():
            raise ImportValidationError(f"Source card ID {card_id} has no usable cardName")
        if chosen_name != source_name:
            format_only = normalize_name(chosen_name) == normalize_name(source_name)
            name_differences.append((card_id, chosen_name, source_name, format_only))

        card_type = source.get("type")
        if not isinstance(card_type, str) or not card_type:
            raise ImportValidationError(f"Source card ID {card_id} has no valid type")

        if card_type in NON_MONSTER_TYPES:
            attack: int | None = None
            defense: int | None = None
        else:
            attack = optional_integer(source, "attack", card_id)
            defense = optional_integer(source, "defense", card_id)
            if attack is None or defense is None:
                raise ImportValidationError(
                    f"Monster card ID {card_id} is missing numeric attack or defense"
                )

        merged.append(
            {
                "id": card_id,
                "name": chosen_name,
                "type": card_type,
                "atk": attack,
                "def": defense,
                "attribute": optional_string(source, "attribute", card_id),
                "level": optional_integer(source, "level", card_id),
                "guardianStar1": optional_string(source, "guardianStar1", card_id),
                "guardianStar2": optional_string(source, "guardianStar2", card_id),
            }
        )

    return merged, name_differences


def validate_result(cards: list[dict[str, Any]]) -> None:
    indexed = require_complete_id_set(cards, "id", "Resulting cards.json")
    for card_id, card in indexed.items():
        card_type = card.get("type")
        attack = card.get("atk")
        defense = card.get("def")
        if card_type in NON_MONSTER_TYPES:
            if attack is not None or defense is not None:
                raise ImportValidationError(
                    f"{card_type} card ID {card_id} must have null atk/def"
                )
        elif (
            isinstance(attack, bool)
            or not isinstance(attack, int)
            or isinstance(defense, bool)
            or not isinstance(defense, int)
        ):
            raise ImportValidationError(
                f"Monster card ID {card_id} must have numeric atk/def"
            )


def write_json_atomically(path: Path, value: object) -> None:
    encoded = json.dumps(value, ensure_ascii=False, indent=2) + "\n"
    with tempfile.NamedTemporaryFile(
        mode="w",
        encoding="utf-8",
        dir=path.parent,
        prefix=f"{path.name}.",
        suffix=".tmp",
        delete=False,
    ) as temporary_file:
        temporary_file.write(encoded)
        temporary_path = Path(temporary_file.name)
    temporary_path.replace(path)


def main() -> int:
    arguments = parse_arguments()
    project_root = Path(__file__).resolve().parents[1]
    data_directory = project_root / "src" / "data"
    extracted_names_path = data_directory / "extracted-card-names.json"
    cards_path = data_directory / "cards.json"

    try:
        source_records = (
            load_json_file(Path(arguments.source).expanduser().resolve())
            if arguments.source
            else download_source(SOURCE_URL)
        )
        extracted_names = require_complete_id_set(
            load_json_file(extracted_names_path), "id", "Extracted Mod 13 card names"
        )
        source_cards = require_complete_id_set(
            source_records, "cardId", "Upstream cardinfo.json"
        )
        cards, name_differences = merge_cards(extracted_names, source_cards)
        validate_result(cards)

        for card_id, mod_name, source_name, format_only in name_differences:
            difference_type = "format-only" if format_only else "review"
            print(
                f"Name difference [{difference_type}] ID {card_id}: "
                f"Mod 13={mod_name!r}, upstream={source_name!r}"
            )

        write_json_atomically(cards_path, cards)
        monsters = sum(card["type"] not in NON_MONSTER_TYPES for card in cards)
        magic_cards = sum(card["type"] == "Magic" for card in cards)
        trap_cards = sum(card["type"] == "Trap" for card in cards)

        print(f"Cards imported: {len(cards)}")
        print(f"Monsters with ATK/DEF: {monsters}")
        print(f"Magic cards: {magic_cards}")
        print(f"Trap cards: {trap_cards}")
        print("Missing metadata: 0")
        print(f"Name differences: {len(name_differences)}")
        return 0
    except ImportValidationError as error:
        print(f"Card metadata import failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
