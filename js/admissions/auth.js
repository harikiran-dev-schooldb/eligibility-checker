/**************************************************
 ADMIN AUTH
**************************************************/

function submitAdminLogin() {
  const pwd = document.getElementById("adminPwd").value.trim();
  if (pwd === "admin") {
    localStorage.setItem("isAdmin", "true");
    closeAdminModal();
    loadAdminButtons();
    location.reload();
  } else {
    alert("❌ Wrong password");
  }
}

function adminLogin() {
  document.getElementById("adminModal").style.display = "flex";
}

function closeAdminModal() {
  document.getElementById("adminModal").style.display = "none";
  document.getElementById("adminPwd").value = "";
}

function adminLogout() {
  document.getElementById("logoutModal").style.display = "flex";
}

function closeLogoutModal() {
  document.getElementById("logoutModal").style.display = "none";
}

function confirmLogout() {
  localStorage.removeItem("isAdmin");
  closeLogoutModal();
  location.reload();
}

function isAdmin() {
  return localStorage.getItem("isAdmin") === "true";
}

function loadAdminButtons() {
  const box = document.getElementById("adminButtons");

  if (isAdmin()) {
    box.innerHTML = `<button class="px-4 py-2 bg-red-600 text-white rounded-md" onclick="adminLogout()">Logout</button>`;
    ["th-application", "th-entrance", "th-interview", "th-final"].forEach(
      (id) => (document.getElementById(id).style.display = "")
    );
  } else {
    box.innerHTML = `<button class="px-4 py-2 bg-blue-600 text-white rounded-md" onclick="adminLogin()">Login</button>`;
    ["th-application", "th-entrance", "th-interview", "th-final"].forEach(
      (id) => (document.getElementById(id).style.display = "none")
    );
  }
}
