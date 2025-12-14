/**************************************************
 ADMISSION
**************************************************/

function showProceedButton() {
  if (document.getElementById("proceedBtn")) return;

  const div = document.createElement("div");
  div.className = "proceed-container";
  div.innerHTML = `<button id="proceedBtn" class="proceed-btn">Proceed to Admission</button>`;
  document.getElementById("result").appendChild(div);

  div.onclick = () =>
    (document.getElementById("admissionModal").style.display = "block");
}

function closeModal() {
  document.getElementById("admissionModal").style.display = "none";
}

function normalizeName(name) {
  return name
    .replace(/\./g, " ") // replace dots with space
    .replace(/\s+/g, " ") // collapse multiple spaces into one
    .trim() // trim leading & trailing spaces
    .toUpperCase(); // optional: normalize case
}

async function submitAdmission() {
  const parent = normalizeName(parentName.value);
  const student = normalizeName(studentName.value);
  const mobileNum = mobile.value.trim();
  const admClassValue = admClass.value;
  const dob = document.getElementById("dob").value;
  const age = getAgeString(dob);

  if (!parent || !student || !mobileNum || !admClassValue || !dob)
    return alert("Please fill all required fields");

  const { data: enquiryNo } = await db.rpc("get_next_enquiry_no");

  const payload = {
    enquiryNo,
    student,
    parent,
    mobile: mobileNum,
    admClass: admClassValue,
    dob: formatDateDDMMYYYY(dob),
    date: formatDateDDMMYYYY(new Date()),
    application: "NO",
    entrance: "NOT STARTED",
    interview: "PENDING",
    finalAdmission: "NO",
    timestamp: new Date().toISOString(),
  };

  const { error } = await db.from("admissions").insert([payload]);
  if (error) return alert("Error saving admission");

  closeModal();
  sendWhatsApp(mobileNum, parent, student, dob, age, admClassValue);
}

/**************************************************
 AGE + KPI UTILS
**************************************************/
function getAgeString(dobStr) {
  if (!dobStr) return "";

  const parts = dobStr.split("-");
  const dob =
    parts[0].length === 4
      ? new Date(dobStr)
      : new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

  if (isNaN(dob)) return "";

  const now = new Date();
  let y = now.getFullYear() - dob.getFullYear();
  let m = now.getMonth() - dob.getMonth();
  let d = now.getDate() - dob.getDate();

  if (d < 0) {
    m--;
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }

  return `${y} years, ${m} months, ${d} day(s)`;
}

function animateCount(el, target, duration = 2000) {
  const start = performance.now();
  el.classList.add("kpi-pulse");

  function ease(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(ease(p) * target).toLocaleString();

    if (p < 1) requestAnimationFrame(tick);
    else el.classList.remove("kpi-pulse");
  }

  requestAnimationFrame(tick);
}

function renderKPIs(data) {
  if (
    typeof kpiEnquiries === "undefined" ||
    typeof kpiApps === "undefined" ||
    typeof kpiEntrance === "undefined" ||
    typeof kpiInterview === "undefined" ||
    typeof kpiFinal === "undefined"
  ) {
    return; // KPIs not present on this page
  }

  animateCount(kpiEnquiries, data.length);
  animateCount(kpiApps, data.filter((r) => r.application === "YES").length);
  animateCount(kpiEntrance, data.filter((r) => r.entrance === "PASS").length);
  animateCount(
    kpiInterview,
    data.filter((r) => r.interview === "SELECTED").length
  );
  animateCount(kpiFinal, data.filter((r) => r.finalAdmission === "YES").length);
}

window.getAgeString = getAgeString;
window.renderKPIs = renderKPIs;

window.submitAdmission = submitAdmission;
window.closeModal = closeModal;
