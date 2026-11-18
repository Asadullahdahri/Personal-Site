(function () {
  var root = document.documentElement;

  // Theme toggle (dark default, remembers choice)
  var toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Mobile menu
  var menuBtn = document.getElementById('menu-btn');
  var links = document.getElementById('nav-links');
  function setMenu(open) {
    links.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Nav border on scroll
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll + active nav link
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    var navLinks = links.querySelectorAll('a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Typewriter role rotator
  var rot = document.querySelector('.rotator');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rot && !reduce) {
    var words = JSON.parse(rot.getAttribute('data-words'));
    var wi = 0, ci = words[0].length, deleting = true;
    (function tick() {
      var w = words[wi];
      ci += deleting ? -1 : 1;
      rot.textContent = w.slice(0, ci);
      var delay = deleting ? 45 : 85;
      if (!deleting && ci === w.length) { deleting = true; delay = 1800; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    })();
  }

  // Contact form -> opens the visitor's email app with the message filled in
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      var bad = !el.checkValidity();
      el.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { note.textContent = 'Please fill in every field with a valid email.'; return; }
    var d = form.elements;
    var body = d.message.value + '\n\n— ' + d.name.value + ' (' + d.email.value + ')';
    window.location.href = 'mailto:contact@asadullahdahri.com?subject=' +
      encodeURIComponent(d.subject.value) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app…';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
