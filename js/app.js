/**
 * Team Portfolio Hub - Main Application Script
 * 
 * Handles:
 * - Navigation behavior
 * - Profile Selector Strip rendering
 * - Team Cards Grid rendering
 * - Scroll-to-card interactions
 * - Scroll spy for active avatar highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if we have team members data
    if (typeof teamMembers === 'undefined') {
        console.error('Team members data not loaded! Make sure data.js is included before app.js.');
        return;
    }

    // Get sorted members (alphabetically)
    const sortedMembers = getSortedMembers();

    // Render components
    renderProfileSelector(sortedMembers);
    renderTeamCards(sortedMembers);

    // Setup interactions
    setupNavigation();
    setupScrollSpy(sortedMembers);
});

/* ================================
   NAVIGATION
   ================================ */

function setupNavigation() {
    const nav = document.querySelector('.main-nav');
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const mobileMenu = document.querySelector('.nav-mobile-menu');

    // Scroll effect for navigation
    if (nav) {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }

    // Mobile menu toggle
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ================================
   PROFILE SELECTOR STRIP
   ================================ */

function renderProfileSelector(members) {
    const container = document.getElementById('profile-selector');
    if (!container) return;

    container.innerHTML = members.map(member => {
        const imagePath = member.image || 'assets/images/default.jpg';
        // Get first name for display
        const displayName = getDisplayName(member.name);

        return `
            <a href="#card-${member.id}" 
               class="profile-avatar-item" 
               data-member-id="${member.id}"
               data-role="${member.primaryRole}"
               title="${member.name}">
                <div class="profile-avatar-image">
                    <img src="${imagePath}" alt="${member.name}" 
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=80'">
                </div>
                <span class="profile-avatar-name">${displayName}</span>
                <span class="profile-avatar-role">${member.primaryRole.replace('-', '/')}</span>
            </a>
        `;
    }).join('');

    // Add click handlers for smooth scroll
    container.querySelectorAll('.profile-avatar-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const memberId = this.dataset.memberId;
            scrollToCard(memberId);

            // Update active state
            container.querySelectorAll('.profile-avatar-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Get a shortened display name (first name + last initial or first 2 words)
 */
function getDisplayName(fullName) {
    const parts = fullName.split(' ');
    if (parts.length <= 2) return fullName;
    // Return first name + last initial
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

/**
 * Scroll to a specific team card
 */
function scrollToCard(memberId) {
    const card = document.getElementById(`card-${memberId}`);
    if (card) {
        card.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

/* ================================
   TEAM CARDS GRID
   ================================ */

function renderTeamCards(members) {
    const container = document.getElementById('team-grid');
    if (!container) return;

    container.innerHTML = members.map(member => createTeamCard(member)).join('');
}

function createTeamCard(member) {
    const imagePath = member.image || 'assets/images/default.jpg';

    // Generate role chips
    const roleChips = member.roles.map(role => {
        const chipClass = getRoleChipClass(role);
        return `<span class="role-chip ${chipClass}">${role}</span>`;
    }).join('');

    return `
        <article class="team-card" id="card-${member.id}" data-member-id="${member.id}">
            <img class="team-card-avatar" 
                 src="${imagePath}" 
                 alt="${member.name}"
                 onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=120'">
            
            <h3 class="team-card-name">${member.name}</h3>
            
            <div class="role-chips">
                ${roleChips}
            </div>
            
            <p class="team-card-bio">${member.bio}</p>
            
            <a href="${member.link}" class="btn-view-profile">
                View Profile
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd"/>
                </svg>
            </a>
        </article>
    `;
}

/* ================================
   SCROLL SPY
   ================================ */

function setupScrollSpy(members) {
    const cards = document.querySelectorAll('.team-card');
    const avatarItems = document.querySelectorAll('.profile-avatar-item');

    if (!cards.length || !avatarItems.length) return;

    // Use Intersection Observer for performance
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when card is roughly in center
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const memberId = entry.target.dataset.memberId;

                // Update active avatar
                avatarItems.forEach(item => {
                    if (item.dataset.memberId === memberId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all cards
    cards.forEach(card => observer.observe(card));
}

/* ================================
   UTILITIES
   ================================ */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
