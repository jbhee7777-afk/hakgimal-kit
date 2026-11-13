/* ── 우리 반 마지막 산책: 미션 8곳을 따라 걸으며 친구 만나기 ── */
(function () {
  const B = window.SHEET_BLOCKS;
  const BOX = '<svg viewBox="0 0 20 20" style="width:19px;height:19px;flex:none"><rect x="2" y="2" width="16" height="16" rx="3" fill="#fff" stroke="#8A7F74" stroke-width="1.8"/></svg>';
  const f = (lab, w) => `<span class="wk-f"><b>${lab}</b><i style="flex:${w || 1}"></i></span>`;
  const STOPS = [
    ['산책 인사로 출발!', '친구 3명에게 이름을 부르며 인사해요.', `<div class="wk-row">${[1, 2, 3].map(k => `<span class="wk-ck">${BOX}<i></i></span>`).join('')}</div>`, '#F7D9C4'],
    ['기억에 남는 활동', '첫 번째 친구가 고른 올해 최고의 활동은?', `<div class="wk-row">${f('친구')}${f('활동', 1.4)}</div>`, '#D5ECDF'],
    ['새롭게 알게 된 것', '두 번째 친구가 올해 새로 배운 것은?', `<div class="wk-row">${f('친구')}${f('배운 것', 1.4)}</div>`, '#DCE6F6'],
    ['즐거웠던 순간', '세 번째 친구가 가장 즐거웠던 순간은?', `<div class="wk-row">${f('친구')}${f('순간', 1.4)}</div>`, '#F6DCE4'],
    ['고마운 마음 전하기', '네 번째 친구에게 고마웠던 일을 말해요.', `<div class="wk-row">${f('친구')}<span class="wk-ck">${BOX}<em>마음을 전했어요!</em></span></div>`, '#F8E8B8'],
    ['친구의 반짝이는 점', '다섯 번째 친구의 멋진 점을 말해 줘요.', `<div class="wk-row">${f('친구')}${f('멋진 점', 1.4)}</div>`, '#E6DDF4'],
    ['우리의 닮은 점', '여섯 번째 친구와 나의 같은 점을 찾아요.', `<div class="wk-row">${f('친구')}${f('같은 점', 1.4)}</div>`, '#D5ECDF'],
    ['내가 자란 한 뼘', '1년 동안 더 잘하게 된 것은?', `<div class="wk-row">${f('', 1)}</div><div class="wk-row wk-sign"><span>선생님께 말하고 사인 받기</span><i></i></div>`, '#F7D9C4']
  ];
  /* 지그재그: 1 2 / 4 3 / 5 6 / 8 7 */
  const ORDER = [0, 1, 3, 2, 4, 5, 7, 6];
  B.walk = () => `<div data-nofill class="wk">
    <svg class="wk-path" viewBox="0 0 700 800" preserveAspectRatio="none"><path d="M175 60 H525 C640 60 640 260 525 260 H175 C60 260 60 460 175 460 H525 C640 460 640 660 525 660 H175 C120 660 100 720 160 790" fill="none" stroke="#F1E4CC" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="M175 60 H525 C640 60 640 260 525 260 H175 C60 260 60 460 175 460 H525 C640 460 640 660 525 660 H175 C120 660 100 720 160 790" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 12" stroke-linecap="round"/></svg>
    <div class="wk-grid">${ORDER.map(k => { const [t, q, body, col] = STOPS[k]; return `<div class="wk-stop" style="--wc:${col}"><div class="wk-h"><span class="wk-n">${k + 1}</span><b>${t}</b></div><p>${q}</p>${body}</div>`; }).join('')}</div>
    <div class="wk-end"><div class="wk-eh"><img src="img/wc/bouquet.png" alt=""><b>도착! 1년 마음 모으기</b><img src="img/wc/bouquet.png" alt=""></div>
      <div class="wk-row">${f('내가 뿌듯했던 일', 1.6)}${f('방학 약속', 1.2)}</div>
      <p>아직 만나지 않은 친구 3명과 새해 인사를 나누고 이름을 받아요.</p>
      <div class="wk-row">${[1, 2, 3].map(k => `<span class="wk-sg"><em>${k}</em><i></i></span>`).join('')}</div></div>
  </div>`;

  /* ── 교실 화면: 미션마다 새 짝, 도착하면 아직 못 만난 친구 ── */
  const T = window.TOOLS;
  const ROUNDS = [1, 2, 3, 4, 5, 6]; /* 미션 2~7 */
  function schedule(names) {
    let order = Store.d('walk:order', null);
    if (!order || order.length !== names.length || names.some(n => !order.includes(n))) { order = shuffle(names); Store.set('walk:order', order); }
    const L = order.slice(); if (L.length % 2) L.push(null);
    const n = L.length, rounds = [], met = new Set(), key = (x, y) => x < y ? x + '|' + y : y + '|' + x;
    for (let r = 0; r < Math.min(ROUNDS.length, n - 1); r++) {
      const rest = L.slice(1), m = rest.length, rot = [L[0], ...rest.map((_, i) => rest[(i - r + m * 10) % m])];
      const pairs = []; let solo = null;
      for (let i = 0; i < n / 2; i++) { const a = rot[i], b = rot[n - 1 - i]; if (a && b) pairs.push([a, b]); else solo = a || b; }
      if (solo && pairs.length) {
        const fresh = pairs.map((g, i) => [i, g.filter(x => met.has(key(x, solo))).length]).sort((p, q) => p[1] - q[1] || q[0] - p[0]);
        pairs[fresh[0][0]].push(solo);
      }
      pairs.forEach(g => g.forEach(x => g.forEach(y => { if (x !== y) met.add(key(x, y)); })));
      rounds.push(pairs);
    }
    return rounds;
  }
  function unmet(names, rounds) {
    const met = Object.fromEntries(names.map(n => [n, new Set([n])]));
    rounds.forEach(ps => ps.forEach(g => g.forEach(x => g.forEach(y => met[x].add(y)))));
    const seed = s => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0; return h; };
    return names.map(n => { const left = names.filter(x => !met[n].has(x)).sort((a, b) => (seed(n + a) & 255) - (seed(n + b) & 255)); return [n, left.slice(0, 3)]; });
  }
  T.walk = function (a, ctx) {
    const st = ctx.stage, names = Store.roster();
    const body = el('<div class="stagebody wkt"></div>'); st.appendChild(body);
    let r = 0, timer = null, mins = Store.d('walk:min', 3);
    const pb = el('<button class="btn dark">산책 활동지 인쇄</button>'); pb.onclick = () => printPages(Array.from({ length: Math.max(1, names.length) }, () => buildSheet(a, a.sheet)));
    ctx.print(() => pb.onclick());
    if (names.length < 4) {
      body.innerHTML = `<div class="center"><div class="qbig" style="font-size:30px">우리 반 명단을 넣으면 산책 짝을 정해 줘요</div><p class="expl">미션마다 반 전체가 새 짝을 만나고, 도착하면 아직 못 만난 친구 3명을 알려 줘요. 명단은 4명 이상 필요해요.</p><button class="btn big dark" data-set>우리 반 명단 넣기</button></div>`;
      $('[data-set]', body).onclick = () => openSettings();
      ctx.opts.append(pb); return;
    }
    let rounds = schedule(names);
    const total = rounds.length;
    function draw() {
      clearTimers(); timer = null;
      if (r < total) {
        const k = ROUNDS[r], [title, q] = STOPS[k];
        body.innerHTML = `<div class="wkt-in"><div class="wkt-head"><div class="wkt-step">${rounds.map((_, j) => `<i class="${j < r ? 'done' : j === r ? 'now' : ''}">${ROUNDS[j] + 1}</i>`).join('')}<i class="${r === total ? 'now' : ''}">도착</i></div><div data-t></div></div>
          <div class="wkt-title"><span>미션 ${k + 1}</span><b>${title}</b><p>${q}</p></div>
          <div class="wkt-pairs">${rounds[r].map(g => `<div class="wkt-p">${g.map(x => `<span>${esc(x)}</span>`).join('<em><svg viewBox="0 0 24 24" style="width:.9em;height:.9em"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" fill="#F4B6C2"/></svg></em>')}</div>`).join('')}</div>
          <div class="ctrl"><button class="btn big" data-p ${r ? '' : 'disabled'}>이전 미션</button><button class="btn big dark" data-ts>${mins}분 시작</button><button class="btn big dark" data-n>${r === total - 1 ? '도착!' : '다음 미션'}</button></div></div>`;
        timer = makeTimer({ sec: mins * 60, onEnd: () => toast('시간이 다 됐어요. 다음 미션으로!') }); $('[data-t]', body).appendChild(timer.node);
        $('[data-ts]', body).onclick = () => { timer.start(); beep('pop'); };
      } else {
        const list = unmet(names, rounds);
        body.innerHTML = `<div class="wkt-in"><div class="wkt-head"><div class="wkt-step">${rounds.map((_, j) => `<i class="done">${ROUNDS[j] + 1}</i>`).join('')}<i class="now">도착</i></div></div>
          <div class="wkt-title"><span>도착!</span><b>아직 못 만난 친구와 인사해요</b><p>내 이름 옆의 친구를 찾아가 새해 인사를 하고, 활동지 맨 아래에 이름을 받아요.</p></div>
          <div class="wkt-un">${list.map(([n, l]) => `<div><b>${esc(n)}</b><span>${l.length ? l.map(esc).join(' · ') : '모두 만났어요!'}</span></div>`).join('')}</div>
          <div class="ctrl"><button class="btn big" data-p>이전 미션</button></div></div>`;
        confetti(st);
      }
      $('[data-p]', body) && ($('[data-p]', body).onclick = () => { r = Math.max(0, r - 1); draw(); });
      $('[data-n]', body) && ($('[data-n]', body).onclick = () => { r++; beep('fan'); draw(); });
    }
    const seg = el('<div class="seg"></div>');
    [2, 3, 4, 5].forEach(m => { const b = el(`<button class="${m === mins ? 'on' : ''}">${m}분</button>`); b.onclick = () => { mins = m; Store.set('walk:min', m); $$('button', seg).forEach(x => x.classList.remove('on')); b.classList.add('on'); draw(); }; seg.appendChild(b); });
    const lab = el('<label class="f">미션 한 개 시간</label>'); lab.appendChild(seg);
    const nw = el('<button class="btn flat">짝 새로 섞기</button>'); nw.onclick = () => { if (!confirm('산책 짝을 새로 섞을까요?')) return; Store.set('walk:order', null); rounds = schedule(names); r = 0; draw(); };
    const rs = el('<button class="btn flat">처음 미션으로</button>'); rs.onclick = () => { r = 0; draw(); };
    ctx.opts.append(lab, pb, rs, nw, el(`<p class="hint">미션 2~7마다 반 전체가 겹치지 않는 새 짝을 만나요. 미션 1(인사 3명)과 미션 8(선생님 사인)은 자유롭게 해요. 마지막 "도착!" 화면에 아이마다 아직 못 만난 친구 3명이 나와요.${names.length % 2 ? ' 인원이 홀수라 한 모둠은 3명이에요.' : ''}</p>`));
    draw();
  };
  T.walk.pages = a => [buildSheet(a, a.sheet)];
})();
