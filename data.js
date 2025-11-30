// Academic reference date
const referenceDate = new Date(2026, 5, 1); // 1 June 2026

const manualFees = {
  2023: [
    { age: 3, class: "Pre KG", fees: 24000, term: 6000 },
    { age: 4, class: "LKG", fees: 27000, term: 6750 },
    { age: 5, class: "UKG", fees: 27000, term: 6750 },
    { age: 6, class: "I", fees: 31500, term: 7750 },
    { age: 7, class: "II", fees: 31500, term: 7750 },
    { age: 8, class: "III", fees: 32700, term: 8050 },
    { age: 9, class: "IV", fees: 32700, term: 8050 },
    { age: 10, class: "V", fees: 33900, term: 8350 },
    { age: 11, class: "VI", fees: 33900, term: 8350 },
    { age: 12, class: "VII", fees: 35100, term: 8650 },
    { age: 13, class: "VIII", fees: 43500, term: 10750 },
    { age: 14, class: "IX", fees: 45900, term: 11350 },
    { age: 15, class: "X", fees: 45400, term: 11350 },
  ],

  2024: [
    { age: 3, class: "Pre KG", fees: 24000, term: 6000 },
    { age: 4, class: "LKG", fees: 27000, term: 6750 },
    { age: 5, class: "UKG", fees: 27000, term: 6750 },
    { age: 6, class: "I", fees: 31500, term: 7750 },
    { age: 7, class: "II", fees: 31500, term: 7750 },
    { age: 8, class: "III", fees: 32700, term: 8050 },
    { age: 9, class: "IV", fees: 32700, term: 8050 },
    { age: 10, class: "V", fees: 33900, term: 8350 },
    { age: 11, class: "VI", fees: 33900, term: 8350 },
    { age: 12, class: "VII", fees: 35100, term: 8650 },
    { age: 13, class: "VIII", fees: 43500, term: 10750 },
    { age: 14, class: "IX", fees: 45900, term: 11350 },
    { age: 15, class: "X", fees: 45400, term: 11350 },
  ],

  2025: [
    { age: 3, class: "Pre KG", fees: 24000, term: 6000 },
    { age: 4, class: "LKG", fees: 27000, term: 6750 },
    { age: 5, class: "UKG", fees: 27000, term: 6750 },
    { age: 6, class: "I", fees: 31500, term: 7750 },
    { age: 7, class: "II", fees: 31500, term: 7750 },
    { age: 8, class: "III", fees: 32700, term: 8050 },
    { age: 9, class: "IV", fees: 32700, term: 8050 },
    { age: 10, class: "V", fees: 33900, term: 8350 },
    { age: 11, class: "VI", fees: 33900, term: 8350 },
    { age: 12, class: "VII", fees: 35100, term: 8650 },
    { age: 13, class: "VIII", fees: 43500, term: 10750 },
    { age: 14, class: "IX", fees: 45900, term: 11350 },
    { age: 15, class: "X", fees: 45400, term: 11350 },
  ],
  
};

// Eligibility & Fees
const eligibilityData = [
  { age: 3, class: "Pre KG", baseFees: 24000, term: 6000 },
  { age: 4, class: "LKG", baseFees: 27000, term: 6750 },
  { age: 5, class: "UKG", baseFees: 27000, term: 6750 },
  { age: 6, class: "I", baseFees: 31500, term: 7750 },
  { age: 7, class: "II", baseFees: 31500, term: 7750 },
  { age: 8, class: "III", baseFees: 32700, term: 8050 },
  { age: 9, class: "IV", baseFees: 32700, term: 8050 },
  { age: 10, class: "V", baseFees: 33900, term: 8350 },
  { age: 11, class: "VI", baseFees: 33900, term: 8350 },
  { age: 12, class: "VII", baseFees: 35100, term: 8650 },
  { age: 13, class: "VIII", baseFees: 43500, term: 10750 },
  { age: 14, class: "IX", baseFees: 45900, term: 11350 },
  { age: 15, class: "X", baseFees: 45400, term: 11350 },
];

