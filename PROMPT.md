# Prompts

A running log of what was actually asked for in this repo, oldest first. Append a
new entry at the bottom each time; don't rewrite what's above it.

This is a record, not a brief. The instructions for building a page live in
`CLAUDE.md`; how the site is wired lives in `ARCHITECTURE.md`; what went wrong
along the way lives in `LEARNINGS.md`. Nothing here should repeat any of them.

Entries marked **(reconstructed)** predate this log. They were recovered from
`memory/`, the commit messages and the diffs — the intent is accurate, the exact
wording is not. Entries without that marker are verbatim.

---

## 2026-08-02 — repo scaffolding

**(reconstructed — no prompt recorded)**

The initial commit landed `CLAUDE.md`, `README.md`, `templates/topic-template.html`,
`docs/index.html`, `docs/assets/style.css` and `docs/assets/site.js` in one go —
the whole format, with no topic pages yet. Authored directly rather than through
a session that left a trace, so there is no prompt to quote.

→ `6a31cde`

---

## 2026-08-03 — first topic page

> Add a syllabus on information theory.

Quoted verbatim in `memory/2026-08-03.md`. Read as Shannon information theory,
not information science and not quantum information.

→ `docs/information-theory/` (MA-01, 13 modules, 49 resources), the first
`.cat-group`, the `.cite` nowrap fix, plus `docs/.nojekyll` and `PROMPT.md`,
both of which the repo map promised and neither of which existed. `419bc86`

---

## 2026-08-03 — follow-up, on cutting a blocked resource

**(reconstructed)**

> You dropped *A Mind at Play* because the publisher's site 403s a checker. That
> isn't a reason to cut a real book — fix the rule, not the page.

Reconstructed from `memory/2026-08-03.md` and `3cf65ba`; the memory file records
the decision as "the wrong call" that "exposed a bad rule rather than a bad
judgement", which is the shape of the correction being pushed back on.

→ Established **Inaccessible ≠ unciteable** in `CLAUDE.md`: cut only when you
cannot confirm a thing exists; keep it and bracket the caveat when the server
merely refuses you. Redefined `tag--unverified` to mean *identity not
established*. Added R-09 and renumbered `r-09`…`r-49` → `r-10`…`r-50`. `3cf65ba`

---

## 2026-08-05 — crypto and blockchain

> add a new syllabus for crypto/blockchain  and its ecosystem(nft, defi, dao etc).

Asked one clarifying question, because the topic spans a protocol-engineering
course and an economics course and one page cannot hold both at the depth bar.
The answer chose **two cross-linked pages** over one combined page or a
tech-plus-economics blend.

→ `docs/blockchain-systems/` (CS-01) and `docs/defi-and-onchain-economics/`
(EF-01), 13 modules and 50 resources each; two new catalog groups; one shared
`code` rule in the stylesheet; `ARCHITECTURE.md` created.
`4b76a63` `e218b07` `b0160d6` `2f10655`

---

## 2026-08-05 — follow-up, on this file

> PROMPT.md should follow not have  the same repeated instructions as the project
> claude instructions. It should follow our usual prompt file guidelines. erase
> the current prompt file and retroactively fill it based on your best
> assumptions.

`PROMPT.md` had been written as a standalone restatement of the brief in
`CLAUDE.md` — duplicated instructions, and two copies to keep in sync.

→ Replaced with this log. Updated the four places that described `PROMPT.md` as
the standalone brief: `CLAUDE.md`'s repo map, `README.md`'s layout block and
"Adding a topic" section, and `ARCHITECTURE.md`'s repo map and conventions.

---

## 2026-08-06 — removing a topic

> remove the information theory topic.

The first removal in this repo, so the exit path had never been walked. Deleting
the folder and the catalog card is the visible half; the other half is the
inbound cross-link from `blockchain-systems`'s `next` section, which would have
become a 404 nothing on that page could reveal.

→ Deleted `docs/information-theory/`, dropped the MA-01 card and the now-empty
Mathematics &amp; statistics group, demoted the inbound `next` link to plain text,
and moved the `README.md` "Adding a topic" example off the removed slug. The
historical record — `PROMPT.md`, `LEARNINGS.md`, `memory/` — is left intact.

---

## 2026-08-06 — crypto coverage gaps, then removing the size ceilings

> between the two crypto related syllabus in the repo, what important topics
> might be missing? Only mention them, do not change anything in the repo yet.

Read both pages and keyword-swept them. Answered in chat only: ten subjects big
enough to be their own pages (applied cryptography, on-chain privacy, wallets and
custody, contract-security practice, derivatives, non-EVM execution, Bitcoin's
script and channel layer, mining as an industry, monetary economics and CBDCs, ZK
engineering) plus the gaps inside the existing thirteen modules each.

> suggest topics which can be added in the current 2 pages.

Same material re-cut as per-page additions: which need a module slot, which fit as
concept blocks inside a named existing module. Noted that both pages sat at 13
modules and exactly 50 resources — the stated ceilings — so any addition would
have to displace something.

> why is there is a contract band of 14 and 50? how were these arbitrary no
> selected? quality coverage should not be based on an arbitrary no but on the
> rightful coverage needed. there can be a floor but not a ceiling. update the
> instructions with the right language.

The ceilings had been failing quietly for three pages: every page written to the
depth bar overshot the word range, and both crypto pages stopped at exactly 50
resources.

→ Replaced the bands in `CLAUDE.md` with a "Size: floors, not ceilings" section —
floors kept (8 modules, ~2,500 words, 25 resources), maxima removed, bloat now
caught by four quality tests instead of a number. Resources become "at least 25,
no upper limit". Added guidance that growing an existing page is a normal update,
two anti-patterns about stopping short of a field's real extent, and a pre-flight
item on naming deliberate omissions. `LEARNINGS.md`'s open "page-length guidance
is loose" note is now marked resolved with the evidence.

---

## 2026-08-06 — information theory, rebuilt

> add a syllabus for information theory.

Then, during planning:

> Instead of next, give quantum information an additional module.

The slug had been deleted four commits earlier as a deliberate exercise in
walking the removal path, and the size ceilings had been removed two commits
after that — so this was a fresh build to the current brief rather than a revert
of `0f7e79b`. The quantum follow-up turned a `next` pointer into M20, placed
after the whole classical arc because the module only teaches by contrast.

→ Added `docs/information-theory/` (MA-01, 21 modules, 94 resources, ~16,800
words of syllabus body), re-created the Mathematics &amp; statistics catalog group,
and restored the inbound `next` link on `blockchain-systems` that the removal had
demoted to plain text.

---

## 2026-08-06 — remove the blockchain topics

> remove the two blockchain related topics.

→ Deleted `docs/blockchain-systems/` (CS-01) and `docs/defi-and-onchain-economics/`
(EF-01), their catalog cards, and the now-empty `Computer science` and
`Economics & finance` groups. The inbound `next` link from
`information-theory` was demoted to plain text. Catalog is MA-01 only.

---

## 2026-08-06 — crypto and blockchain, rebuilt as two pages

> add a new syllabus for crypto/blockchain  and its ecosystem(nft, defi, dao etc).

The same request as 2026-08-05, made again after the two pages it produced were
deleted earlier the same day. Four clarifications during planning: split into two
linked pages rather than one (as before); cover Bitcoin, Ethereum and a real
alternative-L1 module rather than being Ethereum-only; **rebuild from scratch
rather than restoring `ab866bc^`**; and keep the original slugs, codes and
catalog groups so the URLs stay permalinks.

The from-scratch decision is the substance of the session. The deleted pages
stopped at exactly 13 modules and 50 resources because the brief capped them
there, and that ceiling had since been removed — so restoring them would have
re-shipped pages shaped by a deleted rule.

→ Added `docs/blockchain-systems/` (CS-01, 22 modules, 111 resources, ~17,600
words) and `docs/defi-and-onchain-economics/` (EF-01, 22 modules, 76 resources,
~16,500 words), re-created the Computer science and Economics & finance catalog
groups, and re-linked the `information-theory` erasure-coding `next` entry that
the removal had demoted to plain text.

Follow-up in the same session:

> regarding the talks and videos sections, what do you mean by flagged not
> padded? are those videos not added? even if YouTube does not allow the access
> to you and if they are good, reputed resources, you should have added them.

Correct pushback. Nothing confirmed had been cut, but the group had been
under-researched and the thinness reported as curation — and the stated reason
(YouTube blocks automated checks) was false: YouTube returns 200 to curl with a
browser user agent, only WebFetch gets 429.

→ Talks &amp; video went 4 → 8 on CS-01 and 3 → 7 on EF-01, each new entry cited
from a module; resource counts moved to 115 and 80.
