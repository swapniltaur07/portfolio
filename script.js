// ===== MOBILE MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('nav a');
const navOverlay = document.getElementById('nav-overlay');

function openMenu() {
    hamburger.classList.add('active');
    nav.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Toggle menu when hamburger is clicked
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (nav.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => closeMenu());
});

// Close menu on overlay click
navOverlay.addEventListener('click', () => closeMenu());

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
    }
});


// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById('scroll-progress');

function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';
}


// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('back-to-top');

function handleScroll() {
    updateScrollProgress();

    // Back to top visibility
    if (window.scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Header shadow on scroll
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });


// ===== FADE-IN ON SCROLL (IntersectionObserver) =====
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Staggered delay for children
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));


// ===== SKILL CARDS STAGGER ANIMATION =====
const skillCards = document.querySelectorAll('.skill-card');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            skillCards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, i * 80);
            });
            skillObserver.disconnect();
        }
    });
}, { threshold: 0.1 });

// Set initial state
skillCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);


// ===== PROJECT CARDS STAGGER =====
const projectCards = document.querySelectorAll('.project-card');

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            projectCards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, i * 120);
            });
            projectObserver.disconnect();
        }
    });
}, { threshold: 0.1 });

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

const projectsSection = document.getElementById('projects');
if (projectsSection) projectObserver.observe(projectsSection);


// ===== TIMELINE EVENTS ANIMATION =====
const timelineEvents = document.querySelectorAll('.event');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
            timelineObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

timelineEvents.forEach((event, i) => {
    event.style.opacity = '0';
    event.style.transform = 'translateX(-20px)';
    event.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    timelineObserver.observe(event);
});


// ===== CONTACT FORM HANDLING =====
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) validateField(input);
        });
    });

    function validateField(field) {
        const value = field.value.trim();

        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setFieldError(field, 'Please enter a valid email address.');
                return false;
            }
        } else if (!value) {
            setFieldError(field, 'This field is required.');
            return false;
        }

        clearFieldError(field);
        return true;
    }

    function setFieldError(field, msg) {
        field.classList.add('invalid');
        field.style.borderColor = '#c0392b';

        let errEl = field.parentElement.querySelector('.field-error');
        if (!errEl) {
            errEl = document.createElement('span');
            errEl.className = 'field-error';
            errEl.style.cssText = 'color:#c0392b; font-size:0.75rem; margin-top:3px;';
            field.parentElement.appendChild(errEl);
        }
        errEl.textContent = msg;
    }

    function clearFieldError(field) {
        field.classList.remove('invalid');
        field.style.borderColor = '';

        const errEl = field.parentElement.querySelector('.field-error');
        if (errEl) errEl.remove();
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all required fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) isValid = false;
        });

        if (!isValid) return;

        // Simulate submission (replace with actual fetch/EmailJS/etc.)
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        btn.disabled = true;
        btn.textContent = 'Sending…';
        btn.style.opacity = '0.7';

        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.opacity = '1';

            showFormMsg('Sorry, Something Went Wrong!, View Resume To Contact.');
            contactForm.reset();
        }, 1500);
    });

    function showFormMsg(type, text) {
        let msgEl = contactForm.querySelector('.form-msg');
        if (!msgEl) {
            msgEl = document.createElement('p');
            msgEl.className = 'form-msg';
            contactForm.appendChild(msgEl);
        }
        msgEl.className = `form-msg ${type}`;
        msgEl.textContent = text;

        setTimeout(() => {
            msgEl.className = 'form-msg';
            msgEl.textContent = '';
        }, 5000);
    }
}


// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});


// ===== HERO TEXT TYPING EFFECT (role badge) =====
// Subtle typing indicator on the role badge
const roleBadge = document.querySelector('.role');
if (roleBadge) {
    const originalText = roleBadge.textContent;
    roleBadge.textContent = '';
    let i = 0;

    function typeLetter() {
        if (i < originalText.length) {
            roleBadge.textContent += originalText[i];
            i++;
            setTimeout(typeLetter, 55);
        }
    }

    // Start after a short delay (after slideUp animation)
    setTimeout(typeLetter, 800);
}


// ===== INIT =====
handleScroll();

setActiveNavLink();
