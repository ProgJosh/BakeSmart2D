# BakeSmart2D asset slots

All runtime gameplay remains shared across web and future platform wrappers. These folders are reserved for original, locally bundled 2D assets:

- `backgrounds/` — bakery and lesson environments
- `characters/` — mentor and learner sprite sheets
- `ingredients/`, `equipment/`, `products/` — LO1 simulation art
- `decoration/` — LO2 art
- `packaging/` — LO3 art
- `effects/` — small particle and reveal textures
- `ui/` — interface art
- `audio/` — music and sound effects

The current Phase 3 vertical slice uses lightweight Phaser Graphics placeholders. Optional sprite and audio keys are checked before use, so missing future assets cannot crash the game.

