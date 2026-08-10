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
| YouTube | 429 to **WebFetch only** | curl with a normal browser UA returns 200 for `/watch?v=`, `/@channel` and `/playlist` — see the note below |
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

## Page size has floors and no ceilings — resolved 2026-08-06

`CLAUDE.md` used to give 2,500–5,000 words for 8–14 modules, and 25–50 resources.
Every page written to the depth bar broke the word ceiling — information-theory at
~9,160 before it was removed, blockchain-systems at 8,510,
defi-and-onchain-economics at 9,188 — and the
two crypto pages landed on exactly 50 resources each, which is what a binding cap
looks like rather than a coincidence. Two sessions logged the tension and neither
resolved it.

Resolved by removing the ceilings. The floors (8 modules, ~2,500 words, 25
resources) stay, because thinness is a real failure; the maximum is now whatever
the topic needs. Bloat is caught by four quality tests in `CLAUDE.md` — every
module passes the dependency test, no two modules overlap, nothing is inflated to
look thorough, the rail stays navigable — not by a number. If you find yourself
deciding what to leave out of a page because of its length, that is the bug the
old band caused; leave it in and report the size.

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

**Stop recalling ids at all — search by title (2026-08-06).** The check above
caught two more on the blockchain pages: `2005.11421`, recalled as a proof-of-
stake attack paper, is about truncated trans-series in string theory, and
`2102.13597`, recalled as DAO governance, is about fairness in complex networks.
Recalling an id and then verifying it is a hit rate of roughly two-thirds, and
every miss costs a round trip. Go the other way instead — name the paper you
want and let the API give you the id:

```bash
curl -sS --data-urlencode 'search_query=ti:"Bullshark DAG BFT Protocols Made Practical"' \
     --data-urlencode 'max_results=3' -G "https://export.arxiv.org/api/query"
```

This also fails usefully: an empty result means the paper is not on arXiv, which
sends you to IACR eprint, a DOI or the publisher rather than to a guessed id.
IACR ids resolve the same way — scrape `citation_title` from
`https://eprint.iacr.org/<year>/<num>` and read the title back.

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

## `.assigned li` is a flex row, so one work-through item takes one citation

`.assigned li { display: flex }` makes every inline child a flex item, and
contiguous text runs become anonymous flex items between them. Items on a flex
line do not wrap, and each shrinks only to its own min-content, so the line's
minimum width is the *sum* of those min-contents. One citation plus its
description is three items and fits at 380 px. Two citations in one `<li>` is
five, and it pushed `information-theory` into 14 px of horizontal scroll:

```html
<!-- overflows at 380 px -->
<li><a class="cite" …>Paper A</a> and <a class="cite" …>Paper B</a> — read as a pair.</li>
<!-- fits -->
<li><a class="cite" …>Paper A</a> — the claim.</li>
<li><a class="cite" …>Paper B</a> — the rebuttal, immediately afterwards.</li>
```

This is not a stylesheet bug and the fix is not a stylesheet change: every
`.assigned li` on the existing pages already carries exactly one citation, so
splitting the item restores the house pattern. When you want to tell the reader
to read two things together, say so in the second item's note.

The detector is the same one from the earlier overflow bugs — the last element in
the `scrollWidth > clientWidth` list is the real source. Here it reported an
unclassed `LI` at 374 > 340, which reads as a mystery until you notice its parent
is `ul.assigned`.

## The audit script, reimplemented

`memory/2026-08-05.md` recorded an `audit.py` kept only in a session scratchpad
and flagged it as worth reimplementing. It was, and the same note applies again:
it lives in the scratchpad, not the repo. It checks module ids and the six
required parts, rail-to-module correspondence, gapless resource ids, `data-code`
against the visible `R-NN`, the citation graph in both directions, that every
`#…` anchor on the page resolves, all seven count sites plus the catalog card,
and the no-`<style>`/no-inline-style/no-absolute-link rules.

Two checks earned their place beyond the obvious ones. First, comparing the count
of `<a class="cite"` occurrences against the count matching the full
`href="#r-NN" data-code="R-NN"` pattern — a malformed citation otherwise passes
by simply not being seen. Second, requiring `r-used` to match the set of citing
modules *exactly* in both directions, not merely to be non-empty; on a 21-module
page the back-references drift as modules get edited, and "cited by M06 but
`r-used` omits it" is invisible to any grep.

## Generate the citation graph; do not maintain it by hand

Written on the 2026-08-06 blockchain rebuild, and it should be the default from
now on. The citation contract — every `href="#r-NN"` resolving, every `data-code`
matching, every `r-used` naming exactly the citing modules — is the hardest thing
in `CLAUDE.md` to satisfy by hand and the easiest to generate.

Write the page with the resource **title** as the citation's link text and any
placeholder id:

```html
<li><a class="cite" href="#r-01" data-code="R-01">Bitcoin Backbone Protocol</a> — sections 1–5.</li>
```

and give every resource a placeholder back-reference:

```html
<span class="r-used">USED</span>
```

Then run a script that builds `title → id` from the resource list, resolves each
citation's link text against it, rewrites `href` and `data-code`, and emits every
`r-used` span from the graph it just computed. Have it exit **without writing**
if any citation is unresolvable or any resource is uncited. Keep a small alias
table for the short forms the syllabus legitimately uses ("Ethereum Yellow Paper"
for a resource titled *Ethereum: A Secure Decentralised Generalised Transaction
Ledger*).

Three things fall out of this that are not obvious in advance:

- **Renumbering becomes free.** Ids can be reassigned in document order by a
  second three-line script, because nothing points at a number any more — the
  citations point at titles until the wiring step. Inserting a forgotten resource
  into the middle of a 111-entry list stopped being a reason not to.
- **Orphan detection is an editorial signal, not just a lint.** Ten uncited
  resources surfaced on each page. Nine per page were genuinely missing citations
  worth adding; one was a resource that restated another and was cut. A resource
  nothing cites is either an omission or padding, and the script makes you decide
  which.
- **The remaining failures are real.** A citation whose link text matches nothing
  means the resource was never written, which is exactly the error that otherwise
  ships as a dangling anchor.

The auditor still runs afterwards. The generator makes the graph correct; the
auditor proves it, and is the thing validated against a known-good page.

## Citations from outside a module have no back-reference

A corollary of the above, found the same day. `r-used` links modules, so a
resource cited only from `#before-you-start`, `#paths` or `#next` has an empty
back-reference and fails the contract — the generator reports it as uncited even
though the anchor is right there in the markup.

`CLAUDE.md` permits citing from those sections, so this is not a rule violation;
it is a consequence of `r-used` being module-shaped. The fix is to cite the
resource from a module as well, which is usually the right call anyway: a
resource that no module assigns is one the syllabus never actually asks anyone to
read. On the blockchain rebuild this turned an apparent lint failure into a real
improvement — the MIT *Blockchain and Money* course had been relegated to a
prerequisite bullet and belonged in M01's work-through.

## A hard-to-verify group is not a licence to under-fill it

**This is now the rule in `CLAUDE.md`, learned the hard way** — the Resource
rules gained a "a thin group is a research result, not a curation decision"
bullet and the pre-flight checklist gained a line requiring every group to have
actually been searched. What stays here is the environment fact underneath it.

Written 2026-08-06 after shipping the blockchain pages with four and three
entries in Talks &amp; video, reporting the thinness as an editorial decision, and
being called on it.

Nothing had been cut — which was exactly what made it slippery. I had stopped
searching that group early because verification felt awkward, then described the
result as restraint. **Under-supplying a group and calling it curation is the
same failure as cutting a confirmed resource, and it is harder to catch, because
there is no dropped entry to point at.** If a group is thin, say whether you
looked and could not find, or did not look.

The excuse also did not survive checking. The table above used to say YouTube
was unreachable to "neither curl nor WebFetch". That is wrong: WebFetch gets 429,
but **curl with a normal browser user agent returns 200** for `/watch?v=…`,
`/@channel` and `/playlist?list=…`. One command would have shown it:

```bash
curl -sS -o /dev/null -w '%{http_code}' -L -A 'Mozilla/5.0 … Chrome/126 …' "<url>"
```

Two rules that follow:

- **Prefer the canonical non-video home even when the video resolves.** An
  author's own video index (`timroughgarden.org/videos.html`), a conference
  archive entry (`archive.devcon.org/archive/watch/…`), a university event page —
  these are the right link under the existing resource rules *and* they make the
  reachability question moot. Link the platform only when there is no other home.
- **Talks are a real group with real entries.** Conference keynotes, lecture
  video series, and long-form technical podcasts are where protocol design
  reasoning appears a year before anyone writes it down. Treating the group as
  optional filler is how a page ends up all books and papers, which the brief
  names as an anti-pattern.
## A promoted rule has to be applied backwards, not just forwards

Written 2026-08-07. On 2026-08-06 the thin-group rule went into `CLAUDE.md` —
under-filling a resource group and reporting it as curation is the same failure
as cutting a confirmed resource. It was written after the two blockchain pages
were caught doing it. `information-theory` had shipped **hours earlier that same
day** with a three-entry Talks group and this sentence on the page:

> A short group, because this field's best teaching is written.

That is verbatim the excuse the new rule forbids, and `memory/2026-08-06.md`
even flagged it under a heading called "Thin spot". The rule was written, the
offending page was known, and the two never met — because nothing in the
workflow re-checks existing pages when a rule changes. Ten minutes of searching
produced eleven more entries, all with canonical homes, all module-cited.

**When you promote a learning into `CLAUDE.md`, grep the existing pages for the
thing it forbids before closing the session.** For a resource-group rule that is
one command:

```bash
for f in docs/*/index.html; do
  echo "$f"; awk '/resource-group/,/<\/ol>/' "$f" | grep -c 'class="resource"'
done
```

The generalisation: a new rule is evidence that the pages written before it are
wrong in the same way. Treat the rule's own commit as a to-do list.

## Renumbering must rewrite prose references, not just anchors

The generate-the-citation-graph entry above covers `href`, `data-code` and
`r-used`. It misses a fourth place resource codes appear: **ordinary prose**.
`information-theory` names resources inline about forty times — "R-19 is the
option if you learn by watching", "Read the FSE code against R-70 and R-76",
"Worth reading immediately after R-32" — in `r-note` bodies and in every
`.resource-group` intro paragraph.

Inserting fourteen resources mid-list shifted 78 ids. An id-only renumber would
have left every one of those sentences pointing at a different resource, and
**nothing would have caught it**: the anchors all still resolve, the audit
passes, the citation graph is intact. The page just quietly starts telling the
reader to read the wrong thing.

So renumber by mapping every `r-NN` and `R-NN` token in the file, not by
rewriting attributes:

```python
order   = re.findall(r'id="(r-\d+)"', s)
mapping = {old: f"r-{i:02d}" for i, old in enumerate(order, 1)}
s = re.sub(r'r-\d+', lambda m: "\x00%s\x00"  % mapping[m.group(0)], s)
s = re.sub(r'R-\d+', lambda m: "\x01%s\x01"  % mapping[m.group(0).lower()].upper(), s)
s = s.replace("\x00", "").replace("\x01", "")
```

The sentinel characters matter: without them a rewrite can land on an id that
has not been rewritten yet (r-30 → r-44 when r-44 is still pending) and the
second pass mangles it. Two passes with a placeholder are the cheap fix.

This is safe on these pages because every `R-\d+` token in them is a resource
reference. Check that assumption before reusing the snippet on a page that might
contain, say, a part number.

## Two ITSoc hosts, two different failures

`itsoc.org` returns 403 to automated checks behind Cloudflare — already recorded
above, still true, and it applies to `/video`, `/outreach` and
`/conferences/schools/...` as well as the Shannon Award page.

`media.itsoc.org`, which several search results still point at for the School of
Information Theory lecture recordings, **no longer resolves** — `curl` fails at
DNS, not at HTTP. That is the one case where the "keep it and bracket the
caveat" rule does not apply: a host with no DNS record is not a server refusing
a script. Find the resource's current home or cut it.

Worth separating the three states before deciding: DNS failure (dead — cut or
relocate), HTTP 403/202/challenge (alive, refusing robots — keep and bracket),
and HTTP 200 with a challenge body (Khan Academy does this — also alive, also
keep and bracket, but a status-code-only check will call it healthy and tell you
nothing).

## Duplicate resource titles break the wiring script

`wire.py` resolves a citation by matching its link text against resource titles,
so two resources sharing a title make every citation to either one ambiguous.
This is not hypothetical — it happened three times in one session:

- Goodfellow, Bengio &amp; Courville's *Deep Learning* against LeCun, Bengio &amp;
  Hinton's *Nature* review, also called *Deep Learning*.
- Lilian Weng's post *What are Diffusion Models?* against Ari Seff's video of
  exactly the same name.
- Yang Song's blog post *Generative Modeling by Estimating Gradients of the Data
  Distribution* against the NCSN paper it summarises, same title.

The fix is to disambiguate in the **resource title**, not in an alias table:
*Deep Learning (Nature review)*, *What are Diffusion Models? (video explainer)*,
*…(blog)*. The title is the wiring key and it is also what the reader sees, so a
title that cannot be told apart from another one is a reader-facing problem too,
not only a script-facing one. Then fix any module citation that used the old
label — the script will name it.

Related: the script exits without writing on a duplicate, which is correct. Two
resources with one name is a page defect, and a wiring pass that silently picked
one of them would bury it.

## Scan tag spans for non-ASCII before wiring

Several `<span class="tag">` page counts came out of a long generation pass as
garbage tokens — `~perm 8 pp`, `~ylon 12 pp`, `~ањ 27 pp`, `~server 7 pp`,
`~ionis 44 pp`. They render, they validate, they pass every structural check, and
they are visibly wrong to a reader.

Nothing in the citation contract or the audit catches this, because the tag text
is free-form. One grep does:

```bash
grep -o '<span class="tag">[^<]*</span>' docs/<slug>/index.html | grep -P '[^\x00-\x7F]'
```

Run it on every page before wiring. Legitimate non-ASCII in a tag is rare enough
that a hit is nearly always corruption; the odd real one (`~5 h`, `≈`) is obvious
on sight. The same scan over `r-byline` catches mangled author names, which fail
the same way and are worse.

## Insert generated markup with the surrounding indentation, not without it

The script that adds module citations for the orphans `wire.py` reports appended
its `<li>` elements at the insertion offset without accounting for the whitespace
already sitting before the closing `</ul>`. The result was structurally perfect
and visibly ragged — new lines indented 22 spaces among lines indented 12.

Nothing checks this and the browser does not care, but the file is hand-edited
afterwards and the diff is read by a person. When a script writes into hand-
written HTML, normalise leading whitespace on the lines it produced:

```bash
python3 - <<'PY'
import re
s = open(path, encoding="utf-8").read()
s = re.sub(r'(?m)^ {13,}(<li><a class="cite")', r'            \1', s)
open(path, "w", encoding="utf-8").write(s)
PY
```

The general form of the lesson: a generator that emits into an existing file owns
the file's formatting conventions, not just its syntax.

## GitHub answers WebFetch and refuses curl

Every `github.com` URL returns 403 to `curl` from this environment, with or
without a browser user agent, and `api.github.com` is unreachable through the
proxy. That is two dead ends for what looks like a reachability problem — and it
is not one. `WebFetch` retrieves GitHub repository pages normally, returning the
README, the description and the owner, which is enough to confirm identity
properly rather than guessing.

So for a repository: confirm with `WebFetch`, link `github.com/<owner>/<repo>`,
and add the bracketed refusal note for the automated check. Do **not** reach for
`tag--unverified` — the identity is established, only the checker is blocked, and
the tag would tell the reader something false. Watch for redirects while you are
there: `comfyanonymous/ComfyUI` now resolves to `Comfy-Org/ComfyUI`, which the
fetch reveals and a status check never would.
