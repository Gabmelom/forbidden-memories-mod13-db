FM2 Ghost v1.3.4 data extraction

Sources:
- Forbidden Memories 2 v1.3.4 data dump.xlsx
- scripts/fm2 ghost/tea_getdata_raw.json (TEA card details)

Generated:
- cards.json: 722 canonical IDs/names from Cards List, enriched with TEA type,
  ATK/DEF, Guardian Stars, password, cost, description, effect marker, and color
- duelists.json: 39 duelists from Drop Pools, in workbook/game order
- drops.json: 4,839 compact drop records
- drop-unlock-requirements.json: 9 alternate unlock-pool definitions

TEA handling:
- all 722 cards currently have a complete TEA card object
- TEA rank 0 rows describe opponent deck contents, not card rewards
- TEA ranks 1/2/3 correspond to SA POW, B/C/D, and SA TEC rewards
- drops.json remains workbook-authored because it preserves fractional effective
  weights, unlock variants, and special conditions that TEA does not expose
- fusion, equip, ritual, initial-deck, special, and tower sections remain in the
  raw TEA file until dedicated normalized datasets and UI are introduced

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

All default and unlock pool totals were validated to equal 2048.
