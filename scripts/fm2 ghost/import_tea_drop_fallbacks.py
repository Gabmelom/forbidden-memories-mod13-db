#!/usr/bin/env python3
"""Backfill Ghost reward drops that are present in TEA but absent from drops.json.

The workbook remains authoritative for existing rows because it provides exact
fractional weights and unlock conditions. TEA ranks 1, 2, and 3 are used only
when a duelist/card/rank tuple is entirely absent from the workbook output.

Usage:
    python "scripts/fm2 ghost/import_tea_drop_fallbacks.py"
    python "scripts/fm2 ghost/import_tea_drop_fallbacks.py" --check
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


SCRIPT_DIRECTORY = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIRECTORY.parents[1]
DATA_DIRECTORY = PROJECT_ROOT / "src" / "data" / "fm2-ghost"
DEFAULT_RAW_PATH = SCRIPT_DIRECTORY / "tea_getdata_raw.json"
DEFAULT_CARDS_PATH = DATA_DIRECTORY / "cards.json"
DEFAULT_DUELISTS_PATH = DATA_DIRECTORY / "duelists.json"
DEFAULT_DROPS_PATH = DATA_DIRECTORY / "drops.json"
DROP_DENOMINATOR = 2048
TEA_RANK_MAP = {"1": "SA_POW", "2": "BCD", "3": "SA_TEC"}
RANK_ORDER = {"SA_POW": 0, "BCD": 1, "SA_TEC": 2}


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"File not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: {exc}") from exc


def positive_number(value: Any, label: str) -> int | float:
    try:
        parsed = float(str(value).strip())
    except (TypeError, ValueError) as exc:
        raise ValueError(f"Invalid {label}: {value!r}") from exc
    if not 0 < parsed <= DROP_DENOMINATOR:
        raise ValueError(f"{label} must be greater than 0 and at most {DROP_DENOMINATOR}")
    return int(parsed) if parsed.is_integer() else parsed


def drop_key(drop: dict[str, Any]) -> tuple[int, int, str]:
    return int(drop["duelistId"]), int(drop["cardId"]), str(drop["rank"])


def sort_key(drop: dict[str, Any]) -> tuple[int, int, int, int]:
    condition = str(drop.get("condition", ""))
    return (
        int(drop["duelistId"]),
        RANK_ORDER[str(drop["rank"])],
        int(drop["cardId"]),
        1 if "Unlock pool when:" in condition else 0,
    )


def extract_missing_drops(
    raw: Any,
    existing_drops: list[dict[str, Any]],
    card_ids: set[int],
    duelist_ids: set[int],
) -> list[dict[str, Any]]:
    if not isinstance(raw, dict) or not isinstance(raw.get("cards"), dict):
        raise ValueError("Raw TEA data must contain a top-level cards object")

    responses = raw["cards"]
    current_keys = {drop_key(drop) for drop in existing_drops}
    raw_keys: set[tuple[int, int, str]] = set()
    missing: list[dict[str, Any]] = []

    for raw_card_id, response in responses.items():
        try:
            card_id = int(raw_card_id)
        except (TypeError, ValueError) as exc:
            raise ValueError(f"Invalid TEA card ID: {raw_card_id!r}") from exc
        if card_id not in card_ids:
            raise ValueError(f"TEA drop data references unknown card ID {card_id}")
        if not isinstance(response, dict) or response.get("ok") is not True:
            raise ValueError(f"Card {card_id}: TEA response is not marked successful")

        results = response.get("resultados")
        tea_drops = results.get("drop") if isinstance(results, dict) else None
        if not isinstance(tea_drops, list):
            raise ValueError(f"Card {card_id}: resultados.drop must be an array")

        for source in tea_drops:
            if not isinstance(source, dict):
                raise ValueError(f"Card {card_id}: invalid TEA drop row")
            rank = TEA_RANK_MAP.get(str(source.get("rank")))
            if rank is None:
                # TEA rank 0 describes opponent deck contents, not rewards.
                continue
            try:
                duelist_id = int(source.get("id"))
            except (TypeError, ValueError) as exc:
                raise ValueError(f"Card {card_id}: invalid TEA duelist ID {source.get('id')!r}") from exc
            if duelist_id not in duelist_ids:
                raise ValueError(f"Card {card_id}: TEA drop references unknown duelist ID {duelist_id}")

            key = (duelist_id, card_id, rank)
            if key in raw_keys:
                raise ValueError(f"Duplicate TEA reward drop tuple: {key}")
            raw_keys.add(key)
            if key in current_keys:
                continue

            missing.append({
                "duelistId": duelist_id,
                "cardId": card_id,
                "rank": rank,
                "weight": positive_number(source.get("prob"), f"card {card_id} TEA probability weight"),
                "denominator": DROP_DENOMINATOR,
            })

    return sorted(missing, key=sort_key)


def write_atomically(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_suffix(path.suffix + ".tmp")
    temporary_path.write_text(content, encoding="utf-8")
    temporary_path.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=DEFAULT_RAW_PATH)
    parser.add_argument("--cards", type=Path, default=DEFAULT_CARDS_PATH)
    parser.add_argument("--duelists", type=Path, default=DEFAULT_DUELISTS_PATH)
    parser.add_argument("--drops", type=Path, default=DEFAULT_DROPS_PATH)
    parser.add_argument("--check", action="store_true", help="check coverage without writing")
    args = parser.parse_args()

    try:
        cards = load_json(args.cards)
        duelists = load_json(args.duelists)
        existing_drops = load_json(args.drops)
        if not all(isinstance(value, list) for value in (cards, duelists, existing_drops)):
            raise ValueError("Cards, duelists, and drops files must contain JSON arrays")

        card_ids = {int(card["id"]) for card in cards}
        duelist_ids = {int(duelist["id"]) for duelist in duelists}
        missing = extract_missing_drops(load_json(args.raw), existing_drops, card_ids, duelist_ids)
        merged = sorted([*existing_drops, *missing], key=sort_key)
        covered_card_ids = {int(drop["cardId"]) for drop in merged}
        uncovered = sorted(card_ids - covered_card_ids)
        if uncovered:
            raise ValueError(f"Cards still missing reward drop data: {uncovered}")
    except (KeyError, TypeError, ValueError) as exc:
        print(f"Error: {exc}")
        return 1

    if args.check:
        if missing:
            print(f"Out of date: {args.drops} is missing {len(missing)} TEA reward drops")
            return 1
        print(f"Up to date: all {len(card_ids)} cards have reward drop data")
        return 0

    output = json.dumps(merged, indent=2, ensure_ascii=False) + "\n"
    write_atomically(args.drops, output)
    print(f"Added {len(missing)} TEA fallback drops to {args.drops}")
    print(f"Drop coverage: {len(covered_card_ids)} / {len(card_ids)} cards")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
