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
