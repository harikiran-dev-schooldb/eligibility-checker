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
  let eligible = "Not Eligible";

  for (let i = eligibilityData.length - 1; i >= 0; i--) {
    if (ageObj.years >= eligibilityData[i].age) {
      eligible = eligibilityData[i].class;
      break;
    }
  }

  document.getElementById("result").innerHTML = `
    Age: ${ageObj.formatted}<br>
    <span style="color:#d32f2f;font-size:32px;">Eligible Class: ${eligible}</span>
  `;

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
  const tbody = document.getElementById("tableBody");
  const table = document.getElementById("eligibilityTable");
  const incrementCols = [4, 5, 6];

  tbody.innerHTML = "";

  // RESET HEADER TITLES
  document.querySelector("#eligibilityTable th:nth-child(3)").innerText = "Fees";
  document.querySelector("#eligibilityTable th:nth-child(4)").innerText = "Term Fee";

  // 🔹 OLD YEARS (2023, 2024, 2025)
  if (year !== "2026") {
    document.getElementById("incrementSelect").style.display = "none";

    // Hide increment columns
    incrementCols.forEach(i => {
      table.querySelectorAll(`th:nth-child(${i+1}), td:nth-child(${i+1})`)
           .forEach(cell => cell.style.display = "none");
    });

    // Load manual fees
    manualFees[year].forEach(r => {
      tbody.innerHTML += `
        <tr>
          <td>${r.age}</td>
          <td>${r.class}</td>
          <td>${r.fees}</td>
          <td>${r.term}</td>
          <td style="display:none">-</td>
          <td style="display:none">-</td>
          <td style="display:none">-</td>
        </tr>`;
    });

    return;
  }

  // 🔹 2026–27 (AUTO-INCREMENT MODE)
  document.getElementById("incrementSelect").style.display = "";

  // Update column headers for 2026–27
  document.querySelector("#eligibilityTable th:nth-child(3)").innerText = "Fees (2025–26)";
  document.querySelector("#eligibilityTable th:nth-child(4)").innerText = "Term Fee (2025–26)";

  // Show increment columns
  incrementCols.forEach(i => {
    table.querySelectorAll(`th:nth-child(${i+1}), td:nth-child(${i+1})`)
         .forEach(cell => cell.style.display = "");
  });

  // Load 2025–26 fees and auto increment for 2026–27
  const previousYrFees = manualFees["2025"];

  previousYrFees.forEach(r => {
    const yearly = r.term * 4;

    tbody.innerHTML += `
      <tr>
        <td>${r.age}</td>
        <td>${r.class}</td>
        <td>${r.fees}</td>
        <td>${r.term}</td>
        <td>${Math.round((yearly * 1.08) / 100) * 100}</td>
        <td>${Math.round((yearly * 1.09) / 100) * 100}</td>
        <td>${Math.round((yearly * 1.10) / 100) * 100}</td>
      </tr>`;
  });

  updateColumns();
}

