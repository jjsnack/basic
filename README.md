# basic

A minimal, black-and-white Hugo theme for text-first blogs. Pure monochrome
until you hover something clickable — then a single accent colour pops. Ships
with light / dark / auto modes plus a few colour themes (no flash on load,
remembers your choice), a set of shortcodes for embedding code and repo/package
cards, and a floating console to drive it all.

**Live demo:** https://jjsnack.github.io/basic/ (the `exampleSite/`, built and
deployed on every push).

## Install

**As a Hugo Module** (recommended):

```bash
hugo mod init github.com/you/your-site
```

```toml
# hugo.toml
[module]
  [[module.imports]]
    path = "github.com/jjsnacks/basic"
```

**Or as a git submodule:**

```bash
git submodule add https://github.com/jjsnacks/basic themes/basic
```

```toml
# hugo.toml
theme = "basic"
```

## Config

```toml
[params]
  description = "Shown under the title on the home page."
  footerNote  = "Optional line in the footer."

[[menu.main]]
  name = "Posts"
  url  = "/posts/"
```

Put posts under `content/posts/`. The home page lists them newest-first.

## Topics (taxonomy)

Add a `topics` list to a post's front matter:

```toml
topics = ["Design", "Meta"]
```

The home and list pages show a topic cloud; each topic gets its own page at
`/topics/<name>/`, and every post footer links its topics. The taxonomy is
declared in site config:

```toml
[taxonomies]
  topic = "topics"
```

## Images

Standard markdown images render as captioned, borderless `<figure>`s (alt text
becomes the caption), lazy-loaded. Click one to zoom via a pure-CSS lightbox
(no JS):

```markdown
![This caption shows under the image.](/img/photo.jpg)
```

## LaTeX math

Write `$...$` (or `\(...\)`) inline and `$$...$$` (or `\[...\]`) for display.
Rendered to MathML at build time — no client-side JavaScript, browsers display
it natively. Requires the passthrough extension in site config:

```toml
[markup.goldmark.extensions.passthrough]
  enable = true
  [markup.goldmark.extensions.passthrough.delimiters]
    block  = [['\[', '\]'], ['$$', '$$']]
    inline = [['\(', '\)'], ['$', '$']]
```

Note: with `$` as an inline delimiter, a literal `$` in prose needs escaping
(`\$`). Drop the `['$', '$']` line if you'd rather not.

## Mermaid diagrams

Fence a diagram with `mermaid` and it renders client-side. The library loads
only on pages that contain one, and picks light/dark to match the theme at
load:

    ```mermaid
    flowchart LR
      A --> B
    ```

## Shortcodes

| Shortcode | What it does |
|---|---|
| `github`, `gitlab`, `huggingface`, `npm`, `crates`, `pypi` | Repo/package cards. Fetch live description/stats from the relevant API at build time, fall back to a bare link card if the fetch fails. Override with `desc=`/etc. to skip the network call. |
| `code` | Imports a local file or remote URL instead of pasting code inline, so it can't drift out of sync. `lines="12-34"` for a range, `lang=` to override the guessed language. |
| `gist` | Renders a GitHub gist with the theme's own syntax highlighting (Hugo's built-in `gist` shortcode was removed in v0.156). |
| `bluesky` | Renders a Bluesky post via its public API. No `tweet` equivalent — X/Twitter dropped unauthenticated read access. |
| `youtube` | Hugo's built-in shortcode; the theme just themes its corners. |
| `swatches` | A row of labelled colour chips. |
| `admonition` | A themed callout: `type="note\|tip\|warning\|danger"`. |
| `details` | Wraps native `<details>`/`<summary>` — no JS. |
| `badge` | An inline pill, optionally coloured from the pop palette. |
| `mailto` | An obfuscated mail link. Base64 + a few lines of inline JS assemble the real `mailto:` on load — the one shortcode here that needs JS, since HTML-entity encoding doesn't survive Hugo's `--minify` pass. |

Full syntax and live examples for each: `exampleSite/content/posts/shortcodes.md`.

## The console

A floating terminal (bottom-right launcher, `$`), progressively enhanced —
the page works fully with JS off. Type `help` inside it for the full command
list; the two with real content:

- `theme set <name>` — switch theme. Modes: `light`, `dark`, `auto`, plus any
  colour theme file under `assets/css/themes/*.css` (ships with `paper`,
  `dracula`, `valentine`). Persisted to `localStorage`, no flash on reload.
- `music play` / `music stop` / `music volume <0-10>` — an 8-bit soundtrack
  synthesised live with WebAudio (no audio files), one tune per theme,
  keeps playing across page navigation.

### Change the accent colour

One line in `assets/css/main.css`:

```css
--accent: #ff2d55;
```

### Add a colour theme

Drop a new `assets/css/themes/<name>.css` with a `:root[data-theme="<name>"]`
block (see the existing ones for the variable list), then add `<name>` to the
`modes` array in `assets/js/console.js`'s `theme` command.

## Demo deployment

`.github/workflows/pages.yml` builds `exampleSite/` with Hugo extended and
publishes it to GitHub Pages on every push to `main`. To enable it on your
fork: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The workflow injects the correct `baseURL` for project pages automatically.

## Requirements

Hugo extended ≥ 0.141 (asset pipeline for CSS; the repo/package card
shortcodes use the `try` keyword, added in that release).
