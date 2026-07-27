+++
title = "A syntax highlighting sampler"
date = 2026-07-27
draft = false
topics = ["Reference"]
+++

A page that does nothing but hold code, so the theme's token colours have
somewhere to show off. Switch themes from the console (`theme set dracula`,
`theme set paper`) and watch the keywords, strings, and numbers re-tint.

## Python

Comments, decorators, f-strings, and builtins all get their own hue.

```python
from functools import lru_cache


@lru_cache(maxsize=None)
def fib(n: int) -> int:
    """Classic memoised Fibonacci."""
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)


class Ring:
    """A tiny fixed-size ring buffer."""

    def __init__(self, size: int = 8) -> None:
        self.size = size
        self._buf: list[int] = []

    def push(self, x: int) -> None:
        self._buf.append(x)
        if len(self._buf) > self.size:
            self._buf.pop(0)


if __name__ == "__main__":
    print(f"fib(20) = {fib(20)}")  # 6765
```

## JavaScript

```js
const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

async function fetchJSON(url, { retries = 3 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 2 ** attempt * 100));
    }
  }
}

export { clamp, fetchJSON };
```

## Go

```go
package main

import (
	"fmt"
	"strings"
)

// Title-cases each word without the deprecated strings.Title.
func title(s string) string {
	words := strings.Fields(s)
	for i, w := range words {
		words[i] = strings.ToUpper(w[:1]) + w[1:]
	}
	return strings.Join(words, " ")
}

func main() {
	fmt.Println(title("the quick brown fox")) // The Quick Brown Fox
}
```

## Rust

```rust
/// Sum of the even Fibonacci numbers below `limit`.
fn even_fib_sum(limit: u64) -> u64 {
    let (mut a, mut b) = (1u64, 2u64);
    let mut total = 0;
    while a < limit {
        if a % 2 == 0 {
            total += a;
        }
        (a, b) = (b, a + b);
    }
    total
}

fn main() {
    println!("{}", even_fib_sum(4_000_000));
}
```

## Shell

```bash
#!/usr/bin/env bash
set -euo pipefail

# Roll back to the newest tag, or fail loudly.
latest=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [[ -z "$latest" ]]; then
  echo "no tags found" >&2
  exit 1
fi
git checkout "$latest"
```

## CSS

```css
:root {
  --gap: clamp(1rem, 2vw, 2rem);
}

.grid {
  display: grid;
  gap: var(--gap);
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}
```

Inline code such as `git rebase -i` or `--maxsize=None` picks up the theme's
`--code` colour too.
