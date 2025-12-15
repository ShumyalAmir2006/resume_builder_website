// Resume Builder (front-end only)
// - Build resume from form
// - Add/remove Experience and Education entries
// - Skills as tags
// - Save/Load with localStorage
// - Export to PDF (Print) / Export JSON / Import JSON


window.addEventListener("DOMContentLoaded", () => {
  const ed = document.getElementById("editor");
  if (ed) {
    ed.classList.add("d-none");
    ed.style.setProperty("display", "none", "important");
  }
});

const STORAGE_KEY = "resume_builder_v1";

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

const state = {
  basics: {
    name: "Your Name",
    title: "Student / Junior Web Developer",
    email: "yourname@email.com",
    phone: "+92-300-0000000",
    location: "Your City",
    links: "github.com/yourname • linkedin.com/in/yourname",
    summary: "Write a short summary about yourself (2–3 lines)."
  },
  skills: ["HTML", "CSS", "JavaScript"],
  experience: [
    {
      role: "Frontend Practice",
      company: "Self Learning",
      start: "2025",
      end: "2025",
      bullets: [
        "Built responsive pages with HTML/CSS/JS.",
        "Practiced DOM manipulation and form validation."
      ]
    }
  ],
  education: [
    {
      program: "BS (or Diploma) in ICT",
      school: "Your Institute",
      start: "2024",
      end: "2026",
      bullets: ["Relevant coursework: Web Design, Programming Fundamentals"]
    }
  ],
  projects: [
    {
      name: "ICT Semester Project",
      link: "",
      bullets: [
        "Created multi-page website with table and form pages.",
        "Used GitHub Projects and deployed via GitHub Pages."
      ]
    }
  ]
};

// ---------- persistence ----------
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
  }catch(e){
    console.warn("Failed to load saved state", e);
  }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  toast("Saved ✓");
}

// ---------- helpers ----------
function toast(msg){
  const el = $("#toast");
  el.textContent = msg;
  el.classList.remove("d-none");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=> el.classList.add("d-none"), 1800);
}
function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function bulletsFromTextarea(text){
  return String(text||"")
    .split("\n")
    .map(s=>s.trim())
    .filter(Boolean);
}
function bulletsToTextarea(arr){
  return (arr||[]).join("\n");
}

// ---------- render preview ----------
function renderPreview(){
  const b = state.basics;
  $("#pName").textContent = b.name || "";
  $("#pTitle").textContent = b.title || "";
  $("#pEmail").textContent = b.email || "";
  $("#pPhone").textContent = b.phone || "";
  $("#pLocation").textContent = b.location || "";
  $("#pLinks").textContent = b.links || "";
  $("#pSummary").textContent = b.summary || "";

  // Skills
  $("#pSkills").innerHTML = (state.skills||[]).map(s=>`<span class="pill">${escapeHtml(s)}</span>`).join("");

  // Experience
  $("#pExp").innerHTML = (state.experience||[]).map(item=>{
    const range = [item.start, item.end].filter(Boolean).join(" – ");
    const meta = [item.company, range].filter(Boolean).join(" • ");
    const bullets = (item.bullets||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join("");
    return `
      <div class="r-item">
        <div class="top">
          <div class="role">${escapeHtml(item.role||"")}</div>
          <div class="meta">${escapeHtml(meta)}</div>
        </div>
        ${bullets ? `<ul class="r-bullets">${bullets}</ul>` : ""}
      </div>
    `;
  }).join("");

  // Education
  $("#pEdu").innerHTML = (state.education||[]).map(item=>{
    const range = [item.start, item.end].filter(Boolean).join(" – ");
    const meta = [item.school, range].filter(Boolean).join(" • ");
    const bullets = (item.bullets||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join("");
    return `
      <div class="r-item">
        <div class="top">
          <div class="role">${escapeHtml(item.program||"")}</div>
          <div class="meta">${escapeHtml(meta)}</div>
        </div>
        ${bullets ? `<ul class="r-bullets">${bullets}</ul>` : ""}
      </div>
    `;
  }).join("");

  // Projects
  $("#pProj").innerHTML = (state.projects||[]).map(item=>{
    const name = escapeHtml(item.name||"");
    const link = (item.link||"").trim();
    const title = link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${name}</a>` : name;
    const bullets = (item.bullets||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join("");
    return `
      <div class="r-item">
        <div class="top">
          <div class="role">${title}</div>
          <div class="meta">${escapeHtml(link ? link : "")}</div>
        </div>
        ${bullets ? `<ul class="r-bullets">${bullets}</ul>` : ""}
      </div>
    `;
  }).join("");

  $("#year").textContent = new Date().getFullYear();
}

// ---------- render builder lists ----------
function renderLists(){
  // Experience table
  const expBody = $("#expBody");
  expBody.innerHTML = "";
  state.experience.forEach((item, idx)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(item.role)}</td>
      <td>${escapeHtml(item.company)}</td>
      <td>${escapeHtml([item.start,item.end].filter(Boolean).join(" – "))}</td>
      <td style="text-align:right;">
        <button class="btn small" data-exp-edit="${idx}">Edit</button>
        <button class="btn small danger" data-exp-del="${idx}">Delete</button>
      </td>
    `;
    expBody.appendChild(tr);
  });

  // Education table
  const eduBody = $("#eduBody");
  eduBody.innerHTML = "";
  state.education.forEach((item, idx)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(item.program)}</td>
      <td>${escapeHtml(item.school)}</td>
      <td>${escapeHtml([item.start,item.end].filter(Boolean).join(" – "))}</td>
      <td style="text-align:right;">
        <button class="btn small" data-edu-edit="${idx}">Edit</button>
        <button class="btn small danger" data-edu-del="${idx}">Delete</button>
      </td>
    `;
    eduBody.appendChild(tr);
  });

  // Projects table
  const projBody = $("#projBody");
  projBody.innerHTML = "";
  state.projects.forEach((item, idx)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.link || "")}</td>
      <td style="text-align:right;">
        <button class="btn small" data-proj-edit="${idx}">Edit</button>
        <button class="btn small danger" data-proj-del="${idx}">Delete</button>
      </td>
    `;
    projBody.appendChild(tr);
  });

  // skills pills
  const skillsWrap = $("#skillsWrap");
  skillsWrap.innerHTML = state.skills.map((s, idx)=>`
    <span class="pill">${escapeHtml(s)}
      <button type="button" title="Remove" data-skill-del="${idx}">×</button>
    </span>
  `).join("");
}

function syncAll(){
  renderLists();
  renderPreview();
  saveSilently();
}

function saveSilently(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  $("#lastSaved").textContent = "Auto-saved at " + new Date().toLocaleTimeString();
}

// ---------- form bindings ----------
function bindBasics(){
  const map = {
    bName:"name", bTitle:"title", bEmail:"email", bPhone:"phone",
    bLocation:"location", bLinks:"links", bSummary:"summary"
  };
  for(const [id, key] of Object.entries(map)){
    const el = $("#"+id);
    el.value = state.basics[key] ?? "";
    el.addEventListener("input", ()=>{
      state.basics[key] = el.value;
      renderPreview();
      saveSilently();
    });
  }
}

function bindSkills(){
  const input = $("#skillInput");
  $("#addSkillBtn").addEventListener("click", ()=>{
    const val = input.value.trim();
    if(!val) return;
    if(state.skills.some(s=>s.toLowerCase() === val.toLowerCase())){
      toast("Skill already added");
      input.value = "";
      return;
    }
    state.skills.push(val);
    input.value = "";
    syncAll();
  });

  $("#skillsWrap").addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-skill-del]");
    if(!btn) return;
    const idx = Number(btn.getAttribute("data-skill-del"));
    state.skills.splice(idx,1);
    syncAll();
  });

  input.addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
      e.preventDefault();
      $("#addSkillBtn").click();
    }
  });
}

// Modal-ish editor (simple)
function openEditor(kind, idx){
  const dlg = $("#editor");
  const title = $("#editorTitle");
  const form = $("#editorForm");
  const saveBtn = $("#editorSave");
  const delBtn = $("#editorDelete");
  const closeBtn = $("#editorClose");

  dlg.classList.remove("d-none");
  dlg.setAttribute("data-kind", kind);
  dlg.setAttribute("data-idx", String(idx ?? -1));

  // reset
  form.innerHTML = "";

  function addField(label, name, type="text", value=""){
    const id = `f_${name}`;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <label for="${id}">${escapeHtml(label)}</label>
      ${type === "textarea"
        ? `<textarea class="input" id="${id}" name="${escapeHtml(name)}"></textarea>`
        : `<input class="input" id="${id}" name="${escapeHtml(name)}" type="${escapeHtml(type)}" />`
      }
    `;
    form.appendChild(wrap);
    const el = $("#"+id);
    el.value = value ?? "";
    return el;
  }

  let item;
  if(kind === "exp"){
    title.textContent = idx >= 0 ? "Edit Experience" : "Add Experience";
    item = idx >= 0 ? state.experience[idx] : { role:"", company:"", start:"", end:"", bullets:[] };
    const role = addField("Role / Title", "role", "text", item.role);
    const company = addField("Company / Organization", "company", "text", item.company);
    const start = addField("Start (year or date)", "start", "text", item.start);
    const end = addField("End (year or date)", "end", "text", item.end);
    const bullets = addField("Bullet points (one per line)", "bullets", "textarea", bulletsToTextarea(item.bullets));
    delBtn.style.display = idx >= 0 ? "" : "none";

    saveBtn.onclick = () => {
      const updated = {
        role: role.value.trim(),
        company: company.value.trim(),
        start: start.value.trim(),
        end: end.value.trim(),
        bullets: bulletsFromTextarea(bullets.value)
      };
      if(idx >= 0) state.experience[idx] = updated;
      else state.experience.unshift(updated);
      closeEditor();
      syncAll();
    };

    delBtn.onclick = () => {
      if(idx < 0) return;
      if(!confirm("Delete this experience?")) return;
      state.experience.splice(idx,1);
      closeEditor();
      syncAll();
    };
  }

  if(kind === "edu"){
    title.textContent = idx >= 0 ? "Edit Education" : "Add Education";
    item = idx >= 0 ? state.education[idx] : { program:"", school:"", start:"", end:"", bullets:[] };
    const program = addField("Program / Degree", "program", "text", item.program);
    const school = addField("School / Institute", "school", "text", item.school);
    const start = addField("Start (year)", "start", "text", item.start);
    const end = addField("End (year)", "end", "text", item.end);
    const bullets = addField("Details (one per line)", "bullets", "textarea", bulletsToTextarea(item.bullets));
    delBtn.style.display = idx >= 0 ? "" : "none";

    saveBtn.onclick = () => {
      const updated = {
        program: program.value.trim(),
        school: school.value.trim(),
        start: start.value.trim(),
        end: end.value.trim(),
        bullets: bulletsFromTextarea(bullets.value)
      };
      if(idx >= 0) state.education[idx] = updated;
      else state.education.unshift(updated);
      closeEditor();
      syncAll();
    };

    delBtn.onclick = () => {
      if(idx < 0) return;
      if(!confirm("Delete this education?")) return;
      state.education.splice(idx,1);
      closeEditor();
      syncAll();
    };
  }

  if(kind === "proj"){
    title.textContent = idx >= 0 ? "Edit Project" : "Add Project";
    item = idx >= 0 ? state.projects[idx] : { name:"", link:"", bullets:[] };
    const name = addField("Project name", "name", "text", item.name);
    const link = addField("Project link (optional)", "link", "text", item.link);
    const bullets = addField("Highlights (one per line)", "bullets", "textarea", bulletsToTextarea(item.bullets));
    delBtn.style.display = idx >= 0 ? "" : "none";

    saveBtn.onclick = () => {
      const updated = {
        name: name.value.trim(),
        link: link.value.trim(),
        bullets: bulletsFromTextarea(bullets.value)
      };
      if(idx >= 0) state.projects[idx] = updated;
      else state.projects.unshift(updated);
      closeEditor();
      syncAll();
    };

    delBtn.onclick = () => {
      if(idx < 0) return;
      if(!confirm("Delete this project?")) return;
      state.projects.splice(idx,1);
      closeEditor();
      syncAll();
    };
  }

  closeBtn.onclick = closeEditor;
  dlg.addEventListener("click", (e)=>{
    if(e.target === dlg) closeEditor();
  }, { once: true });

  document.addEventListener("keydown", function esc(e){
    if(e.key === "Escape"){
      closeEditor();
      document.removeEventListener("keydown", esc);
    }
  });
}

function closeEditor(){
  const ed = document.getElementById("editor");
  ed.classList.add("d-none");
  ed.style.setProperty("display", "none", "important");
}


function bindTables(){
  $("#addExpBtn").addEventListener("click", ()=> openEditor("exp", -1));
  $("#addEduBtn").addEventListener("click", ()=> openEditor("edu", -1));
  $("#addProjBtn").addEventListener("click", ()=> openEditor("proj", -1));

  document.addEventListener("click", (e)=>{
    const expEdit = e.target.closest("[data-exp-edit]");
    const expDel = e.target.closest("[data-exp-del]");
    const eduEdit = e.target.closest("[data-edu-edit]");
    const eduDel = e.target.closest("[data-edu-del]");
    const projEdit = e.target.closest("[data-proj-edit]");
    const projDel = e.target.closest("[data-proj-del]");

    if(expEdit) openEditor("exp", Number(expEdit.dataset.expEdit));
    if(eduEdit) openEditor("edu", Number(eduEdit.dataset.eduEdit));
    if(projEdit) openEditor("proj", Number(projEdit.dataset.projEdit));

    if(expDel){
      const i = Number(expDel.dataset.expDel);
      if(confirm("Delete this experience?")){
        state.experience.splice(i,1); syncAll();
      }
    }
    if(eduDel){
      const i = Number(eduDel.dataset.eduDel);
      if(confirm("Delete this education?")){
        state.education.splice(i,1); syncAll();
      }
    }
    if(projDel){
      const i = Number(projDel.dataset.projDel);
      if(confirm("Delete this project?")){
        state.projects.splice(i,1); syncAll();
      }
    }
  });
}

// ---------- export/import ----------
function download(filename, text, mime="text/plain"){
  const blob = new Blob([text], {type: mime});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
}

function bindExport(){
  $("#printBtn").addEventListener("click", ()=>{
    // user can "Save as PDF" in print dialog
    window.print();
  });

  $("#exportJsonBtn").addEventListener("click", ()=>{
    download("resume-data.json", JSON.stringify(state, null, 2), "application/json");
  });

  $("#importJsonBtn").addEventListener("click", ()=> $("#importFile").click());
  $("#importFile").addEventListener("change", async (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const text = await file.text();
    try{
      const parsed = JSON.parse(text);
      // basic sanity
      if(!parsed.basics) throw new Error("Invalid file: missing basics");
      Object.assign(state, parsed);
      saveState();
      initUI();
      toast("Imported ✓");
    }catch(err){
      alert("Import failed: " + err.message);
    }finally{
      e.target.value = "";
    }
  });

  $("#resetBtn").addEventListener("click", ()=>{
    if(!confirm("Reset resume to defaults?")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  $("#saveBtn").addEventListener("click", saveState);
}

// ---------- init ----------
function initUI(){
  bindBasics();
  renderLists();
  renderPreview();
  $("#lastSaved").textContent = localStorage.getItem(STORAGE_KEY) ? "Loaded saved resume" : "Not saved yet";
}

function init(){
  loadState();
  initUI();
  bindSkills();
  bindTables();
  bindExport();
}
init();

document.getElementById("contactForm").addEventListener("submit", () => {
  alert("Thanks for contacting us! We'll get back to you soon.");
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const menu = document.getElementById("exportMenu");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
});

function downloadJSON() {
  const data = localStorage.getItem("resumeData");
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "resume-backup.json";
  link.click();
}

