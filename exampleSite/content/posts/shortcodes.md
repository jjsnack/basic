+++
title = "Shortcode reference"
date = 2026-07-28
draft = false
topics = ["Reference"]
+++

Every shortcode the **basic** theme ships, with syntax and a live example.
Most take either positional or named params — never both mixed in the same
call (a Hugo restriction, not this theme's).

## Repo & package cards

`github`, `gitlab`, `huggingface`, `npm`, `crates`, `pypi` all render the same
`.repo-card` component. Each fetches live metadata from the relevant API at
build time and falls back to a bare link card if the fetch fails — pass the
override params to skip the network call entirely.

### github

```
{{</* github "owner/repo" */>}}
{{</* github "owner/repo" desc="…" lang="…" stars="…" */>}}
```

{{< github "gohugoio/hugo" >}}

### gitlab

```
{{</* gitlab "namespace/project" */>}}
{{</* gitlab "namespace/project" desc="…" stars="…" forks="…" */>}}
```

{{< gitlab "gitlab-org/gitlab" >}}

### huggingface

```
{{</* huggingface "owner/model" */>}}
{{</* huggingface "owner/model" type="dataset" */>}}
{{</* huggingface "owner/model" desc="…" likes="…" downloads="…" */>}}
```

{{< huggingface "bert-base-uncased" >}}

### npm

```
{{</* npm "package-name" */>}}
{{</* npm "package-name" desc="…" version="…" license="…" */>}}
```

{{< npm "left-pad" >}}

### crates

```
{{</* crates "crate-name" */>}}
{{</* crates "crate-name" desc="…" version="…" downloads="…" */>}}
```

{{< crates "serde" >}}

### pypi

```
{{</* pypi "package-name" */>}}
{{</* pypi "package-name" desc="…" version="…" license="…" */>}}
```

{{< pypi "requests" >}}

## Code & content embeds

### code

Imports a local file or a remote URL instead of pasting code inline, so it
never drifts out of sync with the source. Optional `lines="12-34"` (1-indexed,
inclusive) and `lang=` (guessed from the extension otherwise).

```
{{</* code file="path/relative/to/project" */>}}
{{</* code url="https://raw.githubusercontent.com/…" lang="go" */>}}
{{</* code file="assets/js/console.js" lines="1-8" */>}}
```

{{< code file="assets/js/console.js" lines="1-8" >}}

### gist

Hugo's built-in `gist` shortcode was removed in v0.156. This one fetches the
gist via the GitHub API and renders it with the theme's own Chroma
highlighting instead of GitHub's unstyled `<script>` embed.

```
{{</* gist "user" "gist-id" */>}}
```

{{< gist "octocat" "6cad326836d38bd3a7ae" >}}

### bluesky

Fetches a post via Bluesky's public AppView API — no auth needed. There's no
equivalent `tweet` shortcode: X/Twitter removed unauthenticated read access,
so embedding one would require baking a developer API key into a public
theme.

```
{{</* bluesky "https://bsky.app/profile/<handle>/post/<id>" */>}}
```

{{< bluesky "https://bsky.app/profile/bsky.app/post/3mqcp5qjdfs26" >}}

### youtube

Hugo's own built-in shortcode — no theme code needed, just a CSS rule so it
matches the theme's rounded corners.

```
{{</* youtube VIDEO_ID */>}}
```

{{< youtube dQw4w9WgXcQ >}}

## Content helpers

### swatches

A row of colour chips, each labelled with the value passed. No network.

```
{{</* swatches "#hex1" "#hex2" "#hex3" */>}}
```

{{< swatches "#64748b" "#3b82f6" "#06b6d4" >}}

### admonition

`type` is one of `note` (default), `tip`, `warning`, `danger`. `title`
defaults to the type, title-cased.

```
{{</* admonition */>}}Plain note.{{</* /admonition */>}}
{{</* admonition type="warning" title="Careful" */>}}…{{</* /admonition */>}}
```

{{< admonition type="tip" title="Pro tip" >}}Use `pnpm dev` for live reload while writing.{{< /admonition >}}

### details

Wraps the native `<details>`/`<summary>` disclosure — no JS.

```
{{</* details summary="Click to expand" */>}}Markdown content.{{</* /details */>}}
```

{{< details summary="Click to expand" >}}
Hidden content with **markdown** support.
{{< /details >}}

### badge

An inline pill. `color` is optional — one of the pop palette names (`red`,
`orange`, `yellow`, `green`, `cyan`, `blue`, `purple`, `pink`); omit it for a
neutral badge.

```
{{</* badge "MIT" */>}}
{{</* badge "v1.2.0" "blue" */>}}
```

{{< badge "MIT" >}} {{< badge "v1.2.0" "blue" >}} {{< badge "beta" "orange" >}}

### mailto

An obfuscated mail link with an optional subject and link text. HTML
entity-encoding alone doesn't survive Hugo's `--minify` pass (it decodes
entities straight back to plaintext), so the real address is base64'd into
data attributes and assembled by a few lines of inline JS on load — the one
shortcode in the theme that needs JS. Params are positional-only
(`email`, `subject`, `text`) since Hugo shortcodes can't mix positional and
named params in one call.

```
{{</* mailto "user@example.com" */>}}
{{</* mailto "user@example.com" "Subject line" "link text" */>}}
```

Questions? {{< mailto "hello@example.org" "Hello from the blog" "say hi" >}}.

## Footnotes

Not a shortcode — goldmark handles `[^1]` natively. The theme just adds CSS to
match the mono/muted aesthetic.

```
A claim.[^1]

[^1]: The footnote.
```

A claim.[^1]

[^1]: The footnote, styled to match the rest of the theme.
