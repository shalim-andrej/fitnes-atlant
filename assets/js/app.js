// «Атлант» — табы расписания, таймер акции, навигация, форма
(function () {
  'use strict';

  // Шапка
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('nav--solid', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Мобильное меню
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('nav--open');
      links.classList.toggle('nav__links--open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('nav--open');
        links.classList.remove('nav__links--open');
      }
    });
  }

  // Появление блоков
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('reveal--in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Табы расписания
  var tabNav = document.getElementById('tabNav');
  if (tabNav) {
    tabNav.addEventListener('click', function (e) {
      var btn = e.target.closest('.tab');
      if (!btn) return;
      tabNav.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('on'); });
      btn.classList.add('on');
      document.querySelectorAll('.tab-pane').forEach(function (p) {
        p.classList.toggle('on', p.id === btn.getAttribute('data-tab'));
      });
    });
  }

  // Таймер акции: до конца ближайшего воскресенья 23:59:59
  var timerBox = document.getElementById('timer');
  if (timerBox) {
    var eD = document.getElementById('tDays'), eH = document.getElementById('tHours'),
        eM = document.getElementById('tMin'), eS = document.getElementById('tSec');
    function deadline() {
      var now = new Date();
      var d = new Date(now);
      var day = now.getDay(); // 0 = вс
      var diff = (7 - day) % 7;
      d.setDate(now.getDate() + diff);
      d.setHours(23, 59, 59, 0);
      if (d <= now) d.setDate(d.getDate() + 7);
      return d;
    }
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      var left = deadline() - new Date();
      var s = Math.floor(left / 1000);
      eD.textContent = pad(Math.floor(s / 86400));
      eH.textContent = pad(Math.floor(s % 86400 / 3600));
      eM.textContent = pad(Math.floor(s % 3600 / 60));
      eS.textContent = pad(s % 60);
    }
    tick();
    setInterval(tick, 1000);
  }

  // Демо-форма
  var form = document.getElementById('bookForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add('form--done');
      form.querySelectorAll('input, select, textarea, button').forEach(function (el) { el.disabled = true; });
    });
  }
})();
