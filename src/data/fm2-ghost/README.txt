FM2 Ghost v1.3.4 data extraction

Source: Forbidden Memories 2 v1.3.4 data dump.xlsx

Generated:
- cards.json: 722 cards from Cards List
- duelists.json: 39 duelists from Drop Pools, in workbook/game order
- drops.json: 4,839 compact drop records
- drop-unlock-requirements.json: 9 alternate unlock-pool definitions

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
