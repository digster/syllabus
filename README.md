# Syllabus Library

Give it a topic, get a study plan: a sequenced syllabus with concepts, exercises
and checkpoints, plus a categorised reading list that every module links into.
Static HTML, no build step, hosted straight from `/docs`.

## Layout

```
CLAUDE.md                     instructions Claude reads before writing a page
PROMPT.md                     the same brief, standalone
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
and adds the card to `docs/index.html`. See `PROMPT.md` for modifiers and for the
standalone version of the prompt.

## Checking a page before you commit

```bash
python3 -m http.server -d docs 8000   # then open http://localhost:8000

# citations vs targets — the two lists should match
grep -o 'href="#r-[0-9]*"' docs/<slug>/index.html | sed 's/href="#//;s/"//' | sort -u
grep -o 'id="r-[0-9]*"'    docs/<slug>/index.html | sed 's/id="//;s/"//'    | sort -u

# modules vs rail entries — the two counts should match
grep -c 'class="module"' docs/<slug>/index.html
grep -c 'rail-item'      docs/<slug>/index.html
```

## Design notes

One stylesheet, one class contract, documented in `CLAUDE.md`. Pages don't carry
their own CSS — that's what keeps forty hand-written pages looking like one site.
The left rail is the module spine; the numbered resource cards at the bottom are
the other half of the same idea, and the `R-07` codes are what let a syllabus
point at a reading without dragging the reader off the page.

Set your repo URL in the header of `docs/index.html` (`USERNAME/REPO`).
