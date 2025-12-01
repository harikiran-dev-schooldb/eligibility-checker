Sure! Here's an **expanded, more detailed, professional README** with additional sections such as project goals, technical flow, admin workflow, troubleshooting, caching explanation, security notes, and future roadmap.

You can copy-paste into **README.md**.

---

# 🎓 Kotak Salesian School

## **Class Eligibility Checker & Fee Management System**

A complete web-based solution for age eligibility validation, academic fee management, and secure admin fee editing.

<p align="center">
  <img src="https://raw.githubusercontent.com/harikiran-dev-schooldb/eligibility-checker/main/KOTAK_LOGO.png" width="150">
</p>

<p align="center"><b>Academic Year 2026 – 27</b></p>

---

# 📌 Overview

This project provides a **smart age eligibility calculator** along with a **dynamic fee table** for academic years 2023–2026.
It also includes a **secure admin panel** that allows authorized users to modify annual fees and term fees directly from a browser.

The system updates and stores data in **GitHub**, allowing the school to maintain an always-updated, centralized fee management system without needing a database or server.

---

# 🔗 Live Website

👉 **[https://harikiran-dev-schooldb.github.io/eligibility-checker/](https://harikiran-dev-schooldb.github.io/eligibility-checker/)**

Works on:
✔ Mobile
✔ Tablets
✔ Desktop
✔ Offline (PWA enabled)

---

# ⭐ Features

## 1️⃣ **Eligibility Checker**

* Takes student **Date of Birth**
* Calculates:

  * Years
  * Months
  * Days
* Matches age with applicable class (Pre KG → X)
* Highlights the eligible class row
* Real-time result display

---

## 2️⃣ **Fee Table (Multi-Year)**

### Supports academic years:

* **2023–24**
* **2024–25**
* **2025–26**
* **2026–27 (Auto Increment Mode)**

### For 2026–27:

* Uses previous year (2025–26) data
* Calculates 8%, 9%, and 10% increments dynamically
* User can switch increment columns via dropdown

---

## 3️⃣ **Admin Panel (Option C – Fees + Term Fees Editable)**

Secure login system for administrative updates:

### Editable Fields:

| Field       | Editable? |
| ----------- | --------- |
| Annual Fees | ✔ YES     |
| Term Fees   | ✔ YES     |
| Age         | ❌ NO      |
| Class Name  | ❌ NO      |

### Features:

* Dropdown to select year (2023–25)
* Real-time table updates
* One-click save to GitHub
* GitHub API integration
* Uses PAT token securely (client-side)
* No backend server required

---

## 4️⃣ **PWA – Installable Web App**

This project supports:

✔ Offline Access
✔ Home Screen Installation
✔ Cached Files
✔ Lightning-fast performance

### Service Worker Features:

* Auto-versioning (`v11 + timestamp`)
* Automatic cache refresh when new version detected
* Pre-caches all main assets
* Solves “old data loading” problem
* Works seamlessly on mobile & desktop

---

# 📁 Project Directory Structure

```
eligibility-checker/
│── index.html               → Main Eligibility Checker
│── admin.html               → Admin Editor (Protected)
│── app.js                   → Frontend Logic
│── admin.js                 → Admin Logic + GitHub API
│── data.js                  → Fetches data.json into JS
│── data.json                → Stores Fees per Year
│── styles.css               → Styling file
│── sw.js                    → Service Worker (PWA)
│── manifest.json            → PWA Config
│── favicon.ico
└── KOTAK_LOGO.png
```

---

# 🔧 How Fee Editing Works (Technical Flow)

### Step-by-Step Flow:

1. Admin logs in → username + password
2. Admin enters GitHub PAT token
3. `admin.js` fetches **data.json** metadata from GitHub
4. Admin edits fees
5. On *Save*:

   * Updates JSON in memory
   * Encodes as Base64
   * Sends PUT request to GitHub API
6. GitHub commits update to repository
7. All visitors instantly get updated fees due to versioned caching

---

# 🔐 Security Notes

### Important:

* PAT Token is **never stored**
* Admin must paste token each session
* Username/password stored in frontend (editable)
* PAT must have:

  ```
  repo  
  public_repo  
  metadata
  ```
* Recommended: Use a **fine-grained token** restricted to this repo only
* Do NOT commit PAT token anywhere

---

# 📦 Data File Format (data.json)

```json
{
  "manualFees": {
    "2023": [
      { "age": 3, "class": "Pre KG", "fees": 24000, "term": 6000 },
      ...
    ],
    "2024": [...],
    "2025": [...],
    "2026": "Auto-calculated inside app.js"
  }
}
```

Editing through admin.html updates only:

✔ Fees
✔ Term Fees

All other fields must be edited manually in data.json if needed.

---

# 🚫 Common Issues + Fixes

### ❌ Website shows old version

**Fix:**
Clear cache OR refresh twice
or
Enable auto-refresh cache via PWA versioning (already added).

### ❌ Admin changes not visible

**Fix:**
🔸 Ensure GitHub Token has:

* repo
* public_repo
* metadata

🔸 Data stored in `main/data.json`

### ❌ Mobile shows old data but incognito shows correct

**Reason:**
Old service worker cached version.

**Fix:**
Refresh 3× or reinstall PWA (new version auto-updates now).

---

# 🚀 Future Roadmap (Optional Enhancements)

You may add these if needed:

* Dark/Light Mode
* Export Fees to PDF/Excel
* Staff Login + Multi-Admin Access
* Student Admission Registration Form
* OTP-based login for admin
* Automatic DOB → Class Eligibility API
* Version history log (fee changes)

---

# 🙌 Developed With Care

Designed & developed by **Harikiran**
Kotak Salesian School

If you want a **footer logo**, **custom branding**, or **PDF print design**, I can create that too.

---

If you'd like, I can prepare:

📄 A *documentation PDF*
🎥 A *demo video script*
📱 A *mobile UI mockup*
📊 A *fees analytics dashboard*

Just tell me!
