/**************************************************
 SUPABASE CONFIG & GLOBAL STATE
**************************************************/

const SUPABASE_URL = "https://osrqmmsimjjkqsiwaiby.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zcnFtbXNpbWpqa3FzaXdhaWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzM3ODUsImV4cCI6MjA4MDY0OTc4NX0.gh-DzLvmw5wsXkp8z_ot5SuLbusGShi9xZUKFpETE4A";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Reference date for eligibility
const referenceDate = new Date(2026, 5, 1);

// Cached data
let feeRows = [];
let eligibilityData = [];

/**************************************************
 GLOBAL STATE
**************************************************/
let allData = [];
let filtered = [];
let currentPage = 1;
let activeKpi = null;

let pendingStage = {
  enquiryNo: null,
  field: null,
};

let pendingOverride = null;

let selectedRowForWhatsApp = null;

