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
import re
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
NOTE_ORDER = {"wins": 0, "library": 1, "chest": 2, "status": 3}
# The TEA special table omits the two intermediate Kuriboh progression rows,
# which are documented by the Ghost drop guide.
GUIDE_CHEST_REQUIREMENTS = {
    222: [(250, 58)],   # Kiseitai requires Kuriboh
    231: [(250, 222)],  # Little Trooper requires Kiseitai
}


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


def non_negative_integer(value: Any, label: str) -> int:
    try:
        parsed = int(str(value).strip())
    except (TypeError, ValueError) as exc:
        raise ValueError(f"Invalid {label}: {value!r}") from exc
    if parsed < 0:
        raise ValueError(f"{label} must not be negative")
    return parsed


def note(note_type: str, label: str, detail: str) -> dict[str, str]:
    return {"type": note_type, "label": label, "detail": detail}


def parse_unlock_requirement(text: str) -> dict[str, str]:
    if match := re.fullmatch(r"At least (\d+) wins", text, flags=re.IGNORECASE):
        wins = int(match.group(1))
        return note("wins", f"{wins} wins", f"Requires at least {wins} total wins before this drop is unlocked.")
    if match := re.fullmatch(r"No (.+) in trunk", text, flags=re.IGNORECASE):
        card_name = match.group(1)
        return note("chest", f"Chest: no {card_name}", f"Requires no {card_name} in the chest.")
    if match := re.fullmatch(r"At least (\d+) (.+) in trunk(?: \(yes, really\))?", text, flags=re.IGNORECASE):
        quantity, card_name = int(match.group(1)), match.group(2)
        return note("chest", f"Chest: {quantity}× {card_name}", f"Requires at least {quantity} {card_name} in the chest.")
    if match := re.fullmatch(r"Less than (\d+) (.+) in trunk", text, flags=re.IGNORECASE):
        quantity, card_name = int(match.group(1)), match.group(2)
        return note("chest", f"Chest: <{quantity}× {card_name}", f"Requires fewer than {quantity} {card_name} in the chest.")
    if match := re.fullmatch(r"Have (.+) in library", text, flags=re.IGNORECASE):
        card_name = match.group(1)
        return note("library", f"Library: {card_name}", f"Requires {card_name} to be registered in the Library.")
    return note("status", text, text)


def notes_from_condition(condition: str | None) -> list[dict[str, str]]:
    if not condition:
        return []

    notes: list[dict[str, str]] = []
    if match := re.search(r"Requires at least (\d+) wins", condition, flags=re.IGNORECASE):
        wins = int(match.group(1))
        notes.append(note("wins", f"{wins} wins", f"Requires at least {wins} total wins before this card can drop."))
    if re.search(r"Requires this card to already be in the library", condition, flags=re.IGNORECASE):
        notes.append(note("library", "Library", "This card must already be registered in the Library before it can drop."))
    if "Kuriboh POW questline" in condition:
        notes.append(note("chest", "Chest progression", condition))

    if "Unlock pool when:" in condition:
        requirements = condition.split("Unlock pool when:", 1)[1]
        notes.extend(parse_unlock_requirement(part.strip()) for part in requirements.split(";") if part.strip())
    elif "Default pool only; replaced when unlock requirements are met:" in condition:
        requirements = condition.split("Default pool only; replaced when unlock requirements are met:", 1)[1]
        notes.append(note("status", "Before unlock", f"This drop is replaced when: {requirements}."))
    elif "Default pool weight; changes when unlock requirements are met:" in condition:
        requirements = condition.split("Default pool weight; changes when unlock requirements are met:", 1)[1]
        notes.append(note("status", "Rate changes", f"This is the default rate; it changes when: {requirements}."))
    return notes


def extract_special_notes(raw: Any, card_names: dict[int, str]) -> dict[int, list[dict[str, str]]]:
    responses = raw.get("cards") if isinstance(raw, dict) else None
    if not isinstance(responses, dict):
        raise ValueError("Raw TEA data must contain a top-level cards object")

    notes_by_card: dict[int, list[dict[str, str]]] = {}
    for raw_card_id, response in responses.items():
        card_id = int(raw_card_id)
        results = response.get("resultados") if isinstance(response, dict) else None
        specials = results.get("special") if isinstance(results, dict) else None
        if specials is False:
            specials = []
        if not isinstance(specials, list):
            raise ValueError(f"Card {card_id}: resultados.special must be an array")
        if not specials:
            continue
        if len(specials) != 1 or not isinstance(specials[0], dict):
            raise ValueError(f"Card {card_id}: expected one TEA special-requirement object")

        special = specials[0]
        embedded_card_id = non_negative_integer(special.get("carta"), f"card {card_id} special card ID")
        if embedded_card_id != card_id:
            raise ValueError(f"Card {card_id}: special requirement references card {embedded_card_id}")

        card_notes: list[dict[str, str]] = []
        wins = non_negative_integer(special.get("victorias"), f"card {card_id} victories")
        if wins:
            card_notes.append(note("wins", f"{wins} wins", f"Requires at least {wins} total wins before this card can drop."))

        ritual = non_negative_integer(special.get("ritual"), f"card {card_id} ritual flag")
        library = non_negative_integer(special.get("library"), f"card {card_id} library flag")
        if ritual or library:
            card_notes.append(note(
                "library",
                "Library",
                "This card must already be registered in the Library before it can drop; buying, ritual-summoning, or fusing it can register it.",
            ))

        chest = non_negative_integer(special.get("chest"), f"card {card_id} chest flag")
        if chest:
            quantities = [part.strip() for part in str(special.get("q", "")).split(",") if part.strip() and part.strip() != "0"]
            required_ids = [part.strip() for part in str(special.get("r", "")).split(",") if part.strip() and part.strip() != "0"]
            if len(quantities) != len(required_ids) or not required_ids:
                raise ValueError(f"Card {card_id}: invalid TEA chest quantities/card IDs")
            for raw_quantity, raw_required_id in zip(quantities, required_ids, strict=True):
                quantity = non_negative_integer(raw_quantity, f"card {card_id} chest quantity")
                required_id = non_negative_integer(raw_required_id, f"card {card_id} chest card ID")
                required_name = card_names.get(required_id)
                if not required_name:
                    raise ValueError(f"Card {card_id}: chest requirement references unknown card {required_id}")
                card_notes.append(note(
                    "chest",
                    f"Chest: {quantity}× {required_name}",
                    f"Requires at least {quantity} {required_name} in the chest.",
                ))
        notes_by_card[card_id] = card_notes

    for card_id, requirements in GUIDE_CHEST_REQUIREMENTS.items():
        card_notes = notes_by_card.setdefault(card_id, [])
        for quantity, required_id in requirements:
            required_name = card_names[required_id]
            card_notes.append(note(
                "chest",
                f"Chest: {quantity}× {required_name}",
                f"Requires at least {quantity} {required_name} in the chest before this card can drop.",
            ))
    return notes_by_card


def merge_notes(drop: dict[str, Any], special_notes: list[dict[str, str]]) -> dict[str, Any]:
    condition_notes = notes_from_condition(drop.get("condition"))
    merged_notes = list(condition_notes)

    for special_note in special_notes:
        # Row-specific workbook thresholds take precedence over the card-level
        # TEA threshold when the guides disagree (for example 2988 vs 3000 wins).
        if special_note["type"] == "wins" and any(item["type"] == "wins" for item in condition_notes):
            continue
        if special_note["type"] == "library" and any(
            item["type"] == "library" and item["label"] == "Library" for item in condition_notes
        ):
            continue
        if any(
            item["type"] == special_note["type"] and item["label"] == special_note["label"]
            for item in merged_notes
        ):
            continue
        merged_notes.append(special_note)

    normalized = {key: value for key, value in drop.items() if key != "notes"}
    if merged_notes:
        normalized["notes"] = sorted(
            merged_notes,
            key=lambda item: (NOTE_ORDER[item["type"]], item["label"]),
        )
    return normalized


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
        card_names = {int(card["id"]): str(card["name"]) for card in cards}
        duelist_ids = {int(duelist["id"]) for duelist in duelists}
        raw = load_json(args.raw)
        missing = extract_missing_drops(raw, existing_drops, card_ids, duelist_ids)
        special_notes = extract_special_notes(raw, card_names)
        merged = sorted(
            [merge_notes(drop, special_notes.get(int(drop["cardId"]), [])) for drop in [*existing_drops, *missing]],
            key=sort_key,
        )
        covered_card_ids = {int(drop["cardId"]) for drop in merged}
        uncovered = sorted(card_ids - covered_card_ids)
        if uncovered:
            raise ValueError(f"Cards still missing reward drop data: {uncovered}")
    except (KeyError, TypeError, ValueError) as exc:
        print(f"Error: {exc}")
        return 1

    if args.check:
        expected_output = json.dumps(merged, indent=2, ensure_ascii=False) + "\n"
        current_output = json.dumps(existing_drops, indent=2, ensure_ascii=False) + "\n"
        if expected_output != current_output:
            print(f"Out of date: {args.drops} is missing TEA reward drops or notes")
            return 1
        print(f"Up to date: all {len(card_ids)} cards have reward drop data and normalized notes")
        return 0

    output = json.dumps(merged, indent=2, ensure_ascii=False) + "\n"
    write_atomically(args.drops, output)
    print(f"Added {len(missing)} TEA fallback drops to {args.drops}")
    print(f"Drop coverage: {len(covered_card_ids)} / {len(card_ids)} cards")
    print(f"Drop rows with notes: {sum(bool(drop.get('notes')) for drop in merged)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
