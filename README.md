# Space Station

An isometric floating-island space base, viewed in the browser with three.js.
The scene is drawn in a square frame the width of a phone screen (390 x 390 CSS pixels).

No install step: three.js and the models are included in the repository.

## Run

```bash
node serve.js
```

Then open http://localhost:8080.

Without Node, any static server works, for example:

```bash
python3 -m http.server 8080
```

## Test

```bash
npm test
```

(or `node --test`; needs Node 18 or newer, nothing to install)

`tests/environment.test.js` checks the setup itself (Node version, vendored three.js,
model files and licenses). Run the tests first in a new environment.

## Layout

| Path | Role |
|---|---|
| `config.js` | Shared settings: frame size, island size, cell size, camera |
| `engine/` | Pure logic (island, catalog, base state, seeded random). No three.js, no DOM |
| `render/` | three.js view: isometric camera, lights, model loading, drawing a base state |
| `main.js`, `index.html`, `styles.css` | Control panel and wiring |
| `assets/models/` | glTF models (CC0), see `CREDITS.md` |
| `inspiration/` | Reference images for the look of the base |
| `tests/` | Engine tests, run with `node --test` |
| `vendor/three/` | three.js r170 and the addons in use |

## Current state

- The island is a flat 8 x 8 square of terrain blocks.
- Four building types: habitat, greenhouse, solar array, landing pad.
- "Add" puts a building on a random free cell (seeded, reproducible). Nothing else decides where it goes.
