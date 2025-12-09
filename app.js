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
const referenceDate = new Date(2026, 5, 1);
let feeRows = []; // cache fee table from supabase
let eligibilityData = [];

/* --------------------------------------------------
   INITIAL LOAD
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  await loadEligibility();
  await loadTable();
});

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
  let anim = ""; // animation class to trigger

  if (["PRE KG", "LKG", "UKG"].includes(eligible)) {
    msg = "Early Years Programme – a warm start to joyful learning. 🌱";
    anim = "sparkleAnim";
  } else if (["I", "II", "III", "IV", "V"].includes(eligible)) {
    msg = "Primary Level – ready for strong foundational growth. 📘";
    anim = "riseAnim";
  } else if (["VI", "VII", "VIII"].includes(eligible)) {
    msg = "Middle School – stepping into confident learning. 📚";
    anim = "glowAnim";
  } else if (["IX", "X"].includes(eligible)) {
    msg = "Senior Level – entering a key academic milestone. 🎓";
    anim = "focusAnim";
  } else if (eligible !== "Not Eligible") {
    msg = "Eligible and ready for the next step. ✨";
    anim = "sparkleAnim";
  }

  resultDiv.innerHTML = `
  Age: ${ageObj.formatted}<br><br>
  <span class="eligible-text ${anim}">
    Eligible Class: ${eligible}
  </span><br><br>
  <div class="stage-msg ${anim}">${msg}</div>
`;

  if (eligible !== "Not Eligible") showProceedButton();

  // highlight selected row
  document.querySelectorAll("#tableBody tr").forEach((row) => {
    row.classList.toggle("highlight", row.cells[1].innerText === eligible);
  });
}

/* --------------------------------------------------
   LOAD TABLE USING SUPABASE FEE TABLE
-------------------------------------------------- */

async function loadEligibility() {
  const { data, error } = await db.from("eligibility").select("*").order("age");

  if (error) {
    console.error(error);
    alert("Could not load eligibility rules");
    return;
  }

  eligibilityData = data;
}

function roundToHundred(value) {
  return Math.round(value / 100) * 100;
}

async function loadTable() {
  const year = document.getElementById("yearSelect").value;
  const tbody = document.getElementById("tableBody");
  const header = document.getElementById("tableHeader");
  tbody.innerHTML = "";

  // Load only once
  if (feeRows.length === 0) {
    const { data, error } = await db
      .schema("public")
      .from("feetable")
      .select("*");

    if (error) {
      console.error(error);
      alert("Could not load fee data");
      return;
    }
    feeRows = data;
    console.log("Loaded feeRows:", feeRows);
  }

  // Show sample row to inspect column names
  console.log("Sample row:", feeRows[0]);

  // FILTER based on correct academic year column name
  const rows = feeRows.filter((r) => r.academic_year === year);

  console.log("Year selected:", year);
  console.log("Filtered rows:", rows);

  /* STATIC YEARS */
  if (year !== "2026-27") {
    header.innerHTML = `
      <th>Age</th>
      <th>Class</th>
      <th>Term Fee</th>
      <th>Total Fee</th>
    `;
    rows.forEach((r) => {
      tbody.innerHTML += `
        <tr>
          <td>${r.age}</td>
          <td>${r.class}</td>
          <td>${r.term}</td>
          <td>${r.annualFees}</td>
        </tr>`;
    });
    return;
  }

  /* 2026–27 — USE VALUES AS-IS FROM DATABASE */
header.innerHTML = `
  <th>Age</th>
  <th>Class</th>
  <th>Term Fee</th>
  <th>Total Fee</th>
`;

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

function formatDateDDMMYYYY(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
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
    parent,
    mobile: mobileNum,
    admClass: admClassValue,
    dob,
    age: ageText,
    eligible: eligibleClass,
    date: formatDateDDMMYYYY(new Date()),
    application: "NO",
    entrance: "NOT STARTED",
    interview: "PENDING",
    finalAdmission: "NO",
  };

  // ---------- INSERT INTO SUPABASE ----------
  const { error } = await db.from("admissions").insert([payload]);
  if (error) {
    console.error(error);
    return alert("❌ Error saving into Supabase!");
  }

  alert("✅ Enquiry saved successfully!");
  closeModal();
  sendWhatsApp(mobileNum, parent, student, dob, ageText, admClassValue);
}

function toggleIncrement() {
  const year = document.getElementById("yearSelect").value;
  const box = document.getElementById("incrementBox");

  box.style.display = year === "2026-27" ? "inline-block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  toggleIncrement();
});

/* --------------------------------------------------
   WHATSAPP MESSAGE
-------------------------------------------------- */
function sendWhatsApp(mobile, parent, student, dob, age, admClass) {
  mobile = mobile.replace(/\D/g, "").slice(-10);
  if (mobile.length !== 10) return alert("Invalid Mobile Number");

  // Format DOB to DD-MM-YYYY
  function formatDate(d) {
    const dt = new Date(d);
    const day = String(dt.getDate()).padStart(2, "0");
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const year = dt.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const formattedDOB = formatDate(dob);

  const message = `
🌟 *Kotak Salesian School – Visakhapatnam* 🌟

Dear Parent (${parent}),

Thank you for your enquiry regarding *${student}*. We are happy to share the initial admission details.

🎂 *Date of Birth:* ${formattedDOB}
📅 *Age:* ${age}
🏫 *Class Seeking Admission:* ${admClass}

📌 *Admission forms will be issued from 15 Dec 2025.*
📌 *Entrance assessment* is required for classes from UKG upwards.
📌 *Admission confirmation* will follow after successful completion of the required steps.

For further assistance, please feel free to contact us:
📞 *School Office:* 9949523412

We look forward to guiding you through the admission process and supporting your child’s educational journey.

Warm regards,  
*Kotak Salesian School*
`;

  window.open(
    `https://web.whatsapp.com/send?phone=91${mobile}&text=${encodeURIComponent(
      message
    )}`,
    "_blank"
  );
}
