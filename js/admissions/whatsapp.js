function openWhatsApp(mobile, message) {
  mobile = (mobile || "").replace(/\D/g, "").slice(-10);
  const url = `https://web.whatsapp.com/send?phone=91${mobile}&text=${encodeURIComponent(
    message
  )}`;
  window.open(url, "_blank");
}

function sendWhatsApp(mobile, parent, student, dob, age, admClass) {
  mobile = mobile.replace(/\D/g, "").slice(-10);
  if (mobile.length !== 10) return alert("Invalid Mobile Number");

  const message = `
🌟 *Kotak Salesian School – Visakhapatnam* 🌟

Dear Parent *(${parent})*,

Greetings from *Kotak Salesian School*.

Thank you for your enquiry regarding the admission of *${student}*.  
Please find the initial details below:

👶 *Student Name:* ${student}  
🎂 *Date of Birth:* ${dob}  
📅 *Age:* ${age}  
🏫 *Seeking Class:* ${admClass}

📌 *Admission application forms will be issued from 15 December 2025.*  
📌 *Entrance assessment is mandatory for classes from UKG onwards.*  
📌 *Final admission confirmation is subject to successful completion of all stages.*

For any clarification, please feel free to contact us:
📞 *School Office:* 99495 23412

We look forward to assisting you through the admission process.

Warm regards,  
*Kotak Salesian School*  
_“Aspire to Achieve”_
`;

  openWhatsApp(mobile, message);
}

function waApplicationIssued(student, parent, enq) {
  return `
📄 *Admission Application Issued*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,

We are pleased to inform you that the *Admission Application Form* for *${student}* has been successfully issued.

📌 Kindly complete and submit the application along with the required documents within the stipulated time.

Thank you for choosing *Kotak Salesian School*.  
We look forward to welcoming your child.

Warm regards,  
*Kotak Salesian School*
`;
}

function waApplicationNotIssued(student, parent, enq) {
  return `
📄 *Admission Application – Pending*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,

This is to inform you that the *Admission Application Form* for *${student}* has not yet been collected.

📌 Kindly visit the school office to collect the application form at your convenience.

Thank you for your interest in *Kotak Salesian School*.

Warm regards,  
*Kotak Salesian School*
`;
}

function waEntranceResult(student, parent, result, enq) {
  if (result === "PASS") {
    return `
🎉 *Entrance Assessment – Qualified*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,

Congratulations!  
We are happy to inform you that *${student}* has *successfully qualified* in the entrance assessment.

📌 Please visit the school office to proceed with the next stage of the admission process.

We look forward to your continued cooperation.

Warm regards,  
*Kotak Salesian School*
`;
  } else {
    return `
📄 *Entrance Assessment – Result Update*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,

We appreciate the effort and participation of *${student}* in the entrance assessment.

After careful evaluation, the required criteria could not be met at this stage.

🙏 Thank you for your interest in *Kotak Salesian School*.  
We wish your child every success in future endeavors.

Warm regards,  
*Kotak Salesian School*
`;
  }
}

function waEntranceResult(student, parent, result, enq) {
  if (result === "PASS") {
    return `
🎉 *Entrance Assessment – Qualified*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,

Congratulations!  
We are happy to inform you that *${student}* has *successfully qualified* in the entrance assessment.

📌 Please visit the school office to proceed with the next stage of the admission process.

We look forward to your continued cooperation.

Warm regards,  
*Kotak Salesian School*
`;
  } else {
    return `
📄 *Entrance Assessment – Result Update*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,

We appreciate the effort and participation of *${student}* in the entrance assessment.

After careful evaluation, the required criteria could not be met at this stage.

🙏 Thank you for your interest in *Kotak Salesian School*.  
We wish your child every success in future endeavors.

Warm regards,  
*Kotak Salesian School*
`;
  }
}

function waInterviewResult(student, parent, status, enq) {
  return `
🎤 *Interview Status Update*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,

This is to inform you that the interview process for *${student}* has been completed.

📌 *Current Status:* ${status}

We appreciate your time and cooperation.  
Further updates will be shared as applicable.

Warm regards,  
*Kotak Salesian School*
`;
}

function waFinalAdmission(student, parent, status, enq) {
  if (status === "YES") {
    return `
🎉 *Admission Confirmed* 🎉

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,

We are delighted to inform you that *${student}* has been *granted admission* to *Kotak Salesian School*.

🎒 Welcome to the Kotak Salesian family!  
📌 Kindly complete the remaining admission formalities at the school office.

We look forward to a fruitful academic journey ahead.

Warm regards,  
*Kotak Salesian School*
`;
  } else {
    return `
📄 *Final Admission Status Update*

📝 *Enquiry No:* ${enq}

Dear Parent *(${parent})*,

Thank you for your interest in admitting *${student}* to *Kotak Salesian School*.

After careful consideration, we regret to inform you that admission could not be approved at this time.

🙏 We sincerely appreciate your understanding and wish your child success in future academic pursuits.

Warm regards,  
*Kotak Salesian School*
`;
  }
}
