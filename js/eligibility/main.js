/**************************************************
 APP BOOTSTRAP
**************************************************/

document.addEventListener("DOMContentLoaded", async () => {
  await loadEligibility();
  await loadTable();
  toggleIncrement();
});
