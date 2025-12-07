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
  "Content-Type": "application/json"
};

let allRows = []; // cache

/**************************************************
 LOAD ADMISSIONS FROM SUPABASE
**************************************************/
async function loadAdmissions() {
  const container = document.getElementById("admissionsContainer");
  container.innerHTML = "Loading…";

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admissions?select=*`,
      { method: "GET", headers: SUPA_HEADERS }
    );

    allRows = await res.json();

    populateClassFilter(allRows);
    renderTable(allRows);
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

  [...new Set(rows.map(r => r.admClass))]
    .sort()
    .forEach(cls => (dd.innerHTML += `<option value="${cls}">${cls}</option>`));
}

/**************************************************
 RENDER TABLE
**************************************************/
function renderTable(rows) {
  let html = `
    <table class="admTable">
      <thead>
        <tr>
          <th>Enquiry No</th>
          <th>Student</th>
          <th>Parent</th>
          <th>Class</th>
          <th>Application</th>
          <th>Entrance</th>
          <th>Interview</th>
          <th>Final Admission</th>
          <th>WhatsApp</th>
        </tr>
      </thead>
      <tbody>
  `;

  rows.forEach(r => {
    html += `
      <tr>
        <td>${r.enquiryNo}</td>
        <td>${r.student}</td>
        <td>${r.parent}</td>
        <td>${r.admClass}</td>

        <td>
          <select onchange="updateStage('${r.enquiryNo}','application',this.value)">
            <option ${r.application === "NO" ? "selected" : ""}>NO</option>
            <option ${r.application === "YES" ? "selected" : ""}>YES</option>
          </select>
        </td>

        <td>
          <select onchange="updateStage('${r.enquiryNo}','entrance',this.value)">
            <option ${r.entrance === "NOT STARTED" ? "selected" : ""}>NOT STARTED</option>
            <option ${r.entrance === "PASS" ? "selected" : ""}>PASS</option>
            <option ${r.entrance === "FAIL" ? "selected" : ""}>FAIL</option>
          </select>
        </td>

        <td>
          <select onchange="updateStage('${r.enquiryNo}','interview',this.value)">
            <option ${r.interview === "PENDING" ? "selected" : ""}>PENDING</option>
            <option ${r.interview === "SELECTED" ? "selected" : ""}>SELECTED</option>
            <option ${r.interview === "REJECTED" ? "selected" : ""}>REJECTED</option>
          </select>
        </td>

        <td>
          <select onchange="updateStage('${r.enquiryNo}','finalAdmission',this.value)">
            <option ${r.finalAdmission === "NO" ? "selected" : ""}>NO</option>
            <option ${r.finalAdmission === "YES" ? "selected" : ""}>YES</option>
          </select>
        </td>

        <td>
          <button onclick="sendManualWhatsApp('${r.mobile}','${r.parent}','${r.student}','${r.enquiryNo}')">
            Send
          </button>
        </td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  document.getElementById("admissionsContainer").innerHTML = html;
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
        body: JSON.stringify({ [field]: value })
      }
    );

    if (!res.ok) throw new Error("Update failed");

    // update local row
    const row = allRows.find(r => r.enquiryNo === enquiryNo);
    row[field] = value;

    // WhatsApp Message
    let msg = "";
    if (field === "application")
      msg = value === "YES"
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

/**************************************************
 FILTER
**************************************************/
function applyFilters() {
  const q = searchBox.value.toLowerCase();

  const filtered = allRows.filter(r =>
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
  const url = `https://web.whatsapp.com/send?phone=91${mobile}&text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function sendManualWhatsApp(mobile, parent, student, enquiryNo) {
  const r = allRows.find(x => x.enquiryNo === enquiryNo);

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
 MESSAGE TEMPLATES
**************************************************/
function waApplicationIssued(student, parent, enq) {
  return `📄 *Application Issued*\nEnquiry: ${enq}\n\nDear Parent (${parent}),\nApplication issued for ${student}.`;
}

function waApplicationNotIssued(student, parent, enq) {
  return `📄 *Application NOT Issued*\nEnquiry: ${enq}\n\nDear Parent (${parent}),\nPlease collect the form for ${student}.`;
}

function waEntranceResult(student, parent, result, enq) {
  return result === "PASS"
    ? `✅ *Entrance Test – PASS*\nEnquiry: ${enq}\n\n${student} has passed.`
    : `❌ *Entrance Test – FAIL*\nEnquiry: ${enq}\n\nThank you for your interest.`;
}

function waInterviewResult(student, parent, status, enq) {
  return `🎤 *Interview Status*\nEnquiry: ${enq}\n\n${student} – ${status}.`;
}

function waFinalAdmission(student, parent, status, enq) {
  return status === "YES"
    ? `🎉 *Admission Confirmed*\nEnquiry: ${enq}\n\n${student} is admitted.`
    : `❌ *Admission Not Approved*\nEnquiry: ${enq}\n\nThank you.`;
}

/**************************************************
 INIT
**************************************************/
loadAdmissions();
