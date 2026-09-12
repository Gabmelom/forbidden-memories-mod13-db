# Forbidden Memories DB

An unofficial multi-mod static database for browsing Yu-Gi-Oh! Forbidden Memories cards, duelists, and drop rates. The app currently includes Mod 13 and FM2 Ghost data and is built with React, TypeScript, and Vite.

Browse the Forbidden Memories database online: **[Forbidden Memories DB](https://gabmelom.github.io/forbidden-memories-mod13-db/#/mod13/cards)**

## Requirements

- Node.js 24 LTS and npm
- Python 3 for the data and image import scripts
- Pillow only when converting PNG, JPEG, or BMP images to WebP: `python -m pip install Pillow`

## Run locally

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Create and preview a production build with:

```bash
npm run build
npm run preview
```

## Extract Mod 13 data

Place your locally owned game files at:

```text
mod13/SLUS_014.11
mod13/WA_MRG.MRG
```

Then run:

```bash
npm run data:extract
```

The extractor reads the 722 card names, 39 duelists, and S/A POW, B/C/D, and S/A TEC drop pools. It generates:

- `src/data/mod13/extracted-card-names.json`
- `src/data/mod13/duelists.json`
- `src/data/mod13/drops.json`

The `mod13/` directory is gitignored. Never commit or copy the game binaries into the public application.

## Import card metadata

After extracting the Mod 13 names, import type, ATK, DEF, attribute, level, and Guardian Star metadata:

```bash
npm run data:cards
```

The script downloads `cardinfo.json` from the open-source `sg4e/YGOFM-gamedata` dataset and merges it strictly by numeric card ID. To use a local source file instead:

```bash
python "scripts/mod13/import-card-metadata.py" --source path/to/cardinfo.json
```

The importer preserves the extracted Mod 13 card names and does not modify `drops.json`.

## Import FM2 Ghost card metadata

After harvesting TEA card responses into `scripts/fm2 ghost/tea_getdata_raw.json`, merge the supported metadata into the normalized Ghost card list:

```bash
npm run data:fm2-ghost:cards
```

The importer joins records by numeric card ID and populates type, ATK/DEF, Guardian Stars, password, cost, description, effect status, and TEA's numeric color code. It preserves the canonical names from the Ghost workbook, stores the game's maximum card cost of `999999`, and treats TEA's non-decimal `FFFFFFFE` password value as unavailable. Verify that the generated dataset is current without writing it using:

```bash
npm run data:fm2-ghost:cards -- --check
```

Backfill reward entries and normalize special drop requirements from TEA and
the workbook-generated drop data:

```bash
npm run data:fm2-ghost:drops
npm run data:fm2-ghost:drops -- --check
```

Existing workbook weights and conditions remain unchanged. The importer adds
only entirely missing duelist/card/rank tuples, ignores TEA rank 0 opponent-deck
rows, and generates the structured requirements displayed on Ghost card drop rows.

Normalize the unique ritual recipes contained in the same TEA harvest:

```bash
npm run data:fm2-ghost:rituals
npm run data:fm2-ghost:rituals -- --check
```

Normalize which equip cards are compatible with each Ghost card:

```bash
npm run data:fm2-ghost:equips
npm run data:fm2-ghost:equips -- --check
```

Normalize the distinct fusion recipes, grouped by their result card:

```bash
npm run data:fm2-ghost:fusions
npm run data:fm2-ghost:fusions -- --check
```

## Import images

Import a local directory of ID-named card images:

```bash
npm run data:images -- path/to/card-images
```

Images are normalized to `public/mods/mod13/cards/001.webp` through `public/mods/mod13/cards/722.webp`.

Import a local directory of duelist portraits:

```bash
npm run data:duelist-images -- path/to/duelist-images
```

Portrait filenames may use an exact duelist slug, numeric duelist ID, or normalized duelist name. Final files are written to `public/mods/mod13/duelists/<slug>.webp`.

Neither image importer modifies card, duelist, or drop JSON.

## Validate and test

```bash
npm run validate:data
npm run validate:images
npm run validate:duelist-images
npm test
npm run lint
npm run build
```

The image validators require complete committed artwork and portrait sets. Data extraction itself does not require the images.

## Deployment

Pushes to `main` deploy automatically to GitHub Pages through `.github/workflows/deploy-pages.yml`. The application uses mod-scoped hash routes such as `#/mod13/cards/337` so deep links work on static hosting.

## License

Original application source code and scripts are available under the [MIT License](LICENSE). Yu-Gi-Oh! artwork, portraits, names, trademarks, game-derived data, and other third-party content are excluded from that license. See [NOTICE.md](NOTICE.md).
