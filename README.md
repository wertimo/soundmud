# SoundMud Podcast Website

Static website for the SoundMud podcast — built for GitHub Pages. No build step required.

## Files

```
index.html          — Main page (hero, about, episodes, listen, newsletter)
sustainability.html — Sustainability commitments + interactive carbon calculator
css/style.css       — All styles (both pages)
js/main.js          — Nav, scroll reveal, counters, newsletter form, calculator
```

---

## GitHub Pages Setup

### Step 1 — Create a GitHub account
Go to [github.com](https://github.com) and sign up (free).

### Step 2 — Create a new repository

**Option A — Personal site** (site lives at `https://YOUR-USERNAME.github.io`)
- Create a repository named exactly: `YOUR-USERNAME.github.io`

**Option B — Project site** (site lives at `https://YOUR-USERNAME.github.io/soundmud`)
- Create a repository named: `soundmud` (or any name you like)

### Step 3 — Upload the files

In your new repository, click **Add file → Upload files**, then drag and drop:
- `index.html`
- `sustainability.html`
- The entire `css/` folder
- The entire `js/` folder

Click **Commit changes**.

### Step 4 — Enable GitHub Pages

1. Go to your repository **Settings** tab
2. Scroll to **Pages** in the left sidebar
3. Under **Source**, select: Branch `main`, Folder `/ (root)`
4. Click **Save**

Your site will be live within ~60 seconds at the URL shown.

### Step 5 — Add a custom domain (when you're ready)

Once you have a domain name:
1. Settings → Pages → Custom domain → enter your domain
2. Update your domain registrar's DNS with GitHub's records (instructions shown in Pages settings)
3. GitHub handles the SSL certificate automatically

---

## Keeping the site updated

### Adding a new episode

In `index.html`, find the `episodes__grid` div and add a card:

```html
<article class="episode-card reveal">
  <div class="episode-card__number">EP. 01</div>
  <div class="episode-card__body">
    <span class="episode-card__badge">45 min · 12 Jun 2025</span>
    <h3 class="episode-card__title">Your Episode Title</h3>
    <p class="episode-card__desc">
      A short, compelling description of what this episode covers.
    </p>
  </div>
  <div class="episode-card__meta">
    <span>45 min</span>
    <a href="YOUR_EPISODE_URL" class="btn btn--green btn--sm"
       target="_blank" rel="noopener">Listen</a>
  </div>
</article>
```

Remove the "Coming Soon" card (`episode-card--coming`) once Episode 1 is live.

### Updating the live stats (trees, episodes, CO2)

In `js/main.js`, update the `STATS` object near the top:

```js
const STATS = {
  treesPlanted:     5,    // real number
  episodesRecorded: 12,   // real number
  kgCO2:            2,    // real number
};
```

### Connecting podcast platforms

In `index.html`, replace the `href="#"` on each platform link with your real URL:

```html
<a href="https://open.spotify.com/show/YOUR_ID" class="platform platform--spotify" ...>
<a href="https://podcasts.apple.com/podcast/id..." class="platform platform--apple" ...>
<a href="https://youtube.com/@soundmud" class="platform platform--youtube" ...>
<a href="/feed.xml" class="platform" ...>   <!-- RSS — add later -->
```

### Connecting a newsletter provider

In `js/main.js`, find the comment `// Replace this block with your newsletter provider integration`
and swap in your provider's API call. Recommended options:

- **Buttondown** — simple, UK-friendly, free up to 100 subscribers
- **ConvertKit** — creator-focused, good free tier
- **Mailchimp** — feature-rich, use their embed form action URL

### Updating social links

Search `index.html` and `sustainability.html` for `href="#"` inside `.footer__social`
and replace with your real profile URLs.

---

## Brand notes

- **Primary green:** `#2d6a4f`
- **Dark green:** `#1a3d2b`
- **Accent green:** `#74c69d`
- **Background cream:** `#faf8f3`
- **Fonts:** Fraunces (headings) + Inter (body) — loaded from Google Fonts

---

*Think further. Build better.*
