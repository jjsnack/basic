# basic

Minimal black-and-white Hugo theme for text-first blogs. Light/dark/auto, no JS
dependencies. The theme itself lives at repo root; `exampleSite/` is the demo
site used for local dev.

## Commands

- `pnpm dev` — hugo server on `exampleSite/` with drafts, live reload
- `pnpm build` — minified production build of `exampleSite/`
- `node assets/js/console.js` — run the console self-check (asserts at bottom of file)

Hugo min version 0.116.0. Assets go through Hugo Pipes (Minify + Fingerprint),
see `layouts/partials/console.html`.

## Layout

- `layouts/` — templates (`_default/`, `partials/`). `baseof.html` is the shell.
- `assets/css/main.css` — the whole stylesheet. One `--accent` var tints hovers.
- `assets/js/console.js` — the floating terminal (below).
- `assets/figlet/heading.flf` — figfont for the console banner.

## Console

Floating terminal, progressively enhanced — page works with JS off (launcher +
window start `hidden`, JS unhides). All logic is in one file, `assets/js/console.js`:

- `run(input, ctx)` is a **pure** function returning `{ lines, clear?, close?, theme?, music?, volume? }`.
  Keep it side-effect-free so the `node console.js` self-check can exercise it.
- Browser wiring at the bottom reads those signals (applies theme, plays music, etc).
- 8-bit soundtrack is synthesised live with WebAudio — no audio files.

### Command style — all commands MUST follow this

Multi-action commands are **subcommand-based**. Bare command prints a usage
block; a bad subcommand/arg prints a one-line `usage:` hint. Pattern (see
`theme` and `music`):

```
Usage:  <cmd> <subcommand> ...

   <one-line description>

Subcommands:

   <sub>  : <description>
   <sub>  : <description>
```

- Align the `:` in subcommand and `help` lines.
- Bad arg → single line: `usage: <cmd> <sub> <expected>`.
- Add every new command to the `help` list (aligned `name : description`).
- Add an `assert` to the self-check block for each new branch, then run
  `node assets/js/console.js`.
