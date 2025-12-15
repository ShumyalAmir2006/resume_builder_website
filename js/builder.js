const data = load();

["name","title","email","phone","location","summary","experience","education","projects"]
.forEach(id => {
  const el = document.getElementById(id);
  if (el && data[id]) el.value = data[id];
});

function saveResume() {
  const resume = {};
  ["name","title","email","phone","location","summary","experience","education","projects"]
  .forEach(id => resume[id] = document.getElementById(id).value);
  resume.skills = [...document.querySelectorAll("#skills span")].map(s=>s.textContent);
  save(resume);
}
