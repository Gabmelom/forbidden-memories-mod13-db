#!/usr/bin/env python3
"""Normalize FM2 Ghost fusion recipes from harvested TEA data.

Usage:
    python "scripts/fm2 ghost/import_tea_fusions.py"
    python "scripts/fm2 ghost/import_tea_fusions.py" --check
"""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path
from typing import Any


SCRIPT_DIRECTORY = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIRECTORY.parents[1]
DEFAULT_RAW_PATH = SCRIPT_DIRECTORY / "tea_getdata_raw.json"
DEFAULT_CARDS_PATH = PROJECT_ROOT / "src" / "data" / "fm2-ghost" / "cards.json"
DEFAULT_FUSIONS_PATH = PROJECT_ROOT / "src" / "data" / "fm2-ghost" / "fusions.json"


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"File not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: {exc}") from exc


def parse_card_id(value: Any, context: str, card_ids: set[int]) -> int:
    try:
        card_id = int(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{context}: invalid card ID {value!r}") from exc
    if card_id not in card_ids:
        raise ValueError(f"{context}: references unknown card ID {card_id}")
    return card_id


def extract_fusions(raw: Any, card_ids: set[int]) -> list[dict[str, Any]]:
    responses = raw.get("cards") if isinstance(raw, dict) else None
    if not isinstance(responses, dict):
        raise ValueError("Raw TEA data must contain a top-level cards object")

    recipes: set[tuple[int, int, int]] = set()
    for raw_card_id, response in responses.items():
        card_id = parse_card_id(raw_card_id, "TEA response", card_ids)
        if not isinstance(response, dict) or response.get("ok") is not True:
            raise ValueError(f"Card {card_id}: TEA response is not marked successful")

        results = response.get("resultados")
        raw_fusions = results.get("fusion") if isinstance(results, dict) else None
        if not isinstance(raw_fusions, list):
            raise ValueError(f"Card {card_id}: resultados.fusion must be an array")

        for row_number, raw_fusion in enumerate(raw_fusions, start=1):
            if not isinstance(raw_fusion, dict):
                raise ValueError(f"Card {card_id}: invalid fusion row {row_number}")
            try:
                first_value = raw_fusion["c1"]["Numero"]
                second_value = raw_fusion["c2"]["Numero"]
                result_value = raw_fusion["f"]["Numero"]
            except (KeyError, TypeError) as exc:
                raise ValueError(f"Card {card_id}: fusion row {row_number} is missing a card ID") from exc

            first_id = parse_card_id(first_value, f"Card {card_id} fusion row {row_number} material 1", card_ids)
            second_id = parse_card_id(second_value, f"Card {card_id} fusion row {row_number} material 2", card_ids)
            result_id = parse_card_id(result_value, f"Card {card_id} fusion row {row_number} result", card_ids)
            material_1, material_2 = sorted((first_id, second_id))
            recipes.add((material_1, material_2, result_id))

    pairs_by_result: dict[int, list[tuple[int, int]]] = defaultdict(list)
    for material_1, material_2, result_id in sorted(recipes, key=lambda recipe: (recipe[2], recipe[0], recipe[1])):
        pairs_by_result[result_id].append((material_1, material_2))

    return [
        {
            "resultCardId": result_id,
            "materialCardPairs": [list(pair) for pair in material_pairs],
        }
        for result_id, material_pairs in sorted(pairs_by_result.items())
    ]


def write_atomically(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_suffix(path.suffix + ".tmp")
    temporary_path.write_text(content, encoding="utf-8")
    temporary_path.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=DEFAULT_RAW_PATH)
    parser.add_argument("--cards", type=Path, default=DEFAULT_CARDS_PATH)
    parser.add_argument("--fusions", type=Path, default=DEFAULT_FUSIONS_PATH)
    parser.add_argument("--check", action="store_true", help="validate fusions.json without writing")
    args = parser.parse_args()

    try:
        cards = load_json(args.cards)
        if not isinstance(cards, list):
            raise ValueError("cards.json must contain a JSON array")
        card_ids = {int(card["id"]) for card in cards}
        fusions = extract_fusions(load_json(args.raw), card_ids)
        output = json.dumps(fusions, indent=2, ensure_ascii=False) + "\n"
    except (KeyError, TypeError, ValueError) as exc:
        print(f"Error: {exc}")
        return 1

    recipe_count = sum(len(group["materialCardPairs"]) for group in fusions)
    if args.check:
        try:
            current = args.fusions.read_text(encoding="utf-8")
        except FileNotFoundError:
            current = ""
        if current != output:
            print(f"Out of date: {args.fusions}")
            return 1
        print(f"Up to date: {recipe_count} fusion recipes for {len(fusions)} result cards")
        return 0

    write_atomically(args.fusions, output)
    print(f"Wrote {recipe_count} fusion recipes for {len(fusions)} result cards to {args.fusions}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
