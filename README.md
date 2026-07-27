# basic

A minimal, black-and-white Hugo theme for text-first blogs. Pure monochrome
until you hover something clickable — then a single accent colour pops. Ships
with light / dark / auto modes (no flash on load, remembers your choice).

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

Standard markdown images render as captioned `<figure>`s (alt text becomes the
caption), lazy-loaded:

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

## Theme modes

Header button cycles **auto → light → dark** (`◐ ○ ●`). Auto follows the OS;
an explicit pick is saved to `localStorage`.

## Change the accent colour

One line in `assets/css/main.css`:

```css
--accent: #ff2d55;
```

## Requirements

Hugo extended ≥ 0.116 (uses the asset pipeline for CSS).
