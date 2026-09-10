#!/usr/bin/env python3
"""
Download FM II Ghost card artwork from Base de Datos TEA.

Source pattern:
    https://www.basededatostea.xyz/img/fm2g/<CARD_ID>.jpg

Downloads card IDs 1 through 722 into a local output directory.

Features:
- --limit N to download only N NEW images in a run
- automatic resume by skipping already-downloaded, non-empty files
- waits for each response to finish before continuing
- polite delay between requests
- on HTTP 403: wait 60 seconds, retry once, then stop
- optional PHPSESSID via --phpsessid or TEA_PHPSESSID
- writes files atomically via .tmp files
"""

from __future__ import annotations

import argparse
import os
import time
import urllib.error
import urllib.request
from pathlib import Path

BASE_URL = "https://www.basededatostea.xyz/img/fm2g"
FIRST_CARD_ID = 1
LAST_CARD_ID = 722

DEFAULT_OUTPUT_DIR = Path("tea_fm2g_artwork")
DEFAULT_DELAY = 2.5
DEFAULT_TIMEOUT = 30.0
DEFAULT_COOLDOWN = 60.0

HEADERS = {
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
    "Cache-Control": "no-cache",
    "DNT": "1",
    "Pragma": "no-cache",
    "Referer": "https://www.basededatostea.xyz/",
    "Sec-GPC": "1",
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/153.0.0.0 Safari/537.36"
    ),
}


def build_url(card_id: int) -> str:
    return f"{BASE_URL}/{card_id}.jpg"


def is_complete_file(path: Path) -> bool:
    try:
        return path.is_file() and path.stat().st_size > 0
    except OSError:
        return False


def request_image(
    card_id: int,
    phpsessid: str | None,
    timeout: float,
) -> tuple[int, bytes, str]:
    headers = dict(HEADERS)

    if phpsessid:
        headers["Cookie"] = f"PHPSESSID={phpsessid}"

    request = urllib.request.Request(
        build_url(card_id),
        headers=headers,
        method="GET",
    )

    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return (
                response.status,
                response.read(),
                response.headers.get("Content-Type", ""),
            )
    except urllib.error.HTTPError as exc:
        return (
            exc.code,
            exc.read(),
            exc.headers.get("Content-Type", "") if exc.headers else "",
        )


def fetch_image_with_retry(
    card_id: int,
    phpsessid: str | None,
    timeout: float,
    cooldown: float,
) -> tuple[bytes, str]:
    for attempt in (1, 2):
        status, data, content_type = request_image(
            card_id=card_id,
            phpsessid=phpsessid,
            timeout=timeout,
        )

        if status == 200:
            if not data:
                raise RuntimeError(f"Empty response body for card {card_id}.")

            lowered = content_type.lower()
            if lowered and not lowered.startswith("image/"):
                preview = data[:200].decode("utf-8", errors="replace")
                raise RuntimeError(
                    f"Unexpected Content-Type {content_type!r} for card "
                    f"{card_id}. Response starts with: {preview!r}"
                )

            return data, content_type

        if status == 403:
            if attempt == 1:
                print(
                    f"HTTP 403; cooling down for {cooldown:.0f}s before retry...",
                    end=" ",
                    flush=True,
                )
                time.sleep(max(0.0, cooldown))
                continue

            raise RuntimeError(
                f"HTTP 403 for card {card_id} after retry. "
                "Stopping to avoid repeated requests."
            )

        if status == 404:
            raise FileNotFoundError(
                f"Artwork not found for card {card_id} (HTTP 404)."
            )

        raise RuntimeError(
            f"HTTP {status} while downloading artwork for card {card_id}."
        )

    raise RuntimeError(f"Failed to download artwork for card {card_id}.")


def save_image(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_bytes(data)
    temp.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Download FM II Ghost card artwork from TEA."
    )

    parser.add_argument(
        "--phpsessid",
        default=os.environ.get("TEA_PHPSESSID"),
        help=(
            "Optional PHPSESSID cookie value. "
            "Alternatively set TEA_PHPSESSID."
        ),
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"Artwork directory (default: {DEFAULT_OUTPUT_DIR}).",
    )
    parser.add_argument("--start", type=int, default=FIRST_CARD_ID)
    parser.add_argument("--end", type=int, default=LAST_CARD_ID)
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help=(
            "Maximum number of NEW images to download in this run. "
            "Existing files do not count toward the limit."
        ),
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=DEFAULT_DELAY,
        help=f"Delay between requests in seconds (default: {DEFAULT_DELAY}).",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=DEFAULT_TIMEOUT,
        help=f"Request timeout in seconds (default: {DEFAULT_TIMEOUT}).",
    )
    parser.add_argument(
        "--cooldown",
        type=float,
        default=DEFAULT_COOLDOWN,
        help=(
            "Seconds to wait before retrying an HTTP 403 "
            f"(default: {DEFAULT_COOLDOWN})."
        ),
    )

    args = parser.parse_args()

    if args.start < FIRST_CARD_ID or args.end > LAST_CARD_ID:
        print(
            f"Error: card range must stay within "
            f"{FIRST_CARD_ID}-{LAST_CARD_ID}."
        )
        return 1

    if args.start > args.end:
        print("Error: --start cannot be greater than --end.")
        return 1

    if args.limit is not None and args.limit < 1:
        print("Error: --limit must be at least 1.")
        return 1

    args.output_dir.mkdir(parents=True, exist_ok=True)

    card_ids = list(range(args.start, args.end + 1))
    pending = [
        card_id
        for card_id in card_ids
        if not is_complete_file(args.output_dir / f"{card_id}.jpg")
    ]

    total_pending = len(pending)

    if args.limit is not None:
        pending = pending[: args.limit]

    print(f"Card range:       {args.start}-{args.end}")
    print(f"Already present:  {len(card_ids) - total_pending}")
    print(f"Still missing:    {total_pending}")
    print(f"This run:         {len(pending)}")
    print(f"Delay:            {max(0.0, args.delay):.2f}s")
    print(f"403 cooldown:     {max(0.0, args.cooldown):.0f}s")
    print(f"Output directory: {args.output_dir}")
    print()

    if not pending:
        print("Nothing to download.")
        return 0

    downloaded_this_run = 0
    failed = 0

    for index, card_id in enumerate(pending, start=1):
        output_path = args.output_dir / f"{card_id}.jpg"

        print(
            f"[{index:>3}/{len(pending)}] Card {card_id:03d} ... ",
            end="",
            flush=True,
        )

        try:
            data, _ = fetch_image_with_retry(
                card_id=card_id,
                phpsessid=args.phpsessid,
                timeout=max(1.0, args.timeout),
                cooldown=max(0.0, args.cooldown),
            )

            save_image(output_path, data)
            downloaded_this_run += 1
            print(f"OK ({len(data):,} bytes)")

        except FileNotFoundError as exc:
            failed += 1
            print("NOT FOUND")
            print(f"  {exc}")

        except (urllib.error.URLError, TimeoutError) as exc:
            failed += 1
            print("FAILED")
            print(f"  Network error: {exc}")
            print(
                "Stopping after network failure. Run the same command again "
                "to resume automatically."
            )
            return 2

        except Exception as exc:
            failed += 1
            message = str(exc)
            print("FAILED")
            print(f"  {message}")

            if "HTTP 403" in message:
                print()
                print(
                    "Stopping after repeated 403. Run the same command again "
                    "later; existing images will be skipped automatically."
                )
                return 2

        if index != len(pending):
            time.sleep(max(0.0, args.delay))

    remaining = [
        card_id
        for card_id in card_ids
        if not is_complete_file(args.output_dir / f"{card_id}.jpg")
    ]

    print()
    print(f"Downloaded this run: {downloaded_this_run}")
    print(f"Failed this run:     {failed}")
    print(f"Remaining in range:  {len(remaining)}")
    print(f"Saved to:            {args.output_dir}")

    if remaining:
        print(f"Next unfinished:     {remaining[0]:03d}")
        if args.limit is not None:
            print(
                "Run the same command again to continue with the next "
                "unfinished artwork."
            )

    return 0 if failed == 0 else 3


if __name__ == "__main__":
    raise SystemExit(main())
