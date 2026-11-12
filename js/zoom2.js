/* 그림 퀴즈: 그림 11장 + 실사 사진 16장, 확대·그림자·모자이크 */
(function () {
  const T = window.TOOLS, R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const PICS = [['snowman', '눈사람'], ['penguin', '펭귄'], ['bungeo', '붕어빵'], ['sled', '썰매'], ['mittens', '장갑'], ['gyul', '귤'], ['xmastree', '크리스마스트리'], ['skate', '스케이트'], ['polarbear', '북극곰'], ['sheep', '양'], ['mailbox', '우체통']].map(([f, n]) => ({ src: `img/quiz/${f}.jpg`, name: n, kind: 'pic' }));
  const PHOTOS = [['gyul', '귤'], ['bungeo', '붕어빵'], ['goguma', '군고구마'], ['mittens', '털장갑'], ['scarf', '목도리'], ['snowman', '눈사람'], ['icicle', '고드름'], ['sled', '썰매'], ['skate', '스케이트'], ['penguin', '펭귄'], ['polarbear', '북극곰'], ['xmastree', '크리스마스트리'], ['tteokguk', '떡국'], ['yut', '윷'], ['kite', '연'], ['snowflake', '눈 결정']].map(([f, n]) => ({ src: `img/photo/${f}.jpg`, name: n, kind: 'photo' }));
  T.zoom = function (a, ctx) {
    const st = ctx.stage, STEPS = 5;
    let set = Store.d('zoom:set', 'mix'), mode = 'mix', items, i = 0, step = 0;
    const pool = () => set === 'pic' ? PICS : set === 'photo' ? PHOTOS : PICS.concat(PHOTOS);
    const reset = () => { items = shuffle(pool()); i = 0; };
    reset();
    const body = el('<div class="stagebody"></div>'); st.appendChild(body);
    function pickMode(it) { if (mode !== 'mix') return it.kind === 'photo' && mode === 'shadow' ? 'zoom' : mode; const opts = it.kind === 'photo' ? ['zoom', 'mosaic'] : ['zoom', 'shadow', 'mosaic']; return opts[i % opts.length]; }
    function show() {
      const it = items[i], m = pickMode(it); step = 0;
      body.innerHTML = `<div class="center"><div class="qcount">${i + 1} / ${items.length} · ${{ zoom: '아주 크게 확대했어요', shadow: '그림자만 보여요', mosaic: '모자이크로 가렸어요' }[m]} · 지금 맞히면 <b data-pt style="color:var(--c)">${STEPS}점</b></div><div class="zoombox">${m === 'zoom' ? `<div class="zin"><img src="${it.src}" alt=""></div>` : '<canvas></canvas>'}</div><div class="ans hide">${esc(it.name)}</div><div class="ctrl"><button class="btn big dark" data-m>조금 더 보기</button><button class="btn big" data-r>정답 보기</button><button class="btn big" data-n>다음 ${ICON.next}</button></div></div>`;
      const ox = R(30, 70), oy = R(30, 70), zin = $('.zin', body), cv = $('canvas', body), img = new Image();
      let mask = null;
      const render = () => {
        const k = 1 - step / STEPS;
        if (zin) { zin.style.transformOrigin = `${ox}% ${oy}%`; zin.style.transform = `scale(${1 + k * (it.kind === 'photo' ? 6 : 7)})`; zin.firstChild.style.objectFit = it.kind === 'photo' ? 'cover' : 'contain'; }
        if (!cv || !img.naturalWidth) { $('[data-pt]', body).textContent = Math.max(1, STEPS - step) + '점'; return; }
        const w = cv.width = cv.clientWidth, h = cv.height = cv.clientHeight, g = cv.getContext('2d');
        const r0 = it.kind === 'photo' ? Math.max(w / img.width, h / img.height) : Math.min(w / img.width, h / img.height), dw = img.width * r0, dh = img.height * r0, dx = (w - dw) / 2, dy = (h - dh) / 2;
        g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
        if (m === 'mosaic') { const px = Math.max(1, Math.round(60 * k * k)); const t = document.createElement('canvas'); t.width = Math.max(1, Math.ceil(dw / px)); t.height = Math.max(1, Math.ceil(dh / px)); t.getContext('2d').drawImage(img, 0, 0, t.width, t.height); g.imageSmoothingEnabled = false; g.drawImage(t, dx, dy, dw, dh); }
        else {
          if (!mask) { /* 흰 바탕을 뺀 모양만 그림자로 */
            const t = document.createElement('canvas'); t.width = w; t.height = h; const tg = t.getContext('2d'); tg.fillStyle = '#fff'; tg.fillRect(0, 0, w, h); tg.drawImage(img, dx, dy, dw, dh);
            const d = tg.getImageData(0, 0, w, h), p = d.data;
            for (let j = 0; j < p.length; j += 4) { const mn = Math.min(p[j], p[j + 1], p[j + 2]), mx = Math.max(p[j], p[j + 1], p[j + 2]); const obj = mn < 228 || mx - mn > 26; p[j] = 43; p[j + 1] = 58; p[j + 2] = 92; p[j + 3] = obj ? 255 : 0; }
            tg.putImageData(d, 0, 0); mask = document.createElement('canvas'); mask.width = w; mask.height = h; const mg = mask.getContext('2d'); mg.filter = 'blur(1px)'; mg.drawImage(t, 0, 0);
          }
          const reveal = step >= STEPS ? 1 : Math.max(0, (step - 1) / (STEPS - 1));
          g.drawImage(img, dx, dy, dw, dh);
          g.globalAlpha = 1 - reveal; g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(mask, 0, 0); g.globalAlpha = 1;
        }
        $('[data-pt]', body).textContent = Math.max(1, STEPS - step) + '점';
      };
      img.onload = render; img.src = it.src; if (zin) render();
      $('[data-m]', body).onclick = () => { step = Math.min(STEPS, step + 1); render(); beep('pop'); };
      $('[data-r]', body).onclick = () => { step = STEPS; render(); $('.ans', body).classList.remove('hide'); beep('ok'); };
      $('[data-n]', body).onclick = () => { i++; if (i >= items.length) reset(); show(); };
    }
    const seg = (list, cur, on) => { const s = el('<div class="seg"></div>'); list.forEach(([v, t]) => { const b = el(`<button class="${v === cur ? 'on' : ''}">${t}</button>`); b.onclick = () => { $$('button', s).forEach(x => x.classList.remove('on')); b.classList.add('on'); on(v); }; s.appendChild(b); }); return s; };
    const lab = (t, n) => { const l = el(`<label class="f">${t}</label>`); l.appendChild(n); return l; };
    const fi = el('<input type="file" accept="image/*" multiple>');
    fi.onchange = () => { const fs = Array.from(fi.files); if (!fs.length) return; items = shuffle(fs.map(f => ({ src: URL.createObjectURL(f), name: f.name.replace(/\.[^.]+$/, ''), kind: 'photo' }))); i = 0; show(); toast(`사진 ${fs.length}장을 넣었어요`); };
    ctx.opts.append(lab('문제 그림', seg([['mix', '섞어서'], ['pic', '그림 11장'], ['photo', '실사 사진 16장']], set, v => { set = v; Store.set('zoom:set', v); reset(); show(); })), lab('보는 방법', seg([['mix', '골고루'], ['zoom', '확대'], ['shadow', '그림자'], ['mosaic', '모자이크']], 'mix', v => { mode = v; show(); })), lab('우리 반 사진 넣기 (선택)', fi), el('<p class="hint">그림자 문제는 배경이 하얀 그림에서만 나와요. 사진을 넣으면 파일 이름이 정답이 돼요.</p>'));
    show();
  };
})();
