// --------------------------------------------------
// ENSURE LOADTABLE RUNS ON FIRST LOAD
// --------------------------------------------------

// Ensure loadTable runs even when app.js is loaded AFTER DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadTable);
} else {
  loadTable(); // DOM already loaded → run immediately
}

// --------------------------------------------------
// AGE CALCULATION
// --------------------------------------------------
function calculateExactAge(dob) {
  const dobDate = new Date(dob);

  let years = referenceDate.getFullYear() - dobDate.getFullYear();
  let months = referenceDate.getMonth() - dobDate.getMonth();
  let days = referenceDate.getDate() - dobDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      0
    ).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    formatted: `${years} years, ${months} months, ${days} day(s)`,
  };
}

// --------------------------------------------------
// ELIGIBILITY CHECK
// --------------------------------------------------
function checkEligibility() {
  const dob = document.getElementById("dob").value;
  if (!dob) return alert("Enter Date of Birth");

  const ageObj = calculateExactAge(dob);
  const resultDiv = document.getElementById("result");
  let eligible = "Not Eligible";

  for (let i = eligibilityData.length - 1; i >= 0; i--) {
    if (ageObj.years >= eligibilityData[i].age) {
      eligible = eligibilityData[i].class;
      break;
    }
  }


resultDiv.innerHTML = `
  Age: ${ageObj.formatted}<br><br>
  <span style="color:#d32f2f;font-size:32px;font-weight:bold;">
    Eligible Class: ${eligible}
  </span><br><br>
`;

// ✅ Eligible → Celebration
if (eligible !== "Not Eligible") {
  launchConfetti();
}
// ❌ Not Eligible → Sad emoji
else {
  resultDiv.innerHTML += `
    <div class="sad-emoji">😔</div>
  `;
}


  // highlight the correct row
  document.querySelectorAll("#tableBody tr").forEach((row) => {
    row.classList.toggle("highlight", row.cells[1].innerText === eligible);
  });
}

// --------------------------------------------------
// SHOW/HIDE INCREMENT COLUMNS
// --------------------------------------------------
function updateColumns() {
  const selectedCol = Number(document.getElementById("incrementSelect").value);

  document.querySelectorAll("#eligibilityTable tr").forEach((row) => {
    for (let i = 4; i <= 6; i++) {
      if (row.cells[i]) {
        row.cells[i].style.display = i === selectedCol ? "" : "none";
      }
    }
  });
}

function updateIncrementView() {
  const year = document.getElementById("yearSelect").value;
  const choice = document.getElementById("incrementSelect").value;

  // No increments for old years
  if (year !== "2026") return;

  // Show all columns
  if (choice === "all") {
    for (let i = 4; i <= 6; i++) {
      document
        .querySelectorAll(
          `#eligibilityTable tr td:nth-child(${i + 1}), 
                                 #eligibilityTable th:nth-child(${i + 1})`
        )
        .forEach((cell) => (cell.style.display = ""));
    }
    return;
  }

  // Show only the selected column
  for (let i = 4; i <= 6; i++) {
    document
      .querySelectorAll(
        `#eligibilityTable tr td:nth-child(${i + 1}), 
                               #eligibilityTable th:nth-child(${i + 1})`
      )
      .forEach((cell) => {
        cell.style.display = String(i) === choice ? "" : "none";
      });
  }
}

// --------------------------------------------------
// LOAD TABLE BASED ON SELECTED YEAR
// --------------------------------------------------
function loadTable() {
  const year = document.getElementById("yearSelect").value;
  const increment = Number(
    document.getElementById("incrementSelect").value || 1.09
  );
  const tbody = document.getElementById("tableBody");
  const table = document.getElementById("eligibilityTable");

  tbody.innerHTML = "";

  // Reset headers
  document.querySelector("#eligibilityTable th:nth-child(3)").innerText =
    "Term Fee";
  document.querySelector("#eligibilityTable th:nth-child(4)").innerText =
    "Fees";

  // ✅ OLD YEARS (2023–2025)
  if (year !== "2026") {
    document.getElementById("incrementSelect").style.display = "none";

    // Hide extra columns
    [5, 6, 7].forEach((c) => {
      table
        .querySelectorAll(`th:nth-child(${c}), td:nth-child(${c})`)
        .forEach((cell) => (cell.style.display = "none"));
    });

    manualFees[year].forEach((r) => {
      tbody.innerHTML += `
        <tr>
          <td>${r.age}</td>
          <td>${r.class}</td>
          <td>${r.term}</td>
          <td>${r.fees}</td>
        </tr>`;
    });

    return;
  }

  // ✅ 2026–27 (AUTO INCREMENT MODE)
  document.getElementById("incrementSelect").style.display = "";

  document.querySelector("#eligibilityTable th:nth-child(3)").innerText =
    "Term Fee (2026–27)";
  document.querySelector("#eligibilityTable th:nth-child(4)").innerText =
    "Fees (2026–27)";

  // Hide increment columns completely
  [5, 6, 7].forEach((c) => {
    table
      .querySelectorAll(`th:nth-child(${c}), td:nth-child(${c})`)
      .forEach((cell) => (cell.style.display = "none"));
  });

  const baseFees = manualFees["2025"];

  baseFees.forEach((r) => {
    const yearly = r.term * 4;

    const newTerm = Math.round((r.term * increment) / 100) * 100;
    const newFees = Math.round((yearly * increment) / 100) * 100;

    tbody.innerHTML += `
      <tr>
        <td>${r.age}</td>
        <td>${r.class}</td>
        <td>${newTerm}</td>
        <td>${newFees}</td>
      </tr>`;
  });
}

// --------------------------------------------------
// CONFETTI / RIBBON ANIMATION
// --------------------------------------------------
function launchConfetti() {
  let layer = document.getElementById("confetti-layer");

  if (!layer) {
    layer = document.createElement("div");
    layer.id = "confetti-layer";
    document.body.appendChild(layer);
  }

  layer.innerHTML = "";

  const colors = ["#f44336", "#e91e63", "#ff5252", "#ffcdd2"];
  const types = ["ribbon-long", "ribbon-curve", "ribbon-strip"];

  for (let i = 0; i < 180; i++) {
    const conf = document.createElement("div");
    const type = types[Math.floor(Math.random() * types.length)];

    conf.className = `confetti ${type}`;
    conf.style.left = Math.random() * 100 + "vw";
    conf.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    conf.style.animationDuration = 2 + Math.random() * 3 + "s";

    layer.appendChild(conf);

    setTimeout(() => conf.remove(), 5500);
  }
}

