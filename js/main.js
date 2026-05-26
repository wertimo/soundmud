/* ============================================================
   SOUNDMUD — main.js
   ============================================================ */

/* ── Nav: scroll shadow ──────────────────────────────────── */
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 16);
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Nav: mobile toggle ──────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Smooth scroll for hash links ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    const offset = nav ? nav.offsetHeight : 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Scroll reveal ───────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* ── Counter animation ───────────────────────────────────── */
function animateCounter(el, from, to, duration) {
  const startTime = performance.now();
  const update = now => {
    const p = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(from + (to - from) * eased);
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* Live stats — update these numbers as the show grows */
const STATS = {
  treesPlanted:     0,
  episodesRecorded: 0,
  kgCO2:            0,
};

(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const key    = e.target.dataset.counter;
        const target = STATS[key] ?? 0;
        animateCounter(e.target, 0, target, 1600);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
})();

/* ── Newsletter form ─────────────────────────────────────── */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const emailEl = form.querySelector('input[type=email]');
    const btn     = form.querySelector('button[type=submit]');
    const note    = form.querySelector('.newsletter-form__note');
    if (!emailEl.value) return;

    // ── Replace this block with your newsletter provider integration ──
    // e.g. Buttondown: POST to https://buttondown.email/api/emails/
    // e.g. Mailchimp: use their embed form action URL
    btn.textContent  = 'Subscribed!';
    btn.disabled     = true;
    emailEl.value    = '';
    if (note) note.textContent = 'You\'re in. We\'ll be in touch when Episode 1 drops.';

    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.disabled    = false;
    }, 4000);
  });
})();

/* ── Carbon Calculator ───────────────────────────────────── */
(function initCalculator() {
  const elEpisodes = document.getElementById('calcEpisodes');
  const elDuration = document.getElementById('calcDuration');
  const elDevice   = document.getElementById('calcDevice');
  if (!elEpisodes || !elDuration || !elDevice) return;

  /*
   * CO₂ estimates (grams per minute of streaming audio)
   * Sources: The Shift Project (2019), Carbon Trust (2021),
   *          IEA Electricity data, ONS UK grid intensity.
   * These are conservative mid-range estimates.
   */
  const CO2_G_PER_MIN = {
    mobilewifi: 0.013,  // Phone on WiFi
    mobile4g:   0.036,  // Phone on 4G/5G
    desktop:    0.020,  // Laptop / desktop
    smart:      0.009,  // Smart speaker (low power, often WiFi)
  };

  /* UK grid carbon intensity (gCO2/kWh) — approx 2024 average */
  const UK_GRID_INTENSITY = 233;

  /* 1 tree absorbs ~21 kg CO₂ per year (Forestry Commission UK figure) */
  const KG_CO2_PER_TREE = 21;

  /* UK average car: ~0.17 kg CO₂ per km (petrol) */
  const KG_CO2_PER_KM = 0.17;

  function update() {
    const episodes = parseInt(elEpisodes.value, 10) || 1;
    const duration = parseInt(elDuration.value, 10) || 45;
    const device   = elDevice.value;

    const co2PerMin    = CO2_G_PER_MIN[device] ?? 0.02;
    const minsPerWeek  = episodes * duration;
    const co2WeekG     = minsPerWeek * co2PerMin;
    const co2YearKg    = (co2WeekG * 52) / 1000;
    const treesNeeded  = co2YearKg / KG_CO2_PER_TREE;
    const kmEquiv      = co2YearKg / KG_CO2_PER_KM;

    /* Update slider labels */
    const episodesLabel = document.getElementById('calcEpisodesVal');
    const durationLabel = document.getElementById('calcDurationVal');
    if (episodesLabel) episodesLabel.textContent = `${episodes} ep/wk`;
    if (durationLabel) durationLabel.textContent = `${duration} min`;

    /* Update result cards */
    function set(id, value) {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    }

    const co2Display    = co2YearKg < 0.1 ? (co2YearKg * 1000).toFixed(1) + ' g' : co2YearKg.toFixed(3) + ' kg';
    const treesDisplay  = treesNeeded < 0.001 ? '<0.001' : treesNeeded.toFixed(4);
    const kmDisplay     = kmEquiv < 1 ? (kmEquiv * 1000).toFixed(0) + ' m' : kmEquiv.toFixed(1) + ' km';

    set('resultCO2',      co2Display);
    set('resultCO2Sub',   `Per year of podcast streaming (${episodes} ep × ${duration} min/wk)`);
    set('resultTrees',    treesDisplay);
    set('resultTreesSub', 'trees to absorb your annual listening CO₂');
    set('resultKm',       kmDisplay);
    set('resultKmSub',    'equivalent petrol car journey (UK avg)');
  }

  [elEpisodes, elDuration, elDevice].forEach(el => el.addEventListener('input', update));
  update();
})();
