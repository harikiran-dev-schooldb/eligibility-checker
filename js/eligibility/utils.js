/**************************************************
 COMMON UTILITIES
**************************************************/

function formatDateDDMMYYYY(date) {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
}

function roundToHundred(value) {
  return Math.round(value / 100) * 100;
}
