/**************************************************
 ADMISSION STAGE MANAGEMENT
 - Application
 - Entrance
 - Interview
 - Final Admission
 - Override handling
**************************************************/

/* ==================================================
   STAGE CLICK HANDLER
================================================== */
function handleStageClick(field, enquiryNo, currentValue) {
  const row = allData.find((r) => r.enquiryNo === enquiryNo);
  if (!row) return;

  const noEntrance = ["PRE KG", "LKG"].includes(
    (row.admClass || "").toUpperCase()
  );

  /* ---------------- APPLICATION ---------------- */
  if (field === "application") {
    const next = currentValue === "YES" ? "NO" : "YES";
    updateStage(enquiryNo, field, next);
    return;
  }

  /* ---------------- ENTRANCE ---------------- */
  if (field === "entrance") {
    if (row.application !== "YES") {
      alert("⚠️ Application must be issued before Entrance.");
      return;
    }

    openStageModal(
      "Confirm Entrance Result",
      "Please select the entrance exam result.",
      enquiryNo,
      "entrance",
      [
        { label: "PASS", value: "PASS", cls: "bg-green-600" },
        { label: "FAIL", value: "FAIL", cls: "bg-red-600" },
      ]
    );
    return;
  }

  /* ---------------- INTERVIEW ---------------- */
  if (field === "interview") {
    if (!noEntrance && row.entrance === "FAIL") {
      pendingOverride = { field, enquiryNo };
      openOverrideModal();
      return;
    }

    if (!noEntrance && row.entrance !== "PASS") {
      alert("⚠️ Entrance must be PASS before Interview.");
      return;
    }

    openStageModal(
      "Confirm Interview Result",
      "Please select the interview decision.",
      enquiryNo,
      "interview",
      [
        { label: "SELECTED", value: "SELECTED", cls: "bg-green-600" },
        { label: "REJECTED", value: "REJECTED", cls: "bg-red-600" },
      ]
    );
    return;
  }

  /* ---------------- FINAL ADMISSION ---------------- */
  if (field === "finalAdmission") {
    if (!noEntrance && row.entrance === "FAIL") {
      pendingOverride = { field, enquiryNo };
      openOverrideModal();
      return;
    }

    if (row.interview !== "SELECTED") {
      alert("⚠️ Interview must be SELECTED before Final Admission.");
      return;
    }

    openStageModal(
      "Confirm Final Admission",
      "Please confirm the final admission decision.",
      enquiryNo,
      "finalAdmission",
      [
        { label: "YES", value: "YES", cls: "bg-green-600" },
        { label: "NO", value: "NO", cls: "bg-red-600" },
      ]
    );
  }
}

/* ==================================================
   STAGE UPDATE (SUPABASE PATCH)
================================================== */
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
    r.timestamp = new Date().toISOString();

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

    if (msg && value !== "" && value !== "NOT STARTED") {
      openWhatsApp(r.mobile, msg);
    }

    applyFilters();
    renderKPIs(filtered);
  } catch (err) {
    console.error(err);
    alert("Error updating stage");
  }
}

/* ==================================================
   STAGE CONFIRMATION MODAL
================================================== */
function openStageModal(title, text, enquiryNo, field, buttons) {
  pendingStage.enquiryNo = enquiryNo;
  pendingStage.field = field;

  document.getElementById("stageModalTitle").textContent = title;
  document.getElementById("stageModalText").textContent = text;

  const btnBox = document.getElementById("stageModalButtons");
  btnBox.innerHTML = `
    <button onclick="closeStageModal()" class="px-4 py-2 border rounded-md">
      Cancel
    </button>
  `;

  buttons.forEach((b) => {
    btnBox.innerHTML += `
      <button
        class="px-4 py-2 text-white rounded-md ${b.cls}"
        onclick="confirmStageAction('${b.value}')"
      >
        ${b.label}
      </button>
    `;
  });

  const modal = document.getElementById("stageModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeStageModal() {
  const modal = document.getElementById("stageModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");

  pendingStage.enquiryNo = null;
  pendingStage.field = null;
}

function confirmStageAction(value) {
  if (!pendingStage.enquiryNo || !pendingStage.field) return;

  updateStage(pendingStage.enquiryNo, pendingStage.field, value);
  closeStageModal();
}

/* ==================================================
   OVERRIDE FLOW
================================================== */
function openOverrideModal() {
  const modal = document.getElementById("overrideModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeOverrideModal() {
  const modal = document.getElementById("overrideModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function confirmOverride() {
  const pwd = document.getElementById("overridePwd").value.trim();

  if (pwd !== OVERRIDE_PASSWORD) {
    alert("❌ Invalid override password");
    return;
  }

  if (!pendingOverride) return;

  const { field, enquiryNo } = pendingOverride;

  closeOverrideModal();

  if (field === "interview") {
    openStageModal(
      "Confirm Interview Result",
      "Please select the interview decision.",
      enquiryNo,
      "interview",
      [
        { label: "SELECTED", value: "SELECTED", cls: "bg-green-600" },
        { label: "REJECTED", value: "REJECTED", cls: "bg-red-600" },
      ]
    );
  }

  if (field === "finalAdmission") {
    openStageModal(
      "Confirm Final Admission",
      "Please confirm the final admission decision.",
      enquiryNo,
      "finalAdmission",
      [
        { label: "YES", value: "YES", cls: "bg-green-600" },
        { label: "NO", value: "NO", cls: "bg-red-600" },
      ]
    );
  }

  pendingOverride = null;
  document.getElementById("overridePwd").value = "";
}
