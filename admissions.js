/**************************************************
 ADMISSIONS DASHBOARD – SUPABASE BACKEND (v3 FINAL)
 Clean, optimized & production-ready
**************************************************/

// ---------- SUPABASE CONFIG ----------
const SUPABASE_URL = "https://osrqmmsimjjkqsiwaiby.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zcnFtbXNpbWpqa3FzaXdhaWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzM3ODUsImV4cCI6MjA4MDY0OTc4NX0.gh-DzLvmw5wsXkp8z_ot5SuLbusGShi9xZUKFpETE4A";

const SUPA_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allRows = []; // cache

/**************************************************
 LOAD ADMISSIONS FROM SUPABASE
**************************************************/
async function loadAdmissions() {
  const container = document.getElementById("admissionsContainer");
  container.innerHTML = "Loading…";

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/admissions?select=*`, {
      method: "GET",
      headers: SUPA_HEADERS,
    });

    allRows = await res.json();

    populateClassFilter(allRows);
    renderTable(allRows);
    updateCards(allRows);
  } catch (err) {
    container.innerHTML = "❌ Error loading data";
    console.error("Load Error:", err);
  }
}

/**************************************************
 POPULATE CLASS DROPDOWN
**************************************************/
function populateClassFilter(rows) {
  const dd = document.getElementById("filterClass");
  dd.innerHTML = `<option value="">All Classes</option>`;

  const classOrder = {
    "PRE KG": 1,
    LKG: 2,
    UKG: 3,
    I: 4,
    II: 5,
    III: 6,
    IV: 7,
    V: 8,
    VI: 9,
    VII: 10,
    VIII: 11,
    IX: 12,
    X: 13,
  };

  [...new Set(rows.map((r) => r.admClass))]
    .sort((a, b) => (classOrder[a] || 999) - (classOrder[b] || 999))
    .forEach((cls) => {
      dd.innerHTML += `<option value="${cls}">${cls}</option>`;
    });
}

/**************************************************
 RENDER TABLE
**************************************************/
const admin = isAdmin();
function renderTable(rows) {
  // SORT BY enquiryNo (ascending)

  rows.sort((a, b) => {
    const numA = parseInt(a.enquiryNo.split("-")[2]);
    const numB = parseInt(b.enquiryNo.split("-")[2]);
    return numA - numB;
  });

  let html = `
    <table class="admTable">
      <thead>
        <tr>
          <th>Enquiry No</th>
          <th>Student</th>
          <th>Parent</th>
          <th>Class</th>
          <th>Mobile</th> 
          ${admin ? "<th>Application</th>" : ""}
          ${admin ? "<th>Entrance</th>" : ""}
          ${admin ? "<th>Interview</th>" : ""}
          ${admin ? "<th>Final Admission</th>" : ""}
          ${admin ? "<th>WhatsApp</th>" : ""}
          ${admin ? "<th>Delete</th>" : ""}
        </tr>
      </thead>
      <tbody>
  `;

  rows.forEach((r) => {
    html += `
    <tr>
      <td>${r.enquiryNo}</td>
      <td>${r.student}</td>
      <td>${r.parent}</td>
      <td>${r.admClass}</td>
      <td>${r.mobile}</td>
      
      ${
        admin
          ? `
      <td>
        <select onchange="updateStage('${
          r.enquiryNo
        }','application',this.value)">
          <option ${r.application === "NO" ? "selected" : ""}>NO</option>
          <option ${r.application === "YES" ? "selected" : ""}>YES</option>
        </select>
      </td>

      <td>
        <select onchange="updateStage('${r.enquiryNo}','entrance',this.value)">
          <option ${
            r.entrance === "NOT STARTED" ? "selected" : ""
          }>NOT STARTED</option>
          <option ${r.entrance === "PASS" ? "selected" : ""}>PASS</option>
          <option ${r.entrance === "FAIL" ? "selected" : ""}>FAIL</option>
        </select>
      </td>

      <td>
        <select onchange="updateStage('${r.enquiryNo}','interview',this.value)">
          <option ${
            r.interview === "PENDING" ? "selected" : ""
          }>PENDING</option>
          <option ${
            r.interview === "SELECTED" ? "selected" : ""
          }>SELECTED</option>
          <option ${
            r.interview === "REJECTED" ? "selected" : ""
          }>REJECTED</option>
        </select>
      </td>

      <td>
        <select onchange="updateStage('${
          r.enquiryNo
        }','finalAdmission',this.value)">
          <option ${r.finalAdmission === "NO" ? "selected" : ""}>NO</option>
          <option ${r.finalAdmission === "YES" ? "selected" : ""}>YES</option>
        </select>
      </td>
      `
          : ``
      }

      ${
        admin
          ? `
      <td>
  <button class="waIconBtn"
    onclick="sendManualWhatsApp('${r.mobile}','${r.parent}','${r.student}','${r.enquiryNo}')">
    <img src="whatsapp.png" class="waOnlyIcon" alt="WA">
  </button>
</td>




      <td>
        <button onclick="deleteEnquiry('${r.enquiryNo}')" class="deleteBtn">Delete</button>
      </td>
      `
          : ``
      }
    </tr>
  `;
  });

  html += "</tbody></table>";
  document.getElementById("admissionsContainer").innerHTML = html;
}

/**************************************************
 UPDATE DASHBOARD CARDS
**************************************************/
function applyFilters() {
  const q = searchBox.value.toLowerCase();

  const filtered = allRows.filter(
    (r) =>
      (r.student.toLowerCase().includes(q) ||
        r.parent.toLowerCase().includes(q) ||
        r.enquiryNo.toLowerCase().includes(q)) &&
      (!filterClass.value || r.admClass === filterClass.value) &&
      (!filterApplication.value || r.application === filterApplication.value) &&
      (!filterEntrance.value || r.entrance === filterEntrance.value) &&
      (!filterInterview.value || r.interview === filterInterview.value) &&
      (!filterFinal.value || r.finalAdmission === filterFinal.value)
  );

  renderTable(filtered);
  updateCards(filtered); // <-- ADD THIS ✔
}

/**************************************************
 UPDATE SUPABASE VALUES
**************************************************/
async function updateStage(enquiryNo, field, value) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admissions?enquiryNo=eq.${enquiryNo}`,
      {
        method: "PATCH",
        headers: SUPA_HEADERS,
        body: JSON.stringify({ [field]: value }),
      }
    );

    if (!res.ok) throw new Error("Update failed");

    // update local row
    const row = allRows.find((r) => r.enquiryNo === enquiryNo);
    row[field] = value;

    // WhatsApp Message
    let msg = "";
    if (field === "application")
      msg =
        value === "YES"
          ? waApplicationIssued(row.student, row.parent, enquiryNo)
          : waApplicationNotIssued(row.student, row.parent, enquiryNo);

    if (field === "entrance")
      msg = waEntranceResult(row.student, row.parent, value, enquiryNo);

    if (field === "interview")
      msg = waInterviewResult(row.student, row.parent, value, enquiryNo);

    if (field === "finalAdmission")
      msg = waFinalAdmission(row.student, row.parent, value, enquiryNo);

    if (msg) openWhatsApp(row.mobile, msg);

    alert("✔ Updated successfully!");
  } catch (err) {
    alert("❌ Update failed");
    console.error(err);
  }
}

let deleteTarget = null;

function deleteEnquiry(enquiryNo) {
  deleteTarget = enquiryNo;

  document.getElementById(
    "deleteMsg"
  ).innerText = `Are you sure you want to delete enquiry: ${enquiryNo}?`;

  document.getElementById("deleteModal").style.display = "flex";

  document.getElementById("confirmDeleteBtn").onclick = confirmDelete;
}

function closeDeleteModal() {
  deleteTarget = null;
  document.getElementById("deleteModal").style.display = "none";
}

async function confirmDelete() {
  if (!deleteTarget) return;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admissions?enquiryNo=eq.${deleteTarget}`,
      {
        method: "DELETE",
        headers: SUPA_HEADERS,
      }
    );

    if (!res.ok) throw new Error("Error deleting entry");

    allRows = allRows.filter((r) => r.enquiryNo !== deleteTarget);

    renderTable(allRows);
    updateCards(allRows);

    closeDeleteModal();
    alert("✔ Enquiry deleted successfully!");
  } catch (err) {
    alert("❌ Failed to delete entry");
    closeDeleteModal();
  }
}

/**************************************************
 FILTER
**************************************************/
function applyFilters() {
  const q = searchBox.value.toLowerCase();

  const filtered = allRows.filter(
    (r) =>
      (r.student.toLowerCase().includes(q) ||
        r.parent.toLowerCase().includes(q) ||
        r.enquiryNo.toLowerCase().includes(q)) &&
      (!filterClass.value || r.admClass === filterClass.value) &&
      (!filterApplication.value || r.application === filterApplication.value) &&
      (!filterEntrance.value || r.entrance === filterEntrance.value) &&
      (!filterInterview.value || r.interview === filterInterview.value) &&
      (!filterFinal.value || r.finalAdmission === filterFinal.value)
  );

  renderTable(filtered);
}

/**************************************************
 WHATSAPP HANDLING
**************************************************/
function openWhatsApp(mobile, message) {
  mobile = mobile.replace(/\D/g, "").slice(-10);
  const url = `https://web.whatsapp.com/send?phone=91${mobile}&text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
}

function sendManualWhatsApp(mobile, parent, student, enquiryNo) {
  const r = allRows.find((x) => x.enquiryNo === enquiryNo);

  let msg =
    r.finalAdmission !== "NO"
      ? waFinalAdmission(student, parent, r.finalAdmission, enquiryNo)
      : r.interview !== "PENDING"
      ? waInterviewResult(student, parent, r.interview, enquiryNo)
      : r.entrance !== "NOT STARTED"
      ? waEntranceResult(student, parent, r.entrance, enquiryNo)
      : r.application === "YES"
      ? waApplicationIssued(student, parent, enquiryNo)
      : waApplicationNotIssued(student, parent, enquiryNo);

  openWhatsApp(mobile, msg);
}

/**************************************************
 WHATSAPP MESSAGE TEMPLATES – PREMIUM VERSION
 Clean, Attractive, Parent-Friendly Messages
**************************************************/

// 👉 Application Issued
function waApplicationIssued(student, parent, enq) {
  return `
📄 *Application Issued Successfully*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,  
We are happy to inform you that the *Admission Application* for *${student}* has been issued.

🕒 Kindly complete and submit the form at the earliest.

Thank you for choosing *Kotak Salesian School*.  
🌟 _We look forward to supporting your child’s educational journey._`;
}

// 👉 Application NOT Issued
function waApplicationNotIssued(student, parent, enq) {
  return `
📄 *Application Pending*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,  
The admission application for *${student}* is *not yet collected*.

📌 Kindly visit the school office to collect the form.

🙏 Thank you for your interest in *Kotak Salesian School*.`;
}

// 👉 Entrance Result
function waEntranceResult(student, parent, result, enq) {
  if (result === "PASS") {
    return `
🎉 *Entrance Test Result – PASS*

📝 *Enquiry No:* ${enq}

Congratulations Parent *(${parent})*!  
Your child *${student}* has *successfully passed* the entrance test.

📌 Please visit the school for the next steps in the admission process.

🌟 _We are excited to welcome ${student} into our school community!_`;
  } else {
    return `
❌ *Entrance Test Result – FAIL*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,  
We appreciate the efforts of *${student}*. However, the entrance test result did not meet the required criteria.

🙏 Thank you for your time and interest in our school.  
We wish ${student} the very best for future opportunities.`;
  }
}

// 👉 Interview Result
function waInterviewResult(student, parent, status, enq) {
  return `
🎤 *Interview Status Update*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,  
The interview for *${student}* has been updated.

📌 *Status:* ${status}

Thank you for your active participation.  
We will keep you informed about further steps.`;
}

// 👉 Final Admission Decision
function waFinalAdmission(student, parent, status, enq) {
  if (status === "YES") {
    return `
🎉 *Admission Confirmed* 🎉

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,  
We are delighted to inform you that *${student}* has been *granted admission* to Kotak Salesian School.

🎒 Welcome to our school family!  
🙏 Kindly complete the remaining formalities at the earliest.`;
  } else {
    return `
❌ *Admission Not Approved*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,  
We sincerely appreciate your interest in admitting *${student}* to our institution.

Unfortunately, the admission could not be approved at this time.

🙏 Thank you once again, and we wish your child great success ahead.`;
  }
}

/**************************************************
 EXCEL EXPORT FUNCTIONALITY
**************************************************/

async function exportAdmissionsExcel() {
  // Fetch all records
  const { data, error } = await db
    .from("admissions")
    .select("*")
    .order("enquiryNo", { ascending: true });

  if (error) {
    alert("❌ Failed to load admissions data");
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    alert("No admissions found!");
    return;
  }

  // Prepare rows for Excel
  const formatted = data.map((r) => ({
    "ENQUIRY NO": r.enquiryNo,
    "STUDENT NAME": r.student,
    "PARENT NAME": r.parent,
    CLASS: r.admClass,
    MOBILE: r.mobile,
    DOB: r.dob,
    AGE: r.age,
    "ELIGIBLE CLASS": r.eligible,
    DATE: r.date,
    APPLICATION: r.application,
    "ENTRANCE RESULT": r.entrance,
    "INTERVIEW STATUS": r.interview,
    "FINAL ADMISSION": r.finalAdmission,
  }));

  // Convert to Excel
  const sheet = XLSX.utils.json_to_sheet(formatted);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Admissions");

  // Download file
  XLSX.writeFile(book, "Admissions_2026-27.xlsx");

  alert("📄 Excel exported successfully!");
}

// 🔥 Make function available to HTML button
window.exportAdmissionsExcel = exportAdmissionsExcel;

/**************************************************
 UPDATE DASHBOARD CARDS (WITH ANIMATION)
**************************************************/
/**************************************************
 UPDATE DASHBOARD CARDS (Animated)
**************************************************/
function updateCards(rows) {
  const totalEnq = rows.length;
  const totalApp = rows.filter((r) => r.application === "YES").length;
  const totalPass = rows.filter((r) => r.entrance === "PASS").length;
  const totalFinal = rows.filter((r) => r.finalAdmission === "YES").length;

  animateNumber("totalEnq", totalEnq);
  animateNumber("totalApp", totalApp);
  animateNumber("totalPass", totalPass);
  animateNumber("totalFinal", totalFinal);
}

/**************************************************
 COUNT-UP ANIMATION FOR DASHBOARD CARDS
**************************************************/
/**************************************************
 COUNT-UP ANIMATION (Smooth & Lightweight)
**************************************************/
function animateNumber(elementId, finalValue, duration = 700) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const startValue = 0;
  const frameRate = 16; // ~60 FPS
  const totalFrames = Math.round(duration / frameRate);
  let currentFrame = 0;

  const counter = setInterval(() => {
    currentFrame++;
    const progress = currentFrame / totalFrames;

    // ease-out effect
    const easedValue = Math.floor(finalValue * (1 - Math.pow(1 - progress, 3)));

    el.textContent = easedValue;

    if (currentFrame >= totalFrames) {
      clearInterval(counter);
      el.textContent = finalValue; // ensure exact
    }
  }, frameRate);
}

function adminLogin() {
  const pwd = prompt("Enter Admin Password:");

  if (pwd === "kotak@1963") {
    alert("Admin Access Granted ✔");
    localStorage.setItem("isAdmin", "true");
    loadAdminButtons();
    loadAdmissions(); // reload table with delete column
  } else {
    alert("❌ Wrong password");
  }
}

function adminLogout() {
  localStorage.removeItem("isAdmin");
  alert("Logged out ✔");
  loadAdminButtons();
  loadAdmissions(); // reload without delete column
}

function isAdmin() {
  return localStorage.getItem("isAdmin") === "true";
}

function loadAdminButtons() {
  const isAdm = isAdmin();
  const box = document.getElementById("adminButtons");

  if (isAdm) {
    box.innerHTML = `
      <button class="btn-primary" onclick="adminLogout()">Logout</button>
    `;
  } else {
    box.innerHTML = `
      <button class="btn-primary" onclick="adminLogin()">Login</button>
    `;
  }
}

/**************************************************
 INIT
**************************************************/
loadAdminButtons();
loadAdmissions();
