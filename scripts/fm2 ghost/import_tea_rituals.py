#!/usr/bin/env python3
"""Normalize unique FM2 Ghost ritual recipes from harvested TEA card data.

Usage:
    python "scripts/fm2 ghost/import_tea_rituals.py"
    python "scripts/fm2 ghost/import_tea_rituals.py" --check
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
DEFAULT_RITUALS_PATH = PROJECT_ROOT / "src" / "data" / "fm2-ghost" / "rituals.json"


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"File not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: {exc}") from exc


def card_reference_id(value: Any, field: str, endpoint_card_id: int) -> int:
    if not isinstance(value, dict):
        raise ValueError(f"Card {endpoint_card_id}: ritual {field} must be an object")
    try:
        return int(value["id"])
    except (KeyError, TypeError, ValueError) as exc:
        raise ValueError(f"Card {endpoint_card_id}: ritual {field} has an invalid ID") from exc


def extract_rituals(raw: Any, card_ids: set[int]) -> list[dict[str, Any]]:
    responses = raw.get("cards") if isinstance(raw, dict) else None
    if not isinstance(responses, dict):
        raise ValueError("Raw TEA data must contain a top-level cards object")

    recipes: dict[tuple[int, int, int, int, int], dict[str, Any]] = {}
    for raw_endpoint_id, response in responses.items():
        try:
            endpoint_card_id = int(raw_endpoint_id)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"Invalid TEA card ID: {raw_endpoint_id!r}") from exc
        if not isinstance(response, dict) or response.get("ok") is not True:
            raise ValueError(f"Card {endpoint_card_id}: TEA response is not marked successful")

        results = response.get("resultados")
        raw_rituals = results.get("ritual") if isinstance(results, dict) else None
        if not isinstance(raw_rituals, list):
            raise ValueError(f"Card {endpoint_card_id}: resultados.ritual must be an array")

        for raw_ritual in raw_rituals:
            ritual_card_id = card_reference_id(raw_ritual.get("Ri"), "Ri", endpoint_card_id)
            material_card_ids = [
                card_reference_id(raw_ritual.get(field), field, endpoint_card_id)
                for field in ("c1", "c2", "c3")
            ]
            result_card_id = card_reference_id(raw_ritual.get("Rf"), "Rf", endpoint_card_id)
            referenced_ids = [ritual_card_id, *material_card_ids, result_card_id]
            unknown_ids = sorted(set(referenced_ids) - card_ids)
            if unknown_ids:
                raise ValueError(f"Card {endpoint_card_id}: ritual references unknown cards {unknown_ids}")
            if endpoint_card_id not in referenced_ids:
                raise ValueError(f"Card {endpoint_card_id}: response contains an unrelated ritual")

            key = (ritual_card_id, *material_card_ids, result_card_id)
            recipes[key] = {
                "ritualCardId": ritual_card_id,
                "materialCardIds": material_card_ids,
                "resultCardId": result_card_id,
            }

    return sorted(
        recipes.values(),
        key=lambda recipe: (
            recipe["resultCardId"],
            recipe["ritualCardId"],
            recipe["materialCardIds"],
        ),
    )


def write_atomically(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_suffix(path.suffix + ".tmp")
    temporary_path.write_text(content, encoding="utf-8")
    temporary_path.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=DEFAULT_RAW_PATH)
    parser.add_argument("--cards", type=Path, default=DEFAULT_CARDS_PATH)
    parser.add_argument("--rituals", type=Path, default=DEFAULT_RITUALS_PATH)
    parser.add_argument("--check", action="store_true", help="validate rituals.json without writing")
    args = parser.parse_args()

    try:
        cards = load_json(args.cards)
        if not isinstance(cards, list):
            raise ValueError("cards.json must contain a JSON array")
        card_ids = {int(card["id"]) for card in cards}
        rituals = extract_rituals(load_json(args.raw), card_ids)
        output = json.dumps(rituals, indent=2, ensure_ascii=False) + "\n"
    except (KeyError, TypeError, ValueError) as exc:
        print(f"Error: {exc}")
        return 1

    if args.check:
        try:
            current = args.rituals.read_text(encoding="utf-8")
        except FileNotFoundError:
            current = ""
        if current != output:
            print(f"Out of date: {args.rituals}")
            return 1
        print(f"Up to date: {len(rituals)} ritual recipes")
        return 0

    write_atomically(args.rituals, output)
    print(f"Wrote {len(rituals)} ritual recipes to {args.rituals}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
