/* 새 활동지 디자인과 활동 고치기 (2부: 활동 바꾸기·도구) */
(function () {
  const T = window.TOOLS, A = n => ACTS.find(a => a.n === n);
  const set = (n, o) => Object.assign(A(n), o);
  const seg = (items, cur, on) => { const s = el('<div class="seg"></div>'); items.forEach(([v, t]) => { const b = el(`<button class="${v === cur ? 'on' : ''}">${t}</button>`); b.onclick = () => { $$('button', s).forEach(x => x.classList.remove('on')); b.classList.add('on'); on(v); }; s.appendChild(b); }); return s; };
  const field = (t, n) => { const l = el(`<label class="f">${t}</label>`); l.appendChild(n); return l; };

  /* ── 활동 내용 바꾸기 ── */
  set(14, { d: '포스트잇 칭찬 쪽지를 스캔해 우체통에서 하나씩 뽑기', steps: ['모둠 4명이 한 장을 나눠 각자 칭찬 쪽지 한 칸을 써요. (받는 친구는 미리 정해져 있어요)', '선생님이 쪽지 종이를 한꺼번에 스캔해 "작품 모음"에 올려요.', '화면 우체통에서 쪽지를 하나씩 뽑아 함께 읽어요.'], sheet: null });
  set(15, { d: '모두가 한 번씩 칭찬받도록 짝을 정해 반짝이는 점 찾기', tool: 'praise', sheet: null, steps: ['화면에서 "칭찬 짝 정하기"를 눌러요. 모두가 한 명씩 맡고, 한 명씩 칭찬받아요.', '카드에 맡은 친구의 반짝이는 점 3가지를 써요.', '마지막에 친구에게 직접 읽어 주고 건네요.'] });
  set(16, { d: '몰래 정한 친구에게 며칠 동안 응원 쪽지 보내기', steps: ['명단을 넣고 한 명씩 나와 자기 이름을 눌러 몰래 확인해요.', '응원 쪽지에 하루 한 장씩 응원의 말을 써서 몰래 전해요.', '마지막 날 "내 천사는 누구?" 함께 공개해요.'], sheet: [{ t: 'cheer' }] });
  set(18, { d: '포스트잇 칭찬 쪽지를 스캔하면 화면 나무에 주렁주렁', steps: ['모둠 4명이 한 장을 나눠 각자 쪽지 한 칸에 칭찬을 써요. (받는 친구는 미리 정해져 있어요)', '선생님이 쪽지 종이를 스캔해 "작품 모음"에 올려요.', '화면 나무에 우리 반 쪽지가 모두 걸려요. 함께 읽어요.'], sheet: null });
  set(21, { d: '모둠마다 한 권, 진짜 사전처럼 만드는 좋은 말 사전', steps: ['모둠에서 한 사람이 좋은 말 한 개씩 맡아요.', '표제어, 뜻, 예문, 비슷한 말을 진짜 사전처럼 써요.', '모둠 사전을 돌려 읽고, 우리 반 좋은 말 사전 한 권으로 묶어요.'], sheet: [{ t: 'dict2' }] });
  set(22, { d: '정성 가득 엽서로 쓰는 마지막 인사', steps: ['엽서를 받을 친구를 정해요.', '우표를 그리고, 함께한 장면을 사진 칸에 그려요.', '고마운 마음을 담아 편지를 쓰고 직접 전해요.'], sheet: [{ t: 'postcard' }] });
  set(27, { steps: ['앞면에 내 얼굴을 그리거나 사진을 붙여요.', '뒷면에 나를 소개하는 말을 채워요.', '오려서 반으로 접으면 나만의 포토카드 완성!'], sheet: [{ t: 'photocard1' }] });
  set(56, { d: '산꼭대기까지 오르는 2027 목표 지도', steps: ['2027년에 이루고 싶은 목표 3가지를 정해요.', '깃발마다 목표와 방법을 써요.', '달마다 지켰으면 그 달에 색칠해요.'], sheet: [{ t: 'goals' }] });
  set(61, { d: '한 사람 한 장, 나만의 소망 나무 꾸미기', steps: ['나무에 걸린 소원 쪽지 5개에 2027년 소원을 써요.', '쪽지 동그라미에 작은 그림을 그려요.', '가장 이루고 싶은 소원을 아래 칸에 크게 그려요.'], sheet: [{ t: 'wishtree' }], tool: 'sheet' });
  set(63, { steps: ['2027 숫자 안을 색칠해요.', '양이나 새해를 떠올리는 그림을 크게 그려요.', '이름과 올해의 한 마디를 써서 표지를 완성해요.'] });
  set(65, { steps: ['파란 점선을 따라 반으로 접어요.', '접은 채로 굵은 선 두 줄을 잘라요.', '분홍 점선을 접고, 카드를 펼치며 받침을 안쪽으로 밀어 넣어요.'] });
  set(68, { steps: ['미래에 하고 싶은 일을 정해요.', '명함에 직업, 이름, 하는 일을 써요.', '얼굴을 그리고 오려서 친구와 주고받아요.'], sheet: [{ t: 'namecards' }] });
  set(69, { name: '새 학년 응원 메달', d: '나에게 힘이 되는 말을 담은 메달 만들기', steps: ['메달 가운데에 나를 응원하는 그림을 그려요.', '아래 줄에 힘이 나는 말을 써요.', '오려서 끈을 달아 목에 걸거나 책가방에 달아요.'], sheet: [{ t: 'medals' }] });
  set(5, { steps: ['왼쪽 낱말 가운데 마음에 드는 것을 골라 빙고판에 스스로 채워요.', '선생님이 낱말을 하나씩 뽑아 불러요.', '해 본 일이면 동그라미! 줄이 완성되면 "빙고!"'] });
  set(20, { steps: ['왼쪽 따뜻한 말을 골라 빙고판에 스스로 채워요.', '친구에게 그 말을 직접 건네면 한 칸 색칠해요.', '줄이 완성되면 "빙고!"'] });
  set(46, { steps: ['왼쪽 핵심 낱말을 골라 빙고판에 스스로 채워요.', '선생님이 낱말을 뽑으면 그 뜻을 함께 말해요.', '뜻을 말한 낱말에 표시하고 줄을 완성해요.'] });
  set(55, { steps: ['앞면은 1~6월, 뒷면은 7~12월이에요. 양면으로 인쇄해요.', '달마다 그림 칸에 그 달의 그림을 그려요.', '생일, 방학 같은 중요한 날에 표시해요.'] });

  /* ── 15 반짝이는 점: 모두가 한 번씩 받는 짝 ── */
  T.praise = function (a, ctx) {
    const st = ctx.stage, names = Store.roster();
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    const pages = () => { const m = pairMap('praise'), out = []; if (!m) { for (let k = 0; k < 3; k++) { const p = pageFrame(a, a.name, '맡은 친구의 반짝이는 점 3가지를 찾아 써요.', { noName: true }); p.insertAdjacentHTML('beforeend', SHEET_BLOCKS.shine({})); out.push(p); } return out; } for (let k = 0; k < names.length; k += 2) { const p = pageFrame(a, a.name, '맡은 친구의 반짝이는 점 3가지를 찾아 써요. 모두가 한 번씩 칭찬받아요.', { noName: true }); p.insertAdjacentHTML('beforeend', SHEET_BLOCKS.shine({ cards: names.slice(k, k + 2).map(w => ({ from: w, to: m[w] })) })); out.push(p); } return out; };
    function draw() {
      const m = pairMap('praise');
      if (!m) { body.innerHTML = `<div class="center"><div class="qbig">우리 반 명단을 넣으면 칭찬 짝을 정해 드려요</div><p class="expl">모두가 한 명씩 맡고, 한 명씩 칭찬받아서 소외되는 친구가 없어요.</p><button class="btn big dark" data-r>우리 반 명단 넣기</button></div>`; $('[data-r]', body).onclick = openSettings; return; }
      body.innerHTML = `<div class="center" style="justify-content:flex-start;overflow:auto"><div class="qbig" style="font-size:32px">모두가 한 번씩 칭찬받아요</div><p class="expl">카드에 이름이 미리 들어가요. 인쇄해서 나눠 주세요.</p><div class="pairs">${names.map(n => `<div><b>${esc(n)}</b><span>→</span><b>${esc(m[n])}</b></div>`).join('')}</div><button class="btn big" data-new>짝 새로 정하기</button></div>`;
      $('[data-new]', body).onclick = () => { if (confirm('칭찬 짝을 새로 정할까요?')) { pairMap('praise', true); draw(); } };
    }
    draw();
    ctx.print(() => printPages(pages()));
    const pv = el('<button class="btn">카드 미리 보기</button>'); pv.onclick = () => showPaper(body, pages().slice(0, 1));
    ctx.opts.append(pv, el('<p class="hint">이름이 들어간 카드가 2명씩 한 장에 나와요. 명단이 없으면 빈 카드가 나와요.</p>'));
  };
  T.praise.pages = a => { const m = pairMap('praise'), names = Store.roster(); if (!m) { const p = pageFrame(a, a.name, '맡은 친구의 반짝이는 점 3가지를 찾아 써요.', { noName: true }); p.insertAdjacentHTML('beforeend', SHEET_BLOCKS.shine({})); return [p]; } const out = []; for (let k = 0; k < names.length; k += 2) { const p = pageFrame(a, a.name, '맡은 친구의 반짝이는 점 3가지를 찾아 써요.', { noName: true }); p.insertAdjacentHTML('beforeend', SHEET_BLOCKS.shine({ cards: names.slice(k, k + 2).map(w => ({ from: w, to: m[w] })) })); out.push(p); } return out; };

  /* ── 14·18: 포스트잇 쪽지 → 스캔 → 우체통·나무 ── */
  const NOTE_ACT = { 14: ['칭찬 쪽지', 'mail', '모둠 4명이 한 장을 나눠 각자 한 칸씩 써요. 받는 친구가 미리 정해져 있어 모두가 한 장씩 받아요.'], 18: ['칭찬 잎', 'tree', '모둠 4명이 한 장을 나눠 각자 한 칸씩 써요. 받는 친구가 미리 정해져 있어 모두가 한 장씩 받아요.'] };
  window.NOTE_ACTS = [14, 18];
  window.noteFractions = function (act) {
    const a = A(act), p = notePages(a, NOTE_ACT[act][0], NOTE_ACT[act][1], NOTE_ACT[act][2])[0];
    const host = el('<div style="position:fixed;left:-99999px;top:0"></div>'); host.appendChild(p); document.body.appendChild(host);
    const pr = p.getBoundingClientRect();
    const fr = $$('.note', p).map(n => { const r = n.getBoundingClientRect(); return [(r.left - pr.left) / pr.width, (r.top - pr.top) / pr.height, r.width / pr.width, r.height / pr.height]; });
    host.remove(); return fr;
  };
  const noteImgs = async act => { try { return (await Works.all()).filter(w => w.act === act && w.note).sort((x, y) => x.pg - y.pg); } catch (e) { return []; } };
  const baseWall = T.wall;
  T.wall = function (a, ctx) {
    if (!NOTE_ACT[a.n]) return baseWall(a, ctx);
    const st = ctx.stage, [title, key, hint] = NOTE_ACT[a.n];
    const body = el('<div class="wallarea"></div>'); st.appendChild(body);
    const urls = [];
    const free = () => { urls.forEach(u => URL.revokeObjectURL(u)); urls.length = 0; };
    async function draw() {
      free(); const notes = await noteImgs(a.n);
      const empty = `<div class="center" style="position:absolute;inset:0"><div class="qbig" style="font-size:28px;background:rgba(255,255,255,.88);padding:14px 26px;border-radius:16px">아직 스캔한 쪽지가 없어요</div><p class="expl" style="background:rgba(255,255,255,.88);padding:10px 18px;border-radius:12px">① 쪽지 종이를 인쇄해 나눠 줘요 → ② 아이들이 한 칸씩 써요 → ③ 종이를 모아 한꺼번에 스캔해서 "작품 모음"에 올려요 → ④ 여기로 돌아오면 쪽지가 ${key === 'tree' ? '나무에 걸려요' : '우체통에 들어가요'}</p><a class="btn big dark" href="#/gallery">스캔 파일 올리러 가기</a></div>`;
      if (key === 'tree') {
        body.style.background = 'linear-gradient(#F3F7FB,#E6EEF6)';
        body.innerHTML = `<img src="img/tree.png" alt="" style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:100%;max-width:100%;object-fit:contain">`;
        if (!notes.length) { body.insertAdjacentHTML('beforeend', empty); return; }
        const n = notes.length, cols = Math.min(8, Math.ceil(Math.sqrt(n * 2))), rows = Math.ceil(n / cols);
        notes.forEach((w, i) => { const u = URL.createObjectURL(w.blob); urls.push(u); const c = i % cols, r = Math.floor(i / cols); const x = 4 + (c + .5) * (92 / cols) + (r % 2 ? 2 : -2), y = 8 + r * (70 / Math.max(rows, 1)); const t = el(`<div class="ntag" style="left:${x}%;top:${y}%;width:${Math.min(13, 86 / cols)}%;animation-delay:${-i * .6}s"><img src="${u}" alt=""></div>`); t.onclick = () => zoom(u); body.appendChild(t); });
      } else {
        body.style.background = '#FFF7F2';
        body.innerHTML = `<div class="center"><img class="mailbox" src="img/mailbox.png" alt="칭찬 우체통"><div class="qbig" style="font-size:32px">우체통 속 칭찬 쪽지 ${notes.length}장</div><div class="ctrl"><button class="btn huge dark" data-o ${notes.length ? '' : 'disabled'}>하나 꺼내 읽기</button></div></div>`;
        if (!notes.length) { body.insertAdjacentHTML('beforeend', empty); return; }
        let left = shuffle(notes.slice());
        $('[data-o]', body).onclick = () => { if (!left.length) left = shuffle(notes.slice()); const w = left.pop(); const u = URL.createObjectURL(w.blob); urls.push(u); beep('fan'); zoom(u, `남은 쪽지 ${left.length}장`); };
      }
    }
    function zoom(u, sub) { const ov = el(`<div class="nzoom"><img src="${u}" alt=""><div>${sub ? esc(sub) : ''}</div><button class="btn big">닫기</button></div>`); $('button', ov).onclick = () => ov.remove(); ov.onclick = e => { if (e.target === ov) ov.remove(); }; st.appendChild(ov); }
    draw();
    const pages = () => notePages(a, title, key, hint);
    ctx.print(() => printPages(pages()));
    const pb = el('<button class="btn dark">쪽지 종이 인쇄</button>'); pb.onclick = () => printPages(pages());
    const gl = el('<a class="btn" href="#/gallery">스캔 파일 올리기</a>');
    const rf = el('<button class="btn flat">화면 새로 고침</button>'); rf.onclick = draw;
    ctx.opts.append(pb, gl, rf, el(`<p class="hint">${hint} 명단이 있으면 받는 친구 이름과 쓰는 친구 이름이 미리 들어가요. 쪽지 종이는 자르지 말고 그대로 걷어 스캔하면 칸마다 저절로 잘라서 보여 줘요.</p>`));
  };
  T.wall.pages = a => NOTE_ACT[a.n] ? notePages(a, ...NOTE_ACT[a.n]) : [];

  /* ── 빙고: 왼쪽 낱말, 오른쪽 빈 빙고판 (아이들이 직접 채우기) ── */
  window.selfBingoPage = function (a, words, size, title) {
    const p = el(`<div class="page" data-act="${a.n}" style="${catVars(catOf(a))};padding:0"></div>`);
    const half = Math.ceil(words.length / 2);
    p.innerHTML = `<div data-nofill class="sbingo"><div class="sb-left"><div class="sb-title">${esc(title || a.name)}</div><div class="sb-sub">아래 낱말 중에서 골라 오른쪽 빙고판을 내가 직접 채워요.</div><div class="sb-words">${[words.slice(0, half), words.slice(half)].map(col => `<ol>${col.map(w => `<li>${esc(w)}</li>`).join('')}</ol>`).join('')}</div></div>
      <div class="sb-right"><div class="sb-name">${nameLine()}</div><div class="sb-grid" style="grid-template-columns:repeat(${size},1fr);grid-template-rows:repeat(${size},1fr)">${Array(size * size).fill('<div></div>').join('')}</div><div class="sb-foot">빙고 줄 수: ○ ○ ○ ○ ○</div></div></div>`;
    return p;
  };
  const baseBingo = T.bingo;
  T.bingo = function (a, ctx) {
    baseBingo(a, ctx);
    if (a.mission) return;
    const words = () => ($('textarea', ctx.opts) ? $('textarea', ctx.opts).value : '').split('\n').map(s => s.trim()).filter(Boolean);
    let size = Store.d('sbingo:size:' + a.n, 4);
    const cnt = () => Math.max(Store.roster().length, 1) || 24;
    const doPrint = () => { const w = words(); if (w.length < size * size) return toast(`낱말이 ${size * size}개 이상 필요해요 (지금 ${w.length}개)`); printPages(Array.from({ length: Store.roster().length || 24 }, () => selfBingoPage(a, w, size))); };
    ctx.print(doPrint);
    const box = el('<div style="display:flex;flex-direction:column;gap:8px;border-top:1.5px dashed var(--rule);padding-top:10px"></div>');
    box.append(field('아이들이 채울 빙고판 크기', seg([[3, '3×3'], [4, '4×4'], [5, '5×5']], size, v => { size = v; Store.set('sbingo:size:' + a.n, v); })));
    const pv = el('<button class="btn">빙고 활동지 미리 보기</button>'); pv.onclick = () => { const w = words(); const sb = $('.stagebody', ctx.stage); showPaper(sb, [selfBingoPage(a, w, size)]); };
    const pr = el('<button class="btn dark">빙고 활동지 인쇄 (낱말 + 빈 빙고판)</button>'); pr.onclick = doPrint;
    box.append(pv, pr, el('<p class="hint">위 낱말 칸을 아이들과 이야기하며 고친 뒤 "낱말 저장"을 누르면, 그 낱말이 그대로 활동지 왼쪽에 인쇄돼요.</p>'));
    if (a.pool === 'concept') { const kb = el('<button class="btn flat">교사용 낱말 뜻 정리 인쇄</button>'); kb.onclick = () => printPages([conceptKey(a, words())]); box.append(kb); }
    ctx.opts.append(box);
  };

  /* ── 46 교사용 낱말 뜻 ── */
  const DEF = {
    '덧셈': '두 수를 합하는 계산', '뺄셈': '어떤 수에서 다른 수를 덜어 내는 계산', '모으기': '두 수를 모아 하나의 수로 만들기', '가르기': '하나의 수를 두 수로 나누기', '100까지의 수': '1부터 100까지 세고 읽고 쓰는 수', '10개씩 묶음': '열 개를 한 묶음으로 세는 방법', '시계 보기': '짧은바늘로 시, 긴바늘로 분을 읽어요', '몇 시 30분': '긴바늘이 6을 가리킬 때', '세모 모양': '뾰족한 곳이 3군데인 모양', '네모 모양': '뾰족한 곳이 4군데인 모양', '동그라미 모양': '뾰족한 곳 없이 둥근 모양', '길이 비교': '더 길고 짧은지 견주기', '무게 비교': '더 무겁고 가벼운지 견주기', '넓이 비교': '더 넓고 좁은지 견주기', '짝수': '둘씩 짝지으면 남는 것이 없는 수', '홀수': '둘씩 짝지으면 하나가 남는 수', '자음': 'ㄱ, ㄴ, ㄷ처럼 소리의 처음과 끝에 오는 글자', '모음': 'ㅏ, ㅑ, ㅓ처럼 소리를 내는 글자', '받침': '글자 아래에 오는 자음', '낱말': '뜻을 가진 말의 한 덩어리', '문장': '생각을 완성해서 나타낸 말', '인사말': '만나거나 헤어질 때 하는 말', '그림일기': '하루의 일을 그림과 글로 쓴 일기', '봄': '새싹이 돋고 꽃이 피는 계절', '여름': '덥고 비가 많이 오는 계절', '가을': '단풍이 들고 곡식이 익는 계절', '겨울': '춥고 눈이 오는 계절', '학교': '공부하고 친구를 만나는 곳', '가족': '함께 살며 서로 돌보는 사람들', '이웃': '가까이 사는 사람들',
    '곱셈': '같은 수를 여러 번 더한 것을 간단히 나타낸 계산', '곱셈구구': '1단부터 9단까지의 곱셈', '네 자리 수': '천의 자리까지 있는 수', '1000': '100이 10개인 수', '미터(m)': '길이의 단위, 1m는 100cm', '센티미터(cm)': '길이의 단위, 자의 큰 눈금 한 칸', '시각': '시계가 가리키는 때 (예: 3시 20분)', '시간': '어떤 때부터 어떤 때까지의 동안', '1시간은 60분': '긴바늘이 한 바퀴 도는 동안', '표': '조사한 것을 칸에 정리한 것', '그래프': '조사한 것을 그림이나 막대로 나타낸 것', '규칙': '반복되거나 일정하게 바뀌는 약속', '분류': '기준을 정해 나누는 것', '삼각형': '변 3개, 꼭짓점 3개인 도형', '사각형': '변 4개, 꼭짓점 4개인 도형', '원': '어느 쪽에서 보아도 똑같이 둥근 도형', '오각형': '변이 5개인 도형', '육각형': '변이 6개인 도형', '받아올림': '덧셈에서 10이 되면 윗자리로 1을 올리는 것', '받아내림': '뺄셈에서 윗자리에서 10을 빌려 오는 것', '흉내 내는 말': '소리나 모양을 흉내 낸 말 (멍멍, 깡충깡충)', '높임말': '웃어른께 공손하게 쓰는 말', '문장 부호': '마침표, 물음표, 느낌표, 쉼표 같은 부호', '일기': '그날 겪은 일과 생각을 쓴 글', '편지': '받는 사람에게 마음을 전하는 글', '겪은 일': '내가 직접 경험한 일', '사계절': '봄, 여름, 가을, 겨울', '우리나라': '대한민국', '세계': '여러 나라가 모인 지구 전체', '마을': '사람들이 모여 사는 곳',
    '세 자리 수': '백의 자리까지 있는 수', '나눗셈': '똑같이 나누는 계산', '몫': '나눗셈에서 나누어 얻은 수', '나머지': '똑같이 나누고 남은 수', '분수': '전체를 똑같이 나눈 것 중의 부분', '단위분수': '분자가 1인 분수', '소수': '0.1처럼 소수점을 써서 나타낸 수', '직각': '종이를 반듯하게 두 번 접었을 때 생기는 각', '직각삼각형': '한 각이 직각인 삼각형', '직사각형': '네 각이 모두 직각인 사각형', '정사각형': '네 각이 직각이고 네 변의 길이가 같은 사각형', '원의 중심': '원의 한가운데 점', '반지름': '원의 중심에서 원 위의 한 점까지 이은 선분', '지름': '원의 중심을 지나 원 위의 두 점을 이은 선분', '밀리미터(mm)': '1cm를 똑같이 10칸으로 나눈 한 칸', '킬로미터(km)': '1000m', '초': '시간의 단위, 60초는 1분', '들이': '그릇에 담을 수 있는 양 (L, mL)', '무게': '무거운 정도 (kg, g)', '방위표': '지도에서 동서남북을 알려 주는 표시', '범례': '지도에 쓴 기호와 그 뜻을 모아 둔 것', '우리 고장': '내가 사는 지역', '자석': '철을 끌어당기는 물체', '극': '자석에서 힘이 가장 센 양 끝 (N극, S극)', '한살이': '태어나서 자라 자손을 남기기까지의 과정', '동물의 생활': '동물이 사는 곳, 먹이, 생김새', '소리': '물체가 떨려서 생기는 것', '고체': '모양과 부피가 일정한 물질 (얼음, 돌)', '액체': '담는 그릇에 따라 모양이 바뀌는 물질 (물)', '기체': '담는 그릇을 가득 채우는 물질 (공기)', '국어사전': '낱말의 뜻을 찾아보는 책', '중심 문장': '문단에서 가장 중요한 내용을 담은 문장',
    '큰 수': '만, 억, 조처럼 아주 큰 수', '만': '1000이 10개인 수 (10000)', '억': '1만이 1만 개인 수', '조': '1억이 1만 개인 수', '각도': '각의 크기 (단위: 도, °)', '예각': '직각보다 작은 각', '둔각': '직각보다 크고 180°보다 작은 각', '평면도형의 이동': '도형을 밀기, 뒤집기, 돌리기', '막대그래프': '조사한 수를 막대 길이로 나타낸 그래프', '꺾은선그래프': '시간에 따른 변화를 선으로 이은 그래프', '분모가 같은 분수': '분모가 같으면 분자끼리 더하고 빼요', '소수 두 자리 수': '0.01 단위까지 있는 소수', '이등변삼각형': '두 변의 길이가 같은 삼각형', '정삼각형': '세 변의 길이가 같은 삼각형', '사다리꼴': '평행한 변이 한 쌍이라도 있는 사각형', '평행사변형': '마주 보는 두 쌍의 변이 평행한 사각형', '마름모': '네 변의 길이가 모두 같은 사각형', '다각형': '선분으로만 둘러싸인 도형', '대각선': '이웃하지 않은 두 꼭짓점을 이은 선분', '지층': '자갈, 모래, 진흙이 쌓여 생긴 층', '화석': '옛날 생물의 몸이나 흔적이 남은 것', '퇴적암': '쌓인 알갱이가 굳어서 생긴 암석', '식물의 한살이': '씨가 싹 트고 자라 꽃 피고 열매 맺는 과정', '증발': '물의 표면에서 물이 수증기로 바뀌는 것', '끓음': '물속과 표면에서 물이 수증기로 바뀌는 것', '그림자': '빛이 물체에 막혀 생긴 어두운 부분', '화산': '땅속 마그마가 나와 생긴 산', '지진': '땅이 흔들리는 것', '등고선': '높이가 같은 곳을 이은 선', '공공 기관': '주민 생활을 돕는 곳 (주민센터, 소방서)', '촌락': '농촌, 어촌, 산지촌 같은 마을', '도시': '사람과 건물이 많이 모인 곳', '사실과 의견': '실제 있었던 일 / 자기 생각',
    '약수': '어떤 수를 나누어떨어지게 하는 수', '배수': '어떤 수를 1배, 2배, 3배… 한 수', '최대공약수': '공통인 약수 중 가장 큰 수', '최소공배수': '공통인 배수 중 가장 작은 수', '약분': '분모와 분자를 공약수로 나누어 간단히 하는 것', '통분': '분수들의 분모를 같게 만드는 것', '기약분수': '더 이상 약분할 수 없는 분수', '혼합 계산': '괄호 → 곱셈·나눗셈 → 덧셈·뺄셈 순서로 계산', '둘레': '도형 가장자리의 길이', '넓이': '평면이 차지하는 크기 (cm²)', '이상과 이하': '그 수를 포함해서 크거나 작은 수', '초과와 미만': '그 수를 포함하지 않고 크거나 작은 수', '반올림': '구하려는 자리 아래가 5 이상이면 올리고 4 이하면 버리기', '올림과 버림': '아래 자리를 올리거나 버리기', '합동': '모양과 크기가 같아 완전히 겹치는 도형', '선대칭': '한 직선으로 접으면 완전히 겹치는 도형', '점대칭': '한 점을 중심으로 180° 돌리면 겹치는 도형', '직육면체': '직사각형 6개로 둘러싸인 도형', '정육면체': '정사각형 6개로 둘러싸인 도형', '전개도': '입체도형을 펼쳐 놓은 그림', '평균': '자료를 모두 더해 자료의 수로 나눈 값', '가능성': '어떤 일이 일어날 것이라고 기대되는 정도', '온도': '차갑고 따뜻한 정도를 수로 나타낸 것', '전도': '고체에서 열이 이동하는 방법', '대류': '액체나 기체가 직접 움직이며 열이 이동하는 방법', '태양계': '태양과 태양 주위를 도는 천체들', '행성': '태양 주위를 도는 큰 천체', '용해': '물질이 물에 녹아 골고루 섞이는 것', '용액': '물질이 녹아 있는 물 (소금물)', '생태계': '생물과 환경이 서로 영향을 주고받는 곳', '산성': '푸른 리트머스 종이를 붉게 바꾸는 성질', '염기성': '붉은 리트머스 종이를 푸르게 바꾸는 성질', '고조선': '우리 역사에서 처음 세워진 나라', '삼국 시대': '고구려, 백제, 신라가 함께 있던 시대', '고려': '왕건이 세운 나라', '조선': '이성계가 세운 나라', '훈민정음': '세종대왕이 만든 우리 글자, 지금의 한글', '국토': '한 나라의 땅 (영토, 영해, 영공)', '인권': '사람이라면 누구나 누려야 할 권리',
    '분수의 나눗셈': '나누는 분수의 분모와 분자를 바꿔 곱해요', '소수의 나눗셈': '나누는 수를 자연수로 바꿔 계산해요', '비': '두 수를 기호 :로 비교한 것', '비율': '기준량에 대한 비교하는 양의 크기', '백분율': '기준량을 100으로 할 때의 비율 (%)', '비례식': '비율이 같은 두 비를 =로 나타낸 식', '비례배분': '전체를 주어진 비로 나누는 것', '원주율': '원의 둘레가 지름의 몇 배인지 나타낸 값 (약 3.14)', '원의 넓이': '반지름 × 반지름 × 원주율', '각기둥': '두 밑면이 합동인 다각형인 입체도형', '각뿔': '밑면이 다각형이고 옆면이 삼각형인 입체도형', '원기둥': '두 밑면이 합동인 원인 입체도형', '원뿔': '밑면이 원이고 뾰족한 꼭짓점이 있는 입체도형', '구': '공 모양의 입체도형', '부피': '입체도형이 차지하는 공간의 크기 (cm³)', '겉넓이': '입체도형 겉면의 넓이를 모두 더한 것', '띠그래프': '전체를 띠 모양에 비율로 나눈 그래프', '원그래프': '전체를 원 모양에 비율로 나눈 그래프', '자전': '지구가 하루에 한 바퀴 스스로 도는 것', '공전': '지구가 1년에 한 바퀴 태양 주위를 도는 것', '광합성': '식물이 빛을 이용해 양분을 만드는 것', '렌즈': '빛을 굴절시키는 투명한 물체 (볼록, 오목)', '굴절': '빛이 다른 물질로 들어갈 때 꺾이는 것', '전기 회로': '전지, 전선, 전구가 이어져 전기가 흐르는 길', '연소': '물질이 산소와 만나 빛과 열을 내며 타는 것', '소화': '연소 조건 중 하나 이상을 없애 불을 끄는 것', '계절의 변화': '지구 자전축이 기울어진 채 공전해서 생겨요', '민주주의': '국민이 나라의 주인인 정치', '헌법': '나라의 가장 높은 법', '국회': '법을 만드는 곳', '정부': '법에 따라 나라 살림을 하는 곳', '법원': '재판을 하는 곳', '경제': '물건을 만들고 나누고 쓰는 활동', '세계 여러 나라': '저마다 다른 문화와 생활을 가진 나라들', '통일': '남북한이 하나가 되는 것', '지구촌': '세계를 하나의 마을처럼 이르는 말'
  };
  DEF['기체'] = DEF['기체'] || '공기처럼 담는 그릇을 가득 채우는 물질';
  function conceptKey(a, words) {
    const p = pageFrame(a, '핵심 개념 빙고 낱말 뜻 (선생님용)', '낱말이 불리면 아이들과 함께 뜻을 말해 보세요.', { noName: true });
    p.insertAdjacentHTML('beforeend', `<div class="keycols">${words.map(w => `<div><b>${esc(w)}</b><span>${esc(DEF[w] || '(선생님이 뜻을 적어 주세요)')}</span></div>`).join('')}</div>`);
    return p;
  }

  /* ── 26 포토존: 손팻말 여러 모양 + 전자칠판 배경판 ── */
  const SIGNS = ['한 학년 끝!', '새 학년 간다!', '우리 반 최고', '고마워요 선생님', '2027 새 출발', '방학이다!', '우정 영원히', '사랑해 우리 반', '많이 컸지?', '해냈다!'];
  set(26, { signs: SIGNS, steps: ['손팻말을 골라 인쇄하고 색칠해 막대에 붙여요.', '전자칠판에 포토존 배경을 띄워요.', '모둠별로 차례를 정해 배경 앞에서 찍어요.'] });
  window.openBackdrop = function (imgs, text, kidsText) {
    let i = 0;
    const ov = el(`<div class="bdrop"><img alt=""><div class="bd-text" contenteditable="true" spellcheck="false">${esc(text || '')}</div><div class="bd-bar"><button class="btn" data-p>이전 배경</button><button class="btn" data-n>다음 배경</button><button class="btn" data-t>글자 숨기기</button><button class="btn dark" data-x>닫기</button></div></div>`);
    const show = () => { $('img', ov).src = imgs[i]; };
    $('[data-p]', ov).onclick = () => { i = (i + imgs.length - 1) % imgs.length; show(); };
    $('[data-n]', ov).onclick = () => { i = (i + 1) % imgs.length; show(); };
    $('[data-t]', ov).onclick = e => { const t = $('.bd-text', ov); t.hidden = !t.hidden; e.target.textContent = t.hidden ? '글자 보이기' : '글자 숨기기'; };
    $('[data-x]', ov).onclick = () => { ov.remove(); if (document.fullscreenElement) document.exitFullscreen(); };
    document.body.appendChild(ov); show(); try { ov.requestFullscreen && ov.requestFullscreen(); } catch (e) {}
  };
  const baseGuide = T.guide;
  T.guide = function (a, ctx) {
    baseGuide(a, ctx);
    if (a.n !== 26) return;
    ctx.print(() => printPages(signPages(a, SIGNS)));
    const bd = el('<button class="btn dark big" style="justify-content:center">전자칠판 포토존 배경 띄우기</button>');
    bd.onclick = () => openBackdrop(['img/bg/bg1.jpg', 'img/bg/bg2.jpg', 'img/bg/bg3.jpg', 'img/bg/bg4.jpg', 'img/bg/bg6.jpg'], `${className() || '우리 반'} 2026 ♥`);
    const sp = el('<button class="btn">손팻말 10가지 인쇄</button>'); sp.onclick = () => printPages(signPages(a, SIGNS));
    const pv = el('<button class="btn flat">손팻말 미리 보기</button>'); pv.onclick = () => { const b = $('.stagebody', ctx.stage); b.innerHTML = ''; showPaper(b, signPages(a, SIGNS).slice(0, 2)); };
    ctx.opts.prepend(bd); ctx.opts.append(sp, pv, el('<p class="hint">배경 위 글자는 눌러서 바로 고칠 수 있어요. 전자칠판 앞에 서서 찍으면 사진관처럼 나와요.</p>'));
  };

  /* ── 80 장기자랑: 무대 배경이 무작위로 ── */
  const baseLineup = T.lineup;
  T.lineup = function (a, ctx) {
    baseLineup(a, ctx);
    const st = ctx.stage, BGS = ['img/bg/bg5.jpg', 'img/bg/bg6.jpg', 'img/bg/bg4.jpg', 'img/bg/bg1.jpg', 'img/bg/bg3.jpg'];
    let last = '';
    const apply = () => { const d = $('.drawn', st); const sb = $('.stagebody', st); if (!d || !sb) return; const key = d.textContent; if (key === last) return; last = key; const bg = pickOne(BGS); sb.style.cssText = `background:url(${bg}) center/cover;`; sb.classList.toggle('darkbg', bg.endsWith('bg4.jpg')); };
    new MutationObserver(apply).observe(st, { childList: true, subtree: true, characterData: true }); apply();
  };

  /* ── 25 학급 어워즈: 재미있는 부문 많이 ── */
  const AW = [['올해의 명장면', '운동회 이어달리기\n현장체험학습\n학예회 무대'], ['올해의 유행어', ''], ['올해의 급식 메뉴', '떡볶이\n돈가스\n짜장면\n치킨'], ['가장 많이 웃은 날', ''], ['올해의 놀이', '얼음땡\n공기놀이\n피구'], ['선생님이 가장 많이 한 말', ''], ['올해의 깜짝 사건', ''], ['최고의 쉬는 시간 놀이', ''], ['올해의 교실 노래', ''], ['가장 맛있었던 간식', ''], ['최고의 체육 시간', ''], ['가장 기억에 남는 수업', ''], ['올해의 날씨 사건 (첫눈, 소나기…)', ''], ['우리 반 최고의 팀워크 순간', ''], ['올해의 실수 대잔치 (웃긴 실수)', ''], ['가장 감동적인 순간', '']];
  const vd = Store.get().data.vote;
  if (!vd || vd.length < AW.length) { Store.get().data.vote = AW.map(([t, n]) => { const old = vd && vd.find(x => x.t === t); return old || { t, n, v: {} }; }); Store.save(); }

  /* ── 55 달력: 처음 한 번은 앞뒤 한 장으로 ── */
  if (!Store.get().data['cal:v2']) { Store.set('cal:per', 6); Store.set('cal:v2', 1); }
})();
