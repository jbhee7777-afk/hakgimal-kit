/* 새 활동지 디자인과 활동 고치기 (1부: 활동지) */
(function () {
  const B = window.SHEET_BLOCKS, T = window.TOOLS;
  const A = n => ACTS.find(a => a.n === n);
  const ed = s => `<span contenteditable="true" spellcheck="false">${s}</span>`;
  const L = n => Array.from({ length: n }, () => '<div class="ln"></div>').join('');
  const NOTE_COL = ['#FFF4B8', '#FFDDE6', '#D9F2E3', '#DCEBFF'];
  const STAR = (n, c) => `<svg viewBox="0 0 60 60" style="width:58px;height:58px;flex:none"><path d="M30 4l7.6 15.6 17.2 2.5-12.4 12.1 2.9 17.1L30 43.2 14.7 51.3l2.9-17.1L5.2 22.1l17.2-2.5z" fill="${c || '#FFE48A'}" stroke="#E3A400" stroke-width="2.5" stroke-linejoin="round"/>${n ? `<text x="30" y="37" text-anchor="middle" font-family="Miso" font-weight="700" font-size="18" fill="#A06A00">${n}</text>` : ''}</svg>`;
  const HEART = c => `<svg viewBox="0 0 24 24" style="width:18px;height:18px;flex:none"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" fill="${c || '#FF9DB5'}"/></svg>`;

  /* 모두가 한 명씩 받도록 짝 정하기 (자기 자신은 안 뽑혀요) */
  window.pairMap = function (key, reset) {
    const names = Store.roster(); if (names.length < 2) return null;
    let m = reset ? null : Store.d('map:' + key, null);
    if (!m || Object.keys(m).length !== names.length || names.some(n => !m[n])) {
      let s; do { s = shuffle(names); } while (s.some((x, i) => x === names[i]));
      m = Object.fromEntries(names.map((n, i) => [n, s[i]])); Store.set('map:' + key, m);
    }
    return m;
  };

  /* ── 포스트잇 쪽지 (한 장에 4명) ── */
  B.postits = b => `<div data-nofill class="notes4">${(b.notes || [{}, {}, {}, {}]).map((x, i) => `<div class="note" style="background:${NOTE_COL[i % 4]}"><i class="tape"></i><div class="nt">${esc(b.title)}</div><div class="nto">To. <b>${esc(x.to || '')}</b><i></i></div><div class="nlines">${L(b.lines || 5)}</div><div class="nfrom">From. <b>${esc(x.from || '')}</b>${x.from ? '' : '<i></i>'}</div></div>`).join('')}</div>`;
  /* 한 사람이 한 장: 내가 네 친구에게 쓰고, 나도 네 친구에게서 받아요 */
  window.pairMulti = function (key, reset) {
    const names = Store.roster(); if (names.length < 2) return null;
    let order = reset ? null : Store.d('ring:' + key, null);
    if (!order || order.length !== names.length || names.some(n => !order.includes(n))) { order = shuffle(names); Store.set('ring:' + key, order); }
    const k = Math.min(4, names.length - 1), m = {};
    order.forEach((w, i) => { m[w] = Array.from({ length: k }, (_, j) => order[(i + j + 1) % order.length]); });
    return m;
  };
  function notePages(a, title, key, hint, lines) {
    const m = pairMulti(key), names = Store.roster(), out = [];
    if (m) names.forEach(w => { const p = pageFrame(a, a.name, hint, { noName: true }); p.insertAdjacentHTML('beforeend', B.postits({ title, lines, notes: [0, 1, 2, 3].map(j => ({ to: m[w][j] || '', from: w })) })); out.push(p); });
    else for (let k = 0; k < 24; k++) { const p = pageFrame(a, a.name, hint, { noName: true }); p.insertAdjacentHTML('beforeend', B.postits({ title, lines })); out.push(p); }
    return out;
  }
  window.notePages = notePages;

  /* ── 비밀 천사 응원 쪽지 ── */
  B.cheer = () => `<div class="notes4">${[0, 1, 2, 3].map(i => `<div class="note cheer" style="background:${['#FFF7E8', '#F3EDFF', '#EAF7FF', '#FFF0F4'][i]}"><div class="cw"><svg viewBox="0 0 120 40" style="width:120px;height:40px"><path d="M60 22c-10-14-34-18-50-6 12 0 22 4 26 10-10-2-20 0-26 6 16-2 34 2 50-10z" fill="#fff" stroke="#B9A6E8" stroke-width="2"/><path d="M60 22c10-14 34-18 50-6-12 0-22 4-26 10 10-2 20 0 26 6-16-2-34 2-50-10z" fill="#fff" stroke="#B9A6E8" stroke-width="2"/><circle cx="60" cy="22" r="5" fill="#FFE48A"/></svg></div><div class="nt">${i + 1}일째 응원 쪽지</div><div class="nto">To. <i></i></div><div class="nlines">${L(4)}</div><div class="nfrom">너의 비밀 천사가 ${HEART()}</div></div>`).join('')}</div>`;

  /* ── 반짝이는 점 카드 (모두 한 장씩 받아요) ── */
  B.shine = b => `<div data-nofill class="shine2">${(b.cards || [{}, {}]).map(x => `<div class="shine"><div class="shh">${STAR('', '#FFE48A')}<div><b>${x.to ? esc(x.to) : '<i class="blank"></i>'}</b>의 반짝이는 점 3가지</div>${STAR('', '#FFC9D6')}</div><div class="shby">찾은 친구 · ${x.from ? esc(x.from) : '<i class="blank"></i>'}</div>${[1, 2, 3].map(k => `<div class="shrow">${STAR(k)}<div class="nlines" style="flex:1">${L(2)}</div></div>`).join('')}<div class="shfoot">다 쓰면 친구에게 직접 읽어 주고 건네요</div></div>`).join('')}</div>`;

  /* ── 모둠 좋은 말 사전 ── */
  B.dict2 = b => `<div class="dhead"><div class="dtitle">${b.group ? esc(b.group) : '<i class="blank" style="width:90px"></i>'} 모둠 <b>좋은 말 사전</b></div><div class="dsub">한 사람이 한 낱말씩! 진짜 사전처럼 써요</div></div>
    <div data-nofill class="dgrid">${[1, 2, 3, 4].map(k => `<div class="dent"><div class="dword"><span>표제어</span><i></i></div><div class="dsay">[소리] <i></i></div>
      <div class="dmean"><b>뜻</b> 이 말은 이럴 때 써요.${L(2)}</div><div class="dex"><b>예문</b><div class="bubble">${L(1)}</div></div>
      <div class="drow"><div><b>비슷한 말</b> <i></i></div><div class="dpic">그림</div></div><div class="dby">쓴 사람 <i></i></div></div>`).join('')}</div>`;

  /* ── 좋은 말 사전 한 쪽 (한 사람이 한 장, 세 칸만 써요) ── */
  B.dict3 = () => `<div data-nofill class="d3">
    <div class="d3-top"><div class="d3-tab"><span>첫 글자</span><i></i></div><div class="d3-word"><span>내가 고른 따뜻한 말</span><i class="d3w"></i></div></div>
    <div class="d3-q"><b>1</b><div><div class="d3-l">언제 하면 좋은 말일까요?</div><i class="d3-line"></i></div></div>
    <div class="d3-q"><b>2</b><div><div class="d3-l">이 말을 넣어 친구에게 말해 봐요.</div><div class="d3-bub"><i class="d3-line"></i></div></div></div>
    <div class="d3-q d3-grow"><b>3</b><div><div class="d3-l">이 말을 하는 장면을 그려요.</div><div class="d3-pic"></div></div></div>
    <div class="d3-foot">우리 반 좋은 말 사전 · 다 쓰면 선생님이 첫 글자 ㄱㄴㄷ 순서로 묶어요</div></div>`;

  /* ── 진짜 엽서 같은 인사 카드 ── */
  B.postcard = () => `<div data-nofill class="pcard"><div class="pc-top"><div class="pc-to">To. <i></i></div><div class="pc-stamp"><span>우표를 그려요</span></div><svg class="pc-post" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="#C9305A" stroke-width="3" opacity=".55"/><circle cx="60" cy="60" r="40" fill="none" stroke="#C9305A" stroke-width="1.5" opacity=".55"/><text x="60" y="56" text-anchor="middle" font-family="Miso" font-weight="700" font-size="15" fill="#C9305A" opacity=".7">2026. 12.</text><text x="60" y="76" text-anchor="middle" font-family="Miso" font-weight="700" font-size="14" fill="#C9305A" opacity=".7">우리 반 우체국</text></svg></div>
    <div class="pc-body"><div class="pc-lines">${L(9)}</div><div class="pc-side"><div class="polaroid"><div></div><span>함께한 장면</span></div><img src="img/cat2.png" alt=""></div></div>
    <div class="pc-bottom"><span>${HEART('#FF9DB5')}${HEART('#FFC23D')}${HEART('#9BD7B5')}</span><div class="pc-from">From. <i></i></div></div></div>`;

  /* ── 추억 포토카드 한 장 ── */
  B.photocard1 = () => `<div data-nofill class="pc1"><div class="pc1-hint">가운데 점선을 접으면 앞뒤가 있는 카드가 돼요. 바깥 굵은 선을 따라 오려요.</div><div class="pc1-card"><div class="pc1-front"><div class="pc1-photo"><span>내 얼굴을 그리거나 사진을 붙여요</span></div><div class="pc1-name"><i></i></div><div class="pc1-word"><span>나를 한 단어로!</span><i></i></div><div class="pc1-tag">2026 추억 카드</div></div><div class="pc1-back">${[['별명', 'star'], ['좋아하는 것', 'heart'], ['올해 최고의 순간', 'star'], ['내 꿈', 'heart'], ['친구들에게 한마디', 'star']].map(([t, ic]) => `<div class="pc1-row">${ic === 'star' ? STAR('', '#FFE48A').replace('58px;height:58px', '26px;height:26px') : HEART()}<b>${t}</b><i></i></div>`).join('')}</div></div></div>`;

  /* ── 새해 목표: 산 오르기 ── */
  B.goals = () => `<div data-nofill class="goalwrap"><svg viewBox="0 0 700 330" class="goalmt"><path d="M0 330 L250 60 L330 140 L470 20 L700 330 Z" fill="#E7F3EC"/><path d="M250 60 L285 98 L262 92 L240 104 L222 90Z M470 20 L505 66 L480 58 L458 72 L440 56Z" fill="#fff"/><path d="M80 320 C 200 300, 180 230, 300 220 S 380 150, 470 70" fill="none" stroke="#9AA6B8" stroke-width="4" stroke-dasharray="10 10"/>${[[150, 290, 1], [330, 205, 2], [468, 60, 3]].map(([x, y, n]) => `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 70}" stroke="#56627A" stroke-width="4"/><path d="M${x} ${y - 70} l46 14 -46 14z" fill="${['#FF9DB5', '#FFC23D', '#7CC6F2'][n - 1]}"/><text x="${x + 14}" y="${y - 52}" font-family="Miso" font-weight="700" font-size="16" fill="#1F2B45">${n}</text>`).join('')}<text x="560" y="300" font-family="Miso" font-size="15" fill="#56627A">한 걸음씩 올라가요!</text></svg>
    ${[1, 2, 3].map(n => `<div class="goalrow"><div class="gflag" style="background:${['#FFDDE6', '#FFF0C2', '#DCEFFD'][n - 1]}">목표 ${n}</div><div class="gtext"><div class="gl"><span>목표</span><i></i></div><div class="gl"><span>어떻게?</span><i></i></div><div class="gmon">${Array.from({ length: 12 }, (_, k) => `<span>${k + 1}월</span>`).join('')}</div></div></div>`).join('')}
    <div class="gsign">${HEART()} 나를 응원해 줄 사람 서명 <i></i><i></i></div></div>`;

  /* ── 나만의 소망 나무 (한 사람 한 장) ── */
  B.wishtree = () => `<div data-nofill class="wtree"><img src="img/tree.png" alt="">${[[18, 18], [62, 12], [6, 46], [74, 42], [40, 30]].map(([x, y], k) => `<div class="wtag" style="left:${x}%;top:${y}%"><span>소원 ${k + 1}</span><div class="wpic"></div>${L(2)}</div>`).join('')}</div><div class="box" data-grow style="height:150px"><span class="bl">가장 이루고 싶은 소원을 그림으로</span></div>`;

  /* ── 달력 표지 (글자와 그림이 겹치지 않게) ── */
  B.cover = () => `<div style="flex:1;border:3px solid var(--c);border-radius:24px;display:flex;flex-direction:column;padding:22px 26px;gap:12px">
      <div style="display:flex;align-items:center;gap:16px"><svg viewBox="0 0 470 150" style="flex:1;height:140px"><text x="0" y="128" font-family="Miso" font-weight="700" font-size="160" fill="none" stroke="var(--c)" stroke-width="4" letter-spacing="6">2027</text></svg><img src="img/sheep.png" alt="" style="height:140px"></div>
      <div style="font-size:17px;color:#56627A;background:var(--t);border-radius:14px;padding:8px 14px">${ed('2027년은 정미년, 붉은 양의 해예요. 숫자 안을 색칠하고, 아래 큰 칸에 새해 그림을 그려요.')}</div>
      <div style="flex:1;border:2px dashed #9AA6B8;border-radius:18px;position:relative"><span style="position:absolute;left:16px;top:12px;font-size:14px;color:#8A95A8">표지 그림 칸 (양, 해돋이, 새해 소망, 우리 가족…)</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:20px;font-weight:700"><span>__________ 의 2027 달력</span><span style="font-size:15px;color:#56627A;font-weight:400">올해의 한 마디: ____________</span></div></div>`;

  /* ── 팝업 카드 (자르는 선이 접는 선을 가로질러요) ── */
  B.popup = () => {
    const tab = (cx, w, l) => `<line x1="${cx - w / 2}" y1="${400 - l}" x2="${cx - w / 2}" y2="${400 + l}" stroke="#1F2B45" stroke-width="4"/><line x1="${cx + w / 2}" y1="${400 - l}" x2="${cx + w / 2}" y2="${400 + l}" stroke="#1F2B45" stroke-width="4"/><line x1="${cx - w / 2}" y1="${400 - l}" x2="${cx + w / 2}" y2="${400 - l}" stroke="#E2456B" stroke-width="3" stroke-dasharray="5 6"/><line x1="${cx - w / 2}" y1="${400 + l}" x2="${cx + w / 2}" y2="${400 + l}" stroke="#E2456B" stroke-width="3" stroke-dasharray="5 6"/>`;
    return `<div style="display:flex;flex-direction:column;gap:4px;font-size:15px;color:#56627A;background:var(--t);border-radius:14px;padding:10px 14px">
      <span><b style="color:#2366C2">① 파란 점선</b>을 따라 카드를 반으로 접어요.</span>
      <span><b style="color:#1F2B45">② 굵은 선</b>을 접은 채로 잘라요. 굵은 선은 파란 점선을 가로질러요!</span>
      <span><b style="color:#E2456B">③ 분홍 점선</b>을 접었다 편 뒤, 카드를 펼치며 받침을 안쪽으로 쏙 밀어 넣어요.</span></div>
      <svg viewBox="0 0 690 800" style="width:100%;flex:1"><rect x="2" y="2" width="686" height="796" rx="18" fill="#fff" stroke="#9AA6B8" stroke-width="2"/>
      <line x1="0" y1="400" x2="690" y2="400" stroke="#2366C2" stroke-width="2.5" stroke-dasharray="12 8"/>${tab(200, 120, 60)}${tab(480, 170, 90)}
      <text x="345" y="150" text-anchor="middle" font-family="Miso" font-size="22" fill="#8A95A8">카드 안쪽 윗면: 배경을 그려요</text>
      <text x="345" y="650" text-anchor="middle" font-family="Miso" font-size="22" fill="#8A95A8">카드 안쪽 아랫면: 새해 소망을 적어요</text></svg>
      <div class="cutgrid" style="grid-template-columns:repeat(4,1fr);flex:none;height:140px">${[1, 2, 3, 4].map((x, i) => `<div style="align-items:center;justify-content:center;color:#8A95A8;font-size:14px">${i ? '' : ICON.scissor}받침에 붙일 그림</div>`).join('')}</div>`;
  };

  /* ── 미래의 나 명함 ── */
  B.namecards = () => `<div data-nofill class="ncards">${Array.from({ length: 4 }, (_, i) => `<div class="ncard" style="--nc:${['#F4C3CF', '#BCDAF0', '#C6E5D0', '#F6DC9C'][i % 4]}"><div class="nc-band"><div class="nc-face"></div></div><div class="nc-main"><div class="nc-job"><span>미래의 직업</span><i></i></div><div class="nc-name"><i></i></div><div class="nc-do"><span>이런 일을 해요</span><i></i></div><div class="nc-ic">${STAR('', '#FFE48A').replace("58px;height:58px", "24px;height:24px")}<span>좋아하는 것</span><i></i></div></div></div>`).join('')}</div>`;

  /* ── 새 학년 응원 메달 ── */
  B.medals = () => `<div data-nofill class="medals">${[0, 1, 2, 3].map(i => { const c = ['#FF9DB5', '#7CC6F2', '#FFC23D', '#9BD7B5'][i]; return `<div class="medal"><svg viewBox="0 0 300 330"><path d="M110 0 L150 110 L190 0 L230 0 L170 140 L130 140 L70 0Z" fill="${c}" opacity=".85"/><circle cx="150" cy="210" r="112" fill="#fff" stroke="${c}" stroke-width="10"/><circle cx="150" cy="210" r="94" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="4 6"/><path id="mp${i}" d="M70 210 A80 80 0 0 1 230 210" fill="none"/><text font-family="Miso" font-weight="700" font-size="20" fill="#56627A"><textPath href="#mp${i}" startOffset="50%" text-anchor="middle">새 학년 응원 메달 · 2027</textPath></text></svg><div class="medal-in"><div class="mpic"></div>${L(2)}</div></div>`; }).join('')}</div>`;

  /* ── 손팻말: 모양 여러 가지 ── */
  const SIGN_SHAPES = [
    c => `<path d="M60 70 Q60 30 110 30 H590 Q640 30 640 70 V420 Q640 460 590 460 H300 L200 560 L220 460 H110 Q60 460 60 420Z" fill="${c}" stroke="#1F2B45" stroke-width="8"/>`,
    c => `<path d="M350 560 C120 420 40 320 60 210 C80 100 200 60 270 110 C310 140 340 170 350 190 C360 170 390 140 430 110 C500 60 620 100 640 210 C660 320 580 420 350 560Z" fill="${c}" stroke="#1F2B45" stroke-width="8"/>`,
    c => `<path d="M140 120 Q130 60 200 70 Q250 20 320 60 Q380 10 450 50 Q530 20 560 90 Q640 100 620 180 Q680 240 620 300 Q650 380 560 380 Q530 450 450 420 Q380 470 320 420 Q240 460 200 400 Q120 410 130 330 Q60 290 110 220 Q70 150 140 120Z" fill="${c}" stroke="#1F2B45" stroke-width="8"/>`,
    c => `<path d="M30 200 H110 L80 260 L110 320 H30 Z M670 200 H590 L620 260 L590 320 H670 Z" fill="${c}" stroke="#1F2B45" stroke-width="7" opacity=".7"/><rect x="90" y="150" width="520" height="220" rx="24" fill="${c}" stroke="#1F2B45" stroke-width="8"/>`,
    c => `<path d="M350 40 L420 190 L590 205 L465 320 L500 490 L350 405 L200 490 L235 320 L110 205 L280 190Z" fill="${c}" stroke="#1F2B45" stroke-width="8" stroke-linejoin="round"/>`
  ];
  const scallop = (cx, cy, r, n) => { let d = ''; for (let k = 0; k < n; k++) { const a1 = k / n * Math.PI * 2, a2 = (k + 1) / n * Math.PI * 2, am = (a1 + a2) / 2; const p = (a, rr) => `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`; d += (k ? ' ' : 'M' + p(a1, r)) + ` Q${p(am, r * 1.16)} ${p(a2, r)}`; } return d + 'Z'; };
  SIGN_SHAPES.push(
    /* 6 리본 배지 */
    c => `<path d="M250 380 L190 570 L250 530 L290 590 L330 420Z M450 380 L510 570 L450 530 L410 590 L370 420Z" fill="#fff" stroke="#1F2B45" stroke-width="7" stroke-linejoin="round"/><path d="${scallop(350, 250, 215, 18)}" fill="${c}" stroke="#1F2B45" stroke-width="8"/><circle cx="350" cy="250" r="168" fill="#fff" stroke="#1F2B45" stroke-width="4" stroke-dasharray="10 10"/>`,
    /* 7 화살표 표지판 */
    c => `<rect x="335" y="360" width="30" height="220" rx="8" fill="#fff" stroke="#1F2B45" stroke-width="7"/><path d="M40 160 H520 L660 260 L520 360 H40 Q20 360 20 340 V180 Q20 160 40 160Z" fill="${c}" stroke="#1F2B45" stroke-width="8" stroke-linejoin="round"/><circle cx="70" cy="260" r="12" fill="#fff" stroke="#1F2B45" stroke-width="5"/>`,
    /* 8 구름 말풍선 */
    c => `<path d="M170 400 Q70 400 70 320 Q30 260 90 210 Q90 120 190 120 Q240 50 330 80 Q420 30 490 90 Q600 80 610 180 Q680 230 640 300 Q650 400 540 400 H300 L200 520 L220 400Z" fill="${c}" stroke="#1F2B45" stroke-width="8" stroke-linejoin="round"/>`,
    /* 9 깃발 줄 + 현수막 */
    c => `<path d="M20 60 Q350 140 680 60" fill="none" stroke="#1F2B45" stroke-width="5"/>${[0, 1, 2, 3, 4, 5, 6].map(k => { const x = 50 + k * 90, y = 60 + Math.sin(k / 6 * Math.PI) * 52; return `<path d="M${x} ${y} L${x + 70} ${y + 4} L${x + 35} ${y + 70}Z" fill="${k % 2 ? '#fff' : c}" stroke="#1F2B45" stroke-width="4" stroke-linejoin="round"/>`; }).join('')}<rect x="60" y="190" width="580" height="250" rx="30" fill="${c}" stroke="#1F2B45" stroke-width="8"/><rect x="84" y="214" width="532" height="202" rx="18" fill="none" stroke="#fff" stroke-width="5"/>`,
    /* 10 입장권 */
    c => `<path d="M60 130 H640 V230 A40 40 0 0 0 640 310 V410 H60 V310 A40 40 0 0 0 60 230Z" fill="${c}" stroke="#1F2B45" stroke-width="8" stroke-linejoin="round"/><line x1="160" y1="140" x2="160" y2="400" stroke="#1F2B45" stroke-width="4" stroke-dasharray="12 10"/><text x="110" y="280" text-anchor="middle" font-family="Miso" font-weight="700" font-size="30" fill="#1F2B45" transform="rotate(-90 110 270)">입 장 권</text>`,
    /* 11 사진 틀 (얼굴을 넣어 찍어요) */
    c => `<path d="M40 40 H660 V560 H40Z M150 120 V400 H550 V120Z" fill="${c}" fill-rule="evenodd" stroke="#1F2B45" stroke-width="8"/><rect x="150" y="120" width="400" height="280" fill="none" stroke="#1F2B45" stroke-width="4" stroke-dasharray="12 10"/><text x="350" y="270" text-anchor="middle" font-family="Miso" font-size="22" fill="#8A95A8">이 칸은 오려 내요</text>`,
    /* 12 하트 두 개 */
    c => `<path d="M230 470 C70 370 20 290 40 210 C60 130 160 110 220 170 C280 110 380 130 400 210 C420 290 370 370 230 470Z" fill="#fff" stroke="#1F2B45" stroke-width="7"/><path d="M450 540 C250 420 190 320 210 220 C230 120 360 90 450 170 C540 90 670 120 690 220 C710 320 650 420 450 540Z" fill="${c}" stroke="#1F2B45" stroke-width="8"/>`
  );
  const SIGN_TY = [250, 290, 250, 265, 310, 255, 265, 255, 320, 275, 480, 330];
  const SIGN_X = [350, 350, 350, 350, 350, 350, 330, 350, 350, 400, 350, 455];
  window.signPages = function (a, texts) {
    const cols = ['#FFE48A', '#FFC9D6', '#CBEAFF', '#D2F0DC', '#E6DAFF'];
    return texts.map((s, i) => { const k = i % SIGN_SHAPES.length, p = el(`<div class="page" style="${catVars(catOf(a))};justify-content:center;align-items:center;padding:30px"></div>`);
      const W = [520, 380, 440, 480, 230, 250, 440, 480, 500, 430, 540, 270][k], H = [300, 240, 260, 190, 190, 220, 180, 260, 220, 240, 120, 210][k];
      let lines = [s]; if (k !== 10 && s.length > 5 && s.includes(' ')) { const mid = s.length / 2; let best = -1; [...s].forEach((ch, j) => { if (ch === ' ' && (best < 0 || Math.abs(j - mid) < Math.abs(best - mid))) best = j; }); lines = [s.slice(0, best), s.slice(best + 1)]; }
      const long = Math.max(...lines.map(x => x.replace(/[ !?.♥]/g, '').length + (x.match(/[ !?.♥]/g) || []).length * .45));
      const fs = Math.round(Math.min(120, W / long, H / (lines.length * 1.15))), ty = SIGN_TY[k] - (lines.length - 1) * fs * .58;
      p.innerHTML = `<svg viewBox="0 0 700 600" style="width:100%;height:auto">${SIGN_SHAPES[k](cols[i % cols.length])}<text text-anchor="middle" font-family="Miso" font-weight="700" font-size="${fs}" fill="#1F2B45">${lines.map((x, j) => `<tspan x="${SIGN_X[k]}" y="${ty + fs / 3 + j * fs * 1.16}">${esc(x)}</tspan>`).join('')}</text></svg><div style="font-size:16px;color:#8A95A8;margin-top:20px">굵은 선을 따라 오려 막대에 붙여요</div>`; return p; });
  };

  /* ── 겨울방학 안내문 (함께 채우는 안내문) ── */
  B.notice = () => { const m = Store.get(); const ic = (c, d) => `<span class="nic" style="background:${c}">${d}</span>`;
    return `<div data-nofill class="nt2">
      <div class="nt-hero"><img src="img/cat6.png" alt=""><div><b>${ed('신나고 안전한 겨울방학')}</b><span>${ed('학부모님, 한 해 동안 함께해 주셔서 고맙습니다. 아이들과 함께 정한 방학 약속을 꼭 함께 읽어 주세요.')}</span></div></div>
      <div class="nt-cal">${[['방학식', '2026. 12. ___ ( )'], ['방학 기간', '12. ___ ~ 2. ___'], ['개학일', '2027. ___. ___ ( )']].map(([k, v]) => `<div><b>${k}</b><span>${ed(v)}</span></div>`).join('')}</div>
      <div class="nt-grid">
        <div class="nt-sec">${ic('#FFDDE6', '안전')}<ul><li>${ed('빙판길은 손을 빼고 천천히')}</li><li>${ed('얼음 언 강·저수지에 들어가지 않기')}</li><li>${ed('난로 근처에 물건 두지 않기')}</li><li>${ed('인터넷에 내 정보 알려 주지 않기')}</li></ul></div>
        <div class="nt-sec">${ic('#D9F2E3', '생활')}<ul><li>${ed('일찍 자고 일찍 일어나기')}</li><li>${ed('하루 30분 책 읽기')}</li><li>${ed('집안일 한 가지 맡기')}</li><li>${ed('게임·영상은 정한 시간만')}</li></ul></div>
      </div>
      <div class="nt-ours"><div class="nt-h">${ic('#FFF0C2', '우리 반')} 아이들과 함께 정한 방학 약속</div>${[1, 2, 3].map(k => `<div class="nt-line"><b>${k}</b><i></i></div>`).join('')}</div>
      <div class="nt-grid"><div class="nt-sec">${ic('#DCEBFF', '준비물')}<div>${ed('방학 과제, 실내화, 필통, 알림장')}</div></div><div class="nt-sec">${ic('#F3EDFF', '도움')}<div>${ed('위험할 땐 112(경찰) · 119(소방·구급)')}</div></div></div>
      <div class="nt-sign">${ed('2026년 12월 ___일')} &nbsp; <b>${ed(esc((m.school || '○○초등학교') + ' ' + (m.grade ? m.grade + '학년 ' : '') + (m.cls ? m.cls + '반 ' : '') + '담임 ' + (m.teacher || '○○○')))}</b></div></div>`; };
})();
