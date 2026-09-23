# Orville AI — marketing site

Live at **https://iwaheedo.github.io/orville-ai/** (GitHub Pages, deploys automatically ~1 min after every push to `main`).

## ✏️ Editing the site (no code)

All the words on the landing page live in one file: **`content.json`**. Edit it either way:

### Option A — Pages CMS (friendly forms, recommended)

1. Go to **https://app.pagescms.org** and sign in with your GitHub account.
2. Open the `iwaheedo/orville-ai` repo (first time: click through the GitHub App install and grant it this repo).
3. Open **Website copy** — every section of the page appears as a labelled form (Hero, Why now, Team, …).
4. Edit and hit **Save**. That commits to `main` and the live site updates in about a minute.

> Hocine needs to be added as a repo collaborator first: GitHub → repo → Settings → Collaborators → add his GitHub username. Then he can log into Pages CMS the same way.

### Option B — straight on GitHub

Open [`content.json` on GitHub](https://github.com/iwaheedo/orville-ai/blob/main/content.json), click the pencil icon, edit, **Commit changes**. Same result.

### What's editable

Headlines, subtitles, stats, all section copy, founder bios, button labels, the contact email, and the footer. The number of cards/stats per section is fixed (the layout expects 4 stats, 6 cascade cards, 3 solution cards, 4 steps, 2 founders) — to change the *structure*, edit `index.html`.

Content is injected as plain text only (`cms.js`), so nothing typed into `content.json` can break the page or inject scripts — worst case a field just shows odd text.

## Files

| File | What it is |
|---|---|
| `index.html` | Landing page (design + fallback copy) |
| `content.json` | **All editable copy** — the file you edit |
| `cms.js` | Loads `content.json` into the page (text-only) |
| `.pages.yml` | Pages CMS form definition |
| `demo/` | Clickable product prototype (login → dashboard → setup) |
| `og.png` / `og-source.html` | LinkedIn/social preview card (1200×630) and its source |

## Regenerating the social preview image

After changing the headline, re-render `og.png`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --screenshot=og.png --window-size=1200,630 --hide-scrollbars "file://$PWD/og-source.html"
```

(Edit `og-source.html` first if the headline changed.) LinkedIn caches previews — paste the URL into https://www.linkedin.com/post-inspector/ to refresh it.
