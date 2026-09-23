(function () {
  'use strict';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle (saved in localStorage)
  var themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Mobile menu
  var menuBtn = document.getElementById('menu-toggle');
  var navLinks = document.getElementById('nav-links');
  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Nav shadow + scroll progress
  var nav = document.getElementById('nav');
  var progress = document.getElementById('progress');
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the nav link for the section in view
  var links = {};
  navLinks.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && links[entry.target.id]) {
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        links[entry.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { sectionObserver.observe(s); });

  // Scroll reveal with a small stagger
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
        var counter = entry.target.querySelectorAll('[data-count]');
        counter.forEach(countUp);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
    el.style.transitionDelay = Math.min(siblings.indexOf(el) * 90, 450) + 'ms';
    revealObserver.observe(el);
  });

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduceMotion) { el.textContent = target; return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / 1200, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Typing effect
  var phrases = ['software that solves real problems.', 'secure Linux tooling.', 'IT infrastructure that scales.', 'with Python, SQL and Java.'];
  var typed = document.getElementById('typed');
  if (reduceMotion) {
    typed.textContent = phrases[0];
  } else {
    var pi = 0, ci = 0, deleting = false;
    (function tick() {
      var word = phrases[pi];
      ci += deleting ? -1 : 1;
      typed.textContent = word.slice(0, ci);
      var delay = deleting ? 35 : 70;
      if (!deleting && ci === word.length) { deleting = true; delay = 1600; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
      setTimeout(tick, delay);
    })();
  }

  // Project filters
  var filterBtns = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('.project');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      projects.forEach(function (p) {
        var cats = p.getAttribute('data-cat').split(' ');
        p.classList.toggle('hide', f !== 'all' && cats.indexOf(f) === -1);
      });
    });
  });

  // 3D tilt + spotlight on project cards (pointer devices only)
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 8) + 'deg) rotateY(' + ((x - 0.5) * 10) + 'deg) translateY(-4px)';
        card.style.setProperty('--mx', (x * 100) + '%');
        card.style.setProperty('--my', (y * 100) + '%');
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  // Particle network background
  var canvas = document.getElementById('particles');
  var ctx = canvas.getContext('2d');
  var dots = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var mouse = { x: -9999, y: -9999 };
  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.min(Math.floor((w * h) / 14000), 110);
    dots = [];
    for (var i = 0; i < count; i++) {
      dots.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.6 });
    }
  }
  function color(a) {
    return root.getAttribute('data-theme') === 'light' ? 'rgba(79,70,229,' + a + ')' : 'rgba(165,180,252,' + a + ')';
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      var mdx = d.x - mouse.x, mdy = d.y - mouse.y, md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 120) { d.x += mdx / md * 1.2; d.y += mdy / md * 1.2; }
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fillStyle = color(0.7); ctx.fill();
      for (var j = i + 1; j < dots.length; j++) {
        var e = dots[j], dx = d.x - e.x, dy = d.y - e.y, dist = dx * dx + dy * dy;
        if (dist < 13000) {
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y);
          ctx.strokeStyle = color(0.18 * (1 - dist / 13000)); ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  var hero = document.getElementById('home');
  hero.addEventListener('mousemove', function (e) { var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener('resize', resize);
  resize();
  draw();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
