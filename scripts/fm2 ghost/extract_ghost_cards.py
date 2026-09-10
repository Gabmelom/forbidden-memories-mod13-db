#!/usr/bin/env python3
"""Extract FM2 Ghost card master data from the "Cards List" worksheet.

Usage:
    python extract_ghost_cards.py "Forbidden Memories 2 v1.3.4 data dump.xlsx" cards.json

The spreadsheet is treated as the source of truth. Fields not present in the
Cards List worksheet are emitted as null so they can be filled from a later,
Ghost-specific source without inventing data.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

from openpyxl import load_workbook

SHEET_NAME = "Cards List"
EXPECTED_HEADERS = ["Card ID", "Name", "Password", "Cost"]


def int_or_none(value: Any) -> int | None:
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        raise ValueError(f"Unexpected boolean numeric value: {value!r}")
    number = int(value)
    if float(value) != number:
        raise ValueError(f"Expected an integer value, got {value!r}")
    return number


def password_or_none(value: Any) -> str | None:
    number = int_or_none(value)
    if number is None:
        return None
    # The worksheet formats this column as 00000000. Preserve leading zeros
    # explicitly in JSON by storing passwords as strings.
    return f"{number:08d}"


def extract_cards(workbook_path: Path) -> list[dict[str, Any]]:
    wb = load_workbook(workbook_path, data_only=True, read_only=True)
    if SHEET_NAME not in wb.sheetnames:
        raise ValueError(
            f"Worksheet {SHEET_NAME!r} not found. Available sheets: {wb.sheetnames}"
        )

    ws = wb[SHEET_NAME]
    headers = [ws.cell(1, col).value for col in range(1, 5)]
    if headers != EXPECTED_HEADERS:
        raise ValueError(
            f"Unexpected headers in {SHEET_NAME!r}: {headers!r}; "
            f"expected {EXPECTED_HEADERS!r}"
        )

    cards: list[dict[str, Any]] = []
    seen_ids: set[int] = set()
    seen_names: set[str] = set()

    for row_number, row in enumerate(
        ws.iter_rows(min_row=2, max_col=4, values_only=True), start=2
    ):
        raw_id, raw_name, raw_password, raw_cost = row

        if all(value is None for value in row):
            continue

        card_id = int_or_none(raw_id)
        if card_id is None:
            raise ValueError(f"Missing Card ID on worksheet row {row_number}")

        if raw_name is None or not str(raw_name).strip():
            raise ValueError(f"Missing card name on worksheet row {row_number}")
        name = str(raw_name).strip()

        if card_id in seen_ids:
            raise ValueError(f"Duplicate Card ID {card_id} on worksheet row {row_number}")
        if name in seen_names:
            raise ValueError(f"Duplicate card name {name!r} on worksheet row {row_number}")
        seen_ids.add(card_id)
        seen_names.add(name)

        cards.append(
            {
                "id": card_id,
                "name": name,
                "type": None,
                "atk": None,
                "def": None,
                "attribute": None,
                "level": None,
                "guardianStar1": None,
                "guardianStar2": None,
                "password": password_or_none(raw_password),
                "cost": int_or_none(raw_cost),
                "description": None,
                "hasEffect": None,
            }
        )

    cards.sort(key=lambda card: card["id"])

    expected_ids = list(range(1, len(cards) + 1))
    actual_ids = [card["id"] for card in cards]
    if actual_ids != expected_ids:
        raise ValueError(
            "Card IDs are not contiguous starting at 1. "
            f"Expected 1..{len(cards)}."
        )

    return cards


def main() -> int:
    if len(sys.argv) not in (2, 3):
        print("Usage: python extract_ghost_cards.py <workbook.xlsx> [cards.json]")
        return 1

    workbook_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2]) if len(sys.argv) == 3 else Path("cards.json")

    if not workbook_path.is_file():
        print(f"Error: workbook not found: {workbook_path}")
        return 1

    try:
        cards = extract_cards(workbook_path)
    except Exception as exc:
        print(f"Error: {exc}")
        return 1

    output_path.write_text(
        json.dumps(cards, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    missing_passwords = [card for card in cards if card["password"] is None]
    missing_costs = [card for card in cards if card["cost"] is None]

    print(f"Wrote {len(cards)} cards to {output_path}")
    print(f"Card ID range: {cards[0]['id']}..{cards[-1]['id']}")
    print(f"Missing passwords: {len(missing_passwords)}")
    print(f"Missing costs: {len(missing_costs)}")
    if missing_passwords:
        print("Cards missing password/cost:")
        for card in missing_passwords:
            print(f"  {card['id']:3d}  {card['name']}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
