FM2 Ghost v1.3.4 data extraction

Sources:
- Forbidden Memories 2 v1.3.4 data dump.xlsx
- scripts/fm2 ghost/tea_getdata_raw.json (TEA card details)

Generated:
- cards.json: 722 canonical IDs/names from Cards List, enriched with TEA type,
  ATK/DEF, Guardian Stars, password, cost, description, effect marker, and color
- duelists.json: 39 duelists from Drop Pools, in workbook/game order
- drops.json: 4,860 compact drop records (workbook rows plus TEA fallbacks)
- drop-unlock-requirements.json: 9 alternate unlock-pool definitions
- rituals.json: 47 unique TEA ritual recipes
- equips.json: 4,082 equip relations across 604 cards

TEA handling:
- all 722 cards currently have a complete TEA card object
- TEA rank 0 rows describe opponent deck contents, not card rewards
- TEA ranks 1/2/3 correspond to SA POW, B/C/D, and SA TEC rewards
- existing drops.json rows remain workbook-authored because they preserve
  fractional effective weights, unlock variants, and special conditions that
  TEA does not expose
- TEA ranks 1/2/3 backfill entirely missing duelist/card/rank reward tuples;
  their integer probability weights are stored with denominator 2048
- all 722 cards have at least one normalized reward drop
- special requirements from TEA, workbook conditions, and the documented
  Kuriboh chest progression are normalized into drop-row requirements for wins,
  Library registration, chest inventory, and pool state
- fusion, initial-deck, and tower sections remain in the raw TEA file
  until dedicated normalized datasets and UI are introduced

Drop handling:
- weight is preserved as the workbook's fractional effective weight
- denominator is 2048
- pink cells -> condition requiring at least 400 wins
- yellow cells -> condition requiring the card to already be in the library
- cyan Kuriboh SA POW cells -> note about the Kuriboh questline transformation
- unlock pools are stored compactly: unchanged entries are emitted once; only added/removed/changed variants are condition-annotated

Name corrections needed to map Drop Pools to Cards List:
- Botanical Leon -> Botanical Lion
- Giga Plant -> Gigaplant

All workbook-authored default and unlock pool totals were validated to equal 2048.
