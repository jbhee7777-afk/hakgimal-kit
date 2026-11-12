/* 인쇄 활동지 만들기 */
(function () {
  const L = n => Array.from({ length: n }, () => '<div class="ln"></div>').join('');
  const ed = (s, cls) => `<span contenteditable="true" spellcheck="false" ${cls ? `class="${cls}"` : ''}>${s}</span>`;
  const cbox = '<svg viewBox="0 0 20 20" style="width:20px;height:20px;flex:none"><rect x="2" y="2" width="16" height="16" rx="3" fill="none" stroke="#56627A" stroke-width="1.8"/></svg>';
  const circ = '<svg viewBox="0 0 30 30" style="width:28px;height:28px;margin:auto"><circle cx="15" cy="15" r="11" fill="none" stroke="#8A95A8" stroke-width="1.8"/></svg>';

  window.nameLine = function () {
    const m = Store.get();
    return `<div class="pname">${m.grade ? esc(m.grade) : '<i style="width:34px"></i>'}학년 ${m.cls ? esc(m.cls) : '<i style="width:34px"></i>'}반 <i style="width:34px"></i>번 이름 <i></i></div>`;
  };

  window.pageFrame = function (a, title, guide, opt) {
    opt = opt || {};
    const c = catOf(a);
    const p = el(`<div class="page" data-act="${a.n}" style="${catVars(c)}"><div class="ph"><div class="pnum">${esc(c.name)} · 활동 ${a.no}</div><div class="pt">${ed(esc(title || a.name))}</div><img class="psticker" src="img/cat${c.id}.png" alt=""></div>${opt.noName ? '' : `<div class="pmeta">${nameLine()}</div>`}${guide ? `<p class="pg">${ed(esc(guide))}</p>` : ''}</div>`);
    return p;
  };

  const WEATHER = {
    sun: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="8" fill="#FFD55C" stroke="#E3A400" stroke-width="2"/><g stroke="#E3A400" stroke-width="2.4" stroke-linecap="round"><path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5L32 32M8 32l3.5-3.5M28.5 11.5L32 8"/></g></svg>',
    part: '<svg viewBox="0 0 40 40"><circle cx="15" cy="14" r="7" fill="#FFD55C" stroke="#E3A400" stroke-width="2"/><path d="M12 31h19a6 6 0 0 0 0-12 8 8 0 0 0-15 2 5 5 0 0 0-4 10z" fill="#fff" stroke="#7D8AA3" stroke-width="2"/></svg>',
    cloud: '<svg viewBox="0 0 40 40"><path d="M10 29h21a7 7 0 0 0 0-14 9 9 0 0 0-17 2 6 6 0 0 0-4 12z" fill="#E4E9F1" stroke="#7D8AA3" stroke-width="2"/></svg>',
    rain: '<svg viewBox="0 0 40 40"><path d="M10 23h21a7 7 0 0 0 0-14 9 9 0 0 0-17 2 6 6 0 0 0-4 12z" fill="#E4E9F1" stroke="#7D8AA3" stroke-width="2"/><g stroke="#3D8BFF" stroke-width="2.4" stroke-linecap="round"><path d="M14 28l-2 5M21 28l-2 5M28 28l-2 5"/></g></svg>',
    snow: '<svg viewBox="0 0 40 40"><g stroke="#3D8BFF" stroke-width="2.4" stroke-linecap="round"><path d="M20 5v30M7 12.5l26 15M7 27.5l26-15"/><path d="M16 7l4 3 4-3M16 33l4-3 4 3"/></g></svg>',
    storm: '<svg viewBox="0 0 40 40"><path d="M10 22h21a7 7 0 0 0 0-14 9 9 0 0 0-17 2 6 6 0 0 0-4 12z" fill="#CFD6E2" stroke="#56627A" stroke-width="2"/><path d="M21 22l-5 8h5l-3 7 8-10h-5l3-5z" fill="#FFC23D" stroke="#E3A400" stroke-width="1.4" stroke-linejoin="round"/></svg>'
  };
  window.WEATHER = WEATHER;

  const B = {
    lines: b => `<div class="lines">${b.label ? `<div class="blk-label">${ed(esc(b.label))}</div>` : ''}${L(b.n)}</div>`,
    box: b => `<div class="box" data-grow style="height:${b.h}px">${b.label ? `<span class="bl">${ed(esc(b.label))}</span>` : ''}</div>`,
    two: b => `<div class="two">${b.items.map(render).join('')}</div>`,
    table(b) {
      const rows = typeof b.rows === 'number' ? Array(b.rows).fill('') : b.rows;
      const w = b.widths ? `<colgroup>${b.widths.map(x => `<col style="width:${x}%">`).join('')}</colgroup>` : '';
      return `<table class="pt">${w}<tr>${b.head.map(x => `<th>${ed(esc(x))}</th>`).join('')}</tr>${rows.map(r => `<tr data-grow style="height:${b.h}px">${typeof b.rows === 'number' ? b.head.map(() => '<td></td>').join('') : `<td class="lab">${ed(esc(r))}</td>${b.head.slice(1).map(() => '<td></td>').join('')}`}</tr>`).join('')}</table>`;
    },
    rank: b => Array.from({ length: b.n }, (_, i) => `<div data-grow style="display:flex;gap:16px;align-items:stretch;height:${b.h}px"><div style="width:54px;display:grid;place-items:center;font-size:${i ? 34 : 44}px;font-weight:700;color:var(--c)">${i + 1}</div><div class="box" style="width:${i ? 150 : 170}px"></div><div class="lines" style="flex:1;display:flex;flex-direction:column;justify-content:flex-end">${L(2)}</div></div>`).join(''),
    grid: b => `<div style="display:grid;grid-template-columns:repeat(${b.cols},1fr);gap:18px">${Array.from({ length: b.cols * b.rows }, (_, i) => `<div><div class="box" data-grow style="height:${b.h - (b.cap ? 50 : 0)}px"><span class="bl">${i + 1}</span></div>${b.cap ? '<div class="lines">' + L(1) + '</div>' : ''}</div>`).join('')}</div>`,
    qa: b => b.items.map((q, i) => `<div class="lines"><div class="blk-label">${ed(esc(q))}</div>${L(b.lines)}</div>`).join(''),
    bars: b => `<div style="display:flex;gap:18px;font-size:14px;color:#56627A;align-items:center"><span style="display:inline-flex;gap:6px;align-items:center"><i style="width:22px;height:14px;background:var(--t);border:1.5px solid #9AA6B8;display:inline-block"></i>3월의 나 (연하게)</span><span style="display:inline-flex;gap:6px;align-items:center"><i style="width:22px;height:14px;background:var(--c);display:inline-block"></i>지금의 나 (진하게)</span></div>
      <div style="display:flex;flex-direction:column;gap:14px">${b.items.map(it => `<div style="display:grid;grid-template-columns:110px 1fr;gap:12px;align-items:center"><b style="font-size:19px">${ed(esc(it))}</b><div style="display:flex;flex-direction:column;gap:5px">${[0, 1].map(() => `<div style="display:grid;grid-template-columns:repeat(10,1fr);border:1.5px solid #9AA6B8;height:34px">${Array(10).fill('<i style="border-right:1px solid #CDD5E1"></i>').join('')}</div>`).join('')}</div></div>`).join('')}</div>
      <div style="display:grid;grid-template-columns:110px 1fr;gap:12px;font-size:13px;color:#8A95A8"><span></span><div style="display:flex;justify-content:space-between"><span>조금</span><span>보통</span><span>아주 많이</span></div></div>`,
    weather: b => `<div style="display:flex;gap:22px;justify-content:center;font-size:14px;color:#56627A">${[['sun', '아주 좋아요'], ['part', '좋아요'], ['cloud', '그저 그래요'], ['rain', '슬펐어요'], ['snow', '설렜어요'], ['storm', '화났어요']].map(([k, t]) => `<span style="display:flex;flex-direction:column;align-items:center;gap:2px"><span style="width:38px;height:38px">${WEATHER[k]}</span>${t}</span>`).join('')}</div>
      <table class="pt"><tr><th style="width:12%">달</th><th style="width:44%">그달의 내 마음 날씨 (동그라미)</th><th>그 까닭</th></tr>${b.months.map(m => `<tr data-grow style="height:76px"><td class="lab">${m}</td><td><div style="display:flex;justify-content:space-around">${Object.values(WEATHER).map(s => `<span style="width:40px;height:40px;opacity:.85">${s}</span>`).join('')}</div></td><td></td></tr>`).join('')}</table>`,
    letter: b => `<div style="border:2px solid #9AA6B8;border-radius:18px;padding:22px 28px;flex:1;display:flex;flex-direction:column;gap:2px">
      ${b.pick ? `<div style="display:flex;gap:22px;font-size:17px;margin-bottom:8px">누구에게 쓸까요? ${b.pick.map(p => `<span style="display:inline-flex;gap:6px;align-items:center">${cbox}${p}</span>`).join('')}</div>` : ''}
      <div style="font-size:21px;font-weight:700;display:flex;gap:8px;align-items:flex-end;height:44px;border-bottom:1.5px solid #B8C1CF">${b.to ? ed(esc(b.to)) : '<span style="color:#8A95A8">____________</span>에게'}</div>
      <div class="lines">${L(b.lines)}</div>
      <div style="margin-top:auto;display:flex;justify-content:space-between;font-size:18px;padding-top:12px">${b.open ? '<span>열어 볼 날: ______년 ___월 ___일</span>' : '<span>2026년 ___월 ___일</span>'}<span>__________ 씀</span></div></div>`,
    cards: b => `<div class="cutgrid" style="grid-template-columns:repeat(${b.cols},1fr);grid-template-rows:repeat(${b.rows},minmax(0,1fr))">${Array.from({ length: b.cols * b.rows }, (_, i) => `<div>${i === 0 ? ICON.scissor : ''}<div class="ct">${ed(esc(b.title))}</div>${b.fields.map(f => `<div class="cf">${f ? `<span>${ed(esc(f))}</span>` : ''}<i></i></div>`).join('')}</div>`).join('')}</div>`,
    news: () => `<div style="border-top:5px double #1F2B45;border-bottom:2px solid #1F2B45;padding:8px 0;display:flex;justify-content:space-between;align-items:flex-end"><b style="font-size:40px;letter-spacing:-1px">${ed('우리 반 추억 신문')}</b><span style="font-size:15px">2026년 ___월 ___일 &nbsp; 기자 __________</span></div>
      <div class="lines"><div class="blk-label">큰 제목</div>${L(1)}</div>
      <div style="display:grid;grid-template-columns:1.1fr 1fr;gap:20px"><div class="box" style="height:250px"><span class="bl">사진 또는 그림</span></div><div class="lines"><div class="blk-label">기사 (언제, 어디서, 누가, 무엇을)</div>${L(6)}</div></div>
      <div class="lines">${L(3)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px"><div class="lines"><div class="blk-label">작은 기사</div>${L(3)}</div><div class="lines"><div class="blk-label">친구 인터뷰 한마디</div>${L(3)}</div></div>`,
    photocard: () => `<div class="cutgrid" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr">${[0, 1].map(() => `<div style="align-items:center">${ICON.scissor}<div class="ct">앞면</div><div class="box" style="width:230px;flex:1"></div><b style="font-size:20px">${ed('2026 추억 카드')}</b></div><div><div class="ct">뒷면</div>${['이름', '별명', '올해 가장 좋았던 일', '좋아하는 것', '나에게 한마디'].map(f => `<div class="cf"><span>${f}</span><i></i></div>`).join('')}</div>`).join('')}</div>`,
    bookmarks: b => `<div class="cutgrid" style="grid-template-columns:repeat(5,1fr);grid-template-rows:1fr">${b.items.map((t, i) => `<div style="align-items:center;padding:20px 10px">${i === 0 ? ICON.scissor : ''}<svg viewBox="0 0 30 30" style="width:22px;height:22px"><circle cx="15" cy="15" r="8" fill="none" stroke="#8A95A8" stroke-width="2"/></svg><div style="writing-mode:vertical-rl;font-size:30px;font-weight:700;color:var(--c);letter-spacing:4px;margin:14px 0">${ed(esc(t))}</div><div style="flex:1;width:100%;border:1.5px dashed #CDD5E1;border-radius:10px"></div><span style="font-size:13px;color:#8A95A8;margin-top:8px">이름 ________</span></div>`).join('')}</div>`,
    album: () => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;padding-top:8px"><div class="box" style="height:360px"><span class="bl">사진이나 내 얼굴 그림</span></div><div style="display:flex;flex-direction:column;gap:6px">${['이름', '별명', '좋아하는 과목', '좋아하는 놀이', '나의 꿈'].map(f => `<div class="cf" style="display:flex;flex-direction:column"><span style="font-size:14px;color:#56627A">${f}</span><i style="display:block;height:34px;border-bottom:1.5px solid #B8C1CF"></i></div>`).join('')}</div></div>
      <div class="lines"><div class="blk-label">올해 가장 기억에 남는 일</div>${L(3)}</div><div class="lines"><div class="blk-label">친구들에게 남기는 한마디</div>${L(3)}</div>
      <div style="display:flex;gap:10px;align-items:center;font-size:15px;color:#56627A">친구들의 사인 <div style="flex:1;height:110px;border:1.5px dashed #9AA6B8;border-radius:12px"></div></div>`,
    dict: b => Array.from({ length: b.n }, () => `<div data-grow style="display:grid;grid-template-columns:200px 1fr;gap:18px;height:200px"><div class="box"><span class="bl">그림</span></div><div style="display:flex;flex-direction:column"><div style="display:flex;align-items:flex-end;gap:10px;height:44px;border-bottom:2px solid #1F2B45"><span style="font-size:14px;color:#56627A">낱말</span></div><div class="lines"><div style="font-size:14px;color:#56627A;margin-top:6px">뜻 (내 말로)</div>${L(3)}</div></div></div>`).join(''),
    rate: b => `<table class="pt"><tr><th style="width:46%">배운 것</th><th>잘해요</th><th>보통이에요</th><th>더 연습할래요</th></tr>${b.items.map(it => `<tr data-grow style="height:62px"><td style="font-weight:700">${ed(esc(it))}</td><td>${circ}</td><td>${circ}</td><td>${circ}</td></tr>`).join('')}</table>`,
    clock24() {
      let s = '<svg viewBox="0 0 460 460" style="width:430px;height:430px;margin:0 auto"><circle cx="230" cy="230" r="200" fill="#fff" stroke="#1F2B45" stroke-width="3"/><circle cx="230" cy="230" r="5" fill="#1F2B45"/>';
      for (let h = 0; h < 24; h++) {
        const a = (h / 24) * Math.PI * 2 - Math.PI / 2, x1 = 230 + Math.cos(a) * 200, y1 = 230 + Math.sin(a) * 200, x2 = 230 + Math.cos(a) * 186, y2 = 230 + Math.sin(a) * 186;
        const tx = 230 + Math.cos(a) * 218, ty = 230 + Math.sin(a) * 218 + 6;
        s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1F2B45" stroke-width="2"/><line x1="230" y1="230" x2="${x1}" y2="${y1}" stroke="#E4E9F1" stroke-width="1.2"/><text x="${tx}" y="${ty}" text-anchor="middle" font-size="16" font-weight="700" fill="#56627A" font-family="Miso">${h}</text>`;
      }
      return `<div style="display:flex;flex-direction:column;align-items:center"><div class="blk-label" style="align-self:flex-start">나의 하루 생활 계획표 (가는 선을 따라 나누어 색칠해요)</div>${s}</svg><div style="font-size:13px;color:#8A95A8">맨 위 0은 밤 12시, 아래 12는 낮 12시예요.</div></div>`;
    },
    notice() {
      const m = Store.get();
      return `<div style="font-size:16px;line-height:1.62;display:flex;flex-direction:column;gap:10px">
        <p style="margin:0">${ed('학부모님, 안녕하십니까? 한 해 동안 아이들이 즐겁게 배우고 자랄 수 있도록 함께해 주셔서 감사합니다. 아이들이 겨울방학을 건강하고 안전하게 보낼 수 있도록 아래 내용을 함께 살펴봐 주세요.')}</p>
        <table class="pt"><tr><th style="width:26%">일정</th><th>날짜</th></tr>
          <tr><td class="lab">방학식</td><td>${ed('2026년 12월 ___일 ( ___ )')}</td></tr>
          <tr><td class="lab">겨울방학</td><td>${ed('2026년 12월 ___일 ~ 2027년 ___월 ___일')}</td></tr>
          <tr><td class="lab">개학일</td><td>${ed('2027년 ___월 ___일 ( ___ ) ___시 ___분까지 등교')}</td></tr>
          <tr><td class="lab">돌봄·방과후</td><td>${ed('운영 일정은 따로 안내합니다.')}</td></tr></table>
        <div><b style="color:var(--c)">방학 생활</b><ul style="margin:4px 0 0;padding-left:22px">
          <li>${ed('일찍 자고 일찍 일어나 규칙적인 생활을 해요.')}</li><li>${ed('하루 30분 책 읽기, 줄넘기나 걷기 같은 운동을 꾸준히 해요.')}</li>
          <li>${ed('집안일을 한 가지씩 맡아 가족을 도와요.')}</li><li>${ed('게임과 영상은 가족과 정한 시간만큼만 봐요.')}</li></ul></div>
        <div><b style="color:var(--c)">안전 약속</b><ul style="margin:4px 0 0;padding-left:22px">
          <li>${ed('빙판길에서는 주머니에 손을 넣지 않고 천천히 걸어요.')}</li><li>${ed('얼음이 언 강이나 저수지에 들어가지 않아요.')}</li>
          <li>${ed('난로·전기장판 주변에 물건을 두지 않고, 불장난을 하지 않아요.')}</li><li>${ed('인터넷에서 이름·주소·전화번호를 알려 주지 않아요.')}</li>
          <li>${ed('외출할 때는 가는 곳과 돌아올 시간을 가족에게 알려요.')}</li></ul></div>
        <div><b style="color:var(--c)">개학 날 준비물</b><div>${ed('방학 과제, 실내화, 필통, 알림장')}</div></div>
        <div style="text-align:right;margin-top:6px">${ed('2026년 12월 ___일')}<br><b style="font-size:20px">${ed(esc((m.school || '○○초등학교') + ' ' + (m.grade ? m.grade + '학년 ' : '') + (m.cls ? m.cls + '반 ' : '') + '담임 ' + (m.teacher || '○○○')))}</b></div></div>`;
    },
    missions: b => `<div style="display:grid;grid-template-columns:repeat(5,1fr);border-top:2px solid #9AA6B8;border-left:2px solid #9AA6B8;flex:1">${b.items.map(t => `<div style="border-right:2px solid #9AA6B8;border-bottom:2px solid #9AA6B8;padding:12px 8px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center;font-size:16px;font-weight:700;word-break:keep-all">${ed(esc(t))}<svg viewBox="0 0 60 60" style="width:58px;height:58px"><circle cx="30" cy="30" r="25" fill="none" stroke="var(--c)" stroke-width="2" stroke-dasharray="4 4"/></svg></div>`).join('')}</div>`,
    numlist: b => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 28px">${Array.from({ length: b.n }, (_, i) => `<div data-grow style="display:flex;gap:10px;align-items:flex-end;height:44px;border-bottom:1.5px solid #B8C1CF"><b style="width:26px;text-align:right;color:var(--c);font-size:18px">${i + 1}</b><span style="flex:1"></span>${cbox}</div>`).join('')}</div>`,
    habit: b => [0, 1].map(w => `<div class="blk-label">${w ? '3~4주' : '1~2주'} (위 칸에 날짜를 쓰고, 지킨 날은 색칠해요)</div><table class="pt" style="table-layout:fixed"><tr><th style="width:130px">습관</th>${Array(14).fill('<th style="height:34px"></th>').join('')}</tr>${b.items.map(it => `<tr style="height:42px"><td style="font-weight:700;font-size:15px">${ed(esc(it) || '&nbsp;')}</td>${Array(14).fill('<td></td>').join('')}</tr>`).join('')}</table>`).join(''),
    safety() {
      const S = [['교통 안전', ['길을 건널 때 신호등을 보고 좌우를 살펴요.', '횡단보도에서는 휴대폰을 보지 않아요.', '주차된 차 뒤나 골목길에서 놀지 않아요.']],
        ['불 안전', ['불장난을 하지 않아요.', '난로와 전기장판 가까이에 물건을 두지 않아요.', '불이 나면 "불이야!" 외치고 계단으로 대피해요.']],
        ['빙판길·얼음 안전', ['주머니에 손을 넣지 않고 천천히 걸어요.', '얼음이 언 강이나 저수지에 들어가지 않아요.', '눈썰매는 정해진 곳에서만 타요.']],
        ['온라인 안전', ['이름, 주소, 전화번호를 알려 주지 않아요.', '모르는 사람의 메시지에는 답하지 않아요.', '게임과 영상은 가족과 정한 시간만큼만 해요.']],
        ['생활 안전', ['밖에 나갈 때는 어디 가는지 가족에게 알려요.', '모르는 사람이 문을 두드리면 열지 않아요.', '밖에서 들어오면 손을 깨끗이 씻어요.']]];
      return S.map(([h, items]) => `<div><div class="blk-label">${h}</div>${items.map(t => `<div style="display:flex;gap:10px;align-items:center;font-size:17.5px;padding:5px 0 5px 4px">${cbox}${ed(esc(t))}</div>`).join('')}</div>`).join('') +
        `<div style="margin-top:auto;display:flex;justify-content:flex-end;gap:30px;font-size:18px"><span>나 __________ (서명)</span><span>가족 __________ (서명)</span></div>`;
    },
    cover: () => `<div style="flex:1;border:3px solid var(--c);border-radius:20px;position:relative;display:flex;flex-direction:column;align-items:center;padding:28px">
      <svg viewBox="0 0 600 180" style="width:560px;height:168px"><text x="300" y="150" text-anchor="middle" font-family="Miso" font-weight="700" font-size="190" fill="none" stroke="var(--c)" stroke-width="4" letter-spacing="8">2027</text></svg>
      <div style="font-size:18px;color:#56627A">${ed('2027년은 정미년, 붉은 양의 해예요. 숫자 안을 색칠하고 아래에 새해 그림을 그려요.')}</div><img src="img/sheep.png" alt="" style="position:absolute;right:26px;top:150px;height:150px">
      <div style="flex:1;width:100%;border:1.5px dashed #9AA6B8;border-radius:14px;margin-top:20px"></div>
      <div style="font-size:22px;font-weight:700;margin-top:18px">__________ 의 2027 달력</div></div>`,
    poster: () => `<div style="height:70px;border:2.5px solid var(--c);border-radius:14px;display:grid;place-items:center;font-size:18px;color:#8A95A8">포스터 제목을 크게 써요</div>
      <div class="box" style="flex:1"><span class="bl">가장 기억에 남는 추억</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">${[1, 2, 3].map(() => '<div class="box" style="height:210px"></div>').join('')}</div>`,
    popup: () => {
      const tab = (cx, w, l) => `<line x1="${cx - w / 2}" y1="400" x2="${cx - w / 2}" y2="${400 - l}" stroke="#1F2B45" stroke-width="3.5"/><line x1="${cx + w / 2}" y1="400" x2="${cx + w / 2}" y2="${400 - l}" stroke="#1F2B45" stroke-width="3.5"/><line x1="${cx - w / 2}" y1="${400 - l}" x2="${cx + w / 2}" y2="${400 - l}" stroke="#E2456B" stroke-width="2.5" stroke-dasharray="4 6"/>`;
      return `<div style="display:flex;gap:26px;font-size:15px;color:#56627A"><span><b style="color:#1F2B45">━ 굵은 선</b> 가위로 잘라요</span><span><b style="color:#2366C2">- - 파란 점선</b> 카드를 반으로 접어요</span><span><b style="color:#E2456B">··· 분홍 점선</b> 받침을 접어요</span></div>
        <svg viewBox="0 0 690 800" style="width:100%;flex:1"><rect x="2" y="2" width="686" height="796" rx="16" fill="#fff" stroke="#9AA6B8" stroke-width="2"/>
        <line x1="0" y1="400" x2="690" y2="400" stroke="#2366C2" stroke-width="2.5" stroke-dasharray="12 8"/>${tab(200, 120, 90)}${tab(470, 160, 130)}
        <text x="345" y="200" text-anchor="middle" font-family="Miso" font-size="22" fill="#8A95A8">카드 안쪽 윗면 (배경을 그려요)</text>
        <text x="345" y="610" text-anchor="middle" font-family="Miso" font-size="22" fill="#8A95A8">카드 안쪽 아랫면 (소망을 적어요)</text></svg>
        <div class="cutgrid" style="grid-template-columns:repeat(4,1fr);flex:none;height:150px">${[1, 2, 3, 4].map((x, i) => `<div style="align-items:center;justify-content:center;color:#8A95A8;font-size:14px">${i ? '' : ICON.scissor}받침에 붙일 그림</div>`).join('')}</div>`;
    },
    webtoon: () => [0, 1, 2].map(i => `<div class="box" style="flex:1;position:relative"><span class="bl">${i + 1}</span><svg viewBox="0 0 160 90" style="position:absolute;${i % 2 ? 'left' : 'right'}:16px;top:14px;width:170px;height:96px"><path d="M80 6c40 0 72 14 72 33s-32 33-72 33c-8 0-16-.6-23-1.7L34 84l6-16C20 62 8 51 8 39 8 20 40 6 80 6z" fill="#fff" stroke="#8A95A8" stroke-width="2"/></svg></div>`).join('') + '<div class="lines"><div class="blk-label">만화 제목</div>' + L(1) + '</div>',
    namecards: () => `<div class="cutgrid" style="grid-template-columns:1fr 1fr;grid-template-rows:repeat(5,1fr)">${Array.from({ length: 10 }, (_, i) => `<div style="flex-direction:row;gap:14px;align-items:stretch">${i ? '' : ICON.scissor}<div style="width:86px;border:1.5px dashed #9AA6B8;border-radius:10px;display:grid;place-items:center;font-size:12px;color:#8A95A8;text-align:center">내 로고</div><div style="flex:1;display:flex;flex-direction:column">${['미래의 직업', '이름', '하는 일'].map(f => `<div class="cf"><span>${f}</span><i style="min-height:18px"></i></div>`).join('')}</div></div>`).join('')}</div>`,
    talisman: () => `<div class="cutgrid" style="grid-template-columns:repeat(4,1fr);grid-template-rows:1fr">${[0, 1, 2, 3].map(i => `<div style="align-items:center;padding:20px 12px">${i ? '' : ICON.scissor}<b style="font-size:24px;color:var(--c);letter-spacing:6px">${ed('응원 부적')}</b><div style="flex:1;width:100%;border:2px solid var(--c);border-radius:12px;margin:12px 0;position:relative"><div style="position:absolute;inset:7px;border:1px solid var(--c);border-radius:8px;opacity:.5"></div></div><svg viewBox="0 0 60 60" style="width:56px;height:56px"><circle cx="30" cy="30" r="25" fill="none" stroke="var(--c)" stroke-width="2.5"/><text x="30" y="37" text-anchor="middle" font-family="Miso" font-weight="700" font-size="20" fill="var(--c)">힘!</text></svg></div>`).join('')}</div>`,
    manual() {
      const m = Store.get();
      const F = [['제품 이름', (m.teacher || '○○○') + ' 선생님'], ['출시 연도', '____년생 (비밀일 수도 있어요)'], ['좋아하는 것', '______, ______, 아이들의 웃음'], ['싫어하는 것', '______, 복도에서 뛰기'],
        ['기분 좋아지는 버튼', '"선생님, 안녕하세요!" 하고 먼저 인사하기'], ['자주 하는 말', '"______"'], ['수업 방식', '______'], ['주의 사항', '______할 때는 조심해 주세요.'], ['고장 났을 때', '______ 해 주면 금방 고쳐져요.'], ['보증 기간', '2026년 3월 ~ 평생 (졸업해도 응원해요)']];
      return `<div style="display:grid;grid-template-columns:240px 1fr;gap:22px"><div class="box" style="height:240px"><span class="bl">선생님 얼굴</span></div><div style="display:flex;flex-direction:column;justify-content:center;gap:6px;font-size:17px;color:#56627A">${ed('이 설명서는 우리 반 선생님을 더 잘 알기 위한 안내서입니다. 글자를 눌러 고쳐 쓰세요.')}</div></div>
        <table class="pt">${F.map(([k, v]) => `<tr style="height:54px"><td class="lab" style="width:28%">${ed(k)}</td><td style="font-size:17px">${ed(esc(v))}</td></tr>`).join('')}</table>`;
    },
    checktable: b => `<table class="pt"><tr><th style="width:40%">내 물건</th><th>다 챙겼어요</th><th>집에 가져가요</th><th>버려요</th></tr>${b.items.map(t => `<tr data-grow style="height:54px"><td style="font-weight:700">${ed(esc(t))}</td><td>${circ}</td><td>${circ}</td><td>${circ}</td></tr>`).join('')}<tr style="height:54px"><td></td><td></td><td></td><td></td></tr></table>`,
    stars: b => `<div class="box" style="height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px"><span class="bl">${esc(b.label)}</span><div style="display:flex;gap:6px">${Array(5).fill('<svg viewBox="0 0 24 24" style="width:54px;height:54px"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" fill="none" stroke="#E3A400" stroke-width="1.5" stroke-linejoin="round"/></svg>').join('')}</div><span style="font-size:14px;color:#8A95A8">마음에 든 만큼 색칠해요</span></div>`,
    minibook: () => `<div style="position:absolute;left:50%;top:50%;width:1010px;height:700px;transform:translate(-50%,-50%) rotate(90deg);display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;border:2px solid #9AA6B8">
      ${[['5쪽', 1], ['4쪽', 1], ['3쪽', 1], ['2쪽', 1], ['6쪽', 0], ['7쪽', 0], ['뒤표지', 0], ['앞표지', 0]].map(([t, flip], i) => `<div style="border-right:${i % 4 < 3 ? '2px dashed #B8C1CF' : '0'};border-bottom:${i < 4 ? (i === 1 || i === 2 ? '3px solid #1F2B45' : '2px dashed #B8C1CF') : '0'};padding:18px;display:flex;flex-direction:column;${flip ? 'transform:rotate(180deg);' : ''}">
        <b style="color:var(--c);font-size:16px">${t}</b>${t === '앞표지' ? `<div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px"><div style="font-size:26px;font-weight:700">${ed('나의 한 해 미니 북')}</div><div style="font-size:15px;color:#56627A">과목: ________</div><div style="font-size:15px;color:#56627A">이름: ________</div></div>` : t === '뒤표지' ? '<div style="flex:1;display:flex;align-items:flex-end;font-size:14px;color:#8A95A8">이 책을 읽은 친구 사인</div>' : `<div style="flex:1;border:1.5px dashed #E4E9F1;border-radius:8px;margin:8px 0"></div><div class="lines">${L(3)}</div>`}</div>`).join('')}</div>
      <div style="position:absolute;left:14px;bottom:12px;font-size:12px;color:#8A95A8;writing-mode:vertical-rl">가운데 굵은 선만 가위로 자르고, 점선을 따라 접어요.</div>`
  };

  window.SHEET_BLOCKS = B;
  function render(b) { return (B[b.t] || (() => ''))(b); }
  window.renderBlock = render;

  window.buildSheet = function (a, blocks, title, guide) {
    const p = pageFrame(a, title, guide !== undefined ? guide : (a.steps ? a.steps.join(' ') : ''), { noName: blocks[0] && blocks[0].t === 'notice' });
    if (blocks[0] && blocks[0].t === 'minibook') { p.innerHTML = render(blocks[0]); return p; }
    if (blocks[0] && blocks[0].t === 'notice') { $('.pt', p).innerHTML = `<span contenteditable="true">겨울방학 생활 안내</span>`; $('.pg', p) && $('.pg', p).remove(); }
    blocks.forEach(b => p.insertAdjacentHTML('beforeend', render(b)));
    return p;
  };

  /* 남는 공간만큼 칸 늘리기 */
  window.fillPage = function (p) {
    if (p.dataset.filled || p.querySelector('[data-nofill], [style*="rotate(90deg)"]')) return;
    const pr = p.getBoundingClientRect(); if (!pr.height) return;
    const sc = pr.height / 1123; let maxB = pr.top;
    Array.from(p.children).forEach(c => { maxB = Math.max(maxB, c.getBoundingClientRect().bottom); });
    const free = (pr.bottom - 46 * sc - maxB) / sc;
    if (free < 24) { p.dataset.filled = 1; return; }
    let g = $$('[data-grow]', p); if (!g.length) g = $$('.ln', p);
    if (!g.length) return;
    const rows = {}; g.forEach(e => { const k = Math.round(e.getBoundingClientRect().top / sc / 8); (rows[k] = rows[k] || []).push(e); });
    const n = Object.keys(rows).length, d = Math.min(free / n, 260);
    g.forEach(e => { const h = e.getBoundingClientRect().height / sc; e.style.height = (h + d) + 'px'; });
    p.dataset.filled = 1;
  };

  /* 화면에 A4 미리보기 넣기 (크기 맞춤) */
  window.showPaper = function (host, pages) {
    host.innerHTML = '';
    const wrap = el('<div class="paperwrap"><div class="paperscale"></div></div>');
    const sc = $('.paperscale', wrap);
    pages.forEach(p => sc.appendChild(p));
    host.appendChild(wrap);
    const fit = () => { const w = wrap.clientWidth - 40, h = wrap.clientHeight - 40; const s = Math.min(1, w / 794, pages.length > 1 ? 9 : h / 1123); sc.style.transform = `scale(${s})`; sc.style.height = (pages.length * 1143 * s) + 'px'; sc.style.width = 794 * s + 'px'; sc.style.transformOrigin = 'top left'; };
    requestAnimationFrame(fit); window.__fit = fit;
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(() => pages.forEach(fillPage)));
    return sc;
  };
})();
