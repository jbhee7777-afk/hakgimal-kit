/* ── 우리 반 마지막 산책: 미션 8곳을 따라 걸으며 친구 만나기 ── */
(function () {
  const B = window.SHEET_BLOCKS;
  const BOX = '<svg viewBox="0 0 20 20" style="width:19px;height:19px;flex:none"><rect x="2" y="2" width="16" height="16" rx="3" fill="#fff" stroke="#8A7F74" stroke-width="1.8"/></svg>';
  const f = (lab, w) => `<span class="wk-f"><b>${lab}</b><i style="flex:${w || 1}"></i></span>`;
  const STOPS = [
    ['산책 인사로 출발!', '친구 3명에게 이름을 부르며 인사해요.', `<div class="wk-row">${[1, 2, 3].map(k => `<span class="wk-ck">${BOX}<i></i></span>`).join('')}</div>`, '#F7D9C4'],
    ['기억에 남는 활동', '첫 번째 친구가 고른 올해 최고의 활동은?', `<div class="wk-row">${f('친구')}${f('활동', 1.4)}</div>`, '#D5ECDF'],
    ['새롭게 알게 된 것', '두 번째 친구가 올해 새로 배운 것은?', `<div class="wk-row">${f('친구')}${f('배운 것', 1.4)}</div>`, '#DCE6F6'],
    ['즐거웠던 순간', '세 번째 친구가 가장 즐거웠던 순간은?', `<div class="wk-row">${f('친구')}${f('순간', 1.4)}</div>`, '#F6DCE4'],
    ['고마운 마음 전하기', '네 번째 친구에게 고마웠던 일을 말해요.', `<div class="wk-row">${f('친구')}<span class="wk-ck">${BOX}<em>마음을 전했어요!</em></span></div>`, '#F8E8B8'],
    ['친구의 반짝이는 점', '다섯 번째 친구의 멋진 점을 말해 줘요.', `<div class="wk-row">${f('친구')}${f('멋진 점', 1.4)}</div>`, '#E6DDF4'],
    ['우리의 닮은 점', '여섯 번째 친구와 나의 같은 점을 찾아요.', `<div class="wk-row">${f('친구')}${f('같은 점', 1.4)}</div>`, '#D5ECDF'],
    ['내가 자란 한 뼘', '1년 동안 더 잘하게 된 것은?', `<div class="wk-row">${f('', 1)}</div><div class="wk-row wk-sign"><span>선생님께 말하고 사인 받기</span><i></i></div>`, '#F7D9C4']
  ];
  /* 지그재그: 1 2 / 4 3 / 5 6 / 8 7 */
  const ORDER = [0, 1, 3, 2, 4, 5, 7, 6];
  B.walk = () => `<div data-nofill class="wk">
    <svg class="wk-path" viewBox="0 0 700 800" preserveAspectRatio="none"><path d="M175 60 H525 C640 60 640 260 525 260 H175 C60 260 60 460 175 460 H525 C640 460 640 660 525 660 H175 C120 660 100 720 160 790" fill="none" stroke="#F1E4CC" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="M175 60 H525 C640 60 640 260 525 260 H175 C60 260 60 460 175 460 H525 C640 460 640 660 525 660 H175 C120 660 100 720 160 790" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 12" stroke-linecap="round"/></svg>
    <div class="wk-grid">${ORDER.map(k => { const [t, q, body, col] = STOPS[k]; return `<div class="wk-stop" style="--wc:${col}"><div class="wk-h"><span class="wk-n">${k + 1}</span><b>${t}</b></div><p>${q}</p>${body}</div>`; }).join('')}</div>
    <div class="wk-end"><div class="wk-eh"><img src="img/wc/bouquet.png" alt=""><b>도착! 1년 마음 모으기</b><img src="img/wc/bouquet.png" alt=""></div>
      <div class="wk-row">${f('내가 뿌듯했던 일', 1.6)}${f('방학 약속', 1.2)}</div>
      <p>아직 만나지 않은 친구 3명과 새해 인사를 나누고 이름을 받아요.</p>
      <div class="wk-row">${[1, 2, 3].map(k => `<span class="wk-sg"><em>${k}</em><i></i></span>`).join('')}</div></div>
  </div>`;
})();
