/**************************************************
 TABLE RENDERING MODULE
 - Admission table
 - Admin action columns
 - Detail modal handling
**************************************************/

/* ==================================================
   ADMIN CONTROLS (TABLE CELLS)
================================================== */
function adminControlsHTML(r) {
  const noEntrance = ["PRE KG", "LKG"].includes(
    (r.admClass || "").toUpperCase()
  );

  const canEntrance = r.application === "YES" && !noEntrance;
  const canInterview =
    r.application === "YES" && (noEntrance || r.entrance === "PASS");
  const canFinal = r.interview === "SELECTED" || r.entrance === "FAIL";

  return `
    <td class="p-3">
      ${statusPill(r.application, "application", r.enquiryNo, true)}
    </td>

    <td class="p-3">
      ${
        noEntrance
          ? `<span class="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600">N/A</span>`
          : statusPill(
              r.entrance || "NOT STARTED",
              "entrance",
              r.enquiryNo,
              canEntrance
            )
      }
    </td>

    <td class="p-3">
      ${statusPill(
        r.interview || "NOT STARTED",
        "interview",
        r.enquiryNo,
        canInterview
      )}
    </td>

    <td class="p-3">
      ${statusPill(
        r.finalAdmission || "—",
        "finalAdmission",
        r.enquiryNo,
        canFinal
      )}
    </td>
  `;
}

/* ==================================================
   STATUS PILL BUTTON
================================================== */
function statusPill(value, field, enquiryNo, enabled = true) {
  const map = {
    YES: "bg-green-600 text-white",
    NO: "bg-red-500 text-white",
    PASS: "bg-green-600 text-white",
    FAIL: "bg-red-500 text-white",
    SELECTED: "bg-green-600 text-white",
    REJECTED: "bg-red-500 text-white",
    "NOT STARTED": "bg-gray-300 text-gray-700",
    PENDING: "bg-gray-300 text-gray-700",
  };

  const cls = map[value] || "bg-gray-300 text-gray-700";
  const disabled = !enabled ? "opacity-50 pointer-events-none" : "";

  return `
    <button
      class="px-3 py-1 text-xs rounded-full font-medium ${cls} ${disabled}"
      onclick="handleStageClick('${field}', '${enquiryNo}', '${value}')"
    >
      ${value}
    </button>
  `;
}

/* ==================================================
   TABLE RENDERING
================================================== */
function renderTable(page = currentPage) {
  tableBody.innerHTML = "";

  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  if (pageRows.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="12" class="p-3 text-center text-gray-500">
          No records found
        </td>
      </tr>`;
    return;
  }

  pageRows.forEach((r) => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-50 cursor-pointer";

    tr.innerHTML = `
      <td class="p-3">
        <button
          class="text-sky-600 hover:underline font-medium"
          onclick="openDetailModalFromClick(event, ${JSON.stringify(r).replace(
            /"/g,
            "&quot;"
          )})"
        >
          ${r.enquiryNo?.split("-").pop() || ""}
        </button>
      </td>

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
      ${isAdmin() ? adminControlsHTML(r) : ""}
    `;

    tableBody.appendChild(tr);
  });

  currentPage = page;

  document.getElementById("currentPage").textContent = `Page ${currentPage}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled =
    currentPage * PAGE_SIZE >= filtered.length;

  document.getElementById("showingInfo").textContent = `Showing ${
    start + 1
  } to ${start + pageRows.length} of ${filtered.length} records`;
}

document.getElementById("nextPage").onclick = () => {
  const maxPage = Math.ceil(filtered.length / PAGE_SIZE);
  if (currentPage < maxPage) {
    currentPage++;
    renderTable(currentPage);
  }
};

document.getElementById("prevPage").onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(currentPage);
  }
};

/* ==================================================
   DETAIL MODAL
================================================== */
function openDetailModalFromClick(event, row) {
  event.stopPropagation();
  openDetailModal(row);
}

function openDetailModal(row) {
  const ageVal = row.age || getAgeString(row.dob);

  const html = `
    <p><strong>Enquiry No:</strong> ${row.enquiryNo}</p>
    <p><strong>Parent:</strong> ${row.parent}</p>
    <p><strong>Student:</strong> ${row.student}</p>
    <p><strong>Class:</strong> ${row.admClass}</p>
    <p><strong>Mobile:</strong> ${row.mobile}</p>
    <p><strong>DOB:</strong> ${row.dob}</p>
    <p><strong>Age:</strong> ${ageVal}</p>
    <p><strong>Eligible Class:</strong> ${row.eligible}</p>

    <hr style="margin:16px 0">

    <div style="text-align:center">
      <button
        onclick="sendWhatsApp(
          '${row.mobile}',
          '${row.parent}',
          '${row.student}',
          '${row.dob}',
          '${ageVal}',
          '${row.admClass}'
        )"
        style="
          display:flex;
          align-items:center;
          gap:10px;
          padding:12px 18px;
          color:#fff;
          border:none;
          border-radius:8px;
          cursor:pointer;
          font-size:14px;
          margin:auto;
        "
      >
        <img
          src="whatsapp.png"
          alt="WhatsApp"
          style="width:28px;height:28px;display:block"
        />
      </button>
    </div>
  `;

  document.getElementById("detailContent").innerHTML = html;
  document.getElementById("detailModal").style.display = "flex";
}

function closeDetailModal() {
  document.getElementById("detailModal").style.display = "none";
}
