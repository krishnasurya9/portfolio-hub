document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('team-grid');

    if (!gridContainer) {
        console.error('Team grid container not found!');
        return;
    }

    if (typeof teamMembers === 'undefined') {
        console.error('Team members data not loaded! Make sure data.js is included before app.js.');
        return;
    }

    renderTeamGrid(teamMembers, gridContainer);
    renderHeroAvatars(teamMembers);
    setupScrollEffects();
});

function renderHeroAvatars(members) {
    const container = document.getElementById('hero-avatars');
    if (!container) return;

    container.innerHTML = members.map(member => {
        const imagePath = member.image || 'assets/images/default.jpg';
        return `
            <a href="${member.link}" class="hero-avatar-link" title="${member.name}" 
               style="border-color: ${member.themeColor || 'white'}">
                <img src="${imagePath}" alt="${member.name}">
            </a>
        `;
    }).join('');
}

function renderTeamGrid(members, container) {
    container.innerHTML = members.map((member, index) => createMemberRow(member, index)).join('');
}

function createMemberRow(member, index) {
    // Fallback for missing image
    const imagePath = member.image || 'assets/images/default.jpg';

    // Check if we need to display a flagship project
    const projectHTML = member.flagshipProject ? `
        <div class="flagship-project">
            <strong>🚀 Flagship Project:</strong> ${member.flagshipProject}
        </div>
    ` : '';

    // Determine initial animation direction (alternate)
    const infoClass = index % 2 === 0 ? 'hidden-right' : 'hidden-left';
    const imgClass = 'hidden-scale';

    // We pass the theme color as a data attribute to read it later
    // Apply a light tint of the theme color as background
    const themeColor = member.themeColor || '#2563eb';
    const lightBg = themeColor + '15'; // 15 = ~8% opacity in hex
    const rowDirection = index % 2 === 0 ? '' : 'flex-direction: row-reverse;';

    return `
        <article class="team-member-row" data-id="${member.id}" data-color="${themeColor}" 
                 style="background-color: ${lightBg}; ${rowDirection}">
            <div class="member-image-container">
                <div class="member-image-wrapper" style="border-bottom: 5px solid ${themeColor}">
                    <img src="${imagePath}" alt="${member.name}" onerror="this.src='https://placehold.co/400x500'">
                </div>
            </div>
            
            <div class="member-info-container">
                <h3 class="member-name" style="color: ${themeColor}">${member.name}</h3>
                <span class="member-role">${member.role}</span>
                <p class="member-bio">${member.description}</p>
                
                <a href="${member.link}" class="btn-profile" 
                   style="background-color: ${themeColor}; border-color: ${themeColor}; color: white;">
                    Collaborate
                </a>

                ${projectHTML}
            </div>
        </article>
    `;
}

function setupScrollEffects() {
    const rows = document.querySelectorAll('.team-member-row');

    // Throttled scroll handler for performance
    let ticking = false;

    function updateOnScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateRowVisuals(rows);
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateOnScroll);

    // Initial render
    updateRowVisuals(rows);
}

function updateRowVisuals(rows) {
    const viewportHeight = window.innerHeight;
    const centerLine = viewportHeight * 0.5; // Middle of screen

    rows.forEach(row => {
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + (rect.height / 2);

        // Distance from center of viewport (0 = perfect center)
        const distanceFromCenter = Math.abs(rowCenter - centerLine);

        // Normalize: 0 at center, 1 at viewport edge
        const normalizedDistance = Math.min(distanceFromCenter / (viewportHeight * 0.5), 1);

        // Calculate opacity (1 at center, fades to 0 as it leaves)
        const opacity = Math.max(0, 1 - (normalizedDistance * 0.8)); // Subtle fade

        // Calculate scale (1.0 at center, 0.95 at edges)
        const scale = 0.95 + (0.05 * (1 - normalizedDistance));

        // Apply transformations - more subtle
        row.style.opacity = opacity;
        row.style.transform = `scale(${scale})`;

        // Update scrollbar color when item is near center
        if (distanceFromCenter < viewportHeight * 0.3) {
            const color = row.dataset.color || '#3b82f6';
            document.documentElement.style.setProperty('--scrollbar-color', color);
        }
    });
}
