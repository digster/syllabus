# Syllabus Library

Give it a topic, get a study plan: a sequenced syllabus with concepts, exercises
and checkpoints, plus a categorised reading list that every module links into.
Static HTML, no build step, hosted straight from `/docs`.

## Layout

```
CLAUDE.md                     instructions Claude reads before writing a page
ARCHITECTURE.md               how the site is wired, and how to verify a page
PROMPT.md                     log of what was asked for, one entry per session
LEARNINGS.md                  gotchas found the hard way
templates/topic-template.html the page skeleton (not published)
docs/                         the published site
  .nojekyll
  index.html                  catalog
  assets/style.css            the class contract
  assets/site.js              rail scroll-spy, catalog filter
  <topic-slug>/index.html     one folder per topic
```

## Publishing

1. Push to GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch**, branch
   `main`, folder **`/docs`**.
3. The site appears at `https://<user>.github.io/<repo>/`.

`.nojekyll` stops Pages from running the content through Jekyll, so nothing gets
mangled and folders beginning with `_` would still be served. Keep it.

## Adding a topic

In a Claude session with this repo open:

```
Add a syllabus for: information theory
```

Claude reads `CLAUDE.md`, researches, writes `docs/information-theory/index.html`,
and adds the card to `docs/index.html`. Append what you asked to `PROMPT.md`, and
write the session up in `memory/YYYY-MM-DD.md`.

## Checking a page before you commit

```bash
python3 -m http.server -d docs 8000   # then open http://localhost:8000

# citations vs targets — the two lists should match
grep -o 'href="#r-[0-9]*"' docs/<slug>/index.html | sed 's/href="#//;s/"//' | sort -u
grep -o 'id="r-[0-9]*"'    docs/<slug>/index.html | sed 's/id="//;s/"//'    | sort -u

# modules vs rail entries — rail-item over-counts by 3, because the "Also"
# list adds capstone/mastery/resources. These two should match exactly.
grep -c 'class="module"'          docs/<slug>/index.html
grep -c 'class="rail-item"><a href="#m[0-9]' docs/<slug>/index.html
```

These greps are the quick pass. The full check — `data-code` agreement, complete
back-references, count sites, and rendering at 380 px with JavaScript disabled —
is in `ARCHITECTURE.md` under *Verifying a page*.

## Design notes

One stylesheet, one class contract, documented in `CLAUDE.md`. Pages don't carry
their own CSS — that's what keeps forty hand-written pages looking like one site.
The left rail is the module spine; the numbered resource cards at the bottom are
the other half of the same idea, and the `R-07` codes are what let a syllabus
point at a reading without dragging the reader off the page.

Set your repo URL in the header of `docs/index.html` (`USERNAME/REPO`).
