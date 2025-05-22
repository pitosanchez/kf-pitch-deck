// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded successfully!');

    // GSAP card stack animation
    if (window.gsap) {
        gsap.from('.card', {
            y: 80,
            opacity: 0,
            stagger: 0.18,
            duration: 1.1,
            ease: 'power3.out',
        });

        // Animate driver diagram columns when in view
        if (gsap && gsap.registerPlugin && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }
        if (window.ScrollTrigger) {
            gsap.from('.diagram-column', {
                scrollTrigger: {
                    trigger: '#card-driver-diagram',
                    start: 'top 80%',
                },
                y: 60,
                opacity: 0,
                stagger: 0.25,
                duration: 1,
                ease: 'power3.out',
            });
            gsap.from('.diagram-box', {
                scrollTrigger: {
                    trigger: '#card-driver-diagram',
                    start: 'top 80%',
                },
                scale: 0.7,
                opacity: 0,
                stagger: 0.08,
                duration: 0.7,
                ease: 'back.out(1.7)',
                delay: 0.5,
            });
        }

        // Stack effect animation
        const cards = gsap.utils.toArray('.card');

        // Create a timeline for the stack effect
        const stackTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.card-stack-section',
                start: 'top top',
                end: `+=${cards.length * 100}%`,
                pin: true,
                scrub: true,
                anticipatePin: 1,
            }
        });

        // Set initial state for all cards
        cards.forEach((card, i) => {
            gsap.set(card, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: cards.length - i,
                y: i === 0 ? 0 : '100vh',
                opacity: i === 0 ? 1 : 0
            });
        });

        // Initial fade in animation for first card
        gsap.from(cards[0], {
            y: 80,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
        });

        // Enhanced card stacking reveal animation
        if (window.gsap && window.ScrollTrigger) {
            cards.forEach((card, i) => {
                // Animate card in from below
                gsap.fromTo(card,
                    { y: 100, opacity: 0, zIndex: i + 1 },
                    {
                        y: 0,
                        opacity: 1,
                        zIndex: i + 10,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );

                // Animate previous card to scale down and fade as next card enters
                if (i > 0) {
                    gsap.to(cards[i - 1], {
                        scale: 0.96,
                        opacity: 0.7,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 90%',
                            toggleActions: 'play reverse play reverse',
                        }
                    });
                }
            });
        }
    }

    // Interactive hover effect for diagram boxes
    const boxes = document.querySelectorAll('.diagram-box');
    let tooltip = document.createElement('div');
    tooltip.className = 'diagram-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '1000';
    tooltip.style.display = 'none';
    tooltip.style.background = 'rgba(30,27,75,0.97)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '10px 16px';
    tooltip.style.borderRadius = '10px';
    tooltip.style.fontSize = '1rem';
    tooltip.style.boxShadow = '0 2px 12px 0 #0005';
    tooltip.style.maxWidth = '260px';
    document.body.appendChild(tooltip);

    boxes.forEach(box => {
        box.addEventListener('mouseenter', (e) => {
            gsap.to(box, { scale: 1.08, boxShadow: '0 0 24px 0 #ffb30088', duration: 0.25 });
            const info = box.getAttribute('data-info');
            if (info) {
                tooltip.textContent = info;
                tooltip.style.display = 'block';
            }
        });
        box.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 18) + 'px';
            tooltip.style.top = (e.clientY + 12) + 'px';
        });
        box.addEventListener('mouseleave', () => {
            gsap.to(box, { scale: 1, boxShadow: 'none', duration: 0.2 });
            tooltip.style.display = 'none';
        });
    });

    // Add any interactive functionality here
    const container = document.querySelector('.container');
    if (container) {
        container.addEventListener('click', () => {
            console.log('Container clicked!');
        });
    }

    // Pitch deck navigation logic
    const slides = Array.from(document.querySelectorAll('.slide'));
    let current = 0;

    function showSlide(idx, animate = true) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.style.zIndex = i === idx ? 2 : 1;
        });
        slides[idx].classList.add('active');
        if (animate && window.gsap) {
            gsap.fromTo(slides[idx].querySelector('.slide-content'),
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
            );
        }
        updateDots();
    }

    function nextSlide() {
        if (current < slides.length - 1) {
            current++;
            showSlide(current);
        }
    }
    function prevSlide() {
        if (current > 0) {
            current--;
            showSlide(current);
        }
    }

    // Navigation arrows
    document.getElementById('nav-left').addEventListener('click', prevSlide);
    document.getElementById('nav-right').addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Dots navigation
    const navDots = document.getElementById('nav-dots');
    function updateDots() {
        navDots.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'nav-dot' + (i === current ? ' active' : '');
            dot.addEventListener('click', () => {
                current = i;
                showSlide(current);
            });
            navDots.appendChild(dot);
        });
    }

    // Initial state
    showSlide(current, false);

    // Animate driver diagram and interactivity (only on its slide)
    function setupDriverDiagram() {
        if (window.gsap && window.ScrollTrigger) {
            gsap.from('.diagram-column', {
                scrollTrigger: {
                    trigger: '#slide-5',
                    start: 'top 80%',
                },
                y: 60,
                opacity: 0,
                stagger: 0.25,
                duration: 1,
                ease: 'power3.out',
            });
            gsap.from('.diagram-box', {
                scrollTrigger: {
                    trigger: '#slide-5',
                    start: 'top 80%',
                },
                scale: 0.7,
                opacity: 0,
                stagger: 0.08,
                duration: 0.7,
                ease: 'back.out(1.7)',
                delay: 0.5,
            });
        }
        // Interactive hover effect for diagram boxes
        const boxes = document.querySelectorAll('.diagram-box');
        let tooltip = document.querySelector('.diagram-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'diagram-tooltip';
            tooltip.style.position = 'fixed';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = '1000';
            tooltip.style.display = 'none';
            tooltip.style.background = '#357963';
            tooltip.style.color = '#fff';
            tooltip.style.padding = '10px 16px';
            tooltip.style.borderRadius = '10px';
            tooltip.style.fontSize = '1rem';
            tooltip.style.boxShadow = '0 2px 12px 0 #0005';
            tooltip.style.maxWidth = '260px';
            tooltip.style.border = '2px solid #E9DB7F';
            document.body.appendChild(tooltip);
        }
        boxes.forEach(box => {
            box.addEventListener('mouseenter', (e) => {
                gsap.to(box, { scale: 1.08, boxShadow: '0 0 24px 0 #ffb30088', duration: 0.25 });
                const info = box.getAttribute('data-info');
                if (info) {
                    tooltip.textContent = info;
                    tooltip.style.display = 'block';
                }
            });
            box.addEventListener('mousemove', (e) => {
                tooltip.style.left = (e.clientX + 18) + 'px';
                tooltip.style.top = (e.clientY + 12) + 'px';
            });
            box.addEventListener('mouseleave', () => {
                gsap.to(box, { scale: 1, boxShadow: 'none', duration: 0.2 });
                tooltip.style.display = 'none';
            });
        });
    }
    setupDriverDiagram();

    // Draw SVG lines for driver diagram
    function drawDriverDiagramLines() {
        const svg = document.querySelector('.diagram-lines');
        if (!svg) return;
        svg.innerHTML = '';
        // Helper to get center of a node
        function getCenter(el) {
            const rect = el.getBoundingClientRect();
            const parentRect = svg.parentElement.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2 - parentRect.left,
                y: rect.top + rect.height / 2 - parentRect.top
            };
        }
        // Connect aim to each strategy
        const aim = document.getElementById('node-aim');
        const strategies = [1, 2, 3].map(i => document.getElementById('node-strategy-' + i));
        strategies.forEach(strategy => {
            if (aim && strategy) {
                const a = getCenter(aim);
                const b = getCenter(strategy);
                svg.innerHTML += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#A1B6DE" stroke-width="3" />`;
            }
        });
        // Connect each strategy to its ideas
        const ideas = [
            [document.getElementById('node-idea-1')],
            [document.getElementById('node-idea-2')],
            [document.getElementById('node-idea-3'), document.getElementById('node-idea-4')],
        ];
        strategies.forEach((strategy, i) => {
            ideas[i].forEach(idea => {
                if (strategy && idea) {
                    const a = getCenter(strategy);
                    const b = getCenter(idea);
                    svg.innerHTML += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#A1B6DE" stroke-width="2.5" />`;
                }
            });
        });
        // Connect ideas to assets
        const assets = [
            document.getElementById('node-asset-1'),
            document.getElementById('node-asset-2'),
            document.getElementById('node-asset-3'),
        ];
        ideas.forEach((ideaArr, i) => {
            ideaArr.forEach(idea => {
                const asset = assets[i];
                if (idea && asset) {
                    const a = getCenter(idea);
                    const b = getCenter(asset);
                    svg.innerHTML += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#A1B6DE" stroke-width="2" />`;
                }
            });
        });
    }

    // Redraw lines on window resize or when slide-5 is shown
    function onDriverDiagramVisible() {
        setTimeout(drawDriverDiagramLines, 300);
    }
    window.addEventListener('resize', () => {
        if (document.getElementById('slide-5').classList.contains('active')) {
            drawDriverDiagramLines();
        }
    });

    // Patch showSlide to call onDriverDiagramVisible for slide-5
    const origShowSlide = window.showSlide;
    window.showSlide = function (idx, animate) {
        origShowSlide(idx, animate);
        if (slides[idx].id === 'slide-5') onDriverDiagramVisible();
    };
    // If not patched, call directly after DOMContentLoaded
    if (document.getElementById('slide-5').classList.contains('active')) {
        onDriverDiagramVisible();
    }

    if (window.gsap && window.ScrollTrigger) {
        gsap.utils.toArray('.site-section').forEach(section => {
            gsap.from(section, {
                opacity: 0,
                y: 80,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                }
            });
        });
        gsap.utils.toArray('.founder-content').forEach(content => {
            const photo = content.querySelector('.founder-photo');
            const bio = content.querySelector('.founder-bio');
            if (photo && bio) {
                gsap.from(photo, {
                    opacity: 0,
                    x: -60,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: content,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    }
                });
                gsap.from(bio, {
                    opacity: 0,
                    x: 60,
                    duration: 0.8,
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: content,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    }
                });
            }
        });
    }

    // IMAGE REVEAL ANIMATION WITH GSAP
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll('.reveal');
        revealContainers.forEach((container) => {
            let image = container.querySelector('img');
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: 'restart none none reset',
                }
            });
            tl.set(container, { autoAlpha: 1 });
            tl.from(container, 1.5, {
                xPercent: -100,
                ease: 'power2.out'
            });
            tl.from(image, 1.5, {
                xPercent: 100,
                scale: 1.3,
                delay: -1.5,
                ease: 'power2.out'
            });
        });
    }

    // Smooth, slow, scroll-controlled image reveal animation for all .reveal img elements on every card
    if (window.gsap && window.ScrollTrigger) {
        document.querySelectorAll('.card .reveal img').forEach((img) => {
            gsap.fromTo(img,
                { x: 240, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: img.closest('.card'),
                        start: 'top 80%',
                        end: 'top 30%',
                        scrub: true,
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        });
    }

    // GSAP ScrollTrigger animation for each card: fade in and slide up as it enters the viewport
    if (window.gsap && window.ScrollTrigger) {
        document.querySelectorAll('.card').forEach((card) => {
            gsap.from(card, {
                y: 80,
                opacity: 0,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'top 40%',
                    scrub: true,
                }
            });
        });
    }

    // Single ScrollTrigger for all cards: animation begins at first card, ends at last card
    if (window.gsap && window.ScrollTrigger) {
        const cards = document.querySelectorAll('.card');
        gsap.from(cards, {
            y: 80,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.card-stack-section',
                start: 'top 85%',
                end: 'bottom 20%',
                scrub: true,
            }
        });
    }

    let currentPage = 0;
    const pages = document.querySelectorAll('.page');
    const dots = document.querySelectorAll('.dot');

    function showPage(index) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.add('page-hidden');
        });

        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('dot-active');
            dot.classList.add('dot-inactive');
        });

        // Show selected page and activate corresponding dot
        pages[index].classList.remove('page-hidden');
        dots[index].classList.remove('dot-inactive');
        dots[index].classList.add('dot-active');

        // Update current page index
        currentPage = index;
    }

    function nextPage() {
        if (currentPage < pages.length - 1) {
            showPage(currentPage + 1);
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            showPage(currentPage - 1);
        }
    }

    // Add click event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showPage(index);
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextPage();
        } else if (e.key === 'ArrowLeft') {
            prevPage();
        }
    });

    // Initialize first page
    showPage(0);
}); 