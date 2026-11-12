/* ── 2027 붉은 양의 해: 활동지와 수업 ── */
(function () {
  const T = window.TOOLS;
  const ZOD = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
  const LV = [['easy', '쉬움', '큰 양 한 마리를 색칠해요.'], ['medium', '보통', '양 가족과 해돋이를 색칠해요.'], ['hard', '어려움', '전통 무늬 속 양을 섬세하게 색칠해요.']];
  function colorPage(a, k) {
    const [f, lv, g] = LV[k];
    const p = pageFrame(a, `붉은 양 컬러링 (${lv})`, g + ' 양은 빨간색 계열로 칠해 "붉은 양"을 만들어요.');
    p.insertAdjacentHTML('beforeend', `<div style="flex:1;min-height:0;display:flex;justify-content:center;border:2.5px solid var(--soft);border-radius:22px;padding:10px;background:#fff"><img src="img/sheep/${f}.png" alt="" style="max-width:100%;max-height:100%;object-fit:contain"></div>`);
    return p;
  }
  function zodiacPage(a) {
    const hide = [1, 4, 6, 7, 9, 11];
    const p = pageFrame(a, '12띠 순서 알아보기', '빈칸에 알맞은 띠를 아래 낱말에서 골라 써요. 다 쓰면 올해와 내년 띠에 색칠해요.');
    p.insertAdjacentHTML('beforeend', `
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px">${ZOD.map((z, i) => `<div style="border:2.5px solid var(--soft);border-radius:18px;padding:10px 6px;text-align:center;background:#fff"><div style="font-size:14px;color:var(--c);font-weight:700">${i + 1}</div><div style="height:46px;display:grid;place-items:center;font-size:24px;font-weight:700">${hide.includes(i) ? '<i style="display:block;width:80%;height:34px;border-bottom:2px solid var(--line)"></i>' : z}</div></div>`).join('')}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;background:var(--t);border-radius:16px;padding:10px">${shuffle(hide.map(i => ZOD[i])).map(z => `<span style="background:#fff;border-radius:12px;padding:4px 14px;font-weight:700;font-size:18px">${z}</span>`).join('')}</div>
      <div class="lines"><div class="blk-label">2026년은 붉은 말의 해, 2027년은 무슨 해일까요?</div><div class="ln"></div></div>
      <div class="lines"><div class="blk-label">"정미년"에서 "정"과 "미"는 각각 무엇을 뜻할까요?</div><div class="ln"></div><div class="ln"></div></div>
      <table class="pt"><tr><th>우리 가족</th><th>태어난 해</th><th>띠</th></tr>${['나', '', '', ''].map(x => `<tr data-grow style="height:52px"><td class="lab">${x}</td><td></td><td></td></tr>`).join('')}</table>
      <div class="box" data-grow style="height:170px"><span class="bl">붉은 양에게 새해 인사를 써요</span></div>`);
    return p;
  }
  function keyPage(a) {
    const p = pageFrame(a, '12띠 활동지 예시 답안 (선생님용)', '12띠 순서와 정미년의 뜻을 확인해요.', { noName: true });
    p.insertAdjacentHTML('beforeend', `<table class="pt">${[['12띠 순서', ZOD.join(' → ')], ['빈칸 정답', '2 소, 5 용, 7 말, 8 양, 10 닭, 12 돼지'], ['2027년', '정미년, 붉은 양의 해'], ['정과 미의 뜻', '정(丁)은 붉은색을, 미(未)는 양을 뜻해요.'], ['함께 알아 두기', '2026년은 병오년(붉은 말의 해), 2028년은 무신년(누런 원숭이의 해)이에요. 띠는 보통 음력 설날(2027년 2월 7일)부터 바뀐다고 봐요.']].map(([k, v]) => `<tr data-grow style="height:90px"><td class="lab" style="width:22%">${k}</td><td style="font-size:18px;font-weight:700;color:#C9305A">${v}</td></tr>`).join('')}</table>`);
    return p;
  }
  const all = a => [colorPage(a, 0), colorPage(a, 1), colorPage(a, 2), zodiacPage(a)];
  T.sheep = function (a, ctx) {
    let sel = 0;
    const show = () => showPaper(ctx.stage, [all(a)[sel]]);
    const sg = el('<div class="seg"></div>');
    ['컬러링 쉬움', '컬러링 보통', '컬러링 어려움', '12띠 활동지'].forEach((t, k) => { const b = el(`<button class="${k === sel ? 'on' : ''}">${t}</button>`); b.onclick = () => { sel = k; $$('button', sg).forEach(x => x.classList.remove('on')); b.classList.add('on'); show(); }; sg.appendChild(b); });
    const l = el('<label class="f">활동지 고르기</label>'); l.appendChild(sg);
    const p1 = el('<button class="btn dark">보이는 활동지 인쇄</button>'); p1.onclick = () => printPages([all(a)[sel]]);
    const p2 = el('<button class="btn">4가지 모두 인쇄</button>'); p2.onclick = () => printPages(all(a));
    const p3 = el('<button class="btn flat">예시 답안 인쇄 (선생님용)</button>'); p3.onclick = () => printPages([keyPage(a)]);
    ctx.opts.append(l, p1, p2, p3, el('<p class="hint">아이마다 난이도를 골라 줄 수 있어요. 1~2학년은 쉬움·보통, 3학년 이상은 어려움도 좋아요.</p>'));
    ctx.print(() => printPages([all(a)[sel]]));
    show();
  };
  T.sheep.pages = a => all(a);

  LESSONS[81] = {
    title: '2027 붉은 양의 해', bg: '#FFECE8', ink: '#C8372D', plan: '설명 10분 + 활동지 30분',
    slides: [
      { t: 'cover', title: '2027년은 붉은 양의 해', sub: '정미년의 뜻과 12띠를 알아봐요', img: 'img/sheep.png', free: 1 },
      { t: 'list', title: '2026년은 무슨 띠의 해였을까요?', points: ['· 힌트: 갈기를 휘날리며 힘차게 달리는 동물', '· 정답: 붉은 말의 해(병오년)', '· 그렇다면 2027년은?'], img: 'img/kids.png', free: 1 },
      { t: 'goal', title: '오늘의 공부', text: '12띠의 순서와 "정미년"의 뜻을 알고, 붉은 양을 색칠하며 새해를 맞이해요.', flow: [['설명 듣기', '10분'], ['컬러링·12띠 활동지', '30분'], ['새해 인사', '5분']] },
      { t: 'zodiac', title: '12띠의 순서', items: ZOD, mark: { 6: '2026', 7: '2027' } },
      { t: 'colors', title: '왜 "붉은" 양일까요?', items: [['갑·을', '파랑', '#3D7BE0'], ['병·정', '빨강', '#E0443A'], ['무·기', '노랑', '#E3A400'], ['경·신', '하양', '#F4F4F4'], ['임·계', '검정', '#2B2B33']], mark: 1, text: '해의 이름 앞 글자(10가지)는 색깔을 나타내요. "병"과 "정"은 빨강이에요. 2026년 병오년도, 2027년 정미년도 모두 빨간색!' },
      { t: 'steps', title: '"정미년"은 무슨 뜻일까요?', points: ['정(丁)은 붉은색을 뜻해요', '미(未)는 양을 뜻해요', '그래서 2027년은 붉은 양의 해!'], warn: '띠는 보통 음력 설날(2027년 2월 7일)부터 바뀐다고 봐요.', img: 'img/sheep.png' },
      { t: 'list', title: '양은 어떤 동물일까요?', points: ['무리를 지어 함께 살아요', '풀을 뜯어 먹어요', '온순하고 순한 성격이에요'], img: 'img/quiz/sheep.jpg' },
      { t: 'ox', title: '2028년은 원숭이의 해예요.', a: 'O', e: '2028년은 무신년, 누런 원숭이의 해예요. 12띠에서 양 다음은 원숭이!' },
      { t: 'example', title: '새해 인사를 해 볼까요?', text: '새해 복 많이 받으세요! 붉은 양처럼 따뜻하고 씩씩한 한 해 보내요.', img: 'img/sheep.png' },
      { t: 'work', title: '활동지 시간', min: 30, parts: [['쉬움', '큰 양 컬러링', ''], ['보통', '양 가족과 해돋이 컬러링', ''], ['어려움', '전통 무늬 양 컬러링', ''], ['더하기', '12띠 순서 활동지', '']] },
      { t: 'share', title: '함께 나눠요', text: '내가 칠한 붉은 양을 소개하고, 친구에게 새해 인사를 건네요.', img: 'img/kids.png' },
      { t: 'cover', title: '새해 복 많이 받으세요!', sub: '2027년, 붉은 양처럼 따뜻하고 씩씩하게!', img: 'img/sheep.png', free: 1, end: 1 }
    ],
    pages: a => all(a), key: a => [keyPage(a)]
  };
})();
