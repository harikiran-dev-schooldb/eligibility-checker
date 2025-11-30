document.addEventListener("DOMContentLoaded", loadTable);

function calculateExactAge(dob) {
  const dobDate = new Date(dob);

  let years = referenceDate.getFullYear() - dobDate.getFullYear();
  let months = referenceDate.getMonth() - dobDate.getMonth();
  let days = referenceDate.getDate() - dobDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    formatted: `${years} years, ${months} months, ${days} day(s)`
  };
}

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
    <span style="color:#d32f2f;font-size:32px;">
      Eligible Class: ${eligible}
    </span>
  `;

  document.querySelectorAll("#tableBody tr").forEach(row => {
    row.classList.toggle("highlight", row.cells[1].innerText === eligible);
  });
}

function updateColumns() {
  const col = +document.getElementById("percentSelect").value;
  document.querySelectorAll("#eligibilityTable tr").forEach(row => {
    for (let i = 4; i <= 6; i++) {
      if (row.cells[i]) row.cells[i].style.display = i === col ? "" : "none";
    }
  });
}

function loadTable() {
  const year = document.getElementById("yearSelect").value;
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  const incrementCols = [4, 5, 6]; // 8%, 9%, 10%
  const table = document.getElementById("eligibilityTable");

  // CASE 1: Old years (manual fees: 2023, 2024, 2025)
  if (year !== "2026") {

    // Hide increment dropdown
    document.getElementById("percentSelect").style.display = "none";

    // Hide increment columns in table header + rows
    incrementCols.forEach(i => {
      table.querySelectorAll(`th:nth-child(${i+1}), td:nth-child(${i+1})`)
           .forEach(cell => cell.style.display = "none");
    });

    // Load manual fees
    const rows = manualFees[year];
    rows.forEach(r => {
      tbody.innerHTML += `
        <tr>
          <td>${r.age}</td>
          <td>${r.class}</td>
          <td>${r.fees}</td>
          <td>${r.term}</td>
          <td style="display:none">-</td>
          <td style="display:none">-</td>
          <td style="display:none">-</td>
        </tr>
      `;
    });

    return;
  }

  // CASE 2: 2026–27 (auto increment)
  document.getElementById("percentSelect").style.display = "";

  // Show increment columns
  incrementCols.forEach(i => {
    table.querySelectorAll(`th:nth-child(${i+1}), td:nth-child(${i+1})`)
         .forEach(cell => cell.style.display = "");
  });

  // Load 2026–27 auto-increment rows
  eligibilityData.forEach(r => {
    const yearly = r.term * 4;

    tbody.innerHTML += `
      <tr>
        <td>${r.age}</td>
        <td>${r.class}</td>
        <td>${r.baseFees}</td>
        <td>${r.term}</td>
        <td>${Math.round((yearly * 1.08) / 100) * 100}</td>
        <td>${Math.round((yearly * 1.09) / 100) * 100}</td>
        <td>${Math.round((yearly * 1.1) / 100) * 100}</td>
      </tr>
    `;
  });

  updateColumns();
}
