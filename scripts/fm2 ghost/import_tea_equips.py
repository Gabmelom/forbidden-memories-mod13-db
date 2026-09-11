#!/usr/bin/env python3
"""Normalize FM2 Ghost equip-card compatibility from harvested TEA data.

Usage:
    python "scripts/fm2 ghost/import_tea_equips.py"
    python "scripts/fm2 ghost/import_tea_equips.py" --check
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


SCRIPT_DIRECTORY = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIRECTORY.parents[1]
DEFAULT_RAW_PATH = SCRIPT_DIRECTORY / "tea_getdata_raw.json"
DEFAULT_CARDS_PATH = PROJECT_ROOT / "src" / "data" / "fm2-ghost" / "cards.json"
DEFAULT_EQUIPS_PATH = PROJECT_ROOT / "src" / "data" / "fm2-ghost" / "equips.json"


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"File not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: {exc}") from exc


def extract_equips(raw: Any, card_ids: set[int]) -> list[dict[str, Any]]:
    responses = raw.get("cards") if isinstance(raw, dict) else None
    if not isinstance(responses, dict):
        raise ValueError("Raw TEA data must contain a top-level cards object")

    compatibility: list[dict[str, Any]] = []
    for raw_card_id, response in responses.items():
        try:
            card_id = int(raw_card_id)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"Invalid TEA card ID: {raw_card_id!r}") from exc
        if card_id not in card_ids:
            raise ValueError(f"TEA equip data references unknown card ID {card_id}")
        if not isinstance(response, dict) or response.get("ok") is not True:
            raise ValueError(f"Card {card_id}: TEA response is not marked successful")

        results = response.get("resultados")
        raw_equips = results.get("equipos") if isinstance(results, dict) else None
        if raw_equips is False:
            raw_equips = []
        if not isinstance(raw_equips, list):
            raise ValueError(f"Card {card_id}: resultados.equipos must be an array")

        equip_ids: list[int] = []
        for raw_equip in raw_equips:
            if not isinstance(raw_equip, dict):
                raise ValueError(f"Card {card_id}: invalid TEA equip row")
            try:
                equip_id = int(raw_equip["id"])
            except (KeyError, TypeError, ValueError) as exc:
                raise ValueError(f"Card {card_id}: equip row has an invalid card ID") from exc
            if equip_id not in card_ids:
                raise ValueError(f"Card {card_id}: equip row references unknown card {equip_id}")
            if equip_id in equip_ids:
                raise ValueError(f"Card {card_id}: duplicate compatible equip card {equip_id}")
            equip_ids.append(equip_id)

        if equip_ids:
            compatibility.append({"cardId": card_id, "equipCardIds": sorted(equip_ids)})

    return sorted(compatibility, key=lambda item: item["cardId"])


def write_atomically(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_suffix(path.suffix + ".tmp")
    temporary_path.write_text(content, encoding="utf-8")
    temporary_path.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=DEFAULT_RAW_PATH)
    parser.add_argument("--cards", type=Path, default=DEFAULT_CARDS_PATH)
    parser.add_argument("--equips", type=Path, default=DEFAULT_EQUIPS_PATH)
    parser.add_argument("--check", action="store_true", help="validate equips.json without writing")
    args = parser.parse_args()

    try:
        cards = load_json(args.cards)
        if not isinstance(cards, list):
            raise ValueError("cards.json must contain a JSON array")
        card_ids = {int(card["id"]) for card in cards}
        equips = extract_equips(load_json(args.raw), card_ids)
        output = json.dumps(equips, indent=2, ensure_ascii=False) + "\n"
    except (KeyError, TypeError, ValueError) as exc:
        print(f"Error: {exc}")
        return 1

    if args.check:
        try:
            current = args.equips.read_text(encoding="utf-8")
        except FileNotFoundError:
            current = ""
        if current != output:
            print(f"Out of date: {args.equips}")
            return 1
        print(f"Up to date: {len(equips)} cards with compatible equips")
        return 0

    write_atomically(args.equips, output)
    relation_count = sum(len(item["equipCardIds"]) for item in equips)
    print(f"Wrote {relation_count} equip relations for {len(equips)} cards to {args.equips}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
