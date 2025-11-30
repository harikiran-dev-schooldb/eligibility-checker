const repoUser = "harikiran-dev-schooldb";
const repoName = "eligibility-checker";
const filePath = "data.json";

// Simple username/password login
function login() {
  const u = document.getElementById("user").value;
  const p = document.getElementById("pass").value;

  if (u === "admin" && p === "kotak@123") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadFeeTable();
  } else {
    alert("Invalid Credentials");
  }
}

// Load data.json from GitHub
async function loadData() {
  const res = await fetch("data.json");
  return res.json();
}

// Load table for selected year
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

// Save changes back to GitHub
async function saveChanges() {
  const token = document.getElementById("token").value;
  if (!token) return alert("Enter GitHub Token");

  const year = document.getElementById("yearSelect").value;
  const res = await fetch(`https://api.github.com/repos/${repoUser}/${repoName}/contents/${filePath}`);
  const file = await res.json();
  const content = JSON.parse(atob(file.content));

  // Update JSON
  document.querySelectorAll("#feeTable input").forEach(input => {
    const age = input.dataset.age;
    const type = input.dataset.type;

    const item = content.manualFees[year].find(r => r.age == age);
    item[type] = Number(input.value);
  });

  const newContent = btoa(JSON.stringify(content, null, 2));

  // Push update to GitHub
  await fetch(`https://api.github.com/repos/${repoUser}/${repoName}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      "Authorization": `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Updated Fees (${year})`,
      content: newContent,
      sha: file.sha
    })
  });

  alert("Saved successfully ✔");
}
