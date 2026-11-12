/* 방탈출(학년별 난이도)과 그림 퀴즈(진짜 그림) */
(function () {
  const T = window.TOOLS;
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const P = a => a[Math.floor(Math.random() * a.length)];
  const WORDS = [['눈사람', '눈을 굴려 만든 하얀 사람'], ['붕어빵', '물고기 모양 겨울 간식'], ['목도리', '목을 따뜻하게 감싸요'], ['해돋이', '새해 아침 해가 떠오르는 것'], ['썰매장', '썰매를 타러 가는 곳'], ['크리스마스', '12월 25일'], ['겨울방학', '지금 우리가 기다리는 것'], ['세뱃돈', '설날 절하고 받는 돈'], ['고드름', '처마 끝 얼음 막대'], ['새해소망', '새해에 이루고 싶은 바람']];
  const FILL = Array.from('가나다라마바사아자차카타파하별달꽃빛물불숲산강들봄길');

  /* ── 선생님 정답지 (미리 인쇄해 두기) ── */
  const plain = h => { const d = document.createElement('div'); d.innerHTML = String(h).replace(/<br\s*\/?>/gi, ' / ').replace(/<\/(td|th)>/gi, ' ').replace(/<\/tr>/gi, ' / '); return d.textContent.replace(/\s+/g, ' ').replace(/( \/)+\s*$/, '').trim(); };
  window.answerKeyPages = function (a, title, rows, note, per) {
    per = per || 16; const out = [];
    for (let k = 0; k < Math.max(1, rows.length); k += per) {
      const p = pageFrame(a, title + ' · 선생님 정답지', note || '화면에 나오는 순서 그대로예요. 아이들에게 보이지 않게 보관해요.', { noName: true });
      p.insertAdjacentHTML('beforeend', `<table data-nofill class="akey"><thead><tr><th style="width:56px">번호</th><th>문제</th><th style="width:30%">정답</th></tr></thead><tbody>${rows.slice(k, k + per).map((r, j) => `<tr><td class="n">${k + j + 1}</td><td>${esc(plain(r[0]))}</td><td class="a">${esc(plain(r[1]))}</td></tr>`).join('')}</tbody></table>`);
      out.push(p);
    }
    return out;
  };
  window.plainText = plain;

  /* 방마다 힌트 3단계: 누를 때마다 하나씩 더 */
  function hintsOf(r) {
    if (r.hints) return r.hints;
    const ans = String(r.ans), h = [r.hint];
    if (r.type === 'tiles') { h.push(`낱말은 ${Array.from(ans).length}글자예요. 첫 글자는 "${Array.from(ans)[0]}"!`); h.push(`앞의 두 글자는 "${Array.from(ans).slice(0, 2).join('')}"예요.`); }
    else if (r.type === 'pick') { const wrong = shuffle(r.opts.filter(o => o !== r.ans)); h.push(`"${wrong[0]}"은(는) 정답이 아니에요.`); if (wrong[1]) h.push(`"${wrong[1]}"도 정답이 아니에요.`); }
    else {
      const n = +ans; h.push(ans.length > 1 ? `정답은 ${ans.length}자리 수예요. 맨 앞 숫자는 ${ans[0]}!` : `정답은 ${n % 2 ? '홀수' : '짝수'}예요.`);
      h.push(ans.length > 1 ? `정답은 ${Math.floor(n / 10) * 10}과 ${Math.floor(n / 10) * 10 + 9} 사이예요.` : `정답은 ${Math.max(0, n - 1)}, ${n}, ${Math.min(9, n + 1)} 중 하나예요.`);
    }
    return h;
  }

  /* 방 만들기 */
  function seqA() { const s = R(2, 9), a = R(3, 5), b = R(1, a - 1); const t = [s, s + a, s + a - b, s + 2 * a - b, s + 2 * a - 2 * b]; return { t: '규칙의 방', q: `수가 어떤 규칙으로 바뀌는지 찾아요.<br><b class="eq">${t.join(', ')}, ?</b>`, ans: String(s + 3 * a - 2 * b), hint: '커졌다 작아졌다 해요. 두 번씩 묶어서 보세요.' }; }
  function timeA() { const h = R(1, 9), m1 = R(0, 4) * 5, d = R(4, (55 - m1) / 5) * 5; const m2 = m1 + d; const fmt = (hh, mm) => `${hh}시 ${mm}분`; return { t: '시계의 방', q: `수업이 <b>${fmt(h, m1)}</b>에 시작해서 <b>${fmt(h, m2)}</b>에 끝났어요. 몇 분 동안 했을까요?`, svg: [[h, m1], [h, m2]], ans: String(d), hint: '긴바늘이 숫자 한 칸 갈 때 5분이에요.' }; }
  function symA() { const s = R(2, 9), c = R(1, 9); return { t: '그림 암호의 방', q: `같은 모양은 같은 수예요.<br><b class="eq">★ + ★ = ${2 * s}</b><br><b class="eq">★ + ● = ${s + c}</b><br>그렇다면 <b class="eq">★ + ★ + ● = ?</b>`, ans: String(2 * s + c), keep: 2 * s + c, hint: '먼저 ★ 하나가 얼마인지 찾아요.' }; }
  function anagram() { const [w, m] = P(WORDS.filter(x => x[0].length <= 4)); const need = Array.from(w); const extra = shuffle(FILL.filter(c => !need.includes(c))).slice(0, 3); return { t: '뒤죽박죽 글자의 방', q: `글자 조각을 바른 순서로 눌러 낱말을 만들어요.<br><span class="lsn-hint">뜻: ${m}</span>`, type: 'tiles', tiles: shuffle(need.concat(extra)), ans: w, hint: `첫 글자는 "${w[0]}"예요.` }; }
  function seqB() { return P([() => { const s = R(2, 5); const t = [s]; for (let i = 0; i < 4; i++) t.push(t[i] * 2 - 1); return { t: t.slice(0, 4), a: t[4], h: '두 배 한 다음 1을 빼요.' }; }, () => { const s = R(1, 3); const t = [s, s * 3, s * 9, s * 27]; return { t, a: s * 81, h: '앞의 수에 같은 수를 곱해요.' }; }, () => { const s = R(3, 12); const t = [s, s + 1, s + 3, s + 6, s + 10]; return { t, a: s + 15, h: '더하는 수가 1, 2, 3, 4…로 커져요.' }; }])(); }
  function seqBRoom() { const x = seqB(); return { t: '규칙의 방', q: `빈칸에 알맞은 수는?<br><b class="eq">${x.t.join(', ')}, ?</b>`, ans: String(x.a), keep: x.a, hint: x.h }; }
  function timeB() { const h = R(1, 6), m = R(1, 11) * 5, dh = R(1, 2), dm = R(2, 10) * 5; let em = m + dm, eh = h + dh; if (em >= 60) { em -= 60; eh += 1; } return { t: '시간 계산의 방', q: `영화가 <b>${h}시 ${m}분</b>에 시작해서 <b>${dh}시간 ${dm}분</b> 동안 해요. 끝나는 시각은?<br><span class="lsn-hint">시와 분을 차례로 돌려요. (예: 4시 5분 → 4 0 5)</span>`, ans: `${eh}${String(em).padStart(2, '0')}`, hint: '분끼리 더해 60분이 넘으면 1시간으로 바꿔요.' }; }
  function magic() {
    let g = [[2, 7, 6], [9, 5, 1], [4, 3, 8]];
    for (let k = R(0, 3); k > 0; k--) g = g[0].map((_, c) => g.map(r => r[c]).reverse());
    if (Math.random() < .5) g = g.map(r => r.slice().reverse());
    const hid = [0, 1, 2].map(() => R(0, 2)); const star = R(0, 2);
    const cell = (r, c) => hid[r] === c ? (r === star ? '★' : '?') : g[r][c];
    return { t: '마법 네모의 방', q: `가로, 세로, 대각선의 합이 모두 같아요. ★에 들어갈 수는?<table class="msq">${g.map((row, r) => `<tr>${row.map((_, c) => `<td>${cell(r, c)}</td>`).join('')}</tr>`).join('')}</table>`, ans: String(g[star][hid[star]]), keep: g[star][hid[star]], hint: '한 줄의 합은 15예요.' };
  }
  function cipher(n) {
    const [w, m] = P(WORDS.filter(x => x[0].length >= (n === 4 ? 4 : 3) && x[0].length <= n * n)); const need = Array.from(w);
    const cells = shuffle(need.concat(shuffle(FILL.filter(c => !need.includes(c))).slice(0, n * n - need.length)));
    const rows = '가나다라'.slice(0, n), pos = c => { const used = []; return need.map(ch => { let i = cells.findIndex((x, k) => x === ch && !used.includes(k)); used.push(i); return rows[Math.floor(i / n)] + (i % n + 1); }); };
    const code = pos();
    return { t: '좌표 암호의 방', q: `암호를 풀어 낱말을 만들어요. <b class="eq">${code.join(' - ')}</b><table class="msq cip"><tr><th></th>${Array.from({ length: n }, (_, c) => `<th>${c + 1}</th>`).join('')}</tr>${Array.from({ length: n }, (_, r) => `<tr><th>${rows[r]}</th>${cells.slice(r * n, r * n + n).map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table>`, type: 'tiles', tiles: shuffle(need.concat(shuffle(FILL.filter(c => !need.includes(c))).slice(0, 3))), ans: w, hint: `"${rows[0]}1"은 ${rows[0]}줄 1번째 칸이에요. 뜻: ${m}` };
  }
  const LOGIC = [
    { q: '민수, 지아, 하준, 서윤이가 한 줄로 섰어요.<br>· 서윤이는 맨 뒤예요.<br>· 하준이는 민수 바로 뒤예요.<br>· 민수는 지아보다 앞이에요.<br>맨 앞은 누구일까요?', ans: '민수', opts: ['민수', '지아', '하준', '서윤'] },
    { q: '빨강, 파랑, 노랑 상자 중 하나에 열쇠가 있어요. 셋 중 <b>한 상자만</b> 참말을 해요.<br>· 빨강: "열쇠는 여기 없어."<br>· 파랑: "열쇠는 노랑에 있어."<br>· 노랑: "파랑의 말은 거짓이야."<br>열쇠는 어느 상자에?', ans: '빨강', opts: ['빨강', '파랑', '노랑'] },
    { q: '가, 나, 다 중 한 명이 창문을 깼어요. <b>한 명만</b> 참말을 해요.<br>· 가: "나는 안 깼어."<br>· 나: "다가 깼어."<br>· 다: "나는 거짓말을 하고 있어."<br>창문을 깬 사람은?', ans: '가', opts: ['가', '나', '다'] },
    { q: '네 친구의 키를 비교해요.<br>· 예린이는 도현이보다 커요.<br>· 도현이는 수아보다 커요.<br>· 수아는 준호보다 커요.<br>· 예린이는 가장 커요.<br>세 번째로 큰 사람은?', ans: '수아', opts: ['예린', '도현', '수아', '준호'] }
  ];
  function logicRoom(hard) { const L = hard ? P(LOGIC.slice(1)) : P(LOGIC); return { t: '추리의 방', q: L.q, type: 'pick', opts: L.opts, ans: L.ans, hint: '하나씩 정답이라고 가정하고 말이 맞는지 따져 봐요.' }; }
  function seqC() { const x = P([() => { const k = R(2, 6); const t = [0, 1, 2, 3, 4].map(i => (k + i) ** 2); return { t, a: (k + 5) ** 2, h: '같은 수를 두 번 곱한 수예요.' }; }, () => { const a = R(1, 4), b = R(a + 1, a + 4); const t = [a, b]; while (t.length < 6) t.push(t[t.length - 1] + t[t.length - 2]); return { t, a: t[4] + t[5], h: '앞의 두 수를 더해요.' }; }, () => { const s = R(1, 3); const t = [s, s * 2, s * 6, s * 24]; return { t, a: s * 120, h: '곱하는 수가 2, 3, 4…로 커져요.' }; }])(); return { t: '규칙의 방', q: `빈칸에 알맞은 수는?<br><b class="eq">${x.t.join(', ')}, ?</b>`, ans: String(x.a), keep: x.a, hint: x.h }; }
  function remC() { const [ds, L] = P([[[3, 4, 5], 60], [[2, 3, 5], 30], [[4, 5, 6], 60], [[3, 5, 7], 105], [[2, 5, 7], 70]]); const r = R(1, Math.min(...ds) - 1); const k = Math.ceil((100 - r) / L); return { t: '나머지 자물쇠의 방', q: `<b class="eq">${ds.join(', ')}</b>(으)로 나누면 나머지가 모두 <b>${r}</b>인<br>가장 작은 <b>세 자리 수</b>는?`, ans: String(L * k + r), keep: L * k + r, hint: `${ds.join(', ')}의 최소공배수를 먼저 구해요.` }; }
  function finalRoom(rooms, a, b, opLabel) { const x = rooms[a].keep, y = rooms[b].keep; return { t: '마지막 문', q: `마지막 자물쇠는 <b>${a + 1}번 방의 답</b>과 <b>${b + 1}번 방의 답</b>을 ${opLabel}이에요.<br><span class="lsn-hint">앞에서 푼 답을 종이에 적어 두었나요?</span>`, ans: String(x + y), final: 1, hint: `${a + 1}번 방 답 + ${b + 1}번 방 답` }; }
  function makeRooms(band) {
    let r;
    if (band === 1) { r = [seqA(), timeA(), symA(), anagram()]; r[0].keep = +r[0].ans; r.push(finalRoom(r, 0, 2, '더한 수')); }
    else if (band === 2) { r = [seqBRoom(), timeB(), magic(), cipher(3), logicRoom(false)]; r.push(finalRoom(r, 0, 2, '더한 수')); }
    else { r = [seqC(), remC(), cipher(4), logicRoom(true)]; r.push(finalRoom(r, 0, 1, '더한 수')); }
    return r;
  }

  T.escape = function (a, ctx) {
    const st = ctx.stage, g0 = parseInt(Store.get().grade, 10) || 2;
    let band = Store.d('esc:band', g0 <= 2 ? 1 : g0 <= 4 ? 2 : 3), mins = [0, 15, 20, 25][band];
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    let rooms, cur, timer, hints;
    function intro() {
      clearTimers(); rooms = makeRooms(band); cur = 0; hints = 0;
      body.innerHTML = `<div class="center"><span class="lvl">${['', '1~2학년', '3~4학년', '5~6학년'][band]} · 방 ${rooms.length}개</span><div class="qbig">겨울방학 열쇠를 찾아라!</div><p class="expl">교실 문이 잠겼어요. 모둠이 함께 방의 문제를 풀어요. 앞 방의 답이 마지막 문에 다시 쓰이니 <b>푼 답을 종이에 꼭 적어 두세요.</b> 막히면 힌트를 눌러요. 누를 때마다 힌트가 하나씩 더 나와요(방마다 3개).</p><button class="btn huge dark" data-s>탈출 시작 (${mins}분)</button></div>`;
      $('[data-s]', body).onclick = () => { timer = makeTimer({ sec: mins * 60, onEnd: fail }); room(); timer.start(); };
    }
    function room() {
      const r = rooms[cur];
      body.innerHTML = `<div class="center" style="gap:14px;overflow:auto;justify-content:flex-start;padding-top:18px"><div style="display:flex;gap:24px;align-items:center"><div class="rooms">${rooms.map((x, i) => `<div class="roomdot ${i < cur ? 'open' : i === cur ? 'now' : ''}">${i + 1}</div>`).join('')}</div><div data-t></div></div><span class="lvl">${cur + 1}번 방 · ${r.t}</span><div class="qbig esc-q" style="font-size:clamp(22px,2.4vw,34px)">${r.q}</div>${r.svg ? `<div style="display:flex;gap:20px">${r.svg.map(([h, m]) => clockSVG(h, m)).join('')}</div>` : ''}<div data-lock></div><div class="ctrl"><button class="btn big dark" data-o>열기</button><button class="btn big" data-h>힌트 보기 (0/3)</button></div><div class="esc-hints" data-hl></div><div class="expl" data-msg></div></div>`;
      $('[data-t]', body).appendChild(timer.node);
      const lock = $('[data-lock]', body); let get;
      if (r.type === 'tiles') {
        let typed = []; const need = Array.from(r.ans).length;
        const w = el('<div style="display:flex;flex-direction:column;align-items:center;gap:12px"><div class="wordlock" data-shown style="min-height:72px">&nbsp;</div><div class="pieces" data-tiles style="flex-wrap:wrap;justify-content:center;max-width:760px"></div><button class="btn big" data-back>한 글자 지우기</button></div>');
        const shown = $('[data-shown]', w), tb = $('[data-tiles]', w);
        const paint = () => { shown.textContent = typed.map(k => r.tiles[k]).join('') || ' '; $$('button', tb).forEach((b, k) => b.disabled = typed.includes(k)); };
        r.tiles.forEach((ch, k) => { const b = el(`<button class="piece got" style="cursor:pointer">${esc(ch)}</button>`); b.onclick = () => { if (typed.length < need) { typed.push(k); beep('tick'); paint(); } }; tb.appendChild(b); });
        $('[data-back]', w).onclick = () => { typed.pop(); paint(); };
        lock.appendChild(w); paint(); get = () => typed.map(k => r.tiles[k]).join('') === r.ans;
      } else if (r.type === 'pick') {
        let sel = null; const w = el('<div class="choices" style="max-width:800px"></div>');
        r.opts.forEach(o => { const b = el(`<button class="choice">${esc(o)}</button>`); b.onclick = () => { sel = o; $$('.choice', w).forEach(x => x.style.borderColor = ''); b.style.borderColor = 'var(--ink)'; beep('tick'); }; w.appendChild(b); });
        lock.appendChild(w); get = () => sel === r.ans;
      } else {
        const v = Array(r.ans.length).fill(0), ds = el('<div class="dials"></div>');
        v.forEach((_, k) => { const d = el(`<div class="dial"><button aria-label="올리기">${ICON.up}</button><div class="dv">0</div><button aria-label="내리기">${ICON.down}</button></div>`); const [u, dn] = $$('button', d); const set = x => { v[k] = (x + 10) % 10; $('.dv', d).textContent = v[k]; d.classList.remove('roll'); void d.offsetWidth; d.classList.add('roll'); beep('tick'); }; u.onclick = () => set(v[k] + 1); dn.onclick = () => set(v[k] - 1); ds.appendChild(d); });
        lock.appendChild(ds); get = () => v.join('') === r.ans;
      }
      $('[data-o]', body).onclick = () => {
        if (get()) { beep('fan'); cur++; if (cur >= rooms.length) return win(); confetti(st); $('[data-msg]', body).textContent = `문이 열렸어요! 답 "${r.ans}"을(를) 종이에 적어 두세요.`; setTimeout(room, 1600); }
        else { beep('no'); $('[data-msg]', body).textContent = '아직 안 열려요. 모둠이 함께 다시 생각해 봐요.'; lock.animate([{ transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'none' }], 300); }
      };
      const hs = hintsOf(r); r.hints = hs; let hn = 0;
      $('[data-h]', body).onclick = e => { if (hn >= hs.length) return; const hl = $('[data-hl]', body); hl.insertAdjacentHTML('beforeend', `<p><b>힌트 ${hn + 1}</b>${esc(hs[hn])}</p>`); hn++; hints++; beep('pop'); e.currentTarget.textContent = hn >= hs.length ? '힌트를 다 봤어요' : `힌트 하나 더 (${hn}/${hs.length})`; e.currentTarget.disabled = hn >= hs.length; };
    }
    function win() { const left = timer.left(); timer.stop(); body.innerHTML = `<div class="center"><div class="qhuge" style="font-size:clamp(60px,9vw,130px)">탈출 성공!</div><p class="expl">남은 시간 ${Math.floor(left / 60)}분 ${left % 60}초, 힌트 ${hints}번 사용</p><button class="btn big dark" data-a>새 문제로 다시</button></div>`; confetti(st); setTimeout(() => confetti(st), 600); $('[data-a]', body).onclick = intro; }
    function fail() { body.innerHTML = `<div class="center"><div class="qbig">시간이 다 됐어요</div><p class="expl">${cur}개의 방을 열었어요. 새 문제로 다시 도전해 볼까요?</p><button class="btn big dark" data-a>새 문제로 다시</button></div>`; $('[data-a]', body).onclick = intro; }
    const segB = (items, cur, on) => { const s = el('<div class="seg"></div>'); items.forEach(([v, t]) => { const b = el(`<button class="${v === cur ? 'on' : ''}">${t}</button>`); b.onclick = () => { $$('button', s).forEach(x => x.classList.remove('on')); b.classList.add('on'); on(v); }; s.appendChild(b); }); return s; };
    const lab = (t, n) => { const l = el(`<label class="f">${t}</label>`); l.appendChild(n); return l; };
    ctx.opts.append(lab('난이도 (학년)', segB([[1, '1~2학년'], [2, '3~4학년'], [3, '5~6학년']], band, v => { band = v; Store.set('esc:band', v); mins = [0, 15, 20, 25][v]; intro(); })), lab('제한 시간', segB([[10, '10분'], [15, '15분'], [20, '20분'], [25, '25분'], [30, '30분']], mins, v => { mins = v; intro(); })), el('<p class="hint">시작할 때마다 수, 낱말, 암호표가 새로 바뀌어요. 1~2학년: 규칙·시간·그림 암호·낱말 / 3~4학년: 규칙·시각 계산·마법 네모·좌표 암호·추리 / 5~6학년: 수열·나머지·좌표 암호·논리 추리. 마지막 문은 앞에서 푼 답을 이용해요.</p>'));
    const kb = el('<button class="btn dark">선생님 정답지 인쇄</button>');
    kb.onclick = () => printPages(answerKeyPages(a, a.name, rooms.map((r, k) => [`${k + 1}번 방 · ${r.t}: ${r.q}`, `${r.ans}   (힌트: ${hintsOf(r).join(' → ')})`]), '지금 준비된 방 문제의 정답이에요. "새 문제로 다시"나 난이도를 바꾸면 문제가 바뀌니, 인쇄한 뒤에는 그대로 시작하세요.', 6));
    ctx.opts.append(kb);
    intro();
  };

  /* 그림 퀴즈: 진짜 그림으로 */
  const PICS = [['snowman', '눈사람'], ['penguin', '펭귄'], ['bungeo', '붕어빵'], ['sled', '썰매'], ['mittens', '장갑'], ['gyul', '귤'], ['xmastree', '크리스마스트리'], ['skate', '스케이트'], ['polarbear', '북극곰'], ['sheep', '양'], ['mailbox', '우체통']];
  T.zoom = function (a, ctx) {
    const st = ctx.stage, STEPS = 5;
    let items = shuffle(PICS).map(([f, n]) => ({ src: `img/quiz/${f}.jpg`, name: n })), i = 0, step = 0, mode = 'mix';
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    function show() {
      const it = items[i]; step = 0;
      const m = mode === 'mix' ? ['zoom', 'shadow', 'mosaic'][i % 3] : mode;
      body.innerHTML = `<div class="center"><div class="qcount">${i + 1} / ${items.length} · ${{ zoom: '확대해서 보기', shadow: '그림자로 보기', mosaic: '모자이크로 보기' }[m]} · 지금 맞히면 <b data-pt style="color:var(--c)">${STEPS}점</b></div><div class="zoombox">${m === 'zoom' ? `<div class="zin"><img src="${it.src}" alt=""></div>` : '<canvas></canvas>'}</div><div class="ans hide">${esc(it.name)}</div><div class="ctrl"><button class="btn big dark" data-m>조금 더 보기</button><button class="btn big" data-r>정답 보기</button><button class="btn big" data-n>다음 ${ICON.next}</button></div></div>`;
      const ox = R(25, 75), oy = R(25, 75), zin = $('.zin', body), cv = $('canvas', body);
      let img = new Image();
      const render = () => {
        const k = 1 - step / STEPS;
        if (zin) { zin.style.transformOrigin = `${ox}% ${oy}%`; zin.style.transform = `scale(${1 + k * 7})`; }
        if (cv && img.complete && img.naturalWidth) {
          const w = cv.width = cv.clientWidth, h = cv.height = cv.clientHeight, g = cv.getContext('2d');
          const r0 = Math.min(w / img.width, h / img.height), dw = img.width * r0, dh = img.height * r0, dx = (w - dw) / 2, dy = (h - dh) / 2;
          g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
          if (m === 'mosaic') { const px = Math.max(1, Math.round(70 * k * k)); const t = document.createElement('canvas'); t.width = Math.max(1, Math.ceil(dw / px)); t.height = Math.max(1, Math.ceil(dh / px)); t.getContext('2d').drawImage(img, 0, 0, t.width, t.height); g.imageSmoothingEnabled = false; g.drawImage(t, dx, dy, dw, dh); }
          else {
            g.drawImage(img, dx, dy, dw, dh);
            if (step < STEPS) { const d = g.getImageData(0, 0, w, h), p = d.data; const reveal = step / STEPS; for (let j = 0; j < p.length; j += 4) { const bright = p[j] + p[j + 1] + p[j + 2]; if (bright < 700) { const tone = Math.round(40 + reveal * 60); p[j] = p[j] * reveal * .6 + tone * (1 - reveal * .6); p[j + 1] = p[j + 1] * reveal * .6 + tone * (1 - reveal * .6); p[j + 2] = p[j + 2] * reveal * .6 + (tone + 30) * (1 - reveal * .6); } } g.putImageData(d, 0, 0); }
          }
        }
        $('[data-pt]', body).textContent = Math.max(1, STEPS - step) + '점';
      };
      img.onload = render; img.src = it.src;
      if (zin) render();
      $('[data-m]', body).onclick = () => { step = Math.min(STEPS, step + 1); render(); beep('pop'); };
      $('[data-r]', body).onclick = () => { step = STEPS; render(); $('.ans', body).classList.remove('hide'); beep('ok'); };
      $('[data-n]', body).onclick = () => { i = (i + 1) % items.length; if (i === 0) items = shuffle(items); show(); };
    }
    const segB = (list, cur, on) => { const s = el('<div class="seg"></div>'); list.forEach(([v, t]) => { const b = el(`<button class="${v === cur ? 'on' : ''}">${t}</button>`); b.onclick = () => { $$('button', s).forEach(x => x.classList.remove('on')); b.classList.add('on'); on(v); }; s.appendChild(b); }); return s; };
    const lab = (t, n) => { const l = el(`<label class="f">${t}</label>`); l.appendChild(n); return l; };
    const fi = el('<input type="file" accept="image/*" multiple>');
    fi.onchange = () => { const fs = Array.from(fi.files); if (!fs.length) return; items = shuffle(fs.map(f => ({ src: URL.createObjectURL(f), name: f.name.replace(/\.[^.]+$/, '') }))); i = 0; show(); toast(`사진 ${fs.length}장을 넣었어요`); };
    const back = el('<button class="btn">기본 겨울 그림으로</button>'); back.onclick = () => { items = shuffle(PICS).map(([f, n]) => ({ src: `img/quiz/${f}.jpg`, name: n })); i = 0; show(); };
    ctx.opts.append(lab('보는 방법', segB([['mix', '섞어서'], ['zoom', '확대'], ['shadow', '그림자'], ['mosaic', '모자이크']], 'mix', v => { mode = v; show(); })), lab('우리 반 사진 넣기 (선택)', fi), el('<p class="hint">기본으로 겨울 그림 11장이 나와요. 사진을 넣으면 파일 이름이 정답이 돼요. (예: 운동회.jpg)</p>'), back);
    show();
  };
})();
