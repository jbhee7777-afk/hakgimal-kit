/* 겨울방학 안전 수업: 주제를 골라 영상 보고, 빈칸 활동지 쓰기 */
(function () {
  const V = (id, src, name, len, start, end) => ({ id, src, name, len, start, end });
  const TOPICS = [
    { id: 'winter', name: '겨울철 안전', col: '#2B78D6', img: 'slides/safety/icy.jpg',
      v: V('6URfl_P8Nd4', '행정안전부 안전한TV', '겨울철 필수 안전교육', '약 5분 (0:31~5:22)', 31, 322), v2: V('Omf1gpZc85A', '은하안전단·아이쿠TV', '눈 오는 겨울 안전하게 보내는 방법', '10분'),
      blanks: [['빙판길에서는 주머니에서 (    )을 빼고 걸어요.', '손'], ['핫팩은 피부가 아니라 (    ) 위에 붙여요.', '옷'], ['얼음 언 강이나 저수지에는 (    ) 않아요.', '들어가지'], ['언 손은 아주 뜨겁지 않은 (    ) 물로 천천히 녹여요.', '따뜻한']],
      ox: ['핫팩을 붙인 채로 잠을 자도 괜찮아요.', 'X', '오래 닿으면 저온 화상을 입어요. 잘 때는 떼어요.'] },
    { id: 'phone', name: '스마트폰 바르게 쓰기', col: '#7A52D9', img: 'img/cat4.png',
      v: V('4ORvUxIB2K0', '은하안전단·아이쿠TV', '조심해! 스몸비의 습격! (스마트폰 중독)', '4분'), v2: V('Htc_o6VZZek', 'EBS 최고다! 호기심 딱지', '꽃도령 삼총사의 스마트폰 사용법', '13분'),
      blanks: [['스마트폰은 가족과 정한 (    )만큼만 써요.', '시간'], ['잠자기 전에는 스마트폰을 (    ) 자요.', '끄고'], ['길을 걸을 때는 스마트폰을 (    ) 않아요.', '보지'], ['오래 보았다면 먼 곳을 보며 (    )을 쉬게 해요.', '눈']],
      ox: ['길을 걸으면서 스마트폰을 봐도 괜찮아요.', 'X', '앞을 보지 못해 부딪히거나 다칠 수 있어요.'] },
    { id: 'gamble', name: '도박 예방', col: '#D2551C', img: 'img/cat3.png',
      v: V('9tp4sVbBKDk', '한국도박문제관리센터', '어리석은 수달아저씨', '5분'), v2: V('lFp7T5Ck3I0', '듀라', '[초등] 나에게 가장 가까운 이야기 도박', '7분'),
      blanks: [['돈이나 물건을 걸고 하는 내기는 (    )이 될 수 있어요.', '도박'], ['게임 속 확률 뽑기에 (    )을 쓰지 않아요.', '돈'], ['"한 판만 더!" 마음이 들면 (    ) 어른께 이야기해요.', '멈추고']],
      ox: ['친구와 돈을 걸고 하는 내기는 재미있는 놀이일 뿐이에요.', 'X', '돈을 거는 내기는 도박이 될 수 있어요. 돈 없이 놀이만 즐겨요.'] },
    { id: 'medicine', name: '약 안전하게 먹기', col: '#0E8A5C', img: 'img/cat5.png',
      v: V('VJ_2pHWdoQY', '은하안전단·아이쿠TV', '아플 때 먹는 약이 위험할 수도 있다구요?', '5분'), v2: V('rep4nwzSxBQ', 'EBS 최고다! 호기심 딱지', '약을 많이 먹으면 간이 힘들어요', '13분'),
      blanks: [['약은 (    )이나 선생님이 주실 때만 먹어요.', '부모님'], ['약은 달콤해 보여도 (    )이 아니에요.', '사탕'], ['약은 정해진 양과 (    )을 지켜 먹어요.', '시간'], ['친구의 약을 (    ) 먹지 않아요.', '나눠']],
      ox: ['내 약을 아픈 친구에게 나눠 줘도 괜찮아요.', 'X', '사람마다 맞는 약이 달라요. 약은 자기 것만 먹어요.'] },
    { id: 'kidnap', name: '유괴 예방', col: '#C9305A', img: 'slides/safety/home.jpg',
      v: V('G5ZpargXtTg', '로보카폴리 TV', '유괴범을 조심해!', '7분'), v2: V('2X-RyJYG_jo', '대구미래교육연구원', '납치·유괴 예방교육 (동동이와 송송이)', '8분'),
      blanks: [['모르는 사람이 도와 달라고 하면 "(    )!"라고 말해요.', '싫어요'], ['모르는 사람의 차에 (    ) 않아요.', '타지'], ['위험하면 "도와주세요!" 크게 외치고 (    )에 신고해요.', '112'], ['밖에 나갈 때는 어디에 가는지 (    )에게 알려요.', '가족']],
      ox: ['길을 물어보는 어른이 차에 타서 같이 가 달라고 하면 따라가요.', 'X', '모르는 사람의 차에는 절대 타지 않아요. "싫어요!" 하고 자리를 떠나요.'] },
    { id: 'traffic', name: '교통안전', col: '#E3A400', img: 'img/kids.png',
      v: V('SS5W7BSZrqk', '로보카폴리 안전스쿨', '횡단보도를 건널 때는 이렇게', '6분'),
      blanks: [['횡단보도에서는 (    )불이 켜지면 좌우를 살피고 건너요.', '초록'], ['손을 들고 건너면 운전자가 나를 잘 (    ) 수 있어요.', '볼'], ['자동차를 타면 꼭 (    )를 매요.', '안전띠'], ['주차장이나 골목에서는 (    ) 않아요.', '뛰지']],
      ox: ['초록불이 켜지면 바로 뛰어서 건너요.', 'X', '초록불이 켜져도 멈춰서 좌우를 살피고, 걸어서 건너요.'] },
    { id: 'fire', name: '불 안전', col: '#E2456B', img: 'img/cat8.png',
      v: V('mRABGl-8wSA', '은하안전단·아이쿠TV', '화재안전 (화재예방과 안전한 대피로)', '4분'),
      blanks: [['불이 나면 "불이야!" 외치고 (    )으로 대피해요.', '계단'], ['연기가 나면 젖은 수건으로 코와 입을 막고 몸을 (    ).', '낮춰요'], ['난로 가까이에 (    )이나 옷을 두지 않아요.', '이불']],
      ox: ['불이 나면 엘리베이터를 타고 빨리 내려가요.', 'X', '엘리베이터는 멈출 수 있어요. 계단으로 대피해요.'] }
  ];
  window.SAFE_TOPICS = TOPICS;
  const chosen = () => { const ids = Store.d('safe:topics', ['winter', 'phone', 'kidnap', 'traffic']); return TOPICS.filter(t => ids.includes(t.id)); };
  window.safeChosen = chosen;

  function slides() {
    const ts = chosen(), S = [];
    S.push({ t: 'cover', title: '겨울방학 안전 약속', sub: '영상으로 배우고, 내 손으로 약속해요', img: 'img/kids.png', free: 1 });
    S.push({ t: 'list', title: '겨울방학, 이런 일을 조심해요', points: ts.map(t => '· ' + t.name), img: 'slides/safety/icy.jpg' });
    S.push({ t: 'goal', title: '오늘의 공부', text: '영상을 보며 꼭 지킬 안전 약속을 찾고, 활동지 빈칸을 채워 나만의 안전 약속을 만들어요.' });
    ts.forEach((t, k) => {
      S.push({ t: 'video', title: `${k + 1}. ${t.name}`, look: t.blanks.slice(0, 3).map(b => b[0]), v: t.v, start: t.v.start, end: t.v.end, len: t.v.len, more: t.v2 ? { v: t.v2, label: `더 보기: ${t.v2.src} "${t.v2.name}" (${t.v2.len})` } : null });
      S.push({ t: 'ox', title: t.ox[0], a: t.ox[1], e: t.ox[2] });
    });
    S.push({ t: 'calls', title: '꼭 기억해요, 도움 전화', items: [['112', '경찰', '위험한 사람을 만났을 때, 길을 잃었을 때', '#2366C2'], ['119', '소방·구급', '불이 났을 때, 크게 다쳤을 때', '#C9305A']] });
    S.push({ t: 'work', title: '활동지 시간', min: 30, parts: [['1', '영상 보며 빈칸 채우기', ''], ['2', '도움 전화 카드 꾸미기', ''], ['3', '나의 안전 약속 포스터', '']] });
    S.push({ t: 'answers', title: '함께 확인해요', rows: ts.map(t => [t.name, t.blanks.map(b => b[1]).join(', ')]) });
    S.push({ t: 'share', title: '함께 나눠요', text: '오늘 배운 약속 중에서 방학 동안 가장 꼭 지키고 싶은 약속은 무엇인가요?', img: 'img/kids.png' });
    S.push({ t: 'cover', title: '안전하고 신나는 겨울방학!', sub: '포스터를 집에 가져가 가족과 함께 읽어요', img: 'img/sheep.png', free: 1, end: 1 });
    return S;
  }

  /* 활동지: 주제마다 빈칸 */
  function blankPages(a) {
    const ts = chosen(), out = [];
    for (let k = 0; k < ts.length; k += 2) {
      const p = pageFrame(a, k ? '영상 보며 빈칸 채우기 (이어서)' : '영상 보며 빈칸 채우기', '영상을 보며 빈칸에 알맞은 말을 써요. 낱말 상자에서 골라도 돼요.');
      ts.slice(k, k + 2).forEach(t => {
        const bank = shuffle(t.blanks.map(b => b[1]).concat(['멈추고', '천천히', '혼자', '크게'].filter(x => !t.blanks.some(b => b[1] === x)).slice(0, 2)));
        p.insertAdjacentHTML('beforeend', `<div data-nofill class="sblk" style="--sc:${t.col}"><div class="sbh"><img src="${t.img}" alt=""><div><b>${esc(t.name)}</b><span>영상: ${esc(t.v.src)} "${esc(t.v.name)}"</span></div></div>
          ${t.blanks.map(([s], i) => `<div class="sbl"><i>${i + 1}</i><span>${esc(s).replace('(    )', '<u></u>')}</span></div>`).join('')}
          <div class="sbank"><span>낱말 상자</span>${bank.map(w => `<b>${esc(w)}</b>`).join('')}</div></div>`);
      });
      out.push(p);
    }
    return out;
  }
  function keyPage(a) {
    const p = pageFrame(a, '예시 답안 (선생님용)', '빈칸 정답과 영상 목록이에요.', { noName: true });
    p.insertAdjacentHTML('beforeend', `<table class="pt">${chosen().map(t => `<tr data-grow><td class="lab" style="width:22%">${esc(t.name)}</td><td style="font-size:15px">${t.blanks.map(([s, w], i) => `${i + 1}. ${esc(s).replace('(    )', `<b style="color:#C9305A">${esc(w)}</b>`)}`).join('<br>')}<div style="font-size:12px;color:#8A95A8;margin-top:4px">youtu.be/${t.v.id} (${esc(t.v.src)})${t.v2 ? ` · 더 보기 youtu.be/${t.v2.id}` : ''}</div></td></tr>`).join('')}</table>`);
    return p;
  }

  const L = LESSONS[59];
  const oldPages = L.pages, oldKey = L.key;
  Object.defineProperty(L, 'slides', { get: slides, configurable: true });
  L.pages = a => [...blankPages(a), oldPages(a)[1], oldPages(a)[2]];
  L.key = a => [keyPage(a), ...oldKey(a)];
  L.topicsUI = function (ctx, rerun) {
    const box = el('<div class="topicpick"></div>');
    const ids = Store.d('safe:topics', ['winter', 'phone', 'kidnap', 'traffic']);
    TOPICS.forEach(t => { const b = el(`<button class="${ids.includes(t.id) ? 'on' : ''}" style="--sc:${t.col}">${esc(t.name)}</button>`); b.onclick = () => { const i = ids.indexOf(t.id); if (i >= 0 && ids.length > 1) ids.splice(i, 1); else if (i < 0) ids.push(t.id); Store.set('safe:topics', TOPICS.map(x => x.id).filter(x => ids.includes(x))); b.classList.toggle('on', ids.includes(t.id)); rerun(); }; box.appendChild(b); });
    const l = el('<label class="f">오늘 다룰 안전 주제 (눌러서 고르기)</label>'); l.appendChild(box);
    ctx.opts.prepend(l, el('<p class="hint">고른 주제에 맞춰 슬라이드, 영상, 빈칸 활동지, 예시 답안이 함께 바뀌어요. 한 주제에 영상 1편(4~7분)씩 보면 2~3주제가 알맞아요.</p>'));
  };
})();
