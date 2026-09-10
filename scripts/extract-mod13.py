#!/usr/bin/env python3
"""Extract Mod 13 card names, duelists, and drop weights to app JSON.

The binary layout follows the public fm-drop-extractor implementation, but
this exporter and its validation/output format are specific to this project.
"""

from __future__ import annotations

import json
import re
import struct
import sys
import unicodedata
from collections import Counter
from pathlib import Path
from typing import Final


CARD_COUNT: Final = 722
DUELIST_COUNT: Final = 39
DROP_DENOMINATOR: Final = 2048

SLUS_CARD_POINTER_TABLE: Final = 0x1C6002
SLUS_DUELIST_POINTER_TABLE: Final = 0x1C6652
SLUS_TEXT_BASE: Final = 0x1C6800
SLUS_POINTER_BIAS: Final = 0x6000

MRG_FIRST_DUELIST_BLOCK: Final = 0xE9B000
MRG_DUELIST_BLOCK_SIZE: Final = 0x1800
MRG_POOL_OFFSETS: Final = (
    ("SA_POW", 0x5B4),
    ("BCD", 0xB68),
    ("SA_TEC", 0x111C),
)

CHAR_MAP: Final = {
    0x18: "A", 0x2D: "B", 0x2B: "C", 0x20: "D", 0x25: "E", 0x31: "F",
    0x29: "G", 0x23: "H", 0x1A: "I", 0x3B: "J", 0x33: "K", 0x2A: "L",
    0x1E: "M", 0x2C: "N", 0x21: "O", 0x2F: "P", 0x3E: "Q", 0x26: "R",
    0x1D: "S", 0x1C: "T", 0x35: "U", 0x39: "V", 0x22: "W", 0x46: "X",
    0x24: "Y", 0x3F: "Z", 0x03: "a", 0x15: "b", 0x0F: "c", 0x0C: "d",
    0x01: "e", 0x13: "f", 0x10: "g", 0x09: "h", 0x05: "i", 0x34: "j",
    0x16: "k", 0x0A: "l", 0x0E: "m", 0x06: "n", 0x04: "o", 0x14: "p",
    0x37: "q", 0x08: "r", 0x07: "s", 0x02: "t", 0x0D: "u", 0x19: "v",
    0x12: "w", 0x36: "x", 0x11: "y", 0x32: "z", 0x38: "0", 0x3D: "1",
    0x3A: "2", 0x41: "3", 0x4A: "4", 0x42: "5", 0x4E: "6", 0x45: "7",
    0x57: "8", 0x59: "9", 0x00: " ", 0x30: "-", 0x3C: "#", 0x43: "&",
    0x0B: ".", 0x1F: ",", 0x17: "!", 0x1B: "'", 0x27: "<", 0x28: ">",
    0x2E: "?", 0x44: "/", 0x48: ":", 0x4B: ")", 0x4C: "(", 0x4F: "$",
    0x50: "*", 0x51: ">", 0x54: "<", 0x40: '"', 0x56: "+", 0x5B: "%",
}


class ExtractionError(RuntimeError):
    """Raised when source data is missing, truncated, or invalid."""


def read_u16(data: bytes, offset: int, source_name: str) -> int:
    if offset < 0 or offset + 2 > len(data):
        raise ExtractionError(
            f"{source_name} is too short to read a 16-bit value at 0x{offset:X}"
        )
    return struct.unpack_from("<H", data, offset)[0]


def decode_game_text(data: bytes, offset: int, source_name: str) -> str:
    decoded: list[str] = []
    position = offset
    while position < len(data):
        value = data[position]
        if value == 0xFF:
            return "".join(decoded).rstrip()
        decoded.append(CHAR_MAP.get(value, f"[{value:02x}]"))
        position += 1
    raise ExtractionError(
        f"{source_name} contains unterminated text beginning at 0x{offset:X}"
    )


def extract_names(
    slus_data: bytes,
    table_offset: int,
    count: int,
    label: str,
) -> list[str]:
    names: list[str] = []
    for index in range(count):
        pointer = read_u16(slus_data, table_offset + index * 2, "SLUS_014.11")
        text_offset = SLUS_TEXT_BASE + pointer - SLUS_POINTER_BIAS
        name = decode_game_text(slus_data, text_offset, "SLUS_014.11")
        if not name:
            raise ExtractionError(f"Extracted an empty {label} name at game index {index + 1}")
        names.append(name)
    return names


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", ascii_value))


def extract_drop_records(
    mrg_data: bytes,
    duelist_names: list[str],
) -> tuple[list[dict[str, int | str]], Counter[str], list[str]]:
    records: list[dict[str, int | str]] = []
    rank_counts: Counter[str] = Counter()
    pool_errors: list[str] = []

    for duelist_index, duelist_name in enumerate(duelist_names):
        duelist_id = duelist_index + 1
        block_offset = MRG_FIRST_DUELIST_BLOCK + MRG_DUELIST_BLOCK_SIZE * duelist_index
        for rank, pool_offset in MRG_POOL_OFFSETS:
            weights = [
                read_u16(
                    mrg_data,
                    block_offset + pool_offset + card_index * 2,
                    "WA_MRG.MRG",
                )
                for card_index in range(CARD_COUNT)
            ]
            invalid_weights = [weight for weight in weights if weight > DROP_DENOMINATOR]
            if invalid_weights:
                pool_errors.append(
                    f"{duelist_name} (ID {duelist_id}) {rank}: "
                    f"found {len(invalid_weights)} weight(s) above {DROP_DENOMINATOR}"
                )

            total_weight = sum(weights)
            if total_weight != DROP_DENOMINATOR:
                pool_errors.append(
                    f"{duelist_name} (ID {duelist_id}) {rank}: "
                    f"total weight is {total_weight}, expected {DROP_DENOMINATOR}"
                )

            for card_index, weight in enumerate(weights):
                if weight == 0:
                    continue
                records.append(
                    {
                        "duelistId": duelist_id,
                        "cardId": card_index + 1,
                        "rank": rank,
                        "weight": weight,
                    }
                )
                rank_counts[rank] += 1

    records.sort(
        key=lambda row: (
            int(row["duelistId"]),
            str(row["rank"]),
            int(row["cardId"]),
        )
    )
    return records, rank_counts, pool_errors


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_name(f"{path.name}.tmp")
    temporary_path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temporary_path.replace(path)


def main() -> int:
    project_root = Path(__file__).resolve().parents[1]
    slus_path = project_root / "mod13" / "SLUS_014.11"
    mrg_path = project_root / "mod13" / "WA_MRG.MRG"
    data_directory = project_root / "src" / "data" / "mod13"

    missing = [path for path in (slus_path, mrg_path) if not path.is_file()]
    if missing:
        for path in missing:
            print(f"Missing required source file: {path}", file=sys.stderr)
        print("Place both Mod 13 binaries in mod13/ and run the command again.", file=sys.stderr)
        return 1

    try:
        slus_data = slus_path.read_bytes()
        mrg_data = mrg_path.read_bytes()
        card_names = extract_names(slus_data, SLUS_CARD_POINTER_TABLE, CARD_COUNT, "card")
        duelist_names = extract_names(
            slus_data, SLUS_DUELIST_POINTER_TABLE, DUELIST_COUNT, "duelist"
        )

        if len(card_names) != CARD_COUNT:
            raise ExtractionError(
                f"Expected {CARD_COUNT} card names, extracted {len(card_names)}"
            )
        if len(duelist_names) != DUELIST_COUNT:
            raise ExtractionError(
                f"Expected {DUELIST_COUNT} duelists, extracted {len(duelist_names)}"
            )

        duelists = [
            {"id": index + 1, "name": name, "slug": slugify(name)}
            for index, name in enumerate(duelist_names)
        ]
        duplicate_slugs = [
            slug
            for slug, count in Counter(row["slug"] for row in duelists).items()
            if count > 1
        ]
        if duplicate_slugs:
            raise ExtractionError(
                f"Generated duplicate duelist slug(s): {', '.join(duplicate_slugs)}"
            )

        drop_records, rank_counts, pool_errors = extract_drop_records(
            mrg_data, duelist_names
        )
        if pool_errors:
            print("Drop-pool validation failed; no generated files were changed:", file=sys.stderr)
            for error in pool_errors:
                print(f"- {error}", file=sys.stderr)
            return 1

        extracted_card_names = [
            {"id": index + 1, "name": name}
            for index, name in enumerate(card_names)
        ]
        write_json(data_directory / "extracted-card-names.json", extracted_card_names)
        write_json(data_directory / "duelists.json", duelists)
        write_json(data_directory / "drops.json", drop_records)

        print(f"Cards: {len(extracted_card_names)}")
        print(f"Duelists: {len(duelists)}")
        print(f"Drop records: {len(drop_records)}")
        print(f"S/A POW records: {rank_counts['SA_POW']}")
        print(f"B/C/D records: {rank_counts['BCD']}")
        print(f"S/A TEC records: {rank_counts['SA_TEC']}")
        return 0
    except (OSError, ExtractionError, struct.error) as error:
        print(f"Extraction failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
