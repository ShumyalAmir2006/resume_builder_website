const d = load();

pName.textContent = d.name || "";
pTitle.textContent = d.title || "";
pContact.textContent = [d.email, d.phone, d.location].filter(Boolean).join(" | ");
pSummary.textContent = d.summary || "";
pExperience.textContent = d.experience || "";
pEducation.textContent = d.education || "";
pProjects.textContent = d.projects || "";

pSkills.innerHTML = (d.skills||[]).map(s=>`<span class="pill">${s}</span>`).join("");
