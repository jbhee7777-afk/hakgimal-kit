/* 활동지 완성 예시: 빈칸에 예시 글과 그림을 넣어 보여 줘요 */
(function () {
  const EXF = {
    1: ['줄넘기 10번', '줄넘기 50번!', '그림 그리기', '그림 그리기, 축구', '가온이', '가온이, 나래이', '"몰라요"', '"해 볼게요!"', '처음엔 발표가 무서웠는데', '이제는 손을 번쩍 들어요.', '작은 변화도 나의 소중한 성장이에요.'],
    2: ['새 친구 가온이를 만났어요', '설레고 떨렸어요', '봄 소풍에서 김밥을 먹었어요', '신났어요', '운동회 이어달리기!', '뿌듯했어요', '수영 교실에서 물에 떴어요', '자랑스러웠어요', '여름방학 계획을 세웠어요', '두근두근'],
    4: ['첫눈 오는 날 눈사람 만들기', '반 친구들이 다 같이 굴렸어요', '우리 반 퀴즈 대회', '우리 모둠이 이겼어요!', '노력상 받은 날', '포기하지 않았다고 칭찬받았어요', '친구와 편지 주고받기', '마음이 따뜻해졌어요', '반 영화 보는 날', '팝콘 먹으며 다 같이 봤어요', '친구들과 함께라서 가장 신났기 때문이에요.'],
    _4old: ['운동회 이어달리기 1등', '바통을 떨어뜨리지 않았어요', '현장체험학습 동물원', '기린을 처음 봤어요', '첫눈 오는 날 눈사람', '반 친구들이 다 같이 만들었어요', '학예회 무대', '떨렸지만 끝까지 했어요', '받아쓰기 100점', '처음으로 다 맞았어요', '친구들과 함께라서 가장 신났기 때문이에요.'],
    6: ['책 읽기가 가장 많이 자랐어요. 아침마다 10분씩 읽었기 때문이에요.'],
    7: ['줄넘기를 포기하지 않고 연습한 일이요.', '매일 조금씩 했더니 50번을 넘었어요.', '친구와 다툰 뒤 바로 사과하지 못한 일이요.', '다음에는 먼저 말할 거예요.', '짝꿍 가온이요.', '내가 아플 때 보건실에 같이 가 줬어요.', '90점! 열심히 했지만 정리를 더 잘하고 싶어요.', '', '내년의 나야, 지금처럼 씩씩하게!'],
    8: ['교실 대청소를 했어요', '창밖에 첫눈이 펑펑!', '다 같이 운동장으로 뛰어나가요', '선생님이 눈사람 상을 주셨어요'],
    9: ['2학년 3반, 줄넘기 대회 단체 1등!', '12월 5일 운동장에서 우리 반이 줄넘기 대회에 나갔다.', '모두 한마음으로 2주 동안 연습했다.', '단체 줄넘기 52번으로 1등을 했다.', '선생님께서 "정말 자랑스러워"라고 하셨다.', '다음에는 60번에 도전하기로 했다.', '', '"하나, 둘!" 함께 외친 구호가', '1등의 비결이었다.', '', '급식에 떡볶이가 나온 날', '모두 두 그릇씩 먹었어요.', '', '"함께라서 가능했어요!"', '- 김가온'],
    _9old: ['2학년 3반, 줄넘기 대회 단체 1등!', '12월 5일 운동장에서 우리 반이 줄넘기 대회에 나갔다.', '모두 한 마음으로 연습해서', '단체 줄넘기 52번으로 1등을 했다.', '선생님께서 "정말 자랑스러워"라고 하셨다.', '다음에는 60번에 도전하기로 했다.', '', '', '급식에 떡볶이가 나온 날', '모두 두 그릇씩 먹었어요.', '', '"함께라서 가능했어요!"', '- 가온'],
    11: ['1년 전의 나에게. 새 반이 무서웠지?', '걱정 마. 가온이라는 좋은 친구가 생길 거야.', '받아쓰기가 어려워도 매일 조금씩 해 봐.', '그러면 100점도 받을 수 있어!', '줄넘기도 포기하지 마.', '지금의 내가 꼭 안아 주고 싶어.', '1년 뒤의 나가.'],
    15: ['인사를 늘 밝게 해요.', '아침마다 먼저 웃으며 인사해 줘서 기분이 좋아요.', '그림을 정말 잘 그려요.', '색칠이 꼼꼼하고 예뻐요.', '친구를 잘 도와줘요.', '내가 넘어졌을 때 손을 잡아 줬어요.'],
    17: ['엄마, 아침마다 깨워 주셔서 고맙습니다.', '추운 날 목도리를 둘러 주셔서 따뜻했어요.', '제가 아플 때 밤새 옆에 있어 주셨지요.', '그때 정말 든든했어요.', '내년에는 혼자 일어나 볼게요.', '사랑해요!'],
    22: ['가온', '가온아, 1년 동안 짝꿍이 되어 줘서 고마워.', '비 오는 날 우산 같이 쓴 거 기억나?', '너 덕분에 학교 오는 게 즐거웠어.', '3학년이 되어도 우리 꼭 같이 놀자!', '새 반에서도 지금처럼 웃는 가온이가 되길.', '언제나 응원할게!'],
    28: ['미래의 나에게. 지금 나는 9살이고 축구를 제일 좋아해.', '가장 친한 친구는 나래이야.', '너는 아직도 축구를 하니?', '꿈이 수의사인데, 여전히 동물을 좋아하니?', '이 편지를 읽을 때 웃고 있으면 좋겠어.', '9살의 내가.'],
    30: ['김가온', '가온이', '체육', '얼음땡', '수의사', '운동회 이어달리기에서 바통을 받은 순간', '모두 소리 질러 응원해 줬어요.', '', '3학년이 되어도 같이 놀자!', '모두 고마웠어!'],
    47: ['수학', '1시간은 몇 분일까요?', '① 30분 ② 60분 ③ 100분 ④ 24분', '② 긴바늘이 한 바퀴 돌면 60분이에요.'],
    49: ['같은 수를 여러 번 더한 것을', '간단히 나타내는 계산', '3 × 4 = 3 + 3 + 3 + 3', '전체를 똑같이 나눈 것 중의', '부분을 나타내는 수', '피자 4조각 중 1조각 = 1/4', '날씨가 달라지는 네 철', '봄, 여름, 가을, 겨울', '', '글자 아래에 오는 자음', '닭의 ㄺ, 꽃의 ㅊ', ''],
    51: ['국어 받아쓰기를 잘하게 되었어요.', '', '수학 문장제 문제 → 문제를 두 번 읽고 그림으로 그려 보기', ''],
    52: ['소리 내어 두 번 읽으면 내용이 쏙쏙 들어와요.', '', '', '노래로 외우면 금방 외워져요.', '', '', '하루 10분, 재미있는 책부터!', '', '', '먼저 인사하고 "같이 놀자"라고 말해요.'],
    53: ['매일 30분 공부', '하루도 빠짐없이', '책 20권 읽기', '매일 자기 전에', '줄넘기 100번', '매일 오후', '하루 한 번 낮잠', '주말에'],
    56: ['책 50권 읽기', '자기 전에 10분씩 읽기', '줄넘기 200번', '날마다 아침에 50번씩', '먼저 인사하기', '새 친구에게 먼저 말 걸기', '엄마 아빠 서명!'],
    57: ['눈사람 만들기', '할머니께 편지 쓰기', '스케이트 타 보기', '책 20권 읽기', '새로운 음식 먹어 보기', '가족과 영화 보기', '방 정리하기', '요리 도와 드리기', '종이접기 3가지', '별자리 찾아보기'],
    60: ['방학 동안 책 15권 읽기', '1/5', '구름빵', '나도 구름빵을 먹고 날고 싶어요.', '★★★★'],
    64: [],
    67: ['퀴즈 대회에서 생긴 일'],
    72: ['○○○ 선생님', '1980년대 (비밀!)', '떡볶이, 고양이, 아이들의 웃음', '복도에서 뛰기', '"안녕하세요!" 먼저 인사하기', '"천천히 해도 괜찮아"', '다 같이 이야기하며 배우는 수업', '배고플 때는 조심해 주세요.', '웃는 얼굴로 "괜찮아요?" 물어봐 주기', '2026년 3월 ~ 평생'],
    74: [],
    75: ['새로 올라올 동생에게', '2학년이 되면 곱셈구구를 배워. 노래로 외우면 쉬워!', '줄넘기 대회가 있으니 미리 연습하면 좋아.', '선생님 말씀을 잘 들으면 재미있는 일이 많아.', '친구에게 먼저 인사하면 금방 친해질 거야.', '너도 멋진 2학년이 될 거야. 응원해!'],
    76: ['수업 시간에 손 들고 한 번씩 발표하기', '', '새 친구에게 먼저 말 걸기', '', '아침 8시 전에 일어나기', ''],
    77: ['겨울왕국 / 엘사, 안나', '', '처음에는 힘을 숨겼지만', '나중에는 자신 있게 썼어요.', '언니에게 먼저 다가가', '마음을 열었을 거예요.', '가족의 사랑이 느껴지는', '따뜻한 영화예요!']
  };
  Object.assign(EXF, {
    3: ['3월: 새 반 첫날', '친구 이름 외우기 대작전!', '', '4월: 봄 소풍', '김밥 먹고 보물찾기', '', '5월: 운동회', '줄다리기 우승!', '', '7월: 수영 교실', '물에 처음 떴어요', '', '10월: 현장체험학습', '동물원에서 기린 보기', '', '12월: 첫눈', '반 친구들과 눈사람', ''],
    6: ['책 읽기가 가장 많이 자랐어요. 아침마다 10분씩 읽었거든요.'],
    10: ['새 친구가 생겨서 설렜어요', '소풍이 즐거웠어요', '운동회에서 넘어졌어요', '친구와 다퉜다가 화해했어요', '여름방학이 기다려졌어요', '개학해서 친구를 다시 만났어요', '받아쓰기 100점!', '감기에 걸려 힘들었어요', '첫눈이 와서 신났어요'],
    13: ['늘 웃어 줘서 고마워!', '같이 놀아서 즐거웠어', '그림 정말 잘 그려!', '3학년 때도 친구 하자', '우산 씌워 줘서 고마워', '네 덕분에 힘이 났어', '발표 정말 멋졌어', '최고의 짝꿍!', '또 같이 줄넘기 하자', '고마워, 사랑해!', '운동회 때 응원 고마워', '넌 정말 친절해'],
    14: ['아침마다 먼저 인사해 줘서', '하루가 즐거워졌어.', '고마워!', '', '', '청소를 끝까지 해 줘서', '교실이 반짝반짝해졌어.', '최고야!', '', '', '내가 넘어졌을 때', '손을 잡아 줘서 고마웠어.', '', '', '', '체육 시간에 응원해 줘서', '힘이 났어. 고마워!'],
    16: ['가온이', '오늘 발표할 때', '목소리가 정말 씩씩했어!', '내일도 파이팅!', '', '가온이', '아침에 웃으며 인사해 줘서', '나도 기분이 좋았어.', '', '', '가온이', '그림 그리는 모습이 멋졌어.', '넌 최고의 화가야!', '', '', '가온이', '내일이면 내가 누군지 알게 돼!', '늘 응원할게.'],
    18: ['네가 웃으면 우리 반이 밝아져!', '고마워.', '', '', '', '수학 문제 알려 줘서 고마워.', '덕분에 이해했어!', '', '', '', '줄넘기 같이 연습해 줘서', '정말 즐거웠어.', '', '', '', '늘 친절한 네가 최고야!', '3학년 때도 친구 하자.'],
    21: ['ㄱ', '괜찮아', '친구가 실수해서 속상해할 때', '"괜찮아, 다시 하면 돼! 내가 도와줄게."'],
    27: ['김가온', '웃음 많은 친구', '가온이', '고양이, 떡볶이', '운동회 이어달리기', '수의사', '모두 고마웠어!'],
    29: [],
    47: ['수학', '1시간은 몇 분일까요?', '① 30분 ② 60분 ③ 100분 ④ 24분', '② 긴바늘이 한 바퀴 돌면 60분', '국어', '"크다"의 반대말은?', '① 작다 ② 많다 ③ 길다 ④ 높다', '① 작다', '통합', '우리나라의 국기는?', '① 무궁화 ② 태극기 ③ 한복 ④ 애국가', '② 태극기'],
    54: ['일찍 자고 일찍 일어나기 (9시 전에 잠자기)', '빙판길에서는 주머니에서 손 빼고 걷기', '가족과 함께 집안일 한 가지씩 하기'],
    55: ['눈사람 만들기', '설날 세배하기', '줄넘기 100번', '책 5권 읽기', '어린이날 소풍', '시원하게 물 마시기'],
    57: ['눈사람 만들기', '할머니께 편지 쓰기', '스케이트 타 보기', '책 20권 읽기', '새로운 음식 먹어 보기', '가족과 영화 보기', '내 방 정리하기', '요리 도와 드리기', '종이접기 3가지', '별자리 찾아보기', '줄넘기 200번', '연날리기', '썰매 타기', '동시 쓰기', '박물관 가기', '설거지 돕기', '팽이치기', '일기 10번 쓰기', '사진 찍기', '감사 편지 쓰기'],
    58: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
    61: ['가족 모두 건강하기', '', '책 50권 읽기', '', '새 친구 많이 사귀기', '', '수영 배우기', '', '줄넘기 2단 뛰기', ''],
    63: [],
    64: ['웃음 가득 우리 반 1년'],
    67: ['사라진 우유 대소동'],
    68: ['수의사', '김가온', '아픈 동물을 치료해요', '고양이, 강아지', '요리사', '이나래', '맛있는 음식을 만들어요', '떡볶이', '우주 비행사', '박다솜', '우주를 탐험해요', '별 보기', '선생님', '최라온', '아이들과 함께 배워요', '책 읽기', '축구 선수', '정마루', '골을 넣어 기쁨을 줘요', '축구', '화가', '강보람', '그림으로 마음을 전해요', '색칠', '소방관', '조새봄', '불을 끄고 사람을 구해요', '운동', '과학자', '윤아라', '새로운 것을 발견해요', '실험'],
    69: ['넌 할 수 있어!', '천천히 꾸준히', '실수해도 괜찮아', '오늘도 반짝반짝', '용기를 내!', '새 친구 반가워', '힘내, 나!', '웃으면 복이 와'],
    74: []
  });
  const EXI = {
    4: ['img/cat6.png', 'img/cat4.png', 'img/cat3.png', 'img/cat2.png', 'img/cat9.png'],
    8: ['img/cat8.png', 'img/photo/snowflake.jpg', 'img/kids.png', 'img/cat3.png'],
    63: ['img/sheep.png'], 64: ['img/cat1.png', 'img/cat6.png', 'img/cat9.png', 'img/cat4.png'],
    67: ['img/cat4.png', 'img/cat7.png', 'img/cat3.png'], 76: ['img/cat7.png', ''], 77: ['img/cat9.png', ''],
    21: ['img/cat2.png'], 1: ['img/cat5.png', 'img/cat6.png'], 2: ['img/cat1.png'], 9: ['img/cat4.png'], 30: ['img/cat3.png'], 27: ['img/cat2.png'],
    65: ['img/sheep.png', 'img/photo/snowman.jpg', 'img/cat6.png', 'img/kids.png']
  };
  const FAKE = ['가온', '나래', '다솜', '라온', '마루', '보람', '새봄', '아라', '여름', '하랑', '한결', '두리', '바름', '시온', '온유', '이음', '다온', '루아', '미르', '세찬', '나린', '로아', '해솔', '윤슬'];
  window.EXAMPLE_FILL = EXF;
  /* 예시 페이지 만들기 */
  window.examplePage = function (a, page) {
    const p = page.cloneNode(true), lines = (EXF[a.n] || []).slice();
    p.classList.add('example');
    const badge = el('<div class="exbadge">완성 예시</div>'); p.appendChild(badge);
    const put = (s, t) => s.insertAdjacentHTML('beforeend', `<span class="exw">${esc(t)}</span>`);
    /* 0) 실제 우리 반 이름은 지어낸 이름으로 바꾸기 */
    const roster = Store.roster().slice().sort((x, y) => y.length - x.length);
    if (roster.length) { const map = {}; Store.roster().forEach((n, i) => { map[n] = FAKE[i % FAKE.length]; }); const walk = n => { if (n.nodeType === 3) { let t = n.nodeValue; roster.forEach(r => { if (t.includes(r)) t = t.split(r).join(map[r]); }); n.nodeValue = t; } else n.childNodes.forEach(walk); }; walk(p); }
    $$('.pname', p).forEach(x => { x.innerHTML = x.innerHTML.replace(/\d+번 [^<]+/, '7번 김가온'); });
    if (a.n === 17) { $$('span', p).filter(x => x.textContent === '____________').forEach(x => { x.innerHTML = '<b style="color:#2366C2">엄마</b>'; }); const boxes = $$('svg rect[rx="3"]', p); boxes.forEach((r, k) => { if (k === 2) r.parentNode.insertAdjacentHTML('beforeend', '<path d="M5 10l3.5 3.5L15 6" fill="none" stroke="#2366C2" stroke-width="2.5" stroke-linecap="round"/>'); r.setAttribute('rx', '3.01'); }); }
    if (a.n === 49) { $$('div', p).filter(d => d.children.length === 1 && d.firstElementChild.tagName === 'SPAN' && d.firstElementChild.textContent === '낱말').forEach((d, k) => d.insertAdjacentHTML('beforeend', `<span class="exw" style="font-size:24px;padding:0 0 0 10px">${['곱셈', '분수', '사계절', '받침'][k] || ''}</span>`)); }
    if (a.n === 22) { $$('.pc-from i', p).forEach(x => { x.innerHTML = '<span class="exw" style="padding:0;display:inline">나래</span>'; }); }
    if (a.n === 72) { $$('table.pt td:not(.lab)', p).forEach(td => { const t = lines.shift(); if (t) td.innerHTML = `<span class="exw" style="padding:0;display:inline">${esc(t)}</span>`; }); }
    /* 1) 이 활동만의 특별한 칸 */
    if (a.n === 59 && window.safeChosen) { const ans = safeChosen().flatMap(t => t.blanks.map(b => b[1])); $$('.sbl u', p).forEach((u, k) => ans[k] && put(u, ans[k])); }
    if (a.n === 13) { const msgs = lines.splice(0); $$('div[style*="1.5px dashed #B8C1CF"]', p).forEach((c, k) => { if (msgs[k]) c.insertAdjacentHTML('afterbegin', `<span class="exw" style="white-space:normal;padding:0 0 6px">${esc(msgs[k])}</span>`); c.lastChild && (c.lastChild.textContent = 'From. ' + ['나래', '다솜', '라온', '마루', '보람', '새봄', '아라', '여름', '하랑', '가온', '나래', '다솜'][k]); }); }
    if (a.n === 64) { const t = $$('div', p).find(d => d.textContent === '포스터 제목을 크게 써요'); if (t) t.innerHTML = `<span class="exw" style="font-size:30px;padding:0">${esc(lines.shift() || '')}</span>`; }
    if (a.n === 55) { $$('span', p).filter(s => /^목표 _+$/.test(s.textContent)).forEach((s, k) => { if (lines[k]) s.innerHTML = `목표 <b style="color:#2366C2">${esc(lines[k])}</b>`; }); lines.length = 0; }
    if (a.n === 6) { $$('div[style*="grid-template-columns:repeat(10,1fr)"]', p).forEach((row, k) => { const n = k % 2 ? [7, 6, 8, 7, 6, 9][k >> 1] : [3, 4, 2, 3, 3, 2][k >> 1]; $$('i', row).forEach((c, j) => { if (j < n) c.style.background = k % 2 ? 'var(--c)' : 'var(--t)'; }); }); }
    if (a.n === 10) { $$('table.pt tr', p).forEach((tr, k) => { const ic = $$('td:nth-child(2) span', tr); const pick = [0, 1, 3, 2, 1, 0, 0, 3, 4][k - 1]; if (ic[pick]) ic[pick].style.cssText += ';outline:3px solid #2366C2;outline-offset:3px;border-radius:50%'; }); }
    if (a.n === 58) { $$('table.pt th', p).filter(th => !th.textContent.trim()).forEach((th, k) => { th.innerHTML = `<span class="exw" style="padding:0;font-size:13px">${(k % 14) + 1}</span>`; }); $$('table.pt tr', p).forEach((tr, r) => $$('td', tr).slice(1).forEach((td, c) => { if ((r * 3 + c * 5) % 7 > 1) td.style.background = 'color-mix(in srgb, var(--c) 30%, white)'; })); lines.length = 0; }
    if (a.n === 62) { $$('svg circle[stroke-dasharray="4 4"]', p).forEach((c, k) => { if (k % 3 !== 2) { c.setAttribute('fill', '#FFD6DF'); c.setAttribute('stroke-dasharray', ''); c.parentNode.insertAdjacentHTML('beforeend', '<text x="30" y="37" text-anchor="middle" font-family="Miso" font-weight="700" font-size="16" fill="#C9305A">참 잘했어요</text>'.replace('참 잘했어요', '성공')); } }); }
    if (a.n === 81) { const im = $('img[src*="img/sheep/"]', p); if (im) { im.parentNode.style.position = 'relative'; im.insertAdjacentHTML('afterend', '<img class="eximg" src="img/sheep.png" alt="" style="max-width:28%;max-height:30%;left:auto;right:14px;top:auto;bottom:14px;margin:0"><span class="exw" style="position:absolute;right:16px;bottom:-4px;font-size:13px">이렇게 빨갛게 칠해요</span>'); } }
    /* 2) 글 쓰는 칸 */
    const slots = $$('.d3-tab i, .d3w, .d3-line, .ln, table.pt td:not(.lab), .gl i, .nc-job i, .nc-name i, .nc-do i, .nc-ic i, .pc-to i, .pc-from i, .dword i, .dsay i, .drow > div > i, .dby i, .wtag .ln, .cf i, .pc1-name i, .pc1-word i, .pc1-row i, .nto i, .nt-line i, div[data-grow] > span[style*="flex:1"]', p)
      .filter(s => !s.querySelector('svg, img, .exw') && !s.closest('.sbl') && !(s.tagName === 'TD' && s.textContent.trim()) && !(s.matches('.nto i') && s.previousElementSibling && s.previousElementSibling.textContent.trim()));
    slots.forEach(s => { if (!lines.length) return; const t = lines.shift(); if (t) put(s, t); });
    /* 3) 그림 칸 */
    const pics = $$('.d3-pic, .box, .pc1-photo, .polaroid div, .dpic, .mpic, .wpic, .nc-face, .pcard .pc-stamp, .cutgrid > div > div[style*="dashed"], div[style*="2px dashed #9AA6B8;border-radius:18px"], div[style*="1.5px dashed #CDD5E1;border-radius:12px"]' + (a.n === 65 ? ', .cutgrid > div' : ''), p).filter(b => !b.querySelector('.eximg')).slice(0, 12);
    const stickers = ['img/cat1.png', 'img/cat2.png', 'img/cat6.png', 'img/cat4.png', 'img/cat7.png', 'img/sheep.png', 'img/cat3.png', 'img/cat9.png'];
    pics.forEach((b, k) => { const src = EXI[a.n] ? EXI[a.n][k] : stickers[(k + a.n) % stickers.length]; if (!src) return; if (!/absolute|fixed/.test(b.style.position)) b.style.position = 'relative'; b.insertAdjacentHTML('beforeend', `<img class="eximg" src="${src}" alt="">`); });
    /* 4) 동그라미·체크 칸 */
    $$('table.pt td svg circle', p).forEach((c, k) => { if ((k + Math.floor(k / 3)) % 3 === 0) { c.setAttribute('fill', '#BFE3FF'); c.setAttribute('stroke', '#2366C2'); } });
    if (a.n !== 17) $$('rect[rx="3"]', p).forEach((r, k) => { if (k % 4 !== 3) r.parentNode.insertAdjacentHTML('beforeend', '<path d="M5 10l3.5 3.5L15 6" fill="none" stroke="#2366C2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'); });
    return p;
  };
})();
