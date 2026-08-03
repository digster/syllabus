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

## Verifying resource URLs when publishers block you

A plain status check is not enough. From this environment these consistently
return bot-challenge codes rather than real 404s:

| Host | Behaviour | Workaround |
|---|---|---|
| Wiley, Cambridge, APS, MIT Press, Simon & Schuster | 403 | Crossref: `https://api.crossref.org/works/<DOI>` returns title, year, publisher |
| IEEE Xplore | 202 | same — Crossref by DOI |
| GitHub (curl) | 403 | WebFetch works; the REST API does not |
| YouTube | 429 / captcha redirect | neither curl nor WebFetch; rely on search results |
| itsoc.org, encode.su | 403 (Cloudflare) | search results only |

Crossref confirms *the work is what you think it is* — title, year, container —
which is the part that actually matters. Link the DOI (`https://doi.org/…`) as
the canonical home in these cases rather than a scraped mirror.

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
