# Glyphogram

Glyphogram is a frontend-only daily nonogram (Picross) web app. It generates one deterministic puzzle per date, validates uniqueness locally, and stores progress in LocalStorage.

## Stack
React + TypeScript + Vite + Tailwind CSS + Framer Motion + lucide-react.

## Daily generation
- Daily seed format: `glyphogram-v1:YYYY-MM-DD:<salt>`.
- Date source is isolated in `getDateStringLA()` using `America/Los_Angeles`.
- Uses seeded RNG (`xmur3` + `mulberry32`) and procedural glyph-like generation.
- Candidate boards are rejected for poor density/connectivity.
- Row/column clues are computed from the hidden solution.
- Solver counts solutions up to 2; only exactly-1 is accepted.
- Candidate attempts iterate deterministically with attempt counters.
- Recent 60-day hash check helps avoid obvious repeats.

## Nonogram solver
`src/lib/solver.ts` generates all line patterns for row/column clues and backtracks row-by-row, pruning against compatible column prefixes, with early stop after 2 solutions.

## Local development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## GitHub Pages deployment
### Option A: GitHub Actions (recommended)
Use `.github/workflows/deploy.yml` and enable **Settings → Pages → Source: GitHub Actions**.

### Option B: Manual deploy script
```bash
npm run deploy
```

## License notes
All code is original in this repository and uses open-source dependencies.
