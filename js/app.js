/* 화면 이동과 목록 */
(function () {
  const app = $('#app');
  let view = { tab: 'all', q: '' };
  try { const t = localStorage.getItem('hgm-tab'); if (t) view.tab = t; } catch (e) {}

  function topbar() {
    const n = Store.get().pack.length;
    const t = el(`<header class="top"><a class="brand" href="#/"><b>학기말 꾸러미</b><span>2026학년도 마무리와 2027년 새 출발, 활동 80가지</span></a>
      <label class="search">${ICON.search}<input type="search" placeholder="활동 이름으로 찾기" aria-label="활동 찾기" value="${esc(view.q)}"></label>
      <button class="btn flat" data-set>${ICON.people} 우리 반 정보</button>
      <a class="btn dark packbtn" href="#/pack">내 꾸러미 <span class="count">${n}</span></a></header>`);
    const inp = $('input', t);
    inp.oninput = () => { view.q = inp.value.trim(); renderList(); };
    $('[data-set]', t).onclick = openSettings;
    return t;
  }

  function row(a) {
    const c = catOf(a), on = Store.inPack(a.n);
    const r = el(`<div class="row" style="${catVars(c)}" role="button" tabindex="0"><span class="num">${a.n}</span><div class="txt"><div class="nm">${esc(a.name)}${a.star ? ICON.star : ''}</div><div class="ds">${esc(a.d)}</div></div><span class="kd">${TOOL_KIND[a.tool]}</span><button class="pick ${on ? 'on' : ''}" aria-label="${on ? '꾸러미에서 빼기' : '꾸러미에 담기'}" title="${on ? '꾸러미에서 빼기' : '꾸러미에 담기'}">${ICON.check}</button></div>`);
    r.onclick = () => location.hash = '#/a/' + a.n;
    r.onkeydown = e => { if (e.key === 'Enter') location.hash = '#/a/' + a.n; };
    const p = $('.pick', r);
    p.onclick = e => { e.stopPropagation(); const now = Store.toggle(a.n); p.classList.toggle('on', now); p.setAttribute('aria-label', now ? '꾸러미에서 빼기' : '꾸러미에 담기'); $('.packbtn .count').textContent = Store.get().pack.length; beep(now ? 'ok' : 'pop'); };
    return r;
  }

  function renderHome() {
    clearTimers();
    app.innerHTML = '';
    app.appendChild(topbar());
    const b = el('<div class="binder"><nav class="tabs" aria-label="활동 분류"></nav><section class="sheetpanel"></section></div>');
    app.appendChild(b);
    const nav = $('.tabs', b);
    const tabs = [['all', '80가지 전체', ACTS.length, '#1F2B45', '#FBFCFE'], ['star', '추천 모음', ACTS.filter(a => a.star).length, '#A06A00', '#FFF6DA']]
      .concat(CATS.map(c => [String(c.id), c.name, ACTS.filter(a => a.c === c.id).length, c.ink, c.tint]));
    tabs.forEach(([id, name, cnt, ink, tint], k) => {
      const t = el(`<button class="tab ${k === 2 ? 'sep' : ''} ${view.tab === id ? 'on' : ''}" style="--c:${ink};--t:${tint}"><span>${esc(name)}</span><span class="cnt">${cnt}</span></button>`);
      t.onclick = () => { view.tab = id; try { localStorage.setItem('hgm-tab', id); } catch (e) {} renderHome(); };
      nav.appendChild(t);
    });
    nav.insertAdjacentHTML('beforeend', `<img src="img/kids.png" alt="" style="margin-top:auto;width:100%;padding:0 4px 0 14px;opacity:.95">`);
    renderList();
  }

  function renderList() {
    const panel = $('.sheetpanel'); if (!panel) return;
    const q = view.q;
    const tab = view.tab;
    const cat = CATS.find(c => String(c.id) === tab);
    panel.style.cssText = cat ? catVars(cat) : tab === 'star' ? '--t:#FFF6DA;--c:#A06A00' : '--t:#FBFCFE;--c:#1F2B45';
    panel.classList.toggle('first', tab === 'all');
    panel.innerHTML = '';
    let list = ACTS.filter(a => (cat ? a.c === cat.id : tab === 'star' ? a.star : true));
    if (q) list = ACTS.filter(a => (a.name + a.d).includes(q));
    const head = cat ? `<img src="img/cat${cat.id}.png" alt="" style="height:104px;margin:-10px 0 -6px"><div><h1>${esc(cat.name)}</h1><p>${esc(cat.desc)}</p></div>`
      : tab === 'star' ? `<div><h1>선생님들이 많이 찾는 활동</h1><p>학기말에 가장 먼저 쓰기 좋은 ${list.length}가지예요.</p></div>`
        : `<div><h1>무엇을 할까요?</h1><p>활동을 누르면 바로 시작해요. 동그라미를 누르면 내 꾸러미에 담겨요.</p></div>`;
    const h = el(`<div class="cathead">${q ? `<div><h1>"${esc(q)}" 찾기</h1><p>${list.length}가지를 찾았어요.</p></div>` : head}</div>`);
    if (!q && (cat || tab === 'star')) { const all = el('<button class="btn">이 칸 모두 담기</button>'); all.onclick = () => { list.forEach(a => { if (!Store.inPack(a.n)) Store.toggle(a.n); }); renderHome(); toast(`${list.length}가지를 꾸러미에 담았어요`); }; h.appendChild(all); }
    panel.appendChild(h);
    if (!list.length) { panel.appendChild(el('<div class="empty">찾는 활동이 없어요. 다른 낱말로 찾아보세요.</div>')); return; }
    if (tab === 'all' && !q) {
      const g = el('<div class="allgrid"></div>');
      CATS.forEach(c => {
        const grp = el(`<div class="grp" style="${catVars(c)}"><h3><img src="img/cat${c.id}.png" alt="" style="height:30px">${esc(c.name)}</h3></div>`);
        ACTS.filter(a => a.c === c.id).forEach(a => grp.appendChild(row(a)));
        g.appendChild(grp);
      });
      panel.appendChild(g);
    } else {
      const rs = el('<div class="rows"></div>'); list.forEach(a => rs.appendChild(row(a))); panel.appendChild(rs);
    }
    panel.appendChild(el(`<div class="foot">담은 활동은 "내 꾸러미"에서 차례대로 열거나 활동지를 한꺼번에 인쇄할 수 있어요. 적은 내용은 이 컴퓨터의 브라우저에만 저장돼요.</div>`));
  }

  function renderPack() {
    clearTimers();
    app.innerHTML = ''; app.appendChild(topbar());
    const pk = Store.get().pack;
    const b = el(`<div class="binder" style="grid-template-columns:1fr;padding-left:22px"><section class="sheetpanel first" style="--t:#FFF6DA;--c:#A06A00;border-radius:18px"></section></div>`);
    app.appendChild(b);
    const p = $('.sheetpanel', b);
    p.appendChild(el(`<div class="cathead"><img src="img/cat3.png" alt="" style="height:96px;margin:-8px 0 -6px"><div><h1>내 꾸러미</h1><p>${pk.length ? `고른 활동 ${pk.length}가지예요. 순서를 바꾸고 차례대로 진행해요.` : '아직 담은 활동이 없어요. 목록에서 동그라미를 눌러 담아 보세요.'}</p></div></div>`));
    if (!pk.length) { const g = el('<a class="btn dark big" href="#/">활동 고르러 가기</a>'); p.appendChild(g); return; }
    const bar = el('<div class="packbar"></div>');
    bar.append(btn('차례대로 시작', 'dark big', () => location.hash = `#/a/${pk[0]}?pack`));
    const lp = a => window.LESSONS && LESSONS[a.n] && LESSONS[a.n].pages;
    const printable = pk.map(actBy).filter(a => lp(a) || (TOOLS[a.tool] && TOOLS[a.tool].pages && (a.tool !== 'guide' || a.sheet)));
    bar.append(btn(`활동지 ${printable.length}가지 한꺼번에 인쇄`, 'big', () => { if (!printable.length) return toast('인쇄할 활동지가 없어요'); printPages(printable.flatMap(a => lp(a) ? LESSONS[a.n].pages(a) : TOOLS[a.tool].pages(a))); }));
    bar.append(btn('모두 비우기', 'flat', () => { if (confirm('꾸러미를 모두 비울까요?')) { pk.splice(0); Store.save(); renderPack(); } }));
    p.appendChild(bar);
    const L = el('<div class="packlist"></div>');
    pk.forEach((n, i) => {
      const a = actBy(n), c = catOf(a);
      const r = el(`<div class="packrow" style="${catVars(c)}"><span class="ord">${i + 1}</span><span class="cat">${esc(c.name)}</span><span class="nm">${a.n}. ${esc(a.name)}</span><span class="kd hint">${TOOL_KIND[a.tool]}</span><button class="iconbtn" aria-label="위로">${ICON.up}</button><button class="iconbtn" aria-label="아래로">${ICON.down}</button><button class="iconbtn" aria-label="빼기">${ICON.x}</button></div>`);
      const [u, d, x] = $$('button', r);
      $('.nm', r).onclick = () => location.hash = `#/a/${n}?pack`;
      u.onclick = () => { if (i) { [pk[i - 1], pk[i]] = [pk[i], pk[i - 1]]; Store.save(); renderPack(); } };
      d.onclick = () => { if (i < pk.length - 1) { [pk[i + 1], pk[i]] = [pk[i], pk[i + 1]]; Store.save(); renderPack(); } };
      x.onclick = () => { pk.splice(i, 1); Store.save(); renderPack(); };
      L.appendChild(r);
    });
    p.appendChild(L);
  }
  function btn(t, cls, fn) { const b = el(`<button class="btn ${cls}">${t}</button>`); b.onclick = fn; return b; }

  function renderAct(n, fromPack) {
    clearTimers();
    const a = actBy(n); if (!a) return renderHome();
    const c = catOf(a);
    const seq = fromPack ? Store.get().pack : ACTS.map(x => x.n);
    const idx = seq.indexOf(n), prev = seq[idx - 1], next = seq[idx + 1];
    const suf = fromPack ? '?pack' : '';
    app.innerHTML = '';
    app.style.cssText = catVars(c);
    const bar = el(`<header class="abar" style="${catVars(c)}"><a class="btn flat" href="${fromPack ? '#/pack' : '#/'}">${ICON.back} ${fromPack ? '꾸러미' : '목록'}</a><img src="img/cat${c.id}.png" alt="" style="height:50px"><span class="anum">${a.n}</span><div><h1>${esc(a.name)}${a.star ? ICON.star : ''}</h1><div class="acat">${esc(c.name)} · ${esc(a.d)}</div></div><span class="sp"></span>
      <button class="btn pickwide ${Store.inPack(n) ? 'on' : ''}" data-pk>${ICON.check}<span>${Store.inPack(n) ? '꾸러미에 있어요' : '꾸러미에 담기'}</span></button>
      <button class="btn dark" data-pr hidden>${ICON.print} 인쇄</button>
      <button class="iconbtn" data-fs aria-label="크게 보기" title="크게 보기">${ICON.full}</button>
      <a class="iconbtn" ${prev ? `href="#/a/${prev}${suf}"` : 'aria-disabled="true" style="opacity:.3"'} aria-label="이전 활동">${ICON.back}</a><a class="iconbtn" ${next ? `href="#/a/${next}${suf}"` : 'aria-disabled="true" style="opacity:.3"'} aria-label="다음 활동">${ICON.next}</a></header>`);
    const v = el(`<div class="aview"><aside class="aside" style="${catVars(c)}"><div><h2>이렇게 해요</h2><ol class="steps">${a.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div><div class="opts"></div></aside><section class="stage" style="${catVars(c)}"></section></div>`);
    app.append(bar, v);
    const pk = $('[data-pk]', bar);
    pk.onclick = () => { const on = Store.toggle(n); pk.classList.toggle('on', on); $('span', pk).textContent = on ? '꾸러미에 있어요' : '꾸러미에 담기'; beep(on ? 'ok' : 'pop'); };
    const stage = $('.stage', v);
    $('[data-fs]', bar).onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else (stage.requestFullscreen ? stage.requestFullscreen() : stage.classList.toggle('full')); };
    const pr = $('[data-pr]', bar);
    const ctx = {
      stage, opts: $('.opts', v),
      print(fn) { pr.hidden = false; pr.onclick = fn; },
      reload() { renderAct(n, fromPack); }
    };
    const L = window.LESSONS && LESSONS[n];
    let mode = L ? (Store.d('mode:' + n, 'lesson')) : 'tool';
    const runTool = () => {
      try { TOOLS[a.tool](a, ctx); } catch (e) { console.error(e); stage.innerHTML = `<div class="center"><div class="qbig">화면을 여는 중 문제가 생겼어요.</div><p class="expl">${esc(e.message)}</p></div>`; }
    };
    const runL = () => {
      runLesson(a, stage, ctx);
      if (L.pages) {
        ctx.print(() => printPages(L.pages(a)));
        const b1 = el('<button class="btn dark">활동지 인쇄 (아이들용)</button>'); b1.onclick = () => printPages(L.pages(a));
        const b2 = el('<button class="btn">예시 정답지 인쇄 (선생님용)</button>'); b2.onclick = () => printPages(L.key(a));
        const b3 = el('<button class="btn flat">활동지 미리 보기</button>'); b3.onclick = () => { stage.innerHTML = ''; const sb = el('<div class="stagebody"></div>'); stage.appendChild(sb); showPaper(sb, [...L.pages(a), ...L.key(a)]); };
        ctx.opts.append(b1, b2, b3);
      }
      if (L.ppt) { const d = el(`<a class="btn" href="${L.ppt}" download>PPT 파일 받기 (Canva)</a>`); ctx.opts.append(d); }
      ctx.opts.append(el('<p class="hint">전자칠판에서 화면 오른쪽을 누르거나 밀면 다음 장, 왼쪽을 누르면 이전 장으로 가요. 크게 보기 단추로 전체 화면을 써요.</p>'));
    };
    if (L) {
      const ms = el(`<div class="modeseg"><button data-m="lesson">수업 슬라이드<small>${esc(L.plan)}</small></button><button data-m="tool">${esc(TOOL_KIND[a.tool])}<small>${a.tool === 'roles' ? '청소 구역 뽑기와 완료 체크' : '활동 도구'}</small></button></div>`);
      $('.aside', v).insertBefore(ms, $('.opts', v));
      const set = m => { mode = m; Store.set('mode:' + n, m); $$('button', ms).forEach(b => b.classList.toggle('on', b.dataset.m === m)); clearTimers(); stage.innerHTML = ''; ctx.opts.innerHTML = ''; pr.hidden = true; m === 'lesson' ? runL() : runTool(); };
      $$('button', ms).forEach(b => b.onclick = () => set(b.dataset.m));
      set(mode);
    } else runTool();
  }

  /* 우리 반 정보 */
  window.openSettings = function () {
    const m = Store.get(), md = $('#modal');
    md.innerHTML = `<div class="mbox" role="dialog" aria-modal="true" aria-labelledby="sett"><h2 id="sett">우리 반 정보</h2>
      <div class="rowf"><label>학년<input class="field" data-k="grade" value="${esc(m.grade)}"></label><label>반<input class="field" data-k="cls" value="${esc(m.cls)}"></label><label>선생님 이름<input class="field" data-k="teacher" value="${esc(m.teacher)}"></label></div>
      <label>학교 이름<input class="field" data-k="school" value="${esc(m.school)}" placeholder="○○초등학교"></label>
      <label>우리 반 명단 (한 줄에 한 명, 번호 순서대로)<textarea class="field" rows="10" data-k="roster" placeholder="김하늘&#10;이도윤&#10;박서연">${esc(m.roster.join('\n'))}</textarea></label>
      <p class="hint">명단은 상장, 롤링페이퍼, 비밀 응원 천사, 대청소 역할, 시상식에 쓰여요. 이 컴퓨터의 브라우저에만 저장되고 다른 곳으로 보내지 않아요.</p>
      <div class="end"><button class="btn" data-x>닫기</button><button class="btn dark" data-s>저장</button></div></div>`;
    md.hidden = false;
    const close = () => { md.hidden = true; md.innerHTML = ''; };
    $('[data-x]', md).onclick = close;
    md.onclick = e => { if (e.target === md) close(); };
    $('[data-s]', md).onclick = () => {
      $$('[data-k]', md).forEach(f => { if (f.dataset.k === 'roster') m.roster = f.value.split(/\n|,/).map(s => s.trim()).filter(Boolean); else m[f.dataset.k] = f.value.trim(); });
      Store.save(); close(); toast('저장했어요'); route();
    };
    setTimeout(() => $('textarea', md).focus(), 30);
  };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) { $('#modal').hidden = true; } });

  function route() {
    app.style.cssText = '';
    const h = location.hash;
    const m = h.match(/^#\/a\/(\d+)/);
    if (m) return renderAct(+m[1], /[?&]pack/.test(h));
    if (h.startsWith('#/pack')) return renderPack();
    renderHome();
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('resize', () => window.__fit && window.__fit());
  document.addEventListener('visibilitychange', () => { /* 탭 전환 뒤에도 화면 유지 */ });
  route();
})();
