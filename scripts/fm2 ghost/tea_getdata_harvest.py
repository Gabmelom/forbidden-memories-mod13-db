#!/usr/bin/env python3
"""
Download raw card metadata for FM2 Ghost from Base de Datos TEA.

Queries card IDs 1 through 722 from:
    https://www.basededatostea.xyz/api/v2/cards/getData?v=23&card=<ID>

The script does NOT interpret or normalize TEA's response. It stores the raw
JSON response for each card so another script can consume it later.

Recreates TEA's per-request MD5 signing headers (`hash`, `hora`, and `dif`)
immediately before each request using the site's Vuex `setThings(cardId)` logic.

Usage:
    python tea_getdata_harvest.py --phpsessid YOUR_SESSION_ID
    python tea_getdata_harvest.py --phpsessid YOUR_SESSION_ID --limit 25

Or set the cookie as an environment variable:
    set TEA_PHPSESSID=YOUR_SESSION_ID
    python tea_getdata_harvest.py

PowerShell:
    $env:TEA_PHPSESSID="YOUR_SESSION_ID"
    python tea_getdata_harvest.py

The output file is:
    tea_getdata_raw.json

Running the script again automatically resumes and skips card IDs that were
already downloaded successfully. Use --limit to cap how many new cards are
downloaded in a single run.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


BASE_URL = "https://www.basededatostea.xyz/api/v2/cards/getData"
API_VERSION = 23

FIRST_CARD_ID = 1
LAST_CARD_ID = 722

DEFAULT_OUTPUT = Path("tea_getdata_raw.json")
DEFAULT_DELAY = 2.5
DEFAULT_TIMEOUT = 30.0
DEFAULT_RETRIES = 2
DEFAULT_COOLDOWN = 60.0

# Headers copied from the working browser request. Browser-only transport
# headers are intentionally omitted because urllib generates those itself.
HEADERS = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
    "Authorization": "Basic",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "DNT": "1",
    "Sec-GPC": "1",
    "Referer": "https://www.basededatostea.xyz/extend/result/cards",
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/153.0.0.0 Safari/537.36"
    ),
}

# Exact TEA Vuex `tg` string. The underscores are literal characters; the
# backslashes shown in Markdown/source snippets were only escaping.
TG = (
    "De_un_golpe abrí la_puerta, y_con suave batir de_alas, entró "
    "un_majestuoso cuervo de_los_santos días idos. Sin asomos "
    "de_reverencia, ni_un_instante quedo; y_con_aires de_gran_señor "
    "o_de_gran_dama fue_a_posarse en_el_busto de_Palas, sobre el_dintel "
    "de_mi_puerta. Posado, inmóvil, y_nada_más. Entonces, este pájaro "
    "de_ébano cambió mis_tristes fantasías en_una_sonrisa con_el_grave "
    "y_severo decoro del_aspecto de_que_se_revestía. Aun_con_tu_cresta "
    "cercenada y_mocha -le_dije-, no_serás un_cobarde, hórrido "
    "cuervo_vetusto y_amenazador. Evadido de_la_ribera nocturna. "
    "¡Dime cuál es_tu_nombre en_la_ribera de_la_Noche Plutónica! "
    "Y_el_Cuervo dijo: Nunca_más."
)

TG_TOKENS = TG.split(" ")
if len(TG_TOKENS) < 60:
    raise RuntimeError(
        f"TEA tg string must contain at least 60 space-delimited tokens; "
        f"found {len(TG_TOKENS)}."
    )


def javascript_timezone_offset_minutes(now: datetime) -> int:
    """
    Python equivalent of JavaScript Date.getTimezoneOffset().

    JavaScript returns UTC - local time in minutes, so Toronto during EDT is
    +240 and during EST is +300.
    """
    offset = now.astimezone().utcoffset()
    if offset is None:
        return 0
    return int(-offset.total_seconds() // 60)


def build_signing_headers(card_id: int) -> dict[str, str]:
    """
    Recreate TEA's Vuex setThings(cardId) signing logic:

        hash = md5(cardId + hora + tg.split(" ")[second] + versionId)
        hora = hour + ":" + minute + ":" + second
        dif = new Date().getTimezoneOffset()
        Authorization = "Basic"   (anonymous browser request)

    This function is called immediately before each HTTP request so the second
    used in `hora`, the tg token, and the MD5 input all stay synchronized.
    """
    now = datetime.now().astimezone()

    second = now.second
    hora = f"{now.hour}:{now.minute}:{second}"
    tg_token = TG_TOKENS[second]

    signing_input = f"{card_id}{hora}{tg_token}{API_VERSION}"
    hash_value = hashlib.md5(signing_input.encode("utf-8")).hexdigest()

    return {
        "Authorization": "Basic",
        "hora": hora,
        "dif": str(javascript_timezone_offset_minutes(now)),
        "hash": hash_value,
    }


def build_url(card_id: int) -> str:
    query = urllib.parse.urlencode(
        {
            "v": API_VERSION,
            "card": card_id,
        }
    )
    return f"{BASE_URL}?{query}"


def request_card(
    card_id: int,
    phpsessid: str,
    timeout: float,
) -> tuple[int, Any]:
    headers = dict(HEADERS)

    if phpsessid:
        headers["Cookie"] = f"PHPSESSID={phpsessid}"

    # Generate the TEA signature at the last possible moment.
    headers.update(build_signing_headers(card_id))

    request = urllib.request.Request(
        build_url(card_id),
        headers=headers,
        method="GET",
    )

    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            status = response.status
            raw = response.read()
    except urllib.error.HTTPError as exc:
        status = exc.code
        raw = exc.read()

    text = raw.decode("utf-8", errors="replace")

    if not text.strip():
        return status, None

    try:
        return status, json.loads(text)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"TEA returned non-JSON content for card {card_id}: "
            f"{text[:500]}"
        ) from exc


def is_empty_response(data: Any) -> bool:
    """Return True for TEA responses that contain no usable card data."""
    if data is None:
        return True

    if isinstance(data, (list, str)):
        return len(data) == 0

    if not isinstance(data, dict):
        return False

    if not data:
        return True

    # A successful getData response contains a populated "card" object.
    card = data.get("card")
    if isinstance(card, dict) and card:
        return False

    # Known TEA no-result/error shape, for example:
    # {
    #   "ok": false,
    #   "sms": "sin resultados, ec:0002",
    #   "resultados": []
    # }
    resultados = data.get("resultados")
    sms = str(data.get("sms", "")).strip().lower()

    if (
        data.get("ok") is False
        and isinstance(resultados, list)
        and not resultados
    ):
        return True

    if "sin resultados" in sms and isinstance(resultados, list) and not resultados:
        return True

    return False


def fetch_with_retries(
    card_id: int,
    phpsessid: str,
    timeout: float,
    retries: int,
    cooldown: float,
) -> Any:
    """
    Fetch one card synchronously.

    Every request is fully completed before the next begins. HTTP 403 and
    empty/no-result responses are treated as cooldown events: wait about a
    minute, retry once, then stop if the retry is still blocked/empty.
    """
    last_error: Exception | None = None
    attempts = max(1, retries)

    for attempt in range(1, attempts + 1):
        try:
            status, data = request_card(card_id, phpsessid, timeout)

            if status == 200 and not is_empty_response(data):
                return data

            if status == 403 or is_empty_response(data):
                reason = (
                    f"HTTP 403 for card {card_id}"
                    if status == 403
                    else f"empty/no-result response for card {card_id}"
                )
                last_error = RuntimeError(reason)

                if attempt < attempts:
                    print(
                        f"{reason}; cooling down for {cooldown:.0f}s before retry...",
                        end=" ",
                        flush=True,
                    )
                    time.sleep(max(0.0, cooldown))
                    continue

                raise RuntimeError(
                    f"{reason} after {attempts} attempts. "
                    "Stopping so the server is not hammered."
                )

            if status == 401:
                raise RuntimeError(
                    f"HTTP 401 for card {card_id}. "
                    "The PHP session/request headers may have expired."
                )

            if status == 429:
                last_error = RuntimeError(
                    f"HTTP 429 rate limit for card {card_id}"
                )
            elif 500 <= status <= 599:
                last_error = RuntimeError(
                    f"HTTP {status} for card {card_id}"
                )
            else:
                raise RuntimeError(
                    f"HTTP {status} for card {card_id}: {data}"
                )

        except (urllib.error.URLError, TimeoutError) as exc:
            last_error = exc

        if attempt < attempts:
            wait = 2 ** (attempt - 1)
            print(f"retrying in {wait}s...", end=" ", flush=True)
            time.sleep(wait)

    raise RuntimeError(
        f"Request failed after {attempts} attempts: {last_error}"
    )


def new_output() -> dict[str, Any]:
    return {
        "source": BASE_URL,
        "apiVersion": API_VERSION,
        "cardRange": {
            "first": FIRST_CARD_ID,
            "last": LAST_CARD_ID,
        },
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "updatedAt": None,
        "lastAttemptedCardId": None,
        "lastCompletedCardId": None,
        "cards": {},
        "errors": {},
    }


def load_output(path: Path) -> dict[str, Any]:
    if not path.exists():
        return new_output()

    data = json.loads(path.read_text(encoding="utf-8"))

    if not isinstance(data, dict):
        raise ValueError(f"{path} does not contain the expected JSON object.")

    if not isinstance(data.get("cards"), dict):
        raise ValueError(f"{path} does not contain a 'cards' object.")

    if not isinstance(data.get("errors"), dict):
        data["errors"] = {}

    return data


def save_output(path: Path, data: dict[str, Any]) -> None:
    data["updatedAt"] = datetime.now(timezone.utc).isoformat()

    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(
        json.dumps(data, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    temp.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Download raw TEA getData responses for Ghost cards 1-722."
    )
    parser.add_argument(
        "--phpsessid",
        default=os.environ.get("TEA_PHPSESSID"),
        help=(
            "Value of the PHPSESSID cookie. "
            "Alternatively set TEA_PHPSESSID."
        ),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
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
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=DEFAULT_RETRIES,
    )
    parser.add_argument(
        "--cooldown",
        type=float,
        default=DEFAULT_COOLDOWN,
        help=(
            "Seconds to wait before retrying HTTP 403 or an empty response "
            f"(default: {DEFAULT_COOLDOWN})."
        ),
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help=(
            "Maximum number of NEW cards to download in this run. "
            "Already-saved cards do not count toward the limit."
        ),
    )
    parser.add_argument(
        "--start",
        type=int,
        default=FIRST_CARD_ID,
    )
    parser.add_argument(
        "--end",
        type=int,
        default=LAST_CARD_ID,
    )
    args = parser.parse_args()

    if not args.phpsessid:
        print(
            "Error: PHPSESSID is required.\n\n"
            "Pass it with:\n"
            "  python tea_getdata_harvest.py --phpsessid YOUR_SESSION_ID\n\n"
            "or set the TEA_PHPSESSID environment variable."
        )
        return 1

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

    output = load_output(args.output)

    card_ids = list(range(args.start, args.end + 1))
    pending = [
        card_id
        for card_id in card_ids
        if str(card_id) not in output["cards"]
    ]

    total_pending = len(pending)
    if args.limit is not None:
        pending = pending[: args.limit]

    print(f"Card range:       {args.start}-{args.end}")
    print(f"Already present:  {len(card_ids) - total_pending}")
    print(f"Still missing:     {total_pending}")
    print(f"This run:          {len(pending)}")
    print(f"Delay:             {max(0.0, args.delay):.2f}s")
    print(f"403/empty cooldown:{max(0.0, args.cooldown):.0f}s")
    print(f"Output:            {args.output}")
    print()

    for index, card_id in enumerate(pending, start=1):
        print(
            f"[{index:>3}/{len(pending)}] Card {card_id:03d} ... ",
            end="",
            flush=True,
        )

        try:
            output["lastAttemptedCardId"] = card_id
            save_output(args.output, output)

            response = fetch_with_retries(
                card_id=card_id,
                phpsessid=args.phpsessid,
                timeout=args.timeout,
                retries=min(2, max(1, args.retries)),
                cooldown=max(0.0, args.cooldown),
            )

            output["cards"][str(card_id)] = response
            output["errors"].pop(str(card_id), None)
            output["lastCompletedCardId"] = card_id

            print("OK")

        except Exception as exc:
            message = str(exc)
            output["errors"][str(card_id)] = message
            print("FAILED")
            print(f"  {message}")

            save_output(args.output, output)

            # Stop instead of hammering TEA when the session is rejected or
            # the API continues returning empty/no-result data after cooldown.
            if (
                "HTTP 401" in message
                or "HTTP 403" in message
                or "empty/no-result response" in message
            ):
                print()
                print(
                    "Stopping to avoid repeated requests. Run the script again "
                    "later; it will automatically resume at the first card that "
                    "has not been saved successfully."
                )
                return 2

        save_output(args.output, output)

        if index != len(pending):
            time.sleep(max(0.0, args.delay))

    print()
    print(f"Downloaded total: {len(output['cards'])}")
    print(f"Errors:           {len(output['errors'])}")
    print(f"Saved:            {args.output}")

    remaining = [
        card_id
        for card_id in range(args.start, args.end + 1)
        if str(card_id) not in output["cards"]
    ]
    if remaining:
        print(
            f"Next unfinished:   {remaining[0]:03d} "
            f"({len(remaining)} cards remain in the selected range)"
        )
        if args.limit is not None:
            print(
                "Run the same command again to continue automatically "
                "with the next unfinished card."
            )

    return 0 if not output["errors"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
