/**
 * Desglose Pro - Landing Page Scripts
 * Responsive menu, smooth scroll, animations
 */

// Attendre que DOM la fin chaje
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. MENU TOGGLE POU MOBIL
    // ============================================
    
    // Kreye bouton menu toggle si li pa egziste
    const headerContent = document.querySelector('.header-content');
    const navLinks = document.querySelector('.nav-links');
    
    if (headerContent && navLinks && !document.querySelector('.menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.setAttribute('aria-label', 'Menu');
        menuToggle.innerHTML = '☰';
        
        // Mete bouton anvan nav-links
        headerContent.insertBefore(menuToggle, navLinks);
        
        // Ajoute event listener
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            // Chanje icon
            if (navLinks.classList.contains('show')) {
                menuToggle.innerHTML = '✕';
            } else {
                menuToggle.innerHTML = '☰';
            }
        });
    }
    
    // Fèmen menu lè yon link klike (sou mobil)
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const navLinksEl = document.querySelector('.nav-links');
                const menuToggleEl = document.querySelector('.menu-toggle');
                if (navLinksEl) navLinksEl.classList.remove('show');
                if (menuToggleEl) menuToggleEl.innerHTML = '☰';
            }
        });
    });
    
    // Fèmen menu lè w klike deyò (sou mobil)
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const header = document.querySelector('.header');
            const navLinksEl = document.querySelector('.nav-links');
            const menuToggleEl = document.querySelector('.menu-toggle');
            
            if (navLinksEl && navLinksEl.classList.contains('show')) {
                if (!header.contains(event.target)) {
                    navLinksEl.classList.remove('show');
                    if (menuToggleEl) menuToggleEl.innerHTML = '☰';
                }
            }
        }
    });
    
    // ============================================
    // 2. SMOOTH SCROLL POU ANKRE YO
    // ============================================
    
    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // 3. ACTIVE LINK NAN HEADER LÈ SEGMENT CHANJE
    // ============================================
    
    function updateActiveLink() {
        const sections = document.querySelectorAll('section, div[id]');
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionId = section.getAttribute('id');
            if (sectionId) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                const correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                
                if (correspondingLink && scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    correspondingLink.style.color = '#60a5fa';
                } else if (correspondingLink) {
                    correspondingLink.style.color = 'white';
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
    
    // ============================================
    // 4. ANIMATION LÈ ELEMAN VINI NAN VIEWPORT
    // ============================================
    
    const animateElements = document.querySelectorAll('.card, .feature-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // ============================================
    // 5. ALEKTAX DE ANNE POU FOOTER
    // ============================================
    
    const yearElement = document.querySelector('.footer p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        if (!yearElement.innerHTML.includes(currentYear)) {
            yearElement.innerHTML = yearElement.innerHTML.replace(/202[0-9]/, currentYear);
        }
    }
    
    // ============================================
    // 6. REDIMANSYONNMAN FENÊT - FÈMEN MENU
    // ============================================
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                const navLinksEl = document.querySelector('.nav-links');
                const menuToggleEl = document.querySelector('.menu-toggle');
                if (navLinksEl) navLinksEl.classList.remove('show');
                if (menuToggleEl) menuToggleEl.innerHTML = '☰';
            }
        }, 250);
    });
    
    // ============================================
    // 7. PREVANSYON POU FÒMULÈ VID (si genyen)
    // ============================================
    
    const externalLinks = document.querySelectorAll('a[href^="https://"]');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
    
    console.log('✅ Desglose Pro - Landing Page loaded');
});