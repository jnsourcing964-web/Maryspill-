// ===== WHATSAPP NUMBER (UPDATED) =====
const WA_NUMBER = '2347064492313';  // Remove + and spaces

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});

// ===== MOBILE MENU TOGGLE (FIXED: icon resets properly) =====
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const closeMobileNav = document.getElementById('closeMobileNav');

function openMobileMenu() {
    mobileNav.classList.add('active');
    menuToggle.innerHTML = '<i class="fas fa-times"></i>';
}

function closeMobileMenu() {
    mobileNav.classList.remove('active');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

if (closeMobileNav) {
    closeMobileNav.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when any link inside it is clicked
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// ===== ACTIVE NAVIGATION LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
    else if (currentPage === 'index.html' && href === 'index.html') link.classList.add('active');
});

// ===== BOOKING FORM (homepage) =====
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    if (checkIn) {
        checkIn.min = today.toISOString().split('T')[0];
        checkIn.value = tomorrow.toISOString().split('T')[0];
    }
    if (checkOut) {
        const threeDays = new Date(tomorrow);
        threeDays.setDate(threeDays.getDate() + 3);
        checkOut.min = tomorrow.toISOString().split('T')[0];
        checkOut.value = threeDays.toISOString().split('T')[0];
    }

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const guests = document.getElementById('guests') ? document.getElementById('guests').value : '2';
        const suite = document.getElementById('suiteType') ? document.getElementById('suiteType').value : 'Executive Suite';
        const msg = `Hello Merry Spill! I would like to book a room.%0A%0A📅 Check-in: ${checkIn.value}%0A📅 Check-out: ${checkOut.value}%0A👥 Guests: ${guests}%0A🛏️ Suite: ${suite}%0A%0APlease confirm availability and price. Thank you!`;
        window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
    });
}

// ===== ALL BOOK NOW BUTTONS =====
document.querySelectorAll('.book-now-btn, .book-room, .reserve-table, .book-wellness').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let message = 'Hello Merry Spill! I am interested in booking.';
        if (btn.classList.contains('book-room')) {
            const room = btn.closest('.room-card')?.querySelector('h3')?.innerText || btn.closest('.room-detail')?.querySelector('h2')?.innerText || 'a suite';
            message = `Hello Merry Spill! I am interested in booking ${room}. Please let me know availability.`;
        } else if (btn.classList.contains('reserve-table')) {
            message = 'Hello Merry Spill! I would like to reserve a table for dining. Please let me know available times.';
        } else if (btn.classList.contains('book-wellness')) {
            message = 'Hello Merry Spill! I would like to book a wellness treatment. Please share available slots.';
        }
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    });
});

// ===== CONTACT FORM (Formspree) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        try {
            const response = await fetch('https://formspree.io/f/xqapjlrn', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                alert('Thank you! Your message has been sent. We will reply within 24 hours.');
                contactForm.reset();
            } else throw new Error();
        } catch (error) {
            alert('Failed to send. Please call us directly at 0706 449 2313.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== FOOTER YEAR =====
const yearSpan = document.getElementById('currentYear');
if (yearSpan) yearSpan.innerText = new Date().getFullYear();

// ===== TESTIMONIAL SLIDER (homepage only) =====
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dotsDiv = document.getElementById('testimonialDots');
let current = 0;

if (testimonials.length && dotsDiv) {
    for (let i = 0; i < testimonials.length; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showTestimonial(i));
        dotsDiv.appendChild(dot);
    }
    function showTestimonial(i) {
        testimonials.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        testimonials[i].classList.add('active');
        document.querySelectorAll('.dot')[i].classList.add('active');
        current = i;
    }
    if (prevBtn) prevBtn.addEventListener('click', () => showTestimonial((current - 1 + testimonials.length) % testimonials.length));
    if (nextBtn) nextBtn.addEventListener('click', () => showTestimonial((current + 1) % testimonials.length));
}

// ===== GALLERY PAGE (if gallery grid exists) =====
const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid) {
    const galleryImages = [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600'
    ];
    galleryGrid.innerHTML = galleryImages.map(src => `<div class="room-card"><img src="${src}" alt="Merry Spill" style="height:260px;"><div class="content"><p>Merry Spill Luxury</p></div></div>`).join('');
}