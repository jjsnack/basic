# basic

Minimal black-and-white Hugo theme for text-first blogs. Light/dark/auto, no JS
required to read a post — the one exception is the `mailto` shortcode, which
needs a few inline lines to assemble the obfuscated address (see Shortcodes
below). The theme itself lives at repo root; `exampleSite/` is the demo site
used for local dev.

## Commands

- `pnpm dev` — hugo server on `exampleSite/` with drafts, live reload
- `pnpm build` — minified production build of `exampleSite/`
- `node assets/js/console.js` — run the console self-check (asserts at bottom of file)

Hugo min version 0.141.0 (the repo/package card shortcodes use the `try`
keyword, added in that release). Assets go through Hugo Pipes (Minify +
Fingerprint), see `layouts/partials/console.html`.

## Layout

- `layouts/` — templates (`_default/`, `partials/`, `shortcodes/`). `baseof.html`
  is the shell.
- `assets/css/main.css` — the core stylesheet (base light/dark, layout, sets).
  Colour themes live in `assets/css/themes/*.css`, concatenated in `baseof.html`.
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

## Shortcodes

Live in `layouts/shortcodes/`, one file per shortcode. Full syntax + rendered
examples for every one of them: `exampleSite/content/posts/shortcodes.md` —
update that post whenever a shortcode is added, renamed, or reparamaterized.

- **Positional vs named params**: Hugo shortcode calls cannot mix positional
  and named params in the same call. Every shortcode here accepts positional
  args (`.Get 0`, `.Get 1`, ...) with named overrides (`with .Get "name"`) so
  either calling style works alone — but a call can't use both at once. Bit
  us twice already (`mailto`, `badge`); if a new shortcode's demo call errors
  with "Cannot mix named and positional parameters", this is why.
- **Repo/package cards** (`github`, `gitlab`, `huggingface`, `npm`, `crates`,
  `pypi`) all render the shared `.repo-card` component — same markup shape
  (icon, name, description, meta stats), so a new registry card should reuse
  those classes rather than inventing new ones.
- **Build-time API fetch pattern**: `try (resources.GetRemote url)`, then
  `with .Value` / `if .Err`. Hugo removed `resource.Err` in v0.141.0 in favour
  of the `try` keyword — don't reach for the old pattern.
- **Fail soft vs fail loud**: the repo/package cards degrade to a bare link
  card if the API call fails (the link still works without the decoration).
  `gist`, `bluesky`, and `code` hard-error via `errorf` instead — for those,
  the fetched content *is* the entire point of the shortcode, so a silent
  empty render would be actively misleading.
- **`mailto`** is the one shortcode that ships JS: HTML entity-encoding the
  address doesn't survive Hugo's `--minify` pass (it decodes entities back to
  plaintext), so the real link is base64'd into data attributes and assembled
  by inline JS on load instead.

## Themes

Themes are pure CSS: each named theme is its own file under
`assets/css/themes/*.css` holding one `:root[data-theme="<name>"]` block.
`baseof.html` concatenates `main.css` + every theme file (themes last) into one
fingerprinted bundle. Picked from the console (`theme set <name>`, `theme
list`) — the name list lives in `console.js`'s `theme` command `modes` array,
so add there too. `light`/`dark`/`auto` are the base modes (defined in
`main.css`); everything else is a colour-theme file. Persistence + no-flash
apply happens in `baseof.html`'s pre-paint script.

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

1. Add `assets/css/themes/<name>.css` with one `:root[data-theme="<name>"] { … }`
   block. Use `:root[...]` (not bare `[data-theme]`) so it matches the dark media
   query's specificity and wins by source order (themes are concatenated after
   `main.css`). Set core vars + `--selection` + `--code` + the pop palette;
   override any sets you want distinct from `--accent`. It's picked up by the
   `resources.Match "css/themes/*.css"` glob automatically — no wiring needed.
2. Add `<name>` to the `modes` array in `console.js`'s `theme` command, plus an
   `assert` for it in the self-check, then run `node assets/js/console.js`.
3. `pnpm build` and eyeball it (`theme set <name>`), including a post with code
   and a mermaid diagram.
