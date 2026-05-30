/**
 * Minimalist Editorial Portfolio Logic
 * Clean, lightweight, fully commented modular vanilla JavaScript.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 0. PAGE LOADER — fade out once everything is ready
    // ==========================================================================
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Use window.load for images/fonts, but fall back to a short timeout
        const hideLoader = () => {
            loader.classList.add('hidden');
        };
        if (document.readyState === 'complete') {
            setTimeout(hideLoader, 300);
        } else {
            window.addEventListener('load', () => setTimeout(hideLoader, 300));
        }
    }

    // ==========================================================================
    // 1. MOBILE DRAWER NAVIGATION MENU
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('mobile-active-toggle');
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('mobile-active-toggle');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Close menu drawer if clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('open')) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('mobile-active-toggle');
            }
        }
    });

    // ==========================================================================
    // 2. INTERSECTION OBSERVER FOR ACTIVE NAV LINKS HIGHLIGHTING
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ==========================================================================
    // 3. INTERACTIVE CAROUSEL SLIDER (Horizontal slide offset calculations)
    // ==========================================================================
    const track = document.getElementById('carousel-track');
    const counter = document.getElementById('carousel-counter');
    const prevBtn = document.getElementById('arrow-prev');
    const nextBtn = document.getElementById('arrow-next');
    
    if (track && counter && prevBtn && nextBtn) {
        const slides = Array.from(track.children);
        let currentSlide = 0;

        const updateSlider = () => {
            // Formula accounts for 100% card width plus the flex gap (2.5rem in CSS)
            track.style.transform = `translateX(calc(-${currentSlide * 100}% - ${currentSlide * 2.5}rem))`;
            
            // Update counter with 2-digit pad (e.g. 01 / 04)
            counter.textContent = `0${currentSlide + 1} / 0${slides.length}`;
            
            // Adjust arrows state boundaries (Formal clamping)
            prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
            
            nextBtn.style.opacity = currentSlide === slides.length - 1 ? '0.3' : '1';
            nextBtn.style.pointerEvents = currentSlide === slides.length - 1 ? 'none' : 'auto';
        };

        // Initialize state
        updateSlider();

        // Right arrow click (Next)
        nextBtn.addEventListener('click', () => {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                updateSlider();
            }
        });

        // Left arrow click (Prev)
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        });

        // Responsive handling (Recalculate offsets on resizing)
        window.addEventListener('resize', () => {
            updateSlider();
        });
    }

    // ==========================================================================
    // 3b. SLIDE ACTION BUTTONS — force external links to open in new tab
    // ==========================================================================
    document.querySelectorAll('.slide-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                window.open(href, '_blank', 'noopener,noreferrer');
            }
        });
    });

    // ==========================================================================
    // 4. INTERACTIVE GENERIC SUB-SLIDER (For all 6 projects)
    // ==========================================================================
    const subSliders = document.querySelectorAll('.inner-slider-wrapper');
    subSliders.forEach(slider => {
        const track = slider.querySelector('.inner-slider-track');
        const prev = slider.querySelector('.inner-prev');
        const next = slider.querySelector('.inner-next');
        const dots = slider.querySelectorAll('.inner-dot');
        const totalSlides = track ? track.children.length : 5;
        
        let subIndex = 0;

        const updateSubSlider = () => {
            if (track) {
                // Translate the track: since there are N slides, each is 100/N% width of track
                track.style.transform = `translateX(-${subIndex * (100 / totalSlides)}%)`;
            }
            
            // Update active dot classes
            dots.forEach((dot, idx) => {
                if (idx === subIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            // Clamping chevrons opacity indicators
            if (prev) {
                prev.style.opacity = subIndex === 0 ? '0.3' : '1';
                prev.style.pointerEvents = subIndex === 0 ? 'none' : 'auto';
            }
            if (next) {
                next.style.opacity = subIndex === totalSlides - 1 ? '0.3' : '1';
                next.style.pointerEvents = subIndex === totalSlides - 1 ? 'none' : 'auto';
            }
        };

        updateSubSlider();

        if (next) {
            next.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering main slider events
                if (subIndex < totalSlides - 1) {
                    subIndex++;
                    updateSubSlider();
                }
            });
        }

        if (prev) {
            prev.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering main slider events
                if (subIndex > 0) {
                    subIndex--;
                    updateSubSlider();
                }
            });
        }

        // Support dots clicks too!
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                subIndex = idx;
                updateSubSlider();
            });
        });
    });

    // ==========================================================================
    // 5. LIGHT & DARK MODE THEME TOGGLER
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☼';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.textContent = '☾';
        }

        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.textContent = isDark ? '☼' : '☾';
        });
    }

    // ==========================================================================
    // 6. RESUME DISPATCH INTERACTION (Pre-configured to resume.pdf download)
    // ==========================================================================
    const resumeBtns = document.querySelectorAll('.nav-cta, .about-ctas .btn-outline');
    resumeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetHref = btn.getAttribute('href');
            if (targetHref === '#' || targetHref === 'resume.pdf') {
                console.log("Resume button clicked, routing download to: " + targetHref);
            }
        });
    });

    // ==========================================================================
    // 7. OTHER PROJECTS - FILTERABLE GALLERY & LIGHTBOX MODAL
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active class on buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // Lightbox modal logic
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCat = document.getElementById('lightbox-cat');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    if (lightbox && lightboxImg && galleryItems.length > 0) {
        // Collect active (non-hidden) items list to enable slideshow carousel inside lightbox
        let activeItems = [];
        let currentLightboxIndex = 0;
        
        const updateLightboxContent = () => {
            const currentItem = activeItems[currentLightboxIndex];
            if (currentItem) {
                const img = currentItem.querySelector('.gallery-img');
                const title = currentItem.querySelector('.gallery-item-title');
                const cat = currentItem.querySelector('.gallery-item-cat');
                
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxTitle.textContent = title.textContent;
                lightboxCat.textContent = cat.textContent;
            }
        };

        const openLightbox = (item) => {
            // Recalculate list of active items currently visible in the gallery
            activeItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
            currentLightboxIndex = activeItems.indexOf(item);
            
            updateLightboxContent();
            
            lightbox.style.display = 'flex';
            // Trigger animation frame for CSS opacity transition
            requestAnimationFrame(() => {
                lightbox.classList.add('active');
            });
            document.body.style.overflow = 'hidden'; // Lock background scroll
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            // Wait for transition before hiding display
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 400);
            document.body.style.overflow = ''; // Unlock background scroll
        };
        
        // Click on gallery items to open lightbox
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                openLightbox(item);
            });
        });

        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Close on background overlay click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Prev slide inside lightbox
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeItems.length > 1) {
                    currentLightboxIndex = (currentLightboxIndex - 1 + activeItems.length) % activeItems.length;
                    updateLightboxContent();
                }
            });
        }

        // Next slide inside lightbox
        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeItems.length > 1) {
                    currentLightboxIndex = (currentLightboxIndex + 1) % activeItems.length;
                    updateLightboxContent();
                }
            });
        }
        
        // Keyboard arrow controls support
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft' && activeItems.length > 1) {
                    currentLightboxIndex = (currentLightboxIndex - 1 + activeItems.length) % activeItems.length;
                    updateLightboxContent();
                } else if (e.key === 'ArrowRight' && activeItems.length > 1) {
                    currentLightboxIndex = (currentLightboxIndex + 1) % activeItems.length;
                    updateLightboxContent();
                }
            }
        });
    }
});
