// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. Navbar Scroll Effect
    // ============================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============================================
    // 2. Mobile Menu Toggle
    // ============================================
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    let isMobileMenuOpen = false;
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            isMobileMenuOpen = !isMobileMenuOpen;
            
            if (isMobileMenuOpen) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-primary)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid var(--border-color)';
                
                navActions.style.display = 'flex';
                navActions.style.position = 'absolute';
                navActions.style.top = 'calc(100% + 180px)';
                navActions.style.left = '0';
                navActions.style.width = '100%';
                navActions.style.background = 'var(--bg-primary)';
                navActions.style.padding = '1rem 2rem 2rem';
                navActions.style.justifyContent = 'center';
            } else {
                navLinks.removeAttribute('style');
                navActions.removeAttribute('style');
            }
        });
    }

    // ============================================
    // 3. Smooth Scroll to Anchors
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (isMobileMenuOpen && mobileBtn) {
                    mobileBtn.click();
                }
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // 4. Intersection Observer – Fade-Up Animations
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedItems = document.querySelectorAll('.feature-card, .testimonial-card, .why-content, .ai-card');
    
    animatedItems.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.07}s`;
        observer.observe(card);
    });

    // ============================================
    // 5. Consultation Modal
    // ============================================
    const modal = document.getElementById('consultModal');
    const modalClose = document.getElementById('modalClose');
    const openModalBtns = document.querySelectorAll('.open-modal');
    const consultForm = document.getElementById('consultForm');
    const formSuccess = document.getElementById('formSuccess');
    const formSubmitBtn = document.getElementById('formSubmitBtn');

    function openModal() {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        // Reset form state
        if (consultForm) consultForm.style.display = '';
        if (formSuccess) formSuccess.style.display = 'none';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close on overlay click (outside modal container)
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // ============================================
    // 6. Consultation Form Submission (mailto/fetch)
    // ============================================
    if (consultForm) {
        consultForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic validation
            let valid = true;
            const requiredFields = consultForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                field.classList.remove('error');
                if (!field.value.trim()) {
                    field.classList.add('error');
                    valid = false;
                }
            });

            if (!valid) return;

            // Collect form data
            const data = {
                name: document.getElementById('cf-name').value.trim(),
                company: document.getElementById('cf-company').value.trim(),
                email: document.getElementById('cf-email').value.trim(),
                phone: document.getElementById('cf-phone').value.trim(),
                country: document.getElementById('cf-country').value,
                industry: document.getElementById('cf-industry').value,
                questions: document.getElementById('cf-questions').value.trim(),
            };

            // Show loading state
            const btnText = formSubmitBtn.querySelector('.btn-text');
            const btnSpinner = formSubmitBtn.querySelector('.btn-spinner');
            formSubmitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnSpinner) btnSpinner.style.display = '';

            try {
                // Try to POST via fetch to a mailto: compatible endpoint
                // Falls back to a mailto: link if fetch is unavailable
                const subject = encodeURIComponent(`BRDS Consultation Request – ${data.name} (${data.company})`);
                const body = encodeURIComponent(
                    `Name: ${data.name}\n` +
                    `Company: ${data.company}\n` +
                    `Email: ${data.email}\n` +
                    `Phone: ${data.phone || 'N/A'}\n` +
                    `Country: ${data.country}\n` +
                    `Industry/Role: ${data.industry}\n\n` +
                    `Questions/Notes:\n${data.questions || 'None provided'}`
                );

                // Attempt Formspree or similar (no-backend approach with mailto fallback)
                // Open mailto as fallback that always works
                const mailtoLink = `mailto:info@imisshtml.com?subject=${subject}&body=${body}`;
                window.location.href = mailtoLink;

                // Show success after brief delay
                await new Promise(resolve => setTimeout(resolve, 600));
                consultForm.style.display = 'none';
                formSuccess.style.display = 'block';

            } catch (err) {
                console.error('Form submission error:', err);
            } finally {
                formSubmitBtn.disabled = false;
                if (btnText) btnText.style.display = '';
                if (btnSpinner) btnSpinner.style.display = 'none';
            }
        });

        // Remove error class on input
        consultForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => field.classList.remove('error'));
        });
    }
});
