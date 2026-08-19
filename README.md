# Forbidden Memories Mod 13 DB

A small, static lookup utility for searching Yu-Gi-Oh! Forbidden Memories Mod 13 drops by card or duelist. The interface is optimized for quick use on a phone while playing.

The checked-in JSON is generated from local Mod 13 game files. The source binaries remain local and are excluded by `.gitignore`.

## Purpose

Search Mod 13 card drops either by card or by duelist, compare per-reward and per-duel probabilities, and switch among S/A POW, B/C/D, and S/A TEC rank pools.

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
```

The output in `dist/` is a static SPA. `public/_redirects` supports Netlify-style SPA routing. Cloudflare Pages can use `npm run build` with `dist` as its output directory.

## Deployment

The site deploys to GitHub Pages automatically whenever `main` is pushed, using the workflow in `.github/workflows/deploy-pages.yml`. Configure the repository's Pages source as **GitHub Actions** before the first deployment.

GitHub Pages builds derive the correct project base path from `GITHUB_REPOSITORY`. Navigation uses hash routes so deep links and refreshes work without server rewrites, for example `#/cards/337` and `#/duelists/seto-2nd`.

## Validate data

```bash
npm run validate:data
```

Validation checks card and duelist references, supported ranks, weight bounds, and unique card IDs, duelist IDs, and duelist slugs.

## Extract Mod 13 data

Place the locally owned game files at:

```text
mod13/SLUS_014.11
mod13/WA_MRG.MRG
```

Then run:

```bash
npm run data:extract
```

The extractor reads 722 card names and 39 duelists from the SLUS file and reads the S/A POW, B/C/D, and S/A TEC weight pools from the MRG file. It writes:

- `src/data/extracted-card-names.json`
- `src/data/duelists.json`
- `src/data/drops.json`

`mod13/` is ignored and must never be committed or copied into the public application. The exporter is implemented locally in `scripts/extract-mod13.py`; its binary layout is based on the public `lundylizard/fm-drop-extractor` project.

## Import card metadata

After extracting the Mod 13 names, import complete card metadata from the open-source `sg4e/YGOFM-gamedata` dataset:

```bash
npm run data:cards
```

The importer downloads `sqlite/json/cardinfo.json`, validates all 722 numeric IDs, and rewrites `src/data/cards.json`. It joins strictly by numeric card ID, preserves the extracted Mod 13 names, normalizes Magic/Trap ATK and DEF to `null`, and never reads or writes `drops.json`. A local upstream file can be supplied with `python scripts/import-card-metadata.py --source path/to/cardinfo.json`.

## Card artwork

Card artwork is served as regular static WebP files using zero-padded card IDs:

```text
public/cards/001.webp
public/cards/082.webp
public/cards/337.webp
public/cards/722.webp
```

The UI displays a CSS fallback whenever an image is absent. Check artwork coverage independently from the normal build with:

```bash
npm run validate:images
```

Import an explicitly supplied local image directory with:

```bash
npm run data:images -- ../fm-images
```

The importer recognizes `.webp`, `.png`, `.jpg`, and `.jpeg` files whose names begin with a card ID, normalizes output names, and reports missing IDs. Existing WebP files are copied directly. Converting other formats or resizing images over 1600 pixels requires Pillow (`python -m pip install Pillow`). The importer never downloads artwork and never modifies card or drop JSON.

## Duelist portraits

Duelist portraits are regular static WebP files named from the canonical duelist slug:

```text
public/duelists/simon-muran.webp
public/duelists/seto-2nd.webp
public/duelists/heishin-2nd.webp
```

Check coverage independently from the build with:

```bash
npm run validate:duelist-images
```

Import an explicitly supplied local directory with:

```bash
npm run data:duelist-images -- ../duelist-images
```

The importer first matches an exact slug, then a numeric duelist ID, then a safely normalized duelist name. Unmatched or conflicting files are reported and never assigned speculatively. It supports WebP, PNG, JPEG, and BMP; non-WebP conversion and resizing over 1024 pixels require Pillow. It never downloads portraits or modifies `duelists.json`, `cards.json`, or `drops.json`.

## Tests

```bash
npm test
```

## Data files

The complete runtime dataset lives in:

- `src/data/extracted-card-names.json`
- `src/data/duelists.json`
- `src/data/drops.json`

`src/data/cards.json` contains the complete imported type, ATK, DEF, attribute, level, and guardian-star metadata. Extracted Mod 13 IDs and names remain canonical.

## Drop format

Each drop record associates one duelist, card, and rank pool with a raw weight:

```json
{
  "duelistId": 32,
  "cardId": 337,
  "rank": "SA_TEC",
  "weight": 52
}
```

The single-reward probability is `weight / 2048`. Percentages are derived at runtime and are never stored in JSON.

## Reward probability

```text
P(at least one copy) = 1 - (1 - weight/2048)^rewardCount
```

The selected reward count (1, 5, 10, or 15) is stored in `localStorage` and defaults to 15.

## Project structure

```text
src/
├── components/   Shared search, navigation, rank, sort, and rate UI
├── context/      Persisted global reward-count state
├── data/         Generated Mod 13 JSON and optional card metadata
├── pages/        Cards and duelists list/detail routes
├── types/        Shared TypeScript data contracts
└── utils/        Data lookup, search, probability, sorting, and tests
scripts/          Dataset validation and static-host build helpers
```
