# Architecture

What this repo is structurally, and why. The editorial brief — what a topic page
must contain and to what depth — lives in `CLAUDE.md`; this file covers the
mechanics. `LEARNINGS.md` records things that bit us.

## The big picture

A hand-written static site, published by GitHub Pages from the `/docs` folder on
the default branch. There is no build step, no framework, no bundler, no
package.json and no CI. What is committed is what is served.

That is a deliberate constraint rather than an omission. The content is long-form
prose with a dense internal link graph and a life measured in years; a build step
would add a failure mode between writing and publishing without making any of the
actual work easier. The cost is that consistency across pages is a convention
enforced by review, not by a compiler — which is why the pre-flight checklist in
`CLAUDE.md` exists and why every page is verified with a script before shipping.

```
CLAUDE.md                       the editorial brief and the page contract
PROMPT.md                       log of what was asked for, one entry per session
ARCHITECTURE.md                 this file
LEARNINGS.md                    accumulated gotchas; read before starting a page
README.md                       orientation and publishing notes
memory/YYYY-MM-DD.md            per-session work log
templates/topic-template.html   copy this to start a page; never published
docs/                           the entire published site
  .nojekyll                     stops GitHub Pages running Jekyll over /docs
  index.html                    the catalog
  assets/style.css              the only stylesheet — the class contract
  assets/site.js                rail scroll-spy + catalog filter, both optional
  <topic-slug>/index.html       one self-contained page per topic
```

## Components and boundaries

**A topic page is self-contained.** All of its prose, its citation graph and its
resource list live in one HTML file. Pages never link to each other's fragments,
only to each other's root (`../other-slug/`). Adding, editing or deleting a topic
touches exactly two files: its own `index.html` and the catalog.

**The stylesheet is the contract between pages.** Every visual pattern a page may
use is a class in `docs/assets/style.css`, and the file's header says so. A page
that needs a pattern the stylesheet lacks adds the class *there*, with a comment
explaining why, rather than introducing a `<style>` block or an inline style. The
one permitted inline style in the whole repo is the rail's `margin-top` on the
second `rail-label`, and it is in the template.

**JavaScript is decoration.** `site.js` adds rail scroll-spy on topic pages and a
substring filter on the catalog. Both degrade to nothing: with JS off the rail is
a list of working anchors and the catalog shows every card. No page may depend on
it, and every page is verified with `javaScriptEnabled: false`.

## The citation graph — the one non-obvious invariant

This is the structural idea the whole page format hangs on, and the thing most
likely to be broken by a careless edit.

Outbound links to the open web appear **only** in the `#resources` section at the
bottom of a page. The syllabus body links to resources by in-page anchor:

```html
<a class="cite" href="#r-07" data-code="R-07">Designing Data-Intensive Applications</a>
```

`data-code` is what renders the little `R-07` marker, via `.cite::after`, and it
must match the target's visible code. Each resource carries the reverse edge:

```html
<span class="r-used">Used in <a href="#m3">M03</a> <a href="#m7">M07</a></span>
```

Both directions must be complete: no citation without a target, no resource
without at least one citation. Resource ids are zero-padded and run continuously
across all nine resource groups in page order, so **renumbering is all-or-nothing**
— either retire an id and leave the gap, or renumber the whole list and fix every
citation and every `data-code` in the same commit.

Why anchors rather than direct links: it keeps the syllabus readable as prose,
forces every recommendation through one vetted, annotated list, makes the
"is this resource actually used" question mechanically checkable, and means a
dead URL is fixed in exactly one place.

## Catalog wiring

`docs/index.html` holds cards between `<!-- CATALOG:START -->` and
`<!-- CATALOG:END -->`. Cards are grouped by `<section class="cat-group">`, one
per category, in alphabetical order by heading. A card's code is a two-letter
category prefix plus a sequence number within that category (`CS-01`, `EF-01`,
`MA-01`), so codes are stable under the insertion of new categories.

The filter in `site.js` matches against each card's entire `textContent`, so the
`card-desc` is doing double duty as search text — write it with the words a
reader would actually type, not just the ones in the title.

## Verifying a page

There is no test suite, so verification is a script you run before committing.
Serve the site and drive a browser:

```bash
python3 -m http.server -d docs 8765
```

Playwright's browsers are pre-installed but the npm package may not match; launch
with an explicit path (see `LEARNINGS.md`):

```js
chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
```

What to assert, at 380/768/1280 px and with JavaScript both on and off:

- `document.documentElement.scrollWidth <= clientWidth` — no horizontal scroll.
  380 px is the binding case and it has caught real bugs twice.
- every `a[href^="#"]` resolves to an element that exists.
- rail order matches module order; the counts in `meta[name="syllabus:*"]`, the
  hero meta row and the footer all match the real number of modules and resources.
- no `<style>` block, no inline `style` beyond the template's one, no absolute
  internal links.

Expect two harmless console errors locally: a favicon 404, and
`ERR_CONNECTION_RESET` for the Google Fonts stylesheet, which is unreachable from
the sandbox — local screenshots therefore show fallback fonts.

## Conventions worth knowing before you edit

- **A published URL is a permalink.** Update a topic in place and bump
  `meta[name="syllabus:updated"]`, the footer date and the catalog card's date. A
  genuinely different treatment of the same subject gets a new slug and the two
  pages link each other from `#next`.
- **Slugs are the URL**: `docs/<slug>/index.html` serves at `/<slug>/`. Lowercase,
  hyphenated, no stop-words.
- **Relative links only**, so the site works at `user.github.io/repo/` and on a
  custom domain without changes.
- **`PROMPT.md` is a prompt log**, not a brief. Append one entry per session —
  what was asked, verbatim, and a line on what it produced. It must not restate
  anything from `CLAUDE.md`; a second copy of the instructions is a second thing
  to keep in sync, which is exactly how the file went wrong the first time.
