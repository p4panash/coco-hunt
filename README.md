# coco-hunt — the one-clue hunt

> A single-stop cut of [birthday-hunt](https://github.com/p4panash/birthday-hunt). Same mobile-first experience — countdown, GPS gate, wobbly mascot, confetti finale — but **one clue** instead of three, because "Fălticeni is three streets and a lake." Opens with a Star Wars-style crawl + "HAPPY BIRTHDAY" reveal, then the one clue sends the friend straight to a locker; the finale QR opens it.

**This is now the whole prank**, merged into a single hunt. It used to be two separate sites/phases — this repo (get him to a locker with a decoy book) and [`coco_bday`](https://github.com/p4panash/coco_bday) (scan a QR on the book → reveal → a second locker). The two-package plan fell through on delivery logistics, so `coco_bday`'s crawl + reveal were folded in here as the cold open, and the hunt now goes straight to the one real locker. **`coco_bday` is retired** — it's no longer part of the live flow (left up, marked as such in its own README).

**Live →** https://p4panash.github.io/coco-hunt/

## How it plays

1. Open the link on a phone. A Star Wars-style crawl plays (tap to pause, or skip it top-right), then a "HAPPY BIRTHDAY" reveal.
2. "give me the clue →" starts the hunt proper: countdown ticks, mascot wobbles, night sky twinkles.
3. Read the one clue. Walk to the locker. GPS auto-unlocks within `radiusMeters`. Stuck? Tap "stuck?" for the plainer hint or the manual code.
4. GOTCHA reveal → finale: locker name + "open in maps" + the QR to scan at the machine.

## What changed vs. birthday-hunt

| | birthday-hunt | coco-hunt |
|---|---|---|
| stops | 3 geo-gated checkpoints | **1** |
| QR | assembled from 3 slices | one whole image |
| flow | intro → gps → ×3 (location → reveal) → finale | **crawl → reveal** → gps → location → reveal → finale |
| theme | "Confetti Dusk" purple + coral | **night sky**: midnight-blue gradient + twinkling `<Starfield>` canvas + warm amber accent, with a one-off Star Wars gold treatment on the intro only |

The state machine, components and screens are the birthday-hunt originals; the flow endpoints, the palette (`src/styles/tokens.css` — token *names* unchanged, values swapped), `<Starfield>`, and the new intro (`<IntroCrawl>` + the reveal half of `Intro.tsx`, styles in `src/styles/intro.css`) are new/merged-in.

## Edit before launch — `src/config.ts`

One file. Replace every `REPLACE_ME`, and see the `TODO` comments near `THE_STOP` and `easyboxLocation`:

- `friendName`
- `intro.crawl` / `greeting` / `heroLine` / `subtitle` / `body` — the cold open. `subtitle` is the one place a gift hint can live (currently "Episode X · The Gift Awakens" — no spoilers).
- `checkpoints[0]` → the locker: `teaser` and `realHint` are written for the confirmed real spot (Penny supermarket, **Str. Oborului**, Fălticeni — "Oborului" = the old cattle-fair street, that's the riddle). **`lat`/`lng` are still a Fălticeni town-centre placeholder** — free geocoders (Nominatim, Photon) have no POI data for this address, so someone needs to drop a real pin: open the spot in Google Maps, long-press it, and copy the decimal coordinates it shows (or read your phone's GPS while standing there). Get this wrong and the GPS gate won't unlock in the right place. `code` is the manual fallback, currently `BULLSEYE`. **Leave `[1]` and `[2]`** — unused filler so the shared 3-slot types still compile.
- `easyboxLocation` → `name` / `hint` shown on the finale are set to the confirmed address; `mapsUrl` is a name+city search (works fine on Google's own index) — swap for a pinned drop once you've confirmed the exact spot, same as the lat/lng above.
- `deadlineISO` → when the locker returns the parcel (drives the countdown)
- `public/qr.jpg` → replace with the real locker QR image

Town name is written `Falticeni` (ASCII) in the config copy — swap in `Fălticeni` if you want the diacritics.

## Run

```bash
npm install
npm run dev        # http://localhost:5173/coco-hunt/
npm run build      # tsc + vite → dist/
```

Add `?test=1` to the URL for the dev drawer (jump between screens, mock GPS). Note: this jumps *into* the hunt (gps preface / the clue / finale) — it doesn't replay the intro crawl, which only lives in the `intro` step.

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
One-time: repo **Settings → Pages → Source: GitHub Actions**.
`base` in `vite.config.ts` is `/coco-hunt/` — keep it in sync with the repo name.

## Built with

React · Vite · TypeScript · `motion` · `canvas-confetti` · GitHub Pages

See [`DEVELOPMENT.md`](./DEVELOPMENT.md) for the technical detail (inherited from birthday-hunt; the 3-checkpoint bits no longer apply).
