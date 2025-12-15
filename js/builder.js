document.addEventListener('DOMContentLoaded', () => {
    const data = loadResume();
    renderDataToInputs(data);
    setupSkillInput(data.skills);
});

// Helper to map data fields to input IDs
const FIELD_MAP = [
    'name', 'title', 'email', 'phone', 'location', 'summary',
    'experience', 'education', 'projects'
];

/**
 * Renders loaded data into the corresponding input fields.
 * @param {object} data - The resume object.
 */
function renderDataToInputs(data) {
    FIELD_MAP.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.value = data[field] || '';
        }
    });
}

/**
 * Sets up the skill input and manages the skill tags display.
 * @param {Array<string>} initialSkills - Array of skills from loaded data.
 */
function setupSkillInput(initialSkills) {
    const skillInput = document.getElementById('skillInput');
    const skillsContainer = document.getElementById('skills');
    
    let currentSkills = initialSkills || [];

    // Function to draw the tags
    const renderSkills = () => {
        skillsContainer.innerHTML = '';
        currentSkills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                ${skill}
                <button onclick="removeSkill('${skill}')">&times;</button>
            `;
            skillsContainer.appendChild(tag);
        });
    };

    // Global removal function (must be globally accessible from the onclick in renderSkills)
    window.removeSkill = (skillToRemove) => {
        currentSkills = currentSkills.filter(skill => skill !== skillToRemove);
        renderSkills();
    };

    // Add skill on Enter key press
    skillInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const skillText = skillInput.value.trim();
            if (skillText && !currentSkills.includes(skillText)) {
                currentSkills.push(skillText);
                skillInput.value = '';
                renderSkills();
            }
        }
    });

    // Initial render
    renderSkills();

    // Attach skill data to the window for access by saveResume()
    window.getCurrentSkills = () => currentSkills;
}

/**
 * Gathers all data from the inputs and saves it.
 */
window.saveResume = function() {
    const resumeData = {};
    
    FIELD_MAP.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            resumeData[field] = element.value.trim();
        }
    });
    
    // Get skills data
    resumeData.skills = window.getCurrentSkills ? window.getCurrentSkills() : [];

    // Save the complete object
    saveResume(resumeData);
    alert("Resume Saved! You can now check the Preview.");
};