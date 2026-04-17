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
============================================================ */
const roles = {
  it: ['AI Engineer', 'Automation Specialist'],
  en: ['AI Engineer', 'Automation Specialist']
};

let typedEl = document.querySelector('.typed');
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

/* ============================================================
   BILINGUAL TOGGLE
============================================================ */
const translations = {
  /* NAV */
  'nav-exp':      { it: 'Esperienza', en: 'Experience' },
  'nav-proj':     { it: 'Progetti',   en: 'Projects' },
  'nav-skills':   { it: 'Competenze', en: 'Skills' },
  'nav-edu':      { it: 'Formazione', en: 'Education' },
  'nav-contact':  { it: 'Contatti',   en: 'Contact' },
  /* HERO */
  'hero-tag':     { it: 'AI Engineer · Bari, Italia', en: 'AI Engineer · Bari, Italy' },
  'hero-desc':    { it: 'Sviluppatore e ingegnere specializzato in intelligenza artificiale e automazione dei processi. Appassionato di tecnologia, VR e soluzioni innovative per le sfide aziendali moderne.',
                    en: 'Developer and engineer specializing in artificial intelligence and process automation. Passionate about technology, VR, and innovative solutions for modern business challenges.' },
  'btn-contact':  { it: 'Contattami', en: 'Contact me' },
  'stat-exp-l':   { it: 'Anni di esperienza', en: 'Years experience' },
  'stat-proj-l':  { it: 'Progetti completati', en: 'Projects built' },
  'stat-age-l':   { it: 'Anni',          en: 'Years old' },
  /* SECTIONS */
  's-exp':        { it: 'Dove ho lavorato',  en: 'Where I worked' },
  's-exp-sub':    { it: 'Il mio percorso professionale', en: 'My professional journey' },
  's-proj':       { it: 'Cosa ho costruito', en: 'What I built' },
  's-proj-sub':   { it: 'Progetti recenti e personali',  en: 'Recent and personal projects' },
  's-skills':     { it: 'Strumenti & Tecnologie', en: 'Tools & Technologies' },
  's-skills-sub': { it: 'Tecnologie con cui lavoro',  en: 'Technologies I work with' },
  's-edu':        { it: 'Percorso formativo', en: 'Education' },
  's-edu-sub':    { it: 'La mia formazione', en: 'My academic background' },
  's-contact':    { it: 'Parliamoci',         en: "Let's talk" },
  's-contact-sub':{ it: 'Sono sempre aperto a nuove opportunità.', en: "I'm always open to new opportunities." },
  /* EXPERIENCE */
  'tl-role-1':    { it: 'AI Engineer',                        en: 'AI Engineer' },
  'tl-role-2':    { it: 'Automation Specialist & Developer',  en: 'Automation Specialist & Developer' },
  'tl-loc-1':     { it: '📍 Bari, Italia',  en: '📍 Bari, Italy' },
  'tl-loc-2':     { it: '📍 Milano, Italia', en: '📍 Milan, Italy' },
  'tl-b2-1':      { it: 'Progettato e implementato workflow di automazione per ottimizzare i processi aziendali dei clienti.',
                    en: 'Designed and implemented automation workflows to optimize clients\' business processes.' },
  'tl-b2-2':      { it: 'Assicurata l\'operatività e le performance ottimali dei siti, gestendo diagnostica e risoluzione di bug.',
                    en: 'Maintained website uptime and optimal performance, handling diagnostics and bug fixes.' },
  'tl-b2-3':      { it: 'Analizzati i requisiti di business dei clienti, sviluppando funzionalità WordPress personalizzate.',
                    en: 'Analyzed client business requirements, developing custom WordPress features to meet specific needs.' },
  'tl-current':   { it: 'In corso', en: 'Current' },
  /* PROJECTS */
  'proj1-desc':   { it: 'Simulazione VR per l\'apprendimento del corretto smaltimento dei rifiuti. Il giocatore afferra oggetti e li smista nei contenitori giusti per guadagnare punti.',
                    en: 'VR simulation for learning correct waste sorting. The player grabs objects and places them in the correct bins to earn points.' },
  'proj2-desc':   { it: 'Workflow di content creation automatizzato tramite RSS: genera testi, immagini AI, metadati SEO e pubblica su più piattaforme.',
                    en: 'Automated content creation workflow via RSS: generates text, AI images, SEO metadata and publishes across multiple platforms.' },
  'proj3-desc':   { it: 'WebApp per la gestione di anagrafiche clienti e scadenze fiscali con notifiche automatiche via Email, PEC e Telegram.',
                    en: 'WebApp for managing client records and tax deadlines with automatic notifications via Email, PEC, and Telegram.' },
  'proj-link':    { it: 'Vedi su GitHub', en: 'View on GitHub' },
  /* SKILLS */
  'sg-lang':      { it: 'Linguaggi',   en: 'Languages' },
  'sg-frame':     { it: 'Framework & Tools', en: 'Frameworks & Tools' },
  'sg-langs-h':   { it: 'Lingue',      en: 'Languages Spoken' },
  /* EDU */
  'edu1-deg':     { it: 'Laurea Triennale in Ingegneria Informatica e Automazione — Livello EQF 6',
                    en: 'Bachelor\'s Degree in Computer Engineering & Automation — EQF Level 6' },
  'edu2-deg':     { it: 'Diploma in Sistemi Informativi Aziendali — Voto: 95/100',
                    en: 'High School Diploma in Business Information Systems — Grade: 95/100' },
  'edu3-deg':     { it: 'B1 Preliminary — Inglese livello B1 (tutte le abilità)',
                    en: 'B1 Preliminary — English level B1 (all skills)' },
  /* CONTACT */
  'c-email-l':    { it: 'Email',     en: 'Email' },
  'c-phone-l':    { it: 'Telefono',  en: 'Phone' },
  'c-github-l':   { it: 'GitHub',    en: 'GitHub' },
  'c-linkedin-l': { it: 'LinkedIn',  en: 'LinkedIn' },
  /* FOOTER */
  'footer-txt':   { it: '© 2026 Alessandro Miniello — Tutti i diritti riservati',
                    en: '© 2026 Alessandro Miniello — All rights reserved' },
  'badge-status-txt': { it: 'Disponibile per opportunità', en: 'Available for opportunities' },
  /* FORM */
  'f-name':    { it: 'Il tuo Nome',    en: 'Your Name' },
  'f-mail':    { it: 'La tua Email',   en: 'Your Email' },
  'f-msg':     { it: 'Come posso aiutarti?', en: 'How can I help you?' },
  'f-btn':     { it: 'Invia Messaggio', en: 'Send Message' },
  'f-success': { it: '✓ Messaggio inviato con successo!', en: '✓ Message sent successfully!' },
  'f-error':   { it: '✕ Errore nell\'invio. Riprova.', en: '✕ Error sending. Try again.' },
};

let currentLang = 'it';

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Traduzione testi standard (textContent)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[key] && translations[key][lang]) {
      el.textContent = translations[key][lang];
    }
  });

  // NUOVO: Traduzione Placeholder
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (translations[key] && translations[key][lang]) {
      el.setAttribute('placeholder', translations[key][lang]);
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

if (document.getElementById('contact-form')) {
  window.formspree = window.formspree || function () { (formspree.q = formspree.q || []).push(arguments); };
  formspree('initForm', { 
    formElement: '#contact-form', 
    formId: 'myklwnwd',
    onSuccess: function() {
      document.getElementById('contact-form').style.display = 'none';
    }
  });
}