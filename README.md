# coco-hunt — the one-clue hunt

> A single-stop cut of [birthday-hunt](https://github.com/p4panash/birthday-hunt). Same mobile-first experience — countdown, GPS gate, wobbly mascot, confetti finale — but **one clue** instead of three, because "Fălticeni is three streets and a lake." The one clue sends the friend straight to an Easybox; the finale QR opens it.

This is **phase 1** of the coco birthday prank: it gets him to the locker that holds the wrapped "gift from the gang." (Phase 2 — the reveal page — lives in [`coco_bday`](https://github.com/p4panash/coco_bday).)

**Live →** https://p4panash.github.io/coco-hunt/ *(after first deploy)*

## How it plays

1. Open the link on a phone. Countdown ticks, mascot wobbles, night sky twinkles.
2. Read the one clue. Walk to the Easybox. GPS auto-unlocks within `radiusMeters`. Stuck? Tap "stuck?" for the plainer hint or the manual code.
3. GOTCHA reveal → finale: locker name + "open in maps" + the QR to scan at the machine.

## What changed vs. birthday-hunt

| | birthday-hunt | coco-hunt |
|---|---|---|
| stops | 3 geo-gated checkpoints | **1** |
| QR | assembled from 3 slices | one whole image |
| flow | intro → gps → ×3 (location → reveal) → finale | intro → gps → location → reveal → finale |
| theme | "Confetti Dusk" purple + coral | **night sky**: midnight-blue gradient + twinkling `<Starfield>` canvas + warm amber accent |
| spoilers | — | none — the sky is just a sky |

The state machine, components and screens are the birthday-hunt originals; only the flow endpoints, the palette (`src/styles/tokens.css` — token *names* unchanged, values swapped) and `<Starfield>` are new.

## Edit before launch — `src/config.ts`

One file. Replace every `REPLACE_ME`:

- `friendName`
- `checkpoints[0]` → the Easybox: `teaser` (the clue he sees), `realHint` (plainer, in the "stuck?" sheet), `lat` / `lng` / `radiusMeters`, `code` (manual fallback). **Leave `[1]` and `[2]`** — unused filler so the shared 3-slot types still compile.
- `easyboxLocation` → `name` / `hint` / `mapsUrl` shown on the finale
- `deadlineISO` → when the locker returns the parcel (drives the countdown)
- `public/qr.jpg` → replace with the real Easybox QR image

Town name is written `Falticeni` (ASCII) in the config copy — swap in `Fălticeni` if you want the diacritics.

## Run

```bash
npm install
npm run dev        # http://localhost:5173/coco-hunt/
npm run build      # tsc + vite → dist/
```

Add `?test=1` to the URL for the dev drawer (jump between screens, mock GPS).

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
One-time: repo **Settings → Pages → Source: GitHub Actions**.
`base` in `vite.config.ts` is `/coco-hunt/` — keep it in sync with the repo name.

## Built with

React · Vite · TypeScript · `motion` · `canvas-confetti` · GitHub Pages

See [`DEVELOPMENT.md`](./DEVELOPMENT.md) for the technical detail (inherited from birthday-hunt; the 3-checkpoint bits no longer apply).
