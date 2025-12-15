// Default structure for a resume object
const DEFAULT_RESUME = {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: [],
    experience: '',
    education: '',
    projects: ''
};

const STORAGE_KEY = 'resumeData';

/**
 * Loads resume data from LocalStorage.
 * @returns {object} The stored resume object or the default structure.
 */
function loadResume() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error loading data from localStorage:", e);
    }
    return DEFAULT_RESUME;
}

/**
 * Saves the given resume object to LocalStorage.
 * @param {object} resumeData - The complete resume object to save.
 */
function saveResume(resumeData) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
        console.log("Resume data saved successfully!");
    } catch (e) {
        console.error("Error saving data to localStorage:", e);
        alert("Error saving data. Your browser might be full or private browsing mode is active.");
    }
}

// --- Export/Import Functions (Used in export.html) ---

/**
 * Downloads the current resume data as a JSON file.
 */
function downloadJSON() {
    const data = loadResume();
    const filename = 'resume_backup.json';
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("Resume data backed up successfully!");
}

/**
 * Imports resume data from a JSON file uploaded by the user.
 * @param {Event} event - The file input change event.
 */
function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (importedData && typeof importedData === 'object') {
                saveResume(importedData);
                alert("Resume data imported successfully! Redirecting to Builder.");
                window.location.href = 'index.html'; 
            } else {
                alert("Invalid JSON format in the uploaded file.");
            }
        } catch (error) {
            alert("Error reading file: " + error.message);
        }
    };
    reader.readAsText(file);
}