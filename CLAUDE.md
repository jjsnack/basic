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

## Themes

Themes are pure CSS: one `:root[data-theme="<name>"]` block in
`assets/css/main.css` sets the palette. Picked from the console (`theme set
<name>`, `theme list`) — the name list lives in `console.js`'s `theme` command
`modes` array, so add there too. `light`/`dark`/`auto` are the base modes;
everything else is a colour theme. Persistence + no-flash apply happen in
`baseof.html` (pre-paint script) and `header.html` (toggle glyph).

### Colourable surfaces

Every colour flows from CSS vars, so a theme controls all of it:

- **Core**: `--bg`, `--fg`, `--muted`, `--border`.
- **Selection highlight**: `--selection` (the `::selection` background).
- **Inline code**: `--code`.
- **Syntax highlighting**: the pop palette below drives Chroma token classes
  (`.chroma .k` keywords, `.s` strings, `.m` numbers, `.nf` functions, etc).
  Requires `markup.highlight.noClasses = false` in `hugo.toml`.
- **Mermaid diagrams**: `baseof.html` reads the pop palette + core vars at load
  and feeds them to `mermaid.initialize({ theme: "base", themeVariables })`.
  Diagrams are tinted at page load — reload after switching themes.
- **Pop palette**: `--c-red --c-orange --c-yellow --c-green --c-cyan --c-blue
  --c-purple --c-pink`. Themes remap these; they feed syntax + mermaid and are
  handy source colours for the sets below.

### Sets

UI chrome is grouped into **sets** — named vars so a theme can tint each surface
independently (e.g. Dracula keeps the selection grey but makes pills green, rows
purple, the console pink). Every set defaults to `--accent` (fill sets also to
`--accent-fg`), so a theme that sets only `--accent` colours everything at once;
override a set to break it out.

| set | var(s) | elements |
|-----|--------|----------|
| link | `--link` | link hover, hovered nav `.current`, prose underline, `#topic` hover |
| pill | `--pill` / `--pill-fg` | topic tag pills (`.topics__item`) hover fill |
| row | `--row` / `--row-fg` | post-list row (`.post-list__link`) hover fill |
| terminal | `--term` / `--term-fg` | console launcher + button fills, banner, prompt, caret |
| focus | `--focus` | `:focus-visible` outline |

`*-fg` is the text/glyph colour on a filled (solid-background) set — pick one
with contrast against the fill.

### Adding a theme

1. Add a `:root[data-theme="<name>"] { … }` block. Use `:root[...]` (not bare
   `[data-theme]`) so it matches the dark media query's specificity and wins by
   source order. Set core vars + `--selection` + `--code` + the pop palette;
   override any sets you want distinct from `--accent`.
2. Add `<name>` to the `modes` array in `console.js`'s `theme` command, plus an
   `assert` for it in the self-check, then run `node assets/js/console.js`.
3. `pnpm build` and eyeball it (`theme set <name>`), including a post with code
   and a mermaid diagram.
