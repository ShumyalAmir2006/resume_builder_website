document.addEventListener('DOMContentLoaded', () => {
    const resumeData = loadResume();
    renderResume(resumeData);
    setupTemplateSelector();
});

/**
 * Renders the resume data onto the preview page elements.
 * @param {object} data - The resume object.
 */
function renderResume(data) {
    // --- Personal Info ---
    document.getElementById('pName').textContent = data.name || 'Your Full Name';
    document.getElementById('pTitle').textContent = data.title || 'Professional Title';
    
    const contactInfo = [data.email, data.phone, data.location].filter(Boolean).join(' | ');
    document.getElementById('pContact').textContent = contactInfo;

    // --- Sections ---
    document.getElementById('pSummary').textContent = data.summary || 'A compelling summary of your career goals and achievements...';
    document.getElementById('pExperience').innerHTML = formatText(data.experience);
    document.getElementById('pEducation').innerHTML = formatText(data.education);
    document.getElementById('pProjects').innerHTML = formatText(data.projects);

    // --- Skills ---
    const pSkills = document.getElementById('pSkills');
    pSkills.innerHTML = '';
    if (data.skills && data.skills.length > 0) {
        data.skills.forEach(skill => {
            const span = document.createElement('span');
            span.textContent = skill;
            pSkills.appendChild(span);
        });
    } else {
        pSkills.textContent = 'Add your key skills in the Builder tab.';
    }
}

/**
 * Basic text formatting: converts new lines into <br> tags.
 * This is crucial for rendering multi-line content correctly in the resume.
 * @param {string} text - The raw text from the textarea.
 * @returns {string} HTML formatted text.
 */
function formatText(text) {
    if (!text) return 'Details will appear here.';
    // Replace double newlines with paragraph break, single newlines with <br>
    return text.trim().replace(/\n\s*\n/g, '</p><p>').replace(/\n/g, '<br>');
}

/**
 * Sets up the template selection dropdown.
 */
function setupTemplateSelector() {
    const selector = document.getElementById('templateSelect');
    const resume = document.getElementById('resume');
    
    // Assuming templates are named template-1, template-2, etc.
    const templates = ['Template 1', 'Template 2', 'Template 3']; // Extend this list
    
    templates.forEach((name, index) => {
        const option = document.createElement('option');
        option.value = `template-${index + 1}`;
        option.textContent = name;
        selector.appendChild(option);
    });

    // Set initial selection based on current class
    const initialClass = Array.from(resume.classList).find(c => c.startsWith('template-'));
    if (initialClass) {
        selector.value = initialClass;
    }

    selector.addEventListener('change', (e) => {
        // Remove existing template class
        Array.from(resume.classList).forEach(c => {
            if (c.startsWith('template-')) {
                resume.classList.remove(c);
            }
        });
        // Add new template class
        resume.classList.add(e.target.value);
    });
}