/**************************************************
 FEE TABLE
**************************************************/

async function loadTable() {
  const year = document.getElementById("yearSelect").value;
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  if (feeRows.length === 0) {
    const { data, error } = await db.from("feetable").select("*");
    if (error) {
      alert("Could not load fee data");
      return;
    }
    feeRows = data;
  }

  const rows = feeRows
    .filter((r) => r.academic_year === year)
    .sort((a, b) => a.age - b.age);

  rows.forEach((r) => {
    tbody.innerHTML += `
      <tr>
        <td>${r.age}</td>
        <td>${r.class}</td>
        <td>${r.term}</td>
        <td>${r.annualFees}</td>
      </tr>`;
  });
}

function toggleIncrement() {
  const yearSelect = document.getElementById("yearSelect");
  const box = document.getElementById("incrementBox");

  // ✅ SAFETY GUARD
  if (!yearSelect || !box) return;

  box.style.display =
    yearSelect.value === "2026-27" ? "inline-block" : "none";
}

