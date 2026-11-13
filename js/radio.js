/* ── 우리 반 라디오: 사연 엽서 + 선생님 DJ 방송 화면 ── */
(function () {
  const T = window.TOOLS;
  const L = n => Array.from({ length: n }, () => '<div class="ln"></div>').join('');
  const BOX = '<svg viewBox="0 0 20 20" style="width:20px;height:20px;flex:none"><rect x="2" y="2" width="16" height="16" rx="3" fill="#fff" stroke="#56627A" stroke-width="1.8"/></svg>';
  const WAVE = c => `<svg viewBox="0 0 160 40" class="rc-wave"><path d="M0 20 ${Array.from({ length: 20 }, (_, k) => `L${k * 8 + 4} ${20 + (k % 2 ? -1 : 1) * [4, 10, 16, 8, 13, 5, 15, 9][k % 8]}`).join(' ')} L160 20" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  const station = () => Store.d('radio:name', `${className() || '우리 반'} 라디오`);
  const TOPICS = ['고마운 친구', '웃겼던 일', '자랑하고 싶은 일', '선생님께'];

  function card() {
    return `<div class="rcard"><div class="rc-top"><div class="rc-fm"><b>FM 2.3</b><span>${esc(station())}</span></div>${WAVE('#9DB8D6')}<div class="rc-onair">사연 엽서</div></div>
      <div class="rc-body">
        <div class="rc-topics"><span class="rc-lab">사연 주제</span>${TOPICS.map(t => `<span class="rc-ck">${BOX}${t}</span>`).join('')}</div>
        <div class="rc-hello">DJ 선생님, 제 사연을 들려 드릴게요.</div>
        <div class="rc-lines">${L(4)}</div>
        <div class="rc-foot"><div class="rc-song"><span>신청곡</span><i></i></div><div class="rc-name"><span>보내는 사람</span><i></i></div></div>
        <div class="rc-secret"><span class="rc-ck">${BOX}이름은 비밀로 해 주세요</span><span class="rc-tip">친구가 속상할 사연은 쓰지 않아요</span></div>
      </div></div>`;
  }
  function sheet(a) {
    const p = pageFrame(a, a.name, '한 장에 사연 2개를 써요. 다 쓰면 가운데 점선을 따라 잘라 사연함에 넣어요.');
    p.insertAdjacentHTML('beforeend', `<div data-nofill class="rcards">${card()}<div class="rc-cut"><span>✂</span></div>${card()}</div>`);
    return p;
  }

  /* 소리: 시그널 음악, 박수, 띠링, 잔잔한 배경음 */
  let ac = null;
  const AC = () => { if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); return ac; };
  function tone(f, t0, dur, type, vol) { const c = AC(), o = c.createOscillator(), g = c.createGain(); o.type = type || 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol || .18, t0 + .02); g.gain.exponentialRampToValueAtTime(.001, t0 + dur); o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + dur + .05); }
  function jingle() { const c = AC(), t = c.currentTime + .05; [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, k) => tone(f, t + k * .13, .32, 'triangle', .16)); [523, 659, 784].forEach(f => tone(f, t + 7 * .13, 1.2, 'sine', .1)); }
  function ding() { const c = AC(), t = c.currentTime + .03; tone(1175, t, .5, 'sine', .2); tone(1568, t + .16, .7, 'sine', .2); }
  function applause() {
    const c = AC(), len = 2.6, buf = c.createBuffer(1, c.sampleRate * len, c.sampleRate), d = buf.getChannelData(0);
    for (let k = 0; k < 70; k++) { const at = Math.floor(Math.random() * (len - .1) * c.sampleRate), n = Math.floor(c.sampleRate * .02), amp = .4 + Math.random() * .6; for (let j = 0; j < n; j++) d[at + j] += (Math.random() * 2 - 1) * amp * Math.exp(-j / (n / 4)); }
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = .7; g.gain.value = .6; g.gain.setValueAtTime(.6, c.currentTime + len - .6); g.gain.linearRampToValueAtTime(0, c.currentTime + len);
    s.buffer = buf; s.connect(f).connect(g).connect(c.destination); s.start();
  }
  let bgm = null;
  function bgmToggle(on) {
    if (bgm) { clearInterval(bgm); bgm = null; }
    if (!on) return;
    const notes = [392, 440, 523, 587, 659, 784], chords = [[262, 330, 392], [220, 262, 330], [175, 220, 262], [196, 247, 294]]; let k = 0;
    const step = () => { const c = AC(), t = c.currentTime + .02; if (k % 8 === 0) chords[(k / 8) % 4].forEach(f => tone(f, t, 3.2, 'sine', .035)); if (Math.random() < .7) tone(notes[Math.floor(Math.random() * notes.length)], t, .9, 'sine', .045); k++; };
    step(); bgm = setInterval(step, 420);
  }

  const CUES = {
    open: ['오프닝', '안녕하세요, 여기는 FM 2.3 {S}! 오늘도 반가운 사연이 가득 도착했어요. 함께 들어 볼까요?'],
    story: ['사연 읽기', '{N}번째 사연이에요. 보내 주신 분은… (비밀이면 "수줍은 친구"라고 불러요)'],
    song: ['신청곡 시간', '사연과 함께 신청곡도 도착했어요. 다 같이 들어 볼까요? (노래는 선생님이 틀어 주세요)'],
    talk: ['DJ 한마디', '방금 사연을 듣고 어떤 생각이 들었나요? 한 친구만 소감을 말해 볼까요?'],
    close: ['클로징', '오늘 방송은 여기까지예요. 사연을 보내 준 친구들 고마워요. 내일도 따뜻한 하루 보내세요!']
  };

  T.radio = function (a, ctx) {
    const st = ctx.stage;
    let total = Store.d('radio:total', Math.max(10, Store.roster().length * 2 || 40)), n = 0, on = false, cue = 'open', clockT = null;
    const body = el('<div class="stagebody radio"></div>'); st.appendChild(body);
    body.innerHTML = `<div class="rd">
      <div class="rd-head"><div class="rd-lamp" data-lamp>ON AIR</div><div class="rd-st"><b>FM 2.3</b><span contenteditable="true" spellcheck="false" data-name>${esc(station())}</span></div><div class="rd-clock" data-clock></div></div>
      <div class="rd-main">
        <div class="rd-cue"><span class="rd-cuet" data-cuet></span><p data-cuep></p><div class="rd-eq" data-eq>${Array.from({ length: 24 }, (_, k) => `<i style="animation-delay:${-(k * 137 % 900) / 1000}s"></i>`).join('')}</div></div>
        <div class="rd-side"><div class="rd-count"><span>오늘의 사연</span><b data-count>0</b><small>/ <em data-total>${total}</em>통</small></div><div class="rd-bar"><i data-bar></i></div>
          <div class="rd-prog">${Object.entries(CUES).map(([k, [t]]) => `<button data-c="${k}">${t}</button>`).join('')}</div></div>
      </div>
      <div class="rd-ctrl"><button class="btn huge dark" data-onair>방송 시작</button><button class="btn huge" data-next>다음 사연</button><button class="btn big" data-jingle>시그널 음악</button><button class="btn big" data-clap>박수 소리</button><button class="btn big" data-bgm>배경음악 켜기</button></div>
    </div>`;
    const $b = s => $(s, body);
    const tick = () => { const d = new Date(); $b('[data-clock]').textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
    tick(); clockT = setInterval(() => { if (!document.body.contains(body)) { clearInterval(clockT); bgmToggle(false); return; } tick(); }, 5000);
    function show() {
      const [t, p] = CUES[cue];
      $b('[data-cuet]').textContent = t;
      $b('[data-cuep]').textContent = p.replace('{S}', $b('[data-name]').textContent.trim()).replace('{N}', n);
      $b('[data-count]').textContent = n; $b('[data-total]').textContent = total;
      $b('[data-bar]').style.width = Math.min(100, n / total * 100) + '%';
      $$('[data-c]', body).forEach(x => x.classList.toggle('on', x.dataset.c === cue));
      body.classList.toggle('live', on);
      $b('[data-onair]').textContent = on ? '방송 끝내기' : '방송 시작';
      $b('[data-next]').disabled = !on || n >= total;
    }
    $b('[data-name]').oninput = e => Store.set('radio:name', e.target.textContent.trim());
    $b('[data-onair]').onclick = () => { on = !on; if (on) { cue = 'open'; jingle(); } else { cue = 'close'; jingle(); bgmToggle(false); $b('[data-bgm]').textContent = '배경음악 켜기'; } show(); };
    $b('[data-next]').onclick = () => { if (n >= total) return; n++; cue = 'story'; ding(); const c = $b('.rd-cue'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); show(); if (n >= total) toast('준비한 사연을 모두 읽었어요'); };
    $b('[data-jingle]').onclick = jingle;
    $b('[data-clap]').onclick = applause;
    $b('[data-bgm]').onclick = e => { const now = !bgm; bgmToggle(now); e.currentTarget.textContent = now ? '배경음악 끄기' : '배경음악 켜기'; };
    $$('[data-c]', body).forEach(x => x.onclick = () => { cue = x.dataset.c; if (cue === 'song') ding(); show(); });
    show();

    const tot = el(`<input type="number" min="1" max="200" value="${total}">`);
    tot.onchange = () => { total = Math.max(1, Math.min(200, +tot.value || 1)); Store.set('radio:total', total); show(); };
    const lab = (t, nd) => { const l = el(`<label class="f">${t}</label>`); l.appendChild(nd); return l; };
    const pb = el('<button class="btn dark">사연 엽서 인쇄</button>'); pb.onclick = () => printPages(pages(a));
    const rs = el('<button class="btn flat">처음부터 다시</button>'); rs.onclick = () => { n = 0; on = false; cue = 'open'; bgmToggle(false); $b('[data-bgm]').textContent = '배경음악 켜기'; show(); };
    ctx.opts.append(lab('모은 사연 수', tot), pb, rs, el('<p class="hint">엽서는 한 사람에 한 장(사연 2개)씩 나와요. 걷은 엽서를 섞어 사연함에 넣고, "다음 사연"을 누를 때마다 한 장씩 꺼내 읽어요. 방송 이름은 화면에서 눌러 바로 고칠 수 있어요. 신청곡은 선생님이 직접 틀어 주세요.</p>'));
    ctx.print(() => printPages(pages(a)));
  };
  const pages = a => Array.from({ length: Math.max(1, Store.roster().length) }, () => sheet(a));
  T.radio.pages = a => [sheet(a)];
})();
