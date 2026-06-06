/* ============================================================
   SOUNDMUD — Outdoor park conversation animation (daytime)
   Two founders in dialogue — 160×90 canvas @ 12 fps
   ============================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('pixelCanvas');
  if (!canvas) return;

  const W = 160, H = 90;
  canvas.width  = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  /* ── Palette ─────────────────────────────────────────── */
  const C = {
    /* daytime sky */
    sky0: '#1a5f96', sky1: '#2878b8', sky2: '#4a9fd4',
    sky3: '#6db8e0', hor:  '#9ed0ec',
    /* sun */
    sun: '#ffd166', sunH: '#fff5c0',
    /* clouds */
    cld: '#e8f4f8', cldS: '#c8dce6',
    /* grass */
    gr0: '#0f2015', gr1: '#1a3d2b', gr2: '#2d6a4f',
    gr3: '#40916c', gr4: '#52b788', gr5: '#74c69d',
    /* trees */
    tr0: '#050d07', tr1: '#091810', tr2: '#112618',
    tr3: '#1e4a2e', tr4: '#2d6a4f',
    /* red plaid blanket */
    bln: '#5c1010', blnM: '#8a2020', blnH: '#b03030', blnX: '#3a0808',
    /* skin */
    sk: '#ede8df', skM: '#d4c9be', skS: '#b8a898',
    /* hair / beard */
    hr: '#190d05', hrH: '#3a1e0a', bd: '#27120a',
    /* shirts */
    sh: '#dedad0', shM: '#b8b4ac',
    /* glasses (SoundMud green) */
    gl: '#52b788', glD: '#2d6a4f',
    /* speech bubbles */
    bub: '#f5f0e8', bubB: '#2d6a4f', bubD: '#1a3d2b',
    dark: '#030806',
  };

  /* ── Fill helper ─────────────────────────────────────── */
  function r(x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(x | 0, y | 0, w, h);
  }

  /* ── Speech bubble helper ────────────────────────────── */
  function bubble(x, y, w, h, tailX) {
    // rounded fill (skip 4 corner pixels)
    r(x + 1, y,     w - 2, h,     C.bub);
    r(x,     y + 1, w,     h - 2, C.bub);
    // border outline
    r(x + 1,     y,         w - 2, 1, C.bubB);
    r(x + 1,     y + h - 1, w - 2, 1, C.bubB);
    r(x,         y + 1,     1, h - 2, C.bubB);
    r(x + w - 1, y + 1,     1, h - 2, C.bubB);
    // tail pointing downward
    r(tailX,     y + h,     2, 1, C.bubB);
    r(tailX + 1, y + h + 1, 1, 1, C.bubB);
  }

  /* ── State ───────────────────────────────────────────── */
  let t = 0, lastTs = 0;
  const TICK = 1000 / 12;

  /* ── DRAW ────────────────────────────────────────────── */
  function draw() {

    /* 1 ── Daytime sky */
    r(0,  0, W, 12, C.sky0);
    r(0, 12, W, 12, C.sky1);
    r(0, 24, W, 12, C.sky2);
    r(0, 36, W, 10, C.sky3);
    r(0, 46, W,  7, C.hor);

    /* 2 ── Sun (upper right, clear of trees) */
    r(138,  8, 10, 10, C.sun);
    r(139,  7,  8, 12, C.sun);
    r(137,  9, 12,  8, C.sun);
    r(140,  9,  6,  6, C.sunH);
    ctx.fillStyle = 'rgba(255,209,102,0.10)';
    ctx.fillRect(130, 3, 22, 20);

    /* 3 ── Background clouds */
    r(22, 16, 22, 5, C.cld); r(24, 14, 18, 3, C.cld); r(26, 13, 12, 3, C.cld);
    r(22, 20, 22, 1, C.cldS);
    r(110, 12, 18, 5, C.cld); r(112, 10, 14, 4, C.cld); r(115, 9, 8, 3, C.cld);
    r(110, 16, 18, 1, C.cldS);

    /* 4 ── Left tree cluster */
    r(0,  16, 30, 37, C.tr2);
    r(2,  12, 24,  8, C.tr3);
    r(7,   8, 16,  7, C.tr4);
    r(5,  52,  5,  9, C.tr0);
    r(18, 52,  5,  9, C.tr0);

    /* 5 ── Right tree cluster */
    r(130, 16, 30, 37, C.tr2);
    r(134, 12, 24,  8, C.tr3);
    r(137,  8, 16,  7, C.tr4);
    r(137, 52,  5,  9, C.tr0);
    r(150, 52,  5,  9, C.tr0);

    /* 6 ── Mid background trees */
    r(38, 28, 20, 24, C.tr2); r(40, 24, 16, 6, C.tr3);
    r(102, 28, 20, 24, C.tr2); r(104, 24, 16, 6, C.tr3);

    /* 7 ── Ground */
    r(0, 53, W,  2, C.gr0);
    r(0, 55, W, 35, C.gr1);
    r(0, 55, W,  3, C.gr2);
    r(0, 58, W,  2, C.gr3);

    /* 8 ── Blanket */
    r(36, 62, 86, 12, C.blnM);
    for (let bx = 36; bx < 122; bx += 9) r(bx, 62, 3, 12, C.bln);
    for (let by = 62; by < 74; by += 4)  r(36, by, 86, 1, C.blnH);
    r(36, 62, 86, 1, C.blnH);
    r(36, 74, 86, 1, C.blnX);
    r(76, 67,  2,  6, C.blnH);

    /* 9 ── Speech bubbles (both speaking, dots offset so they feel like dialogue) */
    const dotM = Math.floor(t / 6) % 4;
    const dotF = Math.floor((t + 20) / 6) % 4;

    // Male bubble (left side, tail toward his head)
    bubble(30, 22, 28, 14, 52);
    r(37, 28, 2, 2, dotM > 0 ? C.bubD : C.bub);
    r(43, 28, 2, 2, dotM > 1 ? C.bubD : C.bub);
    r(49, 28, 2, 2, dotM > 2 ? C.bubD : C.bub);

    // Female bubble (right side, tail toward her head)
    bubble(102, 22, 28, 14, 110);
    r(109, 28, 2, 2, dotF > 0 ? C.bubD : C.bub);
    r(115, 28, 2, 2, dotF > 1 ? C.bubD : C.bub);
    r(121, 28, 2, 2, dotF > 2 ? C.bubD : C.bub);

    /* ── CHARACTER 1: MALE (talking, left, cx ≈ 61) ─────── */
    const tArm1  = Math.floor(t / 5) % 2;
    const blink1 = (t % 80) < 3;

    // Legs (cross-legged)
    r(52, 63, 18,  6, '#1e3d50');
    r(52, 68,  7,  4, C.skS);
    r(62, 67,  7,  3, C.skS);

    // Torso
    r(54, 53, 13, 10, C.sh);
    r(55, 54, 11,  8, C.shM);
    r(54, 53, 13,  1, C.sk);
    r(60, 53,  2,  2, C.sk);

    // Left arm (resting on knee)
    r(51, 57, 4, 6, C.sk);
    r(51, 62, 4, 2, C.skS);

    // Right arm (gesture, animated)
    if (tArm1 === 0) {
      r(67, 53, 3, 7, C.sk);
      r(69, 46, 3, 8, C.sk);
      r(70, 44, 3, 4, C.skS);
    } else {
      r(67, 54, 3, 6, C.sk);
      r(68, 48, 3, 7, C.sk);
      r(70, 46, 4, 3, C.skS);
    }

    // Head
    r(57, 45, 9, 8, C.sk);
    r(58, 46, 7, 6, C.skM);

    // Hair
    r(57, 45, 9, 2, C.hr);
    r(57, 45, 2, 5, C.hr);
    r(64, 45, 2, 5, C.hr);

    // Beard
    r(58, 51, 7, 2, C.bd);
    r(58, 49, 2, 3, C.bd);

    // Eyes
    if (!blink1) {
      r(60, 48, 1, 1, C.dark);
      r(63, 48, 1, 1, C.dark);
    } else {
      r(59, 49, 3, 1, C.dark);
      r(62, 49, 3, 1, C.dark);
    }

    // Glasses (green square frames)
    r(59, 47, 3, 1, C.gl); r(59, 49, 3, 1, C.gl);
    r(59, 47, 1, 3, C.gl); r(61, 47, 1, 3, C.gl);
    r(62, 47, 3, 1, C.gl); r(62, 49, 3, 1, C.gl);
    r(62, 47, 1, 3, C.gl); r(64, 47, 1, 3, C.gl);
    r(61, 48, 1, 1, C.gl);

    // Mouth (open — talking)
    r(60, 51, 4, 1, C.dark);
    r(61, 51, 2, 1, C.skS);

    /* ── CHARACTER 2: FEMALE (speaking back, right, cx ≈ 95) */
    const tArm2  = Math.floor((t + 12) / 5) % 2;  // offset from male
    const blink2 = (t % 100) < 3;

    // Legs
    r(87, 63, 18,  6, '#2e2055');
    r(87, 68,  7,  4, C.skS);
    r(98, 67,  7,  3, C.skS);

    // Torso
    r(88, 53, 13, 10, C.sh);
    r(89, 54, 11,  8, C.shM);
    r(88, 53, 13,  1, C.sk);
    r(94, 53,  2,  2, C.sk);

    // Left arm (raised toward male — responding gesture, animated)
    if (tArm2 === 0) {
      r(86, 54, 3, 7, C.sk);
      r(83, 47, 3, 8, C.sk);
      r(82, 45, 3, 4, C.skS);
    } else {
      r(86, 55, 3, 6, C.sk);
      r(84, 49, 3, 7, C.sk);
      r(83, 47, 4, 3, C.skS);
    }

    // Right arm (resting)
    r(101, 59, 4, 5, C.sk);
    r(101, 63, 4, 2, C.skS);

    // Head
    r(89, 45, 9, 8, C.sk);
    r(90, 46, 7, 6, C.skM);

    // Dark hair (longer)
    r(89, 45, 9, 2, C.hr);
    r(89, 45, 2, 9, C.hr);
    r(96, 45, 2, 8, C.hr);
    r(89, 53, 3, 4, C.hr);
    r(90, 46, 2, 1, C.hrH);

    // Eyes
    if (!blink2) {
      r(92, 48, 1, 1, C.dark);
      r(95, 48, 1, 1, C.dark);
    } else {
      r(91, 49, 3, 1, C.dark);
      r(94, 49, 3, 1, C.dark);
    }

    // Mouth (open — speaking back)
    r(91, 51, 4, 1, C.dark);
    r(92, 51, 2, 1, C.skS);

    /* 10 ── Foreground grass */
    r(0, 75, W, 15, C.gr1);
    r(0, 75, W,  2, C.gr2);

    const tufts = [
      [5, 74, 0.0], [20, 75, 1.4], [42, 74, 0.7],
      [120, 74, 2.0], [142, 75, 0.5], [157, 74, 1.8],
    ];
    tufts.forEach(([tx, ty, ph]) => {
      const sw = Math.sin(t * 0.20 + ph) > 0 ? 1 : 0;
      r(tx + sw,     ty - 3, 2, 5, C.gr4);
      r(tx + 1 + sw, ty - 4, 1, 3, C.gr5);
    });

    /* 11 ── Scanlines (very light — daytime) */
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    for (let sy = 0; sy < H; sy += 2) ctx.fillRect(0, sy, W, 1);
  }

  /* ── LOOP ────────────────────────────────────────────── */
  function loop(ts) {
    requestAnimationFrame(loop);
    if (ts - lastTs < TICK) return;
    lastTs = ts;
    t++;
    draw();
  }

  requestAnimationFrame(loop);
}());
