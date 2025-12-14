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