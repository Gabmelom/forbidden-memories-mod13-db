# FM II Ghost fusion-rule audit

Generated from 722 cards and 18,124 authoritative unordered TEA fusion pairs. The [WordPress Basic Fusion section](https://yugiohfmii.wordpress.com/fusion/) is a discovery guide only.

## Validation summary

- Generalized type rules: 71
- Exact-card + type rules: 133
- Explicit special/precedence pairs: 540
- Total compact rule entries: 744
- Ingredient ordering: commutative; raw TEA contains both directions for every non-self pair and no directional result conflicts.
- Full-engine false positives: 0
- Full-engine false negatives: 0
- Full-engine wrong results: 0

Thresholds are exclusive because every accepted basic family selects a result stronger than each eligible material; cards at the result ATK boundary are not included. Exclusion lists preserve TEA-observed hidden compatibility distinctions that are not represented by the public card schema.

## WordPress Basic Fusion candidate audit

### Aqua + Beast = Freezing Beast

- Candidate: `wp-aqua-beast` (source line 9)
- Expected result: #599 Freezing Beast
- All TEA pairs producing this result: 286
- Unconstrained candidate: 286 true positives, 830 no-fusion false positives, 4 wrong-result overlaps
- Inferred rule: `type-type-aqua-beast-freezing-beast-150`
- Accepted rule: 286 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Aqua + Dino = Hydrogeddon

- Candidate: `wp-aqua-dinosaur` (source line 11)
- Expected result: #81 Hydrogeddon
- All TEA pairs producing this result: 156
- Unconstrained candidate: 156 true positives, 524 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-aqua-dinosaur-hydrogeddon-170`
- Accepted rule: 156 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Aqua + Dragon = Kairyu-Shin

- Candidate: `wp-aqua-dragon` (source line 13)
- Expected result: #73 Kairyu-Shin
- All TEA pairs producing this result: 377
- Unconstrained candidate: 377 true positives, 1504 no-fusion false positives, 39 wrong-result overlaps
- Inferred rule: `type-type-aqua-dragon-kairyu-shin-144`
- Accepted rule: 377 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Kairyu-Shin + Seaserpent = Brionac, Dragon of the Ice Barrier

- Candidate: `wp-kairyu-shin-sea-serpent` (source line 13)
- Expected result: #223 Brionac, Dragon of the Ice Barrier
- All TEA pairs producing this result: 10
- Unconstrained candidate: 4 true positives, 7 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-73-seaserpent-brionac-dragon-of-the-ice-barrier-132`
- Accepted rule: 4 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Aqua + Fiend = Revival Jam

- Candidate: `wp-aqua-fiend` (source line 14)
- Expected result: #70 Revival Jam
- All TEA pairs producing this result: 649
- Unconstrained candidate: 648 true positives, 1351 no-fusion false positives, 1 wrong-result overlaps
- Inferred rule: `type-type-aqua-fiend-revival-jam-135`
- Accepted rule: 648 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Aqua + Insect = Numbing Grub

- Candidate: `wp-aqua-insect` (source line 18)
- Expected result: #55 Numbing Grub
- All TEA pairs producing this result: 231
- Unconstrained candidate: 231 true positives, 951 no-fusion false positives, 58 wrong-result overlaps
- Inferred rule: `type-type-aqua-insect-numbing-grub-157`
- Accepted rule: 231 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Aqua + Reptile = Worm Tentacles

- Candidate: `wp-aqua-reptile` (source line 20)
- Expected result: #51 Worm Tentacles
- All TEA pairs producing this result: 324
- Unconstrained candidate: 324 true positives, 476 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-aqua-reptile-worm-tentacles-146`
- Accepted rule: 324 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Aqua + Seaserpent = Leviair The Sea Dragon

- Candidate: `wp-aqua-sea-serpent` (source line 22)
- Expected result: #432 Leviair the Sea Dragon
- All TEA pairs producing this result: 145
- Unconstrained candidate: 29 true positives, 408 no-fusion false positives, 3 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.

Status: RECLASSIFIED OR REJECTED

### Aqua + Spellcaster = Shock Troops

- Candidate: `wp-aqua-spellcaster` (source line 23)
- Expected result: #433 Shock Troops
- All TEA pairs producing this result: 696
- Unconstrained candidate: 696 true positives, 1264 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-aqua-spellcaster-shock-troops-134`
- Accepted rule: 696 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Aqua + Thunder = Thunder Sea Horse

- Candidate: `wp-aqua-thunder` (source line 25)
- Expected result: #460 Thunder Sea Horse
- All TEA pairs producing this result: 182
- Unconstrained candidate: 182 true positives, 448 no-fusion false positives, 10 wrong-result overlaps
- Inferred rule: `type-type-aqua-thunder-thunder-sea-horse-164`
- Accepted rule: 182 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beast + Dragon = Twin-Headed Behemoth

- Candidate: `wp-beast-dragon` (source line 33)
- Expected result: #94 Twin-headed Behemoth
- All TEA pairs producing this result: 108
- Unconstrained candidate: 108 true positives, 1235 no-fusion false positives, 1 wrong-result overlaps
- Inferred rule: `type-type-beast-dragon-twin-headed-behemoth-184`
- Accepted rule: 108 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beast + Fairy = Ocubeam

- Candidate: `wp-beast-fairy` (source line 34)
- Expected result: #396 Ocubeam
- All TEA pairs producing this result: 195
- Unconstrained candidate: 195 true positives, 544 no-fusion false positives, 17 wrong-result overlaps
- Inferred rule: `type-type-beast-fairy-ocubeam-162`
- Accepted rule: 195 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Ocubeam + Beast = Sunlight Unicorn

- Candidate: `wp-ocubeam-beast` (source line 34)
- Expected result: #403 Sunlight Unicorn
- All TEA pairs producing this result: 17
- Unconstrained candidate: 17 true positives, 11 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-396-beast-sunlight-unicorn-74`
- Accepted rule: 17 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beast + Fiend = Berfomet

- Candidate: `wp-beast-fiend` (source line 36)
- Expected result: #233 Berfomet
- All TEA pairs producing this result: 275
- Unconstrained candidate: 275 true positives, 1040 no-fusion false positives, 85 wrong-result overlaps
- Inferred rule: `type-type-beast-fiend-berfomet-154`
- Accepted rule: 275 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Berfomet + Beast = King of Yamimakai

- Candidate: `wp-berfomet-beast` (source line 36)
- Expected result: #85 King of Yamimakai
- All TEA pairs producing this result: 21
- Unconstrained candidate: 21 true positives, 7 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-233-beast-king-of-yamimakai-66`
- Accepted rule: 21 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### King of Yamimakai + Beast = Beast of Talwar

- Candidate: `wp-king-yamimakai-beast` (source line 36)
- Expected result: #61 Beast of Talwar
- All TEA pairs producing this result: 24
- Unconstrained candidate: 24 true positives, 4 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-85-beast-beast-of-talwar-50`
- Accepted rule: 24 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beast + Insect = Bujingi Centipede

- Candidate: `wp-beast-insect` (source line 38)
- Expected result: #479 Bujingi Centipede
- All TEA pairs producing this result: 240
- Unconstrained candidate: 240 true positives, 628 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-beast-insect-bujingi-centipede-156`
- Accepted rule: 240 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beast + Machine = Giga-Tech Wolf

- Candidate: `wp-beast-machine` (source line 39)
- Expected result: #412 Giga-Tech Wolf
- All TEA pairs producing this result: 30
- Unconstrained candidate: 30 true positives, 1282 no-fusion false positives, 4 wrong-result overlaps
- Inferred rule: `type-type-beast-machine-giga-tech-wolf-204`
- Accepted rule: 30 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beast + Plant = Botanical Lion

- Candidate: `wp-beast-plant` (source line 42)
- Expected result: #273 Botanical Lion
- All TEA pairs producing this result: 150
- Unconstrained candidate: 150 true positives, 479 no-fusion false positives, 43 wrong-result overlaps
- Inferred rule: `type-type-beast-plant-botanical-lion-175`
- Accepted rule: 150 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Botanical Lion + Beast = Naturia Beast

- Candidate: `wp-botanical-lion-beast` (source line 42)
- Expected result: #598 Naturia Beast
- All TEA pairs producing this result: 20
- Unconstrained candidate: 20 true positives, 7 no-fusion false positives, 1 wrong-result overlaps
- Inferred rule: `exact-type-card-273-beast-naturia-beast-69`
- Accepted rule: 20 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Naturia Beast + Plant = Naturia Exterio

- Candidate: `wp-naturia-beast-plant` (source line 42)
- Expected result: #544 Naturia Exterio
- All TEA pairs producing this result: 23
- Unconstrained candidate: 23 true positives, 1 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-598-plant-naturia-exterio-58`
- Accepted rule: 23 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beast + Pyro = Flame Tiger

- Candidate: `wp-beast-pyro` (source line 43)
- Expected result: #528 Flame Tiger
- All TEA pairs producing this result: 128
- Unconstrained candidate: 128 true positives, 366 no-fusion false positives, 10 wrong-result overlaps
- Inferred rule: `type-type-beast-pyro-flame-tiger-182`
- Accepted rule: 128 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beast + Warrior = Gaia The White Knight

- Candidate: `wp-beast-warrior` (source line 46)
- Expected result: #234 Gaia the White Knight
- All TEA pairs producing this result: 432
- Unconstrained candidate: 432 true positives, 1132 no-fusion false positives, 4 wrong-result overlaps
- Inferred rule: `type-type-beast-warrior-gaia-the-white-knight-143`
- Accepted rule: 432 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beast + Zombie = Skull Dog Marron

- Candidate: `wp-beast-zombie` (source line 48)
- Expected result: #46 Skull Dog Marron
- All TEA pairs producing this result: 140
- Unconstrained candidate: 140 true positives, 756 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-beast-zombie-skull-dog-marron-178`
- Accepted rule: 140 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beastwarrior + Dino = Gladiator Beast Spartacus

- Candidate: `wp-beast-warrior-dinosaur` (source line 54)
- Expected result: #80 Gladiator Beast Spartacus
- All TEA pairs producing this result: 150
- Unconstrained candidate: 150 true positives, 190 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-beastwarrior-dinosaur-gladiator-beast-spartacus-172`
- Accepted rule: 150 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beastwarrior + Fairy (Wing) = Wulf, Lightsworn Beast

- Candidate: `wp-beast-warrior-fairy-wing` (source line 56)
- Expected result: #287 Wulf, Lightsworn Beast
- All TEA pairs producing this result: 20
- Unconstrained candidate: 20 true positives, 520 no-fusion false positives, 0 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.

Status: RECLASSIFIED OR REJECTED

### Beastwarrior + Machine = Spikebot

- Candidate: `wp-beast-warrior-machine` (source line 59)
- Expected result: #441 Spikebot
- All TEA pairs producing this result: 90
- Unconstrained candidate: 90 true positives, 850 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-beastwarrior-machine-spikebot-186`
- Accepted rule: 90 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beastwarrior + Spellcaster = Frontier Wiseman

- Candidate: `wp-beast-warrior-spellcaster` (source line 61)
- Expected result: #619 Frontier Wiseman
- All TEA pairs producing this result: 155
- Unconstrained candidate: 155 true positives, 825 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-beastwarrior-spellcaster-frontier-wiseman-171`
- Accepted rule: 155 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beastwarrior + Warrior = Wolf Axwielder

- Candidate: `wp-beast-warrior-warrior` (source line 63)
- Expected result: #246 Wolf Axwielder
- All TEA pairs producing this result: 170
- Unconstrained candidate: 170 true positives, 949 no-fusion false positives, 1 wrong-result overlaps
- Inferred rule: `type-type-beastwarrior-warrior-wolf-axwielder-166`
- Accepted rule: 170 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Beastwarrior + Zombie = The 13th Grave

- Candidate: `wp-beast-warrior-zombie` (source line 64)
- Expected result: #132 The 13th Grave
- All TEA pairs producing this result: 11
- Unconstrained candidate: 11 true positives, 624 no-fusion false positives, 5 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.

Status: RECLASSIFIED OR REJECTED

### The 13th Grave + Beastwarrior = Bone Crusher

- Candidate: `wp-thirteenth-grave-beast-warrior` (source line 64)
- Expected result: #153 Bone Crusher
- All TEA pairs producing this result: 5
- Unconstrained candidate: 5 true positives, 15 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-132-beastwarrior-bone-crusher-130`
- Accepted rule: 5 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dino + Dragon = unnamed 1750/2030 result

- Candidate: `wp-dinosaur-dragon` (source line 74)
- Expected result: #11 Sword Arm of Dragon
- All TEA pairs producing this result: 104
- Unconstrained candidate: 104 true positives, 691 no-fusion false positives, 21 wrong-result overlaps
- Inferred rule: `type-type-dinosaur-dragon-sword-arm-of-dragon-185`
- Accepted rule: 104 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dino + Machine = unnamed 1800/1600 result

- Candidate: `wp-dinosaur-machine` (source line 75)
- Expected result: #508 Cyber Saurus
- All TEA pairs producing this result: 135
- Unconstrained candidate: 135 true positives, 664 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-dinosaur-machine-cyber-saurus-180`
- Accepted rule: 135 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### 1800/1600 result + Machine = Cyber Dinosaur

- Candidate: `wp-cyber-saurus-machine` (source line 75)
- Expected result: #419 Cyber Dinosaur
- All TEA pairs producing this result: 35
- Unconstrained candidate: 35 true positives, 12 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-508-machine-cyber-dinosaur-16`
- Accepted rule: 35 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dino + Pyro = Volcanic Slicer

- Candidate: `wp-dinosaur-pyro` (source line 77)
- Expected result: #166 Volcanic Slicer
- All TEA pairs producing this result: 72
- Unconstrained candidate: 72 true positives, 234 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-dinosaur-pyro-volcanic-slicer-190`
- Accepted rule: 72 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dino + Zombie = unnamed 1200/1300 result

- Candidate: `wp-dinosaur-zombie` (source line 79)
- Expected result: #455 Fossil Dyna Pachycephalo
- All TEA pairs producing this result: 33
- Unconstrained candidate: 33 true positives, 511 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-dinosaur-zombie-fossil-dyna-pachycephalo-203`
- Accepted rule: 33 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dragon + Fairy = Victoria

- Candidate: `wp-dragon-fairy` (source line 90)
- Expected result: #111 Victoria
- All TEA pairs producing this result: 208
- Unconstrained candidate: 208 true positives, 1063 no-fusion false positives, 25 wrong-result overlaps
- Inferred rule: `type-type-dragon-fairy-victoria-160`
- Accepted rule: 208 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Victoria + Dragon = Victory Dragon

- Candidate: `wp-victoria-dragon` (source line 90)
- Expected result: #283 Victory Dragon
- All TEA pairs producing this result: 25
- Unconstrained candidate: 25 true positives, 23 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-111-dragon-victory-dragon-47`
- Accepted rule: 25 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dragon + Machine = Metal Dragon

- Candidate: `wp-dragon-machine` (source line 92)
- Expected result: #409 Metal Dragon
- All TEA pairs producing this result: 294
- Unconstrained candidate: 294 true positives, 1948 no-fusion false positives, 14 wrong-result overlaps
- Inferred rule: `type-type-dragon-machine-metal-dragon-148`
- Accepted rule: 294 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Metal Dragon + Pyro = Power Tool Dragon

- Candidate: `wp-metal-dragon-pyro` (source line 92)
- Expected result: #557 Power Tool Dragon
- All TEA pairs producing this result: 13
- Unconstrained candidate: 13 true positives, 5 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-409-pyro-power-tool-dragon-92`
- Accepted rule: 13 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dragon + Pyro = Solar Flare Dragon

- Candidate: `wp-dragon-pyro` (source line 93)
- Expected result: #31 Solar Flare Dragon
- All TEA pairs producing this result: 45
- Unconstrained candidate: 45 true positives, 806 no-fusion false positives, 13 wrong-result overlaps
- Inferred rule: `type-type-dragon-pyro-solar-flare-dragon-200`
- Accepted rule: 45 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Solar Flare Dragon + Fiend = Serpent Night Dragon

- Candidate: `wp-solar-flare-fiend` (source line 93)
- Expected result: #706 Serpent Night Dragon
- All TEA pairs producing this result: 34
- Unconstrained candidate: 34 true positives, 16 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-31-fiend-serpent-night-dragon-19`
- Accepted rule: 34 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dragon + Rock = Stone D.

- Candidate: `wp-dragon-rock` (source line 95)
- Expected result: #426 Stone D.
- All TEA pairs producing this result: 352
- Unconstrained candidate: 352 true positives, 1078 no-fusion false positives, 10 wrong-result overlaps
- Inferred rule: `type-type-dragon-rock-stone-d-145`
- Accepted rule: 352 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dragon + Seaserpent = Atlantean Dragoons

- Candidate: `wp-dragon-sea-serpent` (source line 97)
- Expected result: #384 Atlantean Dragoons
- All TEA pairs producing this result: 17
- Unconstrained candidate: 1 true positives, 515 no-fusion false positives, 12 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.

Status: RECLASSIFIED OR REJECTED

### Dragon + WingBeast = Winged Dragon #1

- Candidate: `wp-dragon-winged-beast` (source line 98)
- Expected result: #7 Winged Dragon #1
- All TEA pairs producing this result: 59
- Unconstrained candidate: 59 true positives, 944 no-fusion false positives, 5 wrong-result overlaps
- Inferred rule: `type-type-dragon-wingedbeast-winged-dragon-1-195`
- Accepted rule: 59 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Winged Dragon #1 + Warrior = Paladin of White Dragon

- Candidate: `wp-winged-dragon-warrior` (source line 98)
- Expected result: #383 Paladin of White Dragon
- All TEA pairs producing this result: 40
- Unconstrained candidate: 40 true positives, 16 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-7-warrior-paladin-of-white-dragon-14`
- Accepted rule: 40 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dragon + Zombie = Dragon Zombie

- Candidate: `wp-dragon-zombie` (source line 100)
- Expected result: #97 Dragon Zombie
- All TEA pairs producing this result: 150
- Unconstrained candidate: 150 true positives, 1263 no-fusion false positives, 123 wrong-result overlaps
- Inferred rule: `type-type-dragon-zombie-dragon-zombie-173`
- Accepted rule: 150 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dragon Zombie + Dragon = Dragon Queen of Tragic

- Candidate: `wp-dragon-zombie-dragon` (source line 100)
- Expected result: #561 Dragon Queen of Tragic
- All TEA pairs producing this result: 22
- Unconstrained candidate: 0 true positives, 45 no-fusion false positives, 3 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.
- TEA correction: `#97 Dragon Zombie + Zombie (ATK < 1900) -> #561 Dragon Queen of Tragic`.

Status: WORDPRESS RULE CORRECTED

### Dragon Queen of Tragic + Dragon = Doomkaiser Dragon

- Candidate: `wp-dragon-queen-dragon` (source line 100)
- Expected result: #105 Doomkaiser Dragon
- All TEA pairs producing this result: 59
- Unconstrained candidate: 0 true positives, 48 no-fusion false positives, 0 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.
- TEA correction: `#561 Dragon Queen of Tragic + Zombie (ATK < 2900) -> #105 Doomkaiser Dragon`.

Status: WORDPRESS RULE CORRECTED

### Doomkaiser Dragon + Dragon = Berserk Dragon

- Candidate: `wp-doomkaiser-dragon` (source line 102)
- Expected result: #270 Berserk Dragon
- All TEA pairs producing this result: 74
- Unconstrained candidate: 43 true positives, 5 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-105-dragon-berserk-dragon-7`
- Accepted rule: 43 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Doomkaiser Dragon + Zombie = Berserk Dragon

- Candidate: `wp-doomkaiser-zombie` (source line 103)
- Expected result: #270 Berserk Dragon
- All TEA pairs producing this result: 74
- Unconstrained candidate: 31 true positives, 1 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-105-zombie-berserk-dragon-23`
- Accepted rule: 31 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Fairy + Pyro = Rasetsu

- Candidate: `wp-fairy-pyro` (source line 114)
- Expected result: #608 Rasetsu
- All TEA pairs producing this result: 50
- Unconstrained candidate: 50 true positives, 436 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-fairy-pyro-rasetsu-198`
- Accepted rule: 50 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Fairy + Spellcaster = Sage Of The Sky

- Candidate: `wp-fairy-spellcaster` (source line 116)
- Expected result: #126 Sage of the Sky
- All TEA pairs producing this result: 434
- Unconstrained candidate: 434 true positives, 889 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-fairy-spellcaster-sage-of-the-sky-142`
- Accepted rule: 434 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Sage Of The Sky + Warrior = Luminous Soldier

- Candidate: `wp-sage-warrior` (source line 116)
- Expected result: #618 Luminous Soldier
- All TEA pairs producing this result: 43
- Unconstrained candidate: 43 true positives, 12 no-fusion false positives, 1 wrong-result overlaps
- Inferred rule: `exact-type-card-126-warrior-luminous-soldier-8`
- Accepted rule: 43 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Fairy + Warrior = Celtic Guardian

- Candidate: `wp-fairy-warrior` (source line 117)
- Expected result: #41 Celtic Guardian
- All TEA pairs producing this result: 220
- Unconstrained candidate: 220 true positives, 1166 no-fusion false positives, 126 wrong-result overlaps
- Inferred rule: `type-type-fairy-warrior-celtic-guardian-159`
- Accepted rule: 220 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Celtic Guardian + Fairy = Airknight Parshath

- Candidate: `wp-celtic-guardian-fairy` (source line 117)
- Expected result: #605 Airknight Parshath
- All TEA pairs producing this result: 19
- Unconstrained candidate: 19 true positives, 7 no-fusion false positives, 1 wrong-result overlaps
- Inferred rule: `exact-type-card-41-fairy-airknight-parshath-71`
- Accepted rule: 19 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Fairy + WingBeast = Cockadoodledoo

- Candidate: `wp-fairy-winged-beast` (source line 119)
- Expected result: #125 Cockadoodledoo
- All TEA pairs producing this result: 140
- Unconstrained candidate: 140 true positives, 374 no-fusion false positives, 53 wrong-result overlaps
- Inferred rule: `type-type-fairy-wingedbeast-cockadoodledoo-179`
- Accepted rule: 140 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Fiend + Insect = Aztekipede

- Candidate: `wp-fiend-insect` (source line 130)
- Expected result: #54 Aztekipede
- All TEA pairs producing this result: 527
- Unconstrained candidate: 527 true positives, 981 no-fusion false positives, 42 wrong-result overlaps
- Inferred rule: `type-type-fiend-insect-aztekipede-137`
- Accepted rule: 527 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Aztekipede + Fiend = Hell Centipede

- Candidate: `wp-aztekipede-fiend` (source line 132)
- Expected result: #152 Hell Centipede
- All TEA pairs producing this result: 82
- Unconstrained candidate: 42 true positives, 8 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-54-fiend-hell-centipede-9`
- Accepted rule: 42 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Hell Centipede + Plant = Doom Dozer

- Candidate: `wp-hell-centipede-plant` (source line 133)
- Expected result: #536 Doom Dozer
- All TEA pairs producing this result: 58
- Unconstrained candidate: 0 true positives, 24 no-fusion false positives, 0 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.

Status: RECLASSIFIED OR REJECTED

### Hell Centipede + Rock = Doom Dozer

- Candidate: `wp-hell-centipede-rock` (source line 135)
- Expected result: #536 Doom Dozer
- All TEA pairs producing this result: 58
- Unconstrained candidate: 0 true positives, 30 no-fusion false positives, 0 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.

Status: RECLASSIFIED OR REJECTED

### Fiend + Rock = Medium Piece Golem

- Candidate: `wp-fiend-rock` (source line 137)
- Expected result: #623 Medium Piece Golem
- All TEA pairs producing this result: 525
- Unconstrained candidate: 522 true positives, 903 no-fusion false positives, 75 wrong-result overlaps
- Inferred rule: `type-type-fiend-rock-medium-piece-golem-138`
- Accepted rule: 522 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Medium Piece Golem + Fiend = Millennium Golem

- Candidate: `wp-medium-golem-fiend` (source line 137)
- Expected result: #453 Millennium Golem
- All TEA pairs producing this result: 73
- Unconstrained candidate: 32 true positives, 17 no-fusion false positives, 1 wrong-result overlaps
- Inferred rule: `exact-type-card-623-fiend-millennium-golem-21`
- Accepted rule: 32 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Fish + Machine = Misairuzame

- Candidate: `wp-fish-machine` (source line 146)
- Expected result: #542 Misairuzame
- All TEA pairs producing this result: 7
- Unconstrained candidate: 7 true positives, 1048 no-fusion false positives, 26 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.

Status: RECLASSIFIED OR REJECTED

### Misairuzame + Machine = Orca Mega-Fortress of Darkness

- Candidate: `wp-misairuzame-machine` (source line 146)
- Expected result: #447 Orca Mega Fortress
- All TEA pairs producing this result: 34
- Unconstrained candidate: 26 true positives, 21 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-542-machine-orca-mega-fortress-42`
- Accepted rule: 26 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Orca Mega-Fortress of Darkness + Fish = Fortress Whale

- Candidate: `wp-orca-fish` (source line 146)
- Expected result: #718 Fortress Whale
- All TEA pairs producing this result: 14
- Unconstrained candidate: 13 true positives, 10 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-447-fish-fortress-whale-93`
- Accepted rule: 13 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Fish + Thunder = Royal Swamp Eel

- Candidate: `wp-fish-thunder` (source line 148)
- Expected result: #230 Royal Swamp Eel
- All TEA pairs producing this result: 81
- Unconstrained candidate: 81 true positives, 282 no-fusion false positives, 5 wrong-result overlaps
- Inferred rule: `type-type-fish-thunder-royal-swamp-eel-189`
- Accepted rule: 81 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Fish + Zombie = Corroding Shark

- Candidate: `wp-fish-zombie` (source line 149)
- Expected result: #539 Corroding Shark
- All TEA pairs producing this result: 40
- Unconstrained candidate: 40 true positives, 682 no-fusion false positives, 14 wrong-result overlaps
- Inferred rule: `type-type-fish-zombie-corroding-shark-202`
- Accepted rule: 40 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Corroding Shark + Fish = Terrorking Salmon

- Candidate: `wp-corroding-shark-fish` (source line 149)
- Expected result: #452 Terrorking Salmon
- All TEA pairs producing this result: 15
- Unconstrained candidate: 14 true positives, 9 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-539-fish-terrorking-salmon-87`
- Accepted rule: 14 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Machine + Pyro = Robotic Knight

- Candidate: `wp-machine-pyro` (source line 178)
- Expected result: #172 Robotic Knight
- All TEA pairs producing this result: 84
- Unconstrained candidate: 84 true positives, 747 no-fusion false positives, 15 wrong-result overlaps
- Inferred rule: `type-type-machine-pyro-robotic-knight-187`
- Accepted rule: 84 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Machine + Warrior = Giant Mech-Soldier

- Candidate: `wp-machine-warrior` (source line 180)
- Expected result: #408 Giant Mech-soldier
- All TEA pairs producing this result: 455
- Unconstrained candidate: 455 true positives, 2177 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-machine-warrior-giant-mech-soldier-140`
- Accepted rule: 455 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Plant + Pyro = Blazing Inpachi

- Candidate: `wp-plant-pyro` (source line 187)
- Expected result: #451 Blazing Inpachi
- All TEA pairs producing this result: 144
- Unconstrained candidate: 144 true positives, 288 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-plant-pyro-blazing-inpachi-177`
- Accepted rule: 144 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Plant + Warrior = Naturia Guardian

- Candidate: `wp-plant-warrior` (source line 189)
- Expected result: #511 Naturia Guardian
- All TEA pairs producing this result: 290
- Unconstrained candidate: 290 true positives, 1039 no-fusion false positives, 15 wrong-result overlaps
- Inferred rule: `type-type-plant-warrior-naturia-guardian-149`
- Accepted rule: 290 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Pyro + Spellcaster = unnamed 1500/1600 result

- Candidate: `wp-pyro-spellcaster` (source line 207)
- Expected result: #133 Flame Ruler
- All TEA pairs producing this result: 144
- Unconstrained candidate: 144 true positives, 736 no-fusion false positives, 2 wrong-result overlaps
- Inferred rule: `type-type-pyro-spellcaster-flame-ruler-176`
- Accepted rule: 144 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### 1500/1600 result + Pyro = Mr. Volcano

- Candidate: `wp-flame-ruler-pyro` (source line 207)
- Expected result: #292 Mr. Volcano
- All TEA pairs producing this result: 10
- Unconstrained candidate: 10 true positives, 8 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-133-pyro-mr-volcano-108`
- Accepted rule: 10 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Pyro + Thunder = Topaz

- Candidate: `wp-pyro-thunder` (source line 209)
- Expected result: #462 Topaz
- All TEA pairs producing this result: 72
- Unconstrained candidate: 72 true positives, 216 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-pyro-thunder-topaz-191`
- Accepted rule: 72 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Pyro + Warrior = Flame Swordsman

- Candidate: `wp-pyro-warrior` (source line 210)
- Expected result: #15 Flame Swordsman
- All TEA pairs producing this result: 280
- Unconstrained candidate: 280 true positives, 728 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-pyro-warrior-flame-swordsman-152`
- Accepted rule: 280 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Pyro + WingBeast = Mavelus

- Candidate: `wp-pyro-winged-beast` (source line 212)
- Expected result: #272 Mavelus
- All TEA pairs producing this result: 0
- Unconstrained candidate: 0 true positives, 341 no-fusion false positives, 37 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.
- TEA contains no material pair whose result is #272 Mavelus; only later Mavelus chains are present.

Status: WORDPRESS RULE REJECTED

### Mavelus + Pyro = Crimson Sunbird

- Candidate: `wp-mavelus-pyro` (source line 212)
- Expected result: #467 Crimson Sunbird
- All TEA pairs producing this result: 13
- Unconstrained candidate: 13 true positives, 5 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-272-pyro-crimson-sunbird-91`
- Accepted rule: 13 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Crimson Sunbird + Pyro = Blaze Fenix

- Candidate: `wp-crimson-sunbird-pyro` (source line 212)
- Expected result: #577 Blaze Fenix
- All TEA pairs producing this result: 14
- Unconstrained candidate: 14 true positives, 4 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-467-pyro-blaze-fenix-85`
- Accepted rule: 14 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Seaserpent + Thunder = Watthydra

- Candidate: `wp-sea-serpent-thunder` (source line 240)
- Expected result: #45 Watthydra
- All TEA pairs producing this result: 15
- Unconstrained candidate: 0 true positives, 176 no-fusion false positives, 0 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.

Status: RECLASSIFIED OR REJECTED

### Spellcaster + Warrior = Blast Magician

- Candidate: `wp-spellcaster-warrior` (source line 252)
- Expected result: #142 Blast Magician
- All TEA pairs producing this result: 286
- Unconstrained candidate: 286 true positives, 2374 no-fusion false positives, 84 wrong-result overlaps
- Inferred rule: `type-type-spellcaster-warrior-blast-magician-151`
- Accepted rule: 286 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Blast Magician + Warrior = Dark Red Enchanter

- Candidate: `wp-blast-magician-warrior` (source line 252)
- Expected result: #128 Dark Red Enchanter
- All TEA pairs producing this result: 34
- Unconstrained candidate: 34 true positives, 22 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-142-warrior-dark-red-enchanter-17`
- Accepted rule: 34 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Dark Red Enchanter + Warrior = Dark Eradicator Warlock

- Candidate: `wp-dark-red-enchanter-warrior` (source line 252)
- Expected result: #34 Dark Eradicator Warlock
- All TEA pairs producing this result: 49
- Unconstrained candidate: 49 true positives, 7 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `exact-type-card-128-warrior-dark-eradicator-warlock-1`
- Accepted rule: 49 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### Thunder + Warrior = The Creator Incarnate

- Candidate: `wp-thunder-warrior` (source line 264)
- Expected result: #376 The Creator Incarnate
- All TEA pairs producing this result: 203
- Unconstrained candidate: 203 true positives, 691 no-fusion false positives, 2 wrong-result overlaps
- Inferred rule: `type-type-thunder-warrior-the-creator-incarnate-161`
- Accepted rule: 203 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### The Creator Incarnate + Thunder = The Creator

- Candidate: `wp-creator-incarnate-thunder` (source line 264)
- Expected result: #170 The Creator
- All TEA pairs producing this result: 1
- Unconstrained candidate: 1 true positives, 15 no-fusion false positives, 0 wrong-result overlaps
- No equivalent generalized rule was accepted; applicable TEA pairs remain reclassified or explicit.

Status: RECLASSIFIED OR REJECTED

### Warrior + Zombie = Zombie Warrior

- Candidate: `wp-warrior-zombie` (source line 283)
- Expected result: #30 Zombie Warrior
- All TEA pairs producing this result: 220
- Unconstrained candidate: 220 true positives, 1498 no-fusion false positives, 74 wrong-result overlaps
- Inferred rule: `type-type-warrior-zombie-zombie-warrior-158`
- Accepted rule: 220 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

### WingBeast + Zombie = Skullbird

- Candidate: `wp-winged-beast-zombie` (source line 293)
- Expected result: #521 Skullbird
- All TEA pairs producing this result: 322
- Unconstrained candidate: 322 true positives, 350 no-fusion false positives, 0 wrong-result overlaps
- Inferred rule: `type-type-wingedbeast-zombie-skullbird-147`
- Accepted rule: 322 true positives, 0 false positives after precedence, 0 false negatives within its declared matcher

Status: VALIDATED WITH TEA CONSTRAINTS

## Accepted generalized rules

### #128 Dark Red Enchanter + Warrior, ATK < 2500 -> #34 Dark Eradicator Warlock

- Rule ID: `exact-type-card-128-warrior-dark-eradicator-warlock-1`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dark-red-enchanter-warrior`)
- TEA target pairs: 49
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1700-1700 / 0-2350
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #53 Naturia Stag Beetle + Warrior, ATK < 2450 -> #717 Javelin Beetle

- Rule ID: `exact-type-card-53-warrior-javelin-beetle-2`
- Provenance: `tea-inferred`
- TEA target pairs: 49
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2200-2200 / 0-2350
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #533 Kwagar Hercules + Warrior, ATK < 2450 -> #717 Javelin Beetle

- Rule ID: `exact-type-card-533-warrior-javelin-beetle-3`
- Provenance: `tea-inferred`
- TEA target pairs: 49
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1900-1900 / 0-2350
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #605 Airknight Parshath + Warrior, ATK < 2300 -> #673 Divine Knight Ishzark

- Rule ID: `exact-type-card-605-warrior-divine-knight-ishzark-4`
- Provenance: `tea-inferred`
- TEA target pairs: 46
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1900-1900 / 0-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #473 Volcanic Hammerer + Fiend, ATK < 3000 -> #208 Volcanic Doomfire

- Rule ID: `exact-type-card-473-fiend-volcanic-doomfire-5`
- Provenance: `tea-inferred`
- TEA target pairs: 45
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2400-2400 / 200-2800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #582 Zeradias, Herald of Heaven + Fiend, ATK < 2800 -> #88 Mazera DeVille

- Rule ID: `exact-type-card-582-fiend-mazera-deville-6`
- Provenance: `tea-inferred`
- TEA target pairs: 43
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2100-2100 / 200-2600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #105 Doomkaiser Dragon + Dragon, ATK < 3500 -> #270 Berserk Dragon

- Rule ID: `exact-type-card-105-dragon-berserk-dragon-7`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-doomkaiser-dragon`)
- TEA target pairs: 43
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2900-2900 / 300-3200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #126 Sage of the Sky + Warrior, ATK < 2100 -> #618 Luminous Soldier

- Rule ID: `exact-type-card-126-warrior-luminous-soldier-8`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-sage-warrior`)
- TEA target pairs: 43
- Pairs superseded by a more-specific TEA recipe: 1
- Material ATK ranges in target pairs: 1600-1600 / 0-2050
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #54 Aztekipede + Fiend, ATK < 2600 -> #152 Hell Centipede

- Rule ID: `exact-type-card-54-fiend-hell-centipede-9`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-aztekipede-fiend`)
- TEA target pairs: 42
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1900-1900 / 200-2500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #80 Gladiator Beast Spartacus + Fiend, ATK < 2600 -> #354 Gaiodiaz

- Rule ID: `exact-type-card-80-fiend-gaiodiaz-10`
- Provenance: `tea-inferred`
- TEA target pairs: 42
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2200-2200 / 200-2500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #109 Big Piece Golem + Fiend, ATK < 2600 -> #649 Multiple Piece Golem

- Rule ID: `exact-type-card-109-fiend-multiple-piece-golem-11`
- Provenance: `tea-inferred`
- TEA target pairs: 42
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2100-2100 / 200-2500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #74 Giant Soldier of Stone + Warrior, ATK < 2000 -> #453 Millennium Golem

- Rule ID: `exact-type-card-74-warrior-millennium-golem-12`
- Provenance: `tea-inferred`
- TEA target pairs: 41
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1300-1300 / 0-1950
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #479 Bujingi Centipede + Fiend, ATK < 2600 -> #152 Hell Centipede

- Rule ID: `exact-type-card-479-fiend-hell-centipede-13`
- Provenance: `tea-inferred`
- TEA target pairs: 40
- Pairs superseded by a more-specific TEA recipe: 2
- Material ATK ranges in target pairs: 1700-1700 / 200-2500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #7 Winged Dragon #1 + Warrior, ATK < 1900 -> #383 Paladin of White Dragon

- Rule ID: `exact-type-card-7-warrior-paladin-of-white-dragon-14`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-winged-dragon-warrior`)
- TEA target pairs: 40
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1400-1400 / 0-1850
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #52 Hercules Beetle + Warrior, ATK < 1900 -> #533 Kwagar Hercules

- Rule ID: `exact-type-card-52-warrior-kwagar-hercules-15`
- Provenance: `tea-inferred`
- TEA target pairs: 40
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1500-1500 / 0-1850
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #508 Cyber Saurus + Machine, ATK < 2500 -> #419 Cyber Dinosaur

- Rule ID: `exact-type-card-508-machine-cyber-dinosaur-16`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-cyber-saurus-machine`)
- TEA target pairs: 35
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1800-1800 / 100-2400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #142 Blast Magician + Warrior, ATK < 1700 -> #128 Dark Red Enchanter

- Rule ID: `exact-type-card-142-warrior-dark-red-enchanter-17`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-blast-magician-warrior`)
- TEA target pairs: 34
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1400-1400 / 0-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #219 Alien Skull + Fiend, ATK < 2300 -> #450 Alien Mother

- Rule ID: `exact-type-card-219-fiend-alien-mother-18`
- Provenance: `tea-inferred`
- TEA target pairs: 34
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 200-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #31 Solar Flare Dragon + Fiend, ATK < 2350 -> #706 Serpent Night Dragon

- Rule ID: `exact-type-card-31-fiend-serpent-night-dragon-19`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-solar-flare-fiend`)
- TEA target pairs: 34
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1500-1500 / 200-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #567 Darkworld Thorns + Fiend, ATK < 2400 -> #158 Gigaplant

- Rule ID: `exact-type-card-567-fiend-gigaplant-20`
- Provenance: `tea-inferred`
- TEA target pairs: 33
- Pairs superseded by a more-specific TEA recipe: 1
- Material ATK ranges in target pairs: 1200-1200 / 200-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #623 Medium Piece Golem + Fiend, ATK < 2000 -> #453 Millennium Golem

- Rule ID: `exact-type-card-623-fiend-millennium-golem-21`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-medium-golem-fiend`)
- TEA target pairs: 32
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 200-1900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #622 Magician's Valkyria + Fiend, ATK < 2000 -> #551 Reaper of Prophecy

- Rule ID: `exact-type-card-622-fiend-reaper-of-prophecy-22`
- Provenance: `tea-inferred`
- TEA target pairs: 32
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 200-1900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #105 Doomkaiser Dragon + Zombie, ATK < 3500 -> #270 Berserk Dragon

- Rule ID: `exact-type-card-105-zombie-berserk-dragon-23`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-doomkaiser-zombie`)
- TEA target pairs: 31
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2900-2900 / 0-2900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #180 Blackship of Corn + Aqua, ATK < 2300, excluding #160, #250, #435 -> #430 Ferrylotus

- Rule ID: `exact-type-card-180-aqua-ferrylotus-24`
- Provenance: `tea-inferred`
- TEA target pairs: 31
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2100-2100 / 0-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #53 Naturia Stag Beetle + Aqua, ATK < 2500, excluding #160, #250, #258, #435 -> #587 Great Poseidon Beetle

- Rule ID: `exact-type-card-53-aqua-great-poseidon-beetle-25`
- Provenance: `tea-inferred`
- TEA target pairs: 31
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2200-2200 / 0-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #427 Kaiser Dragon + Zombie, ATK < 2900 -> #105 Doomkaiser Dragon

- Rule ID: `exact-type-card-427-zombie-doomkaiser-dragon-26`
- Provenance: `tea-inferred`
- TEA target pairs: 30
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2300-2300 / 0-2800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #561 Dragon Queen of Tragic + Zombie, ATK < 2900 -> #105 Doomkaiser Dragon

- Rule ID: `exact-type-card-561-zombie-doomkaiser-dragon-27`
- Provenance: `wordpress-basic-corrected-by-tea`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 1
- Material ATK ranges in target pairs: 1900-1900 / 0-2800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #30 Zombie Warrior + Warrior, ATK < 1600 -> #351 Royal Keeper

- Rule ID: `exact-type-card-30-warrior-royal-keeper-28`
- Provenance: `tea-inferred`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1200-1200 / 0-1550
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #479 Bujingi Centipede + Rock, ATK < 2800 -> #536 Doom Dozer

- Rule ID: `exact-type-card-479-rock-doom-dozer-29`
- Provenance: `tea-inferred`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1700-1700 / 0-2600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #71 Spined Gillman + Aqua, ATK < 1800, excluding #160, #250, #435 -> #432 Leviair the Sea Dragon

- Rule ID: `exact-type-card-71-aqua-leviair-the-sea-dragon-30`
- Provenance: `tea-inferred`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1300-1300 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #160 Gishki Vision + Aqua, ATK < 1800, excluding #160, #250, #435 -> #432 Leviair the Sea Dragon

- Rule ID: `exact-type-card-160-aqua-leviair-the-sea-dragon-31`
- Provenance: `tea-inferred`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 700-700 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #250 Skystarray + Aqua, ATK < 1800, excluding #160, #250, #435 -> #432 Leviair the Sea Dragon

- Rule ID: `exact-type-card-250-aqua-leviair-the-sea-dragon-32`
- Provenance: `tea-inferred`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 600-600 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #435 The D. Dwelling in the Deep + Aqua, ATK < 1800, excluding #160, #250, #435 -> #432 Leviair the Sea Dragon

- Rule ID: `exact-type-card-435-aqua-leviair-the-sea-dragon-33`
- Provenance: `tea-inferred`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1700-1700 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #448 Spike Seadra + Aqua, ATK < 1800, excluding #160, #250, #435 -> #432 Leviair the Sea Dragon

- Rule ID: `exact-type-card-448-aqua-leviair-the-sea-dragon-34`
- Provenance: `tea-inferred`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #41 Celtic Guardian + Aqua, ATK < 2000, excluding #160, #250, #435 -> #621 Royal Knight

- Rule ID: `exact-type-card-41-aqua-royal-knight-35`
- Provenance: `tea-inferred`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 1
- Material ATK ranges in target pairs: 1400-1400 / 0-1900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #507 Ocean's Keeper + Aqua, ATK < 1900, excluding #160, #250, #435 -> #624 Warrior of Atlantis

- Rule ID: `exact-type-card-507-aqua-warrior-of-atlantis-36`
- Provenance: `tea-inferred`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1500-1500 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #553 Blizzard Warrior + Aqua, ATK < 1850, excluding #160, #250, #435 -> #641 The Legendary Fisherman

- Rule ID: `exact-type-card-553-aqua-the-legendary-fisherman-37`
- Provenance: `tea-inferred`
- TEA target pairs: 29
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1400-1400 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #103 Legendary Fiend + Machine, ATK < 2200 -> #607 The Fiend Megacyber

- Rule ID: `exact-type-card-103-machine-the-fiend-megacyber-38`
- Provenance: `tea-inferred`
- TEA target pairs: 28
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1500-1500 / 100-2100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #54 Aztekipede + Rock, ATK < 2800, excluding #156 -> #536 Doom Dozer

- Rule ID: `exact-type-card-54-rock-doom-dozer-39`
- Provenance: `tea-inferred`
- TEA target pairs: 28
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1900-1900 / 0-2600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #581 Lanista + Rock, ATK < 2400 -> #632 Hieracosphinx

- Rule ID: `exact-type-card-581-rock-hieracosphinx-40`
- Provenance: `tea-inferred`
- TEA target pairs: 27
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1800-1800 / 0-2350
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #55 Numbing Grub + Aqua, ATK < 1700, excluding #160, #250 -> #150 Akihiron

- Rule ID: `exact-type-card-55-aqua-akihiron-41`
- Provenance: `tea-inferred`
- TEA target pairs: 27
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1300-1300 / 0-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #542 Misairuzame + Machine, ATK < 2100 -> #447 Orca Mega Fortress

- Rule ID: `exact-type-card-542-machine-orca-mega-fortress-42`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-misairuzame-machine`)
- TEA target pairs: 26
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1400-1400 / 100-2000
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #260 Naturia White Oak + Rock, ATK < 2350 -> #702 Naturia Landoise

- Rule ID: `exact-type-card-260-rock-naturia-landoise-43`
- Provenance: `tea-inferred`
- TEA target pairs: 26
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1800-1800 / 0-2100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #658 Metalmorph + Dragon, ATK < 2400 -> #10 Rare Metal Dragon

- Rule ID: `exact-type-card-658-dragon-rare-metal-dragon-44`
- Provenance: `tea-inferred`
- TEA target pairs: 25
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: n/a / 300-2350
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #285 Serpent Marauder + Fiend, ATK < 1400 -> #77 Worm Drake

- Rule ID: `exact-type-card-285-fiend-worm-drake-45`
- Provenance: `tea-inferred`
- TEA target pairs: 25
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 700-700 / 200-1380
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #566 Yormungarde + Dragon, ATK < 2400 -> #248 Bitelon

- Rule ID: `exact-type-card-566-dragon-bitelon-46`
- Provenance: `tea-inferred`
- TEA target pairs: 25
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1200-1200 / 300-2350
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #111 Victoria + Dragon, ATK < 2400 -> #283 Victory Dragon

- Rule ID: `exact-type-card-111-dragon-victory-dragon-47`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-victoria-dragon`)
- TEA target pairs: 25
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1800-1800 / 300-2350
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #595 Fushi no Tori + Machine, ATK < 2400 -> #465 Sacred Phoenix of Nephthys

- Rule ID: `exact-type-card-595-machine-sacred-phoenix-of-nephthys-48`
- Provenance: `tea-inferred`
- TEA target pairs: 25
- Pairs superseded by a more-specific TEA recipe: 7
- Material ATK ranges in target pairs: 1200-1200 / 1400-2300
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #545 Skelgon + Zombie, ATK < 2000 -> #39 Curse of Dragon

- Rule ID: `exact-type-card-545-zombie-curse-of-dragon-49`
- Provenance: `tea-inferred`
- TEA target pairs: 24
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1700-1700 / 0-1900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #85 King of Yamimakai + Beast, ATK < 2400 -> #61 Beast of Talwar

- Rule ID: `exact-type-card-85-beast-beast-of-talwar-50`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-king-yamimakai-beast`)
- TEA target pairs: 24
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2000-2000 / 100-2300
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #548 Spirit Reaper + Fiend, ATK < 1380 -> #84 Reaper of the Cards

- Rule ID: `exact-type-card-548-fiend-reaper-of-the-cards-51`
- Provenance: `tea-inferred`
- TEA target pairs: 24
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-300 / 200-1300
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #509 Bracchio-raidus + Beast, ATK < 2500 -> #98 Ghoulungulate

- Rule ID: `exact-type-card-509-beast-ghoulungulate-52`
- Provenance: `tea-inferred`
- TEA target pairs: 24
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2200-2200 / 100-2300
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #622 Magician's Valkyria + Rock, ATK < 2100 -> #531 Mystical Sand

- Rule ID: `exact-type-card-622-rock-mystical-sand-53`
- Provenance: `tea-inferred`
- TEA target pairs: 24
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 0-2000
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #470 Vampire Sorcerer + Zombie, ATK < 2000 -> #241 Patrician of Darkness

- Rule ID: `exact-type-card-470-zombie-patrician-of-darkness-54`
- Provenance: `tea-inferred`
- TEA target pairs: 23
- Pairs superseded by a more-specific TEA recipe: 1
- Material ATK ranges in target pairs: 1500-1500 / 0-1900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #523 D. Driceratops + Plant, ATK < 2800 -> #464 Windrose

- Rule ID: `exact-type-card-523-plant-windrose-55`
- Provenance: `tea-inferred`
- TEA target pairs: 23
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2400-2400 / 300-2600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #120 Skull Mariner + Zombie, ATK < 1900 -> #526 Ghost Ship

- Rule ID: `exact-type-card-120-zombie-ghost-ship-56`
- Provenance: `tea-inferred`
- TEA target pairs: 23
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 0-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #205 Yomi Ship + Zombie, ATK < 1900 -> #526 Ghost Ship

- Rule ID: `exact-type-card-205-zombie-ghost-ship-57`
- Provenance: `tea-inferred`
- TEA target pairs: 23
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 800-800 / 0-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #598 Naturia Beast + Plant, ATK < 2800 -> #544 Naturia Exterio

- Rule ID: `exact-type-card-598-plant-naturia-exterio-58`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-naturia-beast-plant`)
- TEA target pairs: 23
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2200-2200 / 300-2600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #582 Zeradias, Herald of Heaven + Fairy, ATK < 2800 -> #106 Archlord Zerato

- Rule ID: `exact-type-card-582-fairy-archlord-zerato-59`
- Provenance: `tea-inferred`
- TEA target pairs: 22
- Pairs superseded by a more-specific TEA recipe: 1
- Material ATK ranges in target pairs: 2100-2100 / 0-2750
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #272 Mavelus + Beast, ATK < 2250 -> #714 Firewing Pegasus

- Rule ID: `exact-type-card-272-beast-firewing-pegasus-60`
- Provenance: `tea-inferred`
- TEA target pairs: 22
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1300-1300 / 100-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #552 Firebird + Beast, ATK < 2250 -> #714 Firewing Pegasus

- Rule ID: `exact-type-card-552-beast-firewing-pegasus-61`
- Provenance: `tea-inferred`
- TEA target pairs: 22
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1000-1000 / 100-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #595 Fushi no Tori + Beast, ATK < 2250 -> #714 Firewing Pegasus

- Rule ID: `exact-type-card-595-beast-firewing-pegasus-62`
- Provenance: `tea-inferred`
- TEA target pairs: 22
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1200-1200 / 100-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #165 Chaosrider Gustaph + Zombie, ATK < 1900 -> #719 Dokurorider

- Rule ID: `exact-type-card-165-zombie-dokurorider-63`
- Provenance: `tea-inferred`
- TEA target pairs: 22
- Pairs superseded by a more-specific TEA recipe: 1
- Material ATK ranges in target pairs: 1400-1400 / 0-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #146 Temple of Skulls + Spellcaster, ATK < 2400, excluding #2, #16, #129, #142, #183, #190, #213, #284, #352, #428, #433, #525, #530, #532, #574, #619, #622 -> #279 Ryu-Kokki

- Rule ID: `exact-type-card-146-spellcaster-ryu-kokki-64`
- Provenance: `tea-inferred`
- TEA target pairs: 22
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 900-900 / 0-2000
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #11 Sword Arm of Dragon + Dragon, ATK < 2200 -> #33 Ryu-Ran

- Rule ID: `exact-type-card-11-dragon-ryu-ran-65`
- Provenance: `tea-inferred`
- TEA target pairs: 21
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1750-1750 / 300-2100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #233 Berfomet + Beast, ATK < 2000 -> #85 King of Yamimakai

- Rule ID: `exact-type-card-233-beast-king-of-yamimakai-66`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-berfomet-beast`)
- TEA target pairs: 21
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1400-1400 / 100-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #97 Dragon Zombie + Zombie, ATK < 1900 -> #561 Dragon Queen of Tragic

- Rule ID: `exact-type-card-97-zombie-dragon-queen-of-tragic-67`
- Provenance: `wordpress-basic-corrected-by-tea`
- TEA target pairs: 21
- Pairs superseded by a more-specific TEA recipe: 2
- Material ATK ranges in target pairs: 1600-1600 / 0-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #246 Wolf Axwielder + Fairy, ATK < 2100 -> #287 Wulf, Lightsworn Beast

- Rule ID: `exact-type-card-246-fairy-wulf-lightsworn-beast-68`
- Provenance: `tea-inferred`
- TEA target pairs: 20
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1650-1650 / 0-1900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #273 Botanical Lion + Beast, ATK < 2200, excluding #404 -> #598 Naturia Beast

- Rule ID: `exact-type-card-273-beast-naturia-beast-69`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-botanical-lion-beast`)
- TEA target pairs: 20
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 100-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #588 Snap Dragon + Dragon, ATK < 2100 -> #571 B. Dragon Jungle King

- Rule ID: `exact-type-card-588-dragon-b-dragon-jungle-king-70`
- Provenance: `tea-inferred`
- TEA target pairs: 19
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-300 / 300-2000
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #41 Celtic Guardian + Fairy, ATK < 1900 -> #605 Airknight Parshath

- Rule ID: `exact-type-card-41-fairy-airknight-parshath-71`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-celtic-guardian-fairy`)
- TEA target pairs: 19
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1400-1400 / 0-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #151 Warrior of Zera + Fairy, ATK < 2100 -> #582 Zeradias, Herald of Heaven

- Rule ID: `exact-type-card-151-fairy-zeradias-herald-of-heaven-72`
- Provenance: `tea-inferred`
- TEA target pairs: 18
- Pairs superseded by a more-specific TEA recipe: 2
- Material ATK ranges in target pairs: 1600-1600 / 0-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #545 Skelgon + Dragon, ATK < 2000 -> #39 Curse of Dragon

- Rule ID: `exact-type-card-545-dragon-curse-of-dragon-73`
- Provenance: `tea-inferred`
- TEA target pairs: 17
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1700-1700 / 300-1900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #396 Ocubeam + Beast, ATK < 1800 -> #403 Sunlight Unicorn

- Rule ID: `exact-type-card-396-beast-sunlight-unicorn-74`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-ocubeam-beast`)
- TEA target pairs: 17
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1550-1550 / 100-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #251 Bio-Mage + Fairy, ATK < 1800 -> #90 Gyakutenno Megami

- Rule ID: `exact-type-card-251-fairy-gyakutenno-megami-75`
- Provenance: `tea-inferred`
- TEA target pairs: 16
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1150-1150 / 0-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #449 30,000-Year Whith Turtle + Rock, ATK < 1450 -> #518 Boulder Tortoise

- Rule ID: `exact-type-card-449-rock-boulder-tortoise-76`
- Provenance: `tea-inferred`
- TEA target pairs: 16
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1250-1250 / 0-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #474 Island Turtle + Rock, ATK < 1450 -> #518 Boulder Tortoise

- Rule ID: `exact-type-card-474-rock-boulder-tortoise-77`
- Provenance: `tea-inferred`
- TEA target pairs: 16
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1100-1100 / 0-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #646 Gora Turtle + Rock, ATK < 1450 -> #518 Boulder Tortoise

- Rule ID: `exact-type-card-646-rock-boulder-tortoise-78`
- Provenance: `tea-inferred`
- TEA target pairs: 16
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1100-1100 / 0-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #120 Skull Mariner + Plant, ATK < 2100, excluding #260 -> #180 Blackship of Corn

- Rule ID: `exact-type-card-120-plant-blackship-of-corn-79`
- Provenance: `tea-inferred`
- TEA target pairs: 15
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 300-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #205 Yomi Ship + Plant, ATK < 2100, excluding #260 -> #180 Blackship of Corn

- Rule ID: `exact-type-card-205-plant-blackship-of-corn-80`
- Provenance: `tea-inferred`
- TEA target pairs: 15
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 800-800 / 300-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #526 Ghost Ship + Plant, ATK < 2100, excluding #260 -> #180 Blackship of Corn

- Rule ID: `exact-type-card-526-plant-blackship-of-corn-81`
- Provenance: `tea-inferred`
- TEA target pairs: 15
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1900-1900 / 300-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #89 Catapult Turtle + Rock, ATK < 1450, excluding #156 -> #518 Boulder Tortoise

- Rule ID: `exact-type-card-89-rock-boulder-tortoise-82`
- Provenance: `tea-inferred`
- TEA target pairs: 15
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1000-1000 / 0-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #359 P. the Princess of Ghosts + Plant, ATK < 1800 -> #99 Pumpking the King of Ghosts

- Rule ID: `exact-type-card-359-plant-pumpking-the-king-of-ghosts-83`
- Provenance: `tea-inferred`
- TEA target pairs: 14
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 900-900 / 300-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #555 Alligator's Sword Dragon + Machine, ATK < 2500 -> #423 Cyber-Tech Alligator

- Rule ID: `exact-type-card-555-machine-cyber-tech-alligator-84`
- Provenance: `tea-inferred`
- TEA target pairs: 14
- Pairs superseded by a more-specific TEA recipe: 21
- Material ATK ranges in target pairs: 1700-1700 / 1850-2400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #467 Crimson Sunbird + Pyro, ATK < 2800, excluding #353 -> #577 Blaze Fenix

- Rule ID: `exact-type-card-467-pyro-blaze-fenix-85`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-crimson-sunbird-pyro`)
- TEA target pairs: 14
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2300-2300 / 200-2400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #162 Tainted Wisdom + Fish, ATK < 2400, excluding #71, #447 -> #159 Cranium Fish

- Rule ID: `exact-type-card-162-fish-cranium-fish-86`
- Provenance: `tea-inferred`
- TEA target pairs: 14
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1250-1250 / 600-2350
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #539 Corroding Shark + Fish, ATK < 2400, excluding #71, #447 -> #452 Terrorking Salmon

- Rule ID: `exact-type-card-539-fish-terrorking-salmon-87`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-corroding-shark-fish`)
- TEA target pairs: 14
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1100-1100 / 600-2350
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #581 Lanista + Thunder, ATK < 2600 -> #363 Thunder Lord

- Rule ID: `exact-type-card-581-thunder-thunder-lord-88`
- Provenance: `tea-inferred`
- TEA target pairs: 13
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1800-1800 / 0-2500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #435 The D. Dwelling in the Deep + Dragon, ATK < 1800 -> #384 Atlantean Dragoons

- Rule ID: `exact-type-card-435-dragon-atlantean-dragoons-89`
- Provenance: `tea-inferred`
- TEA target pairs: 13
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1700-1700 / 300-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #31 Solar Flare Dragon + Dragon, ATK < 1800 -> #712 Meteor Dragon

- Rule ID: `exact-type-card-31-dragon-meteor-dragon-90`
- Provenance: `tea-inferred`
- TEA target pairs: 13
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1500-1500 / 300-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #272 Mavelus + Pyro, ATK < 2300, excluding #353 -> #467 Crimson Sunbird

- Rule ID: `exact-type-card-272-pyro-crimson-sunbird-91`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-mavelus-pyro`)
- TEA target pairs: 13
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1300-1300 / 200-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #409 Metal Dragon + Pyro, ATK < 2300, excluding #353 -> #557 Power Tool Dragon

- Rule ID: `exact-type-card-409-pyro-power-tool-dragon-92`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-metal-dragon-pyro`)
- TEA target pairs: 13
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1850-1850 / 200-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #447 Orca Mega Fortress + Fish, ATK < 2350, excluding #71, #447 -> #718 Fortress Whale

- Rule ID: `exact-type-card-447-fish-fortress-whale-93`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-orca-fish`)
- TEA target pairs: 13
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2100-2100 / 600-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #71 Spined Gillman + Dragon, ATK < 1700 -> #435 The D. Dwelling in the Deep

- Rule ID: `exact-type-card-71-dragon-the-d-dwelling-in-the-deep-94`
- Provenance: `tea-inferred`
- TEA target pairs: 12
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1300-1300 / 300-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #160 Gishki Vision + Dragon, ATK < 1700 -> #435 The D. Dwelling in the Deep

- Rule ID: `exact-type-card-160-dragon-the-d-dwelling-in-the-deep-95`
- Provenance: `tea-inferred`
- TEA target pairs: 12
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 700-700 / 300-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #250 Skystarray + Dragon, ATK < 1700 -> #435 The D. Dwelling in the Deep

- Rule ID: `exact-type-card-250-dragon-the-d-dwelling-in-the-deep-96`
- Provenance: `tea-inferred`
- TEA target pairs: 12
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 600-600 / 300-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #448 Spike Seadra + Dragon, ATK < 1700 -> #435 The D. Dwelling in the Deep

- Rule ID: `exact-type-card-448-dragon-the-d-dwelling-in-the-deep-97`
- Provenance: `tea-inferred`
- TEA target pairs: 12
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 300-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #146 Temple of Skulls + Rock, ATK < 1800 -> #517 Fossil Tusker

- Rule ID: `exact-type-card-146-rock-fossil-tusker-98`
- Provenance: `tea-inferred`
- TEA target pairs: 12
- Pairs superseded by a more-specific TEA recipe: 9
- Material ATK ranges in target pairs: 900-900 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #637 Bird of Roses + Dinosaur, ATK < 2400 -> #523 D. Driceratops

- Rule ID: `exact-type-card-637-dinosaur-d-driceratops-99`
- Provenance: `tea-inferred`
- TEA target pairs: 12
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1800-1800 / 0-2200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #640 Acid Crawler + Thunder, ATK < 2500 -> #535 Mist Wurm

- Rule ID: `exact-type-card-640-thunder-mist-wurm-100`
- Provenance: `tea-inferred`
- TEA target pairs: 12
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 900-900 / 0-2450
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #28 Rock Ogre Grotto #1 + Machine, ATK < 1900 -> #645 Steel Ogre Grotto #2

- Rule ID: `exact-type-card-28-machine-steel-ogre-grotto-2-101`
- Provenance: `tea-inferred`
- TEA target pairs: 12
- Pairs superseded by a more-specific TEA recipe: 10
- Material ATK ranges in target pairs: 800-800 / 1500-1850
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #239 Horus' Servant + Zombie, ATK < 1200 -> #132 The 13th Grave

- Rule ID: `exact-type-card-239-zombie-the-13th-grave-102`
- Provenance: `tea-inferred`
- TEA target pairs: 11
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-100 / 0-1100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #89 Catapult Turtle + Zombie, ATK < 1200 -> #228 Pyramid Turtle

- Rule ID: `exact-type-card-89-zombie-pyramid-turtle-103`
- Provenance: `tea-inferred`
- TEA target pairs: 11
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1000-1000 / 0-1100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #474 Island Turtle + Zombie, ATK < 1200 -> #228 Pyramid Turtle

- Rule ID: `exact-type-card-474-zombie-pyramid-turtle-104`
- Provenance: `tea-inferred`
- TEA target pairs: 11
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1100-1100 / 0-1100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #646 Gora Turtle + Zombie, ATK < 1200 -> #228 Pyramid Turtle

- Rule ID: `exact-type-card-646-zombie-pyramid-turtle-105`
- Provenance: `tea-inferred`
- TEA target pairs: 11
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1100-1100 / 0-1100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #91 Mystic Horseman + BeastWarrior, ATK < 2000 -> #92 Rabid Horseman

- Rule ID: `exact-type-card-91-beastwarrior-rabid-horseman-106`
- Provenance: `tea-inferred`
- TEA target pairs: 10
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1300-1300 / 100-1900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #426 Stone D. + Dragon, ATK < 1600 -> #255 Redox, D. Ruler of Boulders

- Rule ID: `exact-type-card-426-dragon-redox-d-ruler-of-boulders-107`
- Provenance: `tea-inferred`
- TEA target pairs: 10
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 2000-2000 / 300-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #133 Flame Ruler + Pyro, ATK < 2100, excluding #353 -> #292 Mr. Volcano

- Rule ID: `exact-type-card-133-pyro-mr-volcano-108`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-flame-ruler-pyro`)
- TEA target pairs: 10
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1500-1500 / 200-1850
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #112 Fiber Jar + Fish, ATK < 1800, excluding #71 -> #440 7 Colored Fish

- Rule ID: `exact-type-card-112-fish-7-colored-fish-109`
- Provenance: `tea-inferred`
- TEA target pairs: 10
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 500-500 / 600-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #552 Firebird + Pyro, ATK < 2100, excluding #353 -> #466 Hazy Flame Hyppogrif

- Rule ID: `exact-type-card-552-pyro-hazy-flame-hyppogrif-110`
- Provenance: `tea-inferred`
- TEA target pairs: 10
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1000-1000 / 200-1850
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #404 Photon Cerberus + Pyro, ATK < 2100, excluding #353 -> #529 Flame Cerebrus

- Rule ID: `exact-type-card-404-pyro-flame-cerebrus-111`
- Provenance: `tea-inferred`
- TEA target pairs: 10
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1300-1300 / 200-1850
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #282 Bazoo the Soul-Eater + Thunder, ATK < 1800 -> #638 Voltic Kong

- Rule ID: `exact-type-card-282-thunder-voltic-kong-112`
- Provenance: `tea-inferred`
- TEA target pairs: 9
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 0-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #71 Spined Gillman + Pyro, ATK < 1800 -> #353 Lavalval Chain

- Rule ID: `exact-type-card-71-pyro-lavalval-chain-113`
- Provenance: `tea-inferred`
- TEA target pairs: 8
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1300-1300 / 200-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #160 Gishki Vision + Pyro, ATK < 1800 -> #353 Lavalval Chain

- Rule ID: `exact-type-card-160-pyro-lavalval-chain-114`
- Provenance: `tea-inferred`
- TEA target pairs: 8
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 700-700 / 200-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #250 Skystarray + Pyro, ATK < 1800 -> #353 Lavalval Chain

- Rule ID: `exact-type-card-250-pyro-lavalval-chain-115`
- Provenance: `tea-inferred`
- TEA target pairs: 8
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 600-600 / 200-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #435 The D. Dwelling in the Deep + Pyro, ATK < 1800 -> #353 Lavalval Chain

- Rule ID: `exact-type-card-435-pyro-lavalval-chain-116`
- Provenance: `tea-inferred`
- TEA target pairs: 8
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1700-1700 / 200-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #448 Spike Seadra + Pyro, ATK < 1800 -> #353 Lavalval Chain

- Rule ID: `exact-type-card-448-pyro-lavalval-chain-117`
- Provenance: `tea-inferred`
- TEA target pairs: 8
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1600-1600 / 200-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #252 Nekogal #1 + BeastWarrior, ATK < 1900 -> #627 Nekogal #2

- Rule ID: `exact-type-card-252-beastwarrior-nekogal-2-118`
- Provenance: `tea-inferred`
- TEA target pairs: 8
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1100-1100 / 100-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #89 Catapult Turtle + Plant, ATK < 1100 -> #474 Island Turtle

- Rule ID: `exact-type-card-89-plant-island-turtle-119`
- Provenance: `tea-inferred`
- TEA target pairs: 7
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1000-1000 / 300-900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #436 Nimble Angler + Machine, ATK < 1400 -> #542 Misairuzame

- Rule ID: `exact-type-card-436-machine-misairuzame-120`
- Provenance: `tea-inferred`
- TEA target pairs: 7
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 600-600 / 100-1200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #205 Yomi Ship + Warrior, ATK < 1600 -> #120 Skull Mariner

- Rule ID: `exact-type-card-205-warrior-skull-mariner-121`
- Provenance: `tea-inferred`
- TEA target pairs: 6
- Pairs superseded by a more-specific TEA recipe: 23
- Material ATK ranges in target pairs: 800-800 / 1400-1550
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #553 Blizzard Warrior + Fish, ATK < 1850, excluding #71 -> #641 The Legendary Fisherman

- Rule ID: `exact-type-card-553-fish-the-legendary-fisherman-122`
- Provenance: `tea-inferred`
- TEA target pairs: 6
- Pairs superseded by a more-specific TEA recipe: 7
- Material ATK ranges in target pairs: 1400-1400 / 1500-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #71 Spined Gillman + Thunder, ATK < 1500 -> #45 Watthydra

- Rule ID: `exact-type-card-71-thunder-watthydra-123`
- Provenance: `tea-inferred`
- TEA target pairs: 5
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1300-1300 / 0-1000
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #160 Gishki Vision + Thunder, ATK < 1500 -> #45 Watthydra

- Rule ID: `exact-type-card-160-thunder-watthydra-124`
- Provenance: `tea-inferred`
- TEA target pairs: 5
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 700-700 / 0-1000
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #250 Skystarray + Thunder, ATK < 1500 -> #45 Watthydra

- Rule ID: `exact-type-card-250-thunder-watthydra-125`
- Provenance: `tea-inferred`
- TEA target pairs: 5
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 600-600 / 0-1000
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #300 Harpie Girl + Dragon, ATK < 1200 -> #49 Harpie's Pet Baby Dragon

- Rule ID: `exact-type-card-300-dragon-harpie-s-pet-baby-dragon-126`
- Provenance: `tea-inferred`
- TEA target pairs: 5
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 500-500 / 300-1100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #397 Bombardment Beetle + BeastWarrior, ATK < 1500 -> #52 Hercules Beetle

- Rule ID: `exact-type-card-397-beastwarrior-hercules-beetle-127`
- Provenance: `tea-inferred`
- TEA target pairs: 5
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 400-400 / 100-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #480 Naturia Beetle + BeastWarrior, ATK < 1500 -> #52 Hercules Beetle

- Rule ID: `exact-type-card-480-beastwarrior-hercules-beetle-128`
- Provenance: `tea-inferred`
- TEA target pairs: 5
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 400-400 / 100-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #562 Swarm of Scarabs + BeastWarrior, ATK < 1500 -> #52 Hercules Beetle

- Rule ID: `exact-type-card-562-beastwarrior-hercules-beetle-129`
- Provenance: `tea-inferred`
- TEA target pairs: 5
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 500-500 / 100-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #132 The 13th Grave + BeastWarrior, ATK < 1600 -> #153 Bone Crusher

- Rule ID: `exact-type-card-132-beastwarrior-bone-crusher-130`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-thirteenth-grave-beast-warrior`)
- TEA target pairs: 5
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1200-1200 / 100-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #298 Totem Dragon + Zombie, ATK < 1700 -> #545 Skelgon

- Rule ID: `exact-type-card-298-zombie-skelgon-131`
- Provenance: `tea-inferred`
- TEA target pairs: 4
- Pairs superseded by a more-specific TEA recipe: 15
- Material ATK ranges in target pairs: 400-400 / 1600-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #73 Kairyu-Shin + SeaSerpent, ATK < 2300, excluding #230, #432 -> #223 Brionac, Dragon of the Ice Barrier

- Rule ID: `exact-type-card-73-seaserpent-brionac-dragon-of-the-ice-barrier-132`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-kairyu-shin-sea-serpent`)
- TEA target pairs: 4
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 1800-1800 / 1600-2250
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### #555 Alligator's Sword Dragon + Aqua, ATK < 1800 -> #384 Atlantean Dragoons

- Rule ID: `exact-type-card-555-aqua-atlantean-dragoons-133`
- Provenance: `tea-inferred`
- TEA target pairs: 3
- Pairs superseded by a more-specific TEA recipe: 29
- Material ATK ranges in target pairs: 1700-1700 / 600-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Aqua, ATK < 1500, excluding #160, #250 + Spellcaster, ATK < 1500 -> #433 Shock Troops

- Rule ID: `type-type-aqua-spellcaster-shock-troops-134`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-aqua-spellcaster`)
- TEA target pairs: 696
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1450 / 0-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Aqua, ATK < 1500, excluding #160, #250 + Fiend, ATK < 1500 -> #70 Revival Jam

- Rule ID: `type-type-aqua-fiend-revival-jam-135`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-aqua-fiend`)
- TEA target pairs: 648
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1450 / 200-1450
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fiend, ATK < 1800 + Zombie, ATK < 1800 -> #379 Immortal Ruler

- Rule ID: `type-type-fiend-zombie-immortal-ruler-136`
- Provenance: `tea-inferred`
- TEA target pairs: 606
- Pairs superseded by a more-specific TEA recipe: 24
- Material ATK ranges in target pairs: 200-1700 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fiend, ATK < 1900 + Insect, ATK < 1900 -> #54 Aztekipede

- Rule ID: `type-type-fiend-insect-aztekipede-137`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-fiend-insect`)
- TEA target pairs: 527
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 200-1800 / 0-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fiend, ATK < 1600 + Rock, ATK < 1600 -> #623 Medium Piece Golem

- Rule ID: `type-type-fiend-rock-medium-piece-golem-138`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-fiend-rock`)
- TEA target pairs: 522
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 200-1500 / 0-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Aqua, ATK < 1400, excluding #160, #250 + Warrior, ATK < 1400 -> #553 Blizzard Warrior

- Rule ID: `type-type-aqua-warrior-blizzard-warrior-139`
- Provenance: `tea-inferred`
- TEA target pairs: 462
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1250 / 0-1300
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Machine, ATK < 1750 + Warrior, ATK < 1750 -> #408 Giant Mech-soldier

- Rule ID: `type-type-machine-warrior-giant-mech-soldier-140`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-machine-warrior`)
- TEA target pairs: 455
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1600 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Reptile, ATK < 1800 + Warrior, ATK < 1800 -> #458 Alien Warrior

- Rule ID: `type-type-reptile-warrior-alien-warrior-141`
- Provenance: `tea-inferred`
- TEA target pairs: 455
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 200-1700 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fairy, ATK < 1600 + Spellcaster, ATK < 1600 -> #126 Sage of the Sky

- Rule ID: `type-type-fairy-spellcaster-sage-of-the-sky-142`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-fairy-spellcaster`)
- TEA target pairs: 434
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1550 / 0-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1600 + Warrior, ATK < 1600 -> #234 Gaia the White Knight

- Rule ID: `type-type-beast-warrior-gaia-the-white-knight-143`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-warrior`)
- TEA target pairs: 432
- Pairs superseded by a more-specific TEA recipe: 3
- Material ATK ranges in target pairs: 100-1500 / 0-1550
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Aqua, ATK < 1800, excluding #160, #250, #435 + Dragon, ATK < 1800 -> #73 Kairyu-Shin

- Rule ID: `type-type-aqua-dragon-kairyu-shin-144`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-aqua-dragon`)
- TEA target pairs: 377
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1700 / 300-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dragon, ATK < 2000, excluding #255 + Rock, ATK < 2000 -> #426 Stone D.

- Rule ID: `type-type-dragon-rock-stone-d-145`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dragon-rock`)
- TEA target pairs: 352
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1900 / 0-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Aqua, ATK < 1700, excluding #160, #250 + Reptile, ATK < 1700 -> #51 Worm Tentacles

- Rule ID: `type-type-aqua-reptile-worm-tentacles-146`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-aqua-reptile`)
- TEA target pairs: 324
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1600 / 200-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### WingedBeast, ATK < 1900 + Zombie, ATK < 1900 -> #521 Skullbird

- Rule ID: `type-type-wingedbeast-zombie-skullbird-147`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-winged-beast-zombie`)
- TEA target pairs: 322
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1800 / 0-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dragon, ATK < 1850 + Machine, ATK < 1850 -> #409 Metal Dragon

- Rule ID: `type-type-dragon-machine-metal-dragon-148`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dragon-machine`)
- TEA target pairs: 294
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1800 / 100-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Plant, ATK < 1600 + Warrior, ATK < 1600 -> #511 Naturia Guardian

- Rule ID: `type-type-plant-warrior-naturia-guardian-149`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-plant-warrior`)
- TEA target pairs: 290
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1400 / 0-1550
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Aqua, ATK < 1500, excluding #160, #250 + Beast, ATK < 1500, excluding #168 -> #599 Freezing Beast

- Rule ID: `type-type-aqua-beast-freezing-beast-150`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-aqua-beast`)
- TEA target pairs: 286
- Pairs superseded by a more-specific TEA recipe: 2
- Material ATK ranges in target pairs: 0-1450 / 100-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Spellcaster, ATK < 1400, excluding #16, #17, #18, #19, #20, #21, #42, #115, #184, #284, #352, #387, #612 + Warrior, ATK < 1400 -> #142 Blast Magician

- Rule ID: `type-type-spellcaster-warrior-blast-magician-151`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-spellcaster-warrior`)
- TEA target pairs: 286
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1300 / 0-1300
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Pyro, ATK < 1800 + Warrior, ATK < 1800 -> #15 Flame Swordsman

- Rule ID: `type-type-pyro-warrior-flame-swordsman-152`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-pyro-warrior`)
- TEA target pairs: 280
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 200-1700 / 0-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Rock, ATK < 1300 + Warrior, ATK < 1300 -> #74 Giant Soldier of Stone

- Rule ID: `type-type-rock-warrior-giant-soldier-of-stone-153`
- Provenance: `tea-inferred`
- TEA target pairs: 280
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1200 / 0-1000
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1400 + Fiend, ATK < 1400 -> #233 Berfomet

- Rule ID: `type-type-beast-fiend-berfomet-154`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-fiend`)
- TEA target pairs: 275
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1350 / 200-1380
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fiend, ATK < 1500 + WingedBeast, ATK < 1500 -> #281 Theban Nightmare

- Rule ID: `type-type-fiend-wingedbeast-theban-nightmare-155`
- Provenance: `tea-inferred`
- TEA target pairs: 270
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 200-1450 / 300-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1700 + Insect, ATK < 1700 -> #479 Bujingi Centipede

- Rule ID: `type-type-beast-insect-bujingi-centipede-156`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-insect`)
- TEA target pairs: 240
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1600 / 0-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Aqua, ATK < 1300, excluding #160, #250 + Insect, ATK < 1300 -> #55 Numbing Grub

- Rule ID: `type-type-aqua-insect-numbing-grub-157`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-aqua-insect`)
- TEA target pairs: 231
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1250 / 0-900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Warrior, ATK < 1200 + Zombie, ATK < 1200 -> #30 Zombie Warrior

- Rule ID: `type-type-warrior-zombie-zombie-warrior-158`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-warrior-zombie`)
- TEA target pairs: 220
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1000 / 0-1100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fairy, ATK < 1400 + Warrior, ATK < 1400 -> #41 Celtic Guardian

- Rule ID: `type-type-fairy-warrior-celtic-guardian-159`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-fairy-warrior`)
- TEA target pairs: 220
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1150 / 0-1300
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dragon, ATK < 1800 + Fairy, ATK < 1800 -> #111 Victoria

- Rule ID: `type-type-dragon-fairy-victoria-160`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dragon-fairy`)
- TEA target pairs: 208
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1700 / 0-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Thunder, ATK < 1600 + Warrior, ATK < 1600 -> #376 The Creator Incarnate

- Rule ID: `type-type-thunder-warrior-the-creator-incarnate-161`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-thunder-warrior`)
- TEA target pairs: 203
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1500 / 0-1550
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1550 + Fairy, ATK < 1550 -> #396 Ocubeam

- Rule ID: `type-type-beast-fairy-ocubeam-162`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-fairy`)
- TEA target pairs: 195
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1500 / 0-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fish, ATK < 1500, excluding #71 + Warrior, ATK < 1500 -> #507 Ocean's Keeper

- Rule ID: `type-type-fish-warrior-ocean-s-keeper-163`
- Provenance: `tea-inferred`
- TEA target pairs: 182
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 600-1400 / 0-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Aqua, ATK < 1600, excluding #160, #250 + Thunder, ATK < 1600 -> #460 Thunder Sea Horse

- Rule ID: `type-type-aqua-thunder-thunder-sea-horse-164`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-aqua-thunder`)
- TEA target pairs: 182
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1500 / 0-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### BeastWarrior, ATK < 1800 + Fiend, ATK < 1800 -> #95 Mefist the Infernal General

- Rule ID: `type-type-beastwarrior-fiend-mefist-the-infernal-general-165`
- Provenance: `tea-inferred`
- TEA target pairs: 180
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1650 / 200-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### BeastWarrior, ATK < 1650 + Warrior, ATK < 1650 -> #246 Wolf Axwielder

- Rule ID: `type-type-beastwarrior-warrior-wolf-axwielder-166`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-warrior-warrior`)
- TEA target pairs: 170
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1400 / 0-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Plant, ATK < 1800 + WingedBeast, ATK < 1800 -> #637 Bird of Roses

- Rule ID: `type-type-plant-wingedbeast-bird-of-roses-167`
- Provenance: `tea-inferred`
- TEA target pairs: 168
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1600 / 300-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Plant, ATK < 1600 + Spellcaster, ATK < 1600, excluding #16, #17, #18, #19, #20, #21, #42, #44, #115, #184, #284, #352, #387, #417, #612 -> #75 Rose Witch

- Rule ID: `type-type-plant-spellcaster-rose-witch-168`
- Provenance: `tea-inferred`
- TEA target pairs: 160
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1400 / 300-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Machine, ATK < 1500 + Rock, ATK < 1500 -> #456 Tackle Crusader

- Rule ID: `type-type-machine-rock-tackle-crusader-169`
- Provenance: `tea-inferred`
- TEA target pairs: 159
- Pairs superseded by a more-specific TEA recipe: 1
- Material ATK ranges in target pairs: 100-1400 / 0-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Aqua, ATK < 1600, excluding #160, #250 + Dinosaur, ATK < 1600 -> #81 Hydrogeddon

- Rule ID: `type-type-aqua-dinosaur-hydrogeddon-170`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-aqua-dinosaur`)
- TEA target pairs: 156
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1500 / 0-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### BeastWarrior, ATK < 1600 + Spellcaster, ATK < 1600 -> #619 Frontier Wiseman

- Rule ID: `type-type-beastwarrior-spellcaster-frontier-wiseman-171`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-warrior-spellcaster`)
- TEA target pairs: 155
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1400 / 0-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### BeastWarrior, ATK < 2200 + Dinosaur, ATK < 2200 -> #80 Gladiator Beast Spartacus

- Rule ID: `type-type-beastwarrior-dinosaur-gladiator-beast-spartacus-172`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-warrior-dinosaur`)
- TEA target pairs: 150
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-2100 / 0-2100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dragon, ATK < 1600 + Zombie, ATK < 1600 -> #97 Dragon Zombie

- Rule ID: `type-type-dragon-zombie-dragon-zombie-173`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dragon-zombie`)
- TEA target pairs: 150
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1500 / 0-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Reptile, ATK < 1600 + Zombie, ATK < 1600 -> #219 Alien Skull

- Rule ID: `type-type-reptile-zombie-alien-skull-174`
- Provenance: `tea-inferred`
- TEA target pairs: 150
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 200-1400 / 0-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1600 + Plant, ATK < 1600 -> #273 Botanical Lion

- Rule ID: `type-type-beast-plant-botanical-lion-175`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-plant`)
- TEA target pairs: 150
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1500 / 300-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Pyro, ATK < 1500 + Spellcaster, ATK < 1500 -> #133 Flame Ruler

- Rule ID: `type-type-pyro-spellcaster-flame-ruler-176`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-pyro-spellcaster`)
- TEA target pairs: 144
- Pairs superseded by a more-specific TEA recipe: 1
- Material ATK ranges in target pairs: 200-550 / 0-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Plant, ATK < 1850 + Pyro, ATK < 1850, excluding #353 -> #451 Blazing Inpachi

- Rule ID: `type-type-plant-pyro-blazing-inpachi-177`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-plant-pyro`)
- TEA target pairs: 144
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1800 / 200-1800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1350 + Zombie, ATK < 1350 -> #46 Skull Dog Marron

- Rule ID: `type-type-beast-zombie-skull-dog-marron-178`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-zombie`)
- TEA target pairs: 140
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1300 / 0-1200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fairy, ATK < 1600 + WingedBeast, ATK < 1600 -> #125 Cockadoodledoo

- Rule ID: `type-type-fairy-wingedbeast-cockadoodledoo-179`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-fairy-winged-beast`)
- TEA target pairs: 140
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1550 / 300-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dinosaur, ATK < 1800 + Machine, ATK < 1800 -> #508 Cyber Saurus

- Rule ID: `type-type-dinosaur-machine-cyber-saurus-180`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dinosaur-machine`)
- TEA target pairs: 135
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1750 / 100-1750
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Insect, ATK < 1500 + WingedBeast, ATK < 1500 -> #221 Fliying Kamakiri

- Rule ID: `type-type-insect-wingedbeast-fliying-kamakiri-181`
- Provenance: `tea-inferred`
- TEA target pairs: 130
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1400 / 300-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1800, excluding #404 + Pyro, ATK < 1800 -> #528 Flame Tiger

- Rule ID: `type-type-beast-pyro-flame-tiger-182`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-pyro`)
- TEA target pairs: 128
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1700 / 200-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Rock, ATK < 1200 + Zombie, ATK < 1200 -> #457 Stone Ghost

- Rule ID: `type-type-rock-zombie-stone-ghost-183`
- Provenance: `tea-inferred`
- TEA target pairs: 109
- Pairs superseded by a more-specific TEA recipe: 1
- Material ATK ranges in target pairs: 0-1100 / 0-1100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1500, excluding #168 + Dragon, ATK < 1500 -> #94 Twin-headed Behemoth

- Rule ID: `type-type-beast-dragon-twin-headed-behemoth-184`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-dragon`)
- TEA target pairs: 108
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1400 / 300-1400
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dinosaur, ATK < 1750 + Dragon, ATK < 1750 -> #11 Sword Arm of Dragon

- Rule ID: `type-type-dinosaur-dragon-sword-arm-of-dragon-185`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dinosaur-dragon`)
- TEA target pairs: 104
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1600 / 300-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### BeastWarrior, ATK < 1800 + Machine, ATK < 1800 -> #441 Spikebot

- Rule ID: `type-type-beastwarrior-machine-spikebot-186`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-warrior-machine`)
- TEA target pairs: 90
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1650 / 100-1750
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Machine, ATK < 1600 + Pyro, ATK < 1600 -> #172 Robotic Knight

- Rule ID: `type-type-machine-pyro-robotic-knight-187`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-machine-pyro`)
- TEA target pairs: 84
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1500 / 200-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Pyro, ATK < 1700 + Reptile, ATK < 1700 -> #291 Royal Firestorm Guards

- Rule ID: `type-type-pyro-reptile-royal-firestorm-guards-188`
- Provenance: `tea-inferred`
- TEA target pairs: 84
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 200-1500 / 200-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fish, ATK < 1700, excluding #71 + Thunder, ATK < 1700 -> #230 Royal Swamp Eel

- Rule ID: `type-type-fish-thunder-royal-swamp-eel-189`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-fish-thunder`)
- TEA target pairs: 81
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 600-1600 / 0-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dinosaur, ATK < 1800 + Pyro, ATK < 1800 -> #166 Volcanic Slicer

- Rule ID: `type-type-dinosaur-pyro-volcanic-slicer-190`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dinosaur-pyro`)
- TEA target pairs: 72
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1750 / 200-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Pyro, ATK < 1800 + Thunder, ATK < 1800 -> #462 Topaz

- Rule ID: `type-type-pyro-thunder-topaz-191`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-pyro-thunder`)
- TEA target pairs: 72
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 200-1700 / 0-1600
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### BeastWarrior, ATK < 1800 + WingedBeast, ATK < 1800 -> #581 Lanista

- Rule ID: `type-type-beastwarrior-wingedbeast-lanista-192`
- Provenance: `tea-inferred`
- TEA target pairs: 72
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1650 / 300-1700
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dragon, ATK < 1600 + Thunder, ATK < 1600 -> #425 Thunder Dragon

- Rule ID: `type-type-dragon-thunder-thunder-dragon-193`
- Provenance: `tea-inferred`
- TEA target pairs: 70
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1500 / 0-1500
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1500, excluding #168 + Thunder, ATK < 1500 -> #459 Gusto Thunbolt

- Rule ID: `type-type-beast-thunder-gusto-thunbolt-194`
- Provenance: `tea-inferred`
- TEA target pairs: 60
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1400 / 0-1000
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dragon, ATK < 1400 + WingedBeast, ATK < 1400 -> #7 Winged Dragon #1

- Rule ID: `type-type-dragon-wingedbeast-winged-dragon-1-195`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dragon-winged-beast`)
- TEA target pairs: 59
- Pairs superseded by a more-specific TEA recipe: 5
- Material ATK ranges in target pairs: 300-1200 / 300-1300
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Machine, ATK < 1400 + WingedBeast, ATK < 1400 -> #124 Daigusto Falcos

- Rule ID: `type-type-machine-wingedbeast-daigusto-falcos-196`
- Provenance: `tea-inferred`
- TEA target pairs: 56
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1200 / 300-1300
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fairy, ATK < 1100 + Plant, ATK < 1100 -> #252 Nekogal #1

- Rule ID: `type-type-fairy-plant-nekogal-1-197`
- Provenance: `tea-inferred`
- TEA target pairs: 56
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-950 / 300-900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fairy, ATK < 1500 + Pyro, ATK < 1500 -> #608 Rasetsu

- Rule ID: `type-type-fairy-pyro-rasetsu-198`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-fairy-pyro`)
- TEA target pairs: 50
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-1150 / 200-550
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Plant, ATK < 900 + Zombie, ATK < 900 -> #359 P. the Princess of Ghosts

- Rule ID: `type-type-plant-zombie-p-the-princess-of-ghosts-199`
- Provenance: `tea-inferred`
- TEA target pairs: 48
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-800 / 0-800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dragon, ATK < 1500 + Pyro, ATK < 1500 -> #31 Solar Flare Dragon

- Rule ID: `type-type-dragon-pyro-solar-flare-dragon-200`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dragon-pyro`)
- TEA target pairs: 45
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 300-1400 / 200-550
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1300 + Fish, ATK < 1300 -> #71 Spined Gillman

- Rule ID: `type-type-beast-fish-spined-gillman-201`
- Provenance: `tea-inferred`
- TEA target pairs: 42
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1200 / 600-1200
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Fish, ATK < 1100 + Zombie, ATK < 1100 -> #539 Corroding Shark

- Rule ID: `type-type-fish-zombie-corroding-shark-202`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-fish-zombie`)
- TEA target pairs: 40
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 600-1000 / 0-900
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Dinosaur, ATK < 1200 + Zombie, ATK < 1200 -> #455 Fossil Dyna Pachycephalo

- Rule ID: `type-type-dinosaur-zombie-fossil-dyna-pachycephalo-203`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-dinosaur-zombie`)
- TEA target pairs: 33
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 0-500 / 0-1100
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

### Beast, ATK < 1200 + Machine, ATK < 1200 -> #412 Giga-Tech Wolf

- Rule ID: `type-type-beast-machine-giga-tech-wolf-204`
- Provenance: `wordpress-basic-validated-by-tea` (candidate `wp-beast-machine`)
- TEA target pairs: 30
- Pairs superseded by a more-specific TEA recipe: 0
- Material ATK ranges in target pairs: 100-1100 / 100-800
- False positives after precedence: 0
- False negatives within the declared matcher: 0

Status: VALIDATED

## Explicit recipes

214 result groups contain 540 exact TEA pairs. These are special recipes, precedence overrides, or patterns for which no zero-error declarative generalization was accepted. They are stored compactly under `specificRecipes` in `fusion-rules.json`.
