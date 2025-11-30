// -------------------------------
// CONFIG
// -------------------------------
const repoUser = "harikiran-dev-schooldb";
const repoName = "eligibility-checker";
const filePath = "data.json";

// Admin login credentials
const ADMIN = {
  username: "admin",
  password: "admin"
};

// -------------------------------
// LOGIN SYSTEM
// -------------------------------
function login() {
  const u = document.getElementById("user").value.trim();
  const p = document.getElementById("pass").value.trim();

  if (u === ADMIN.username && p === ADMIN.password) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadFeeTable();
  } else {
    alert("❌ Invalid Username or Password");
  }
}

// -------------------------------
// LOAD data.json FROM GITHUB
// -------------------------------
async function loadData() {
  const res = await fetch(`https://raw.githubusercontent.com/${repoUser}/${repoName}/main/data.json`);
  return res.json();
}

// -------------------------------
// LOAD TABLE BASED ON YEAR
// -------------------------------
async function loadFeeTable() {
  const year = document.getElementById("yearSelect").value;
  const data = await loadData();

  const tbody = document.querySelector("#feeTable tbody");
  tbody.innerHTML = "";

  data.manualFees[year].forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.age}</td>
        <td>${r.class}</td>
        <td><input value="${r.fees}" data-age="${r.age}" data-type="fees"></td>
        <td><input value="${r.term}" data-age="${r.age}" data-type="term"></td>
      </tr>
    `;
  });
}

// -------------------------------
// SAVE BACK TO GITHUB
// -------------------------------
async function saveChanges() {
  const token = document.getElementById("token").value.trim();
  if (!token) return alert("Enter GitHub Token");

  const year = document.getElementById("yearSelect").value;

  // load file metadata
  const res = await fetch(`https://api.github.com/repos/${repoUser}/${repoName}/contents/${filePath}`);
  const file = await res.json();

  const content = JSON.parse(atob(file.content));

  // update values
  document.querySelectorAll("#feeTable input").forEach(input => {
    const age = input.dataset.age;
    const type = input.dataset.type;
    const row = content.manualFees[year].find(r => r.age == age);
    row[type] = Number(input.value);
  });

  const newContent = btoa(JSON.stringify(content, null, 2));

  // upload updated file
  await fetch(`https://api.github.com/repos/${repoUser}/${repoName}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Updated Fees for ${year}`,
      content: newContent,
      sha: file.sha
    })
  });

  alert("✔ Saved Successfully!");
}
