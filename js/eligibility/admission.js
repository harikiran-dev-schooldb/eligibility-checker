/**************************************************
 ADMISSION
**************************************************/

function showProceedButton() {
  if (document.getElementById("proceedBtn")) return;

  const div = document.createElement("div");
  div.className = "proceed-container";
  div.innerHTML =
    `<button id="proceedBtn" class="proceed-btn">Proceed to Admission</button>`;
  document.getElementById("result").appendChild(div);

  div.onclick = () =>
    (document.getElementById("admissionModal").style.display = "block");
}

function closeModal() {
  document.getElementById("admissionModal").style.display = "none";
}

async function submitAdmission() {
  const parent = parentName.value.trim();
  const student = studentName.value.trim();
  const mobileNum = mobile.value.trim();
  const admClassValue = admClass.value;
  const dob = document.getElementById("dob").value;

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
  sendWhatsApp(mobileNum, parent, student, dob);
}
