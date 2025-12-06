// --------------------------------------------------
// ENSURE LOADTABLE RUNS ON FIRST LOAD
// --------------------------------------------------

// Ensure loadTable runs even when app.js is loaded AFTER DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadTable);
} else {
  loadTable(); // DOM already loaded → run immediately
}

// --------------------------------------------------
// AGE CALCULATION
// --------------------------------------------------
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

// --------------------------------------------------
// ELIGIBILITY CHECK
// --------------------------------------------------
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

  resultDiv.innerHTML = `
  Age: ${ageObj.formatted}<br><br>
  <span style="color:#d32f2f;font-size:32px;font-weight:bold;">
    Eligible Class: ${eligible}
  </span><br><br>
`;

  let message = "";
  let emoji = "🎓";

  if (["Pre KG", "LKG", "UKG"].includes(eligible)) {
    emojis = ["🎈", "🧸", "🎊"];
    message = "Welcome to Early Learning!";
  } else if (["I", "II", "III", "IV", "V"].includes(eligible)) {
    emojis = ["⭐", "✨", "🎉"];
    message = "You are ready for Primary School!";
  } else if (eligible !== "Not Eligible") {
    emojis = ["🎖️", "🏆", "🎊"];
    message = "Congratulations on your achievement!";
  }

  if (eligible !== "Not Eligible") {
    resultDiv.innerHTML += `
    <div class="congrats">
      🎉 ${emoji} ${message}
    </div>
  `;
    // launchConfetti(); // ribbons
    // launchEmojiConfetti(); // 🎊 side blast
    showProceedButton();
  }

  // highlight the correct row
  document.querySelectorAll("#tableBody tr").forEach((row) => {
    row.classList.toggle("highlight", row.cells[1].innerText === eligible);
  });
}

// --------------------------------------------------
// SHOW/HIDE INCREMENT COLUMNS
// --------------------------------------------------
function updateColumns() {
  const selectedCol = Number(document.getElementById("incrementSelect").value);

  document.querySelectorAll("#eligibilityTable tr").forEach((row) => {
    for (let i = 4; i <= 6; i++) {
      if (row.cells[i]) {
        row.cells[i].style.display = i === selectedCol ? "" : "none";
      }
    }
  });
}

function updateIncrementView() {
  const year = document.getElementById("yearSelect").value;
  const choice = document.getElementById("incrementSelect").value;

  // No increments for old years
  if (year !== "2026") return;

  // Show all columns
  if (choice === "all") {
    for (let i = 4; i <= 6; i++) {
      document
        .querySelectorAll(
          `#eligibilityTable tr td:nth-child(${i + 1}), 
                                 #eligibilityTable th:nth-child(${i + 1})`
        )
        .forEach((cell) => (cell.style.display = ""));
    }
    return;
  }

  // Show only the selected column
  for (let i = 4; i <= 6; i++) {
    document
      .querySelectorAll(
        `#eligibilityTable tr td:nth-child(${i + 1}), 
                               #eligibilityTable th:nth-child(${i + 1})`
      )
      .forEach((cell) => {
        cell.style.display = String(i) === choice ? "" : "none";
      });
  }
}

// --------------------------------------------------
// LOAD TABLE BASED ON SELECTED YEAR
// --------------------------------------------------
function loadTable() {
  const year = document.getElementById("yearSelect").value;
  const increment = Number(
    document.getElementById("incrementSelect").value || 1.09
  );
  const tbody = document.getElementById("tableBody");
  const table = document.getElementById("eligibilityTable");

  tbody.innerHTML = "";

  // Reset headers
  document.querySelector("#eligibilityTable th:nth-child(3)").innerText =
    "Term Fee";
  document.querySelector("#eligibilityTable th:nth-child(4)").innerText =
    "Fees";

  // ✅ OLD YEARS (2023–2025)
  if (year !== "2026") {
    document.getElementById("incrementSelect").style.display = "none";

    // Hide extra columns
    [5, 6, 7].forEach((c) => {
      table
        .querySelectorAll(`th:nth-child(${c}), td:nth-child(${c})`)
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

  // ✅ 2026–27 (AUTO INCREMENT MODE)
  document.getElementById("incrementSelect").style.display = "";

  document.querySelector("#eligibilityTable th:nth-child(3)").innerText =
    "Term Fee (2026–27)";
  document.querySelector("#eligibilityTable th:nth-child(4)").innerText =
    "Fees (2026–27)";

  // Hide increment columns completely
  [5, 6, 7].forEach((c) => {
    table
      .querySelectorAll(`th:nth-child(${c}), td:nth-child(${c})`)
      .forEach((cell) => (cell.style.display = "none"));
  });

  const baseFees = manualFees["2025"];

  baseFees.forEach((r) => {
    const yearly = r.term * 4;

    const newTerm = Math.round((r.term * increment) / 100) * 100;
    const newFees = Math.round((yearly * increment) / 100) * 100;

    tbody.innerHTML += `
      <tr>
        <td>${r.age}</td>
        <td>${r.class}</td>
        <td>${newTerm}</td>
        <td>${newFees}</td>
      </tr>`;
  });
}

// --------------------------------------------------
// CONFETTI / RIBBON ANIMATION
// --------------------------------------------------
function launchConfetti() {
  let layer = document.getElementById("confetti-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "confetti-layer";
    document.body.appendChild(layer);
  }

  layer.innerHTML = "";

  const colors = ["#f44336", "#e91e63", "#ff5252", "#ffcdd2"];
  const types = ["ribbon-long", "ribbon-curve", "ribbon-strip"];

  // Top falling confetti
  for (let i = 0; i < 220; i++) {
    const conf = document.createElement("div");
    conf.className = `confetti ${
      types[Math.floor(Math.random() * types.length)]
    }`;

    conf.style.left = Math.random() * 100 + "vw";
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];

    conf.style.animationDuration = 2 + Math.random() * 3 + "s";

    // ✅ ADD THIS LINE (BURST EFFECT)
    conf.style.setProperty("--spread", Math.random());

    layer.appendChild(conf);
    setTimeout(() => conf.remove(), 6000);
  }

  // Side cannons
  for (let i = 0; i < 60; i++) {
    ["left", "right"].forEach((side) => {
      const c = document.createElement("div");
      c.className = `cannon ${side}`;
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animation =
        side === "left"
          ? "shootLeft 1.2s ease-out forwards"
          : "shootRight 1.2s ease-out forwards";
      layer.appendChild(c);
      setTimeout(() => c.remove(), 1200);
    });
  }

  playSuccessSound();
}

function playSuccessSound() {
  const audio = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3"
  );
  audio.volume = 0.4;
  audio.play();
}

function launchEmojiConfetti() {
  const emojis = ["🎊", "🎉", "✨", "⭐", "🎈"];
  const body = document.body;

  for (let i = 0; i < 40; i++) {
    const emoji = document.createElement("div");

    // Randomly decide LEFT or RIGHT cannon
    const fromRight = Math.random() < 0.5;

    emoji.className = fromRight
      ? "emoji-confetti emoji-right"
      : "emoji-confetti";

    emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    // Vertical spread near result
    emoji.style.top = 220 + Math.random() * 200 + "px";

    emoji.style.animationDuration = 1.6 + Math.random() * 1.4 + "s";

    emoji.style.setProperty("--spread", Math.random());

    body.appendChild(emoji);

    setTimeout(() => emoji.remove(), 3500);
  }
}

function showProceedButton() {
  const resultDiv = document.getElementById("result");

  if (document.getElementById("proceedBtn")) return;

  const container = document.createElement("div");
  container.className = "proceed-container";

  container.innerHTML = `
    <button id="proceedBtn" class="proceed-btn">
      ✅ Proceed to Admission
    </button>
  `;

  resultDiv.appendChild(container);

  document.getElementById("proceedBtn").onclick = () => {
    document.getElementById("admissionModal").style.display = "block";
  };
}

function closeModal() {
  document.getElementById("admissionModal").style.display = "none";
}

function formatDOB(dob) {
  const [year, month, day] = dob.split("-");
  return `${day}-${month}-${year}`; // DD-MM-YYYY
}

function submitAdmission() {
  const parent = document.getElementById("parentName").value;
  const student = document.getElementById("studentName").value;
  const mobile = document.getElementById("mobile").value;
  const admClass = document.getElementById("admClass").value;
  const dobRaw = document.getElementById("dob").value;
  const dob = formatDOB(dobRaw);

  if (!parent || !student || !mobile || !admClass || !dob) {
    alert("Please fill all required fields");
    return;
  }

  // ✅ Age already calculated in your app
  const ageText =
    document
      .querySelector("#result")
      .innerHTML.match(/Age:([^<]+)/)?.[1]
      ?.trim() || "";

  const eligibleClass = document
    .querySelector("#result span")
    .innerText.replace("Eligible Class: ", "");

  const payload = {
    parent,
    student,
    mobile,
    dob, // ✅ send DOB
    age: ageText, // ✅ send formatted age
    admClass,
    eligibleClass,
  };

  const APP_URL =
    "https://script.google.com/macros/s/AKfycby--uNK5v9cK26GL-AuPtgi6i_7MwqX1vjkuw1Sm0fKO-EhmrUSCfk-el35L2j-TrD0Eg/exec";

  fetch(APP_URL, {
    method: "POST",
    mode: "no-cors", // ✅ keep this
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  alert("✅ Enquiry saved successfully!");
  closeModal();

  sendWhatsApp(mobile, parent, student, dob, ageText, admClass);
}

function sendWhatsApp(mobile, parent, student, dob, age, admClass) {
  mobile = mobile.replace(/\D/g, "").slice(-10);

  if (mobile.length !== 10) {
    alert("Invalid mobile number. WhatsApp not sent.");
    return;
  }

  const message = `🌟 *Kotak Salesian School – Visakhapatnam* 🌟

Dear Parent (${parent}),  

Thank you for visiting Kotak Salesian School and showing interest in admissions for the Academic Year *2026–27*.  

We have recorded the following details for your enquiry:

👦 *Student Name:* ${student}  
🎂 *Date of Birth:* ${dob}  
📅 *Age:* ${age} as on 01st June 2026.
🏫 *Class Seeking Admission:* ${admClass}  

──────────────────────────────

📌 *Important Admission Information*  

• This message confirms only the *enquiry*.  
• Admissions officially begin on *15 December 2025*.  
• Application forms will be issued from the school office from the above date.  
• From *UKG onwards*, students must appear for an *Entrance Test*.  
• Admission will be confirmed only after clearing all required stages.  

──────────────────────────────

📍 *Kotak Salesian School*  
Chinna Waltair, Visakhapatnam  

📞 *Contact Numbers:*  
9949523412  
7032984974  

Thank you for choosing Kotak Salesian School.  
We look forward to supporting you throughout the admission process. 🌟`;

  // Always use WhatsApp Web
  const url =
    "https://web.whatsapp.com/send?phone=91" +
    mobile +
    "&text=" +
    encodeURIComponent(message);

  window.open(url, "_blank");
}
