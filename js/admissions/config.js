/**************************************************
 CONFIG & GLOBAL STATE
**************************************************/

const SUPABASE_URL = "https://osrqmmsimjjkqsiwaiby.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zcnFtbXNpbWpqa3FzaXdhaWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzM3ODUsImV4cCI6MjA4MDY0OTc4NX0.gh-DzLvmw5wsXkp8z_ot5SuLbusGShi9xZUKFpETE4A";

const SUPA_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

const PAGE_SIZE = 25;
const OVERRIDE_PASSWORD = "KSS@2026";

let allData = [];
let filtered = [];
let currentPage = 1;
let activeKpi = null;

let pendingStage = { enquiryNo: null, field: null };
let pendingOverride = null;



/* DOM */
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const filterClass = document.getElementById("filterClass");
const filterEligibility = document.getElementById("filterEligibility");
const filterStage = { value: "" };
const resetFilters = document.getElementById("resetFilters");
const exportBtn = document.getElementById("exportBtn");

const kpiEnquiries = document.getElementById("kpi-enquiries");
const kpiApps = document.getElementById("kpi-apps");
const kpiEntrance = document.getElementById("kpi-entrance");
const kpiInterview = document.getElementById("kpi-interview");
const kpiFinal = document.getElementById("kpi-final");
