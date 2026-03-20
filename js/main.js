'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       1. Preloader (Loading Screen)
    ============================================== */
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 300); // 300ms delay for smooth logo presentation
    });

    /* ==============================================
       2. Sticky Header & Mobile Menu
    ============================================== */
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const allLinks = document.querySelectorAll('.nav-link, .nav-cta');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    // Sticky effect
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Header
        header?.classList.toggle('scrolled', scrollY > 30);
        
        // Scroll To Top Btn
        scrollTopBtn?.classList.toggle('visible', scrollY > 400);

        // Highlight active nav section
        highlightActiveSection(scrollY);
    }, { passive: true });

    // Mobile Toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            
            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars', !isActive);
            icon.classList.toggle('fa-xmark', isActive);
            
            // Prevent body scroll when menu open
            document.body.style.overflow = isActive ? 'hidden' : '';
            
            // Accessibility
            mobileMenuBtn.setAttribute('aria-expanded', isActive);
        });

        // Close on link click
        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close when clicking outside (mobile)
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    /* ==============================================
       3. Active Section Grouping
    ============================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveSection(scrollY) {
        let currentId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // If scroll is past the top of section minus header height (approx 100)
            if (scrollY >= (sectionTop - 150)) {
                currentId = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    }

    /* ==============================================
       4. Scroll Reveal Animations
    ============================================== */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px', threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback
        revealElements.forEach(el => el.classList.add('active'));
    }

    /* ==============================================
       5. Stats Counter Animation
    ============================================== */
    const statsSection = document.querySelector('.stats-section');
    const statCounters = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    if (statsSection && statCounters.length > 0 && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    
                    statCounters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000;
                        const frames = 60; // 60fps
                        const step = target / (duration / (1000 / frames));
                        let current = 0;

                        const updateCounter = () => {
                            current += step;
                            if (current < target) {
                                counter.innerText = Math.ceil(current).toLocaleString('ar-EG');
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.innerText = target.toLocaleString('ar-EG') + '+';
                            }
                        };
                        requestAnimationFrame(updateCounter);
                    });
                    
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    /* ==============================================
       6. Tabs (Vision / Mission)
    ============================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active to current
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    /* ==============================================
       7. FAQ Accordion
    ============================================== */
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        const body = acc.querySelector('.accordion-body');

        header.addEventListener('click', () => {
            const isOpen = acc.classList.contains('active');

            // Close all other accordions first (optional, comment out for multi-open)
            accordions.forEach(otherAcc => {
                otherAcc.classList.remove('active');
                otherAcc.querySelector('.accordion-body').style.maxHeight = null;
            });

            if (!isOpen) {
                acc.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    // Open first accordion by default
    if (accordions.length > 0) {
        accordions[0].classList.add('active');
        const firstBody = accordions[0].querySelector('.accordion-body');
        firstBody.style.maxHeight = firstBody.scrollHeight + "px";
    }

    /* ==============================================
       8. Registration Form Mock Submit
    ============================================== */
    const enrollmentForm = document.getElementById('enrollmentForm');
    const formResponse = document.getElementById('formResponseMessage');

    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = enrollmentForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;

            // Simulate fetch request latency (1.5 seconds)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success state
            formResponse.style.display = 'block';
            formResponse.style.color = '#25d366'; // Success Green
            formResponse.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>تم استلام طلبك بنجاح!</strong><br><span style="font-size:0.9rem;">سيتم مراجعة البيانات والتواصل معك قريباً للترتيب.</span>';
            
            // Reset form & button
            enrollmentForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;

            // Hide message after 8 seconds
            setTimeout(() => {
                formResponse.style.display = 'none';
            }, 8000);
        });
    }

    /* ==============================================
       9. Smooth Scroll for Anchor Links
    ============================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Offset of 80px accounts for sticky header
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

});
