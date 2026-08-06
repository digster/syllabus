# Learnings

Things discovered while building pages in this repo. Read before starting a new
topic page; add to it when something bites.

## The `.cite` nowrap trap (fixed 2026-08-03)

`docs/assets/style.css` originally set `white-space: nowrap` on `.cite`. Because
citation labels are resource titles, and real academic titles run to 70+
characters, any such citation forced the whole page to scroll horizontally at
380 px — measured `scrollWidth` 849 px against `clientWidth` 380 px on the
information-theory page before the fix.

The rule existed to stop the `R-NN` code (rendered by `.cite::after`) from
wrapping onto its own line, orphaned from its title. Both goals are satisfiable
at once:

```css
.cite { overflow-wrap: break-word; }
.cite::after { content: "\00a0" attr(data-code); white-space: nowrap; }
```

The non-breaking space binds the code to the last word of the title. **Do not
reintroduce `white-space: nowrap` on `.cite`.** If you need a short citation
label for prose reasons, shorten it — but the layout no longer requires it.

## The README's rail-item check over-counts

`grep -c 'rail-item'` returns module count **+ 3**, because the template's second
rail list ("Also") holds capstone, mastery and resources. Use
`grep -c 'class="rail-item"><a href="#m[0-9]'` to count module entries only —
note the `[0-9]`, without it the pattern also matches `#mastery` and you are
back to an off-by-one. Fixed in `README.md`.

## A blocked URL is not a reason to cut a resource

**This is now the rule in `CLAUDE.md`, learned the hard way.** On the first pass
I cut *A Mind at Play* (Soni & Goodman) from the information-theory page purely
because Simon & Schuster answers 403 to every automated checker. The book is
real, well identified and the best history of Shannon in print — cutting it threw
away a good resource over a property of someone else's web server.

Separate the two failures and treat them differently:

- **Cannot confirm it exists** → cut. This is the case the old "cut is usually
  right" advice was written for.
- **Confirmed it exists, URL won't answer a script** → keep it, link the
  canonical home anyway, and put the reason in brackets at the end of the note:
  `(Publisher page returns 403 to automated link checks — it opens normally in a
  browser.)`

`tag--unverified` means *I could not establish this is what I claim*. It does
not mean *the server refused me*. Do not use it for the second case.

## Verifying resource URLs when publishers block you

A plain status check is not enough. From this environment these consistently
return bot-challenge codes rather than real 404s:

| Host | Behaviour | How to confirm identity anyway |
|---|---|---|
| Wiley, Cambridge, APS, MIT Press | 403 | Crossref: `https://api.crossref.org/works/<DOI>` returns title, year, publisher |
| IEEE Xplore | 202 | same — Crossref by DOI |
| Simon & Schuster (and trade publishers generally) | 403 on every path | no DOI; use OpenLibrary `https://openlibrary.org/search.json?q=isbn:<ISBN>` for title/authors/year/pages, and Wikipedia's REST summary for the subtitle |
| GitHub (curl) | 403 | WebFetch works; the REST API does not |
| YouTube | 429 / captcha redirect | neither curl nor WebFetch; rely on search results |
| itsoc.org, encode.su | 403 (Cloudflare) | search results only |

Crossref confirms *the work is what you think it is* — title, year, container —
which is the part that actually matters. For DOI-bearing works, link
`https://doi.org/…` as the canonical home rather than a scraped mirror. For trade
books there is no DOI, so link the publisher's own page even though it 403s, and
bracket the caveat.

`inference.org.uk` and other academic hosts 403 the default WebFetch user agent
but return 200 to curl with a normal browser UA. A 403 from WebFetch alone is not
evidence a link is dead.

## Playwright browser version mismatch

`npm install playwright` pulls a version expecting a browser build that is not in
`/opt/pw-browsers` (installed: 1194). `npx playwright install` is disallowed in
this environment. Launch with an explicit path instead:

```js
chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
```

Expect two harmless console errors on every local page load: a favicon 404, and
`ERR_CONNECTION_RESET` for the Google Fonts stylesheet, which is unreachable from
the sandbox. Neither indicates a page defect — but it does mean local screenshots
show fallback fonts, not the real ones.

## Page-length guidance is loose

`CLAUDE.md` suggests 2,500–5,000 words of syllabus body for 8–14 modules. A
13-module page written to the stated depth bar came out at ~9,100 words, of which
~1,760 were `Work through` citation lists rather than prose. The depth bar and
the word range are in tension; the depth bar is the one the brief actually
argues for. Flag the count in the report and let the reviewer decide.

## `overflow-wrap: break-word` does not fix flex-line overflow

Added on 2026-08-05, while the first `<code>` elements in the repo pushed
`blockchain-systems` to a 431 px `scrollWidth` at a 380 px viewport. The culprit
was one token — `process_attestation` — inside an `.assigned li`, which is
`display: flex`.

`overflow-wrap: break-word` **permits** a break inside a long word but leaves the
element's intrinsic **min-content width** at the width of that whole word. A flex
item is sized from min-content, so the line stayed too wide and the page still
scrolled (431 → 404 px, not fixed). `overflow-wrap: anywhere` is the one that
also shrinks min-content:

```css
code { font-family: var(--font-mono); font-size: 0.86em; overflow-wrap: anywhere; }
```

`.cite` gets away with `break-word` because resource titles contain spaces, so
their min-content is one word wide and that is narrow enough. Anything that can
contain a long unbroken identifier — inline code, URLs shown as text, hashes —
needs `anywhere`.

Diagnostic that actually located it, after `getBoundingClientRect().right` on
leaf nodes returned nothing useful (the overflowing text node is not an element):

```js
[...document.querySelectorAll('*')]
  .filter(e => e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0)
```

The last entry in that list is the real source; everything above it is an
ancestor inheriting the overflow.

## Check every remembered arXiv id against the API

An id recalled as a DeFi paper (`2306.01111`) is in fact a medical-imaging paper
on CLIP and interstitial lung disease. A 200 from `arxiv.org/abs/<id>` proves the
id exists, not that it is the paper you mean. One call per id settles it:

```bash
curl -sS "https://export.arxiv.org/api/query?id_list=<ID>&max_results=1"
```

Parse `<title>`, `<published>` and the `<name>` elements. Same discipline as the
Crossref check for DOIs — the failure mode here is a *plausible wrong* citation,
which is worse than a dead link because nothing downstream flags it.

Note that `http://export.arxiv.org/...` returns an empty body from this
environment; use `https://`.

## A dead author site does not mean the book is uncitable

`blocksizewar.com` no longer resolves, which nearly cost the page Jonathan Bier's
*The Blocksize War*. The author serialised the entire book, chapter by chapter,
free on the BitMEX Research blog, and those URLs are live. Before falling back to
a catalog record — or cutting — search for a serialisation, an author's employer's
blog, or a publisher in another territory. `harpercollins.com` 403s while
`harpercollins.ca` returns 200 for the same title, which is the same lesson in
smaller form.

## Verify the page against a page that is known good

The audit script written for this batch was run against `information-theory`
before being trusted on the new pages. It caught two real problems in the new
pages and passed cleanly on the old one — which is what makes a green result
meaningful. A checker that has never been shown to pass on known-good input is
just an assertion.

## Removing a topic breaks pages that are not the topic

The citation contract is intra-page, so nothing on a topic page can dangle when a
*different* topic goes away. The `next` section is the exception — it is the one
place pages link to each other, and those links are invisible to the per-page
audit greps. Removing `information-theory` left a live `../information-theory/`
link in `blockchain-systems`. Before deleting a slug:

```bash
grep -rn "<slug>/" docs/ --include=index.html
```

Anything outside `docs/<slug>/` and the catalog card is an inbound link that has
to be demoted to plain text or repointed. An emptied `.cat-group` should go too —
a category heading with no cards under it reads as a rendering bug.

Leave the history alone. `PROMPT.md`, `memory/` and this file record what was
done and why; editing a removed topic out of them turns a log into fiction.
