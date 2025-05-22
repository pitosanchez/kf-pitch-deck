// Get all pages and navigation elements
const pages = document.querySelectorAll('.page');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentPage = 0;
let isTransitioning = false;

// Function to show a specific page
function showPage(index) {
    if (isTransitioning || index === currentPage) return;
    isTransitioning = true;

    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('page-visible');
        page.classList.add('page-hidden');
    });

    // Show the selected page
    pages[index].classList.remove('page-hidden');
    pages[index].classList.add('page-visible');

    // Update dots
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('dot-active');
            dot.classList.remove('dot-inactive');
            dot.setAttribute('aria-current', 'true');
        } else {
            dot.classList.remove('dot-active');
            dot.classList.add('dot-inactive');
            dot.removeAttribute('aria-current');
        }
    });

    // Update current page
    currentPage = index;

    // Update button states
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === pages.length - 1;

    // Update URL hash
    history.pushState(null, '', `#${pages[index].id}`);

    // Reset transition flag after animation
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

// Add click event listeners to dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showPage(index);
    });
});

// Add click event listeners to navigation buttons
prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        showPage(currentPage - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
        showPage(currentPage + 1);
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (isTransitioning) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentPage < pages.length - 1) {
            showPage(currentPage + 1);
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentPage > 0) {
            showPage(currentPage - 1);
        }
    }
});

// Handle navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetIndex = Array.from(pages).findIndex(page => page.id === targetId);
        if (targetIndex !== -1) {
            showPage(targetIndex);
        }
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    const targetIndex = Array.from(pages).findIndex(page => page.id === hash);
    if (targetIndex !== -1) {
        showPage(targetIndex);
    }
});

// Initialize first page
document.addEventListener('DOMContentLoaded', () => {
    // Set initial state for all pages
    pages.forEach((page, index) => {
        if (index === 0) {
            page.classList.add('page-visible');
            page.classList.remove('page-hidden');
        } else {
            page.classList.add('page-hidden');
            page.classList.remove('page-visible');
        }
    });

    // Check for hash in URL
    const hash = window.location.hash.substring(1);
    const targetIndex = Array.from(pages).findIndex(page => page.id === hash);

    // Show first page or page from hash
    showPage(targetIndex !== -1 ? targetIndex : 0);
}); 