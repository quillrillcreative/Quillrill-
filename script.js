/* ============================================================
   QUILLRILL — Premium Corporate Website
   script.js
   ============================================================ */

'use strict';

// ---- Custom Cursor ----
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale cursor on hover of interactive elements
document.querySelectorAll('a, button, .service-card, .product-card, .why-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursor.style.opacity = '0.6';
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.opacity = '1';
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ---- Navbar Scroll Effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ---- Hero Canvas — Animated Grid ----
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const GRID_SIZE = 60;
let gridOffset = 0;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vertical lines
  const cols = Math.ceil(canvas.width  / GRID_SIZE) + 2;
  const rows = Math.ceil(canvas.height / GRID_SIZE) + 2;

  ctx.strokeStyle = 'rgba(212,175,55,0.07)';
  ctx.lineWidth   = 1;

  for (let i = 0; i < cols; i++) {
    const x = (i * GRID_SIZE) - (gridOffset % GRID_SIZE);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let j = 0; j < rows; j++) {
    const y = (j * GRID_SIZE) - (gridOffset % GRID_SIZE);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Glow at centre
  const grad = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.55
  );
  grad.addColorStop(0,   'rgba(212,175,55,0.10)');
  grad.addColorStop(0.5, 'rgba(212,175,55,0.03)');
  grad.addColorStop(1,   'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Animated glow dots on intersections
  ctx.fillStyle = 'rgba(212,175,55,0.3)';
  const time = Date.now() * 0.001;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i * GRID_SIZE) - (gridOffset % GRID_SIZE);
      const y = (j * GRID_SIZE) - (gridOffset % GRID_SIZE);
      const alpha = Math.abs(Math.sin(time + i * 0.5 + j * 0.3)) * 0.5;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  gridOffset += 0.3;
  requestAnimationFrame(drawGrid);
}
drawGrid();

// ---- Floating Particles ----
const particleContainer = document.getElementById('particles');
const PARTICLE_COUNT = 50;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  createParticle();
}

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 3 + 1;
  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    animation-duration: ${Math.random() * 8 + 6}s;
    animation-delay: ${Math.random() * 6}s;
    opacity: ${Math.random() * 0.7};
  `;
  particleContainer.appendChild(p);
}

// ---- Scroll Reveal ----
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ---- Animated Counters ----
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step     = 16;
  const steps    = duration / step;
  let current    = 0;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, step);
}

// ---- Smooth Active Nav Link on Scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinkEls.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--gold)';
    }
  });
});

// ---- Contact Form ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate submission
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 1500);
  });
}

// ---- Tilt effect on product/service cards ----
const tiltCards = document.querySelectorAll('.product-card, .why-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width  / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -6;
    const rotY = ((x - centerX) / centerX) *  6;

    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

// ---- Parallax on hero ----
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const offset = window.scrollY;
    heroContent.style.transform = `translateY(${offset * 0.2}px)`;
    heroContent.style.opacity = Math.max(0, 1 - offset / 600);
  }
});

// ---- Service card glow on mouse ----
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(212,175,55,0.09) 0%, rgba(255,255,255,0.03) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ---- Entrance animations stagger ----
// Hero elements
const heroReveal = document.querySelectorAll('.hero-content .reveal');
heroReveal.forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.15}s`;
});

// ---- Process line connector animation ----
// We draw a pseudo SVG line dynamically between process dots for large screen
function buildProcessConnectors() {
  if (window.innerWidth < 768) return;
  const dots = document.querySelectorAll('.process-dot');
  if (dots.length < 2) return;
}
buildProcessConnectors();
window.addEventListener('resize', buildProcessConnectors);

// ---- Init: trigger hero reveals immediately ----
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-content .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 180);
  });
  document.querySelectorAll('.float-card').forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
    }, 800 + i * 300);
  });
});

// Init float cards hidden
document.querySelectorAll('.float-card').forEach(fc => {
  fc.style.opacity = '0';
  fc.style.transition = 'opacity 0.8s ease';
});
