/**
 * wow-animations.js
 * Portfolio WOW! Animations — Younes Shimi
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. PRELOADER
    ============================================================ */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 750);
            }, 900);
        });
        // Safety fallback
        setTimeout(() => {
            if (preloader && !preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 750);
            }
        }, 4000);
    }

    /* ============================================================
       2. SCROLL PROGRESS BAR
    ============================================================ */
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (scrollTop / docHeight * 100) + '%';
        }, { passive: true });
    }

    /* ============================================================
       3. CUSTOM CURSOR
    ============================================================ */
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mouseX = -200, mouseY = -200;
    let ringX = -200, ringY = -200;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    }, { passive: true });

    (function animateRing() {
        ringX += (mouseX - ringX) * 0.13;
        ringY += (mouseY - ringY) * 0.13;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    })();

    // Hover state on interactive elements
    function bindCursorHover() {
        document.querySelectorAll('a, button, .ticket, .info-item, .social-icon, .nav-link, .info-chip, .education-card').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
        });
    }
    bindCursorHover();
    // Re-bind after partials load
    document.addEventListener('partialsLoaded', bindCursorHover);

    /* ============================================================
       4. SCROLL REVEAL  (IntersectionObserver)
    ============================================================ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    function observeReveals() {
        document.querySelectorAll('[data-reveal]').forEach(el => {
            revealObserver.observe(el);
        });
    }
    observeReveals();
    // Re-run when all partials are loaded
    document.addEventListener('partialsLoaded', observeReveals);

    /* ============================================================
       5. SECTION HEADING UNDERLINE
    ============================================================ */
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                headingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    function observeHeadings() {
        document.querySelectorAll('.section-heading-line').forEach(el => headingObserver.observe(el));
    }
    observeHeadings();
    document.addEventListener('partialsLoaded', observeHeadings);

    /* ============================================================
       6. NAVBAR SCROLL EFFECT
    ============================================================ */
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (!navbar) return;
        navbar.classList.toggle('nav-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ============================================================
       7. ACTIVE NAV HIGHLIGHT ON SCROLL
    ============================================================ */
    function setupActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        if (!sections.length || !navLinks.length) return;

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                    });
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(s => sectionObserver.observe(s));
    }
    setTimeout(setupActiveNav, 800);

    /* Hook all deferred init on partials fully loaded */
    document.addEventListener('partialsLoaded', () => {
        setupActiveNav();
        setupTypewriter();
        spawnParticles();
        staggerSkills();
        staggerTimeline();
        staggerEdu();
        staggerChips();
        setupContactForm();
        injectTicketLabels();
    });

    /* ============================================================
       8. TYPEWRITER EFFECT
    ============================================================ */
    function setupTypewriter() {
        const el = document.querySelector('.js-typewriter');
        if (!el) return;

        const words = (el.dataset.words || '').split('|').filter(Boolean);
        if (!words.length) return;

        let wordIdx = 0, charIdx = 0, deleting = false;

        function type() {
            const word = words[wordIdx % words.length];
            if (!deleting) {
                el.textContent = word.slice(0, ++charIdx);
                if (charIdx === word.length) {
                    deleting = true;
                    setTimeout(type, 2000);
                    return;
                }
            } else {
                el.textContent = word.slice(0, --charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    wordIdx++;
                }
            }
            setTimeout(type, deleting ? 55 : 105);
        }
        type();
    }

    /* ============================================================
       9. FLOATING PARTICLES IN HERO
    ============================================================ */
    function spawnParticles() {
        const hero = document.querySelector('.home-2');
        if (!hero || hero.querySelector('.hero-particles')) return;

        const container = document.createElement('div');
        container.className = 'hero-particles';
        hero.prepend(container);

        const colors = ['#2fb4ae', '#FF7F51', '#8060cf', '#14c5a2', '#49c6e5'];
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'hero-particle';
            const size = Math.random() * 14 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            Object.assign(p.style, {
                width: size + 'px',
                height: size + 'px',
                background: color,
                left: Math.random() * 100 + '%',
                animationDuration: (Math.random() * 16 + 12) + 's',
                animationDelay: (Math.random() * 12) + 's',
                opacity: Math.random() * 0.12 + 0.04,
                filter: 'blur(' + (size > 10 ? 1 : 0) + 'px)'
            });
            container.appendChild(p);
        }
    }

    /* ============================================================
       10. STAGGERED REVEAL FOR SKILL CARDS
    ============================================================ */
    function staggerSkills() {
        document.querySelectorAll('.info-item:not([data-reveal])').forEach((card, i) => {
            card.setAttribute('data-reveal', 'scale');
            card.setAttribute('data-delay', String(Math.min(i * 80, 500)));
            revealObserver.observe(card);
        });
    }

    /* ============================================================
       11. STAGGERED REVEAL FOR TIMELINE ITEMS
    ============================================================ */
    function staggerTimeline() {
        document.querySelectorAll('.timeline-item:not([data-reveal])').forEach((item, i) => {
            item.setAttribute('data-reveal', 'left');
            item.setAttribute('data-delay', String(Math.min(i * 100, 500)));
            revealObserver.observe(item);
        });
    }

    /* ============================================================
       12. STAGGERED REVEAL FOR EDUCATION CARDS
    ============================================================ */
    function staggerEdu() {
        document.querySelectorAll('.education-card:not([data-reveal])').forEach((card, i) => {
            card.setAttribute('data-reveal', 'scale');
            card.setAttribute('data-delay', String(i * 150));
            revealObserver.observe(card);
        });
    }

    /* ============================================================
       13. STAGGERED REVEAL FOR INFO CHIPS
    ============================================================ */
    function staggerChips() {
        document.querySelectorAll('.info-chip:not([data-reveal])').forEach((chip, i) => {
            chip.setAttribute('data-reveal', '');
            chip.setAttribute('data-delay', String(i * 80));
            revealObserver.observe(chip);
        });
    }

    /* ============================================================
       14. CONTACT FORM — AJAX via Formspree
    ============================================================ */
    function setupContactForm() {
        const form = document.querySelector('.custom-form form');
        if (!form) return;
        const action = form.getAttribute('action') || '';
        if (!action.includes('formspree')) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submitBnt');
            const originalVal = btn.value;
            btn.value = 'Sending…';
            btn.disabled = true;

            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });
                if (res.ok) {
                    btn.value = '✓ Message sent!';
                    btn.style.background = '#14c5a2';
                    form.reset();
                } else {
                    throw new Error('server');
                }
            } catch {
                btn.value = '✗ Error — please retry';
                btn.style.background = '#c71f1f';
            } finally {
                btn.disabled = false;
                setTimeout(() => {
                    btn.value = originalVal;
                    btn.style.background = '';
                }, 3500);
            }
        });
    }

    /* ============================================================
       15. BADGE / TICKET TOOLTIP LABELS
    ============================================================ */
    function injectTicketLabels() {
        document.querySelectorAll('.ticket img[alt]').forEach(img => {
            if (img.title) return;
            img.title = img.alt;
        });
    }

    /* ============================================================
       16. SMOOTH SCROLL FOR NAV LINKS
    ============================================================ */
    document.addEventListener('click', e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* ============================================================
       17. COUNTER ANIMATION (if counter section exists)
    ============================================================ */
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const cObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const end = parseInt(el.dataset.count, 10);
                const dur = 1600;
                const step = end / (dur / 16);
                let current = 0;
                const timer = setInterval(() => {
                    current = Math.min(current + step, end);
                    el.textContent = Math.floor(current);
                    if (current >= end) clearInterval(timer);
                }, 16);
                cObserver.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(c => cObserver.observe(c));
    }
    setTimeout(animateCounters, 800);

});
