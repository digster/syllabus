# CLAUDE.md — Syllabus Library

## What this repo is

A static site of **study plans**. One topic per page. Each page is a deep,
sequenced syllabus followed by a categorised, vetted resource list that the
syllabus links into.

The reader is a capable self-learner with no teacher and no cohort. The page is
the teacher. It has to decide *what* to study, in *what order*, *why* that order,
and *how the reader knows they've got it* — because nobody else will.

## The trigger

**When I give you a topic name in this repo — anything from "add Kalman filters"
to just "graph neural networks" — that means: build the full topic page, add it
to the catalog, and report back.** No need to ask what I want.

Ask **one** clarifying question only when the topic is genuinely ambiguous about
*which field* it belongs to ("transformers" — power engineering or deep learning?)
or spans wildly different depths ("statistics" — an intro or a graduate sequence?).
Otherwise pick a sensible reading, state the interpretation in one line at the top
of your reply, and build.

## Repo map

```
CLAUDE.md                     ← you are here
ARCHITECTURE.md               ← how the site is wired; read it before your first edit
PROMPT.md                     ← the same brief, standalone, for use outside this repo
LEARNINGS.md                  ← accumulated gotchas; read before starting a page
README.md
templates/topic-template.html ← copy this to start a page (never published)
docs/                         ← the entire published site
  .nojekyll                   ← keep; stops GitHub Pages running Jekyll
  index.html                  ← the catalog; update it every time you add a topic
  assets/style.css            ← the only stylesheet; the class contract
  assets/site.js              ← rail scroll-spy + catalog filter
  <topic-slug>/index.html     ← one folder per topic
  <topic-slug>/assets/…       ← only if a page needs its own diagram/image
```

## Workflow

1. **Research before writing.** Budget 15–30 searches for an unfamiliar topic. You
   are looking for: how the field is actually taught (real university syllabi,
   course pages), what the canonical texts are, what the seminal papers are, what
   practitioners say beginners get wrong, and what has changed recently. Prefer
   primary sources over listicles. Never build a syllabus purely from memory —
   your picture of a live field is stale, and half the URLs you remember have moved.
2. **Design the arc before writing prose.** Decide the module sequence first and
   check it against the dependency test below. Sequence is the part that makes a
   syllabus worth reading; get it wrong and no amount of good writing saves it.
3. **Collect and verify resources.** Assemble the list, then check each link
   resolves and is the thing you think it is. Two different failures, two
   different answers: if you cannot confirm the thing *exists*, cut it — cut is
   usually right there. If you have confirmed it exists but the URL won't answer
   an automated check, **keep it** and say so in brackets. See *Inaccessible ≠
   unciteable* under Resource rules.
4. **Write the page** from `templates/topic-template.html`.
5. **Update `docs/index.html`** — a card inside the right `.cat-group`, between the
   `CATALOG:START` / `CATALOG:END` markers. Remove the `.empty-state` paragraph if
   it's still there.
6. **Verify** against the pre-flight checklist at the bottom of this file.
7. **Report** in chat: topic, slug, module count, resource count, anything you
   deliberately left out, any resource you kept but could not reach, and any
   resource you could not confirm at all. The last two are different — keep them
   separate.

## Sequencing: the dependency test

Order modules by what the *next* module needs, not by what a textbook's table of
contents happens to do. For each module, name the module that had to come before
it and why. If a module has no such dependency, it is either misplaced or optional
— say so and move it.

A syllabus that works usually moves through these gears, though not every topic
has all five:

1. **The problem** — what breaks without this field. History and motivation, kept short.
2. **Foundations** — the vocabulary and the two or three load-bearing ideas.
3. **Mechanism** — how the thing actually works, one layer below the usable API.
4. **Theory / limits** — why it works, when it fails, what's provably impossible.
5. **Practice and frontier** — how it's used in anger, plus open problems and live debates.

## The depth bar

"Not surface level" is the whole point of this repo. Concretely:

- **Name things.** Named algorithms, theorems, papers, systems, failure modes,
  people. A bullet that could belong to any topic is a dead bullet.
- **Go one layer below the interface.** If the reader could get this from a
  library's Getting Started page, it doesn't belong in a module body.
- **Include the "why is it like this" layer** — design tradeoffs, historical
  accidents, alternatives that lost and why.
- **Include what practitioners know and books don't** — the failure modes, the
  rules of thumb, the thing everyone gets wrong on their first project.
- **Include the unsettled parts.** Open problems, active disagreements, results
  that don't replicate, techniques that are fashionable but unproven.
- **Every module ends in something the reader can do**, and a checkpoint they can
  fail.

Calibration:

> ✗ "Learn the basics of neural network training. Understand backpropagation and
> gradient descent."

> ✓ "**Backpropagation as reverse-mode autodiff.** Derive the gradients for a
> two-layer MLP by hand, then check them numerically. Understand why reverse mode
> costs one backward pass for many-inputs-to-one-output while forward mode costs
> one pass *per input* — and why that ratio is the reason deep learning is
> tractable at all. Locate where vanishing gradients originate in a stack of
> sigmoids, and why ReLU changes the picture without fixing it."

> ✗ "Read about consensus algorithms."

> ✓ "**Why consensus is hard, precisely.** Work through the FLP impossibility
> result — no deterministic consensus in an asynchronous system with one crash
> fault — and then explain why Raft and Paxos ship anyway (they trade liveness for
> safety under partial synchrony, they don't beat FLP). Trace one Raft leader
> election through a partition on paper. Checkpoint: you can say what a system
> gives up when it claims 'strong consistency and high availability'."

Length is a symptom, not a target, but a page that clears the bar generally lands
around **8–14 modules** and **2,500–5,000 words** of syllabus body. If you're
under that, you're probably listing topics instead of teaching them.

## Page contract

Sections in this order, with these `id`s. Don't reorder, don't rename, don't skip:

| `id` | Section | Notes |
|---|---|---|
| — | Hero | eyebrow = category, `h1`, 2–3 sentence lede, meta row |
| `about` | What this topic is | **the short description**: 120–200 words, two paragraphs |
| `before-you-start` | Prerequisites, audience, explicit non-goals | link a resource for each gap |
| `paths` | At least two routes through the material | short route + full route |
| `outcomes` | Capability statements | "you can derive/build/debug…", never "you will learn about…" |
| `syllabus` | The modules | `<article class="module" id="mN">` each |
| `capstone` | One or two integrative projects | must need several modules at once |
| `mastery` | Self-assessment checklist | ~10 testable claims |
| `next` | Adjacent topics | link sibling pages in this library when they exist |
| `resources` | The categorised list | **always last** |

Every module carries, in this order: code + title + effort estimate, a one-line
`module-why`, `Concepts` (nested where a concept has real sub-structure),
`Work through` (the citation list), a `callout--practice`, a `callout--trap`, and
a `callout--check`.

## The citation contract

This is the mechanical rule the whole page hangs on.

- Resources live **only** in `#resources`, at the bottom. Nothing above it links
  out to the open web directly.
- Every resource gets a sequential id: `id="r-07"` and a visible code `R-07`.
  Numbering runs continuously across all groups, in page order.
- The syllabus references a resource **by anchor**:
  `<a class="cite" href="#r-07" data-code="R-07">Designing Data-Intensive Applications</a>`
  The `data-code` attribute is what renders the little R-07 next to the link — it
  must match the target's id.
- Every resource carries back-references to the modules that cite it:
  `<span class="r-used">Used in <a href="#m3">M03</a> <a href="#m7">M07</a></span>`
- **Both directions must be complete.** No citation pointing at a missing id, no
  resource that nothing cites. If a resource is genuinely worth listing but fits
  no module, cite it from `paths`, `next`, or the group's intro line — or drop it.

## Resource rules

- **25–50 entries** for a normal topic. Fewer means thin; more means unfiltered.
- **Groups, in the template's order:** Books · Courses & lecture series · Papers &
  primary sources · Talks & video · Articles, essays & blogs · Reference &
  documentation · Tools, datasets & playgrounds · Practice: problem sets & project
  ideas · Communities & staying current. Drop a group only if the topic truly has
  nothing for it. Never invent new groups without adding them to the template.
- **Every entry needs a note** — one or two sentences on what it's good for, what
  it assumes, and which parts to read. "A great introduction to X" is not a note.
  "Chapters 1–6 are the clearest treatment of the CAP tradeoff in print; skip the
  ETL chapter, it's dated" is a note.
- **Tags:** `tag--core` for the handful that carry the syllabus, `tag--free` /
  `tag--paid`, a level tag, plus length/format where useful (`~600 pp`, `12 h`,
  `45 min`). Mark paywalls honestly.
- **Verification.** Check every URL. Link the canonical home — the author's page,
  the publisher, the arXiv abstract page, the university course page — not a
  mirror, not a PDF-farm, not a link aggregator. If a book is legitimately free
  online (many classics are), link the author's or publisher's own copy and tag it
  `tag--free`; don't link pirated scans.
- **Inaccessible ≠ unciteable.** A resource that is genuinely excellent does not
  get cut because someone else's web server won't talk to a script. Publisher
  sites, societies and journals routinely answer 403, 202 or a Cloudflare
  challenge to anything that isn't a browser, and a site can simply be down the
  week you happen to look. If you have confirmed the resource is what you think
  it is, **keep it and link its canonical home anyway** — then state the problem
  in brackets at the end of the note:
  `(Publisher page returns 403 to automated link checks — it opens normally in a
  browser.)` or `(Site was down as of 2026-08-03.)` Confirm identity by another
  route rather than dropping the entry: a DOI record via Crossref, an ISBN via
  OpenLibrary, the author's own page, an arXiv listing.
- **`tag--unverified` is about identity, not reachability.** Use it when you
  could not establish that the resource is what you claim — uncertain author,
  year, edition, or a URL you are not sure points at the right thing. A confirmed
  work behind an unreachable link gets the bracketed note and **no** tag; adding
  the tag there tells the reader something false about the resource.
- **Don't pad.** Ten excellent resources beat forty with thirty seat-fillers. But
  do cover the range: something for the reader who learns by video, something for
  the one who wants the original paper.
- **Never invent** a title, author, year, ISBN or URL. If you're unsure a thing
  exists, search. If you still can't confirm it exists at all, cut it — this is
  the one case where cutting is right, and it is not the same as a link that
  merely refused your checker.
- **Date-sensitive fields:** note the year in the byline and flag anything where
  the state of the art has moved since publication.

## HTML rules

- Hand-written HTML, no build step, no framework, no bundler.
- **One stylesheet:** `docs/assets/style.css`. No `<style>` blocks in pages, no
  inline `style` attributes except the one already in the template's rail. If a
  page genuinely needs a new visual pattern, add the class to the shared
  stylesheet and note it in your report — don't fork the design.
- Relative links only (`../assets/style.css`, `../` for home). Nothing depends on
  the repo name, so it works on `user.github.io/repo/` and on a custom domain.
- Semantic elements: `main`, `section`, `article`, `nav`, `h1`→`h4` in order, `ol`
  for the resource lists.
- Must work with JavaScript off and read cleanly at 380 px wide.
- Escape `&` as `&amp;` in titles. Use `—` and `→` directly, not entities.
- Keep the `<meta name="syllabus:*">` counts accurate — they're the audit trail.

## Naming

- **Slug:** lowercase, hyphenated, no stop-words unless needed for sense:
  `information-theory`, `kalman-filters`, `rust-ownership`. Folder = slug,
  file = `index.html`, so the URL is `/<slug>/`.
- **Topic code** on the catalog card: two-letter category prefix + sequence within
  that category — `CS-03`, `MA-01`, `PH-02`. Categories currently in use are
  whatever `.cat-group` headings exist in `docs/index.html`; add a new group in
  alphabetical position if nothing fits.
- **Module ids** are `m1`…`mN` (no zero padding in the id, `M01` in the visible
  code). Resource ids are `r-01`…`r-NN` (zero-padded).

## Updating an existing topic

Edit in place — the URL is the permalink and should not move. Bump
`meta[name="syllabus:updated"]`, the footer date, and the card's date in
`docs/index.html`. When you remove a resource, renumber nothing: retire the id by
leaving the gap, or renumber the whole list and fix every citation. Never leave a
half-renumbered page. If I ask for a genuinely different treatment of the same
topic rather than an update, make a new slug (`statistics-graduate`) and link the
two from each other's `next` section.

## Pre-flight checklist

Run this before you tell me it's done.

- [ ] Every `href="#r-NN"` resolves to a resource that exists on the page.
- [ ] Every `data-code` matches its target's visible `R-NN`.
- [ ] Every resource has at least one back-reference in `r-used`, and those
      `#mN` links all exist.
- [ ] Every module has: why, concepts, work-through, practice, trap, checkpoint.
- [ ] The rail lists every module, in order, with matching ids.
- [ ] `meta` counts, the meta-row counts and the footer counts all agree with reality.
- [ ] Every external URL was actually fetched or searched — no remembered links.
- [ ] Any URL that refused an automated check is still on the page, with the
      refusal stated in brackets in its note — not quietly dropped.
- [ ] `docs/index.html` has the new card, in the right group, and the empty-state
      paragraph is gone.
- [ ] Page renders at 380 px and with JS disabled.
- [ ] No `<style>` block, no inline styles, no absolute internal links.

Quick greps:

```bash
# citations with no target
grep -o 'href="#r-[0-9]*"' docs/<slug>/index.html | sort -u
grep -o 'id="r-[0-9]*"'   docs/<slug>/index.html | sort -u
# module count vs rail count
grep -c 'class="module"' docs/<slug>/index.html
grep -c 'rail-item'      docs/<slug>/index.html
```

## Anti-patterns

Things that will make me ask for a rewrite:

- Modules named after chapters of one book, in that book's order.
- "Week 1 / Week 2" scheduling. Effort estimates, not calendars.
- Resource notes that are marketing copy.
- A resource list that's all books, or all YouTube.
- Concept bullets that are single nouns with no verb attached.
- Filler openers — "In today's fast-paced world", "X has revolutionised Y".
- Emoji, badge rows, "🚀 Let's dive in!", or any other README-voice.
- Inventing a URL because a plausible one should exist.
- Softening the depth because the topic is hard. If it's hard, say so and sequence it better.
