const KEY = "resume-data";

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function load() {
  return JSON.parse(localStorage.getItem(KEY) || "{}");
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(load(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "resume.json";
  a.click();
}

function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = () => save(JSON.parse(r.result));
  r.readAsText(file);
}
