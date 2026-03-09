/* =========================================================
   🎮 DEV MINI-GAMES v2 — Portfolio Interactive Games
   Bug Hunter v2 | Dev Memory v2 | Code Rain v2
   ========================================================= */
(function () {
  'use strict';

  /* ── LOCAL STORAGE HIGH SCORES ─────────────────────────── */
  const LS = 'ys_devgames';
  function getBest() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } }
  function saveBest(key, val) {
    const b = getBest();
    if (!b[key] || val > b[key]) { b[key] = val; localStorage.setItem(LS, JSON.stringify(b)); }
    return Math.max(val, b[key] || 0);
  }

  /* ── BUBBLE ─────────────────────────────────────────────── */
  const bubble = document.createElement('div');
  bubble.id = 'game-bubble';
  bubble.innerHTML = `
    <div class="gb-ring"></div>
    <div class="gb-inner">
      <i class="mdi mdi-gamepad-variant gb-icon"></i>
      <span class="gb-label">Play Games</span>
    </div>
    <div class="gb-badge" id="gb-badge">3</div>`;
  document.body.appendChild(bubble);

  /* ── MODAL ──────────────────────────────────────────────── */
  const modal = document.createElement('div');
  modal.id = 'game-modal';
  modal.innerHTML = `
    <div class="gm-box">
      <div class="gm-header">
        <div class="gm-header-left">
          <i class="mdi mdi-gamepad-variant gm-hdr-icon"></i>
          <div>
            <p class="gm-hdr-title">Dev Mini-Games</p>
            <p class="gm-hdr-sub">Take a break &amp; play! 🎯</p>
          </div>
        </div>
        <button class="gm-close" id="game-close" title="Close (Esc)">&#x2715;</button>
      </div>
      <div class="gm-tabs">
        <button class="gm-tab active" data-game="bug">
          <span>🐛</span><span>Bug Hunter</span>
        </button>
        <button class="gm-tab" data-game="memory">
          <span>🧠</span><span>Dev Memory</span>
        </button>
        <button class="gm-tab" data-game="rain">
          <span>⌨️</span><span>Code Rain</span>
        </button>
      </div>
      <div id="game-arena"></div>
    </div>`;
  document.body.appendChild(modal);

  /* ── WIRING ─────────────────────────────────────────────── */
  let currentGame = null;

  bubble.addEventListener('click', () => {
    modal.classList.add('active');
    document.getElementById('gb-badge').style.display = 'none';
    if (!currentGame) loadGame('bug');
  });
  document.getElementById('game-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  modal.querySelectorAll('.gm-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.gm-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadGame(btn.dataset.game);
    });
  });

  function closeModal() { modal.classList.remove('active'); stopCurrent(); }

  function loadGame(name) {
    stopCurrent();
    currentGame = name;
    const arena = document.getElementById('game-arena');
    arena.innerHTML = '';
    if (name === 'bug') bugHunter(arena);
    else if (name === 'memory') devMemory(arena);
    else if (name === 'rain') codeRain(arena);
  }

  function stopCurrent() {
    currentGame = null;
    if (window._gc) { window._gc(); window._gc = null; }
    const a = document.getElementById('game-arena');
    if (a) a.innerHTML = '';
  }

  /* ── SHARED UTILS ───────────────────────────────────────── */
  function floatText(txt, x, y, good) {
    const el = document.createElement('div');
    el.className = 'gm-float ' + (good ? 'gm-float-good' : 'gm-float-bad');
    el.textContent = txt;
    el.style.cssText = 'left:' + x + 'px;top:' + y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  function confetti(wrap, n) {
    if (!wrap) return;
    n = n || 30;
    const cols = ['#2fb4ae', '#FF7F51', '#ffd700', '#ff4757', '#7bed9f', '#70a1ff', '#eccc68'];
    for (let i = 0; i < n; i++) {
      const p = document.createElement('div');
      p.className = 'gm-confetti';
      p.style.cssText = 'left:' + (Math.random() * 100) + '%;background:' + cols[i % cols.length] +
        ';width:' + (4 + Math.random() * 6) + 'px;height:' + (7 + Math.random() * 8) + 'px' +
        ';border-radius:' + (Math.random() > .5 ? '50%' : '2px') +
        ';animation-delay:' + (Math.random() * .5) + 's' +
        ';animation-duration:' + (0.9 + Math.random() * 0.8) + 's';
      wrap.appendChild(p);
      setTimeout(() => p.remove(), 2000);
    }
  }

  /* ── TOAST ──────────────────────────────────────────────── */
  function showToast(arena, gameKey, opts) {
    const best = saveBest(opts.bestKey, opts.bestVal);
    const isNew = opts.bestVal > 0 && opts.bestVal >= best;
    const old = arena.querySelector('.gm-toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'gm-toast';
    t.innerHTML =
      '<div class="gmt-confetti-wrap"></div>' +
      '<div class="gmt-row">' +
      '<span class="gmt-emoji">' + opts.emoji + '</span>' +
      '<div class="gmt-body">' +
      '<p class="gmt-title">🎉 <strong>Younes</strong> te félicite !</p>' +
      '<p class="gmt-achievement">' + opts.title + '</p>' +
      opts.body +
      (isNew
        ? '<span class="gmt-badge gmt-badge-new">🏆 Nouveau record : ' + best + ' pts !</span>'
        : '<span class="gmt-badge">🥇 Record : ' + best + ' pts</span>') +
      '</div>' +
      '<button class="gmt-btn" data-gk="' + gameKey + '">▶ Rejouer</button>' +
      '</div>';
    arena.insertBefore(t, arena.firstChild);
    t.querySelector('.gmt-btn').addEventListener('click', () => {
      document.querySelector('[data-game=' + gameKey + ']').click();
    });
    if (isNew || opts.bestVal >= (gameKey === 'memory' ? 400 : 90)) {
      confetti(t.querySelector('.gmt-confetti-wrap'), 28);
    }
  }

  /* ══════════════════════════════════════════════════════════
     GAME 1 — BUG HUNTER 🐛 v2
     ══════════════════════════════════════════════════════════ */
  function bugHunter(arena) {
    let score = 0, timeLeft = 30, combo = 0, comboTimer = null;
    let dead = false;

    /* ── Tous les timers dans un seul tableau ── */
    const ALL_TIMERS = [];   // setTimeout IDs
    const ALL_IVALS = [];   // setInterval IDs

    function safeTimeout(fn, ms) {
      if (dead) return -1;
      const id = setTimeout(() => { if (!dead) fn(); }, ms);
      ALL_TIMERS.push(id);
      return id;
    }
    function safeInterval(fn, ms) {
      if (dead) return -1;
      const id = setInterval(() => { if (!dead) fn(); }, ms);
      ALL_IVALS.push(id);
      return id;
    }
    function clearAll() {
      dead = true;
      ALL_TIMERS.forEach(clearTimeout);
      ALL_IVALS.forEach(clearInterval);
      if (comboTimer) clearTimeout(comboTimer);
    }

    const BUGS = ['🐛', '🪲', '🦗', '🕷️', '🐞', '🦟'];

    arena.innerHTML = `
      <div class="gm-hud">
        <div class="gm-hud-group">
          <span class="gm-hud-lbl">Score</span>
          <span class="gm-hud-val" id="bg-score">0</span>
        </div>
        <div class="gm-hud-group gm-hud-center">
          <div class="gm-combo hidden" id="bg-combo">🔥 <b id="bg-combo-n">0</b>x</div>
        </div>
        <div class="gm-hud-group gm-hud-right">
          <span class="gm-hud-lbl">⏱ Temps</span>
          <span class="gm-hud-val" id="bg-timer">30</span>
        </div>
      </div>
      <div class="gm-hud" style="margin-top:-6px">
        <span class="gm-hint">🌟 Bug doré = 30 pts &nbsp;·&nbsp; Combo = multiplicateur ! &nbsp;·&nbsp; Bug raté = -5 pts</span>
      </div>
      <div class="gm-bar-wrap"><div class="gm-bar" id="bg-bar"></div></div>
      <div id="bg-field" class="bug-field">
        <div class="bf-tip" id="bg-tip">🕵️ Clique sur les bugs !<br><small>Plus vite tu cliques, plus tu scores 🔥</small></div>
      </div>`;

    const field = arena.querySelector('#bg-field');
    const scoreEl = arena.querySelector('#bg-score');
    const timerEl = arena.querySelector('#bg-timer');
    const barEl = arena.querySelector('#bg-bar');
    const comboEl = arena.querySelector('#bg-combo');
    const comboN = arena.querySelector('#bg-combo-n');
    const tip = arena.querySelector('#bg-tip');

    function resetCombo() { combo = 0; comboEl.classList.add('hidden'); }
    function incCombo() {
      if (comboTimer) clearTimeout(comboTimer);
      combo++;
      if (combo >= 2) { comboEl.classList.remove('hidden'); comboN.textContent = combo; }
      comboTimer = setTimeout(resetCombo, 2200);
    }

    function endGame() {
      if (dead) return;
      clearAll();
      showToast(arena, 'bug', {
        emoji: score >= 200 ? '🏆' : score >= 100 ? '⭐' : '🎮',
        title: score >= 200 ? 'Exterminateur de bugs !!' : score >= 100 ? 'Bon chasseur !' : 'Continue à t\'entraîner !',
        body: '<p class="gmt-sub">Score final : <strong>' + score + ' pts</strong></p>',
        bestKey: 'bug', bestVal: score
      });
    }

    /* Countdown */
    safeInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      barEl.style.width = (timeLeft / 30 * 100) + '%';
      barEl.style.background = timeLeft <= 5 ? '#ff4757' : timeLeft <= 10 ? '#FF7F51' : '#2fb4ae';
      if (timeLeft <= 0) endGame();
    }, 1000);

    /* Spawn — délai 2s pour laisser le joueur se préparer */
    safeTimeout(() => {
      tip.style.transition = 'opacity .4s';
      tip.style.opacity = '0';
      spawnBug();

      let spawnInterval = safeInterval(spawnBug, 950);

      /* Accélération à 10s */
      safeTimeout(() => {
        if (dead) return;
        clearInterval(spawnInterval);
        spawnInterval = safeInterval(spawnBug, 680);

        /* Accélération à 20s */
        safeTimeout(() => {
          if (dead) return;
          clearInterval(spawnInterval);
          safeInterval(spawnBug, 460);
        }, 10000);
      }, 10000);
    }, 2000);

    function spawnBug() {
      if (dead) return;
      const isGolden = Math.random() < 0.10;
      const b = document.createElement('div');
      b.className = 'bug-item' + (isGolden ? ' bug-golden' : '');
      b.textContent = isGolden ? '🌟' : BUGS[Math.floor(Math.random() * BUGS.length)];
      b.style.left = (5 + Math.random() * 80) + '%';
      b.style.top = (8 + Math.random() * 72) + '%';
      const lifespan = isGolden ? 1500 : 2400;
      let hit = false;

      b.addEventListener('click', e => {
        if (hit || dead) return;
        hit = true;
        const mult = combo >= 6 ? 3 : combo >= 3 ? 2 : 1;
        const pts = isGolden ? 30 : 10 * mult;
        score += pts;
        scoreEl.textContent = score;
        incCombo();
        floatText('+' + pts + (mult > 1 ? ' ×' + mult : ''), e.clientX, e.clientY, true);
        b.classList.add('bug-caught');
        setTimeout(() => { if (b.parentNode) b.remove(); }, 280);
      });

      field.appendChild(b);

      /* Timer de disparition — tracké */
      safeTimeout(() => {
        if (dead || hit || !b.parentNode) { if (b.parentNode) b.remove(); return; }
        b.classList.add('bug-escaped');
        resetCombo();
        score = Math.max(0, score - 5);   // petit malus, pas de vie perdue
        scoreEl.textContent = score;
        setTimeout(() => { if (b.parentNode) b.remove(); }, 280);
      }, lifespan);
    }

    window._gc = clearAll;
  }

  /* ══════════════════════════════════════════════════════════
     GAME 2 — DEV MEMORY 🧠 v2
     ══════════════════════════════════════════════════════════ */
  function devMemory(arena) {
    const TECHS = [
      { icon: '⚛️', name: 'React', color: '#61dafb' },
      { icon: '🟢', name: 'Node.js', color: '#8cc84b' },
      { icon: '💙', name: 'Flutter', color: '#54c5f8' },
      { icon: '🐍', name: 'Python', color: '#3572A5' },
      { icon: '☕', name: 'Java', color: '#f89820' },
      { icon: '🅰️', name: 'Angular', color: '#dd0031' },
      { icon: '🗃️', name: 'SQL', color: '#e48e00' },
      { icon: '🐳', name: 'Docker', color: '#0db7ed' },
    ];

    let cards = [...TECHS, ...TECHS].map((t, i) => ({ ...t, uid: i }));
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    let flipped = [], matched = 0, moves = 0, canFlip = true, timeLeft = 60;
    let dead = false;
    const ivals = [];

    arena.innerHTML = `
      <div class="gm-hud">
        <div class="gm-hud-group">
          <span class="gm-hud-lbl">Coups</span>
          <span class="gm-hud-val" id="mm-moves">0</span>
        </div>
        <div class="gm-hud-group gm-hud-center">
          <span class="gm-hint">Retrouve les paires tech !</span>
        </div>
        <div class="gm-hud-group gm-hud-right">
          <span class="gm-hud-lbl">⏱ Temps</span>
          <span class="gm-hud-val" id="mm-timer">60</span>
        </div>
      </div>
      <div class="gm-bar-wrap"><div class="gm-bar" id="mm-bar"></div></div>
      <p class="gm-pairs-line">Paires : <b id="mm-pairs">0</b> / 8</p>
      <div class="memory-grid" id="mm-grid"></div>`;

    const grid = arena.querySelector('#mm-grid');
    const movesEl = arena.querySelector('#mm-moves');
    const pairsEl = arena.querySelector('#mm-pairs');
    const timerEl = arena.querySelector('#mm-timer');
    const barEl = arena.querySelector('#mm-bar');

    ivals.push(setInterval(() => {
      if (dead) return;
      timeLeft--;
      timerEl.textContent = timeLeft;
      barEl.style.width = (timeLeft / 60 * 100) + '%';
      barEl.style.background = timeLeft <= 10 ? '#ff4757' : timeLeft <= 20 ? '#FF7F51' : '#2fb4ae';
      if (timeLeft <= 0) showMemResult(false);
    }, 1000));

    function showMemResult(won) {
      if (dead) return;
      dead = true;
      ivals.forEach(clearInterval);
      if (!won) {
        showToast(arena, 'memory', {
          emoji: '⏰', title: "Temps écoulé !",
          body: '<p class="gmt-sub">Paires trouvées : <strong>' + matched + '</strong> / 8 en <strong>' + moves + '</strong> coups</p>',
          bestKey: 'memory', bestVal: 0
        });
        return;
      }
      const stars = moves <= 12 ? 3 : moves <= 18 ? 2 : 1;
      const score = Math.max(0, Math.round(800 - moves * 25 + timeLeft * 5));
      const sHtml = '<span class="gmt-stars">' + '⭐'.repeat(stars) + '☆'.repeat(3 - stars) + '</span>';
      showToast(arena, 'memory', {
        emoji: stars === 3 ? '🏆' : stars === 2 ? '⭐' : '💡',
        title: stars === 3 ? 'Mémoire parfaite !' : stars === 2 ? 'Très bien joué !' : 'Complété !',
        body: sHtml + '<p class="gmt-sub">Score : <strong>' + score + '</strong> &nbsp;·&nbsp; <strong>' + moves + '</strong> coups &nbsp;·&nbsp; <strong>' + timeLeft + 's</strong> restantes</p>',
        bestKey: 'memory', bestVal: score
      });
    }

    cards.forEach(card => {
      const el = document.createElement('div');
      el.className = 'mem-card';
      el.innerHTML = '<div class="mem-inner">' +
        '<div class="mem-front"><span>?</span></div>' +
        '<div class="mem-back" style="--cc:' + card.color + '">' +
        '<span class="mem-icon">' + card.icon + '</span>' +
        '<span class="mem-name">' + card.name + '</span>' +
        '</div></div>';

      el.addEventListener('click', () => {
        if (dead || !canFlip || el.classList.contains('is-flipped') || el.classList.contains('is-matched')) return;
        el.classList.add('is-flipped');
        flipped.push({ el, card });

        if (flipped.length === 2) {
          moves++;
          movesEl.textContent = moves;
          canFlip = false;

          if (flipped[0].card.name === flipped[1].card.name) {
            flipped[0].el.classList.add('is-matched');
            flipped[1].el.classList.add('is-matched');
            matched++;
            pairsEl.textContent = matched;
            flipped = []; canFlip = true;
            if (matched === 8) setTimeout(() => showMemResult(true), 500);
          } else {
            setTimeout(() => {
              if (dead) return;
              flipped[0].el.classList.remove('is-flipped');
              flipped[1].el.classList.remove('is-flipped');
              flipped = []; canFlip = true;
            }, 950);
          }
        }
      });
      grid.appendChild(el);
    });

    window._gc = () => { dead = true; ivals.forEach(clearInterval); };
  }

  /* ══════════════════════════════════════════════════════════
     GAME 3 — CODE RAIN ⌨️ v2
     ══════════════════════════════════════════════════════════ */
  function codeRain(arena) {
    const GOOD = ['const', 'async', 'await', 'fetch()', 'npm i', 'git push', 'deploy', 'return', 'import', '200 OK', '.then()', 'resolve', 'export', 'useState', 'useEffect', 'Promise', 'git log', 'release', 'build()', 'merge'];
    const BAD = ['bug', 'error', 'crash', '404', '500', 'NaN', 'undefined', 'CORS', 'fail', 'null', 'leak', 'freeze'];

    let score = 0, timeLeft = 30, streak = 0, bestStreak = 0;
    let dead = false;
    const ivals = [];
    const tout = [];

    arena.innerHTML = `
      <div class="gm-hud">
        <div class="gm-hud-group">
          <span class="gm-hud-lbl">Score</span>
          <span class="gm-hud-val" id="cr-score">0</span>
        </div>
        <div class="gm-hud-group gm-hud-center">
          <div class="gm-streak hidden" id="cr-streak">🔥 <b id="cr-streak-n">0</b>x streak</div>
        </div>
        <div class="gm-hud-group gm-hud-right">
          <span class="gm-hud-lbl">⏱ Temps</span>
          <span class="gm-hud-val" id="cr-timer">30</span>
        </div>
      </div>
      <div class="gm-bar-wrap"><div class="gm-bar" id="cr-bar"></div></div>
      <div class="cr-legend">
        <span class="crl-good">🟢 +10</span>
        <span class="crl-bad">🔴 -5</span>
        <span class="crl-jack">💎 +25</span>
        <span class="crl-bomb">💣 -15</span>
      </div>
      <div id="cr-field" class="rain-field"></div>`;

    const field = arena.querySelector('#cr-field');
    const scoreEl = arena.querySelector('#cr-score');
    const timerEl = arena.querySelector('#cr-timer');
    const barEl = arena.querySelector('#cr-bar');
    const streakEl = arena.querySelector('#cr-streak');
    const streakN = arena.querySelector('#cr-streak-n');

    function clearAll() {
      dead = true;
      ivals.forEach(clearInterval);
      tout.forEach(clearTimeout);
    }

    function setStreak(v) {
      streak = v;
      if (v > bestStreak) bestStreak = v;
      if (streak >= 3) {
        streakEl.classList.remove('hidden');
        streakN.textContent = streak;
        streakEl.className = 'gm-streak' + (streak >= 8 ? ' streak-epic' : streak >= 5 ? ' streak-hot' : '');
      } else streakEl.classList.add('hidden');
    }

    function showResult() {
      if (dead) return;
      clearAll();
      showToast(arena, 'rain', {
        emoji: score >= 150 ? '🚀' : score >= 80 ? '💻' : '🎮',
        title: score >= 150 ? 'Dev Senior confirmé !' : score >= 80 ? 'Bon dev junior !' : 'Continue à coder !',
        body: '<p class="gmt-sub">Score : <strong>' + score + ' pts</strong> &nbsp;·&nbsp; Meilleur streak : <strong>' + bestStreak + 'x</strong></p>',
        bestKey: 'rain', bestVal: score
      });
    }

    ivals.push(setInterval(() => {
      if (dead) return;
      timeLeft--;
      timerEl.textContent = timeLeft;
      barEl.style.width = (timeLeft / 30 * 100) + '%';
      barEl.style.background = timeLeft <= 5 ? '#ff4757' : timeLeft <= 10 ? '#FF7F51' : '#2fb4ae';
      if (timeLeft <= 0) showResult();
    }, 1000));

    function schedule() {
      if (dead) return;
      const delay = Math.max(310, 750 - (30 - timeLeft) * 14);
      const t = setTimeout(() => { if (!dead) { spawnWord(); schedule(); } }, delay);
      tout.push(t);
    }

    function spawnWord() {
      if (dead) return;
      const roll = Math.random();
      let type, text;
      if (roll < 0.06) { type = 'bomb'; text = '💣'; }
      else if (roll < 0.12) { type = 'jackpot'; text = '💎'; }
      else if (roll < 0.42) { type = 'bad'; text = BAD[Math.floor(Math.random() * BAD.length)]; }
      else { type = 'good'; text = GOOD[Math.floor(Math.random() * GOOD.length)]; }

      const el = document.createElement('div');
      const dur = (2.2 + Math.random() * 2.3).toFixed(2);
      el.className = 'rain-word rw-' + type;
      el.textContent = text;
      el.style.left = (2 + Math.random() * 83) + '%';
      el.style.animationDuration = dur + 's';

      el.addEventListener('click', () => {
        if (dead || !el.parentNode) return;
        let pts;
        if (type === 'bomb') { pts = -15; setStreak(0); }
        else if (type === 'jackpot') { pts = 25; setStreak(streak + 1); }
        else if (type === 'bad') { pts = -5; setStreak(0); }
        else {
          const mult = streak >= 8 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
          pts = Math.round(10 * mult);
          setStreak(streak + 1);
        }
        score = Math.max(0, score + pts);
        scoreEl.textContent = score;
        const rect = el.getBoundingClientRect();
        floatText((pts >= 0 ? '+' : '') + pts, rect.left + rect.width / 2, rect.top, pts >= 0);
        el.classList.add(pts >= 0 ? 'rw-hit-good' : 'rw-hit-bad');
        setTimeout(() => { if (el.parentNode) el.remove(); }, 300);
      });

      el.addEventListener('animationend', () => { if (el.parentNode) el.remove(); });
      field.appendChild(el);
    }

    schedule();
    window._gc = clearAll;
  }

})();
