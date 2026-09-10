#!/usr/bin/env python3
"""Merge normalized TEA metadata into the FM2 Ghost cards dataset.

The existing cards.json remains authoritative for card IDs and names because it
comes from the Ghost data-dump workbook. TEA metadata is joined by numeric ID.

Usage:
    python "scripts/fm2 ghost/import_tea_card_metadata.py"
    python "scripts/fm2 ghost/import_tea_card_metadata.py" --check
    python "scripts/fm2 ghost/import_tea_card_metadata.py" --raw path/to/raw.json
"""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path
from typing import Any


SCRIPT_DIRECTORY = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIRECTORY.parents[1]
DEFAULT_RAW_PATH = SCRIPT_DIRECTORY / "tea_getdata_raw.json"
DEFAULT_CARDS_PATH = PROJECT_ROOT / "src" / "data" / "fm2-ghost" / "cards.json"

EXPECTED_CARD_IDS = set(range(1, 723))
REQUIRED_TEA_FIELDS = {
    "Numero",
    "Nombre",
    "Atk",
    "Def",
    "St1",
    "St2",
    "Tipo",
    "Password",
    "Precio",
    "Comentario",
    "Color",
}
UNAVAILABLE_PASSWORD = "FFFFFFFE"
EFFECT_MARKER = re.compile(r"<Effect(?:\s+[12])?>", re.IGNORECASE)
FONT_TAG = re.compile(r"</?font\b[^>]*>", re.IGNORECASE)


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"File not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: {exc}") from exc


def integer(value: Any, field: str, card_id: int) -> int:
    if isinstance(value, bool):
        raise ValueError(f"Card {card_id}: {field} must be an integer, got boolean")
    try:
        parsed = int(str(value).strip())
    except (TypeError, ValueError) as exc:
        raise ValueError(f"Card {card_id}: invalid {field} value {value!r}") from exc
    return parsed


def optional_integer(value: Any, field: str, card_id: int) -> int | None:
    if value is None or str(value).strip() in {"", "-"}:
        return None
    return integer(value, field, card_id)


def optional_text(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return None if text in {"", "-"} else text


def normalize_password(value: Any, card_id: int) -> str | None:
    password = optional_text(value)
    if password is None or password.upper() == UNAVAILABLE_PASSWORD:
        return None
    if not re.fullmatch(r"\d{8}", password):
        raise ValueError(
            f"Card {card_id}: password must contain exactly eight digits, got {password!r}"
        )
    return password


def normalize_cost(value: Any, card_id: int) -> int | None:
    return optional_integer(value, "Precio", card_id)


def normalize_description(value: Any) -> tuple[str | None, bool | None]:
    source = optional_text(value)
    if source is None:
        return None, None

    has_effect = bool(EFFECT_MARKER.search(source))
    # Preserve the text while converting TEA's presentation markup into readable
    # plain text. Numbered effect markers remain meaningful labels.
    description = re.sub(
        r"<Effect\s+([12])>\s*(?:-\s*)?",
        r"Effect \1: ",
        source,
        flags=re.IGNORECASE,
    )
    description = re.sub(
        r"<Effect>\s*(?:-\s*)?",
        "Effect: ",
        description,
        flags=re.IGNORECASE,
    )
    description = FONT_TAG.sub("", description)
    description = html.unescape(description)
    description = re.sub(r"\s+", " ", description).strip()
    return description or None, has_effect


def validate_existing_cards(value: Any) -> list[dict[str, Any]]:
    if not isinstance(value, list):
        raise ValueError("Ghost cards.json must contain a JSON array")
    if not all(isinstance(card, dict) for card in value):
        raise ValueError("Every Ghost card must be a JSON object")

    ids = [card.get("id") for card in value]
    if len(ids) != 722 or set(ids) != EXPECTED_CARD_IDS or len(set(ids)) != len(ids):
        raise ValueError("Ghost cards.json must contain each card ID from 1 through 722 once")
    for card in value:
        if not isinstance(card.get("name"), str) or not card["name"].strip():
            raise ValueError(f"Card {card.get('id')}: missing canonical name")
    return sorted(value, key=lambda card: card["id"])


def extract_tea_cards(value: Any) -> tuple[dict[int, dict[str, Any]], list[int]]:
    if not isinstance(value, dict) or not isinstance(value.get("cards"), dict):
        raise ValueError("Raw TEA data must contain a top-level cards object")

    responses = value["cards"]
    try:
        response_ids = {int(key) for key in responses}
    except (TypeError, ValueError) as exc:
        raise ValueError("Raw TEA cards keys must be numeric IDs") from exc
    if response_ids != EXPECTED_CARD_IDS:
        missing = sorted(EXPECTED_CARD_IDS - response_ids)
        extra = sorted(response_ids - EXPECTED_CARD_IDS)
        raise ValueError(f"Raw TEA responses must cover IDs 1..722; missing={missing}, extra={extra}")

    cards_by_id: dict[int, dict[str, Any]] = {}
    missing_metadata: list[int] = []
    for card_id in sorted(response_ids):
        response = responses[str(card_id)]
        if not isinstance(response, dict) or response.get("ok") is not True:
            raise ValueError(f"Card {card_id}: TEA response is not marked successful")
        results = response.get("resultados")
        tea_card = results.get("card") if isinstance(results, dict) else None
        if tea_card is None:
            missing_metadata.append(card_id)
            continue
        if not isinstance(tea_card, dict):
            raise ValueError(f"Card {card_id}: resultados.card must be an object or null")
        missing_fields = sorted(REQUIRED_TEA_FIELDS - set(tea_card))
        if missing_fields:
            raise ValueError(f"Card {card_id}: missing TEA fields {missing_fields}")
        embedded_id = integer(tea_card["Numero"], "Numero", card_id)
        if embedded_id != card_id:
            raise ValueError(
                f"Card response {card_id}: embedded Numero is {embedded_id}"
            )
        if embedded_id in cards_by_id:
            raise ValueError(f"Duplicate TEA card metadata for ID {embedded_id}")
        cards_by_id[embedded_id] = tea_card

    return cards_by_id, missing_metadata


def merge_cards(
    existing_cards: list[dict[str, Any]],
    tea_cards: dict[int, dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[tuple[int, str, str]]]:
    merged_cards: list[dict[str, Any]] = []
    name_differences: list[tuple[int, str, str]] = []

    for existing in existing_cards:
        card_id = existing["id"]
        source = tea_cards.get(card_id)
        if source is None:
            merged_cards.append({**existing, "color": existing.get("color")})
            continue

        raw_name = optional_text(source["Nombre"])
        if raw_name is None:
            raise ValueError(f"Card {card_id}: TEA Nombre is empty")
        if raw_name != existing["name"]:
            name_differences.append((card_id, existing["name"], raw_name))

        password = normalize_password(source["Password"], card_id)
        description, has_effect = normalize_description(source["Comentario"])
        merged_cards.append(
            {
                **existing,
                # IDs and names deliberately remain sourced from the Ghost workbook.
                "type": optional_text(source["Tipo"]),
                "atk": optional_integer(source["Atk"], "Atk", card_id),
                "def": optional_integer(source["Def"], "Def", card_id),
                "guardianStar1": optional_text(source["St1"]),
                "guardianStar2": optional_text(source["St2"]),
                "password": password,
                "cost": normalize_cost(source["Precio"], card_id),
                "description": description,
                "hasEffect": has_effect,
                "color": optional_integer(source["Color"], "Color", card_id),
            }
        )

    return merged_cards, name_differences


def serialized(cards: list[dict[str, Any]]) -> str:
    return json.dumps(cards, indent=2, ensure_ascii=False) + "\n"


def write_atomically(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_suffix(path.suffix + ".tmp")
    temporary_path.write_text(content, encoding="utf-8")
    temporary_path.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=DEFAULT_RAW_PATH)
    parser.add_argument("--cards", type=Path, default=DEFAULT_CARDS_PATH)
    parser.add_argument(
        "--check",
        action="store_true",
        help="validate that cards.json already matches the imported result without writing",
    )
    args = parser.parse_args()

    try:
        existing_cards = validate_existing_cards(load_json(args.cards))
        tea_cards, missing_metadata = extract_tea_cards(load_json(args.raw))
        merged_cards, name_differences = merge_cards(existing_cards, tea_cards)
        output = serialized(merged_cards)
    except ValueError as exc:
        print(f"Error: {exc}")
        return 1

    current_output = serialized(existing_cards)
    if args.check:
        if output != current_output:
            print(f"Out of date: {args.cards}")
            print('Run the importer without --check to update it.')
            return 1
        print(f"Up to date: {args.cards}")
    else:
        write_atomically(args.cards, output)
        print(f"Wrote {len(merged_cards)} cards to {args.cards}")

    print(f"Imported TEA metadata: {len(tea_cards)} cards")
    print(f"Missing TEA card metadata: {missing_metadata or 'none'}")
    print(f"Canonical names preserved despite TEA differences: {len(name_differences)}")
    print(f"Descriptions populated: {sum(card.get('description') is not None for card in merged_cards)}")
    print(f"Effect cards identified: {sum(card.get('hasEffect') is True for card in merged_cards)}")
    if name_differences:
        for card_id, canonical_name, tea_name in name_differences:
            print(f"  {card_id:3d}: {canonical_name!r} (TEA: {tea_name!r})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
