/* 작품 모음: 인쇄 QR → 스캔 일괄 올리기 → 활동별·아이별 자동 정리 */
(function () {
  /* ───── 저장 (이 컴퓨터 브라우저, IndexedDB) ───── */
  let dbp;
  const db = () => dbp || (dbp = new Promise((ok, no) => {
    const r = indexedDB.open('hakgimal-works', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('works', { keyPath: 'id' });
    r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error);
  }));
  const tx = async (mode, fn) => { const d = await db(); return new Promise((ok, no) => { const t = d.transaction('works', mode); const s = t.objectStore('works'); const out = fn(s); t.oncomplete = () => ok(out && out.result !== undefined ? out.result : out); t.onerror = () => no(t.error); }); };
  const W = {
    all: () => tx('readonly', s => s.getAll()),
    put: w => tx('readwrite', s => s.put(w)),
    del: id => tx('readwrite', s => s.delete(id)),
    clear: () => tx('readwrite', s => s.clear())
  };
  window.Works = W;

  /* ───── 인쇄할 때 QR 넣기 ───── */
  const PREFIX = 'HGM1';
  function qrSVG(text) {
    const q = qrcode(0, 'M'); q.addData(text); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }
  window.stampQR = function (page, act, pg, stu) {
    $$('.qr, .qrname', page).forEach(n => n.remove());
    const box = el(`<div class="qr" title="스캔 자동 정리용">${qrSVG([PREFIX, act, pg, stu || 0].join('|'))}</div>`);
    page.appendChild(box);
  };

  /* 아이별 이름 넣기 */
  function personalize(page, idx, name) {
    const m = Store.get(), meta = $('.pmeta', page);
    if (meta) meta.innerHTML = `<div class="pname"><b style="font-size:17px">${m.grade ? esc(m.grade) + '학년 ' : ''}${m.cls ? esc(m.cls) + '반 ' : ''}${idx}번 ${esc(name)}</b></div>`;
  }

  /* printPages 감싸기: QR 붙이고, 명단이 있으면 아이별 인쇄를 고를 수 있어요 */
  const basePrint = window.printPages;
  window.printPages = function (pages) {
    pages = pages.map(p => p.cloneNode ? p.cloneNode(true) : el(p));
    const count = {};
    pages.forEach(p => { const a = p.dataset.act; if (a) { count[a] = (count[a] || 0) + 1; p.dataset.pg = count[a]; } });
    const roster = Store.roster();
    const named = pages.filter(p => $('.pmeta', p));
    const go = perKid => {
      let out = [];
      if (perKid) {
        roster.forEach((name, i) => pages.forEach(p => { if (!$('.pmeta', p)) return; const c = p.cloneNode(true); personalize(c, i + 1, name); if (c.dataset.act) stampQR(c, c.dataset.act, c.dataset.pg, i + 1); out.push(c); }));
        pages.filter(p => !$(".pmeta", p)).forEach(p => { if (p.dataset.act) stampQR(p, p.dataset.act, p.dataset.pg, 0); out.push(p); });
      } else {
        out = pages; out.forEach(p => { if (p.dataset.act) stampQR(p, p.dataset.act, p.dataset.pg, 0); });
      }
      basePrint(out);
    };
    if (!roster.length || !named.length) return go(false);
    const md = $('#modal');
    md.innerHTML = `<div class="mbox"><h2>어떻게 인쇄할까요?</h2>
      <p class="hint">활동지 구석의 작은 QR 코드 덕분에, 다 한 작품을 한꺼번에 스캔해서 "작품 모음"에 올리면 활동별로 저절로 정리돼요.</p>
      <button class="btn dark big" data-k style="justify-content:center">우리 반 ${roster.length}명 이름 넣어 인쇄 (아이별로도 자동 정리)</button>
      <button class="btn big" data-n style="justify-content:center">이름 칸 비워서 인쇄</button>
      <div class="end"><button class="btn flat" data-x>취소</button></div></div>`;
    md.hidden = false;
    const close = () => { md.hidden = true; md.innerHTML = ''; };
    $('[data-k]', md).onclick = () => { close(); go(true); };
    $('[data-n]', md).onclick = () => { close(); go(false); };
    $('[data-x]', md).onclick = close;
  };

  /* ───── 스캔 읽기 ───── */
  let pdfReady = false;
  function pdfLib() { if (!pdfReady && window.pdfjsLib) { pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js'; pdfReady = true; } return window.pdfjsLib; }
  async function* pagesOf(file) {
    if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
      const pdf = await pdfLib().getDocument({ data: await file.arrayBuffer() }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const pg = await pdf.getPage(i); const v1 = pg.getViewport({ scale: 1 });
        const vp = pg.getViewport({ scale: Math.min(3, 1800 / v1.width) });
        const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
        await pg.render({ canvasContext: c.getContext('2d'), viewport: vp, intent: 'print' }).promise;
        yield { canvas: c, src: `${file.name} ${i}쪽`, n: pdf.numPages };
      }
    } else {
      const bmp = await createImageBitmap(file);
      const s = Math.min(1, 2200 / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      yield { canvas: c, src: file.name, n: 1 };
    }
  }
  function tryRegion(c, x, y, w, h, scale) {
    x = Math.max(0, Math.round(x)); y = Math.max(0, Math.round(y)); w = Math.round(Math.min(w, c.width - x)); h = Math.round(Math.min(h, c.height - y));
    if (w < 20 || h < 20) return null;
    const t = document.createElement('canvas'); t.width = Math.round(w * scale); t.height = Math.round(h * scale);
    const g = t.getContext('2d'); g.imageSmoothingEnabled = true; g.drawImage(c, x, y, w, h, 0, 0, t.width, t.height);
    const d = g.getImageData(0, 0, t.width, t.height);
    const r = jsQR(d.data, t.width, t.height, { inversionAttempts: 'attemptBoth' });
    return r && r.data.startsWith(PREFIX + '|') ? r.data : null;
  }
  function readQR(c) {
    const W = c.width, H = c.height;
    const tries = [
      [W * .72, H * .86, W * .28, H * .14, 1.6, 0], [W * .72, H * .86, W * .28, H * .14, 1, 0],
      [0, 0, W * .28, H * .14, 1.6, 180], [0, 0, W * .28, H * .14, 1, 180],
      [W * .6, H * .75, W * .4, H * .25, 1, 0], [0, 0, W * .4, H * .25, 1, 180]
    ];
    for (const [x, y, w, h, s, rot] of tries) { const d = tryRegion(c, x, y, w, h, s); if (d) return { data: d, rot }; }
    const s = Math.min(1, 1400 / Math.max(W, H)); const d = tryRegion(c, 0, 0, W, H, s);
    return d ? { data: d, rot: 0 } : null;
  }
  const rotate180 = c => { const t = document.createElement('canvas'); t.width = c.width; t.height = c.height; const g = t.getContext('2d'); g.translate(c.width, c.height); g.rotate(Math.PI); g.drawImage(c, 0, 0); return t; };
  function shrink(c, max) { const s = Math.min(1, max / Math.max(c.width, c.height)); if (s === 1) return c; const t = document.createElement('canvas'); t.width = Math.round(c.width * s); t.height = Math.round(c.height * s); t.getContext('2d').drawImage(c, 0, 0, t.width, t.height); return t; }
  const toBlob = (c, q) => new Promise(ok => c.toBlob(ok, 'image/jpeg', q));

  async function importFiles(files, onStep) {
    let done = 0, sorted = 0, total = 0;
    for (const f of files) {
      for await (const pg of pagesOf(f)) {
        total = Math.max(total, done + 1);
        let c = pg.canvas; const q = readQR(c);
        let act = 0, pno = 0, stu = 0;
        if (q) { const [, a, p, s] = q.data.split('|'); act = +a || 0; pno = +p || 0; stu = +s || 0; if (q.rot === 180) c = rotate180(c); sorted++; }
        const big = shrink(c, 1700), th = shrink(c, 360);
        const w = { id: Date.now() + '-' + Math.random().toString(36).slice(2, 7), act, pg: pno, stu, src: pg.src, added: Date.now(), blob: await toBlob(big, .84), thumb: th.toDataURL('image/jpeg', .7) };
        await W.put(w);
        done++; onStep && onStep(done, pg, !!q, sorted);
      }
    }
    return { done, sorted };
  }
  window.importScans = importFiles;

  /* ───── 작품 모음 화면 ───── */
  const actName = n => { const a = actBy(n); return a ? `${a.n}. ${a.name}` : '분류가 필요한 작품'; };
  const kidName = s => { const r = Store.roster(); return s ? `${s}번${r[s - 1] ? ' ' + r[s - 1] : ''}` : '이름 미정'; };
  let view = { by: 'act' };
  window.renderGallery = async function (app, topbar, focusAct) {
    clearTimers();
    app.innerHTML = ''; app.appendChild(topbar());
    const b = el(`<div class="binder" style="grid-template-columns:1fr;padding-left:22px"><section class="sheetpanel first" style="--t:#E9F3E1;--c:#4C7A1E;border-radius:18px"></section></div>`);
    app.appendChild(b);
    const p = $('.sheetpanel', b);
    let works = []; try { works = await W.all(); } catch (e) { p.innerHTML = '<div class="empty">이 브라우저에서는 작품을 저장할 수 없어요. 크롬이나 엣지에서 열어 주세요.</div>'; return; }
    works.sort((x, y) => (x.act - y.act) || (x.stu - y.stu) || (x.pg - y.pg) || (x.added - y.added));
    const need = works.filter(w => !w.act);
    p.innerHTML = `<div class="cathead"><img src="img/cat7.png" alt="" style="height:96px;margin:-8px 0 -6px"><div><h1>작품 모음</h1><p>${works.length ? `작품 ${works.length}장이 있어요. 활동별·아이별로 저절로 정리돼요.` : '아이들 활동지를 한꺼번에 스캔해서 올리면 활동별로 저절로 정리돼요.'}</p></div></div>
      <div class="drop" tabindex="0"><b>스캔 파일 올리기</b><span>학교 복합기로 스캔한 PDF나 사진을 여러 개 한꺼번에 골라요. 여기로 끌어다 놓아도 돼요.</span><input type="file" accept="application/pdf,image/*" multiple hidden></div>
      <div class="prog" hidden><div class="pbar"><b></b></div><span></span></div>
      <div class="packbar gbar"></div><div class="gbody"></div>
      <p class="foot">작품 사진은 이 컴퓨터의 브라우저에만 저장돼요. 다른 컴퓨터로 옮기거나 나눌 때는 ZIP으로 내려받아요. 활동지 오른쪽 아래 QR 코드가 보이게 스캔해 주세요.</p>`;
    const drop = $('.drop', p), inp = $('input', drop), prog = $('.prog', p);
    drop.onclick = () => inp.click();
    drop.onkeydown = e => { if (e.key === 'Enter') inp.click(); };
    drop.ondragover = e => { e.preventDefault(); drop.classList.add('on'); };
    drop.ondragleave = () => drop.classList.remove('on');
    drop.ondrop = e => { e.preventDefault(); drop.classList.remove('on'); run(Array.from(e.dataTransfer.files)); };
    inp.onchange = () => run(Array.from(inp.files));
    async function run(files) {
      files = files.filter(f => /pdf|image/.test(f.type) || /\.(pdf|jpe?g|png)$/i.test(f.name));
      if (!files.length) return toast('PDF나 사진 파일을 골라 주세요');
      prog.hidden = false; drop.classList.add('busy');
      const r = await importFiles(files, (d, pg, ok, sorted) => { $('span', prog).textContent = `${d}쪽 정리했어요 (자동 분류 ${sorted}쪽)`; $('.pbar b', prog).style.width = Math.min(100, d / Math.max(d, pg.n) * 100) + '%'; });
      toast(`${r.done}쪽을 올렸어요. ${r.sorted}쪽은 저절로 정리됐어요.`); beep('fan');
      renderGallery(app, topbar, focusAct);
    }
    if (!works.length) return;
    const bar = $('.gbar', p);
    const tabs = [['act', '활동별'], ['kid', '아이별'], ['need', `분류 필요 ${need.length}`]];
    const sg = el('<div class="seg"></div>');
    tabs.forEach(([k, t]) => { const x = el(`<button class="${view.by === k ? 'on' : ''}">${t}</button>`); x.onclick = () => { view.by = k; renderGallery(app, topbar, focusAct); }; sg.appendChild(x); });
    bar.append(sg);
    const zb = el('<button class="btn">ZIP으로 모두 내려받기</button>'); zb.onclick = () => zipAll(works); bar.append(zb);
    const cb = el('<button class="btn flat">모두 지우기</button>'); cb.onclick = async () => { if (confirm(`작품 ${works.length}장을 이 컴퓨터에서 모두 지울까요? 되돌릴 수 없어요.`)) { await W.clear(); renderGallery(app, topbar, focusAct); } }; bar.append(cb);
    const body = $('.gbody', p);
    let groups;
    if (view.by === 'need') groups = [['분류가 필요한 작품', need]];
    else if (view.by === 'kid') { const m = new Map(); works.forEach(w => { const k = w.stu || 0; if (!m.has(k)) m.set(k, []); m.get(k).push(w); }); groups = [...m.entries()].sort((a, b) => (a[0] || 999) - (b[0] || 999)).map(([k, l]) => [kidName(k), l]); }
    else { const m = new Map(); works.forEach(w => { if (!m.has(w.act)) m.set(w.act, []); m.get(w.act).push(w); }); groups = [...m.entries()].sort((a, b) => (a[0] || 999) - (b[0] || 999)).map(([k, l]) => [actName(k), l, k]); }
    if (focusAct) groups.sort((a, b) => (b[2] === focusAct) - (a[2] === focusAct));
    if (!groups.length || !groups[0][1].length) body.innerHTML = '<div class="empty">분류가 필요한 작품이 없어요. 모두 저절로 정리됐어요.</div>';
    groups.forEach(([title, list]) => {
      if (!list.length) return;
      const g = el(`<div class="ggroup"><div class="ghead"><h3>${esc(title)}</h3><span>${list.length}장</span><button class="btn">크게 넘겨 보기</button></div><div class="gthumbs"></div></div>`);
      $('.ghead .btn', g).onclick = () => viewer(list, 0, () => renderGallery(app, topbar, focusAct));
      list.forEach((w, i) => { const t = el(`<button class="gth"><img src="${w.thumb}" alt=""><span>${esc(view.by === 'kid' ? actName(w.act).replace(/^\d+\. /, '') : kidName(w.stu))}${w.pg ? ' · ' + w.pg + '쪽' : ''}</span></button>`); t.onclick = () => viewer(list, i, () => renderGallery(app, topbar, focusAct)); $('.gthumbs', g).appendChild(t); });
      body.appendChild(g);
    });
  };

  /* 크게 보기 (전자칠판에서 넘겨 보기) */
  function viewer(list, i, onChange) {
    const ov = el(`<div class="gview"><div class="gimg"><img alt=""></div><div class="gside"><b class="gtitle"></b><span class="gsub"></span><div class="gassign"></div><div class="gnav"><button class="btn big" data-p>${ICON.back} 이전</button><button class="btn big dark" data-n>다음 ${ICON.next}</button></div><button class="btn" data-r>돌려 보기</button><button class="btn flat" data-d>이 작품 지우기</button><button class="btn big" data-x>닫기</button></div></div>`);
    document.body.appendChild(ov);
    let url, rot = 0, changed = false;
    const show = () => {
      const w = list[i]; if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(w.blob); rot = 0;
      const img = $('.gimg img', ov); img.src = url; img.style.transform = '';
      $('.gtitle', ov).textContent = actName(w.act); $('.gsub', ov).textContent = `${kidName(w.stu)}${w.pg ? ' · ' + w.pg + '쪽' : ''} · ${i + 1} / ${list.length}`;
      const as = $('.gassign', ov); as.innerHTML = '';
      if (!w.act || !w.stu) {
        as.innerHTML = '<p class="hint">이 작품이 무엇인지 눌러서 정해 주세요.</p>';
        if (!w.act) { const s = el(`<select class="field"><option value="">어떤 활동인가요?</option>${ACTS.map(a => `<option value="${a.n}">${a.n}. ${esc(a.name)}</option>`).join('')}</select>`); s.onchange = async () => { w.act = +s.value; await W.put(w); changed = true; show(); }; as.appendChild(s); }
        const r = Store.roster();
        if (!w.stu && r.length) { const kb = el('<div class="gkids"></div>'); r.forEach((n, k) => { const b = el(`<button>${k + 1} ${esc(n)}</button>`); b.onclick = async () => { w.stu = k + 1; await W.put(w); changed = true; show(); }; kb.appendChild(b); }); as.appendChild(kb); }
      }
    };
    const close = () => { if (url) URL.revokeObjectURL(url); ov.remove(); document.removeEventListener('keydown', key); if (changed) onChange(); };
    const key = e => { if (e.key === 'ArrowRight') { i = Math.min(list.length - 1, i + 1); show(); } if (e.key === 'ArrowLeft') { i = Math.max(0, i - 1); show(); } if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', key);
    $('[data-p]', ov).onclick = () => { i = Math.max(0, i - 1); show(); };
    $('[data-n]', ov).onclick = () => { i = Math.min(list.length - 1, i + 1); show(); };
    $('[data-x]', ov).onclick = close;
    $('[data-r]', ov).onclick = () => { rot = (rot + 90) % 360; $('.gimg img', ov).style.transform = `rotate(${rot}deg)`; };
    $('[data-d]', ov).onclick = async () => { if (!confirm('이 작품을 지울까요?')) return; await W.del(list[i].id); list.splice(i, 1); changed = true; if (!list.length) return close(); i = Math.min(i, list.length - 1); show(); };
    let sx = null; const gi = $('.gimg', ov);
    gi.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    gi.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) { i = Math.max(0, Math.min(list.length - 1, i + (dx < 0 ? 1 : -1))); show(); } sx = null; });
    show();
  }

  async function zipAll(works) {
    if (!window.JSZip) return toast('ZIP 도구를 불러오지 못했어요');
    toast('ZIP 파일을 만들고 있어요');
    const z = new JSZip(), r = Store.roster(), used = {};
    works.forEach(w => {
      const folder = w.act ? actName(w.act).replace(/[\\/:*?"<>|]/g, '') : '분류 필요';
      let name = `${w.stu ? String(w.stu).padStart(2, '0') + '번' + (r[w.stu - 1] ? ' ' + r[w.stu - 1] : '') : '이름 미정'}${w.pg ? ' ' + w.pg + '쪽' : ''}`.replace(/[\\/:*?"<>|]/g, '');
      const key = folder + '/' + name; used[key] = (used[key] || 0) + 1; if (used[key] > 1) name += ` (${used[key]})`;
      z.folder(folder).file(name + '.jpg', w.blob);
    });
    const blob = await z.generateAsync({ type: 'blob' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `우리반-작품모음-${new Date().toISOString().slice(0, 10)}.zip`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  window.workCount = async act => { try { return (await W.all()).filter(w => w.act === act).length; } catch (e) { return 0; } };
})();
