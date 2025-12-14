/**************************************************
 ELIGIBILITY LOGIC
**************************************************/
let lastCalculatedAge = "";
let lastEligibleClass = "";

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

async function loadEligibility() {
  const { data, error } = await db
    .from("eligibility")
    .select("*")
    .order("age");

  if (error) {
    console.error(error);
    alert("Could not load eligibility rules");
    return;
  }

  eligibilityData = data;
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

  // ✅ STORE GLOBALLY
  lastCalculatedAge = ageObj.formatted;
  lastEligibleClass = eligible;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <div class="age-line">
      Age as on 1 June 2026: <strong>${ageObj.formatted}</strong>
    </div>
    <div class="eligible-line">
      Eligible Class: <strong>${eligible}</strong>
    </div>
  `;

  showProceedButton();
  highlightEligibleRow(eligible);
}

function highlightEligibleRow(eligible) {
  document.querySelectorAll("#tableBody tr").forEach((row) => {
    row.classList.remove("highlightRow");
    if (row.cells[1].innerText === eligible) {
      void row.offsetWidth;
      row.classList.add("highlightRow");
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}
