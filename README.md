🎓 Kotak Salesian School – Class Eligibility Checker

A simple and powerful tool to calculate class eligibility, view school fees, and manage future fee increments.

This project includes:

✔ Student Class Eligibility Calculator

✔ Dynamic Fee Table (2023–2026)

✔ Auto Increment Calculation (8%, 9%, 10%)

✔ Admin Panel to Edit Fees (Option C Enabled — edit BOTH Fees & Term Fees)

✔ Automatic Update to GitHub Pages

✔ PWA + Offline Support (Service Worker)

📌 Live Website

🔗 https://harikiran-dev-schooldb.github.io/eligibility-checker/

📸 Screenshots
Eligibility Checker (Frontend)

Displays fees, increments & eligibility based on DOB and year selection.

Fee Editor – Admin Panel

Manages yearly fees (2023–2025)
✔ Option C: Edit BOTH Fees + Term Fee

⚙️ Features
✅ Eligibility Calculator

Enter Date of Birth → Shows exact age (Years/Months/Days)

Highlights eligible class

Auto-scrolls to correct row

✅ Fee Table

Select Academic Year: 2023–24 → 2026–27

For 2026–27 → Auto calculates 8%, 9%, 10% increments

PDF printable

✅ Admin Panel (Option C Enabled)

Admin can modify:

Editable?	Field
✔ Yes	Annual Fees
✔ Yes	Term Fees
❌ No	Age or Class Name

All edits save automatically to:

data.json


Using a GitHub Personal Access Token.

🔐 Admin Panel Login

Default Login:

username: admin
password: admin


You must paste your GitHub PAT Token to save changes.

🗂 File Structure
📁 eligibility-checker
 ┣ index.html
 ┣ admin.html
 ┣ app.js
 ┣ admin.js
 ┣ data.js
 ┣ data.json
 ┣ styles.css
 ┣ manifest.json
 ┗ sw.js

🔧 Service Worker

Full PWA support

Auto cache-busting using timestamp version

Ensures users always get the latest data.js & app.js updates

🚀 Hosting

Hosted on GitHub Pages:

https://harikiran-dev-schooldb.github.io/eligibility-checker/

🙌 Credits

Developed for Kotak Salesian School
Designed by Harikiran