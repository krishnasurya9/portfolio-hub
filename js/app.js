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
});

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

    return `
        <article class="team-member-row" data-id="${member.id}">
            <div class="member-image-container">
                <div class="member-image-wrapper">
                    <img src="${imagePath}" alt="${member.name}" onerror="this.src='https://placehold.co/400x500'">
                </div>
            </div>
            
            <div class="member-info-container">
                <h3 class="member-name">${member.name}</h3>
                <span class="member-role">${member.role}</span>
                <p class="member-bio">${member.description}</p>
                
                <a href="${member.link}" class="btn-profile">
                    Collaborate
                </a>

                ${projectHTML}
            </div>
        </article>
    `;
}
