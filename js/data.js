/**
 * TEAM MEMBERS CONFIGURATION
 * 
 * Team members data for the Portfolio Hub.
 * Members are displayed in alphabetical order on the landing page.
 * 
 * Fields:
 * - id: Unique identifier (URL-friendly slug)
 * - name: Full name
 * - roles: Array of role tags (displayed as chips)
 * - primaryRole: Main role for categorization (ai-ml, backend, frontend, research, data, systems)
 * - bio: Short 1-line bio for the card
 * - image: Path to profile image (relative to index.html)
 * - link: Path to personal portfolio page
 * - themeColor: Accent color for this member
 */
const teamMembers = [
    {
        id: "krishna-surya-chowdary",
        name: "Pothuri Krishna Surya Chowdary",
        roles: ["AI/ML", "Research"],
        primaryRole: "ai-ml",
        bio: "Data Science Student building applied AI systems. Experience with multi-LLM orchestration, RAG pipelines, and BERT-LSTM models.",
        image: "assets/images/krishna.jpg",
        link: "team/krishna.html",
        themeColor: "#3b82f6"
    }
    // To add a new member, copy the block above and update the fields
];

/**
 * Get team members sorted alphabetically by name
 * @returns {Array} Sorted team members array
 */
function getSortedMembers() {
    return [...teamMembers].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get role chip CSS class based on role type
 * @param {string} role - Role name
 * @returns {string} CSS class name
 */
function getRoleChipClass(role) {
    const roleMap = {
        'AI/ML': 'ai-ml',
        'AI': 'ai-ml',
        'ML': 'ai-ml',
        'Machine Learning': 'ai-ml',
        'Backend': 'backend',
        'API': 'backend',
        'Systems': 'systems',
        'Frontend': 'frontend',
        'UI/UX': 'frontend',
        'UI': 'frontend',
        'UX': 'frontend',
        'Research': 'research',
        'Data': 'data',
        'Analytics': 'data',
        'Data Science': 'data'
    };
    return roleMap[role] || 'ai-ml';
}
