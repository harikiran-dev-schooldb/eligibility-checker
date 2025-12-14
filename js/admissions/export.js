/**************************************************
 EXCEL EXPORT – MERGED, CENTERED, BORDERED
**************************************************/
exportBtn.addEventListener("click", () => {
  const dataRows = filtered.map((r) => ({
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

  const headers = Object.keys(dataRows[0]);
  const totalCols = headers.length;

  // Create sheet with headers at row 3
  const ws = XLSX.utils.json_to_sheet(dataRows, { origin: "A3" });

  // ---------------- TITLES ----------------
  ws["A1"] = {
    v: "KOTAK SALESIAN SCHOOL",
    t: "s",
    s: {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: "center", vertical: "center" },
    },
  };

  ws["A2"] = {
    v: "ADMISSION ENQUIRIES 2026–27",
    t: "s",
    s: {
      font: { bold: true, sz: 12 },
      alignment: { horizontal: "center", vertical: "center" },
    },
  };

  // Merge title rows
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
  ];

  // ---------------- STYLES ----------------
  const borderStyle = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  // Header row (Row 3)
  headers.forEach((h, i) => {
    const cellRef = XLSX.utils.encode_cell({ r: 2, c: i });
    ws[cellRef].s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle,
    };
  });

  // Data cells (from Row 4)
  dataRows.forEach((row, rIdx) => {
    headers.forEach((_, cIdx) => {
      const cellRef = XLSX.utils.encode_cell({
        r: rIdx + 3,
        c: cIdx,
      });

      if (!ws[cellRef]) return;

      ws[cellRef].s = {
        alignment: { vertical: "center" },
        border: borderStyle,
      };
    });
  });

  // ---------------- AUTO WIDTH ----------------
  const colWidths = [];
  const allRows = [headers, ...dataRows.map(Object.values)];

  allRows.forEach((row) => {
    row.forEach((val, i) => {
      const len = val ? val.toString().length : 10;
      colWidths[i] = Math.max(colWidths[i] || 10, len + 2);
    });
  });

  ws["!cols"] = colWidths.map((w) => ({ wch: w }));

  // ---------------- WORKBOOK ----------------
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Admissions");

  XLSX.writeFile(wb, "Admissions_Enquiries_2026-27.xlsx");
});