/* Lesson 6: textbook definitions, pages 50–55. */
(function () {
  'use strict';
  var words = [
    ['ahead of', 'in front of', 'prep.'],
    ['beat', 'to win against another team in a game or contest', 'v.'],
    ['calm', 'quiet and still', 'adj.'],
    ['chat', 'to talk with someone casually', 'v.'],
    ['describe', 'to use words to tell someone about something', 'v.'],
    ['disappointing', 'not being as good as one expected or wished for', 'adj.'],
    ['entertain', 'to interest and amuse someone', 'v.'],
    ['imagination', 'the ability to form ideas or images of things in your mind', 'n.'],
    ['nervous', 'worried or frightened about something', 'adj.'],
    ['notice', 'to become aware of something', 'v.'],
    ['patient', 'able to wait and remain calm', 'adj.'],
    ['stink', 'to be very unpleasant or bad', 'v.'],
    ['block', 'to stop something from getting through', 'v.'],
    ['greet', 'to welcome someone', 'v.'],
    ['net', 'a piece of material made of string or rope that is used to catch or hold things', 'n.'],
    ['peaceful', 'calm and quiet', 'adj.'],
    ['season', 'a part of the year during which people do a particular activity', 'n.'],
    ['amuse', 'to make someone laugh or smile', 'v.'],
    ['cooperate', 'to work together', 'v.'],
    ['interact', 'to talk to or do things with others', 'v.']
  ];
  var groups = [['calm', 'peaceful'], ['amuse', 'entertain'], ['chat', 'interact', 'cooperate', 'greet']];
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function ambiguous(a, b) {
    return groups.some(function (g) { return g.indexOf(a) >= 0 && g.indexOf(b) >= 0; });
  }
  function options(w) {
    var pool = words.filter(function (x) { return x !== w && !ambiguous(w[0], x[0]); });
    var same = shuffle(pool.filter(function (x) { return x[2] === w[2]; }));
    var rest = shuffle(pool.filter(function (x) { return x[2] !== w[2]; }));
    return shuffle([w].concat(same.concat(rest).slice(0, 3)));
  }
  var quiz = { items: [], at: 0, pick: null, wrong: [], correct: 0, opts: [], review: false };
  var body = document.getElementById('englishBody');
  function btn(text, action, cls) {
    var b = document.createElement('button'); b.className = cls || 'btn';
    b.textContent = text; b.addEventListener('click', action); return b;
  }
  function el(tag, text, cls) {
    var n = document.createElement(tag); n.textContent = text; if (cls) n.className = cls; return n;
  }
  function start(items, review) {
    quiz = {items: shuffle(items), at: 0, pick: null, wrong: [], correct: 0, opts: [], review: !!review};
    question();
  }
  function study() {
    body.replaceChildren();
    body.append(el('p', 'Lesson 6 · 20개 단어 · 영어 뜻을 읽고 단어를 골라요.', 'english-note'));
    body.append(btn('퀴즈 시작 · 20문제', function () { start(words); }, 'btn primary big'));
    var list = el('div', '', 'vocab-list');
    words.forEach(function (w) {
      var card = el('div', '', 'card vocab-item');
      card.append(el('strong', w[0]), el('span', w[2], 'muted'), el('p', w[1])); list.append(card);
    });
    body.append(list);
  }
  function question() {
    body.replaceChildren();
    if (quiz.at >= quiz.items.length) {
      body.append(el('h3', quiz.review ? '틀린 단어 복습 완료!' : '퀴즈 완료!'));
      body.append(el('p', quiz.correct + ' / ' + quiz.items.length + ' 정답', 'result-score'));
      if (quiz.wrong.length) {
        body.append(el('p', '다시 볼 단어: ' + quiz.wrong.map(function (w) {return w[0];}).join(', '), 'english-note'));
        body.append(btn('틀린 문제만 다시 풀기', function () { start(quiz.wrong, true); }, 'btn primary'));
      } else body.append(el('p', '모두 맞혔어요! 잘했어, 오션!', 'english-note'));
      body.append(btn('전체 다시 풀기', function () { start(words); }));
      body.append(btn('단어 공부하기', study)); return;
    }
    var w = quiz.items[quiz.at];
    if (quiz.pick === null) quiz.opts = options(w);
    body.append(el('p', (quiz.review ? '오답 복습 · ' : '') + (quiz.at + 1) + ' / ' + quiz.items.length, 'english-note'));
    body.append(el('h3', 'Which word matches this meaning?', 'english-instruction'));
    var prompt = el('p', w[1], 'quiz-prompt english-prompt'); prompt.lang = 'en'; body.append(prompt);
    var choices = el('div', '', 'quiz-options');
    quiz.opts.forEach(function (choice, i) {
      var b = btn(choice[0], function () {
        if (quiz.pick !== null) return;
        quiz.pick = i;
        if (choice === w) quiz.correct++; else quiz.wrong.push(w);
        question();
      }, 'quiz-opt');
      b.lang = 'en';
      if (quiz.pick !== null) {
        b.disabled = true;
        if (choice === w) b.classList.add('good');
        else if (i === quiz.pick) b.classList.add('bad');
      }
      choices.append(b);
    });
    body.append(choices);
    var feedback = el('div', '', 'quiz-tip'); feedback.setAttribute('aria-live', 'polite');
    if (quiz.pick !== null) {
      feedback.textContent = (quiz.opts[quiz.pick] === w ? '정답이에요! ' : '정답을 기억해 봐요: ') + w[0] + ' — ' + w[1];
      body.append(feedback, btn(quiz.at + 1 === quiz.items.length ? '결과 보기' : '다음 문제', function () {
        quiz.at++; quiz.pick = null; question();
      }, 'btn primary big'));
    } else body.append(el('p', '영어 뜻에 맞는 단어를 골라 보세요. 시간제한은 없어요.', 'english-note'));
    body.append(btn('단어 공부하기', study));
  }
  document.querySelectorAll('[data-learning]').forEach(function (b) {
    b.addEventListener('click', function () {
      var english = b.dataset.learning === 'english';
      document.getElementById('englishPanel').hidden = !english;
      document.getElementById('dictationPanel').hidden = english;
      document.querySelectorAll('[data-learning]').forEach(function (tab) {
        var active = tab === b; tab.classList.toggle('active', active); tab.setAttribute('aria-pressed', String(active));
      });
    });
  });
  study();

  /* Weather is independent of the child's local progress and backup. */
  var weatherData = null, weatherAt = 0, busy = false;
  var weather = document.getElementById('weatherBody');
  var note = document.getElementById('weatherNote');
  function seoulDate() { return new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date()); }
  function label(code) {
    if (code === 0) return '맑음';
    if (code <= 2) return '구름 조금';
    if (code === 3) return '흐림';
    if (code === 45 || code === 48) return '안개';
    if ([71,73,75,77,85,86].indexOf(code) >= 0) return '눈';
    if (code >= 95) return '뇌우';
    if (code >= 51 && code <= 82) return '비';
    return '날씨 정보';
  }
  function valid(d) {
    return d && d.daily && d.daily.time[0] === seoulDate() &&
      Number.isFinite(d.daily.temperature_2m_min[0]) && Number.isFinite(d.daily.temperature_2m_max[0]);
  }
  function renderWeather(stale) {
    weather.replaceChildren();
    if (!valid(weatherData)) {
      weather.append(el('p', '날씨를 불러오지 못했어요.', 'english-note'));
      note.textContent = '인터넷 연결 후 다시 눌러 주세요.'; return;
    }
    var d = weatherData, current = d.current || {};
    weather.append(el('p', Number.isFinite(current.weather_code) ? label(current.weather_code) : '오늘 기온', 'weather-condition'));
    var temps = el('div', '', 'weather-temps');
    temps.append(el('span', '최저 ' + Math.round(d.daily.temperature_2m_min[0]) + '°', 'weather-low'), el('span', '최고 ' + Math.round(d.daily.temperature_2m_max[0]) + '°', 'weather-high'));
    weather.append(temps);
    note.textContent = (stale ? '저장된 예보 · ' : '업데이트 ') + new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul', hour:'2-digit', minute:'2-digit', hour12:false}).format(new Date(weatherAt));
  }
  function loadWeather(force) {
    if (busy || (!force && valid(weatherData) && Date.now() - weatherAt < 1800000)) return;
    busy = true; note.textContent = '날씨 불러오는 중…';
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 12000);
    fetch('https://api.open-meteo.com/v1/forecast?latitude=37.55&longitude=126.94&current=weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSeoul&forecast_days=1', {signal:controller.signal})
      .then(function (r) { if (!r.ok) throw new Error('weather'); return r.json(); })
      .then(function (data) {
        if (!valid(data)) throw new Error('weather data');
        weatherData = data; weatherAt = Date.now();
        try { localStorage.setItem('ocean-weather-mapo-v1', JSON.stringify({data:data, at:weatherAt})); } catch (e) {}
        renderWeather(false);
      }).catch(function () { renderWeather(true); })
      .finally(function () { clearTimeout(timeout); busy = false; });
  }
  try {
    var cached = JSON.parse(localStorage.getItem('ocean-weather-mapo-v1'));
    if (cached && valid(cached.data)) { weatherData = cached.data; weatherAt = Number(cached.at) || 0; renderWeather(true); }
  } catch (e) {}
  document.getElementById('weatherRefresh').addEventListener('click', function () { loadWeather(true); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) loadWeather(); });
  setInterval(function () { loadWeather(); }, 1800000);
  loadWeather();
})();
