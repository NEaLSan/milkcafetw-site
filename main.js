/* ===== 網站狀態設定（開幕時只改這裡）===== */
var HERO_STATUS = "即將";   // 大標紅字：開幕前「即將」，開幕改「正式」
var IS_OPEN = false;        // 開幕後改 true：導覽列按鈕變「線上訂位」
var BOOKING_URL = "";       // 【待確認】開幕後的訂位網址（IS_OPEN 為 true 且有網址才會套用）
var IG_URL = "https://www.instagram.com/milkcafetw/";
/* 【待確認】開幕日期，ISO 格式含時區，例如 "2026-12-20T11:00:00+08:00"；留空顯示「開幕日期即將公布」 */
var OPENING_DATE = "";

(function () {
  var $ = function (s) { return document.querySelector(s); };
  $('#yr').textContent = new Date().getFullYear();
  $('#hero-status').textContent = HERO_STATUS;

  // 導覽列主按鈕
  document.querySelectorAll('.js-booking').forEach(function (a) {
    var open = IS_OPEN && BOOKING_URL;
    a.href = open ? BOOKING_URL : IG_URL;
    a.querySelector('.js-booking-label').textContent = open ? '線上訂位' : '追蹤開幕消息';
  });

  // 手機選單
  var btn = $('.menu-btn'), panel = $('#nav-panel');
  btn.addEventListener('click', function () { var o = panel.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { panel.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }); });

  // 開幕倒數
  var t = OPENING_DATE ? new Date(OPENING_DATE).getTime() : NaN;
  if (!isNaN(t)) {
    var run = $('#cd-run'), tbd = $('#cd-tbd'), pad = function (n) { return String(n).padStart(2, '0'); };
    run.hidden = false; tbd.hidden = true;
    var tick = function () {
      var s = Math.floor((t - Date.now()) / 1000);
      if (s <= 0) { run.hidden = true; tbd.hidden = false; tbd.textContent = '我們開幕啦！歡迎光臨'; clearInterval(iv); return; }
      $('#cd-d').textContent = Math.floor(s / 86400); $('#cd-h').textContent = pad(Math.floor(s % 86400 / 3600));
      $('#cd-m').textContent = pad(Math.floor(s % 3600 / 60)); $('#cd-s').textContent = pad(s % 60);
    };
    var iv = setInterval(tick, 1000); tick();
  }

  // 輪播：原生捲動＋scroll-snap（支援觸控滑動），箭頭與圓點
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.car-track'), cards = [].slice.call(track.children), dotsBox = root.querySelector('.car-dots');
    var dots = cards.map(function (c, i) {
      var d = document.createElement('button'); d.type = 'button'; d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', '第 ' + (i + 1) + ' 項：' + c.querySelector('h3').textContent);
      d.addEventListener('click', function () { go(i); }); dotsBox.appendChild(d); return d;
    });
    var cur = 0;
    function go(i) {
      i = (i + cards.length) % cards.length; var c = cards[i];
      track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
    }
    function update() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = 1e9;
      cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
      cur = best;
      cards.forEach(function (c, i) { c.classList.toggle('is-active', i === best); });
      dots.forEach(function (d, i) { d.setAttribute('aria-selected', i === best); });
    }
    root.querySelector('.prev').addEventListener('click', function () { go(cur - 1); });
    root.querySelector('.next').addEventListener('click', function () { go(cur + 1); });
    track.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(cur - 1); if (e.key === 'ArrowRight') go(cur + 1); });
    var raf; track.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', function () { var c = cards[cur]; track.scrollLeft = c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2; });
    // 預設置中中間那張（三張同時完整可見，與設計稿一致）
    var start = Math.floor((cards.length - 1) / 2);
    requestAnimationFrame(function () { var c = cards[start]; track.scrollLeft = c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2; update(); });
  });
})();
