/**************************************************
 FILTERS, SEARCH, KPI FILTERS
**************************************************/

function renderKPIs(data) {
  animateCount(kpiEnquiries, data.length);
  animateCount(
    kpiApps,
    data.filter((r) => r.application === "YES").length
  );
  animateCount(
    kpiEntrance,
    data.filter((r) => r.entrance === "PASS").length
  );
  animateCount(
    kpiInterview,
    data.filter((r) => r.interview === "SELECTED").length
  );
  animateCount(
    kpiFinal,
    data.filter((r) => r.finalAdmission === "YES").length
  );
}

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

/* KPI filters */
function applyKpiFilter(type) {
  if (activeKpi === type) {
    activeKpi = null;
    clearKpiHighlight();
    filterStage.value = "";
    filterClass.value = "";
    filterEligibility.value = "";
    searchInput.value = "";
    applyFilters();
    return;
  }

  activeKpi = type;
  highlightActiveKpi(type);

  filterStage.value = "";
  if (type === "APPLICATION") filterStage.value = "application";
  if (type === "ENTRANCE") filterStage.value = "entrance";
  if (type === "INTERVIEW") filterStage.value = "interview";
  if (type === "FINAL") filterStage.value = "final";

  applyFilters();
}

function clearKpiHighlight() {
  document
    .querySelectorAll(".kpi-card")
    .forEach((el) => el.classList.remove("ring-2", "ring-offset-2"));
}

function highlightActiveKpi(type) {
  clearKpiHighlight();
  const el = document.querySelector(`[data-kpi="${type}"]`);
  if (el) el.classList.add("ring-2", "ring-offset-2");
}

function populateClassFilter(data) {
  const classOrder = {
    "PRE KG": 1,
    "LKG": 2,
    "UKG": 3,
    "I": 4,
    "II": 5,
    "III": 6,
    "IV": 7,
    "V": 8,
    "VI": 9,
    "VII": 10,
    "VIII": 11,
    "IX": 12,
    "X": 13,
  };

  const classes = [...new Set(
    data.map((d) => d.admClass).filter(Boolean)
  )].sort((a, b) => {
    return (classOrder[a] || 99) - (classOrder[b] || 99);
  });

  filterClass.innerHTML = `<option value="">All Classes</option>`;

  classes.forEach((c) => {
    filterClass.innerHTML += `<option value="${c}">${c}</option>`;
  });
}


/* Events */
searchInput.addEventListener("input", () => {
  clearTimeout(window._searchDebounce);
  window._searchDebounce = setTimeout(applyFilters, 300);
});

[filterClass, filterEligibility].forEach((el) =>
  el.addEventListener("change", applyFilters)
);

resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  filterClass.value = "";
  filterEligibility.value = "";
  filterStage.value = "";
  applyFilters();
});
