/**************************************************
 INIT
**************************************************/

async function loadData() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/admissions?select=*`, {
    headers: SUPA_HEADERS,
  });

  const data = await res.json();

  allData = data.sort((a, b) => {
    const na = parseInt(a.enquiryNo?.split("-").pop());
    const nb = parseInt(b.enquiryNo?.split("-").pop());
    return nb - na;
  });

  filtered = [...allData];

  populateClassFilter(allData);
  renderKPIs(allData);
  renderTable(1);
}

document.addEventListener("DOMContentLoaded", () => {
  loadAdminButtons();
  loadData();
});
