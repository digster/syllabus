# The brief, standalone

This is the same brief as `CLAUDE.md`, with the repo-specific plumbing stripped
out, so it can be pasted into any assistant that has no access to this
repository. `CLAUDE.md` remains the authority for anything about file layout,
the catalog, or the HTML class contract.

---

## What you're producing

A **study plan for one topic**: a deep, sequenced syllabus followed by a
categorised, vetted resource list that the syllabus links into.

The reader is a capable self-learner with no teacher and no cohort. The page is
the teacher. It has to decide *what* to study, in *what order*, *why* that order,
and *how the reader knows they've got it* — because nobody else will.

Given a topic name, build the whole thing. Ask **one** clarifying question only
when the topic is genuinely ambiguous about *which field* it belongs to
("transformers" — power engineering or deep learning?) or spans wildly different
depths ("statistics" — an intro or a graduate sequence?). Otherwise pick a
sensible reading, state the interpretation in one line at the top of the reply,
and build.

## Method

1. **Research before writing.** Budget 15–30 searches for an unfamiliar topic.
   Look for: how the field is actually taught (real university syllabi, course
   pages), what the canonical texts are, what the seminal papers are, what
   practitioners say beginners get wrong, and what has changed recently. Prefer
   primary sources over listicles. Never build a syllabus purely from memory —
   your picture of a live field is stale, and half the URLs you remember have
   moved.
2. **Design the arc before writing prose.** Decide the module sequence first and
   check it against the dependency test below. Sequence is the part that makes a
   syllabus worth reading; get it wrong and no amount of good writing saves it.
3. **Collect and verify resources.** Assemble the list, then check each link
   resolves and is the thing you think it is. Two different failures, two
   different answers: if you cannot confirm the thing *exists*, cut it — cut is
   usually right there. If you have confirmed it exists but the URL won't answer
   an automated check, **keep it** and say so in brackets. See *Inaccessible ≠
   unciteable* under Resource rules.
4. **Write the page.**
5. **Report:** topic, module count, resource count, anything deliberately left
   out, any resource you kept but could not reach, and any resource you could not
   confirm at all. The last two are different — keep them separate.

## Sequencing: the dependency test

Order modules by what the *next* module needs, not by what a textbook's table of
contents happens to do. For each module, name the module that had to come before
it and why. If a module has no such dependency, it is either misplaced or
optional — say so and move it.

A syllabus that works usually moves through these gears, though not every topic
has all five:

1. **The problem** — what breaks without this field. History and motivation, kept short.
2. **Foundations** — the vocabulary and the two or three load-bearing ideas.
3. **Mechanism** — how the thing actually works, one layer below the usable API.
4. **Theory / limits** — why it works, when it fails, what's provably impossible.
5. **Practice and frontier** — how it's used in anger, plus open problems and live debates.

## The depth bar

"Not surface level" is the whole point. Concretely:

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
around **8–14 modules**.

## Page structure

Sections in this order. Don't reorder, don't rename, don't skip:

| Section | Notes |
|---|---|
| Hero | category eyebrow, title, 2–3 sentence lede, meta row |
| What this topic is | **the short description**: 120–200 words, two paragraphs |
| Before you start | prerequisites, audience, explicit non-goals; link a resource for each gap |
| How to use this | at least two routes through the material — a short route and the full route |
| What you'll be able to do | capability statements: "you can derive/build/debug…", never "you will learn about…" |
| Syllabus | the modules |
| Capstone | one or two integrative projects; must need several modules at once |
| Mastery check | ~10 testable claims |
| Where to go next | adjacent topics, with a line on why you'd go there |
| Resources | the categorised list — **always last** |

Every module carries, in this order: code + title + effort estimate, a one-line
"why this module exists", `Concepts` (nested where a concept has real
sub-structure), `Work through` (the citation list), a practice callout, a
"where people go wrong" callout, and a checkpoint callout.

## The citation contract

This is the mechanical rule the whole page hangs on.

- Resources live **only** in the resources section, at the bottom. Nothing above
  it links out to the open web directly.
- Every resource gets a sequential code, `R-01`…`R-NN`, numbered continuously
  across all groups, in page order.
- The syllabus references a resource **by anchor**, carrying the code so it
  renders next to the link.
- Every resource carries back-references to the modules that cite it.
- **Both directions must be complete.** No citation pointing at a missing id, no
  resource that nothing cites. If a resource is genuinely worth listing but fits
  no module, cite it from the routes section, the "where to go next" section, or
  the group's intro line — or drop it.

## Resource rules

- **25–50 entries** for a normal topic. Fewer means thin; more means unfiltered.
- **Groups, in this order:** Books · Courses & lecture series · Papers & primary
  sources · Talks & video · Articles, essays & blogs · Reference & documentation
  · Tools, datasets & playgrounds · Practice: problem sets & project ideas ·
  Communities & staying current. Drop a group only if the topic truly has nothing
  for it.
- **Every entry needs a note** — one or two sentences on what it's good for, what
  it assumes, and which parts to read. "A great introduction to X" is not a note.
  "Chapters 1–6 are the clearest treatment of the CAP tradeoff in print; skip the
  ETL chapter, it's dated" is a note.
- **Tags:** mark the handful that carry the syllabus as core, mark free vs paid, a
  level tag, plus length/format where useful (`~600 pp`, `12 h`, `45 min`). Mark
  paywalls honestly.
- **Verification.** Check every URL. Link the canonical home — the author's page,
  the publisher, the arXiv abstract page, the university course page — not a
  mirror, not a PDF-farm, not a link aggregator. If a book is legitimately free
  online (many classics are), link the author's or publisher's own copy and tag it
  free; don't link pirated scans.
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
- **The unverified mark is about identity, not reachability.** Use it when you
  could not establish that the resource is what you claim — uncertain author,
  year, edition, or a URL you are not sure points at the right thing. A confirmed
  work behind an unreachable link gets the bracketed note and **no** mark; adding
  it there tells the reader something false about the resource.
- **Don't pad.** Ten excellent resources beat forty with thirty seat-fillers. But
  do cover the range: something for the reader who learns by video, something for
  the one who wants the original paper.
- **Never invent** a title, author, year, ISBN or URL. If you're unsure a thing
  exists, search. If you still can't confirm it exists at all, cut it — this is
  the one case where cutting is right, and it is not the same as a link that
  merely refused your checker.
- **Date-sensitive fields:** note the year in the byline and flag anything where
  the state of the art has moved since publication.

## Anti-patterns

Things that will get a rewrite request:

- Modules named after chapters of one book, in that book's order.
- "Week 1 / Week 2" scheduling. Effort estimates, not calendars.
- Resource notes that are marketing copy.
- A resource list that's all books, or all YouTube.
- Concept bullets that are single nouns with no verb attached.
- Filler openers — "In today's fast-paced world", "X has revolutionised Y".
- Emoji, badge rows, "🚀 Let's dive in!", or any other README-voice.
- Inventing a URL because a plausible one should exist.
- Softening the depth because the topic is hard. If it's hard, say so and sequence it better.
