/**************************************************
 ADMISSIONS DASHBOARD (Tailwind + Supabase REST)
 Clean, structured, production-ready version
**************************************************/

/* ------------------------------------------------
   SUPABASE CONFIG
--------------------------------------------------*/
const SUPABASE_URL = "https://osrqmmsimjjkqsiwaiby.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zcnFtbXNpbWpqa3FzaXdhaWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzM3ODUsImV4cCI6MjA4MDY0OTc4NX0.gh-DzLvmw5wsXkp8z_ot5SuLbusGShi9xZUKFpETE4A";

const SUPA_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

/* ------------------------------------------------
   GLOBAL STATE
--------------------------------------------------*/
const PAGE_SIZE = 25;
let allData = [];
let filtered = [];
let currentPage = 1;

/* ------------------------------------------------
   DOM ELEMENTS
--------------------------------------------------*/
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const filterClass = document.getElementById("filterClass");
const filterEligibility = document.getElementById("filterEligibility");
const filterStage = document.getElementById("filterStage");
const resetFilters = document.getElementById("resetFilters");
const exportBtn = document.getElementById("exportBtn");

// KPI Elements
const kpiEnquiries = document.getElementById("kpi-enquiries");
const kpiApps = document.getElementById("kpi-apps");
const kpiEntrance = document.getElementById("kpi-entrance");
const kpiInterview = document.getElementById("kpi-interview");
const kpiFinal = document.getElementById("kpi-final");

/**************************************************
 AGE CALCULATION
**************************************************/
function getAgeString(dobStr) {
  if (!dobStr) return "";

  const parts = dobStr.split("-");
  let dob;

  // Try both YYYY-MM-DD and DD-MM-YYYY
  if (parts[0].length === 4) {
    dob = new Date(dobStr);
  } else {
    dob = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }

  if (isNaN(dob)) return "";

  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} years, ${months} months, ${days} day(s)`;
}

/**************************************************
 KPI RENDERING
**************************************************/
function renderKPIs(data) {
  kpiEnquiries.textContent = data.length;
  kpiApps.textContent = data.filter((r) => r.application === "YES").length;
  kpiEntrance.textContent = data.filter((r) => r.entrance === "PASS").length;
  kpiInterview.textContent = data.filter(
    (r) => r.interview === "SELECTED"
  ).length;
  kpiFinal.textContent = data.filter((r) => r.finalAdmission === "YES").length;
}

/**************************************************
 POPULATE CLASS DROPDOWN
**************************************************/
function populateClassFilter(data) {
  const classes = [
    ...new Set(data.map((d) => d.admClass).filter(Boolean)),
  ].sort();
  filterClass.innerHTML = `<option value="">All Classes</option>`;
  classes.forEach((c) => {
    filterClass.innerHTML += `<option value="${c}">${c}</option>`;
  });
}

/**************************************************
 TABLE RENDERING (With Admin Actions)
**************************************************/
function renderTable(page = 1) {
  tableBody.innerHTML = "";

  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  if (pageRows.length === 0) {
    tableBody.innerHTML = `<tr><td class="p-3 text-center text-gray-500" colspan="12">No records found</td></tr>`;
    return;
  }

  pageRows.forEach((r) => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-50";
    tr.className = "hover:bg-gray-50 cursor-pointer";
    tr.onclick = () => openDetailModal(r);

    tr.innerHTML = `
      <td class="p-3">${r.enquiryNo?.split("-").pop() || ""}</td>
      <td class="p-3">${r.parent || ""}</td>
      <td class="p-3">${r.student || ""}</td>
      <td class="p-3">${r.admClass || ""}</td>
      <td class="p-3">${r.mobile || ""}</td>
      <td class="p-3">${r.dob || ""}</td>
      <td class="p-3">${r.age || getAgeString(r.dob)}</td>
      <td class="p-3">
        <span class="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-medium">
          ${r.eligible || ""}
        </span>
      </td>

      ${
        isAdmin()
          ? `
        <td class="p-3">
          <select class="border px-2 py-1 rounded"
                  onchange="updateStage('${
                    r.enquiryNo
                  }','application',this.value)">
            <option ${r.application === "NO" ? "selected" : ""}>NO</option>
            <option ${r.application === "YES" ? "selected" : ""}>YES</option>
          </select>
        </td>

        <td class="p-3">
          <select class="border px-2 py-1 rounded"
                  onchange="updateStage('${
                    r.enquiryNo
                  }','entrance',this.value)">
            <option ${
              r.entrance === "NOT STARTED" ? "selected" : ""
            }>NOT STARTED</option>
            <option ${r.entrance === "PASS" ? "selected" : ""}>PASS</option>
            <option ${r.entrance === "FAIL" ? "selected" : ""}>FAIL</option>
          </select>
        </td>

        <td class="p-3">
          <select class="border px-2 py-1 rounded"
                  onchange="updateStage('${
                    r.enquiryNo
                  }','interview',this.value)">
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

        <td class="p-3">
          <select class="border px-2 py-1 rounded"
                  onchange="updateStage('${
                    r.enquiryNo
                  }','finalAdmission',this.value)">
            <option ${r.finalAdmission === "NO" ? "selected" : ""}>NO</option>
            <option ${r.finalAdmission === "YES" ? "selected" : ""}>YES</option>
          </select>
        </td>
      `
          : ""
      }
    `;

    tableBody.appendChild(tr);
  });

  // Pagination Info
  currentPage = page;
  document.getElementById("currentPage").textContent = `Page ${page}`;
  document.getElementById("prevPage").disabled = page === 1;
  document.getElementById("nextPage").disabled =
    start + PAGE_SIZE >= filtered.length;

  document.getElementById("showingInfo").textContent = `Showing ${
    start + 1
  } to ${start + pageRows.length} of ${filtered.length} records`;
}

/**************************************************
 FILTERING ENGINE
**************************************************/
function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const cls = filterClass.value;
  const eligibility = filterEligibility.value;
  const stage = filterStage.value;

  filtered = allData.filter((d) => {
    if (cls && d.admClass !== cls) return false;

    if (eligibility) {
      const actual = String(d.eligiblestatus || d.eligible || "").toUpperCase();
      if (eligibility !== actual) return false;
    }

    if (stage) {
      if (stage === "application" && d.application !== "YES") return false;
      if (stage === "entrance" && d.entrance !== "PASS") return false;
      if (stage === "interview" && d.interview !== "SELECTED") return false;
      if (stage === "final" && d.finalAdmission !== "YES") return false;
    }

    if (!q) return true;

    return `${d.student} ${d.parent} ${d.mobile} ${d.enquiryNo}`
      .toLowerCase()
      .includes(q);
  });

  renderTable(1);
  renderKPIs(filtered);
}

/**************************************************
 EVENT LISTENERS
**************************************************/
searchInput.addEventListener("input", () => {
  clearTimeout(window._searchDebounce);
  window._searchDebounce = setTimeout(applyFilters, 300);
});

[filterClass, filterEligibility, filterStage].forEach((el) =>
  el.addEventListener("change", applyFilters)
);

resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  filterClass.value = "";
  filterEligibility.value = "";
  filterStage.value = "";
  applyFilters();
});

/**************************************************
 EXCEL EXPORT
**************************************************/
exportBtn.addEventListener("click", () => {
  const rows = filtered.map((r) => ({
    EnquiryNo: r.enquiryNo,
    Parent: r.parent,
    Student: r.student,
    Class: r.admClass,
    Mobile: r.mobile,
    DOB: r.dob,
    Age: r.age || getAgeString(r.dob),
    Eligible: r.eligible,
    Application: r.application,
    Entrance: r.entrance,
    Interview: r.interview,
    FinalAdmission: r.finalAdmission,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Admissions");
  XLSX.writeFile(wb, "admissions_export.xlsx");
});

/**************************************************
 LOAD DATA FROM SUPABASE
**************************************************/
async function loadData() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/admissions?select=*`, {
      headers: SUPA_HEADERS,
    });

    const data = await res.json();

    allData = data.sort((a, b) => {
      const na = parseInt(a.enquiryNo?.split("-").pop());
      const nb = parseInt(b.enquiryNo?.split("-").pop());
      return nb - na;
    });

    filtered = [...allData];

    populateClassFilter(allData);
    renderKPIs(allData);
    renderTable(1);
  } catch (err) {
    console.error("Load Error:", err);
  }
}

/**************************************************
 ADMIN LOGIN / LOGOUT SYSTEM
**************************************************/
function submitAdminLogin() {
  const pwd = document.getElementById("adminPwd").value.trim();
  if (pwd === "admin") {
    localStorage.setItem("isAdmin", "true");
    closeAdminModal();
    loadAdminButtons();
    location.reload();
  } else {
    alert("❌ Wrong password");
  }
}

function adminLogin() {
  document.getElementById("adminModal").style.display = "flex";
}

function closeAdminModal() {
  document.getElementById("adminModal").style.display = "none";
  document.getElementById("adminPwd").value = "";
}

function adminLogout() {
  document.getElementById("logoutModal").style.display = "flex";
}

function closeLogoutModal() {
  document.getElementById("logoutModal").style.display = "none";
}

function confirmLogout() {
  localStorage.removeItem("isAdmin");
  closeLogoutModal();
  location.reload();
}

function isAdmin() {
  return localStorage.getItem("isAdmin") === "true";
}

function loadAdminButtons() {
  const box = document.getElementById("adminButtons");

  if (isAdmin()) {
    box.innerHTML = `
      <button class="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm"
              onclick="adminLogout()">
        Logout
      </button>
    `;

    // SHOW ADMIN COLUMNS
    document.getElementById("th-application").style.display = "";
    document.getElementById("th-entrance").style.display = "";
    document.getElementById("th-interview").style.display = "";
    document.getElementById("th-final").style.display = "";

  } else {
    box.innerHTML = `
      <button class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm"
              onclick="adminLogin()">
        Login
      </button>
    `;

    // HIDE ADMIN COLUMNS
    document.getElementById("th-application").style.display = "none";
    document.getElementById("th-entrance").style.display = "none";
    document.getElementById("th-interview").style.display = "none";
    document.getElementById("th-final").style.display = "none";
  }
}


/**************************************************
 UPDATE STAGE (PATCH to Supabase)
**************************************************/
async function updateStage(enquiryNo, field, value) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/admissions?enquiryNo=eq.${enquiryNo}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: SUPA_HEADERS,
      body: JSON.stringify({ [field]: value }),
    });

    if (!res.ok) throw new Error("Update failed");

    const r = allData.find((x) => x.enquiryNo === enquiryNo);
    r[field] = value;

    let msg = "";

    if (field === "application") {
      msg =
        value === "YES"
          ? waApplicationIssued(r.student, r.parent, enquiryNo)
          : waApplicationNotIssued(r.student, r.parent, enquiryNo);
    }

    if (field === "entrance") {
      msg = waEntranceResult(r.student, r.parent, value, enquiryNo);
    }

    if (field === "interview") {
      msg = waInterviewResult(r.student, r.parent, value, enquiryNo);
    }

    if (field === "finalAdmission") {
      msg = waFinalAdmission(r.student, r.parent, value, enquiryNo);
    }

    if (msg) openWhatsApp(r.mobile, msg);

    alert("Stage updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Error updating stage");
  }
}

function openWhatsApp(mobile, message) {
  mobile = (mobile || "").replace(/\D/g, "").slice(-10);
  const url = `https://web.whatsapp.com/send?phone=91${mobile}&text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
}

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

function openDetailModal(row) {
  const html = `
    <p><strong>Enquiry No:</strong> ${row.enquiryNo}</p>
    <p><strong>Parent:</strong> ${row.parent}</p>
    <p><strong>Student:</strong> ${row.student}</p>
    <p><strong>Class:</strong> ${row.admClass}</p>
    <p><strong>Mobile:</strong> ${row.mobile}</p>
    <p><strong>DOB:</strong> ${row.dob}</p>
    <p><strong>Age:</strong> ${row.age || getAgeString(row.dob)}</p>
    <p><strong>Eligible Class:</strong> ${row.eligible}</p>
    <hr>
    <p><strong>Application:</strong> ${row.application}</p>
    <p><strong>Entrance:</strong> ${row.entrance}</p>
    <p><strong>Interview:</strong> ${row.interview}</p>
    <p><strong>Final Admission:</strong> ${row.finalAdmission}</p>
  `;

  document.getElementById("detailContent").innerHTML = html;
  document.getElementById("detailModal").style.display = "flex";
}

function closeDetailModal() {
  document.getElementById("detailModal").style.display = "none";
}

/**************************************************
 INIT
**************************************************/
document.addEventListener("DOMContentLoaded", () => {
  loadAdminButtons();
  loadData();
});
