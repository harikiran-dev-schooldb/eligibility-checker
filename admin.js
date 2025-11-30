// -------------------------------
// CONFIG
// -------------------------------
const repoUser = "harikiran-dev-schooldb";
const repoName = "eligibility-checker";
const filePath = "data.js";

// Login credentials
const ADMIN = {
  username: "admin",
  password: "admin"
};

// -------------------------------
// LOGIN
// -------------------------------
function login() {
  const u = document.getElementById("user").value.trim();
  const p = document.getElementById("pass").value.trim();

  if (u === ADMIN.username && p === ADMIN.password) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadFeeTable();
  } else {
    alert("❌ Invalid username or password");
  }
}

// -------------------------------
// LOAD data.js FROM GITHUB
// -------------------------------
async function loadData() {
  const res = await fetch(`https://raw.githubusercontent.com/${repoUser}/${repoName}/main/data.js`);
  const text = await res.text();

  // Convert JS → executable
  eval(text);

  return { manualFees, eligibilityData };
}

// -------------------------------
// LOAD TABLE
// -------------------------------
async function loadFeeTable() {
  const year = document.getElementById("yearSelect").value;
  const data = await loadData();

  const tbody = document.getElementById("feeTableBody");
  tbody.innerHTML = "";

  data.manualFees[year].forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.age}</td>
        <td>${r.class}</td>
        <td><input data-age="${r.age}" data-type="fees" value="${r.fees}"></td>
        <td><input data-age="${r.age}" data-type="term" value="${r.term}"></td>
      </tr>`;
  });
}

// -------------------------------
// SAVE CHANGES BACK TO data.js
// -------------------------------
async function saveChanges() {
  const token = document.getElementById("token").value.trim();
  if (!token) return alert("Enter GitHub Token");

  const year = document.getElementById("yearSelect").value;
  const res = await fetch(`https://api.github.com/repos/${repoUser}/${repoName}/contents/${filePath}`);
  const file = await res.json();

  // Parse existing file
  const originalText = atob(file.content);
  eval(originalText); // loads manualFees + eligibilityData

  // Update values
  document.querySelectorAll("#feeTable input").forEach(inp => {
    const age = inp.dataset.age;
    const type = inp.dataset.type;

    const item = manualFees[year].find(r => r.age == age);
    item[type] = Number(inp.value);
  });

  // Rebuild JS file content
  const newJs =
    "const referenceDate = new Date(2026, 5, 1);\n\n" +
    "const manualFees = " + JSON.stringify(manualFees, null, 2) + ";\n\n" +
    "const eligibilityData = " + JSON.stringify(eligibilityData, null, 2) + ";";

  // Upload to GitHub
  const uploadRes = await fetch(
    `https://api.github.com/repos/${repoUser}/${repoName}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json"
      },
      body: JSON.stringify({
        message: `Updated Fees for ${year}`,
        content: btoa(newJs),
        sha: file.sha
      })
    }
  );

  alert("✔ Saved Successfully!");
}
