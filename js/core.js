/* 공통 도구: 저장, 그리기, 타이머, 점수판, 인쇄 */
(function () {
  const KEY = 'hakgimal-kit-v1';
  let mem = { pack: [], roster: [], grade: '', cls: '', teacher: '', school: '', data: {} };
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) mem = Object.assign(mem, s); } catch (e) {}
  if (window.ACTS) mem.pack = mem.pack.filter(n => ACTS.some(a => a.n === n));
  const Store = {
    get: () => mem,
    save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {} },
    d(key, def) { if (!(key in mem.data)) mem.data[key] = def; return mem.data[key]; },
    set(key, v) { mem.data[key] = v; Store.save(); },
    inPack: n => mem.pack.includes(n),
    toggle(n) { const i = mem.pack.indexOf(n); if (i >= 0) mem.pack.splice(i, 1); else mem.pack.push(n); Store.save(); return i < 0; },
    roster() { return mem.roster.filter(Boolean); }
  };
  window.Store = Store;

  window.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.$ = (sel, root) => (root || document).querySelector(sel);
  window.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  window.el = function (html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  window.shuffle = function (a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  window.rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  window.pickOne = a => a[Math.floor(Math.random() * a.length)];

  const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  window.chosung = s => Array.from(s).map(ch => { const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 ? CHO[Math.floor(c / 588)] : ch; }).join('');
  window.choOf = ch => { const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 ? 'ㄱㄱㄴㄷㄷㄹㅁㅂㅂㅅㅅㅇㅈㅈㅊㅋㅌㅍㅎ'[Math.floor(c / 588)] : '#'; };

  window.ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    star: '<svg class="star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    O: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="none" stroke="#2366C2" stroke-width="13"/></svg>',
    X: '<svg viewBox="0 0 100 100"><path d="M22 22l56 56M78 22L22 78" stroke="#C9305A" stroke-width="13" stroke-linecap="round"/></svg>',
    scissor: '<svg class="scissor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="M8.5 8.5L20 18M8.5 15.5L20 6"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M17 14.5c2.4 0 4 1.5 4.6 4"/></svg>'
  };

  /* 효과음 */
  let actx;
  window.beep = function (type) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const seq = { ok: [[660, .09], [880, .14]], no: [[260, .18]], tick: [[1000, .04]], end: [[880, .15], [660, .15], [880, .3]], pop: [[520, .06]], fan: [[523, .12], [659, .12], [784, .12], [1046, .35]] }[type] || [[600, .1]];
      let t = actx.currentTime;
      seq.forEach(([f, d]) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(.18, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d + .02); t += d * .9; });
    } catch (e) {}
  };

  window.toast = function (msg) { const t = el(`<div class="toast">${esc(msg)}</div>`); document.body.appendChild(t); setTimeout(() => t.remove(), 1900); };

  /* 꽃가루 */
  window.confetti = function (host) {
    const c = document.createElement('canvas'); c.className = 'confetti'; host.appendChild(c);
    const r = host.getBoundingClientRect(); c.width = r.width; c.height = r.height; const g = c.getContext('2d');
    const cols = ['#FF5C8A', '#FFC23D', '#2FBF71', '#3D8BFF', '#A66BFF', '#FF8A3D'];
    const ps = Array.from({ length: 140 }, () => ({ x: r.width / 2 + (Math.random() - .5) * 200, y: r.height * .45, vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 4, s: 6 + Math.random() * 7, c: pickOne(cols), a: Math.random() * 6, va: (Math.random() - .5) * .4 }));
    let f = 0; (function loop() { g.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .42; p.vx *= .99; p.a += p.va; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); }); if (++f < 150) requestAnimationFrame(loop); else c.remove(); })();
  };

  /* 원형 타이머 */
  window.makeTimer = function (opts) {
    const R = 40, C = 2 * Math.PI * R;
    const node = el(`<div class="timer"><div class="ring"><svg viewBox="0 0 92 92"><circle cx="46" cy="46" r="${R}" fill="none" stroke="rgba(31,43,69,.1)" stroke-width="8"/><circle class="arc" cx="46" cy="46" r="${R}" fill="none" stroke="var(--c)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><div class="tv"></div></div></div>`);
    const arc = $('.arc', node), tv = $('.tv', node), ring = $('.ring', node);
    let total = opts.sec, left = total, iv = null, onEnd = opts.onEnd;
    function draw() { tv.textContent = left >= 60 ? Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0') : left; arc.style.strokeDashoffset = C * (1 - left / total); ring.classList.toggle('warn', left <= 5); }
    const api = {
      node, start() { if (iv) return; iv = setInterval(() => { left--; if (left <= 5 && left > 0) beep('tick'); draw(); if (left <= 0) { api.stop(); beep('end'); onEnd && onEnd(); } }, 1000); },
      stop() { clearInterval(iv); iv = null; }, reset(s) { api.stop(); if (s) total = s; left = total; draw(); }, running: () => !!iv, left: () => left
    };
    draw(); window.__timers.push(api); return api;
  };
  window.__timers = [];
  window.clearTimers = () => { window.__timers.forEach(t => t.stop()); window.__timers = []; };

  /* 모둠 점수판 */
  window.TEAMC = ['#FFD6DF', '#D4E9FF', '#D6F2DF', '#FFEBC2', '#E9DEFF', '#FFE0CF'];
  window.TEAMV = ['#E2456B', '#2B78D6', '#13A36E', '#D99A00', '#7A52D9', '#F2672A'];
  window.makeScore = function (key, opts) {
    opts = opts || {};
    const st = Store.d('score:' + key, { n: 4, s: [0, 0, 0, 0, 0, 0] });
    const node = el('<div class="scorebar"></div>');
    let turn = 0;
    function draw() {
      node.innerHTML = '';
      for (let i = 0; i < st.n; i++) {
        const t = el(`<div class="team ${opts.turns && i === turn ? 'turn' : ''}" style="--tc:${TEAMC[i]}"><b>${i + 1}모둠</b><button aria-label="빼기">−</button><span class="sc">${st.s[i]}</span><button aria-label="더하기">+</button></div>`);
        const [m, p] = $$('button', t);
        m.onclick = () => api.add(i, -1); p.onclick = () => api.add(i, 1);
        node.appendChild(t);
      }
      const set = el(`<div class="seg" style="align-items:center"><button>모둠 수 ${st.n}</button><button>0점으로</button></div>`);
      const [nb, rb] = $$('button', set);
      nb.onclick = () => { st.n = st.n >= 6 ? 2 : st.n + 1; Store.save(); draw(); };
      rb.onclick = () => { if (confirm('점수를 모두 0점으로 바꿀까요?')) { st.s = [0, 0, 0, 0, 0, 0]; Store.save(); draw(); } };
      node.appendChild(set);
    }
    const api = {
      node, add(i, d) { st.s[i] = Math.max(0, st.s[i] + d); Store.save(); draw(); const t = node.children[i]; if (t) { t.classList.add('pop'); } if (d > 0) beep('pop'); },
      turn: () => turn, nextTurn() { turn = (turn + 1) % st.n; draw(); }, setTurn(i) { turn = i; draw(); }, teams: () => st.n, scores: () => st.s
    };
    draw(); return api;
  };

  /* 인쇄 */
  window.printPages = function (pages) {
    const root = $('#printRoot'); root.innerHTML = '';
    pages.forEach(p => root.appendChild(p.cloneNode ? p.cloneNode(true) : el(p)));
    $$('[contenteditable]', root).forEach(n => n.removeAttribute('contenteditable'));
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
      root.style.cssText = 'display:block;position:absolute;left:-99999px;top:0;visibility:hidden';
      $$('.page', root).forEach(p => window.fillPage && fillPage(p));
      root.style.cssText = '';
      setTimeout(() => window.print(), 120);
    });
  };

  /* 카테고리 색 */
  window.catOf = a => CATS[a.c - 1];
  window.catVars = c => `--c:${c.ink};--t:${c.tint}`;
  window.actBy = n => ACTS.find(a => a.n === n);
  window.className = () => { const m = Store.get(); return `${m.grade ? m.grade + '학년 ' : ''}${m.cls ? m.cls + '반' : ''}`.trim(); };
})();
