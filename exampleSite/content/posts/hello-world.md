+++
title = "Hello, world"
date = 2026-07-20
draft = false
topics = ["Meta", "Design"]
+++

This is a sample post to show how body text reads in the **basic** theme.
The measure is capped so lines stay comfortable, and the palette is pure
black and white until you hover something clickable.

## A heading

Some more text. Here is [a link](https://example.org) — hover it to see the
pop of colour. Inline `code` looks like this.

![A stray placeholder image, its alt text becomes the caption.](https://picsum.photos/960/480)

> A blockquote sits quietly to one side.

## A repo

{{< github "gohugoio/hugo" >}}

{{< gitlab "gitlab-org/gitlab" >}}

{{< huggingface "bert-base-uncased" >}}

## Swatches

{{< swatches "#64748b" "#3b82f6" "#06b6d4" >}}

## A diagram

```mermaid
flowchart LR
  A[Write] --> B[Publish]
  B --> C{Read?}
  C -->|yes| D[Good]
  C -->|no| A
```

```js
function hello() {
  return "world";
}
```

## Some math

Inline, like $E = mc^2$, sits in the sentence. Display math gets its own line:

$$\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}$$

That's it.

## Imported code

{{< code file="assets/js/console.js" lines="1-8" >}}

## A gist

{{< gist "octocat" "6cad326836d38bd3a7ae" >}}

## A video

{{< youtube dQw4w9WgXcQ >}}

## Contact

Questions? {{< mailto "hello@example.org" "Hello from the blog" "say hi" >}}.

Default text: {{< mailto "hello@example.org" >}}

## Admonitions

{{< admonition >}}A plain note, no title override.{{< /admonition >}}

{{< admonition type="tip" title="Pro tip" >}}Use `pnpm dev` for live reload while writing.{{< /admonition >}}

{{< admonition type="warning" title="Careful" >}}This regenerates the fingerprinted bundle.{{< /admonition >}}

{{< admonition type="danger" title="Don't" >}}Never commit `.env` files.{{< /admonition >}}

## Details

{{< details summary="Click to expand" >}}
Hidden content with **markdown** support, revealed via the native `<details>` element.
{{< /details >}}

## Badges

{{< badge "MIT" >}} {{< badge "v1.2.0" "blue" >}} {{< badge "beta" "orange" >}}

## Package cards

{{< npm "left-pad" >}}

{{< crates "serde" >}}

{{< pypi "requests" >}}

## A Bluesky post

{{< bluesky "https://bsky.app/profile/bsky.app/post/3mqcp5qjdfs26" >}}

## A footnote

Here's a claim that needs backing up.[^1]

[^1]: This is the footnote content, rendered by goldmark natively.
