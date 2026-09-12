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
- fusions.json: 18,124 authoritative normalized TEA recipes grouped under 350 results; validation-only and not imported by the app
- fusion-rule-candidates.json: WordPress Basic Fusion candidates with source provenance
- fusion-rules.json: compact TEA-validated rules used by the app
- fusion-rule-audit.md: generated candidate and inferred-rule audit
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
- initial-deck and tower sections remain in the raw TEA file
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

Fusion rules:
- Run `npm run data:fm2-ghost:fusion-rules` after updating cards or normalized TEA fusions.
- Run `npm run validate:fm2-ghost:fusions` to compare every unordered card pair against raw TEA.
- Specific recipes take precedence over exact-card + type rules, which take precedence over type + type rules.
- Fusion matching is commutative; raw TEA records both directions for every non-self fusion pair without conflicts.
