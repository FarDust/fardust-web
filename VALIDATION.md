# Pretext Integration Validation

Use this file as the implementation-time oracle for the FarDust Pretext rollout.

## Core rules

- Use `README.md` from `@chenglou/pretext` as the public API source of truth.
- Route-owned text should prepare once per stable `text + font + locale + whiteSpace` tuple and relayout on width changes.
- The layout hot path must not use DOM text-measurement APIs such as `getBoundingClientRect()` on rendered text nodes, `offsetHeight`, or hidden mirror nodes.
- `walkLineRanges()` is the preferred rich-path geometry API for shrinkwrap and aggregate-width work.
- `layoutNextLine()` is the preferred API for obstacle-aware editorial flow.
- `setLocale()` must run before preparing text for a different locale, and locale changes must invalidate prepared-text caches.

## Typography and CSS sync

- Use named fonts already loaded by the app: `Inter`, `Inter Tight`, `JetBrains Mono`, and `Space Grotesk`.
- Do not use `system-ui` for Pretext-rendered text.
- Match Pretext font strings to actual rendered CSS font declarations.
- Respect the library’s common target CSS config:
  - `white-space: normal`
  - `word-break: normal`
  - `overflow-wrap: break-word`
  - `line-break: auto`
- Use `{ whiteSpace: 'pre-wrap' }` only for preserved-whitespace/editor-like text.

## App canaries

Always validate these text classes after major changes:

- English UI copy
- Spanish localized copy
- Emoji-rich lines
- CJK text
- Mixed bidi text
- URL/query-string text
- Numeric/time-range text
- Preserved-whitespace text where `pre-wrap` is enabled

## Expected behaviors

- Shrinkwrap should find the tightest width that preserves the same line count as the initial wrapped layout.
- Mixed app text should not regress around URLs, emoji ZWJ runs, or mixed-script punctuation.
- Narrow widths may still break inside words, but only at grapheme boundaries; do not silently change that default behavior across the site.
- Soft hyphen and bidi edge cases should not be “fixed” with ad hoc DOM slicing in userland.

## Manual QA

- Compare representative Pretext-rendered surfaces against the browser’s native rendering for the same font and width.
- Verify resize relayout does not re-prepare unchanged text.
- Verify locale switching rerenders text with the correct locale-aware segmentation.
- Verify the showcase route demonstrates:
  - editorial obstacle-aware flow
  - shrinkwrap comparison against CSS
  - multilingual validation samples
