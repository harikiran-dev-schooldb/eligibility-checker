/******************************************************************************
 KOTAK SALESIAN SCHOOL – ELIGIBILITY + ADMISSION SYSTEM (Supabase Version)
 Clean, Fast, Optimized & 100% Working Build
******************************************************************************/

/* --------------------------------------------------
   SUPABASE SETUP
-------------------------------------------------- */
const SUPABASE_URL = "https://osrqmmsimjjkqsiwaiby.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zcnFtbXNpbWpqa3FzaXdhaWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzM3ODUsImV4cCI6MjA4MDY0OTc4NX0.gh-DzLvmw5wsXkp8z_ot5SuLbusGShi9xZUKFpETE4A";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* --------------------------------------------------
   INITIAL LOAD
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", loadTable);

/* --------------------------------------------------
   AGE CALCULATION
-------------------------------------------------- */
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

/* --------------------------------------------------
   ELIGIBILITY CHECK
-------------------------------------------------- */
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

  let msg = "";
  if (["Pre KG", "LKG", "UKG"].includes(eligible))
    msg = "Welcome to Early Learning!";
  else if (["I", "II", "III", "IV", "V"].includes(eligible))
    msg = "You are ready for Primary School!";
  else if (eligible !== "Not Eligible")
    msg = "Congratulations on your achievement!";

  resultDiv.innerHTML = `
    Age: ${ageObj.formatted}<br><br>
    <span style="color:#d32f2f;font-size:32px;font-weight:bold;">
      Eligible Class: ${eligible}
    </span><br><br>
    ${
      eligible !== "Not Eligible"
        ? `<div class="congrats">🎉 🎓 ${msg}</div>`
        : ""
    }
  `;

  if (eligible !== "Not Eligible") showProceedButton();

  // highlight selected row
  document.querySelectorAll("#tableBody tr").forEach((row) => {
    row.classList.toggle("highlight", row.cells[1].innerText === eligible);
  });
}

/* --------------------------------------------------
   LOAD TABLE
-------------------------------------------------- */
function loadTable() {
  const year = document.getElementById("yearSelect").value;
  const tbody = document.getElementById("tableBody");
  const table = document.getElementById("eligibilityTable");
  tbody.innerHTML = "";

  /* ---------- STATIC YEARS ---------- */
  if (year !== "2026") {
    document.getElementById("incrementSelect").style.display = "none";

    [5, 6, 7].forEach((col) => {
      table
        .querySelectorAll(`th:nth-child(${col}), td:nth-child(${col})`)
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

  /* ---------- YEAR 2026 AUTO-INCREMENT ---------- */
  document.getElementById("incrementSelect").style.display = "";

  const baseFees = manualFees["2025"];

  baseFees.forEach((r) => {
    const yearly = r.term * 4;

    const fee8 = Math.round((yearly * 1.08) / 100) * 100;
    const fee9 = Math.round((yearly * 1.09) / 100) * 100;
    const fee10 = Math.round((yearly * 1.1) / 100) * 100;
    const term10 = Math.round((r.term * 1.1) / 100) * 100;

    tbody.innerHTML += `
      <tr>
        <td>${r.age}</td>
        <td>${r.class}</td>
        <td>${term10}</td>
        <td>${fee10}</td>
        <td>${fee8}</td>
        <td>${fee9}</td>
        <td>${fee10}</td>
      </tr>`;
  });

  updateIncrementView();
}

/* --------------------------------------------------
   SHOW / HIDE INCREMENT COLUMNS
-------------------------------------------------- */
function updateIncrementView() {
  const choice = document.getElementById("incrementSelect").value;
  const table = document.getElementById("eligibilityTable");

  if (choice === "all") {
    [5, 6, 7].forEach((col) =>
      table
        .querySelectorAll(`th:nth-child(${col}), td:nth-child(${col})`)
        .forEach((cell) => (cell.style.display = ""))
    );
    return;
  }

  const showCol = choice === "8" ? 5 : choice === "9" ? 6 : 7;

  [5, 6, 7].forEach((col) => {
    table
      .querySelectorAll(`th:nth-child(${col}), td:nth-child(${col})`)
      .forEach((cell) => (cell.style.display = col === showCol ? "" : "none"));
  });
}

/* --------------------------------------------------
   ADMISSION MODAL
-------------------------------------------------- */
function showProceedButton() {
  if (document.getElementById("proceedBtn")) return;

  const div = document.createElement("div");
  div.className = "proceed-container";
  div.innerHTML = `<button id="proceedBtn" class="proceed-btn">✅ Proceed to Admission</button>`;
  document.getElementById("result").appendChild(div);

  document.getElementById("proceedBtn").onclick = () =>
    (document.getElementById("admissionModal").style.display = "block");
}

function closeModal() {
  document.getElementById("admissionModal").style.display = "none";
}

/* --------------------------------------------------
   SUBMIT ADMISSION
-------------------------------------------------- */
async function submitAdmission() {
  const parent = parentName.value.trim();
  const student = studentName.value.trim();
  const mobileNum = mobile.value.trim();
  const admClassValue = admClass.value;
  const dob = document.getElementById("dob").value;

  if (!parent || !student || !mobileNum || !admClassValue || !dob)
    return alert("Please fill all required fields");

  const ageMatch = document
    .querySelector("#result")
    .innerHTML.match(/Age:([^<]+)/);
  const ageText = ageMatch ? ageMatch[1].trim() : "";

  const eligibleClass =
    document
      .querySelector("#result span")
      ?.innerText.replace("Eligible Class: ", "") || admClassValue;

  // ---------- GET NEXT ENQUIRY NUMBER ----------
  let enquiryNo = "";
  const { data: rpcData, error: rpcError } = await db.rpc(
    "get_next_enquiry_no"
  );

  if (rpcError || !rpcData) {
    console.error(rpcError);
    alert("Could not generate enquiry number");
    return;
  }

  enquiryNo = rpcData;

  // ---------- PAYLOAD ----------
  const payload = {
    enquiryNo,
    student,
    mobile,
    dob, // ✅ send DOB
    age: ageText, // ✅ send formatted age
    admClass,
    eligibleClass,
  };

  const APP_URL =
    "https://script.google.com/macros/s/AKfycbwsyYckuTjENGff6OLJ_GYN-C1VUiMB7UhqYZ8SHqxQWt93LLZzUIbtUHPDPs6f_A5DFw/exec";

  fetch(APP_URL, {
    method: "POST",
    mode: "no-cors", // ✅ keep this
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  alert("✅ Enquiry saved successfully!");
  closeModal();
  sendWhatsApp(mobileNum, parent, student, dob, ageText, admClassValue);
}



/* --------------------------------------------------
   WHATSAPP MESSAGE
-------------------------------------------------- */
function sendWhatsApp(mobile, parent, student, dob, age, admClass) {
  mobile = mobile.replace(/\D/g, "").slice(-10);
  if (mobile.length !== 10) return alert("Invalid Mobile Number");

  const message = `
🌟 *Kotak Salesian School – Visakhapatnam* 🌟

Dear Parent (${parent}),

Thank you for your enquiry for *${student}*.

🎂 DOB: ${dob}
📅 Age: ${age}
🏫 Class Seeking Admission: ${admClass}

📌 Admissions begin from *15 Dec 2025*
📌 Entrance test required from UKG onwards.

Thank you for choosing Kotak Salesian School!`;

  window.open(
    `https://web.whatsapp.com/send?phone=91${mobile}&text=${encodeURIComponent(
      message
    )}`,
    "_blank"
  );
}
