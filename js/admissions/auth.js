/**************************************************
 ADMIN AUTH
**************************************************/

function submitAdminLogin() {
  const pwd = document.getElementById("adminPwd").value.trim();

  const admins = {
    harikiran: "Harikiran",
    naveena: "Naveena",
    krishnaveni: "Krishnaveni",
  };

  if (admins[pwd]) {
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("adminName", admins[pwd]);

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
  const adminName = localStorage.getItem("adminName");

  if (isAdmin()) {
    box.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600">
          <strong>${adminName}</strong>
        </span>
        <button
          class="px-4 py-2 bg-red-500 text-white rounded-md"
          onclick="adminLogout()"
        >
          Logout
        </button>
      </div>
    `;

    ["th-application", "th-entrance", "th-interview", "th-final"].forEach(
      (id) => (document.getElementById(id).style.display = "")
    );
  } else {
    box.innerHTML = `
      <button
        class="px-4 py-2 bg-[#028467] text-white rounded-md"
        onclick="adminLogin()"
      >
        Login
      </button>
    `;

    ["th-application", "th-entrance", "th-interview", "th-final"].forEach(
      (id) => (document.getElementById(id).style.display = "none")
    );
  }
}
