/* 활동별 화면 도구 */
(function () {
  const T = {};
  window.TOOLS = T;
  const CUSTOM_DEF = '우리 반 선생님이 가장 많이 한 말은? | (선생님이 정답을 써 주세요)\n올해 우리 반 현장체험학습 장소는? | (정답)\n급식에서 우리 반이 가장 좋아한 메뉴는? | (정답)\n우리 반 교실은 몇 층에 있나요? | (정답)\n우리 반 친구는 모두 몇 명인가요? | (정답)';
  const roster = () => Store.roster();
  const needRoster = (stage, msg) => {
    stage.innerHTML = `<div class="center"><div class="qbig" style="font-size:32px">${msg || '우리 반 명단이 필요해요.'}</div><p class="expl">이름을 한 번만 넣어 두면 상장, 롤링페이퍼, 천사 뽑기, 청소 역할에 모두 쓰여요.</p><button class="btn dark big" data-roster>우리 반 명단 넣기</button></div>`;
    $('[data-roster]', stage).onclick = () => window.openSettings();
  };
  const seg = (items, cur, on) => { const s = el('<div class="seg"></div>'); items.forEach(([v, t]) => { const b = el(`<button class="${v === cur ? 'on' : ''}">${t}</button>`); b.onclick = () => { $$('button', s).forEach(x => x.classList.remove('on')); b.classList.add('on'); on(v); }; s.appendChild(b); }); return s; };
  const field = (label, node) => { const l = el(`<label class="f">${label}</label>`); l.appendChild(node); return l; };
  const ta = (val, rows) => { const t = el(`<textarea class="field" rows="${rows || 8}"></textarea>`); t.value = val; return t; };

  /* ─── 인쇄 활동지 ─── */
  T.sheet = function (a, ctx) {
    const pages = () => [buildSheet(a, a.sheet)];
    let cur = pages();
    showPaper(ctx.stage, cur);
    ctx.print(() => printPages($$('.page', ctx.stage)));
    const r = el('<button class="btn">처음 모습으로 되돌리기</button>'); r.onclick = () => { cur = pages(); showPaper(ctx.stage, cur); };
    ctx.opts.append(el('<p class="hint">종이 위 글자(제목, 안내, 칸 이름)를 눌러서 바로 고칠 수 있어요. 고친 뒤 인쇄하세요.</p>'), r);
  };
  T.sheet.pages = a => [buildSheet(a, a.sheet)];

  /* ─── 퀴즈 ─── */
  const MATH = {
    1: () => pickOne([
      () => { const x = rint(11, 40), y = rint(1, 9 - (x % 10) > 0 ? 9 - (x % 10) : 1); return { q: `${x} + ${y} = ?`, a: x + y }; },
      () => { const x = rint(21, 59), y = rint(1, x % 10 || 1); return { q: `${x} − ${y} = ?`, a: x - y }; },
      () => { const s = rint(1, 6) * 10; return { q: `${s}, ${s + 10}, ${s + 20}, ?  (10씩 뛰어 세기)`, a: s + 30 }; }
    ])(),
    2: () => pickOne([
      () => { const x = rint(15, 68), y = rint(15, 29); return (x % 10) + (y % 10) >= 10 ? { q: `${x} + ${y} = ?`, a: x + y } : { q: `${x + 3} + ${y + 6} = ?`, a: x + y + 9 }; },
      () => { const x = rint(41, 92), y = rint(13, 38); return { q: `${x} − ${y} = ?`, a: x - y }; },
      () => { const d = pickOne([2, 5]), k = rint(2, 9); return { q: `${d} × ${k} = ?`, a: d * k }; }
    ])(),
    3: () => pickOne([
      () => { const d = pickOne([3, 4, 6]), k = rint(2, 9); return { q: `${d} × ${k} = ?`, a: d * k }; },
      () => { const m = rint(1, 3), c = rint(5, 95); return { q: `${m}m ${c}cm 는 몇 cm일까요?`, a: m * 100 + c, u: 'cm' }; },
      () => { const h = rint(1, 12), half = Math.random() < .5; return { q: '시계가 가리키는 시각은?', clock: [h, half ? 30 : 0], a: half ? `${h}시 30분` : `${h}시`, txt: 1 }; }
    ])(),
    4: () => pickOne([
      () => { const d = pickOne([7, 8, 9]), k = rint(3, 9); return { q: `${d} × ${k} = ?`, a: d * k }; },
      () => { const n = rint(1, 9) * 1000 + rint(1, 9) * 100 + rint(1, 9) * 10 + rint(1, 9), pos = rint(0, 2), v = [1000, 100, 10][pos], dg = Math.floor(n / v) % 10; return { q: `${n}에서 숫자 ${dg}은(는) 얼마를 나타낼까요?`, a: dg * v, pv: v }; },
      () => { const m = rint(5, 55); return { q: `1시간 ${m}분은 몇 분일까요?`, a: 60 + m, u: '분' }; },
      () => { const h = rint(1, 12), mm = rint(1, 11) * 5; return { q: '시계가 가리키는 시각은?', clock: [h, mm], a: `${h}시 ${mm}분`, txt: 1 }; }
    ])()
  };
  function clockSVG(h, m) {
    const ma = m / 60 * 360, ha = (h % 12) / 12 * 360 + m / 2;
    let t = ''; for (let i = 1; i <= 12; i++) { const r = i / 12 * Math.PI * 2; t += `<text x="${100 + Math.sin(r) * 72}" y="${100 - Math.cos(r) * 72 + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="#1F2B45" font-family="Miso">${i}</text>`; }
    for (let i = 0; i < 60; i++) { const r = i / 60 * Math.PI * 2, l = i % 5 ? 4 : 8; t += `<line x1="${100 + Math.sin(r) * 90}" y1="${100 - Math.cos(r) * 90}" x2="${100 + Math.sin(r) * (90 - l)}" y2="${100 - Math.cos(r) * (90 - l)}" stroke="#1F2B45" stroke-width="${i % 5 ? 1 : 2}"/>`; }
    return `<svg viewBox="0 0 200 200" style="width:min(30vh,240px);height:min(30vh,240px)"><circle cx="100" cy="100" r="95" fill="#fff" stroke="#1F2B45" stroke-width="5"/>${t}<line x1="100" y1="100" x2="${100 + Math.sin(ha * Math.PI / 180) * 45}" y2="${100 - Math.cos(ha * Math.PI / 180) * 45}" stroke="#1F2B45" stroke-width="8" stroke-linecap="round"/><line x1="100" y1="100" x2="${100 + Math.sin(ma * Math.PI / 180) * 70}" y2="${100 - Math.cos(ma * Math.PI / 180) * 70}" stroke="#2366C2" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="#1F2B45"/></svg>`;
  }
  window.clockSVG = clockSVG;
  function mathMC(level) {
    const g = MATH[level]();
    let opts;
    if (g.txt) {
      const [h, m] = g.clock; const f = (hh, mm) => mm ? `${hh}시 ${mm}분` : `${hh}시`;
      const alt = [f(h % 12 + 1, m), f(h, (m + 30) % 60 || (m ? 0 : 30)), f(Math.max(1, (h + 10) % 12 || 12), m), f(h, m ? Math.min(55, m + 5) : 30)];
      opts = Array.from(new Set([g.a, ...alt])).slice(0, 4);
    } else {
      const a = g.a, step = g.pv ? g.pv : (a >= 100 ? 10 : 1);
      const cands = g.pv ? [a / 10, a * 10 > 9000 ? a / 100 : a * 10, a / g.pv * (g.pv === 10 ? 100 : 10), a + g.pv].filter(x => x >= 1 && Number.isInteger(x) && x !== a)
        : [a + step, a - step, a + 10, a - 10, a + 2, a - 2].filter(x => x > 0 && x !== a);
      opts = [a, ...shuffle(Array.from(new Set(cands))).slice(0, 3)];
      while (opts.length < 4) opts.push(a + opts.length * 3);
      opts = opts.map(x => g.u ? x + g.u : x);
      g.a = g.u ? g.a + g.u : g.a;
    }
    return { q: g.q, a: String(g.a), o: shuffle(opts.map(String)), svg: g.clock ? clockSVG(...g.clock) : '', s: '수학' };
  }
  function bankMC(list, level, s) {
    const pool = list.filter(x => x[3] <= level + 0); const it = pickOne(pool.length ? pool : list);
    return { q: it[0], a: it[1], o: shuffle([it[1], ...it[2]]), s };
  }

  T.quiz = function (a, ctx) {
    const mode = a.mode, st = ctx.stage, c = catOf(a);
    let i = 0, list = [], score = null;
    let goldGrade = Store.d('gold:grade', Math.min(6, parseInt(Store.get().grade, 10) || 0));
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    const prog = el('<div class="progress"><b></b></div>'); st.appendChild(prog);
    const teamKey = mode === 'balance' || mode === 'review' ? null : a.n;
    if (teamKey) { score = makeScore(teamKey, { turns: mode === 'battle' }); st.appendChild(score.node); }
    const lvl = n => `<span class="lvl">${[1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')} ${['', '쉬움', '보통', '어려움'][n]}</span>`;
    const byLevel = arr => [1, 2, 3].flatMap(l => shuffle(arr.filter(x => x[2] === l)));

    function build(filter) {
      const f = filter || 0;
      if (mode === 'chosung') list = byLevel(BANK.chosung).filter(x => !f || x[2] === f).map(x => ({ q: chosung(x[0]), a: x[0], h: x[1], l: x[2] }));
      if (mode === 'creative') list = byLevel(BANK.creative).filter(x => !f || x[2] === f).map(x => ({ q: x[0], a: x[1], l: x[2] }));
      if (mode === 'golden') list = byLevel(getCustom(goldKey(), goldDef()).map(r => [r[0], r[1], +r[2] || 2])).filter(x => !f || x[2] === f).map(x => ({ q: x[0], a: x[1], l: x[2] }));
      if (mode === 'ox') list = shuffle(BANK.ox).map(x => ({ q: x[0], a: x[1], e: x[2] }));
      if (mode === 'balance') list = shuffle(BANK.balance).map(x => ({ A: x[0], B: x[1], na: 0, nb: 0 }));
      if (mode === 'fake') list = shuffle(BANK.fake).map(x => ({ q: x[0], a: x[1], e: x[2] }));
      if (mode === 'custom') list = getCustom('custom', CUSTOM_DEF).map(r => ({ q: r[0], a: r[1] || '' }));
      if (mode === 'review' || mode === 'battle') list = [];
      i = 0;
    }
    function goldKey() { return goldGrade ? 'golden' + goldGrade : 'golden'; }
    function goldDef() { const src = goldGrade ? BANK.goldenG[goldGrade] : BANK.golden; return src.map(x => `${x[0]} | ${x[1]} | ${x[2]}`).join('\n'); }
    function getCustom(key, def) { const txt = Store.d('custom:' + a.n + key, def); return txt.split('\n').map(l => l.split('|').map(s => s.trim())).filter(r => r[0]); }

    /* 학습 퀴즈 상태 */
    const g0 = Math.min(6, Math.max(1, parseInt(Store.get().grade, 10) || 2));
    let rv = { level: 1, streak: 0, right: 0, total: 0, grade: Store.d('rv:grade:' + a.n, g0), subj: Store.d('rv:subj:' + a.n, 'mix'), cur: null, answered: false };
    rv.limit = Store.d('rv:limit:' + a.n, 10); rv.qn = 0; rv.seen = new Set();
    function nextMC() {
      let q, k = 0; do { q = makeReview(rv.grade, rv.subj, rv.level); k++; } while (rv.seen.has(q.q + '|' + q.a) && k < 40);
      rv.seen.add(q.q + '|' + q.a); rv.qn++;
      rv.cur = q;
      rv.answered = false;
    }

    function show() {
      clearTimers();
      body.innerHTML = '';
      if (mode === 'review' || mode === 'battle') return showMC();
      if (!list.length) { body.innerHTML = '<div class="center"><div class="qbig">문제가 없어요.</div></div>'; return; }
      if (i >= list.length) return finish();
      const q = list[i]; prog.firstChild.style.width = (i / list.length * 100) + '%';
      const head = `<div class="qcount">${i + 1} / ${list.length}</div>`;
      let h = '';
      if (mode === 'chosung') h = `${head}${lvl(q.l)}<div class="qhuge">${esc(q.q)}</div><div class="expl hintline" style="visibility:hidden">힌트: ${esc(q.h)}</div><div class="ans hide">${esc(q.a)}</div><div class="ctrl"><button class="btn big" data-h>힌트</button><button class="btn big dark" data-r>정답 보기</button><button class="btn big" data-n>다음 ${ICON.next}</button></div>`;
      if (mode === 'creative' || mode === 'custom') h = `${head}${q.l ? lvl(q.l) : ''}<div class="qbig">${esc(q.q)}</div><div class="ans hide">${esc(q.a)}</div><div class="ctrl"><button class="btn big dark" data-r>정답 보기</button><button class="btn big" data-n>다음 ${ICON.next}</button></div>`;
      if (mode === 'golden') h = `${head}${lvl(q.l)}<div class="qbig">${esc(q.q)}</div><div data-t></div><div class="ans hide">${esc(q.a)}</div><div class="ctrl"><button class="btn big dark" data-r>정답 공개</button><button class="btn big" data-n>다음 ${ICON.next}</button></div>`;
      if (mode === 'ox') h = `${head}<div class="qbig">${esc(q.q)}</div><div class="oxpair"><div class="oxmark" data-m="O">${ICON.O}</div><div class="oxmark" data-m="X">${ICON.X}</div></div><div class="expl ans hide" style="color:var(--sub)">${esc(q.e)}</div><div class="ctrl"><button class="btn big dark" data-r>정답 공개</button><button class="btn big" data-n>다음 ${ICON.next}</button></div>`;
      if (mode === 'fake') h = `${head}<div style="background:#fff;border-radius:6px;padding:26px 40px;max-width:1000px;border-left:10px solid var(--c);text-align:left;box-shadow:0 10px 30px rgba(31,43,69,.1)"><div style="font-size:15px;color:var(--sub);font-weight:700">오늘의 뉴스</div><div class="qbig" style="font-size:clamp(28px,3.6vw,52px)">${esc(q.q)}</div></div><div class="ctrl"><button class="btn huge" data-g="1" style="border-color:var(--good);color:var(--good)">진짜 같아요</button><button class="btn huge" data-g="0" style="border-color:var(--bad);color:var(--bad)">가짜 같아요</button></div><div class="ans hide"></div><div class="expl hide ex">${esc(q.e)}</div><div class="ctrl"><button class="btn big" data-n>다음 ${ICON.next}</button></div>`;
      if (mode === 'balance') h = `${head}<div class="bal"><div class="balside" style="background:#FFD6DF"><div class="bt">${esc(q.A)}</div><div class="bn" data-na>${q.na}</div><div class="bbar"><b data-ba></b></div><div class="ctrl"><button class="btn" data-a="-1">−</button><button class="btn dark big" data-a="1">이쪽 +1</button></div></div><div class="vs">VS</div><div class="balside" style="background:#D4E9FF"><div class="bt">${esc(q.B)}</div><div class="bn" data-nb>${q.nb}</div><div class="bbar"><b data-bb></b></div><div class="ctrl"><button class="btn" data-b="-1">−</button><button class="btn dark big" data-b="1">이쪽 +1</button></div></div></div><div class="ctrl"><button class="btn big" data-p>${ICON.back} 이전</button><button class="btn big" data-n>다음 ${ICON.next}</button></div>`;
      const w = el(`<div class="center">${h}</div>`); body.appendChild(w);
      const ans = $('.ans', w);
      const reveal = () => { ans && ans.classList.remove('hide'); beep('ok'); if (mode === 'ox') { $$('.oxmark', w).forEach(m => m.classList.add(m.dataset.m === q.a ? 'right' : 'dim')); } };
      $('[data-r]', w) && ($('[data-r]', w).onclick = reveal);
      $('[data-h]', w) && ($('[data-h]', w).onclick = () => { $('.hintline', w).style.visibility = 'visible'; });
      $('[data-n]', w) && ($('[data-n]', w).onclick = () => { i++; show(); });
      $('[data-p]', w) && ($('[data-p]', w).onclick = () => { i = Math.max(0, i - 1); show(); });
      if (mode === 'golden') { const t = makeTimer({ sec: q.l === 3 ? 20 : 15 }); $('[data-t]', w).appendChild(t.node); t.start(); }
      if (mode === 'fake') $$('[data-g]', w).forEach(b => b.onclick = () => { const ok = (b.dataset.g === '1') === q.a; ans.textContent = q.a ? '진짜 뉴스예요' : '가짜 뉴스예요'; ans.style.color = q.a ? 'var(--good)' : 'var(--bad)'; ans.classList.remove('hide'); $('.ex', w).classList.remove('hide'); beep(ok ? 'ok' : 'no'); $$('[data-g]', w).forEach(x => x.disabled = true); });
      if (mode === 'balance') {
        const draw = () => { const t = q.na + q.nb || 1; $('[data-na]', w).textContent = q.na; $('[data-nb]', w).textContent = q.nb; $('[data-ba]', w).style.width = q.na / t * 100 + '%'; $('[data-bb]', w).style.width = q.nb / t * 100 + '%'; };
        $$('[data-a]', w).forEach(b => b.onclick = () => { q.na = Math.max(0, q.na + +b.dataset.a); beep('pop'); draw(); });
        $$('[data-b]', w).forEach(b => b.onclick = () => { q.nb = Math.max(0, q.nb + +b.dataset.b); beep('pop'); draw(); });
        draw();
      }
    }
    function restartMC() { rv.qn = 0; rv.right = 0; rv.total = 0; rv.streak = 0; rv.seen = new Set(); nextMC(); show(); }
    function endMC() {
      clearTimers(); prog.firstChild.style.width = '100%';
      const sc = mode === 'battle' ? score.scores().slice(0, score.teams()) : null;
      const best = sc ? Math.max(...sc) : 0;
      body.innerHTML = `<div class="center"><div class="qbig">${rv.limit}문제 끝!</div>${mode === 'battle' ? `<p class="expl">${sc.map((v, k) => `${k + 1}모둠 ${v}점`).join(' · ')}</p><div class="qhuge" style="font-size:clamp(40px,6vw,80px)">${sc.map((v, k) => v === best ? (k + 1) + '모둠' : '').filter(Boolean).join(', ')} 우승!</div>` : `<div class="qhuge" style="font-size:clamp(60px,9vw,130px)">${rv.right} / ${rv.limit}</div><p class="expl">${rv.right >= rv.limit * .8 ? '정말 대단해요! 1년 동안 열심히 공부했어요.' : rv.right >= rv.limit * .5 ? '잘했어요! 틀린 문제는 방학에 한 번 더 봐요.' : '괜찮아요. 다시 하면 더 잘할 수 있어요!'}</p>`}<button class="btn huge dark" data-again>새 문제로 다시 하기</button></div>`;
      confetti(st); beep('fan');
      $('[data-again]', body).onclick = restartMC;
    }
    function showMC() {
      if (!rv.cur) nextMC();
      const q = rv.cur, w = el(`<div class="center"></div>`);
      const turnTxt = mode === 'battle' ? `<div class="qcount" style="font-size:22px;color:var(--ink)">${score.turn() + 1}모둠 차례예요</div>` : `<div class="qcount">${rv.qn} / ${rv.limit}번째 문제 · 맞힌 문제 ${rv.right}</div>`;
      w.innerHTML = `${turnTxt}<span class="lvl">${[1, 2, 3].map(k => `<i class="${k <= rv.level ? 'on' : ''}"></i>`).join('')} ${rv.grade}학년 ${esc(q.s)} ${rv.level}단계</span>${q.svg || ''}<div class="qbig" style="font-size:clamp(28px,3.8vw,54px)">${fracHTML(q.q)}</div><div class="choices">${q.o.map((o, k) => `<button class="choice" data-o="${esc(o)}"><span class="k">${k + 1}</span>${fracHTML(o)}</button>`).join('')}</div><div class="ctrl"><button class="btn big" data-n>다음 문제 ${ICON.next}</button></div>`;
      body.appendChild(w);
      $$('.choice', w).forEach(b => b.onclick = () => {
        if (rv.answered) return;
        const ok = b.dataset.o === q.a;
        if (ok) { rv.answered = true; b.classList.add('right'); beep('ok'); rv.right++; rv.total++; rv.streak++; if (rv.streak >= 2) { rv.level = Math.min(3, rv.level + 1); rv.streak = 0; } if (mode === 'battle') score.add(score.turn(), 1); $$('.choice', w).forEach(x => x.disabled = true); }
        else {
          b.classList.add('wrong'); b.disabled = true; beep('no');
          if (mode === 'battle') { score.nextTurn(); $('.qcount', w).textContent = `${score.turn() + 1}모둠에게 기회가 넘어갔어요`; }
          else { rv.answered = true; rv.total++; rv.streak = 0; $$('.choice', w).forEach(x => { if (x.dataset.o === q.a) x.classList.add('right'); x.disabled = true; }); }
        }
      });
      $('[data-n]', w).textContent = rv.qn >= rv.limit ? '결과 보기' : '다음 문제';
      $('[data-n]', w).onclick = () => { if (mode === 'battle' && rv.answered) score.nextTurn(); if (rv.qn >= rv.limit) return endMC(); nextMC(); show(); };
    }
    function finish() {
      prog.firstChild.style.width = '100%';
      body.innerHTML = `<div class="center"><div class="qbig">모든 문제를 다 풀었어요!</div><div class="ctrl"><button class="btn big dark" data-again>다시 섞어서 하기</button></div></div>`;
      confetti(st); beep('fan');
      $('[data-again]', body).onclick = () => { build(curF); show(); };
    }

    /* 옵션 */
    let curF = 0;
    if (['chosung', 'creative', 'golden'].includes(mode)) ctx.opts.append(field('단계', seg([[0, '쉬움→어려움'], [1, '쉬움'], [2, '보통'], [3, '어려움']], 0, v => { curF = v; build(v); show(); })));
    if (mode === 'review' || mode === 'battle') {
      const subjBox = el('<div></div>');
      const drawSubj = () => { subjBox.innerHTML = ''; if (!REVIEW_SUBJ(rv.grade).some(x => x[0] === rv.subj)) rv.subj = 'mix'; subjBox.appendChild(field('과목', seg(REVIEW_SUBJ(rv.grade), rv.subj, v => { rv.subj = v; Store.set('rv:subj:' + a.n, v); restartMC(); }))); };
      ctx.opts.append(field('학년', seg([1, 2, 3, 4, 5, 6].map(g => [g, g + '학년']), rv.grade, v => { rv.grade = v; Store.set('rv:grade:' + a.n, v); rv.level = 1; drawSubj(); restartMC(); })), subjBox);
      drawSubj();
      ctx.opts.append(field('시작 단계', seg([[1, '1'], [2, '2'], [3, '3']], 1, v => { rv.level = v; restartMC(); })));
      ctx.opts.append(field('문제 수', seg([[10, '10문제'], [15, '15문제'], [20, '20문제']], rv.limit, v => { rv.limit = v; Store.set('rv:limit:' + a.n, v); restartMC(); })));
      ctx.opts.append(el('<p class="hint">2022 개정 교육과정 기준이에요. 수학은 학년별로 매번 새 문제가 나오고, 국어·사회·과학·통합은 학년군(1~2, 3~4, 5~6) 문제예요. 두 번 연속 맞히면 단계가 올라가요.</p>'));
    }
    if (mode === 'custom' || mode === 'golden') {
      const key = () => mode === 'golden' ? goldKey() : 'custom';
      const def = () => mode === 'golden' ? goldDef() : CUSTOM_DEF;
      const t = ta(Store.d('custom:' + a.n + key(), def() || ''), 9);
      const sv = el('<button class="btn dark">문제 저장하고 시작</button>');
      sv.onclick = () => { Store.set('custom:' + a.n + key(), t.value); build(curF); show(); toast('문제를 저장했어요'); };
      if (mode === 'golden') ctx.opts.prepend(field('학년', seg([[0, '공통'], [1, '1학년'], [2, '2학년'], [3, '3학년'], [4, '4학년'], [5, '5학년'], [6, '6학년']], goldGrade, v => { goldGrade = v; Store.set('gold:grade', v); t.value = Store.d('custom:' + a.n + key(), def()); build(curF); show(); })));
      ctx.opts.append(field(`문제 고치기 (한 줄에 "질문 | 정답${mode === 'golden' ? ' | 단계 1~3' : ''}")`, t), sv);
    }
    build(); show();
  };

  /* ─── 몸으로 말해요 / 스피드 퀴즈 ─── */
  T.act = function (a, ctx) {
    const D = DECKS[a.deck], cats = Object.keys(D), st = ctx.stage;
    let on = new Set(cats), sec = 60, pool = [], log = [], timer = null;
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    const score = makeScore(a.n, { turns: true }); st.appendChild(score.node);
    const refill = () => { pool = shuffle(cats.filter(k => on.has(k)).flatMap(k => D[k])); };
    const box = el('<div class="seg"></div>');
    cats.forEach(k => { const b = el(`<button class="on">${k}</button>`); b.onclick = () => { if (on.has(k) && on.size > 1) on.delete(k); else on.add(k); b.classList.toggle('on', on.has(k)); refill(); }; box.appendChild(b); });
    ctx.opts.append(field('낱말 묶음', box), field('한 판 시간', seg([[60, '1분'], [90, '1분 30초'], [120, '2분']], 60, v => sec = v)));
    ctx.opts.append(el(`<p class="hint">${a.deck === 'act' ? '설명하는 사람은 소리를 내지 않고 몸으로만 표현해요.' : '낱말을 그대로 말하거나 글자 수를 알려 주면 안 돼요.'} 한 번 나온 낱말은 다시 나오지 않아요.</p>`));
    refill();
    function ready() {
      clearTimers();
      body.innerHTML = `<div class="center"><div class="qcount" style="font-size:24px;color:var(--ink)">${score.turn() + 1}모둠 준비!</div><div class="qbig">설명할 친구가 화면 앞에 서요.</div><p class="expl">다른 친구들은 화면을 등지고 앉아요.</p><button class="btn huge dark" data-s>시작</button></div>`;
      $('[data-s]', body).onclick = play;
    }
    function play() {
      log = [];
      body.innerHTML = `<div class="center"><div data-t></div><div class="drawn" data-w></div><div class="ctrl"><button class="btn huge good" data-ok>${ICON.check} 맞혔어요</button><button class="btn huge" data-pass>통과</button></div><div class="qcount" data-c>맞힌 낱말 0개</div></div>`;
      timer = makeTimer({ sec, onEnd: end }); $('[data-t]', body).appendChild(timer.node); timer.start();
      let w; const nextW = () => { if (!pool.length) refill(); w = pool.pop(); $('[data-w]', body).textContent = w; };
      nextW();
      $('[data-ok]', body).onclick = () => { log.push([w, 1]); score.add(score.turn(), 1); beep('ok'); $('[data-c]', body).textContent = `맞힌 낱말 ${log.filter(x => x[1]).length}개`; nextW(); };
      $('[data-pass]', body).onclick = () => { log.push([w, 0]); beep('pop'); nextW(); };
    }
    function end() {
      const n = log.filter(x => x[1]).length;
      body.innerHTML = `<div class="center"><div class="qbig">${score.turn() + 1}모둠 ${n}개 맞혔어요!</div><div class="history">${log.map(([w, ok]) => `<span style="${ok ? 'background:#DCF2E5;border-color:#0E8A5C' : 'opacity:.6'}">${esc(w)}</span>`).join('')}</div><button class="btn huge dark" data-nx>다음 모둠</button></div>`;
      if (n) confetti(st);
      $('[data-nx]', body).onclick = () => { score.nextTurn(); ready(); };
    }
    ready();
  };

  /* ─── 미니 올림픽 / 챌린지 ─── */
  T.events = function (a, ctx) {
    const list = EVENTS[a.set], st = ctx.stage, olymp = a.set === 'olympic';
    const rec = Store.d('ev:' + a.n, {});
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    const nav = el('<div style="display:flex;flex-direction:column;gap:6px"></div>');
    list.forEach((e, k) => { const b = el(`<button class="btn flat" style="justify-content:flex-start;white-space:normal;text-align:left"><b style="color:var(--c);width:22px">${k + 1}</b>${esc(e[0])}</button>`); b.onclick = () => open(k); nav.appendChild(b); });
    const tb = el('<button class="btn dark">메달 표 보기</button>'); tb.onclick = board;
    ctx.opts.append(field('종목', nav), tb);
    const teams = () => Store.d('score:' + a.n, { n: 4, s: [0, 0, 0, 0, 0, 0] }).n;
    function open(k) {
      clearTimers(); const e = list[k];
      body.innerHTML = `<div class="center"><span class="lvl">종목 ${k + 1}</span><div class="qbig">${esc(e[0])}</div><p class="expl">${esc(e[1])}</p><div data-t></div><div class="ctrl" data-c></div><div data-rank></div></div>`;
      const c = $('[data-c]', body);
      if (olymp || e[2] === 'count') {
        const t = makeTimer({ sec: olymp ? e[2] : 30 }); $('[data-t]', body).appendChild(t.node);
        c.append(btn('시작', 'dark big', () => t.start()), btn('멈춤', 'big', () => t.stop()), btn('다시', 'big', () => t.reset()));
      } else {
        const sw = el('<div class="bigtime">0.0</div>'); $('[data-t]', body).appendChild(sw);
        let t0 = 0, iv = null, el2 = 0;
        c.append(btn('시작', 'dark big', () => { if (iv) return; t0 = performance.now() - el2; iv = setInterval(() => { el2 = performance.now() - t0; sw.textContent = (el2 / 1000).toFixed(1); }, 60); }), btn('멈춤', 'big', () => { clearInterval(iv); iv = null; }), btn('다시', 'big', () => { clearInterval(iv); iv = null; el2 = 0; sw.textContent = '0.0'; }));
      }
      const r = $('[data-rank]', body);
      r.innerHTML = `<div class="qcount" style="margin-bottom:8px">${olymp ? '순위를 눌러 메달을 주세요' : '모둠별 기록을 적어요 (숫자)'}</div>`;
      const row = el('<div class="ctrl"></div>');
      rec[k] = rec[k] || {};
      for (let i = 0; i < teams(); i++) {
        if (olymp) { const s = el(`<select class="field" style="width:auto;font-size:18px;background:${TEAMC[i]}"><option value="">${i + 1}모둠</option><option value="3">${i + 1}모둠 금</option><option value="2">${i + 1}모둠 은</option><option value="1">${i + 1}모둠 동</option></select>`); s.value = rec[k][i] || ''; s.onchange = () => { rec[k][i] = s.value; Store.save(); beep('pop'); }; row.appendChild(s); }
        else { const inp = el(`<input class="field" type="number" placeholder="${i + 1}모둠" style="width:120px;font-size:18px;background:${TEAMC[i]}">`); inp.value = rec[k][i] || ''; inp.onchange = () => { rec[k][i] = inp.value; Store.save(); }; row.appendChild(inp); }
      }
      r.appendChild(row);
    }
    function board() {
      clearTimers();
      const n = teams(), tot = Array(n).fill(0), med = Array.from({ length: n }, () => [0, 0, 0]);
      Object.values(rec).forEach(o => Object.entries(o).forEach(([i, v]) => { if (+i < n && v) { if (olymp) { tot[i] += +v; med[i][3 - v]++; } } }));
      if (olymp) {
        const order = tot.map((s, i) => [s, i]).sort((x, y) => y[0] - x[0]);
        body.innerHTML = `<div class="center"><div class="qbig">메달 표</div><table class="stable">${order.map(([s, i], r) => `<tr><td style="background:${TEAMC[i]}">${r + 1}위 &nbsp; ${i + 1}모둠</td><td>금 ${med[i][0]} &nbsp; 은 ${med[i][1]} &nbsp; 동 ${med[i][2]}</td><td style="font-size:26px;font-weight:700;width:120px;text-align:right">${s}점</td></tr>`).join('')}</table><button class="btn" data-clear>기록 지우기</button></div>`;
        if (order[0][0]) confetti(st);
      } else {
        body.innerHTML = `<div class="center"><div class="qbig">모둠 기록판</div><table class="stable">${list.map((e, k) => `<tr><td>${esc(e[0])}</td><td>${Array.from({ length: n }, (_, i) => `<span class="chip" style="background:${TEAMC[i]}">${i + 1}모둠 ${rec[k] && rec[k][i] ? esc(rec[k][i]) : '-'}</span>`).join('')}</td></tr>`).join('')}</table><button class="btn" data-clear>기록 지우기</button></div>`;
      }
      $('[data-clear]', body).onclick = () => { if (confirm('기록을 모두 지울까요?')) { Object.keys(rec).forEach(k => delete rec[k]); Store.save(); board(); } };
    }
    const sc = el(`<div class="scorebar"><span class="hint">모둠 수</span></div>`);
    const s2 = seg([[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']], teams(), v => { Store.d('score:' + a.n).n = v; Store.save(); });
    sc.appendChild(s2); st.appendChild(sc);
    open(0);
  };
  function btn(t, cls, fn) { const b = el(`<button class="btn ${cls}">${t}</button>`); b.onclick = fn; return b; }

  /* ─── 빙고 ─── */
  T.bingo = function (a, ctx) {
    const st = ctx.stage;
    let bgr = Store.d('bingo:grade', Math.min(6, Math.max(1, parseInt(Store.get().grade, 10) || 2)));
    const poolSrc = () => a.pool === 'concept' ? BINGO.byGrade[bgr] : BINGO[a.pool];
    const key = () => 'pool:' + a.n + (a.pool === 'concept' ? ':g' + bgr : '');
    const getPool = () => Store.d(key(), poolSrc().join('\n')).split('\n').map(s => s.trim()).filter(Boolean);
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    let size = a.mission ? 4 : 4;
    const t = ta(getPool().join('\n'), 8);
    const sv = el('<button class="btn">낱말 저장</button>'); sv.onclick = () => { Store.set(key(), t.value); toast('저장했어요'); a.mission ? mission() : caller(); };
    if (a.pool === 'concept') ctx.opts.append(field('학년', seg([1, 2, 3, 4, 5, 6].map(g => [g, g + '학년']), bgr, v => { bgr = v; Store.set('bingo:grade', v); t.value = getPool().join('\n'); caller(); })));
    ctx.opts.append(field('판 크기', seg([[3, '3×3'], [4, '4×4'], [5, '5×5']], size, v => { size = v; a.mission ? mission() : 0; })));
    ctx.opts.append(field(a.mission ? '미션 목록 (한 줄에 하나)' : '빙고 낱말 (한 줄에 하나)', t), sv);
    if (!a.mission) {
      let cnt = Math.max(roster().length, 24);
      const ni = el(`<input type="number" min="1" max="40" value="${cnt}">`); ni.onchange = () => cnt = +ni.value;
      ctx.opts.append(field('인쇄할 빙고판 수 (모두 다른 판)', ni));
      ctx.print(() => {
        const pool = getPool(), pages = [];
        for (let k = 0; k < cnt; k += 2) {
          const p = pageFrame(a, a.name, '빙고판마다 낱말 자리가 달라요. 한 줄이 완성되면 "빙고!"');
          for (let j = 0; j < 2 && k + j < cnt; j++) {
            const words = shuffle(pool).slice(0, size * size);
            p.insertAdjacentHTML('beforeend', `<div style="flex:1;display:flex;flex-direction:column;gap:6px"><div style="font-size:14px;color:#56627A;display:flex;justify-content:space-between"><span>판 ${k + j + 1}</span><span>이름 ________</span></div><div style="flex:1;display:grid;grid-template-columns:repeat(${size},1fr);border-top:2px solid #1F2B45;border-left:2px solid #1F2B45">${words.map(w => `<div style="border-right:2px solid #1F2B45;border-bottom:2px solid #1F2B45;display:grid;place-items:center;text-align:center;font-weight:700;font-size:${size === 5 ? 16 : 19}px;padding:4px;word-break:keep-all">${esc(w)}</div>`).join('')}</div></div>`);
          }
          pages.push(p);
        }
        printPages(pages);
      });
    }
    function caller() {
      const pool = shuffle(getPool()); const hist = [];
      body.innerHTML = `<div class="center"><div class="qcount">선생님이 하나씩 뽑아 불러 주세요</div><div class="drawn" data-w>뽑기를 눌러요</div><div class="ctrl"><button class="btn huge dark" data-d>뽑기</button><button class="btn big" data-r>처음부터</button></div><div class="history" data-h></div></div>`;
      $('[data-d]', body).onclick = () => {
        if (!pool.length) { $('[data-w]', body).textContent = '모두 뽑았어요'; return; }
        const w = pool.pop(); hist.push(w); const d = $('[data-w]', body);
        let k = 0; const all = getPool(); const iv = setInterval(() => { d.textContent = pickOne(all); if (++k > 8) { clearInterval(iv); d.textContent = w; beep('ok'); $('[data-h]', body).innerHTML = hist.map(x => `<span>${esc(x)}</span>`).join(''); } }, 55);
      };
      $('[data-r]', body).onclick = caller;
    }
    function mission() {
      const ms = shuffle(getPool()).slice(0, size * size); const owner = Array(size * size).fill(-1); let team = 0;
      const nT = Store.d('score:' + a.n, { n: 4, s: [0, 0, 0, 0, 0, 0] }).n;
      body.innerHTML = `<div class="center" style="flex-direction:row;gap:30px"><div class="bgrid" style="grid-template-columns:repeat(${size},1fr)"></div><div style="display:flex;flex-direction:column;gap:10px;min-width:180px"><div class="qcount">칸을 칠할 모둠</div><div data-teams style="display:flex;flex-direction:column;gap:8px"></div><button class="btn" data-new>새 판</button><p class="hint">잘못 칠한 칸은 다시 누르면 지워져요.</p></div></div>`;
      const g = $('.bgrid', body), tbox = $('[data-teams]', body);
      for (let i = 0; i < nT; i++) { const b = el(`<button class="btn big" style="background:${TEAMC[i]};border-color:${i === team ? '#1F2B45' : 'transparent'}">${i + 1}모둠</button>`); b.onclick = () => { team = i; $$('button', tbox).forEach((x, j) => x.style.borderColor = j === i ? '#1F2B45' : 'transparent'); }; tbox.appendChild(b); }
      ms.forEach((m, i) => { const c = el(`<button class="bcell">${esc(m)}</button>`); c.onclick = () => { owner[i] = owner[i] === team ? -1 : team; paint(); }; g.appendChild(c); });
      $('[data-new]', body).onclick = mission;
      function paint() {
        const cells = $$('.bcell', g);
        cells.forEach((c, i) => { c.classList.toggle('taken', owner[i] >= 0); c.classList.remove('line'); c.style.background = owner[i] >= 0 ? TEAMV[owner[i]] : ''; c.style.borderColor = owner[i] >= 0 ? TEAMV[owner[i]] : ''; });
        const L = []; for (let r = 0; r < size; r++) { L.push([...Array(size)].map((_, k) => r * size + k)); L.push([...Array(size)].map((_, k) => k * size + r)); }
        L.push([...Array(size)].map((_, k) => k * size + k)); L.push([...Array(size)].map((_, k) => k * size + size - 1 - k));
        L.forEach(l => { const o = owner[l[0]]; if (o >= 0 && l.every(x => owner[x] === o)) { l.forEach(x => cells[x].classList.add('line')); if (!paint.won) { paint.won = 1; beep('fan'); confetti(st); toast(`${o + 1}모둠 빙고!`); } } });
      }
    }
    a.mission ? mission() : caller();
  };

  /* ─── 함께 채우기 판 ─── */
  T.wall = function (a, ctx) {
    const st = ctx.stage, mode = a.mode, key = 'wall:' + a.n;
    const items = Store.d(key, []);
    const area = el('<div class="wallarea"></div>'); st.appendChild(area);
    const MON = ['3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '1월', '2월'];
    const MC = ['#E2456B', '#F2672A', '#D99A00', '#13A36E', '#2B78D6', '#7A52D9'];
    const inp = el(`<div class="wallinput">${mode === 'timeline' ? `<select class="field" style="width:100px">${MON.map(m => `<option>${m}</option>`).join('')}</select>` : ''}<input placeholder="${{ timeline: '이달에 있었던 일 (예: 운동회에서 줄다리기 우승)', tree: '친구에게 전하는 칭찬이나 고마운 말', wish: '2027년 나의 소망', mailbox: '칭찬하고 싶은 친구와 칭찬할 점', dict: '기억에 남는 따뜻한 말' }[mode]}">${mode !== 'timeline' ? '<input placeholder="누가 (안 써도 돼요)" style="flex:0 0 180px">' : ''}<button class="btn dark">넣기</button></div>`);
    st.appendChild(inp);
    inp.hidden = !Store.d('wallType:' + a.n, false);
    const [txt, who] = $$('input', inp), sel = $('select', inp);
    if (a.sheet) { const pb = el('<button class="btn dark">손으로 쓰는 종이 쪽지 인쇄</button>'); pb.onclick = () => printPages([buildSheet(a, a.sheet)]); ctx.opts.append(pb, el('<p class="hint">아이들은 종이 쪽지에 손으로 써서 교실 게시판에 붙여요. 완성한 게시판은 사진 한 장을 찍어 "작품 모음"에 올리면 끝이에요.</p>')); }
    { const gl = el('<a class="btn" href="#/gallery">완성한 게시판 사진 올리기</a>'); ctx.opts.append(gl); }
    const tg = el(`<button class="btn">${inp.hidden ? '(선택) 화면에 직접 적기' : '적기 칸 숨기기'}</button>`);
    tg.onclick = () => { inp.hidden = !inp.hidden; Store.set('wallType:' + a.n, !inp.hidden); tg.textContent = inp.hidden ? '(선택) 화면에 직접 적기' : '적기 칸 숨기기'; if (!inp.hidden) txt.focus(); };
    tg.className = 'btn flat'; tg.style.cssText = 'font-size:13px;color:var(--sub);margin-top:auto';
    setTimeout(() => ctx.opts.appendChild(tg), 0);
    const add = () => { if (!txt.value.trim()) return; items.push({ t: txt.value.trim(), w: who ? who.value.trim() : '', m: sel ? sel.value : '', r: 0, id: Date.now() }); Store.save(); txt.value = ''; if (who) who.value = ''; beep('pop'); draw(true); txt.focus(); };
    $('button', inp).onclick = add; txt.onkeydown = e => { if (e.key === 'Enter' && !e.isComposing) add(); };
    const del = i => { if (confirm(`"${items[i].t}" 을(를) 지울까요?`)) { items.splice(i, 1); Store.save(); draw(); } };
    const POS = [[50, 14], [36, 20], [64, 20], [24, 30], [50, 28], [76, 30], [14, 42], [36, 40], [62, 40], [86, 42], [26, 52], [48, 52], [72, 52], [10, 58], [90, 58], [38, 62], [60, 62], [20, 68], [80, 68], [50, 72]];
    function draw(isNew) {
      area.innerHTML = '';
      if (mode === 'tree' || mode === 'wish') {
        area.style.background = mode === 'tree' ? 'linear-gradient(#F3F7FB, #E6EEF6)' : 'linear-gradient(#FBF4EC, #F3E9F6)';
        area.insertAdjacentHTML('beforeend', `<img src="img/tree.png" alt="" style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:100%;max-width:100%;object-fit:contain;opacity:.95">`);
        const cols = mode === 'tree' ? ['#FFD6DF', '#D6F2DF', '#FFEBC2', '#D4E9FF', '#E9DEFF'] : ['#FFE0CF', '#FFD6DF', '#FFF0B8', '#E9DEFF', '#D6F2DF'];
        items.forEach((it, i) => {
          const p = POS[i % POS.length], jit = Math.floor(i / POS.length) * 3;
          const tg = el(`<div class="tag ${isNew && i === items.length - 1 ? 'new' : ''}" style="left:calc(${p[0] + jit}% - 75px);top:calc(${p[1] + jit}% + 24px);background:${cols[i % cols.length]};animation-delay:${-(i * .7)}s">${esc(it.t)}${it.w ? `<span class="who">${esc(it.w)}</span>` : ''}</div>`);
          tg.onclick = () => del(i); area.appendChild(tg);
        });
        if (!items.length) area.insertAdjacentHTML('beforeend', `<div class="center" style="position:absolute;inset:0;pointer-events:none"><div class="qbig" style="font-size:30px;background:rgba(255,255,255,.8);padding:10px 24px;border-radius:14px">종이 쪽지를 교실 나무에 붙여 함께 키워요</div></div>`);
      }
      if (mode === 'timeline') {
        const g = el('<div class="timeline"></div>');
        MON.forEach((m, k) => { const box = el(`<div class="tmon" style="--mc:${MC[k % 6]};--mt:${MC[k % 6]}1A"><h4>${m}</h4></div>`); items.forEach((it, i) => { if (it.m === m) { const d = el(`<div class="it" title="눌러서 지우기">${esc(it.t)}</div>`); d.onclick = () => del(i); box.appendChild(d); } }); g.appendChild(box); });
        area.appendChild(g);
      }
      if (mode === 'dict') {
        const g = el('<div class="dictlist"></div>');
        const sorted = items.map((it, i) => [it, i]).sort((x, y) => x[0].t.localeCompare(y[0].t, 'ko'));
        let last = '';
        sorted.forEach(([it, i]) => { const ch = choOf(it.t[0]); if (ch !== last) { g.insertAdjacentHTML('beforeend', `<div class="cho">${ch}</div>`); last = ch; } const d = el(`<div class="en"><b>"${esc(it.t)}"</b>${it.w ? `<span>${esc(it.w)}의 말</span>` : ''}</div>`); d.onclick = () => del(i); g.appendChild(d); });
        if (!items.length) g.innerHTML = '<div class="qbig" style="font-size:28px;column-span:all;padding-top:40px;text-align:center">아래 칸에 따뜻한 말을 적으면 가나다 순서로 정리돼요</div>';
        area.appendChild(g);
      }
      if (mode === 'mailbox') {
        const unread = items.filter(x => !x.r).length;
        const c = el(`<div class="center"><img class="mailbox" src="img/mailbox.png" alt="칭찬 우체통"><div class="qbig" style="font-size:34px">우체통에 칭찬 ${items.length}통 (안 읽은 쪽지 ${unread}통)</div><div class="ctrl"><button class="btn huge dark" data-o ${unread ? '' : 'disabled'}>하나 꺼내 읽기</button><button class="btn big" data-z>모두 안 읽음으로</button></div><div data-l></div></div>`);
        area.appendChild(c);
        $('[data-o]', c).onclick = () => { const u = items.filter(x => !x.r); const it = pickOne(u); it.r = 1; Store.save(); $('[data-l]', c).innerHTML = `<div class="letterpop">${esc(it.t)}${it.w ? `<small>보낸 사람: ${esc(it.w)}</small>` : '<small>이름 없는 칭찬 쪽지</small>'}</div>`; beep('fan'); $('.qbig', c).textContent = `우체통에 칭찬 ${items.length}통 (안 읽은 쪽지 ${items.filter(x => !x.r).length}통)`; $('[data-o]', c).disabled = !items.some(x => !x.r); };
        $('[data-z]', c).onclick = () => { items.forEach(x => x.r = 0); Store.save(); draw(); };
      }
    }
    draw();
    ctx.opts.append(el(`<p class="hint">적은 내용은 이 컴퓨터에 저장돼요. ${mode === 'mailbox' ? '' : '쪽지를 누르면 지울 수 있어요.'}</p>`));
    const clr = el('<button class="btn">모두 지우기</button>'); clr.onclick = () => { if (confirm('모두 지울까요? 되돌릴 수 없어요.')) { items.splice(0); Store.save(); draw(); } };
    ctx.opts.append(clr);
    ctx.print(() => {
      const p = pageFrame(a, a.name, '', { noName: true });
      if (mode === 'timeline') p.insertAdjacentHTML('beforeend', `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;flex:1">${MON.map((m, k) => `<div style="border:2px solid ${MC[k % 6]};border-radius:12px;padding:8px 12px"><b style="color:${MC[k % 6]};font-size:20px">${m}</b>${items.filter(x => x.m === m).map(x => `<div style="font-size:14.5px;line-height:1.4;margin-top:4px">${esc(x.t)}</div>`).join('')}</div>`).join('')}</div>`);
      else if (a.sheet && !items.length) { printPages([buildSheet(a, a.sheet)]); return; }
      else p.insertAdjacentHTML('beforeend', `<div style="columns:2;column-gap:28px;font-size:17px">${items.slice().sort((x, y) => mode === 'dict' ? x.t.localeCompare(y.t, 'ko') : 0).map(x => `<div style="break-inside:avoid;padding:8px 0;border-bottom:1.5px dashed #CDD5E1"><b>${esc(x.t)}</b>${x.w ? `<div style="font-size:14px;color:#56627A">${esc(x.w)}</div>` : ''}</div>`).join('')}</div>`);
      printPages([p]);
    });
  };

  /* ─── 비밀 응원 천사 ─── */
  T.angel = function (a, ctx) {
    const st = ctx.stage, names = roster();
    if (names.length < 3) return needRoster(st, '명단이 3명 이상 있어야 천사를 정할 수 있어요.');
    let m = Store.d('angel', null);
    const make = () => { let s; do { s = shuffle(names); } while (s.some((x, i) => x === names[i])); m = { map: Object.fromEntries(names.map((n, i) => [n, s[i]])), seen: {} }; Store.set('angel', m); };
    if (!m || Object.keys(m.map).length !== names.length || names.some(n => !m.map[n])) make();
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    function grid() {
      body.innerHTML = `<div class="center"><div class="qbig" style="font-size:30px">자기 이름을 눌러 몰래 확인해요</div><div class="namegrid">${names.map(n => `<button class="namecard ${m.seen[n] ? 'done' : ''}">${esc(n)}</button>`).join('')}</div></div>`;
      $$('.namecard', body).forEach((b, i) => b.onclick = () => reveal(names[i]));
    }
    function reveal(n) {
      body.innerHTML = `<div class="center"><div class="reveal"><div class="rs">${esc(n)}, 네가 몰래 응원할 친구는</div><div class="rn" data-x style="filter:blur(18px)">${esc(m.map[n])}</div></div><div class="ctrl"><button class="btn big" data-s>눌러서 보기</button><button class="btn big dark" data-h>확인했어요, 가리기</button></div><p class="expl">친구에게 들키지 않게 응원 쪽지를 몰래 전해요.</p></div>`;
      $('[data-s]', body).onclick = () => { $('[data-x]', body).style.filter = 'none'; beep('ok'); };
      $('[data-h]', body).onclick = () => { m.seen[n] = 1; Store.save(); grid(); };
    }
    grid();
    const r = el('<button class="btn">천사 새로 정하기</button>'); r.onclick = () => { if (confirm('천사를 새로 정할까요?')) { make(); grid(); } };
    ctx.opts.append(r, el('<p class="hint">인쇄하면 반으로 접는 비밀 쪽지가 나와요. 바깥에는 받는 사람 이름, 안쪽에 응원할 친구가 있어요.</p>'));
    ctx.print(() => {
      const pages = [];
      for (let k = 0; k < names.length; k += 8) {
        const p = pageFrame(a, a.name, '점선을 따라 오리고 반으로 접어서 나누어 주세요.', { noName: true });
        p.insertAdjacentHTML('beforeend', `<div class="cutgrid" style="grid-template-columns:1fr 1fr;grid-template-rows:repeat(4,1fr)">${names.slice(k, k + 8).map((n, j) => `<div style="flex-direction:row;padding:0">${j ? '' : ICON.scissor}<div style="flex:1;display:grid;place-items:center;border-right:1.5px dotted #9AA6B8;font-size:22px;font-weight:700">${esc(n)} 에게</div><div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:14px;color:#56627A">네가 몰래 응원할 친구<b style="font-size:24px;color:#1F2B45">${esc(m.map[n])}</b></div></div>`).join('')}</div>`);
        pages.push(p);
      }
      printPages(pages);
    });
  };

  /* ─── 대청소 역할 ─── */
  T.roles = function (a, ctx) {
    const st = ctx.stage, names = roster();
    const zt = ta(Store.d('zones', '칠판과 분필 받침\n창틀 닦기\n책상 줄 맞추기\n바닥 쓸기\n사물함 위 정리\n신발장 정리\n분리수거\n게시판 정리\n교구장 정리\n복도 앞 정리').trim(), 9);
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    let as = Store.d('roles', null);
    const zones = () => zt.value.split('\n').map(s => s.trim()).filter(Boolean);
    function assign() { const z = zones(), s = shuffle(names.length ? names : []); as = { z, m: z.map(() => []), done: [] }; s.forEach((n, i) => as.m[i % z.length].push(n)); Store.set('roles', as); draw(); beep('fan'); }
    function draw() {
      if (!as) { body.innerHTML = `<div class="center"><div class="qbig">청소 구역 ${zones().length}곳</div><p class="expl">${names.length ? `${names.length}명을 구역마다 고르게 나눠요.` : '명단이 없으면 구역 목록만 보여요. 명단을 넣으면 이름이 자동으로 배정돼요.'}</p><button class="btn huge dark" data-g>역할 뽑기</button></div>`; $('[data-g]', body).onclick = assign; return; }
      const d = as.done.filter(Boolean).length;
      body.innerHTML = `<div class="center" style="justify-content:flex-start;overflow:auto"><div class="qbig" style="font-size:30px">끝난 구역 ${d} / ${as.z.length}</div><table class="stable">${as.z.map((z, i) => `<tr class="${as.done[i] ? 'done' : ''}" data-i="${i}" style="cursor:pointer"><td>${esc(z)}</td><td>${as.m[i].map(n => `<span class="chip">${esc(n)}</span>`).join('') || '<span class="hint">누구나</span>'}</td></tr>`).join('')}</table><button class="btn" data-g>다시 뽑기</button></div>`;
      $$('tr', body).forEach(tr => tr.onclick = () => { const i = +tr.dataset.i; as.done[i] = !as.done[i]; Store.save(); if (as.done.filter(Boolean).length === as.z.length) { confetti(st); beep('fan'); } draw(); });
      $('[data-g]', body).onclick = assign;
    }
    const sv = el('<button class="btn">구역 저장</button>'); sv.onclick = () => { Store.set('zones', zt.value); as = null; draw(); };
    ctx.opts.append(field('청소 구역 (한 줄에 하나)', zt), sv);
    ctx.print(() => { if (!as) return toast('먼저 역할을 뽑아 주세요'); const p = pageFrame(a, '우리 반 대청소 역할표', '끝난 구역은 칸에 동그라미를 해요.', { noName: true }); p.insertAdjacentHTML('beforeend', `<table class="pt">${as.z.map((z, i) => `<tr style="height:70px"><td class="lab" style="width:30%">${esc(z)}</td><td style="font-size:19px">${as.m[i].map(esc).join(', ')}</td><td style="width:12%"></td></tr>`).join('')}</table>`); printPages([p]); });
    draw();
  };

  /* ─── 장기자랑 순서 ─── */
  T.lineup = function (a, ctx) {
    const st = ctx.stage;
    const t = ta(Store.d('lineup', roster().slice(0, 8).map(n => n + ' | ').join('\n') || '이름 | 종목'), 9);
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    let ord = Store.d('lineupOrd', null), cur = 0, min = 3;
    const parse = () => t.value.split('\n').map(l => l.split('|').map(s => s.trim())).filter(r => r[0] && r[0] !== '이름');
    function order() {
      const L = parse(); if (!L.length) return toast('참가자를 적어 주세요');
      let k = 0; const iv = setInterval(() => { body.innerHTML = `<div class="center"><div class="drawn">${esc(pickOne(L)[0])}</div></div>`; if (++k > 14) { clearInterval(iv); ord = shuffle(L); Store.set('lineupOrd', ord); cur = 0; beep('fan'); stagev(); } }, 70);
    }
    function stagev() {
      clearTimers();
      if (!ord) { body.innerHTML = `<div class="center"><div class="qbig">우리 반 장기자랑</div><p class="expl">참가자와 종목을 적고 순서를 정해요.</p><button class="btn huge dark" data-o>순서 정하기</button></div>`; $('[data-o]', body).onclick = order; return; }
      if (cur >= ord.length) { body.innerHTML = `<div class="center"><div class="qbig">모두 정말 멋졌어요!</div><p class="expl">다 함께 큰 박수!</p><button class="btn big" data-o>순서 다시 정하기</button></div>`; confetti(st); beep('fan'); $('[data-o]', body).onclick = order; return; }
      const [n, g] = ord[cur];
      body.innerHTML = `<div class="center"><div class="qcount">${cur + 1}번째 무대</div><div class="drawn">${esc(n)}</div><div class="qbig" style="font-size:34px;color:var(--sub)">${esc(g || '')}</div><div data-t></div><div class="ctrl"><button class="btn big" data-s>시간 재기</button><button class="btn big dark" data-n>박수! 다음 무대 ${ICON.next}</button></div><div class="history">${ord.map((x, i) => `<span style="${i === cur ? 'background:var(--t);border-color:var(--c);font-weight:700' : i < cur ? 'opacity:.4' : ''}">${i + 1}. ${esc(x[0])}</span>`).join('')}</div></div>`;
      const tm = makeTimer({ sec: min * 60 }); $('[data-t]', body).appendChild(tm.node);
      $('[data-s]', body).onclick = () => tm.start();
      $('[data-n]', body).onclick = () => { beep('fan'); cur++; stagev(); };
    }
    const sv = el('<button class="btn dark">저장하고 순서 정하기</button>'); sv.onclick = () => { Store.set('lineup', t.value); order(); };
    ctx.opts.append(field('참가자 | 종목 (한 줄에 한 명)', t), sv, field('한 무대 시간', seg([[2, '2분'], [3, '3분'], [5, '5분']], 3, v => min = v)));
    stagev();
  };

  /* ─── 보물찾기 ─── */
  T.treasure = function (a, ctx) {
    const def = '칠판 지우개 받침 | 하얀 글씨를 지우는 친구가 쉬는 곳\n책꽂이 | 이야기 친구들이 줄 서 있는 곳\n선생님 책상 | 우리 반 대장님의 자리\n창문 틀 | 햇살이 처음 들어오는 곳\n사물함 위 | 우리 물건 집의 지붕\n쓰레기통 옆 | 버릴 것들이 모이는 곳의 이웃\n화분 아래 | 초록 친구가 물을 마시는 곳\n시계 아래 | 째깍째깍 소리 아래';
    const t = ta(Store.d('treasure', def), 9), st = ctx.stage;
    const parse = () => t.value.split('\n').map(l => l.split('|').map(s => s.trim())).filter(r => r[0]);
    function draw() {
      const L = parse();
      st.innerHTML = `<div class="center" style="justify-content:flex-start;overflow:auto"><div class="qbig" style="font-size:30px">선생님만 보는 숨길 곳 목록</div><table class="stable">${L.map((r, i) => `<tr><td>쪽지 ${i + 1}을 숨길 곳: ${i === 0 ? '선생님이 첫 쪽지로 나눠 줘요' : esc(L[i - 1][0])}</td><td>쪽지 내용: "${esc(r[1] || r[0])}"</td></tr>`).join('')}<tr><td>마지막 보물 (${esc(L.length ? L[L.length - 1][0] : '')})</td><td>"보물을 찾았어요! 선생님께 가져가요."</td></tr></table><p class="expl">모둠 수만큼 색이 다른 종이에 인쇄하면 모둠별 경주가 돼요.</p></div>`;
    }
    const sv = el('<button class="btn">저장</button>'); sv.onclick = () => { Store.set('treasure', t.value); draw(); };
    ctx.opts.append(field('숨길 곳 | 힌트 (차례대로)', t), sv);
    ctx.print(() => {
      const L = parse(); const cards = L.map((r, i) => ({ n: i + 1, h: r[1] || r[0] })); cards.push({ n: L.length + 1, h: '보물을 찾았어요! 이 쪽지를 선생님께 가져가요.', last: 1 });
      const pages = [];
      for (let k = 0; k < cards.length; k += 6) {
        const p = pageFrame(a, a.name, '오려서 차례대로 숨겨요. 쪽지 번호를 확인하세요.', { noName: true });
        p.insertAdjacentHTML('beforeend', `<div class="cutgrid" style="grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr)">${cards.slice(k, k + 6).map((c, j) => `<div style="align-items:center;justify-content:center;text-align:center">${j ? '' : ICON.scissor}<span class="ct">보물 쪽지 ${c.n}</span><div style="font-size:${c.last ? 26 : 24}px;font-weight:700;word-break:keep-all;line-height:1.35">${c.last ? '' : '다음 쪽지는<br>'}${esc(c.h)}</div></div>`).join('')}</div>`);
        pages.push(p);
      }
      printPages(pages);
    });
    draw();
  };

  /* ─── 상장 ─── */
  function certPage(a, name, award, phrase) {
    const m = Store.get();
    const p = el(`<div class="page" style="${catVars(catOf(a))};padding:38px;justify-content:center;align-items:center"></div>`);
    p.innerHTML = `<div style="position:absolute;inset:30px;border:10px double #C9A227;border-radius:4px"></div><div style="position:absolute;inset:52px;border:1.5px solid #C9A227"></div>
      <svg viewBox="0 0 120 120" style="position:absolute;top:70px;right:80px;width:120px;height:120px"><circle cx="60" cy="54" r="40" fill="#FFE08A" stroke="#C9A227" stroke-width="4"/><circle cx="60" cy="54" r="30" fill="none" stroke="#C9A227" stroke-width="2" stroke-dasharray="3 4"/><path d="M38 86l-10 30 18-8 8 14 10-30M82 86l10 30-18-8-8 14-10-30" fill="#E2456B"/><text x="60" y="62" text-anchor="middle" font-family="Miso" font-weight="700" font-size="22" fill="#A07800">2026</text></svg>
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:26px;width:560px;text-align:center">
        <div style="font-family:Sangjang,Miso;font-size:96px;letter-spacing:40px;margin-right:-40px;color:#1F2B45">상장</div>
        <div style="font-size:38px;font-weight:700;color:#A07800" contenteditable="true">${esc(award)}</div>
        <div style="font-size:26px;align-self:flex-end;margin-right:30px">${esc(className())} &nbsp; 이름 <b style="font-size:32px" contenteditable="true">${esc(name || '              ')}</b></div>
        <div style="font-size:25px;line-height:1.9;word-break:keep-all;text-align:left" contenteditable="true">위 어린이는 ${esc(phrase)} 이 상장을 주어 칭찬합니다.</div>
        <div style="font-size:22px;margin-top:20px">2026년 12월 &nbsp;&nbsp; 일</div>
        <div style="font-size:28px;font-weight:700" contenteditable="true">${esc(m.school || '○○초등학교')} ${esc(className())} 담임 ${esc(m.teacher || '○○○')}</div></div>`;
    return p;
  }
  window.certAssign = function () {
    const names = roster(); const as = Store.d('cert:assign', {});
    const used = new Set(Object.values(as).map(x => x[0]));
    names.forEach(n => { if (!as[n]) { const free = AWARDS.filter(x => !used.has(x[0])); const pick = pickOne(free.length ? free : AWARDS); as[n] = [pick[0], pick[1]]; used.add(pick[0]); } });
    Store.save(); return as;
  };
  T.cert = function (a, ctx) {
    const st = ctx.stage;
    if (a.mode === 'blank') {
      const pages = () => [certPage(a, '', '__________ 상', '__________________________________ 하였기에')];
      showPaper(st, pages());
      ctx.opts.append(el(`<div class="hint">상 이름 아이디어<br>${AWARDS.slice(0, 16).map(x => `<span class="chip">${x[0]}</span>`).join('')}</div>`));
      ctx.print(() => { const n = Math.max(roster().length, 1); printPages(Array.from({ length: n }, pages).flat()); });
      ctx.opts.append(el('<p class="hint">인쇄하면 우리 반 인원 수만큼 빈 상장이 나와요.</p>'));
      return;
    }
    const names = roster();
    if (!names.length) return needRoster(st);
    const as = certAssign();
    const list = el('<div style="display:flex;flex-direction:column;gap:6px"></div>');
    let curName = names[0];
    names.forEach(n => {
      const s = el(`<select class="field">${AWARDS.map(x => `<option ${x[0] === as[n][0] ? 'selected' : ''}>${x[0]}</option>`).join('')}</select>`);
      s.onchange = () => { const f = AWARDS.find(x => x[0] === s.value); as[n] = [f[0], f[1]]; Store.save(); curName = n; prev(); };
      s.onfocus = () => { curName = n; prev(); };
      const r = el(`<label class="f"><b style="color:var(--ink)">${esc(n)}</b></label>`); r.appendChild(s); list.appendChild(r);
    });
    const rr = el('<button class="btn">상을 새로 섞기</button>'); rr.onclick = () => { Store.set('cert:assign', {}); ctx.reload(); };
    ctx.opts.append(rr, field('아이마다 상 고르기', list));
    const prev = () => showPaper(st, [certPage(a, curName, as[curName][0], as[curName][1])]);
    prev();
    ctx.print(() => printPages(names.map(n => certPage(a, n, as[n][0], as[n][1]))));
  };

  /* ─── 미니 시상식 ─── */
  T.ceremony = function (a, ctx) {
    const st = ctx.stage, names = roster();
    if (!names.length) return needRoster(st);
    const as = certAssign(); let order = shuffle(names), i = -1;
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    function idle() { body.innerHTML = `<div class="center"><div class="qbig">2026 우리 반 시상식</div><p class="expl">모두가 주인공이에요. 이름이 불리면 앞으로 나와요.</p><button class="btn huge dark" data-n>첫 번째 수상자</button></div>`; $('[data-n]', body).onclick = next; }
    function next() {
      i++; if (i >= order.length) { body.innerHTML = `<div class="center"><div class="qbig">모두 축하해요!</div><p class="expl">${order.length}명 모두 상을 받았어요.</p><button class="btn big" data-r>처음부터</button></div>`; confetti(st); beep('fan'); $('[data-r]', body).onclick = () => { i = -1; order = shuffle(names); idle(); }; return; }
      const n = order[i];
      body.innerHTML = `<div class="center"><div class="qcount">${i + 1} / ${order.length}</div><div class="awardcard spin"><div class="aw">${esc(as[n][0])}</div><div class="an">두구두구</div><div class="ap">위 어린이는 ${esc(as[n][1])} 이 상장을 주어 칭찬합니다.</div></div><button class="btn huge dark" data-n disabled>다음 수상자 ${ICON.next}</button></div>`;
      const an = $('.an', body); let k = 0;
      const iv = setInterval(() => { an.textContent = pickOne(names); beep('tick'); if (++k > 16) { clearInterval(iv); an.textContent = n; $('.awardcard', body).classList.remove('spin'); confetti(st); beep('fan'); $('[data-n]', body).disabled = false; } }, 90);
      $('[data-n]', body).onclick = next;
    }
    ctx.opts.append(el('<p class="hint">상 이름은 "학기말 상장"에서 고른 것이 그대로 나와요.</p>'));
    const go = el('<button class="btn">학기말 상장으로 가기</button>'); go.onclick = () => location.hash = '#/a/23'; ctx.opts.append(go);
    idle();
  };

  /* ─── 학급 어워즈 ─── */
  T.vote = function (a, ctx) {
    const st = ctx.stage;
    const data = Store.d('vote', [['올해의 명장면', '운동회 이어달리기\n현장체험학습\n학예회 무대'], ['올해의 유행어', ''], ['올해의 급식 메뉴', '떡볶이\n돈가스\n짜장면\n치킨'], ['올해의 사건', ''], ['올해의 놀이', '얼음땡\n공기놀이\n피구']].map(([t, n]) => ({ t, n, v: {} })));
    let ci = 0;
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    const tabs = el('<div class="seg"></div>');
    const nt = ta('', 6); const sv = el('<button class="btn dark">후보 저장</button>');
    const cname = el('<input type="text">');
    function opts() { tabs.innerHTML = ''; data.forEach((d, k) => { const b = el(`<button class="${k === ci ? 'on' : ''}">${esc(d.t)}</button>`); b.onclick = () => { ci = k; opts(); draw(); }; tabs.appendChild(b); }); nt.value = data[ci].n; cname.value = data[ci].t; }
    sv.onclick = () => { data[ci].n = nt.value; data[ci].t = cname.value || data[ci].t; Store.save(); opts(); draw(); };
    ctx.opts.append(field('부문', tabs), field('부문 이름', cname), field('후보 (한 줄에 하나)', nt), sv);
    function draw(result) {
      const d = data[ci], cs = d.n.split('\n').map(s => s.trim()).filter(Boolean);
      if (!cs.length) { body.innerHTML = `<div class="center"><div class="qbig">${esc(d.t)}</div><p class="expl">왼쪽에 후보를 적어 주세요. 아이들과 함께 후보를 정해도 좋아요.</p></div>`; return; }
      const mx = Math.max(1, ...cs.map(x => d.v[x] || 0));
      const win = result ? Math.max(...cs.map(x => d.v[x] || 0)) : -1;
      body.innerHTML = `<div class="center"><div class="qbig">${esc(d.t)}</div><div class="votebars">${cs.map(x => `<div class="vb ${result && (d.v[x] || 0) === win && win > 0 ? 'win' : ''}"><div class="vn">${esc(x)}</div><div class="vt"><b style="width:${result ? (d.v[x] || 0) / mx * 100 : 0}%"></b></div><div class="vc">${result ? d.v[x] || 0 : d.v[x] || 0}</div><div class="seg"><button data-m="${esc(x)}">−</button><button data-p="${esc(x)}">+1</button></div></div>`).join('')}</div><div class="ctrl"><button class="btn huge dark" data-r>결과 보기</button><button class="btn big" data-z>표 다시</button></div></div>`;
      $$('[data-p]', body).forEach(b => b.onclick = () => { d.v[b.dataset.p] = (d.v[b.dataset.p] || 0) + 1; Store.save(); beep('pop'); draw(); });
      $$('[data-m]', body).forEach(b => b.onclick = () => { d.v[b.dataset.m] = Math.max(0, (d.v[b.dataset.m] || 0) - 1); Store.save(); draw(); });
      $('[data-r]', body).onclick = () => { draw(true); requestAnimationFrame(() => {}); beep('fan'); setTimeout(() => confetti(st), 700); };
      $('[data-z]', body).onclick = () => { d.v = {}; Store.save(); draw(); };
      if (!result) { $$('.vt b', body).forEach((b, k) => b.style.width = ((d.v[cs[k]] || 0) / mx * 100) + '%'); }
      else { $$('.vt b', body).forEach(b => { const w = b.style.width; b.style.width = '0'; requestAnimationFrame(() => requestAnimationFrame(() => b.style.width = w)); }); }
    }
    opts(); draw();
  };

  /* ─── 방탈출 ─── */
  T.escape = function (a, ctx) {
    const st = ctx.stage; let mins = 15;
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    const WORDS = [['겨울방학', '학교에 안 가고 쉬는 겨울의 긴 날들'], ['눈사람', '눈을 굴려 만든 하얀 사람'], ['크리스마스', '12월 25일'], ['붕어빵', '물고기 모양 겨울 간식'], ['목도리', '목을 감싸는 따뜻한 것']];
    const MIR = ['눈꽃', '장갑', '썰매', '호빵', '세배', '떡국'];
    const PIECES = shuffle([['즐', '거', '운', '방', '학'], ['신', '나', '는', '방', '학'], ['행', '복', '한', '새', '해']])[0];
    let rooms, cur, timer, hints;
    function gen() {
      const s = [rint(1, 3), rint(1, 2)], p1 = [s[0], s[0] + s[1], s[0] + 2 * s[1]], d1 = s[0] + 3 * s[1];
      const s2 = rint(12, 18), p2 = [s2, s2 - 2, s2 - 4], d2 = (s2 - 6) % 10;
      const b3 = rint(9, 12), p3 = [b3, b3 - 1, b3 - 2], d3 = b3 - 3;
      const w = pickOne(WORDS), mi = pickOne(MIR);
      const hrs = [rint(1, 9), rint(1, 9), rint(1, 9)];
      rooms = [
        { t: '규칙의 방', q: `빈칸에 들어갈 수를 차례로 자물쇠에 돌려요.<br><b style="font-size:1.25em">${p1.join(', ')}, ㉠ &nbsp; / &nbsp; ${p2.join(', ')}, ㉡의 일의 자리 &nbsp; / &nbsp; ${p3.join(', ')}, ㉢</b>`, code: [d1 % 10, d2, d3], hint: '앞의 수에서 얼마씩 커지거나 작아지는지 보세요.' },
        { t: '초성의 방', q: `초성을 보고 글자 조각을 차례로 눌러요.<br><b class="qhuge" style="font-size:1.8em">${chosung(w[0])}</b><br><span style="font-size:.8em;color:var(--sub)">${w[1]}</span>`, word: w[0], hint: `첫 글자는 "${w[0][0]}" 이에요.` },
        { t: '시계의 방', q: '세 시계가 가리키는 "시"를 차례로 돌려요.', clocks: hrs, code: hrs, hint: '짧은바늘이 가리키는 숫자를 보세요.' },
        { t: '거울의 방', q: `거울에 비친 글자예요. 바르게 읽고 글자 조각을 눌러요.<br><span class="mirror qhuge" style="font-size:1.8em">${mi}</span>`, word: mi, hint: '종이에 따라 써서 뒤집어 보세요.' },
        { t: '마지막 문', q: '모은 글자 조각을 바른 순서로 눌러요.', word: PIECES.join(''), final: 1, hint: `첫 글자는 "${PIECES[0]}" 이에요.` }
      ];
      cur = 0; hints = 0;
    }
    function intro() {
      clearTimers(); gen();
      body.innerHTML = `<div class="center"><div class="qbig">겨울방학 열쇠를 찾아라!</div><p class="expl">교실 문이 잠겼어요. 다섯 개의 방 문제를 풀고 글자 조각을 모아 마지막 문을 열어요. 힌트를 쓰면 1분이 줄어요.</p><button class="btn huge dark" data-s>탈출 시작 (${mins}분)</button></div>`;
      $('[data-s]', body).onclick = () => { timer = makeTimer({ sec: mins * 60, onEnd: fail }); room(); timer.start(); };
    }
    function room() {
      const r = rooms[cur];
      body.innerHTML = `<div class="center" style="gap:16px"><div style="display:flex;gap:24px;align-items:center"><div class="rooms">${rooms.map((x, i) => `<div class="roomdot ${i < cur ? 'open' : i === cur ? 'now' : ''}">${i + 1}</div>`).join('')}</div><div data-t></div></div><div class="pieces">${PIECES.map((p, i) => `<div class="piece ${i < cur ? 'got' : ''}">${i < cur ? p : ''}</div>`).join('')}</div><span class="lvl">${cur + 1}번 방 · ${r.t}</span><div class="qbig" style="font-size:clamp(24px,2.8vw,40px)">${r.q}</div>${r.clocks ? `<div style="display:flex;gap:20px">${r.clocks.map(h => clockSVG(h, 0)).join('')}</div>` : ''}<div data-lock></div><div class="ctrl"><button class="btn big dark" data-o>열기</button><button class="btn big" data-h>힌트 (−1분)</button></div><div class="expl" data-msg></div></div>`;
      $('[data-t]', body).appendChild(timer.node);
      if (r.final) $('.pieces', body).innerHTML = shuffle(PIECES).map(p => `<div class="piece got">${p}</div>`).join('');
      const lock = $('[data-lock]', body); let get;
      if (r.code) {
        const v = [0, 0, 0]; const ds = el('<div class="dials"></div>');
        v.forEach((_, k) => { const d = el(`<div class="dial"><button aria-label="올리기">${ICON.up}</button><div class="dv">0</div><button aria-label="내리기">${ICON.down}</button></div>`); const [u, dn] = $$('button', d); const set = x => { v[k] = (x + 10) % 10; $('.dv', d).textContent = v[k]; d.classList.remove('roll'); void d.offsetWidth; d.classList.add('roll'); beep('tick'); }; u.onclick = () => set(v[k] + 1); dn.onclick = () => set(v[k] - 1); ds.appendChild(d); });
        lock.appendChild(ds); get = () => v.join('') === r.code.join('');
      } else {
        const POOL = '눈사람겨울방학썰매장갑호빵세배떡국목도리크리스마스붕어빵즐거운신나는행복한새해꽃';
        const need = Array.from(r.word);
        const extra = shuffle(Array.from(new Set(Array.from(POOL))).filter(c => !need.includes(c))).slice(0, Math.max(3, 8 - need.length));
        const tiles = r.final ? shuffle(need) : shuffle(need.concat(extra));
        let typed = [];
        const w = el(`<div style="display:flex;flex-direction:column;align-items:center;gap:14px"><div class="wordlock" data-shown style="min-height:72px">&nbsp;</div><div class="pieces" data-tiles style="flex-wrap:wrap;justify-content:center;max-width:760px"></div><button class="btn big" data-back>한 글자 지우기</button></div>`);
        const shown = $('[data-shown]', w), tb = $('[data-tiles]', w);
        const paint = () => { shown.textContent = typed.map(k => tiles[k]).join('') || ' '; $$('button', tb).forEach((b, k) => b.disabled = typed.includes(k)); };
        tiles.forEach((ch, k) => { const b = el(`<button class="piece got" style="cursor:pointer">${esc(ch)}</button>`); b.onclick = () => { if (typed.length < need.length) { typed.push(k); beep('tick'); paint(); } }; tb.appendChild(b); });
        $('[data-back]', w).onclick = () => { typed.pop(); paint(); };
        lock.appendChild(w); paint();
        get = () => typed.map(k => tiles[k]).join('') === r.word;
      }
      $('[data-o]', body).onclick = () => {
        if (get()) { beep('fan'); cur++; if (cur >= rooms.length) return win(); confetti(st); $('[data-msg]', body).textContent = `문이 열렸어요! 글자 조각 "${PIECES[cur - 1]}"을(를) 얻었어요.`; setTimeout(room, 1300); }
        else { beep('no'); $('[data-msg]', body).textContent = '아직 안 열려요. 다시 생각해 봐요.'; lock.animate([{ transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'none' }], 300); }
      };
      $('[data-h]', body).onclick = () => { $('[data-msg]', body).textContent = '힌트: ' + r.hint; hints++; const left = timer.left(); timer.stop(); const nt = makeTimer({ sec: Math.max(5, left - 60), onEnd: fail }); timer = nt; $('[data-t]', body).innerHTML = ''; $('[data-t]', body).appendChild(nt.node); nt.start(); };
    }
    function win() { const left = timer.left(); timer.stop(); body.innerHTML = `<div class="center"><div class="qhuge" style="font-size:clamp(60px,9vw,130px)">${PIECES.join('')}!</div><div class="qbig">탈출 성공!</div><p class="expl">남은 시간 ${Math.floor(left / 60)}분 ${left % 60}초, 힌트 ${hints}번 사용</p><button class="btn big dark" data-a>새 문제로 다시</button></div>`; confetti(st); setTimeout(() => confetti(st), 600); $('[data-a]', body).onclick = intro; }
    function fail() { body.innerHTML = `<div class="center"><div class="qbig">시간이 다 됐어요</div><p class="expl">${cur}개의 방을 열었어요. 다시 도전해 볼까요?</p><button class="btn big dark" data-a>새 문제로 다시</button></div>`; $('[data-a]', body).onclick = intro; }
    ctx.opts.append(field('제한 시간', seg([[10, '10분'], [15, '15분'], [20, '20분']], 15, v => { mins = v; intro(); })), el('<p class="hint">시작할 때마다 문제의 수, 낱말, 시계, 글자 조각이 새로 바뀌어요.</p>'));
    intro();
  };

  /* ─── 그림 퀴즈 ─── */
  T.zoom = function (a, ctx) {
    const st = ctx.stage, words = ['눈사람', '목도리', '썰매', '붕어빵', '고드름', '크리스마스', '스케이트', '떡국', '세뱃돈', '해돋이', '군고구마', '털장갑', '눈싸움', '연날리기', '겨울방학'];
    let items = shuffle(words).map(w => ({ w })), i = 0, step = 0, mode = 'zoom';
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    const STEPS = 5;
    function show() {
      const it = items[i]; step = 0;
      body.innerHTML = `<div class="center"><div class="qcount">${i + 1} / ${items.length} &nbsp; 지금 맞히면 <b data-pt style="color:var(--c)">${STEPS}점</b></div><div class="zoombox">${mode === 'zoom' || it.w ? `<div class="zin">${it.src ? `<img src="${it.src}" alt="">` : `<div class="zw">${esc(it.w)}</div>`}</div>` : '<canvas></canvas>'}</div><div class="ans hide">${esc(it.name || it.w || '')}</div><div class="ctrl"><button class="btn big dark" data-m>조금 더 보기</button><button class="btn big" data-r>정답 보기</button><button class="btn big" data-n>다음 ${ICON.next}</button></div></div>`;
      const ox = rint(15, 85), oy = rint(20, 80);
      const zin = $('.zin', body), cv = $('canvas', body);
      let img;
      const render = () => {
        const k = 1 - step / STEPS;
        if (zin) { zin.style.transformOrigin = `${ox}% ${oy}%`; zin.style.transform = `scale(${1 + k * (it.src ? 7 : 5)})`; if (it.src && mode === 'shadow') $('img', zin).style.filter = step < STEPS ? `brightness(0) opacity(${.9 - step * .1})` : 'none'; }
        if (cv && img) { const w = cv.width = cv.clientWidth, h = cv.height = cv.clientHeight, g = cv.getContext('2d'); const px = Math.max(1, Math.round(64 * k * k)); const sw = Math.max(1, Math.ceil(w / px)), sh = Math.max(1, Math.ceil(h / px)); const t = document.createElement('canvas'); t.width = sw; t.height = sh; const r = Math.min(sw / img.width, sh / img.height); t.getContext('2d').drawImage(img, (sw - img.width * r) / 2, (sh - img.height * r) / 2, img.width * r, img.height * r); g.imageSmoothingEnabled = false; g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(t, 0, 0, w, h); }
        $('[data-pt]', body).textContent = Math.max(1, STEPS - step) + '점';
      };
      if (cv) { img = new Image(); img.onload = render; img.src = it.src; }
      if (mode === 'shadow' && it.src && zin) zin.style.transform = 'none';
      render();
      $('[data-m]', body).onclick = () => { step = Math.min(STEPS, step + 1); render(); beep('pop'); };
      $('[data-r]', body).onclick = () => { step = STEPS; render(); $('.ans', body).classList.remove('hide'); beep('ok'); };
      $('[data-n]', body).onclick = () => { i = (i + 1) % items.length; show(); };
    }
    const fi = el('<input type="file" accept="image/*" multiple>');
    fi.onchange = () => { const fs = Array.from(fi.files); if (!fs.length) return; items = shuffle(fs.map(f => ({ src: URL.createObjectURL(f), name: f.name.replace(/\.[^.]+$/, '') }))); i = 0; show(); toast(`사진 ${fs.length}장을 넣었어요`); };
    ctx.opts.append(field('보는 방법 (사진일 때)', seg([['zoom', '확대'], ['shadow', '실루엣'], ['mosaic', '모자이크']], 'zoom', v => { mode = v; show(); })));
    ctx.opts.append(field('사진 넣기 (여러 장 가능)', fi), el('<p class="hint">사진 파일 이름이 정답으로 나와요. (예: 펭귄.jpg) 사진이 없으면 겨울 낱말을 크게 확대해서 맞혀요.</p>'));
    const back = el('<button class="btn">기본 낱말로 돌아가기</button>'); back.onclick = () => { items = shuffle(words).map(w => ({ w })); i = 0; mode = 'zoom'; show(); };
    ctx.opts.append(back);
    show();
  };

  /* ─── 2027 달력 ─── */
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  function monthCells(m) { const first = new Date(2027, m - 1, 1).getDay(), days = new Date(2027, m, 0).getDate(); const c = []; for (let k = 0; k < first; k++) c.push(0); for (let d = 1; d <= days; d++) c.push(d); while (c.length % 7) c.push(0); return c; }
  function calPage(a, m) {
    const c = monthCells(m);
    const p = el(`<div class="page" data-act="${a.n}" style="${catVars(catOf(a))}"></div>`);
    p.innerHTML = `<div class="box" style="height:330px"><span class="bl">${m}월의 그림</span></div>
      <div style="display:flex;align-items:flex-end;gap:16px"><b style="font-size:76px;line-height:.9;color:var(--c)">${m}</b><div style="font-size:24px;font-weight:700;padding-bottom:6px">월 &nbsp;<span style="font-size:18px;color:#56627A;font-weight:400">2027</span></div><div style="margin-left:auto;display:flex;align-items:flex-end;gap:10px"><div style="text-align:right;padding-bottom:6px"><div style="font-size:19px;font-weight:700;color:#D2302C">2027 정미년, 붉은 양의 해</div>${m <= 2 ? '<div style="font-size:12px;color:#8A95A8">음력 설날(2월 7일)부터 정미년이 시작돼요</div>' : ''}<div style="font-size:15px;color:#56627A;margin-top:4px">이름 __________</div></div><img src="img/sheep.png" alt="" style="height:96px"></div></div>
      <table style="width:100%;border-collapse:collapse;table-layout:fixed;flex:1"><tr>${DOW.map((d, k) => `<th style="padding:6px;font-size:16px;border-bottom:2.5px solid #1F2B45;color:${k === 0 ? '#C9305A' : k === 6 ? '#2366C2' : '#1F2B45'}">${d}</th>`).join('')}</tr>
      ${Array.from({ length: c.length / 7 }, (_, r) => `<tr>${c.slice(r * 7, r * 7 + 7).map((d, k) => { const hn = d && HOLI2027[m + '-' + d]; return `<td style="border:1.5px solid #CDD5E1;vertical-align:top;padding:5px 7px;height:${c.length > 35 ? 74 : 88}px">${d ? `<div style="font-size:20px;font-weight:700;color:${hn || k === 0 ? '#C9305A' : k === 6 ? '#2366C2' : '#1F2B45'}">${d}</div>${hn ? `<div style="font-size:11.5px;color:#C9305A;line-height:1.2">${hn}</div>` : ''}` : ''}</td>`; }).join('')}</tr>`).join('')}</table>
      <div class="lines"><div class="blk-label">이달의 목표</div><div class="ln"></div></div>
      <div style="font-size:11px;color:#8A95A8">공휴일: 한국천문연구원 2027년 달력자료(공식 발표 전 자료) 기준. 임시공휴일은 따로 지정될 수 있어요.</div>`;
    return p;
  }
  T.calendar = function (a, ctx) {
    const st = ctx.stage; let sel = 1;
    const wrap = el('<div style="display:grid;grid-template-columns:1fr 1fr;height:100%;min-height:0"></div>'); st.appendChild(wrap);
    const left = el('<div class="yeargrid" style="grid-template-columns:repeat(3,1fr);align-content:start"><div style="grid-column:1/4;display:flex;align-items:center;gap:16px;background:#FFE9E4;border-radius:14px;padding:8px 16px"><img src="img/sheep.png" alt="" style="height:84px"><div><b style="font-size:24px;color:#D2302C">2027년은 붉은 양의 해</b><div class="hint">정미년: "정"은 붉은색, "미"는 양을 뜻해요. 음력 설날(2월 7일)부터 시작돼요.</div></div></div></div>'), right = el('<div style="display:flex;min-height:0"></div>');
    wrap.append(left, right);
    for (let m = 1; m <= 12; m++) {
      const c = monthCells(m);
      const mn = el(`<div class="mini ${m === sel ? 'on' : ''}"><h4>${m}월</h4><table><tr>${DOW.map((d, k) => `<th class="${k === 0 ? 'hol' : k === 6 ? 'sat' : ''}">${d}</th>`).join('')}</tr>${Array.from({ length: c.length / 7 }, (_, r) => `<tr>${c.slice(r * 7, r * 7 + 7).map((d, k) => `<td class="${d && (HOLI2027[m + '-' + d] || k === 0) ? 'hol' : k === 6 ? 'sat' : ''}">${d || ''}</td>`).join('')}</tr>`).join('')}</table></div>`);
      mn.onclick = () => { sel = m; $$('.mini', left).forEach(x => x.classList.remove('on')); mn.classList.add('on'); showPaper(right, [calPage(a, m)]); };
      left.appendChild(mn);
    }
    let per = Store.d('cal:per', 4);
    const preview = () => showPaper(right, per === 1 ? [calPage(a, sel)] : calSheets(a, per).slice(0, 1));
    preview();
    ctx.print(() => printPages(per === 1 ? Array.from({ length: 12 }, (_, k) => calPage(a, k + 1)) : calSheets(a, per)));
    const info = el('<p class="hint"></p>');
    const upd = () => { const n = per === 1 ? 12 : 12 / per; const kids = Store.roster().length || 24; info.innerHTML = `한 사람에 <b>${n}장</b>이에요. ${kids}명이면 <b>${n * kids}장</b>이 필요해요.`; };
    const segc = el('<div class="seg"></div>');
    [[4, '한 장에 4달 (3장)'], [2, '한 장에 2달 (6장)'], [12, '한 장에 12달 (1장)'], [1, '한 장에 1달 (12장)']].forEach(([v, t]) => { const b = el(`<button class="${v === per ? 'on' : ''}">${t}</button>`); b.onclick = () => { per = v; Store.set('cal:per', v); $$('button', segc).forEach(x => x.classList.remove('on')); b.classList.add('on'); upd(); preview(); }; segc.appendChild(b); });
    const lab = el('<label class="f">인쇄 방법</label>'); lab.appendChild(segc);
    const cls = el('<button class="btn">우리 반 달력 하나 만들기 (12장)</button>'); cls.onclick = () => printPages(Array.from({ length: 12 }, (_, k) => calPage(a, k + 1)));
    ctx.opts.append(lab, info, cls, el('<p class="hint">"우리 반 달력"은 한 달씩 나눠 맡아 그림을 그리고 모아서 교실 달력 하나로 만들어요. 종이가 가장 적게 들어요. 빨간 날은 일요일과 공휴일이에요.</p>'));
    upd();
  };
  /* 여러 달을 한 장에 */
  function calSheets(a, per) {
    const pages = [], cols = per === 12 ? 3 : per === 4 ? 2 : 1;
    const dh = per === 12 ? 0 : per === 4 ? 120 : 170, rh = per === 12 ? 17 : per === 4 ? 30 : 36, fs = per === 12 ? 11 : per === 4 ? 13 : 16;
    for (let s = 1; s <= 12; s += per) {
      const p = pageFrame(a, per === 12 ? '2027 나의 달력' : `2027 달력 (${s}~${s + per - 1}월)`, per === 12 ? '좋아하는 달에 동그라미하고, 빈 곳에 새해 그림을 그려요.' : '달마다 위 칸에 그 달의 그림을 그리고, 중요한 날에 표시해요.');
      const months = Array.from({ length: per }, (_, k) => s + k);
      p.insertAdjacentHTML('beforeend', `${per === 12 ? `<div style="display:flex;align-items:center;gap:12px;background:#FFE9E4;border-radius:14px;padding:6px 14px"><img src="img/sheep.png" alt="" style="height:54px"><b style="color:#D2302C;font-size:18px">2027 정미년, 붉은 양의 해</b><span style="font-size:12px;color:#8A95A8">음력 설날(2월 7일)부터</span></div>` : ''}<div style="flex:1;display:grid;grid-template-columns:repeat(${cols},1fr);gap:${per === 12 ? 10 : 16}px;align-content:start">${months.map(m => {
        const c = monthCells(m);
        return `<div style="border:2px solid var(--soft);border-radius:16px;padding:${per === 12 ? 6 : 10}px;display:flex;flex-direction:column;gap:4px;background:#fff">${dh ? `<div style="height:${dh}px;border:1.5px dashed #CDD5E1;border-radius:12px"></div>` : ''}<div style="display:flex;align-items:baseline;gap:6px"><b style="font-size:${per === 12 ? 20 : 28}px;color:var(--c);line-height:1">${m}</b><span style="font-size:${fs}px">월</span>${per === 4 || per === 2 ? `<span style="margin-left:auto;font-size:12px;color:#8A95A8">목표 ______________</span>` : ''}</div>
          <table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:${fs}px"><tr>${DOW.map((d, k) => `<th style="color:${k === 0 ? '#C9305A' : k === 6 ? '#2366C2' : '#56627A'};font-weight:700;padding:1px">${d}</th>`).join('')}</tr>${Array.from({ length: c.length / 7 }, (_, r) => `<tr>${c.slice(r * 7, r * 7 + 7).map((d, k) => { const hn = d && HOLI2027[m + '-' + d]; return `<td style="height:${rh}px;vertical-align:top;text-align:${per === 12 ? 'center' : 'left'};padding:1px 3px;border-top:1px solid #E4E9F1;color:${hn || k === 0 ? '#C9305A' : k === 6 ? '#2366C2' : '#1F2B45'};font-weight:${hn ? 700 : 400}">${d || ''}${hn && per !== 12 ? `<div style="font-size:9px;line-height:1.1">${hn}</div>` : ''}</td>`; }).join('')}</tr>`).join('')}</table></div>`;
      }).join('')}</div><div style="font-size:10px;color:#8A95A8">공휴일: 한국천문연구원 2027년 달력자료(공식 발표 전) 기준</div>`);
      pages.push(p);
    }
    return pages;
  }
  T.calendar.pages = a => calSheets(a, Store.d('cal:per', 4) === 1 ? 4 : Store.d('cal:per', 4));

  /* ─── 협동 컬러링 ─── */
  function mandala(seed) {
    let s = seed; const R = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const n = [6, 8, 12][Math.floor(R() * 3)]; let g = '';
    const rings = [60, 120, 190, 260, 330, 400];
    rings.forEach((r, k) => { g += `<circle cx="500" cy="500" r="${r}" fill="none" stroke="#1F2B45" stroke-width="3"/>`; });
    for (let k = 0; k < n; k++) {
      const ang = k / n * 360;
      g += `<g transform="rotate(${ang} 500 500)">`;
      g += `<path d="M500 440 Q ${530 + R() * 20} 400 500 ${380 - R() * 20} Q ${470 - R() * 20} 400 500 440Z" fill="none" stroke="#1F2B45" stroke-width="3"/>`;
      g += `<ellipse cx="500" cy="${345}" rx="${18 + R() * 10}" ry="30" fill="none" stroke="#1F2B45" stroke-width="3"/>`;
      g += `<path d="M500 310 L ${540 + R() * 20} 270 L 500 230 L ${460 - R() * 20} 270 Z" fill="none" stroke="#1F2B45" stroke-width="3"/>`;
      g += `<circle cx="500" cy="${200}" r="${14 + R() * 8}" fill="none" stroke="#1F2B45" stroke-width="3"/>`;
      g += `<path d="M500 170 Q ${560 + R() * 30} 140 ${540} 100 Q 520 130 500 110 Q 480 130 ${460} 100 Q ${440 - R() * 30} 140 500 170Z" fill="none" stroke="#1F2B45" stroke-width="3"/>`;
      g += `<path d="M500 230 L500 170 M500 380 L500 345" stroke="#1F2B45" stroke-width="3"/>`;
      g += `<g transform="rotate(${180 / n} 500 500)"><circle cx="500" cy="${300}" r="${10 + R() * 8}" fill="none" stroke="#1F2B45" stroke-width="3"/><path d="M500 ${160} l 22 30 l -22 30 l -22 -30 z" fill="none" stroke="#1F2B45" stroke-width="3"/><path d="M500 ${70} l 14 20 l -14 20 l -14 -20 z" fill="none" stroke="#1F2B45" stroke-width="3"/></g>`;
      g += '</g>';
    }
    g += `<circle cx="500" cy="500" r="30" fill="none" stroke="#1F2B45" stroke-width="3"/>`;
    for (let k = 0; k < 4; k++) { const cx = k % 2 ? 930 : 70, cy = k < 2 ? 70 : 930; g += `<g transform="translate(${cx} ${cy})">${[0, 60, 120].map(r => `<path d="M0 -50 L0 50 M-12 -38 L0 -26 L12 -38 M-12 38 L0 26 L12 38" transform="rotate(${r})" stroke="#1F2B45" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}</g>`; }
    return g;
  }
  T.coloring = function (a, ctx) {
    const st = ctx.stage; let seed = Store.d('mseed', 7), cols = 3, rows = 3, upl = null;
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    const art = (vb, extra) => upl ? `<svg viewBox="${vb}" preserveAspectRatio="none" style="width:100%;height:100%"><image href="${upl}" x="0" y="0" width="1000" height="1000" preserveAspectRatio="xMidYMid meet"/>${extra || ''}</svg>` : `<svg viewBox="${vb}" style="width:100%;height:100%"><rect width="1000" height="1000" fill="#fff"/>${mandala(seed)}${extra || ''}</svg>`;
    function draw() {
      const w = 1000 / cols, h = 1000 / rows; let grid = '';
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) grid += `<rect x="${c * w}" y="${r * h}" width="${w}" height="${h}" fill="none" stroke="#E2456B" stroke-width="4" stroke-dasharray="14 10"/><text x="${c * w + 18}" y="${r * h + 50}" font-family="Miso" font-weight="700" font-size="40" fill="#E2456B">${r * cols + c + 1}</text>`;
      body.innerHTML = `<div class="center"><div style="width:min(66vh,620px);aspect-ratio:1;background:#fff;border-radius:12px;padding:10px">${art('0 0 1000 1000', grid)}</div><p class="expl">${cols * rows}조각으로 나눠요. 한 사람이 한 조각씩 색칠하고 번호대로 붙여요.</p></div>`;
    }
    ctx.opts.append(field('조각 수', seg([['2x2', '4조각'], ['3x3', '9조각'], ['4x4', '16조각'], ['4x6', '24조각'], ['5x6', '30조각']], '3x3', v => { [cols, rows] = v.split('x').map(Number); draw(); })));
    const nb = el('<button class="btn">다른 눈꽃 무늬</button>'); nb.onclick = () => { seed = rint(1, 9999); Store.set('mseed', seed); upl = null; draw(); };
    const fi = el('<input type="file" accept="image/*">'); fi.onchange = () => { const f = fi.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { upl = r.result; draw(); }; r.readAsDataURL(f); };
    ctx.opts.append(nb, field('내 그림(선 그림) 넣기', fi), el('<p class="hint">인쇄하면 조각마다 A4 한 장씩 크게 나오고, 붙일 자리 지도가 함께 있어요.</p>'));
    ctx.print(() => {
      const w = 1000 / cols, h = 1000 / rows, pages = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const k = r * cols + c + 1;
        const map = `<svg viewBox="0 0 ${cols * 20} ${rows * 20}" style="width:${cols * 16}px;height:${rows * 16}px">${Array.from({ length: cols * rows }, (_, j) => `<rect x="${(j % cols) * 20}" y="${Math.floor(j / cols) * 20}" width="20" height="20" fill="${j + 1 === k ? '#E2456B' : '#fff'}" stroke="#56627A" stroke-width="1.5"/>`).join('')}</svg>`;
        const p = el(`<div class="page" data-act="${a.n}" style="${catVars(catOf(a))}"><div class="ph"><div><div class="pnum">겨울 협동 컬러링</div><div class="pt">조각 ${k} / ${cols * rows}</div></div><div style="display:flex;gap:12px;align-items:center">${map}${nameLine()}</div></div><div style="flex:1;border:2px solid #1F2B45;overflow:hidden">${art(`${c * w} ${r * h} ${w} ${h}`)}</div></div>`);
        $('svg:last-child', $('div[style*="flex:1"]', p)).setAttribute('preserveAspectRatio', 'none');
        pages.push(p);
      }
      printPages(pages);
    });
    draw();
  };

  /* ─── 영화제 슬라이드 ─── */
  T.slideshow = function (a, ctx) {
    const st = ctx.stage; let pics = [], sec = 5, iv = null, k = 0;
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    const title = el(`<input type="text" value="${esc(Store.d('filmTitle', '2026 우리 반 영화제'))}">`); title.onchange = () => Store.set('filmTitle', title.value);
    const fi = el('<input type="file" accept="image/*" multiple>'); fi.onchange = () => { pics = Array.from(fi.files).map(f => URL.createObjectURL(f)); idle(); };
    ctx.opts.append(field('영화제 이름', title), field('사진 넣기 (여러 장)', fi), field('한 장 보여 주는 시간', seg([[3, '3초'], [5, '5초'], [8, '8초']], 5, v => sec = v)), el('<p class="hint">사진은 이 화면에서만 쓰이고 어디에도 올라가지 않아요.</p>'));
    function idle() {
      clearInterval(iv);
      body.innerHTML = `<div class="center"><div class="qbig">${esc(title.value)}</div><p class="expl">${pics.length ? `사진 ${pics.length}장이 준비됐어요.` : '왼쪽에서 사진을 넣어 주세요.'}</p><button class="btn huge dark" data-p ${pics.length ? '' : 'disabled'}>상영 시작</button></div>`;
      $('[data-p]', body).onclick = play;
    }
    function play() {
      st.classList.add('full'); k = 0;
      body.innerHTML = `<div style="position:absolute;inset:0;background:#141A2A;overflow:hidden" data-sc></div><div style="position:absolute;left:24px;bottom:20px;color:#fff;font-size:22px;font-weight:700;z-index:3;text-shadow:0 2px 8px rgba(0,0,0,.6)">${esc(title.value)} <span data-c></span></div><button class="btn" style="position:absolute;right:20px;top:20px;z-index:3" data-x>끝내기</button>`;
      const sc = $('[data-sc]', body);
      const showK = () => { const img = el(`<img src="${pics[k]}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity .9s, transform ${sec + 1}s linear;transform:scale(1.02)">`); sc.appendChild(img); requestAnimationFrame(() => requestAnimationFrame(() => { img.style.opacity = 1; img.style.transform = 'scale(1.08)'; })); if (sc.children.length > 2) sc.firstChild.remove(); $('[data-c]', body).textContent = `${k + 1} / ${pics.length}`; };
      showK();
      iv = setInterval(() => { k++; if (k >= pics.length) { clearInterval(iv); setTimeout(() => { st.classList.remove('full'); body.innerHTML = '<div class="center"><div class="qbig">상영 끝!</div><p class="expl">가장 기억에 남는 장면은 무엇이었나요?</p></div>'; confetti(st); beep('fan'); }, sec * 1000); return; } showK(); }, sec * 1000);
      $('[data-x]', body).onclick = () => { st.classList.remove('full'); idle(); };
    }
    idle();
  };

  /* ─── 보드게임 데이 ─── */
  T.stations = function (a, ctx) {
    const st = ctx.stage;
    const t = ta(Store.d('stations', '협력 보드게임\n전략 보드게임\n낱말 보드게임\n숫자 보드게임\n순발력 보드게임'), 6);
    let min = 10, round = 0, timer;
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    const S = () => t.value.split('\n').map(s => s.trim()).filter(Boolean);
    function draw() {
      clearTimers(); const s = S(), n = s.length;
      body.innerHTML = `<div class="center"><div class="qcount" style="font-size:22px">${round + 1}번째 판 (모두 ${n}판)</div><div data-t></div><table class="stable">${s.map((x, k) => `<tr><td>${esc(x)}</td><td><span class="chip" style="background:${TEAMC[((k - round) % n + n) % n % 6]};font-size:22px">${((k - round) % n + n) % n + 1}모둠</span></td></tr>`).join('')}</table><div class="ctrl"><button class="btn big dark" data-s>시작</button><button class="btn big" data-n>자리 옮기기 ${ICON.next}</button></div></div>`;
      timer = makeTimer({ sec: min * 60, onEnd: () => { toast('정리하고 다음 자리로 옮겨요!'); } }); $('[data-t]', body).appendChild(timer.node);
      $('.ring', body).style.cssText = 'width:150px;height:150px'; $('.tv', body).style.fontSize = '40px';
      $('[data-s]', body).onclick = () => timer.start();
      $('[data-n]', body).onclick = () => { round = (round + 1) % n; beep('ok'); draw(); };
    }
    const sv = el('<button class="btn">저장</button>'); sv.onclick = () => { Store.set('stations', t.value); round = 0; draw(); };
    ctx.opts.append(field('자리마다 놓을 게임 (한 줄에 한 자리)', t), sv, field('한 판 시간', seg([[7, '7분'], [10, '10분'], [15, '15분']], 10, v => { min = v; draw(); })), el('<p class="hint">모둠 수는 자리 수와 같아요. 판이 끝나면 모둠이 한 칸씩 옆 자리로 옮겨요.</p>'));
    draw();
  };

  /* ─── 종이 한 장 챌린지 ─── */
  T.draw = function (a, ctx) {
    const st = ctx.stage; let min = 10, deck = shuffle(DECKS.paper);
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    function idle(topic) {
      clearTimers();
      body.innerHTML = `<div class="center"><div class="qcount">오늘의 도전 주제</div><div class="drawn" data-w>${topic ? esc(topic) : '?'}</div><div data-t></div><div class="ctrl"><button class="btn huge dark" data-d>주제 뽑기</button>${topic ? '<button class="btn huge" data-s>만들기 시작</button>' : ''}</div><p class="expl">종이 한 장만 써요. 가위와 테이프는 조금 써도 돼요.</p></div>`;
      $('[data-d]', body).onclick = () => { if (!deck.length) deck = shuffle(DECKS.paper); const w = deck.pop(); const d = $('[data-w]', body); let k = 0; const iv = setInterval(() => { d.textContent = pickOne(DECKS.paper); if (++k > 12) { clearInterval(iv); beep('fan'); idle(w); } }, 70); };
      if (topic) $('[data-s]', body).onclick = () => { const t = makeTimer({ sec: min * 60, onEnd: () => { confetti(st); toast('그만! 작품을 소개해요'); } }); $('[data-t]', body).innerHTML = ''; $('[data-t]', body).appendChild(t.node); $('.ring', body).style.cssText = 'width:150px;height:150px'; $('.tv', body).style.fontSize = '40px'; t.start(); };
    }
    ctx.opts.append(field('만드는 시간', seg([[5, '5분'], [10, '10분'], [15, '15분']], 10, v => min = v)));
    idle();
  };

  /* ─── 진행 안내 ─── */
  T.guide = function (a, ctx) {
    const st = ctx.stage, chk = Store.d('chk:' + a.n, {});
    const body = el('<div class="stagebody" style="overflow:auto"></div>'); st.appendChild(body);
    function draw() {
      const done = a.check.filter((_, i) => chk[i]).length;
      body.innerHTML = `<div style="display:grid;grid-template-columns:${a.live ? '1fr' : '1.1fr 1fr'};gap:22px;padding:26px 30px;max-width:1200px;margin:0 auto;width:100%">
        <div><div style="display:flex;justify-content:space-between;align-items:baseline"><h2 style="margin:0 0 10px;font-size:26px">${a.live ? '정리 미션' : '준비할 것'}</h2><b style="color:var(--c);font-size:20px">${done} / ${a.check.length}</b></div>
        <div style="height:10px;border-radius:5px;background:rgba(31,43,69,.08);overflow:hidden;margin-bottom:12px"><b style="display:block;height:100%;width:${done / a.check.length * 100}%;background:var(--c);transition:width .3s"></b></div>
        <div style="display:${a.live ? 'grid;grid-template-columns:1fr 1fr' : 'flex;flex-direction:column'};gap:8px">${a.check.map((c, i) => `<button data-i="${i}" style="display:flex;align-items:center;gap:12px;text-align:left;border:2px solid ${chk[i] ? 'var(--c)' : 'var(--rule)'};background:${chk[i] ? 'var(--t)' : 'var(--paper)'};border-radius:12px;padding:${a.live ? '14px 16px' : '10px 14px'};font-size:${a.live ? 21 : 18}px;font-weight:700"><span class="pick ${chk[i] ? 'on' : ''}" style="width:30px;height:30px">${ICON.check}</span><span style="${chk[i] ? 'text-decoration:line-through;color:var(--sub)' : ''}">${esc(c)}</span></button>`).join('')}</div></div>
        ${a.tips ? `<div><h2 style="margin:0 0 10px;font-size:26px">이렇게 하면 더 좋아요</h2>${a.tips.map(t => `<p style="font-size:18px;line-height:1.6;margin:0 0 12px;padding-left:14px;border-left:4px solid var(--c);word-break:keep-all">${esc(t)}</p>`).join('')}<img src="img/cat${a.c}.png" alt="" style="height:170px;margin:18px 0 0 14px"></div>` : ''}</div>`;
      $$('[data-i]', body).forEach(b => b.onclick = () => { const i = +b.dataset.i; chk[i] = !chk[i]; Store.save(); beep(chk[i] ? 'ok' : 'pop'); draw(); if (a.check.every((_, j) => chk[j])) { confetti(st); beep('fan'); } });
    }
    draw();
    const rs = el('<button class="btn">체크 모두 풀기</button>'); rs.onclick = () => { Object.keys(chk).forEach(k => delete chk[k]); Store.save(); draw(); };
    ctx.opts.append(rs);
    if (a.sheet) {
      const pv = el('<button class="btn">활동지 미리 보기</button>'); let on = false;
      pv.onclick = () => { on = !on; pv.textContent = on ? '안내로 돌아가기' : '활동지 미리 보기'; if (on) { body.innerHTML = ''; showPaper(body, [buildSheet(a, a.sheet)]); } else draw(); };
      ctx.opts.append(pv);
      ctx.print(() => printPages([buildSheet(a, a.sheet)]));
    }
    if (a.signs) {
      const sp = () => a.signs.map(s => { const p = el(`<div class="page" style="${catVars(catOf(a))};justify-content:center;align-items:center;padding:40px"></div>`); p.innerHTML = `<div style="position:absolute;inset:36px;border:6px solid var(--c);border-radius:40px"></div><div style="font-size:${s.length > 7 ? 120 : 150}px;font-weight:700;line-height:1.15;text-align:center;word-break:keep-all;color:#1F2B45;padding:0 30px">${esc(s)}</div>`; return p; });
      ctx.print(() => printPages(sp()));
      ctx.opts.append(el(`<p class="hint">인쇄하면 손팻말 ${a.signs.length}장이 A4 한 장에 한 문구씩 크게 나와요.</p>`));
    }
  };
  T.guide.pages = a => a.sheet ? [buildSheet(a, a.sheet)] : [];

  /* ─── 롤링페이퍼 ─── */
  function rollPage(a, name) {
    const p = el(`<div class="page" data-act="${a.n}" style="${catVars(catOf(a))};padding:34px"></div>`);
    const cells = Array.from({ length: 12 }, (_, i) => `<div style="border:1.5px dashed #B8C1CF;border-radius:${[18, 6, 26, 10][i % 4]}px;padding:10px;display:flex;flex-direction:column;justify-content:flex-end;font-size:12px;color:#8A95A8">From. ________</div>`);
    p.innerHTML = `<div style="flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(5,1fr);gap:12px;position:relative">${cells.slice(0, 6).join('')}<div style="grid-column:1/4;display:flex;align-items:center;justify-content:center;gap:16px"><svg viewBox="0 0 40 40" style="width:44px;height:44px"><path d="M20 34s-13-8-13-17a7 7 0 0 1 13-4 7 7 0 0 1 13 4c0 9-13 17-13 17z" fill="var(--t)" stroke="var(--c)" stroke-width="2.5"/></svg><div style="font-size:52px;font-weight:700;letter-spacing:-1px">${esc(name || '_______')}<span style="font-size:28px;color:#56627A"> 에게</span></div></div>${cells.slice(6).join('')}</div><div style="text-align:center;font-size:14px;color:#8A95A8;margin-top:8px">${esc(className())} 친구들이 함께 쓴 한 해의 마음</div>`;
    return p;
  }
  T.rolling = function (a, ctx) {
    const names = roster(), st = ctx.stage;
    showPaper(st, [rollPage(a, names[0] || '')]);
    ctx.print(() => printPages((names.length ? names : ['']).map(n => rollPage(a, n))));
    ctx.opts.append(el(`<p class="hint">${names.length ? `우리 반 ${names.length}명의 롤링페이퍼가 이름별로 인쇄돼요.` : '명단을 넣으면 이름이 들어간 롤링페이퍼가 사람 수만큼 나와요. 지금은 빈 종이 한 장이 인쇄돼요.'}</p>`));
    if (!names.length) { const b = el('<button class="btn dark">우리 반 명단 넣기</button>'); b.onclick = () => openSettings(); ctx.opts.append(b); }
  };
  T.rolling.pages = a => (roster().length ? roster() : ['']).map(n => rollPage(a, n));
})();
