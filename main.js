/* ============================================================
   CURSOR
============================================================ */
const dot    = document.querySelector('.cursor-dot');
const circle = document.querySelector('.cursor-circle');

let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animCursor() {
  cx += (mx - cx) * 0.14;
  cy += (my - cy) * 0.14;
  circle.style.left = cx + 'px';
  circle.style.top  = cy + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, input, textarea, .proj-card, .skill-chip, .contact-item, .edu-card').forEach(el => {
  el.addEventListener('mouseenter', () => circle.classList.add('hover'));
  el.addEventListener('mouseleave', () => circle.classList.remove('hover'));
});

/* ============================================================
   SCROLL PROGRESS BAR
============================================================ */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  progressBar.style.width = (pct * 100) + '%';
});

/* ============================================================
   NAV SCROLL SHRINK
============================================================ */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ============================================================
   PARTICLE CANVAS BACKGROUND
============================================================ */
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = 70;
const particles = [];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.r  = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56,189,248,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

const LINK_DIST = 130;
function drawLinks() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < LINK_DIST) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(56,189,248,${0.06 * (1 - dist/LINK_DIST)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLinks();
  requestAnimationFrame(animate);
}
animate();

/* ============================================================
   3D TILT PROFILE CARD
============================================================ */
const profileCard = document.querySelector('.profile-card');
if (profileCard) {
  profileCard.addEventListener('mousemove', e => {
    const r = profileCard.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    profileCard.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`;
  });
  profileCard.addEventListener('mouseleave', () => {
    profileCard.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale3d(1,1,1)';
  });
}

/* ============================================================
   TYPED TEXT EFFECT
   Reads the page language from <html lang="...">
============================================================ */
const roles = {
  it: ['AI Engineer', 'Automation Specialist'],
  en: ['AI Engineer', 'Automation Specialist']
};

const typedEl = document.querySelector('.typed');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeEffect() {
  if (!typedEl) return;
  const lang  = document.documentElement.lang || 'it';
  const words = roles[lang] || roles['it'];
  const word  = words[roleIndex % words.length];

  if (!deleting) {
    typedEl.textContent = word.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === word.length) {
      deleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
    setTimeout(typeEffect, 80);
  } else {
    typedEl.textContent = word.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      roleIndex++;
      setTimeout(typeEffect, 400);
      return;
    }
    setTimeout(typeEffect, 40);
  }
}
setTimeout(typeEffect, 1200);

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   ANIMATED STAT COUNTERS
============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 35);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ============================================================
   LANGUAGE BARS ANIMATION
============================================================ */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.lang-bar').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.langs-grid').forEach(el => barObserver.observe(el));
