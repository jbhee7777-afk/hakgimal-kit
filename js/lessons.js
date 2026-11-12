/* 전자칠판용 수업 슬라이드 + 수업 활동지 */
(function () {
  const SAFE_VIDEO = { id: '6URfl_P8Nd4', src: '행정안전부 안전한TV', name: '겨울철 필수 안전교육 (빙판길 낙상, 핫팩 저온화상, 동상)' };
  const HOME_VIDEO = { id: 'YO6DLPesUuc', src: '한국생활안전연합', name: '집에 혼자 있을 때는 이렇게 해요' };

  window.LESSONS = {
    59: {
      title: '겨울방학 안전 약속', bg: '#EAF4FB', ink: '#1F5FA8',
      plan: '설명 10분 + 활동지 30분',
      slides: [
        { t: 'cover', title: '겨울방학 안전 약속', sub: '안전하게, 신나게! 겨울방학을 준비해요', img: 'img/kids.png', free: 1 },
        { t: 'list', title: '이럴 때 어떻게 할까요?', points: ['꽁꽁 언 빙판길을 걸어야 할 때', '손과 발이 차갑게 얼었을 때', '집에 혼자 있는데 초인종이 울릴 때'], img: 'slides/safety/icy.jpg', note: '아이들에게 겪어 본 일을 두세 명 들어 보세요.' },
        { t: 'goal', title: '오늘의 공부', text: '겨울방학에 꼭 지킬 안전 약속을 알고, 나만의 안전 약속 포스터를 만들어요.', flow: [['설명 듣기', '10분'], ['활동지 쓰기', '30분']] },
        { t: 'video', title: '영상으로 알아봐요: 빙판길과 핫팩', look: ['빙판길에서는 어떻게 걸어야 할까요?', '핫팩은 어떻게 써야 안전할까요?'], v: SAFE_VIDEO, start: 31, end: 322, len: '약 5분 (0:31~5:22)' },
        { t: 'choose', title: '빙판길에서 바르게 걷는 방법은?', hint: '하나씩 눌러서 확인해요', items: [['주머니에 손을 넣고 걸어요', 0], ['장갑을 끼고, 손은 밖으로 빼고 걸어요', 1], ['친구와 신나게 뛰어가요', 0], ['작은 걸음으로 천천히 걸어요', 1]], img: 'slides/safety/icy.jpg' },
        { t: 'ox', title: '핫팩을 붙인 채로 잠을 자도 괜찮아요.', a: 'X', e: '뜨겁지 않아도 오래 닿으면 화상을 입어요. 핫팩은 옷 위에 붙이고, 잘 때는 떼어요.' },
        { t: 'steps', title: '손발이 꽁꽁 얼었다면?', points: ['따뜻한 곳으로 들어가요', '젖은 장갑과 양말을 벗어요', '따뜻한 물로 천천히 녹여요'], warn: '세게 문지르거나 아주 뜨거운 물에 넣으면 안 돼요. 어른께 꼭 알려요.', img: 'slides/safety/warm.jpg', more: { v: SAFE_VIDEO, start: 323, end: 465, label: '동상 영상 더 보기 (약 2분)' } },
        { t: 'list', title: '집에 혼자 있을 때', points: ['누가 와도 문을 열지 않아요', '먼저 부모님께 전화해요', '무서운 일이 생기면 112'], img: 'slides/safety/home.jpg', more: { v: HOME_VIDEO, link: 1, label: '영상 더 보기: 집에 혼자 있을 때 (4분, 유튜브)' } },
        { t: 'calls', title: '꼭 기억해요, 도움 전화', items: [['112', '경찰', '위험한 사람을 만났을 때, 길을 잃었을 때', '#2366C2'], ['119', '소방·구급', '불이 났을 때, 크게 다쳤을 때', '#C9305A']] },
        { t: 'work', title: '활동지 시간', min: 30, parts: [['1쪽', '안전 탐정 문제 풀기', '8분'], ['2쪽', '초인종 상황 그리기, 도움 전화 카드 꾸미기', '8분'], ['3쪽', '나의 안전 약속 포스터', '14분']] },
        { t: 'answers', title: '함께 확인해요', rows: [['1번 빙판길', '② 장갑 끼고 손 빼고 걷기, ④ 작은 걸음으로 천천히'], ['2번 핫팩', '① O   ② X   ③ O'], ['3번 순서', '(나) 따뜻한 곳으로 → (다) 젖은 것 벗기 → (가) 따뜻한 물로 녹이기'], ['도움 전화', '경찰 112, 소방·구급 119']] },
        { t: 'cover', title: '약속을 지키는 멋진 겨울방학!', sub: '포스터를 집에 가져가 가족과 함께 읽어요', img: 'img/sheep.png', end: 1 }
      ],
      pages: a => [safetyP1(a), safetyP2(a), safetyP3(a)],
      key: a => [safetyKey(a)]
    },
    71: {
      title: '학기말 대청소', bg: '#FFF7E3', ink: '#B5651D',
      plan: '한 장씩 띄워 두고 다 함께 따라 해요',
      ppt: 'ppt/학기말-대청소-순서.pptx',
      slides: [
        { t: 'cover', title: '다 함께 대청소!', sub: '화면을 보고 한 가지씩 따라 해요', img: 'slides/clean/step01.jpg', photo: 1 },
        ...[
          ['청소 준비', '걸레, 빗자루, 쓰레기봉투를 준비하고 소매를 걷어요.', 2],
          ['책상 서랍 비우기', '서랍 속 물건을 모두 책상 위로 꺼내요.', 3],
          ['사물함 비우기', '물건은 가방에 챙기고, 빈 사물함은 젖은 걸레로 닦아요.', 4],
          ['나누어 버리기', '종이, 플라스틱, 일반 쓰레기를 나누어 버려요.', 3],
          ['책상 위 닦기', '낙서를 지우고 걸레로 책상 위를 깨끗이 닦아요.', 3],
          ['의자 닦기', '앉는 곳, 등받이, 의자 다리 아래까지 꼼꼼히 닦아요.', 3],
          ['높은 곳 먼지 닦기', '먼지는 위에서 아래로! 창틀과 사물함 위부터 닦아요.', 4],
          ['의자 올리고 바닥 쓸기', '의자를 책상 위에 올리고 앞에서 뒤로 쓸어요.', 4],
          ['바닥 걸레질', '젖은 걸레로 바닥을 닦아요. 구석까지 꼼꼼하게!', 4],
          ['책상 줄 맞추기', '의자를 내리고 책상 줄을 반듯하게 맞춰요.', 2],
          ['손 씻기', '청소가 끝나면 비누로 손을 깨끗이 씻어요.', 2]
        ].map(([title, text, min], i) => ({ t: 'do', n: i + 1, total: 11, title, text, min, img: `slides/clean/step${String(i + 2).padStart(2, '0')}.jpg` })),
        { t: 'cover', title: '반짝반짝 교실 완성!', sub: '깨끗해진 교실을 둘러보고 서로 칭찬해요. 수고했어요!', img: 'slides/clean/step13.jpg', photo: 1, end: 1 }
      ]
    }
  };

  /* ───── 슬라이드 엔진 ───── */
  window.runLesson = function (a, host, ctx) {
    const L = LESSONS[a.n], S = L.slides;
    const sm = location.hash.match(/[?&]s=(\d+)/);
    let i = sm ? Math.min(S.length - 1, Math.max(0, +sm[1] - 1)) : 0;
    host.innerHTML = '';
    const wrap = el(`<div class="lsn" style="--lb:${L.bg};--li:${L.ink}"><div class="lsn-fit"><div class="lsn-slide"></div></div>
      <div class="lsn-bar"><button class="lsn-nav" data-p aria-label="이전 장">${ICON.back}</button><div class="lsn-dots"></div><span class="lsn-count"></span><button class="lsn-nav big" data-n aria-label="다음 장">${ICON.next}</button></div></div>`);
    host.appendChild(wrap);
    const slide = $('.lsn-slide', wrap), fitBox = $('.lsn-fit', wrap), dots = $('.lsn-dots', wrap);
    S.forEach((_, k) => { const d = el(`<button aria-label="${k + 1}번째 장"></button>`); d.onclick = () => go(k); dots.appendChild(d); });
    const fit = () => { const w = fitBox.clientWidth, h = fitBox.clientHeight; const s = Math.min(w / 1600, h / 900); slide.style.transform = `translate(-50%,-50%) scale(${s})`; };
    new ResizeObserver(fit).observe(fitBox);
    function go(k) { clearTimers(); i = Math.max(0, Math.min(S.length - 1, k)); draw(); }
    $('[data-p]', wrap).onclick = () => go(i - 1);
    $('[data-n]', wrap).onclick = () => go(i + 1);
    fitBox.onclick = e => { if (e.target.closest('button, a, iframe, .lsn-stop')) return; const r = fitBox.getBoundingClientRect(); go(e.clientX - r.left < r.width * 0.25 ? i - 1 : i + 1); };
    const key = e => { if (!document.body.contains(wrap)) return document.removeEventListener('keydown', key); if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(i + 1); } if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(i - 1); };
    document.addEventListener('keydown', key);
    let sx = null; fitBox.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    fitBox.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 70) go(dx < 0 ? i + 1 : i - 1); sx = null; });

    function draw() {
      const s = S[i];
      $$('button', dots).forEach((d, k) => d.classList.toggle('on', k === i));
      $('.lsn-count', wrap).textContent = `${i + 1} / ${S.length}`;
      slide.className = 'lsn-slide t-' + s.t;
      slide.style.backgroundImage = s.bg ? `linear-gradient(rgba(255,255,255,.55), rgba(255,255,255,.55)), url(${s.bg})` : '';
      slide.style.backgroundSize = 'cover';
      slide.innerHTML = render(s);
      bind(s);
      fit();
    }
    const img = (s, cls) => s.img ? `<div class="lsn-img ${cls || ''} ${s.photo ? 'photo' : ''}"><img src="${s.img}" alt=""></div>` : '';
    function render(s) {
      if (s.t === 'cover') return `<div class="lsn-cover"><div class="lsn-ct"><div class="lsn-kicker">${esc(L.title)}</div><h1>${esc(s.title)}</h1><p>${esc(s.sub)}</p></div>${img(s, s.photo ? '' : 'free')}</div>`;
      if (s.t === 'list') return `<div class="lsn-two"><div><div class="lsn-kicker">생각 열기</div><h2>${esc(s.title)}</h2><ul class="lsn-list">${s.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>${more(s)}</div>${img(s, s.free ? 'free' : '')}</div>`;
      if (s.t === 'example') return `<div class="lsn-two"><div><h2>${esc(s.title)}</h2><div class="lsn-exbox"><span>예시</span><p>${esc(s.text)}</p></div><p class="lsn-hint" style="margin-top:26px">내 생각은 예시와 달라도 괜찮아요.</p></div>${img(s, 'free')}</div>`;
      if (s.t === 'share') return `<div class="lsn-two"><div><div class="lsn-kicker">나눔과 정리</div><h2>${esc(s.title)}</h2><p class="lsn-big" style="font-weight:700">${esc(s.text)}</p><div class="lsn-pick lsn-stop">${Store.roster().length ? '<button class="btn huge dark" data-pick>발표할 친구 뽑기</button><b class="lsn-picked"></b>' : '<p class="lsn-hint">두세 명이 발표하고 박수를 보내요.</p>'}</div></div>${img(s, 'free')}</div>`;
      if (s.t === 'steps') return `<div class="lsn-two"><div><h2>${esc(s.title)}</h2><ol class="lsn-steps">${s.points.map(p => `<li>${esc(p)}</li>`).join('')}</ol><div class="lsn-warn">${esc(s.warn)}</div>${more(s)}</div>${img(s)}</div>`;
      if (s.t === 'sheetex') return `<div class="lsn-two lsn-sx"><div><h2>${esc(s.title)}</h2>${s.steps ? `<ol class="lsn-steps">${s.steps.map(p => `<li>${esc(p)}</li>`).join('')}</ol>` : `<div class="lsn-exbox"><span>예시</span><p>${esc(s.text)}</p></div><p class="lsn-hint" style="margin-top:22px">글과 그림은 내 생각대로 바꿔도 좋아요.</p>`}</div><div class="lsn-sheet lsn-stop"></div></div>`;
      if (s.t === 'gallery3') return `<div class="lsn-goal"><h2>${esc(s.title)}</h2><div class="lsn-g3">${s.items.map(([im, t, d]) => `<div><div class="g3img"><img src="${im}" alt=""></div><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join('')}</div></div>`;
      if (s.t === 'colors') return `<div class="lsn-goal"><h2>${esc(s.title)}</h2><div class="lsn-cols">${s.items.map(([k, n, col], i) => `<div class="${i === s.mark ? 'on' : ''}"><i style="background:${col}"></i><b>${esc(k)}</b><span>${esc(n)}</span></div>`).join('')}</div><p class="lsn-big" style="margin-top:34px;font-size:40px">${esc(s.text)}</p></div>`;
      if (s.t === 'zodiac') return `<div class="lsn-goal"><h2>${esc(s.title)}</h2><div class="lsn-zod">${s.items.map((z, k) => `<div class="${s.mark[k] ? 'on' : ''}"><i>${k + 1}</i><b>${esc(z)}</b>${s.mark[k] ? `<span>${s.mark[k]}</span>` : ''}</div>`).join('')}</div><p class="lsn-hint" style="margin-top:26px">12가지 동물이 차례로 돌아가요. 12년이 지나면 다시 같은 띠!</p></div>`;
      if (s.t === 'goal') return `<div class="lsn-goal"><div class="lsn-kicker">${esc(L.title)}</div><h2>${esc(s.title)}</h2><p class="lsn-big">${esc(s.text)}</p></div>`;
      if (s.t === 'video') return `<div class="lsn-video"><div class="lsn-vside"><h2>${esc(s.title)}</h2><div class="lsn-look"><b>영상을 보며 찾아요</b>${s.look.map(q => `<p>${esc(q)}</p>`).join('')}</div><div class="lsn-src">${esc(s.v.src)} · ${esc(s.len)}</div></div><div class="lsn-player lsn-stop"><button class="lsn-play">${ICON.next}<span>영상 틀기</span></button></div></div>`;
      if (s.t === 'choose') return `<div class="lsn-two"><div><h2>${esc(s.title)}</h2><p class="lsn-hint">${esc(s.hint)}</p><div class="lsn-choose">${s.items.map(([t, ok], k) => `<button class="lsn-opt" data-ok="${ok}"><span class="k">${'①②③④'[k]}</span><span>${esc(t)}</span><span class="m"></span></button>`).join('')}</div></div>${img(s)}</div>`;
      if (s.t === 'ox') return `<div class="lsn-ox"><div class="lsn-kicker">O일까요, X일까요?</div><h2>${esc(s.title)}</h2><div class="lsn-oxrow"><button class="lsn-oxb" data-m="O">${ICON.O}</button><button class="lsn-oxb" data-m="X">${ICON.X}</button></div><p class="lsn-exp hide">${esc(s.e)}</p></div>`;
      if (s.t === 'calls') return `<div class="lsn-calls"><h2>${esc(s.title)}</h2><div class="lsn-callrow">${s.items.map(([n, w, d, c]) => `<div class="lsn-call" style="--cc:${c}"><b>${n}</b><span>${w}</span><p>${d}</p></div>`).join('')}</div><p class="lsn-hint">장난 전화는 하면 안 돼요. 정말 필요할 때만 걸어요.</p></div>`;
      if (s.t === 'work') return `<div class="lsn-work"><div><h2>${esc(s.title)}</h2><div class="lsn-parts">${s.parts.map(([p, t, m]) => `<div><b>${p}</b><span>${esc(t)}</span><i>${m}</i></div>`).join('')}</div><p class="lsn-hint">연필과 색연필을 준비해요. 다 하면 손을 들어요.</p>${L.key ? '<button class="lsn-more lsn-stop" data-key>예시 답안 보기 (선생님)</button>' : ''}${s.tool ? '<button class="lsn-more lsn-stop" data-tool>활동 화면 열기</button>' : ''}${L.pages && !L.key ? '<button class="lsn-more lsn-stop" data-printw>활동지 인쇄</button>' : ''}</div><div class="lsn-timer lsn-stop"><div class="lsn-time">${s.min}:00</div><div class="lsn-tbtn"><button class="btn huge dark" data-ts>시작</button><button class="btn huge" data-tr>다시</button></div></div></div>`;
      if (s.t === 'answers') return `<div class="lsn-ans"><h2>${esc(s.title)}</h2><div class="lsn-rows">${s.rows.map(([k, v]) => `<button class="lsn-row lsn-stop"><b>${esc(k)}</b><span class="v">${esc(v)}</span><span class="tap">눌러서 보기</span></button>`).join('')}</div>${L.key ? '<button class="lsn-more lsn-stop" data-key>예시 정답지 전체 보기</button>' : ''}</div>`;
      if (s.t === 'do') return `<div class="lsn-do"><div class="lsn-dot"><div class="lsn-stepn">${s.n}<small> / ${s.total}</small></div><h2>${esc(s.title)}</h2><p class="lsn-big">${esc(s.text)}</p><div class="lsn-dtimer lsn-stop"><span class="lsn-time sm">${s.min}:00</span><button class="btn huge dark" data-ts>${s.min}분 시작</button></div></div>${img(s)}</div>`;
      return '';
    }
    function more(s) { return s.more ? `<button class="lsn-more lsn-stop">${ICON.next}${esc(s.more.label)}</button>` : ''; }
    function playIn(box, v, start, end) {
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1&autoplay=1${start ? '&start=' + start : ''}${end ? '&end=' + end : ''}" title="${esc(v.name)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    }
    function bind(s) {
      const pl = $('.lsn-play', slide);
      if (pl) pl.onclick = () => playIn($('.lsn-player', slide), s.v, s.start, s.end);
      const mb = $('.lsn-more', slide);
      if (mb) mb.onclick = () => {
        if (s.more.link) { window.open('https://www.youtube.com/watch?v=' + s.more.v.id, '_blank', 'noopener'); return; }
        const ov = el('<div class="lsn-over lsn-stop"><div class="lsn-player"></div><button class="btn big" data-x>닫기</button></div>'); slide.appendChild(ov);
        playIn($('.lsn-player', ov), s.more.v, s.more.start, s.more.end); $('[data-x]', ov).onclick = () => ov.remove();
      };
      $$('.lsn-opt', slide).forEach(b => b.onclick = () => { const ok = b.dataset.ok === '1'; b.classList.add(ok ? 'ok' : 'no'); $('.m', b).innerHTML = ok ? ICON.O : ICON.X; beep(ok ? 'ok' : 'no'); });
      $$('.lsn-oxb', slide).forEach(b => b.onclick = () => { $$('.lsn-oxb', slide).forEach(x => x.classList.add(x.dataset.m === s.a ? 'right' : 'dim')); $('.lsn-exp', slide).classList.remove('hide'); beep('ok'); });
      $$('.lsn-row', slide).forEach(b => b.onclick = () => { b.classList.add('open'); beep('pop'); });
      $$('[data-key]', slide).forEach(b => b.onclick = () => window.__showKey && window.__showKey());
      if (s.t === 'sheetex' && s.page) { const box = $('.lsn-sheet', slide); let pg = null; try { pg = s.page(); } catch (e) {} if (pg) { const sc = 740 / 1123; const w = el(`<div style="width:${794 * sc}px;height:${1123 * sc}px;position:relative"></div>`); pg.style.cssText += `;position:absolute;left:0;top:0;transform:scale(${sc});transform-origin:top left;box-shadow:0 14px 40px rgba(31,43,69,.2)`; w.appendChild(pg); box.appendChild(w); requestAnimationFrame(() => window.fillPage && fillPage(pg)); } }
      $$('[data-tool]', slide).forEach(b => b.onclick = () => window.__toTool && window.__toTool());
      $$('[data-printw]', slide).forEach(b => b.onclick = () => window.__printWork && window.__printWork());
      const pk = $('[data-pick]', slide);
      if (pk) { const used = window.__picked || (window.__picked = new Set()); pk.onclick = () => { const r = Store.roster(); let pool = r.filter(n => !used.has(n)); if (!pool.length) { used.clear(); pool = r.slice(); } const out = $('.lsn-picked', slide); let k = 0; const iv = setInterval(() => { out.textContent = pickOne(r); beep('tick'); if (++k > 12) { clearInterval(iv); const n = pickOne(pool); used.add(n); out.textContent = n; beep('fan'); } }, 70); }; }
      const ts = $('[data-ts]', slide);
      if (ts) {
        let left = s.min * 60, iv = null; const tv = $('.lsn-time', slide);
        const show = () => { tv.textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0'); tv.classList.toggle('warn', left <= 60); };
        const stop = () => { clearInterval(iv); iv = null; };
        window.__timers.push({ stop });
        ts.onclick = () => { if (iv) { stop(); ts.textContent = '계속'; return; } ts.textContent = '멈춤'; iv = setInterval(() => { left--; show(); if (left <= 0) { stop(); beep('end'); ts.textContent = '끝!'; confetti(slide.parentNode.parentNode); } }, 1000); };
        const tr = $('[data-tr]', slide); if (tr) tr.onclick = () => { stop(); left = s.min * 60; show(); ts.textContent = '시작'; };
      }
    }
    draw();
  };

  /* ───── 안전교육 활동지 ───── */
  const box = '<svg viewBox="0 0 30 30" style="width:30px;height:30px;flex:none"><rect x="3" y="3" width="24" height="24" rx="5" fill="none" stroke="#56627A" stroke-width="2"/></svg>';
  const qh = (n, t, img) => `<div style="display:flex;gap:10px;align-items:center;font-size:20px;font-weight:700;margin-top:4px"><span style="width:36px;height:36px;border-radius:50%;background:var(--c);color:#fff;display:grid;place-items:center;font-size:18px;flex:none;box-shadow:0 0 0 4px var(--t)">${n}</span><span style="flex:1">${t}</span>${img ? `<img class="qimg" src="${img}" alt="" style="width:54px;height:54px">` : ''}</div>`;
  function head(a, title, guide) { return pageFrame(a, title, guide); }
  function safetyP1(a) {
    const p = head(a, '1쪽 겨울방학 안전 탐정', '영상을 떠올리며 알맞은 것을 골라요.');
    p.insertAdjacentHTML('beforeend', `
      ${qh(1, '빙판길에서 바르게 걷는 방법 두 가지에 ○ 하세요.', 'slides/safety/icy.jpg')}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${['① 주머니에 손을 넣고 걸어요', '② 장갑을 끼고 손을 빼고 걸어요', '③ 친구와 신나게 뛰어가요', '④ 작은 걸음으로 천천히 걸어요'].map(t => `<div style="border:2px solid #CDD5E1;border-radius:16px;padding:11px 16px;font-size:18px;display:flex;align-items:center;justify-content:space-between;gap:10px">${t}<svg viewBox="0 0 40 40" style="width:40px;height:40px;flex:none"><circle cx="20" cy="20" r="16" fill="none" stroke="#CDD5E1" stroke-width="2" stroke-dasharray="4 4"/></svg></div>`).join('')}</div>
      ${qh(2, '핫팩 이야기예요. 맞으면 O, 틀리면 X를 써요.')}
      <div style="display:flex;flex-direction:column;gap:10px">${['① 핫팩은 옷 위에 붙여요.', '② 핫팩을 붙인 채로 잠을 자요.', '③ 피부가 빨개지거나 따가우면 바로 떼요.'].map(t => `<div style="display:flex;align-items:center;justify-content:space-between;font-size:18px;border-bottom:1.5px dashed #CDD5E1;padding:4px 4px">${t}<span style="display:flex;gap:8px;align-items:center;font-size:15px;color:#56627A">( <i style="display:inline-block;width:46px;height:40px;border:2px solid #9AA6B8;border-radius:8px"></i> )</span></div>`).join('')}</div>
      ${qh(3, '손발이 꽁꽁 얼었을 때! 순서대로 1, 2, 3을 써요.', 'slides/safety/warm.jpg')}
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">${[['(가)', '따뜻한 물로 천천히 녹여요'], ['(나)', '따뜻한 곳으로 들어가요'], ['(다)', '젖은 장갑과 양말을 벗어요']].map(([k, t]) => `<div style="border:2px solid #CDD5E1;border-radius:16px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center"><i style="width:48px;height:48px;border:2.5px solid var(--c);border-radius:50%;display:block"></i><b style="font-size:16px;color:var(--c)">${k}</b><span style="font-size:17px;word-break:keep-all">${t}</span></div>`).join('')}</div>
      <div style="font-size:16px;color:#56627A">하면 안 되는 것: 세게 문지르기, 아주 뜨거운 물에 넣기</div>`);
    return p;
  }
  function safetyP2(a) {
    const p = head(a, '2쪽 이럴 땐 이렇게!', '그림으로 그리고, 도움 전화 카드를 꾸며서 오려요.');
    p.insertAdjacentHTML('beforeend', `
      ${qh(4, '집에 혼자 있는데 초인종이 울렸어요. 나는 어떻게 할까요?', 'slides/safety/home.jpg')}
      <div class="box" data-grow style="height:290px;position:relative"><span class="bl">내가 하는 행동을 그려요</span>
        <svg viewBox="0 0 260 120" style="position:absolute;right:18px;top:20px;width:260px;height:120px"><path d="M130 6c66 0 122 22 122 50s-56 50-122 50c-14 0-28-1-40-3L52 116l10-22C30 85 8 72 8 56 8 28 64 6 130 6z" fill="#fff" stroke="#8A95A8" stroke-width="2.5"/><text x="130" y="60" text-anchor="middle" font-family="Miso" font-size="15" fill="#B8C1CF">내가 하는 말</text></svg></div>
      ${qh(5, '도움 전화 카드를 완성하고 예쁘게 꾸며요.')}
      <div style="border:2.5px dashed #9AA6B8;border-radius:22px;padding:22px 26px;position:relative;display:grid;grid-template-columns:1fr 1fr;gap:16px">${ICON.scissor.replace('class="scissor"', 'class="scissor" style="position:absolute;top:-13px;left:20px"')}
        <div style="grid-column:1/3;text-align:center;font-size:26px;font-weight:700;letter-spacing:4px;color:var(--c)">우리 집 도움 전화</div>
        ${[['경찰', '위험한 사람, 길을 잃었을 때'], ['소방·구급', '불이 났을 때, 크게 다쳤을 때']].map(([w, d]) => `<div style="border:2px solid #CDD5E1;border-radius:16px;padding:12px 16px"><div style="font-size:15px;color:#56627A">${d}</div><div style="display:flex;align-items:center;gap:10px;margin-top:6px"><b style="font-size:20px">${w}</b><span style="flex:1;height:52px;border:2px solid #9AA6B8;border-radius:10px"></span></div></div>`).join('')}
        ${['엄마', '아빠 (또는 보호자)'].map(w => `<div style="display:flex;align-items:flex-end;gap:10px;font-size:18px">${w}<span style="flex:1;border-bottom:2px solid #9AA6B8;height:36px"></span></div>`).join('')}
        <div style="grid-column:1/3;height:80px;border:1.5px dashed #CDD5E1;border-radius:14px;display:grid;place-items:center;color:#8A95A8;font-size:14px">카드를 꾸며요 (그림, 무늬)</div></div>`);
    return p;
  }
  function safetyP3(a) {
    const p = head(a, '3쪽 나의 겨울방학 안전 약속 포스터', '지킬 약속을 정하고, 그림과 무늬로 포스터를 꾸며요.');
    p.insertAdjacentHTML('beforeend', `
      <svg viewBox="0 0 690 110" style="width:100%;height:110px"><text x="345" y="88" text-anchor="middle" font-family="Miso" font-weight="700" font-size="82" fill="none" stroke="var(--c)" stroke-width="3" letter-spacing="6">안전 약속</text></svg>
      <div class="box" data-grow style="height:300px"><span class="bl">안전한 겨울방학을 보내는 내 모습</span></div>
      ${[1, 2, 3].map(n => `<div style="display:grid;grid-template-columns:120px 1fr;gap:14px;align-items:stretch"><div class="box" data-grow style="height:96px;display:grid;place-items:center"><b style="font-size:26px;color:var(--c)">약속 ${n}</b></div><div class="lines" style="display:flex;flex-direction:column;justify-content:center"><div class="ln"></div><div class="ln"></div></div></div>`).join('')}
      <div style="display:flex;justify-content:flex-end;align-items:center;gap:20px;font-size:19px">나 __________ (서명) <span style="width:90px;height:90px;border:2px dashed #9AA6B8;border-radius:50%;display:grid;place-items:center;font-size:13px;color:#8A95A8">손도장</span></div>`);
    return p;
  }
  function safetyKey(a) {
    const p = pageFrame(a, '예시 정답지 (선생님용)', '1~3번은 정답이 있고, 4~5번과 포스터는 예시예요. 아이들의 생각을 넓게 인정해 주세요.', { noName: true });
    const rows = [
      ['1번', '② 장갑을 끼고 손을 빼고 걸어요\n④ 작은 걸음으로 천천히 걸어요', '주머니에 손을 넣으면 넘어질 때 손으로 짚지 못해 크게 다쳐요.'],
      ['2번', '① O   ② X   ③ O', '핫팩은 뜨겁지 않게 느껴져도 오래 닿으면 저온 화상을 입어요. 옷 위에 붙이고, 잘 때는 떼요.'],
      ['3번', '(가) 3   (나) 1   (다) 2', '따뜻한 곳으로 → 젖은 장갑·양말 벗기 → 따뜻한 물(아주 뜨겁지 않게)로 천천히. 세게 문지르지 않아요.'],
      ['4번 (예시)', '문을 열지 않고, 대답하지 않고 부모님께 전화해요.', '말풍선 예: "엄마, 누가 초인종을 눌렀어요." 영상 속 강이처럼 궁금해도 문을 살짝 열지 않아요.'],
      ['5번', '경찰 112, 소방·구급 119', '가족 전화번호는 집에서 함께 확인해 오도록 안내해요. 장난 전화는 하지 않아요.'],
      ['포스터 (예시)', '빙판길은 천천히 걷기 / 핫팩은 옷 위에 / 혼자 있을 때 문 열지 않기', '그 밖에: 불장난하지 않기, 얼음 언 강에 들어가지 않기, 내 정보 알려 주지 않기, 게임 시간 지키기']
    ];
    p.insertAdjacentHTML('beforeend', `<table class="pt">${rows.map(([k, v, e]) => `<tr data-grow style="height:110px"><td class="lab" style="width:18%">${k}</td><td><div style="font-size:19px;font-weight:700;color:#C9305A;white-space:pre-line">${esc(v)}</div><div style="font-size:15px;color:#56627A;margin-top:6px">${esc(e)}</div></td></tr>`).join('')}</table>
      <div style="font-size:14px;color:#56627A;line-height:1.6">영상 ① ${esc(SAFE_VIDEO.src)} "${esc(SAFE_VIDEO.name)}" youtu.be/${SAFE_VIDEO.id} (0:31~5:22, 동상 5:23~7:45)<br>영상 ② ${esc(HOME_VIDEO.src)} "${esc(HOME_VIDEO.name)}" youtu.be/${HOME_VIDEO.id}</div>`);
    return p;
  }
})();
