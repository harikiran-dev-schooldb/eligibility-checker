# 🎓 Kotak Salesian School

## **Eligibility Checker, Admissions & Fee Management System**

A complete **school admissions automation platform** that covers:

✔ Student **Age Eligibility Checking**  
✔ **Admissions Registration & Tracking**  
✔ **Dynamic Fee Management**  
✔ **Admin Dashboard with Filters & Analytics**  
✔ **WhatsApp Communication**  
✔ **PWA Offline Support**

<p align="center">
  <img src="https://raw.githubusercontent.com/harikiran-dev-schooldb/eligibility-checker/main/KOTAK_LOGO.png" width="150">
</p>

<p align="center"><b>Academic Year 2026 – 27</b></p>

---

# 📌 Overview

This project is a **full-fledged school admission management system** designed for **office staff usage**.

It replaces manual registers and Excel sheets with a **browser-based, secure, fast, and offline-capable system** that handles:

- Class eligibility determination based on DOB
- Student enquiry & admission workflow
- Fee structure management (multi-year)
- Centralized admissions dashboard
- Parent communication via WhatsApp
- Cloud-backed storage using **Supabase**
- No traditional backend server required

---

# 🔗 Live Applications

### 🔹 Eligibility Checker  
👉 https://harikiran-dev-schooldb.github.io/eligibility-checker/

### 🔹 Admissions Dashboard  
👉 https://harikiran-dev-schooldb.github.io/eligibility-checker/admissions

✔ Mobile  
✔ Tablet  
✔ Desktop  
✔ Offline (PWA)

---

# ⭐ Core Modules & Features

---

## 1️⃣ **Class Eligibility Checker**

* Input **Student Date of Birth**
* Calculates exact age:
  - Years
  - Months
  - Days
* Matches DOB with eligibility rules
* Displays eligible class (Pre KG → X)
* Animated, color-coded eligibility result
* “Proceed to Admission” button auto-appears

➡ Seamlessly connects eligibility → admission entry

---

## 2️⃣ **Admissions Management System (Supabase Powered)**

### Key Capabilities:

✔ Register new admissions  
✔ Auto-generate **Enquiry Numbers (ENQ-YYYY-XXXX)**  
✔ Store student & parent details  
✔ Track admission stages:
- Application
- Entrance Test
- Interview
- Final Admission

✔ Pagination, search & live filters  
✔ Real-time updates from Supabase  
✔ Secure API-based backend (no exposed DB credentials)

---

## 3️⃣ **Admissions Dashboard**

### Dashboard Features:

* Search by:
  - Student name
  - Parent name
  - Enquiry number
  - Mobile number
* Filter by:
  - Class
  - Application status
  - Entrance status
  - Interview status
  - Final admission status
  - Eligibility status (YES / NO)
* Summary cards:
  - Total enquiries
  - Eligible students
  - Confirmed admissions
* Responsive & optimized UI

---

## 4️⃣ **Fee Management System (Multi-Year)**

### Supported Academic Years:

* **2023–24**
* **2024–25**
* **2025–26**
* **2026–27 (Auto Increment Mode)**

### Auto Increment Logic (2026–27):

* Uses 2025–26 as base
* Calculates:
  - 8%
  - 9%
  - 10%
* User-selectable increment dropdown
* Real-time fee recalculation

---

## 5️⃣ **Admin Panel – Fee Editor**

### Editable Fields:

| Field       | Editable |
|------------|----------|
| Annual Fee | ✔ YES |
| Term Fee   | ✔ YES |
| Age        | ❌ NO |
| Class Name | ❌ NO |

### Admin Capabilities:

✔ Secure login  
✔ GitHub API integration  
✔ One-click save  
✔ Updates stored directly in GitHub  
✔ No server or database required  
✔ Changes instantly reflected across the app

---

## 6️⃣ **WhatsApp Communication Integration**

* One-click WhatsApp icon per student
* Pre-filled message includes:
  - Parent name
  - Student name
  - Enquiry number
* Supports:
  - Manual follow-ups
  - Fee reminders
  - Admission updates

Improves parent communication & response time.

---

## 7️⃣ **Progressive Web App (PWA)**

✔ Installable on mobile & desktop  
✔ Offline-first architecture  
✔ Cached assets  
✔ Fast loading even on slow networks  

### Service Worker Highlights:

* Auto-versioning with timestamp
* Cache invalidation on new deployments
* Prevents stale data issues
* Zero manual cache clearing required

---

# 📁 Project Structure

eligibility-checker/
│── index.html → Eligibility Checker
│── admissions.html → Admissions Dashboard
│── admin.html → Fee Admin Panel
│── app.js → Eligibility Logic
│── admissions.js → Admissions Logic (Supabase)
│── admin.js → Admin + GitHub API
│── styles.css → Global Styles
│── sw.js → Service Worker
│── manifest.json → PWA Config
│── favicon.ico
└── KOTAK_LOGO.png


---

# 🔧 Technical Architecture

### Backend:
- **Supabase (PostgreSQL + Auth + REST API)**

### Frontend:
- Vanilla JavaScript
- HTML5 + CSS3
- Tailwind-inspired utility styles

### Hosting:
- GitHub Pages

### Storage:
- Supabase for admissions data
- GitHub repository for fee configuration

---

# 🔐 Security Notes

* Supabase keys scoped to required tables only
* PAT token:
  - Never stored
  - Entered per session
  - Fine-grained & repo-specific recommended
* No sensitive credentials committed to repo

---

# 🚫 Known Issues & Fixes

### Old data visible?
✔ Auto-fixed using versioned service worker

### Admin save not reflecting?
✔ Ensure PAT token permissions:

repo
public_repo
metadata


### Mobile cache mismatch?
✔ Reinstall PWA or refresh twice

---

# 🚀 Roadmap

Planned / Optional Enhancements:

- Admission analytics charts
- PDF / Excel export
- Role-based admin access
- OTP-based admin login
- Student document uploads
- Fee payment status tracking
- Parent notification history
- Audit log for fee changes

---

# 🙌 Developed & Maintained By

**Harikiran**  
Data Admin & System Developer  
Kotak Salesian School

---

📌 *This system is actively used, maintained, and extended as a real-world school DBMS project.*

