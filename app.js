const form = document.querySelector("#proposalForm");
const printButton = document.querySelector("#printProposal");
const downloadPdfButton = document.querySelector("#downloadPdf");
const saveButton = document.querySelector("#saveProposal");
const searchInput = document.querySelector("#quoteSearch");
const searchButton = document.querySelector("#searchQuotes");
const clearSearchButton = document.querySelector("#clearSearch");
const searchStatus = document.querySelector("#searchStatus");
const searchResultsWrap = document.querySelector("#searchResultsWrap");
const searchResults = document.querySelector("#searchResults");
const state = {
  mepItems: [],
  proposalType: "fibreglass-pool"
};
let supabaseClient = null;
let currentQuoteId = null;
let hasUnsavedChanges = false;
let searchDebounceTimer = null;

// Initialize Supabase client
// Replace with your Supabase URL and anon key
const SUPABASE_URL = "https://bcqpvlciuopdblktvijh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_DqOGfdxj2_ZnvC4lq6Nu8Q_s7aZBRWj";

if (typeof window.supabase !== "undefined") {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const priceChart = [
  { series: "Compact", length: 3, width: 1.5, depth: 1.2, mep: 120000, shell: 155000, price: 275000, tag: "" },
  { series: "Compact", length: 4, width: 2, depth: 1.2, mep: 130000, shell: 260000, price: 390000, tag: "" },
  { series: "Compact", length: 4, width: 2.75, depth: 1.2, mep: 140000, shell: 300000, price: 440000, tag: "Popular" },
  { series: "Compact", length: 4.5, width: 2.5, depth: 1.2, mep: 160000, shell: 315000, price: 475000, tag: "" },
  { series: "Family", length: 5, width: 2, depth: 1.2, mep: 170000, shell: 320000, price: 490000, tag: "" },
  { series: "Family", length: 5, width: 2.75, depth: 1.2, mep: 185000, shell: 345000, price: 530000, tag: "" },
  { series: "Family", length: 6, width: 2.75, depth: 1.2, mep: 185000, shell: 512000, price: 697000, tag: "" },
  { series: "Family", length: 6, width: 3, depth: 1.2, mep: 190000, shell: 550000, price: 740000, tag: "" },
  { series: "Family", length: 7, width: 2.75, depth: 1.2, mep: 190000, shell: 595000, price: 785000, tag: "" },
  { series: "Premium", length: 8, width: 2.75, depth: 1.2, mep: 220000, shell: 749000, price: 969000, tag: "" },
  { series: "Premium", length: 8, width: 4, depth: 1.2, mep: 255000, shell: 795000, price: 1050000, tag: "Best Value" },
  { series: "Premium", length: 9, width: 3, depth: 1.2, mep: 265000, shell: 825000, price: 1090000, tag: "" },
  { series: "Premium", length: 10, width: 4, depth: 1.2, mep: 280000, shell: 1000000, price: 1280000, tag: "" },
  { series: "Premium", length: 10, width: 5, depth: 1.2, mep: 289000, shell: 1061000, price: 1350000, tag: "" },
  { series: "Luxury", length: 9, width: 6, depth: 1.2, mep: 280000, shell: 1170000, price: 1450000, tag: "" },
  { series: "Luxury", length: 10, width: 7, depth: 1.2, mep: 310000, shell: 1310000, price: 1620000, tag: "" },
  { series: "Luxury", length: 12, width: 4, depth: 1.2, mep: 325000, shell: 1055000, price: 1380000, tag: "" },
  { series: "Luxury", length: 12, width: 6, depth: 1.2, mep: 362000, shell: 1318000, price: 1680000, tag: "High Demand" },
  { series: "Luxury", length: 15, width: 6, depth: 1.2, mep: 395000, shell: 1705000, price: 2100000, tag: "" },
  { series: "Luxury", length: 16, width: 7, depth: 1.2, mep: 418000, shell: 2162000, price: 2580000, tag: "" }
];

const fields = {
  clientName: document.querySelector("#clientName"),
  phone: document.querySelector("#phone"),
  location: document.querySelector("#location"),
  proposalDate: document.querySelector("#proposalDate"),
  quoteNo: document.querySelector("#quoteNo"),
  validityDays: document.querySelector("#validityDays"),
  proposalTypeField: document.querySelector("#proposalTypeField"),
  length: document.querySelector("#length"),
  width: document.querySelector("#width"),
  depth: document.querySelector("#depth"),
  unit: document.querySelector("#unit"),
  poolType: document.querySelector("#poolType"),
  existingPoolType: document.querySelector("#existingPoolType"),
  revision: document.querySelector("#revision"),
  createRevisionButton: document.querySelector("#createRevision"),
  poolTypeFieldWrapper: document.querySelector("#fibreglassPoolTypeField"),
  existingPoolTypeFieldWrapper: document.querySelector("#existingPoolTypeField"),
  baseRate: document.querySelector("#baseRate"),
  gstRate: document.querySelector("#gstRate"),
  shellUnitPrice: document.querySelector("#shellUnitPrice"),
  installationUnitPrice: document.querySelector("#installationUnitPrice"),
  mepUnitPrice: document.querySelector("#mepUnitPrice"),
  includeGst: document.querySelector("#includeGst"),
  scope: document.querySelector("#scope"),
  scopeFieldWrapper: document.querySelector("#scopeFieldWrapper"),
  notes: document.querySelector("#notes"),
  preparedByName: document.querySelector("#preparedByName"),
  preparedByDesignation: document.querySelector("#preparedByDesignation"),
  preparedByPhone: document.querySelector("#preparedByPhone"),
  approvedByName: document.querySelector("#approvedByName"),
  approvedByDesignation: document.querySelector("#approvedByDesignation"),
  approvedByPhone: document.querySelector("#approvedByPhone")
};

const output = {
  visualLabel: document.querySelector("#visualLabel"),
  chartMatch: document.querySelector("#chartMatch"),
  surfaceArea: document.querySelector("#surfaceArea"),
  volume: document.querySelector("#volume"),
  estimate: document.querySelector("#estimate"),
  proposalTitle: document.querySelector("#proposalTitle"),
  outClient: document.querySelector("#outClient"),
  outLocation: document.querySelector("#outLocation"),
  outDate: document.querySelector("#outDate"),
  outValidUntil: document.querySelector("#outValidUntil"),
  outQuoteNo: document.querySelector("#outQuoteNo"),
  proposalIntro: document.querySelector("#proposalIntro"),
  poolImageSize: document.querySelector("#poolImageSize"),
  specList: document.querySelector("#specList"),
  existingPoolSpecList: document.querySelector("#existingPoolSpecList"),
  technicalSummary: document.querySelector("#technicalSummary"),
  quoteRows: document.querySelector("#quoteRows"),
  amountWords: document.querySelector("#amountWords"),
  grandTotal: document.querySelector("#grandTotal"),
  itemRows: document.querySelector("#itemRows"),
  outRevision: document.querySelector("#outRevision"),
  outNotes: document.querySelector("#outNotes"),
  outPreparedByName: document.querySelector("#outPreparedByName"),
  outPreparedByDesignation: document.querySelector("#outPreparedByDesignation"),
  outPreparedByPhone: document.querySelector("#outPreparedByPhone"),
  outApprovedByName: document.querySelector("#outApprovedByName"),
  outApprovedByDesignation: document.querySelector("#outApprovedByDesignation"),
  outApprovedByPhone: document.querySelector("#outApprovedByPhone"),
  fiberglassBenefitsSection: document.querySelector("#fiberglassBenefitsSection"),
  poolSpecificationsSection: document.querySelector("#poolSpecificationsSection"),
  existingPoolDetailsSection: document.querySelector("#existingPoolDetailsSection"),
  poolImageCard: document.querySelector("#poolImageCard"),
  proposalTypeDetailsSection: document.querySelector("#proposalTypeDetailsSection"),
  floorAreaValue: document.querySelector("#floorAreaValue"),
  wallAreaValue: document.querySelector("#wallAreaValue"),
  totalTreatmentAreaValue: document.querySelector("#totalTreatmentAreaValue"),
  totalTreatmentAreaFtValue: document.querySelector("#totalTreatmentAreaFtValue"),
  treatmentAreaInfo: document.querySelector("#treatmentAreaInfo"),
  commercialSummaryHeading: document.querySelector("#commercialSummaryHeading")
};

const mepElements = {
  container: document.querySelector("#mepItemsContainer"),
  addButton: document.querySelector("#addMepItem")
};

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const decimalFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
const measurementFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
const RCC_POOL_TYPE = "RCC Swimming Pool Waterproofing & Filtration System";

// Proposal Type Constants
const PROPOSAL_TYPES = {
  FIBREGLASS_POOL: "fibreglass-pool",
  FRP_WATERPROOFING: "frp-waterproofing",
  FRP_LAMINATION_MEP: "frp-lamination-mep",
  MEP_ONLY: "mep-only"
};

function formatMeasurement(value) {
  return measurementFormat.format(Number.parseFloat(Number(value).toFixed(2)));
}

function asNumber(input, fallback = 0) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function toMeters(value, unit) {
  return unit === "ft" ? value * 0.3048 : value;
}

function sqFtFrom(length, width, unit) {
  return length * width * (unit === "ft" ? 1 : 10.7639);
}

function litresFrom(length, width, depth, unit) {
  return unit === "ft" ? length * width * depth * 28.3168 : length * width * depth * 1000;
}

function formatSafeDate(value) {
  // Safe date formatting that returns empty string for invalid/null dates
  if (!value) return "";

  try {
    // Try to parse the value
    const dateStr = String(value).trim();
    if (!dateStr) return "";

    // Create date from ISO format or YYYY-MM-DD format
    const d = new Date(`${dateStr}T00:00:00`);

    // Check if date is valid
    if (isNaN(d.getTime())) {
      console.warn(`⚠️ Invalid date value: "${value}"`);
      return "";
    }

    return d.toISOString().split('T')[0];
  } catch (error) {
    console.warn(`⚠️ Error parsing date "${value}":`, error.message);
    return "";
  }
}

function formatDate(dateValue) {
  try {
    // If no value, return empty (don't use today's date by default)
    if (!dateValue) return "";

    const dateStr = String(dateValue).trim();
    if (!dateStr) return "";

    const date = new Date(`${dateStr}T00:00:00`);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Invalid date value for formatting: "${dateValue}"`);
      return "";
    }

    return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(date);
  } catch (error) {
    console.warn(`⚠️ Error formatting date "${dateValue}":`, error.message);
    return "";
  }
}

function parseDateInput(dateValue) {
  if (!dateValue) return null;

  try {
    const dateStr = String(dateValue).trim();
    if (!dateStr) return null;

    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return null;

    const date = new Date(year, month - 1, day);

    // Validate the date
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Invalid date parsed: "${dateValue}"`);
      return null;
    }

    return date;
  } catch (error) {
    console.warn(`⚠️ Error parsing date "${dateValue}":`, error.message);
    return null;
  }
}

function dateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysToDate(dateValue, days) {
  const date = parseDateInput(dateValue) || new Date();
  date.setDate(date.getDate() + days);
  return dateInputValue(date);
}

function daysBetweenDates(startDateValue, endDateValue) {
  try {
    // Both dates must exist and be valid
    if (!startDateValue || !endDateValue) {
      console.log(`ℹ️ Missing dates for daysBetweenDates: start="${startDateValue}", end="${endDateValue}"`);
      return null;
    }

    const start = parseDateInput(startDateValue);
    const end = parseDateInput(endDateValue);

    if (!start || !end) {
      console.log(`ℹ️ Could not parse dates: start="${startDateValue}", end="${endDateValue}"`);
      return null;
    }

    const days = Math.round((end - start) / 86400000);
    return days;
  } catch (error) {
    console.warn(`⚠️ Error calculating days between dates:`, error.message);
    return null;
  }
}

function closestChart(lengthM, widthM, depthM, areaSqFt, baseRate) {
  const scored = priceChart.map((row) => {
    const rowArea = row.length * row.width * 10.7639;
    const dimensionScore = Math.abs(row.length - lengthM) + Math.abs(row.width - widthM) + Math.abs(row.depth - depthM) * 1.5;
    const areaScore = Math.abs(rowArea - areaSqFt) / 100;
    return { ...row, score: dimensionScore + areaScore, rowArea };
  }).sort((a, b) => a.score - b.score);

  const nearest = scored[0];
  const exact = Math.abs(nearest.length - lengthM) <= 0.06 && Math.abs(nearest.width - widthM) <= 0.06 && Math.abs(nearest.depth - depthM) <= 0.06;

  if (exact) return { ...nearest, exact: true, estimated: false };

  const fallbackTotal = Math.round(areaSqFt * baseRate);
  const mepRatio = nearest.mep / nearest.price;
  const mep = Math.round(fallbackTotal * mepRatio / 1000) * 1000;
  const shell = Math.max(0, fallbackTotal - mep);
  return { ...nearest, exact: false, estimated: true, mep, shell, price: fallbackTotal };
}

function accessorySchedule(lengthM, areaSqFt) {
  const filterDia = areaSqFt <= 170 ? 500 : areaSqFt <= 300 ? 600 : areaSqFt <= 520 ? 750 : 900;
  const sandQty = filterDia === 500 ? 150 : filterDia === 600 ? 200 : filterDia === 750 ? 300 : 450;
  const lights = areaSqFt <= 160 ? 2 : areaSqFt <= 380 ? 4 : areaSqFt <= 700 ? 6 : 8;
  const vacuumHose = Math.max(7, Math.round(lengthM));
  const pump = areaSqFt <= 520 ? "1.5 HP / 1 Phase" : "2 HP / 1 Phase";

  return [
    { item: `Alfa Aerosol Vessel ${filterDia} DIA [Pressure sand filter]`, brand: "Alfa", qty: "1 No" },
    { item: "Purity Sand", brand: "Purity", qty: `${sandQty} Kg` },
    { item: "Pool Light (12V x 24W)", brand: "Standard", qty: `${lights} No` },
    { item: "LED Driver", brand: "Standard", qty: `${Math.ceil(lights / 2)} No` },
    { item: `Pool Pump ${pump}`, brand: "Standard", qty: "1 No" },
    { item: "Net with 5 micron mesh", brand: "Standard", qty: "1 No" },
    { item: "Vacuum Hose", brand: "Standard", qty: `${vacuumHose} M` },
    { item: "Vacuum Head", brand: "Standard", qty: "1 No" },
    { item: "Vacuum Point", brand: "Standard", qty: "1 No" },
    { item: "Brush", brand: "Standard", qty: "1 No" },
    { item: "SS Ladder (4 Steps)", brand: "SS 304", qty: "1 No" },
    { item: "Telescopic Rod", brand: "Standard", qty: "1 No" },
    { item: "Skimmer Basket", brand: "Standard", qty: "1 No" },
    { item: "Eye Ball", brand: "Standard", qty: "3 Nos" },
    { item: "Main Drain Cover", brand: "Standard", qty: "1 No" },
    { item: "Plumbing Materials (plant room pipes, fittings, valves, PVC pipe)", brand: "PVC", qty: "Required" },
    { item: "Testing Kit for pH and Chlorine", brand: "Standard", qty: "1 No" }
  ];
}

function createMepItemRow(item = {}) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" class="mep-desc" placeholder="Item description"></td>
    <td><input type="text" class="mep-brand" placeholder="Standard"></td>
    <td><input type="text" class="mep-qty" placeholder="Quantity"></td>
    <td><button type="button" class="remove-mep-item secondary-button muted-button">Remove</button></td>
  `;
  row.querySelector(".mep-desc").value = item.description || "";
  row.querySelector(".mep-brand").value = item.brand || "";
  row.querySelector(".mep-qty").value = item.qty || "";
  return row;
}

function renderMepInputRows() {
  mepElements.container.innerHTML = "";
  if (!Array.isArray(state.mepItems) || state.mepItems.length === 0) {
    return;
  }

  state.mepItems.forEach((item) => {
    mepElements.container.appendChild(createMepItemRow(item));
  });
}

function setMepItems(items = []) {
  const normalized = Array.isArray(items) ? items : [];
  state.mepItems = normalized.map((item) => ({
    description: item.description || "",
    brand: item.brand || "",
    qty: item.qty || ""
  }));
  renderMepInputRows();
}

function syncMepItemsFromDom() {
  state.mepItems = Array.from(mepElements.container.querySelectorAll("tr")).map((row) => {
    const description = row.querySelector(".mep-desc")?.value.trim() || "";
    const brand = row.querySelector(".mep-brand")?.value.trim() || "";
    const qty = row.querySelector(".mep-qty")?.value.trim() || "";
    return { description, brand, qty };
  }).filter((item) => item.description || item.brand || item.qty);
}

function loadMepItems(items, poolType, proposalType = PROPOSAL_TYPES.FIBREGLASS_POOL) {
  if (Array.isArray(items) && items.length > 0) {
    setMepItems(items);
    return;
  }

  // Load defaults based on proposal type
  const defaults = getDefaultMepItemsForProposalType(proposalType);
  setMepItems(defaults);
}

function renderMepRows(state) {
  const rows = Array.isArray(state.mepItems) ? state.mepItems : [];

  if (rows.length === 0) {
    output.itemRows.innerHTML = `<tr><td colspan="3">No MEP items specified.</td></tr>`;
    return;
  }

  output.itemRows.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.description)}</td>
      <td>${escapeHtml(row.brand || "Standard")}</td>
      <td>${escapeHtml(row.qty)}</td>
    </tr>
  `).join("");
}


function numberToWords(value) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const underHundred = (num) => num < 20 ? ones[num] : `${tens[Math.floor(num / 10)]}${num % 10 ? ` ${ones[num % 10]}` : ""}`;
  const underThousand = (num) => {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    return `${hundred ? `${ones[hundred]} Hundred` : ""}${hundred && rest ? " " : ""}${rest ? underHundred(rest) : ""}`.trim();
  };

  let num = Math.round(Math.max(0, value));
  if (num === 0) return "Zero";

  const parts = [];
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;

  if (crore) parts.push(`${underThousand(crore)} Crore`);
  if (lakh) parts.push(`${underThousand(lakh)} Lakh`);
  if (thousand) parts.push(`${underThousand(thousand)} Thousand`);
  if (num) parts.push(underThousand(num));
  return parts.join(" ");
}

function wordsHint(amount) {
  return `Amount in words: ${numberToWords(amount)} Rupees Only`;
}

function rateFromAmount(amount, areaSqFt) {
  return areaSqFt > 0 ? Math.round(amount / areaSqFt) : 0;
}

function textValue(input, fallback = "") {
  return input?.value.trim() || fallback;
}

function isRccWaterproofing(poolType) {
  return poolType === RCC_POOL_TYPE;
}

function isFibreglassProposalType(poolType) {
  return typeof poolType === "string" && poolType.toLowerCase().includes("fibreglass");
}

function getProposalTypeFromField() {
  const field = fields.proposalTypeField;
  return field ? field.value : PROPOSAL_TYPES.FIBREGLASS_POOL;
}

function isFrpProposal(proposalType) {
  return proposalType === PROPOSAL_TYPES.FRP_WATERPROOFING || 
         proposalType === PROPOSAL_TYPES.FRP_LAMINATION_MEP;
}

function isRccPoolOrFrp(proposalType) {
  return proposalType === PROPOSAL_TYPES.FRP_WATERPROOFING || 
         proposalType === PROPOSAL_TYPES.FRP_LAMINATION_MEP;
}

function getDefaultMepItemsForProposalType(proposalType) {
  switch (proposalType) {
    case PROPOSAL_TYPES.FRP_WATERPROOFING:
      return getDefaultFrpWaterproofingItems();
    case PROPOSAL_TYPES.FRP_LAMINATION_MEP:
      return getDefaultFrpLaminationMepItems();
    case PROPOSAL_TYPES.MEP_ONLY:
      return getDefaultMepOnlyItems();
    case PROPOSAL_TYPES.FIBREGLASS_POOL:
    default:
      return getDefaultFibreglassMepItems();
  }
}

function getDefaultFibreglassMepItems() {
  return [
    { description: "Air Assisted Vortex DOA EA Pressure sand filter", brand: "Atlas", qty: "1 No" },
    { description: "Purity Sand", brand: "Standard", qty: "200 Kg" },
    { description: "Pool Light (12V x 24W)", brand: "Standard", qty: "4 Nos" },
    { description: "LED Driver", brand: "Standard", qty: "2 Nos" },
    { description: "Pool Pump 1.5 HP", brand: "Standard", qty: "1 No" },
    { description: "Net with 3 micron mesh", brand: "Standard", qty: "1 No" },
    { description: "Vacuum Hose", brand: "Standard", qty: "7 M" },
    { description: "Vacuum Head", brand: "Standard", qty: "1 No" },
    { description: "Vacuum Point", brand: "Standard", qty: "1 No" },
    { description: "Brush", brand: "Standard", qty: "1 No" },
    { description: "SS Ladder (4 Steps)", brand: "Standard", qty: "1 No" },
    { description: "Telescopic Rod", brand: "Standard", qty: "1 No" },
    { description: "Skimmer Basket", brand: "Standard", qty: "1 No" },
    { description: "Eye Ball", brand: "Standard", qty: "3 Nos" },
    { description: "Main Drain Cover", brand: "Standard", qty: "1 No" },
    { description: "Plumbing Materials", brand: "PVC", qty: "Required" },
    { description: "Testing Kit for pH and Chlorine", brand: "Standard", qty: "1 No" }
  ];
}

function getDefaultFrpWaterproofingItems() {
  return [
    { description: "Gelcoat (Pigmented)", brand: "Standard", qty: "As per treatment area" },
    { description: "CSM (Chopped Strand Mat) - 450 gsm", brand: "Standard", qty: "As per layers" },
    { description: "Woven Roving - 600 gsm", brand: "Standard", qty: "As per layers" },
    { description: "Polyester Resin", brand: "Standard", qty: "As per treatment area" },
    { description: "Catalyst (MEKP)", brand: "Standard", qty: "1% of resin" },
    { description: "Release Agent", brand: "Standard", qty: "As needed" },
    { description: "Pigment (Colour)", brand: "Standard", qty: "As per colour" },
    { description: "Surface Preparation Materials (Primer, Sealant)", brand: "Standard", qty: "Required" },
    { description: "Topcoat (Polyurethane or Epoxy)", brand: "Standard", qty: "As per coverage" }
  ];
}

function getDefaultMepOnlyItems() {
  return [
    { description: "Centrifugal Pump with Motor", brand: "Standard", qty: "1 No" },
    { description: "Sand Filter", brand: "Standard", qty: "1 No" },
    { description: "Filter Sand", brand: "Standard", qty: "Required qty" },
    { description: "Underwater LED Lights (12V)", brand: "Standard", qty: "As per design" },
    { description: "LED Driver / Transformer", brand: "Standard", qty: "As per lights" },
    { description: "PVC Piping and Fittings", brand: "Standard", qty: "Required" },
    { description: "Electrical Control Panel", brand: "Standard", qty: "1 No" },
    { description: "Electrical Wiring and Cable", brand: "Standard", qty: "Required" },
    { description: "Skimmer", brand: "Standard", qty: "1 No" },
    { description: "Main Drain", brand: "Standard", qty: "1 No" },
    { description: "Testing and Commissioning", brand: "Standard", qty: "Complete" }
  ];
}

function getDefaultFrpLaminationMepItems() {
  return [
    ...getDefaultFrpWaterproofingItems(),
    ...getDefaultMepOnlyItems().slice(0, 5)
  ];
}

function calculateTreatmentArea(length, width, depth, unit) {
  // Convert to meters if needed
  const lengthM = unit === "ft" ? length * 0.3048 : length;
  const widthM = unit === "ft" ? width * 0.3048 : width;
  const depthM = unit === "ft" ? depth * 0.3048 : depth;
  
  const floorArea = lengthM * widthM;
  const wallArea = 2 * (lengthM * depthM) + 2 * (widthM * depthM);
  const totalArea = floorArea + wallArea;
  const totalAreaFt = totalArea * 10.7639;
  
  return {
    floorArea: Math.round(floorArea * 100) / 100,
    wallArea: Math.round(wallArea * 100) / 100,
    totalArea: Math.round(totalArea * 100) / 100,
    totalAreaFt: Math.round(totalAreaFt * 100) / 100
  };
}

function buildProposalState() {
  const length = asNumber(fields.length, 0);
  const width = asNumber(fields.width, 0);
  const depth = asNumber(fields.depth, 0);
  const unit = fields.unit.value;
  const lengthM = toMeters(length, unit);
  const widthM = toMeters(width, unit);
  const depthM = toMeters(depth, unit);
  const hasDimensions = length > 0 && width > 0 && depth > 0;
  const areaSqFt = sqFtFrom(length, width, unit);
  const volumeLitres = litresFrom(length, width, depth, unit);
  const baseRate = asNumber(fields.baseRate, 0);
  const gstRate = asNumber(fields.gstRate, 0);
  const proposalType = getProposalTypeFromField();
  const treatmentArea = calculateTreatmentArea(length, width, depth, unit);
  const chart = hasDimensions ? closestChart(lengthM, widthM, depthM, areaSqFt, baseRate) : null;
  const defaultInstallation = hasDimensions ? Math.round(chart.shell * 0.18) : 0;
  const defaultShell = hasDimensions ? Math.max(0, chart.shell - defaultInstallation) : 0;
  const shellAmount = hasDimensions ? fieldValueOrDefault(fields.shellUnitPrice, defaultShell) : 0;
  const installationAmount = hasDimensions ? fieldValueOrDefault(fields.installationUnitPrice, defaultInstallation) : 0;
  const mepAmount = hasDimensions ? fieldValueOrDefault(fields.mepUnitPrice, chart?.mep ?? 0) : 0;
  const adjustedSubtotal = shellAmount + installationAmount + mepAmount;
  const gst = Math.round(adjustedSubtotal * (gstRate / 100));
  const grandTotal = fields.includeGst.checked ? adjustedSubtotal + gst : adjustedSubtotal;
  const dimensions = hasDimensions
    ? `${formatMeasurement(length)} x ${formatMeasurement(width)} x ${formatMeasurement(depth)} ${unit}`
    : "Awaiting dimensions";
  const dimensionsM = hasDimensions
    ? `${formatMeasurement(lengthM)} x ${formatMeasurement(widthM)} x ${formatMeasurement(depthM)} m`
    : "Awaiting dimensions";
  const areaText = hasDimensions
    ? `${decimalFormat.format(areaSqFt)} SQFT`
    : "Awaiting dimensions";
  const volumeText = hasDimensions
    ? `${decimalFormat.format(Math.round(volumeLitres))} litres`
    : "Awaiting dimensions";
  const poolType = isFrpProposal(proposalType) || proposalType === PROPOSAL_TYPES.MEP_ONLY
    ? fields.existingPoolType.value
    : fields.poolType.value;
  const client = textValue(fields.clientName, "Client");
  const location = textValue(fields.location, "Project site");
  const revision_no = fields.revision?.value.trim() || "R0";
  const proposalDate = fields.proposalDate.value || dateInputValue(new Date());
  const validityDays = Math.max(1, Math.round(asNumber(fields.validityDays, 7)));
  const validUntil = addDaysToDate(proposalDate, validityDays);
  const matchText = hasDimensions
    ? `${chart.series} ${chart.length} x ${chart.width} x ${chart.depth} m${chart.tag ? ` (${chart.tag})` : ""}`
    : "Awaiting dimensions";

  return {
    length,
    width,
    depth,
    unit,
    lengthM,
    widthM,
    depthM,
    hasDimensions,
    areaSqFt,
    volumeLitres,
    baseRate,
    gstRate,
    chart,
    shellAmount,
    installationAmount,
    mepAmount,
    adjustedSubtotal,
    gst,
    grandTotal,
    dimensions,
    dimensionsM,
    areaText,
    volumeText,
    proposalDate,
    validityDays,
    validUntil,
    poolType,
    proposalType,
    client,
    location,
    treatmentArea,
    revision_no,
    preparedByName: textValue(fields.preparedByName, "Krishna Chandran"),
    preparedByDesignation: textValue(fields.preparedByDesignation, "Sales Engineer"),
    preparedByPhone: textValue(fields.preparedByPhone, "+91 98953 99306"),
    approvedByName: textValue(fields.approvedByName, "Vipin M R"),
    approvedByDesignation: textValue(fields.approvedByDesignation, "Business Development Manager"),
    approvedByPhone: textValue(fields.approvedByPhone, "+91 98473 99306"),
    mepItems: Array.isArray(state.mepItems) ? state.mepItems : [],
    matchText,
    isRcc: isRccWaterproofing(poolType),
    existingPoolType: fields.existingPoolType.value
  };
}

function proposalIntroHtml(state) {
  const client = escapeHtml(state.client);
  const location = escapeHtml(state.location);
  // FRP Waterproofing / Lamination proposals: technical waterproofing wording (no brand mentions)
  if (state.proposalType === PROPOSAL_TYPES.FRP_WATERPROOFING || state.proposalType === PROPOSAL_TYPES.FRP_LAMINATION_MEP) {
    return `Dear Sir,<br><br>Thank you for your interest. With reference to your enquiry for FRP waterproofing and lamination works for your existing RCC swimming pool at ${location}, we are pleased to submit our technical proposal detailing the scope of work, materials, methodology and commercial terms.<br><br>The proposed treatment system is designed to improve waterproofing performance, structural durability and long-term serviceability of the pool structure.<br><br>Warm regards,<br>Technical Team`;
  }

  // MEP only proposals: equipment & installation wording
  if (state.proposalType === PROPOSAL_TYPES.MEP_ONLY) {
    return `Dear Sir,<br><br>Thank you for your enquiry. We are pleased to submit our proposal for MEP and water treatment system supply and installation at ${location}. This document outlines the proposed equipment, scope of installation, testing and commissioning, and commercial terms.<br><br>Warm regards,<br>Technical Team`;
  }

  // Default: fibreglass product proposal wording (keeps previous product tone)
  return `Dear Sir,<br><br>Thank you for your interest in our composite pool solutions. With reference to your enquiry for the supply and installation of a custom-made fibreglass pool at ${location}, we are pleased to submit our quotation for ${client}. Please find the attached proposal detailing the scope and pricing. Should you need any clarification or technical assistance, we will be glad to assist.<br><br>Warm regards,<br>Team`;
}

function renderSpecifications(state) {
  // Render specifications differently depending on proposal type
  if (isFrpProposal(state.proposalType)) {
    // FRP / Waterproofing proposals focus on existing RCC pool details and finish
    output.specList.innerHTML = `
      <dt>Pool Type</dt><dd>${escapeHtml(state.poolType)}</dd>
      <dt>Shape</dt><dd>Rectangular</dd>
      <dt>Dimensions</dt><dd>${escapeHtml(state.dimensions)}${state.unit === "ft" ? ` (${escapeHtml(state.dimensionsM)})` : ""}</dd>
      <dt>Pool Area</dt><dd>${escapeHtml(state.areaText)}</dd>
      <dt>Pool Volume</dt><dd>${escapeHtml(state.volumeText)}</dd>
      <dt>Finish</dt><dd>RCC Concrete Surface</dd>
    `;
  } else if (state.proposalType === PROPOSAL_TYPES.MEP_ONLY) {
    output.specList.innerHTML = `
      <dt>Pool Type</dt><dd>${escapeHtml(state.poolType)}</dd>
      <dt>Dimensions</dt><dd>${escapeHtml(state.dimensions)}</dd>
      <dt>Pool Volume</dt><dd>${escapeHtml(state.volumeText)}</dd>
    `;
  } else {
    // Fibreglass product proposal
    output.specList.innerHTML = `
      <dt>Pool Type</dt><dd>${escapeHtml(state.poolType)}</dd>
      <dt>Shape</dt><dd>Rectangular</dd>
      <dt>Dimensions</dt><dd>${escapeHtml(state.dimensions)}${state.unit === "ft" ? ` (${escapeHtml(state.dimensionsM)})` : ""}</dd>
      <dt>Pool Area</dt><dd>${escapeHtml(state.areaText)}</dd>
      <dt>Pool Volume</dt><dd>${escapeHtml(state.volumeText)}</dd>
      <dt>Finish</dt><dd>Pigmented smooth gelcoat finish</dd>
      <dt>Pool System</dt><dd>Skimmer type</dd>
      <dt>Brand</dt><dd>FYBRON</dd>
    `;
  }
}

function renderExistingPoolDetails(state) {
  const { floorArea, wallArea, totalArea, totalAreaFt } = state.treatmentArea;
  if (!state.hasDimensions) {
    output.existingPoolSpecList.innerHTML = `
      <dt>Existing Pool Type</dt><dd>${escapeHtml(state.poolType)}</dd>
      <dt>Note</dt><dd>Enter pool dimensions to populate existing pool treatment details.</dd>
    `;
    return;
  }

  // Existing Pool Details for FRP proposals
  output.existingPoolSpecList.innerHTML = `
    <dt>Existing Pool Type</dt><dd>${escapeHtml(state.poolType)}</dd>
    <dt>Construction Type</dt><dd>RCC (Reinforced Concrete)</dd>
    <dt>Length</dt><dd>${escapeHtml(state.dimensions.split(' x ')[0])} ${state.unit}</dd>
    <dt>Width</dt><dd>${escapeHtml(state.dimensions.split(' x ')[1])} ${state.unit}</dd>
    <dt>Depth</dt><dd>${escapeHtml(state.dimensions.split(' x ')[2].split(' ')[0])} ${state.unit}</dd>
    <dt>Approx Water Volume</dt><dd>${escapeHtml(state.volumeText)}</dd>
    <dt>Floor Area</dt><dd>${formatMeasurement(floorArea)} sq.m / ${formatMeasurement(floorArea * 10.7639)} sq.ft</dd>
    <dt>Wall Area</dt><dd>${formatMeasurement(wallArea)} sq.m / ${formatMeasurement(wallArea * 10.7639)} sq.ft</dd>
    <dt>Total Treatment Area</dt><dd><strong>${formatMeasurement(totalArea)} sq.m / ${formatMeasurement(totalAreaFt)} sq.ft</strong></dd>
  `;
}

function updateTreatmentAreaDisplay(state) {
  const { floorArea, wallArea, totalArea, totalAreaFt } = state.treatmentArea;
  if (!state.hasDimensions) {
    output.floorAreaValue.textContent = "Awaiting dimensions";
    output.wallAreaValue.textContent = "Awaiting dimensions";
    output.totalTreatmentAreaValue.textContent = "Awaiting dimensions";
    output.totalTreatmentAreaFtValue.textContent = "Awaiting dimensions";
    return;
  }

  output.floorAreaValue.textContent = formatMeasurement(floorArea);
  output.wallAreaValue.textContent = formatMeasurement(wallArea);
  output.totalTreatmentAreaValue.textContent = formatMeasurement(totalArea);
  output.totalTreatmentAreaFtValue.textContent = formatMeasurement(totalAreaFt);
}

function isRccOrFrpProposal(proposalType) {
  return proposalType === PROPOSAL_TYPES.FRP_WATERPROOFING || 
         proposalType === PROPOSAL_TYPES.FRP_LAMINATION_MEP;
}

function renderTechnicalSummary(state) {
  let lines = [];
  
  if (state.proposalType === PROPOSAL_TYPES.FIBREGLASS_POOL) {
    lines = [
      "Factory-manufactured FRP/GRP fibreglass pool shell with premium gelcoat finish.",
      "Complete supply, positioning, installation, and commissioning included as per approved proposal scope.",
      "MEP integration includes filtration system, plumbing lines, underwater lighting, accessories, and related fittings as specified.",
      "Exterior protective flow-coat finish designed for enhanced structural durability and bonding stability.",
      "Installation and commissioning subject to approved civil readiness, utility access, and agreed project schedule.",
      "Final equipment brands/models may vary based on availability while maintaining equivalent specifications and performance standards.",
      "Coordination support with civil contractor/site team during positioning, installation, and commissioning stages.",
      "System designed for low-maintenance operation, long-term durability, and user-friendly performance."
    ];
  } else if (state.proposalType === PROPOSAL_TYPES.FRP_WATERPROOFING) {
    lines = [
      "Professional GRP/FRP waterproofing and lamination system for existing RCC pool structures.",
      "Complete surface treatment including preparation, resin application, laminate layers, and protective topcoat.",
      "Total treatment area: " + formatMeasurement(state.treatmentArea.totalArea) + " sq.m (" + formatMeasurement(state.treatmentArea.totalAreaFt) + " sq.ft).",
      "Installation and curing subject to approved surface preparation and weather conditions.",
      "Final material grades and layup schedule determined based on site inspection and structural assessment.",
      "Warranty and durability subject to proper curing, maintenance, and normal operating conditions.",
      "Professional technical supervision during all application phases to ensure quality standards."
    ];
  } else if (state.proposalType === PROPOSAL_TYPES.FRP_LAMINATION_MEP) {
    lines = [
      "Comprehensive solution including GRP/FRP waterproofing and complete MEP system integration.",
      "Total treatment area: " + formatMeasurement(state.treatmentArea.totalArea) + " sq.m (" + formatMeasurement(state.treatmentArea.totalAreaFt) + " sq.ft).",
      "Complete supply and installation of filtration, circulation, and auxiliary systems.",
      "Underwater lighting and electrical integration as per approved specifications.",
      "Installation and commissioning subject to surface treatment completion and utility availability.",
      "Final equipment brands/models may vary based on availability while maintaining equivalent performance.",
      "Integrated testing and commissioning of waterproofing and MEP systems."
    ];
  } else if (state.proposalType === PROPOSAL_TYPES.MEP_ONLY) {
    lines = [
      "Complete MEP (Mechanical, Electrical, Plumbing) and filtration system supply and installation.",
      "Includes circulation pump, filtration system, piping, electrical controls, and underwater lighting.",
      "System designed for efficient water circulation, clarity maintenance, and safe operation.",
      "Installation subject to approved pool structure and utility access arrangements.",
      "Final equipment brands/models may vary based on availability while maintaining equivalent specifications.",
      "Professional installation, testing, and commissioning support.",
      "System handover in fully functional and ready-to-use condition."
    ];
  }

  output.technicalSummary.innerHTML = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
}

function renderPriceSummary(state) {
  let shellDescription = "";
  let installationDescription = "";
  let mepDescription = "";

  if (state.proposalType === PROPOSAL_TYPES.FRP_WATERPROOFING) {
    shellDescription = `FRP Waterproofing & Lamination Works<br><small>RCC pool size: ${escapeHtml(state.dimensions)}</small>`;
    installationDescription = "Surface preparation, restoration, testing & handover";
    mepDescription = "Filtration and ancillary MEP items (if included)";
  } else if (state.proposalType === PROPOSAL_TYPES.FRP_LAMINATION_MEP) {
    shellDescription = `FRP Waterproofing, Lamination & MEP Works<br><small>RCC pool size: ${escapeHtml(state.dimensions)}</small>`;
    installationDescription = "Surface preparation, lamination works, testing & commissioning";
    mepDescription = "Complete MEP system supply, installation & commissioning";
  } else if (state.proposalType === PROPOSAL_TYPES.MEP_ONLY) {
    shellDescription = `MEP & Water Treatment System<br><small>Pool size: ${escapeHtml(state.dimensions)}</small>`;
    installationDescription = "Supply, installation, testing & commissioning of MEP systems";
    mepDescription = "Filtration, pumps, electrical, plumbing & accessories";
  } else {
    shellDescription = `${escapeHtml(state.poolType)} Shell<br><small>Size: ${escapeHtml(state.dimensions)}</small>`;
    installationDescription = "Positioning, Installation, Testing & Pool commissioning";
    mepDescription = "Pumps, Filter, Pipelines, Electrification (MEP) & Pool Accessories";
  }

  if (!state.hasDimensions) {
    output.quoteRows.innerHTML = `
      <tr><td colspan="4">Enter pool dimensions to calculate pricing.</td></tr>
    `;
    output.amountWords.textContent = "";
    output.grandTotal.textContent = "Awaiting dimensions";
    return;
  }

  output.quoteRows.innerHTML = `
    <tr><td>${shellDescription}</td><td>${INR.format(state.shellAmount)}</td><td>1</td><td>${INR.format(state.shellAmount)}</td></tr>
    <tr><td>${installationDescription}</td><td>${INR.format(state.installationAmount)}</td><td>1</td><td>${INR.format(state.installationAmount)}</td></tr>
    <tr><td>${mepDescription}</td><td>${INR.format(state.mepAmount)}</td><td>1</td><td>${INR.format(state.mepAmount)}</td></tr>
    <tr><td><strong>Total</strong></td><td></td><td></td><td><strong>${INR.format(state.adjustedSubtotal)}</strong></td></tr>
    ${fields.includeGst.checked ? `<tr><td>GST</td><td>${decimalFormat.format(state.gstRate)}%</td><td></td><td>${INR.format(state.gst)}</td></tr>` : ""}
  `;

  output.amountWords.textContent = wordsHint(state.grandTotal);
  output.grandTotal.textContent = INR.format(state.grandTotal);
}

function renderPaymentTerms() {
  return `
      <h3>Payment Terms</h3>
      <ul>
        <li>50% Advance payment upon acceptance of the proposal and issuance of work order.</li>
        <li>40% Progress payment during execution against approved work progress, material supply, fabrication, installation, or application activities as applicable to the project scope.</li>
        <li>10% Final payment upon testing, commissioning, completion, and handover of the agreed scope of work.</li>
      </ul>
    `;
}

function renderScopeByProposalType(state) {
  if (state.proposalType === PROPOSAL_TYPES.FRP_WATERPROOFING) {
    return `
      <h3>Scope of Supply & Work</h3>
      <ul>
        <li>Surface cleaning</li>
        <li>Surface preparation</li>
        <li>Crack treatment</li>
        <li>FRP lamination</li>
        <li>Resin application</li>
        <li>Topcoat application</li>
        <li>Inspection & handover</li>
      </ul>
      <h3>Project Timeline</h3>
      <ul>
        <li>Mobilization and surface preparation: 1-2 days</li>
        <li>FRP lamination and coating: 3-5 days</li>
        <li>Curing, inspection and handover: 1-2 days</li>
      </ul>
      <h3>Warranty & Support</h3>
      <ul>
        <li>12-month workmanship warranty on applied FRP works</li>
        <li>Performance warranty for waterproofing subject to proper use</li>
        <li>Technical support through inspection and handover</li>
      </ul>
      ${renderPaymentTerms()}
    `;
  }

  if (state.proposalType === PROPOSAL_TYPES.FRP_LAMINATION_MEP) {
    return `
      <h3>Scope of Supply & Work</h3>
      <ul>
        <li>Surface cleaning</li>
        <li>Surface preparation</li>
        <li>Crack treatment</li>
        <li>FRP lamination</li>
        <li>Resin application</li>
        <li>Topcoat application</li>
        <li>Inspection & handover</li>
      </ul>
      <h4>MEP & Filtration Scope</h4>
      <ul>
        <li>Filtration System</li>
        <li>Pumping System</li>
        <li>Plumbing Works</li>
        <li>Electrical Works</li>
        <li>Testing & Commissioning</li>
      </ul>
      <h3>Project Timeline</h3>
      <ul>
        <li>Mobilization and surface preparation: 1-2 days</li>
        <li>FRP lamination and system installation: 4-6 days</li>
        <li>Testing, commissioning and handover: 1-2 days</li>
      </ul>
      <h3>Warranty & Support</h3>
      <ul>
        <li>12-month workmanship warranty on FRP application and MEP installation</li>
        <li>Equipment warranty as per manufacturer terms</li>
        <li>Support during commissioning and handover</li>
      </ul>
      ${renderPaymentTerms()}
    `;
  }

  if (state.proposalType === PROPOSAL_TYPES.MEP_ONLY) {
    return `
      <h3>Scope of Supply & Work</h3>
      <ul>
        <li>Filtration System</li>
        <li>Pumping System</li>
        <li>Plumbing Works</li>
        <li>Electrical Works</li>
        <li>Testing & Commissioning</li>
      </ul>
      <h3>Project Timeline</h3>
      <ul>
        <li>Equipment supply and delivery: 7-10 days</li>
        <li>Installation and piping works: 2-4 days</li>
        <li>Testing, commissioning and handover: 1-2 days</li>
      </ul>
      <h3>Warranty & Support</h3>
      <ul>
        <li>12-month workmanship warranty on installation</li>
        <li>Manufacturer warranty on supplied equipment</li>
        <li>Support through system testing and handover</li>
      </ul>
      ${renderPaymentTerms()}
    `;
  }

  return `
    <h3>Scope of Supply & Work</h3>
    <p>${escapeHtml(fields.scope.value.trim()).replace(/\n/g, '<br>')}</p>
    <h3>Project Timeline</h3>
    <ul>
      <li>Manufacturing & delivery: 30 working days from receipt of 50% advance.</li>
      <li>Installation and commissioning: 5-7 days after material delivery, subject to site readiness.</li>
      <li>Final handover and acceptance: following commissioning.</li>
    </ul>
    <h3>Warranty & Support</h3>
    <ul>
      <li>10-year warranty on fibreglass pool shell against leakage.</li>
      <li>Manufacturer warranty on pool equipment and accessories.</li>
      <li>Support during installation, commissioning and initial handover.</li>
    </ul>
    ${renderPaymentTerms()}
  `;
}

function renderAccessoryRows(state) {
  output.itemRows.innerHTML = accessorySchedule(state.lengthM, state.areaSqFt).map((row) => `
    <tr>
      <td><div class="item-photo ${row.photo}" aria-label="${escapeHtml(row.item)} photo placeholder"></div></td>
      <td>${escapeHtml(row.item)}</td>
      <td>${escapeHtml(row.brand)}</td>
      <td>${escapeHtml(row.qty)}</td>
    </tr>
  `).join("");
}

function renderSignatureBlock(state) {
  output.outPreparedByName.textContent = state.preparedByName;
  output.outPreparedByDesignation.textContent = state.preparedByDesignation;
  output.outPreparedByPhone.textContent = state.preparedByPhone;
  output.outApprovedByName.textContent = state.approvedByName;
  output.outApprovedByDesignation.textContent = state.approvedByDesignation;
  output.outApprovedByPhone.textContent = state.approvedByPhone;
}

function render() {
  const state = buildProposalState();

  output.visualLabel.textContent = state.dimensions;
  output.chartMatch.textContent = state.hasDimensions
    ? (state.chart?.exact ? state.matchText : `Estimated from ${state.matchText}`)
    : "Awaiting dimensions";
  output.surfaceArea.textContent = state.areaText;
  output.volume.textContent = state.volumeText;
  output.estimate.textContent = state.hasDimensions ? INR.format(state.grandTotal) : "Awaiting dimensions";
  output.proposalTitle.textContent = `Proposal for ${state.poolType}`;
  output.outClient.textContent = state.client;
  output.outLocation.textContent = state.location;
  output.outDate.textContent = formatDate(state.proposalDate);
  output.outValidUntil.textContent = formatDate(state.validUntil);
  output.outQuoteNo.textContent = fields.quoteNo.value.trim() || "Draft";
  if (output.outRevision) {
    output.outRevision.textContent = state.revision_no;
  }
  output.proposalIntro.innerHTML = proposalIntroHtml(state);
  output.poolImageSize.textContent = state.hasDimensions ? `Size: ${state.dimensions}` : "Awaiting dimensions";
  renderSpecifications(state);
  if (isRccOrFrpProposal(state.proposalType)) {
    renderExistingPoolDetails(state);
    updateTreatmentAreaDisplay(state);
  }
  renderTechnicalSummary(state);
  renderPriceSummary(state);
  renderMepRows(state);
  renderSignatureBlock(state);
  if (output.proposalTypeDetailsSection) {
    output.proposalTypeDetailsSection.innerHTML = renderScopeByProposalType(state);
  }
  output.outNotes.innerHTML = escapeHtml(fields.notes.value.trim()).replace(/\n/g, "<br>");
  updateProposalLayoutVisibility(state);

  renderPoolDiagram(state.lengthM, state.widthM, state.depthM, state.dimensions);
}

function renderPoolDiagram(length, width, depth, dimensionLabel) {
  const diagramContainer = document.querySelector("#poolDiagram");
  if (!diagramContainer) return;
  if (length <= 0 || width <= 0 || depth <= 0) {
    diagramContainer.innerHTML = `
      <div class="diagram-placeholder">Enter pool dimensions to generate schematic.</div>
    `;
    return;
  }

  // Use larger scale for print quality - 1 unit = 1 pixel in SVG
  const scale = 60; // 60px per meter for print quality
  const scaledLength = length * scale;
  const scaledWidth = width * scale;
  const scaledDepth = depth * scale;

  // Convert millimeters to CSS pixels (96 DPI): 1 mm ≈ 3.7795275591 px
  const mmToPx = (mm) => mm * 3.7795275591;

  // Layout constants: use 10mm distances where spacing is required
  const topViewPadding = Math.round(mmToPx(10));
  const sideViewPadding = Math.round(mmToPx(10));
  const viewGap = Math.round(mmToPx(10));
  const bottomPadding = Math.round(mmToPx(10));

  // Calculate dimensions
  const topViewWidth = scaledLength + topViewPadding * 2;
  const topViewHeight = scaledWidth + topViewPadding * 2 + 60; // Extra space for labels

  const sideViewWidth = scaledLength + sideViewPadding * 2;
  const sideViewHeight = scaledDepth + sideViewPadding * 2 + 60; // Extra space for labels

  // Total SVG dimensions
  const svgWidth = Math.max(topViewWidth, sideViewWidth) + 40;
  const svgHeight = topViewHeight + sideViewHeight + viewGap + bottomPadding;

  // Calculate positions for centering
  const topViewStartX = (svgWidth - topViewWidth) / 2;
  const topViewStartY = 30;

  const sideViewStartX = (svgWidth - sideViewWidth) / 2;
  const sideViewStartY = topViewStartY + topViewHeight + viewGap;

  // Pool positions
  const topPoolX = topViewStartX + topViewPadding;
  const topPoolY = topViewStartY + topViewPadding;

  const sidePoolX = sideViewStartX + sideViewPadding;
  const sidePoolY = sideViewStartY + sideViewPadding;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" style="max-width: 100%; height: auto; display: block; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
      <defs>
        <style>
          .pool-label { font-family: system-ui, -apple-system, sans-serif; fill: #132126; font-weight: 600; }
          .pool-dimension { font-size: 14px; fill: #116c67; }
          .pool-depth-label { font-size: 14px; fill: #116c67; }
          .pool-title { font-size: 13px; fill: #5f6d73; font-weight: 600; }
          .dimension-line { stroke: #116c67; stroke-width: 1.5; }
          .dimension-tick { stroke: #116c67; stroke-width: 1; }
        </style>
      </defs>
      
      <!-- ===== TOP-DOWN VIEW ===== -->
      <g id="topDownView">
        <!-- Pool shell outline -->
        <rect x="${topPoolX}" y="${topPoolY}" width="${scaledLength}" height="${scaledWidth}" fill="#3aa9c7" opacity="0.15" stroke="#116c67" stroke-width="2.5"/>
        
        <!-- Water fill -->
        <rect x="${topPoolX + 2}" y="${topPoolY + 2}" width="${scaledLength - 4}" height="${scaledWidth - 4}" fill="#3aa9c7" opacity="0.25" stroke="none"/>
        
        <!-- Corner circles -->
        <circle cx="${topPoolX}" cy="${topPoolY}" r="3" fill="#116c67"/>
        <circle cx="${topPoolX + scaledLength}" cy="${topPoolY}" r="3" fill="#116c67"/>
        <circle cx="${topPoolX}" cy="${topPoolY + scaledWidth}" r="3" fill="#116c67"/>
        <circle cx="${topPoolX + scaledLength}" cy="${topPoolY + scaledWidth}" r="3" fill="#116c67"/>
        
        <!-- LENGTH DIMENSION (Top) -->
        <line x1="${topPoolX}" y1="${topPoolY - 24}" x2="${topPoolX + scaledLength}" y2="${topPoolY - 24}" class="dimension-line"/>
        <line x1="${topPoolX}" y1="${topPoolY - 30}" x2="${topPoolX}" y2="${topPoolY - 18}" class="dimension-tick"/>
        <line x1="${topPoolX + scaledLength}" y1="${topPoolY - 30}" x2="${topPoolX + scaledLength}" y2="${topPoolY - 18}" class="dimension-tick"/>
        <text x="${topPoolX + scaledLength / 2}" y="${topPoolY - 32}" text-anchor="middle" class="pool-label pool-dimension">Length: ${formatMeasurement(length)} m</text>
        
        <!-- WIDTH DIMENSION (Left) -->
        <line x1="${topPoolX - 24}" y1="${topPoolY}" x2="${topPoolX - 24}" y2="${topPoolY + scaledWidth}" class="dimension-line"/>
        <line x1="${topPoolX - 30}" y1="${topPoolY}" x2="${topPoolX - 18}" y2="${topPoolY}" class="dimension-tick"/>
        <line x1="${topPoolX - 30}" y1="${topPoolY + scaledWidth}" x2="${topPoolX - 18}" y2="${topPoolY + scaledWidth}" class="dimension-tick"/>
        <text x="${topPoolX - 48}" y="${topPoolY + scaledWidth / 2}" text-anchor="middle" class="pool-label pool-dimension" transform="rotate(-90 ${topPoolX - 48} ${topPoolY + scaledWidth / 2})">Width: ${formatMeasurement(width)} m</text>
        
        <!-- Title -->
        <text x="${topViewStartX + topViewWidth / 2}" y="${topPoolY + scaledWidth + 50}" text-anchor="middle" class="pool-label pool-title">TOP-DOWN VIEW</text>
      </g>
      
      <!-- ===== SIDE ELEVATION VIEW ===== -->
      <g id="sideView">
        <!-- Title -->
        <text x="${sideViewStartX + sideViewWidth / 2}" y="${sidePoolY - 28}" text-anchor="middle" class="pool-label pool-title">SIDE ELEVATION VIEW</text>

        <!-- Pool shell outline (side view) -->
        <rect x="${sidePoolX}" y="${sidePoolY}" width="${scaledLength}" height="${scaledDepth}" fill="#3aa9c7" opacity="0.15" stroke="#116c67" stroke-width="2.5"/>
        
        <!-- Water fill (side) -->
        <rect x="${sidePoolX + 2}" y="${sidePoolY + 2}" width="${scaledLength - 4}" height="${scaledDepth - 4}" fill="#3aa9c7" opacity="0.25" stroke="none"/>
        
        <!-- Bottom line (ground) -->
        <line x1="${sidePoolX}" y1="${sidePoolY + scaledDepth}" x2="${sidePoolX + scaledLength}" y2="${sidePoolY + scaledDepth}" stroke="#5f6d73" stroke-width="1" stroke-dasharray="4,2"/>
        
        <!-- Corner circles -->
        <circle cx="${sidePoolX}" cy="${sidePoolY}" r="3" fill="#116c67"/>
        <circle cx="${sidePoolX + scaledLength}" cy="${sidePoolY}" r="3" fill="#116c67"/>
        <circle cx="${sidePoolX}" cy="${sidePoolY + scaledDepth}" r="3" fill="#116c67"/>
        <circle cx="${sidePoolX + scaledLength}" cy="${sidePoolY + scaledDepth}" r="3" fill="#116c67"/>
        
        <!-- LENGTH DIMENSION (Bottom of side view) -->
        <line x1="${sidePoolX}" y1="${sidePoolY + scaledDepth + 24}" x2="${sidePoolX + scaledLength}" y2="${sidePoolY + scaledDepth + 24}" class="dimension-line"/>
        <line x1="${sidePoolX}" y1="${sidePoolY + scaledDepth + 30}" x2="${sidePoolX}" y2="${sidePoolY + scaledDepth + 18}" class="dimension-tick"/>
        <line x1="${sidePoolX + scaledLength}" y1="${sidePoolY + scaledDepth + 30}" x2="${sidePoolX + scaledLength}" y2="${sidePoolY + scaledDepth + 18}" class="dimension-tick"/>
        <text x="${sidePoolX + scaledLength / 2}" y="${sidePoolY + scaledDepth + 42}" text-anchor="middle" class="pool-label pool-dimension">Length: ${formatMeasurement(length)} m</text>
        
        <!-- DEPTH DIMENSION (Right) -->
        <line x1="${sidePoolX + scaledLength + 24}" y1="${sidePoolY}" x2="${sidePoolX + scaledLength + 24}" y2="${sidePoolY + scaledDepth}" class="dimension-line"/>
        <line x1="${sidePoolX + scaledLength + 30}" y1="${sidePoolY}" x2="${sidePoolX + scaledLength + 18}" y2="${sidePoolY}" class="dimension-tick"/>
        <line x1="${sidePoolX + scaledLength + 30}" y1="${sidePoolY + scaledDepth}" x2="${sidePoolX + scaledLength + 18}" y2="${sidePoolY + scaledDepth}" class="dimension-tick"/>
        <text x="${sidePoolX + scaledLength + 48}" y="${sidePoolY + scaledDepth / 2}" text-anchor="middle" class="pool-label pool-depth-label" transform="rotate(90 ${sidePoolX + scaledLength + 48} ${sidePoolY + scaledDepth / 2})">Depth: ${formatMeasurement(depth)} m</text>
        
      </g>
    </svg>
  `;

  diagramContainer.innerHTML = svg;
}

function updateProposalLayoutVisibility(state) {
  const isFibreglass = state.proposalType === PROPOSAL_TYPES.FIBREGLASS_POOL;
  const isRccOrFrp = state.proposalType === PROPOSAL_TYPES.FRP_WATERPROOFING || 
                     state.proposalType === PROPOSAL_TYPES.FRP_LAMINATION_MEP;
  const isMepOnly = state.proposalType === PROPOSAL_TYPES.MEP_ONLY;
  
  // Show/hide fibreglass benefits section
  if (output.fiberglassBenefitsSection) {
    output.fiberglassBenefitsSection.hidden = !isFibreglass;
  }
  
  // Show/hide pool specifications section
  if (output.poolSpecificationsSection) {
    output.poolSpecificationsSection.hidden = isMepOnly;
  }
  
  // Show/hide existing pool details section
  if (output.existingPoolDetailsSection) {
    output.existingPoolDetailsSection.hidden = !isRccOrFrp;
  }
  
  // Show/hide pool image card
  if (output.poolImageCard) {
    output.poolImageCard.hidden = isMepOnly;
  }
  
  // Show/hide treatment area info
  if (output.treatmentAreaInfo) {
    output.treatmentAreaInfo.hidden = !isRccOrFrp;
  }

  // Show/hide input fields for pool type selection
  if (fields.poolTypeFieldWrapper) {
    fields.poolTypeFieldWrapper.hidden = !isFibreglass;
  }
  if (fields.existingPoolTypeFieldWrapper) {
    fields.existingPoolTypeFieldWrapper.hidden = isFibreglass;
  }

  // Hide the fibreglass scope editor for non-fibreglass proposals
  if (fields.scopeFieldWrapper) {
    fields.scopeFieldWrapper.hidden = !isFibreglass;
  }
}

function setToday() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  fields.proposalDate.value = new Date(today - timezoneOffset).toISOString().slice(0, 10);
}

setToday();
updateActionButtons();
if (!fields.quoteNo.value.trim()) {
  ensureQuoteNumber().then(() => render()).catch((error) => {
    console.warn("Quote number initialization failed:", error?.message || error);
    render();
  });
}
form.addEventListener("input", (event) => {
  markUnsavedChanges();
  render();
});
form.addEventListener("change", (event) => {
  markUnsavedChanges();
  render();
});

// Handle proposal type change to update MEP items
fields.proposalTypeField?.addEventListener("change", () => {
  const proposalType = getProposalTypeFromField();
  const defaults = getDefaultMepItemsForProposalType(proposalType);
  // Only auto-load defaults if no items are currently set or user is starting fresh
  if (state.mepItems.length === 0) {
    setMepItems(defaults);
  }
  render();
});

mepElements.addButton?.addEventListener("click", () => {
  state.mepItems.push({ description: "", brand: "", qty: "" });
  renderMepInputRows();
  render();
});

mepElements.container?.addEventListener("input", (event) => {
  if (event.target.matches(".mep-desc, .mep-brand, .mep-qty")) {
    syncMepItemsFromDom();
    render();
  }
});

mepElements.container?.addEventListener("change", (event) => {
  if (event.target.matches(".mep-desc, .mep-brand, .mep-qty")) {
    syncMepItemsFromDom();
    render();
  }
});

mepElements.container?.addEventListener("click", (event) => {
  if (event.target.closest(".remove-mep-item")) {
    const row = event.target.closest("tr");
    const rows = Array.from(mepElements.container.querySelectorAll("tr"));
    const index = rows.indexOf(row);
    if (index >= 0) {
      state.mepItems.splice(index, 1);
      renderMepInputRows();
      render();
    }
  }
});

loadMepItems(undefined, fields.poolType.value);
render();

// Save, search, and edit-mode functionality
function collectQuotationData({ forUpdate = false } = {}) {
  const state = buildProposalState();
  const now = new Date().toISOString();

  const data = {
    client_name: state.client,
    phone: fields.phone.value.trim(),
    project_location: fields.location.value.trim(),
    proposal_date: state.proposalDate,
    quote_number: fields.quoteNo.value.trim(),
    revision_no: state.revision_no,
    validity_days: state.validityDays,
    valid_until: state.validUntil,
    proposal_type: state.proposalType,
    pool_length: state.length,
    pool_width: state.width,
    pool_depth: state.depth,
    measurement_unit: state.unit,
    pool_type: state.poolType,
    surface_area_sqft: Math.round(state.areaSqFt * 100) / 100,
    volume_litres: Math.round(state.volumeLitres),
    floor_area: Math.round(state.treatmentArea.floorArea * 100) / 100,
    wall_area: Math.round(state.treatmentArea.wallArea * 100) / 100,
    treatment_area: Math.round(state.treatmentArea.totalArea * 100) / 100,
    treatment_area_sqft: Math.round(state.treatmentArea.totalAreaFt * 100) / 100,
    base_rate: state.baseRate,
    gst_rate: state.gstRate,
    shell_price: numericInputValueOrNull(fields.shellUnitPrice),
    installation_price: numericInputValueOrNull(fields.installationUnitPrice),
    mep_price: numericInputValueOrNull(fields.mepUnitPrice),
    mep_items: state.mepItems,
    subtotal: state.adjustedSubtotal,
    gst_amount: state.gst,
    grand_total: state.grandTotal,
    include_gst: fields.includeGst.checked,
    existing_pool_type: state.existingPoolType || null,
    revision_no: state.revision_no,
    scope: fields.scope.value.trim(),
    notes: fields.notes.value.trim(),
    prepared_by_name: state.preparedByName,
    prepared_by_designation: state.preparedByDesignation,
    prepared_by_phone: state.preparedByPhone,
    approved_by_name: state.approvedByName,
    approved_by_designation: state.approvedByDesignation,
    approved_by_phone: state.approvedByPhone,
    prepared_by: state.preparedByName,
    approved_by: state.approvedByName
  };

  if (forUpdate) {
    data.last_modified = now;
  } else {
    data.created_at = now;
  }

  return data;
}

function setEditMode(quoteId) {
  currentQuoteId = quoteId || null;
  hasUnsavedChanges = false;
  saveButton.textContent = currentQuoteId ? "Update" : "Save";
  saveButton.title = currentQuoteId ? "Update existing quotation" : "Save proposal";
  updateActionButtons();
}

function markUnsavedChanges() {
  if (currentQuoteId) {
    hasUnsavedChanges = true;
    updateActionButtons();
  }
}

function updateActionButtons() {
  const enabled = Boolean(currentQuoteId) && !hasUnsavedChanges;
  printButton.disabled = !enabled;
  downloadPdfButton.disabled = !enabled;
  if (fields.createRevisionButton) {
    fields.createRevisionButton.disabled = !enabled;
  }
}

function parseQuoteNumberParts(quoteNumber) {
  const normalized = String(quoteNumber || "").trim();
  const match = normalized.match(/^(.*?Q\d{6}-\d{4})(?:-R(\d+))?$/i);
  if (!match) return null;
  const base = match[1];
  const revisionNumber = match[2] != null ? Number(match[2]) : 0;
  return {
    base,
    revision: `R${revisionNumber}`
  };
}

function parseQuoteSequence(quoteNumber) {
  const parts = parseQuoteNumberParts(quoteNumber);
  if (!parts) return null;
  const match = parts.base.match(/Q\d{6}-(\d{4})$/i);
  if (!match) return null;
  return Number(match[1]);
}

function getCurrentQuotePrefix() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `FY-Q${year}${month}`;
}

function formatQuoteBaseNumber(sequence) {
  const prefix = getCurrentQuotePrefix();
  return `${prefix}-${String(sequence).padStart(4, "0")}`;
}

function formatQuoteNumber(sequence, revision = "R0") {
  return `${formatQuoteBaseNumber(sequence)}-${revision}`;
}

async function fetchLatestQuoteNumber() {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from("quotations")
      .select("quote_number")
      .order("quote_number", { ascending: false })
      .limit(1);

    if (error) {
      console.warn("Unable to fetch latest quote number:", error.message);
      return null;
    }

    return data?.[0]?.quote_number || null;
  } catch (err) {
    console.warn("Quote number lookup failed:", err.message);
    return null;
  }
}

async function getNextQuoteNumber() {
  const latestQuote = await fetchLatestQuoteNumber();
  const latestSequence = parseQuoteSequence(latestQuote);
  const nextSequence = Number.isFinite(latestSequence) ? latestSequence + 1 : 230;
  return formatQuoteNumber(nextSequence, "R0");
}

async function ensureQuoteNumber() {
  if (fields.quoteNo.value.trim()) {
    const parsed = parseQuoteNumberParts(fields.quoteNo.value.trim());
    if (parsed && !fields.revision.value.trim()) {
      fields.revision.value = parsed.revision;
    }
    return fields.quoteNo.value.trim();
  }

  const generatedQuote = await getNextQuoteNumber();
  if (generatedQuote) {
    fields.quoteNo.value = generatedQuote;
    const parsed = parseQuoteNumberParts(generatedQuote);
    fields.revision.value = parsed?.revision || "R0";
  }

  return fields.quoteNo.value.trim();
}

function safeSet(input, value) {
  if (!input) return;
  input.value = value ?? "";
}

function createRevision() {
  return (async () => {
    if (!currentQuoteId) {
      alert("Please save the proposal before creating a revision.");
      return;
    }

    const currentQuote = String(fields.quoteNo.value || "").trim();
    const parsedQuote = parseQuoteNumberParts(currentQuote);
    if (!parsedQuote) {
      alert("Current quote number is invalid. Please refresh or save a valid quote before creating a revision.");
      return;
    }

    const currentRevision = String(fields.revision.value || parsedQuote.revision || "R0").trim().toUpperCase();
    const revisionMatch = currentRevision.match(/^R(\d+)$/);
    const nextRevision = revisionMatch ? `R${Number(revisionMatch[1]) + 1}` : "R1";

    fields.revision.value = nextRevision;
    fields.quoteNo.value = `${parsedQuote.base}-${nextRevision}`;

    const quotationData = collectQuotationData({ forUpdate: false });
    let data;
    let error;

    ({ data, error } = await supabaseClient.from("quotations").insert([quotationData]).select());
    if (error && error.message?.includes("mep_items")) {
      console.warn("The quotations table is missing mep_items. Retrying insert without that column.", error);
      const fallbackData = { ...quotationData };
      delete fallbackData.mep_items;
      ({ data, error } = await supabaseClient.from("quotations").insert([fallbackData]).select());
    }

    if (error) {
      console.error("Supabase error creating revision:", error);
      alert(`Error creating revision: ${error.message}`);
      return;
    }

    if (data?.[0]?.id) {
      setEditMode(data[0].id);
      render();
      showSuccessMessage("Revision created successfully");
    }
  })();
}

function fieldValueOrDefault(input, defaultValue) {
  if (!input) return defaultValue;
  const raw = String(input.value || "").trim();
  if (raw === "") return defaultValue;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

function numericInputValueOrNull(input) {
  if (!input) return null;
  const raw = String(input.value || "").trim();
  if (raw === "") return null;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function dateForInput(value) {
  if (!value) return "";

  try {
    const dateStr = String(value).trim();
    if (!dateStr) return "";

    // Try to extract YYYY-MM-DD format from the value
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
      console.warn(`⚠️ Could not extract date from: "${value}"`);
      return "";
    }

    const [, year, month, day] = match;
    const d = new Date(Number(year), Number(month) - 1, Number(day));

    // Validate
    if (isNaN(d.getTime())) {
      console.warn(`⚠️ Invalid date for input field: "${value}"`);
      return "";
    }

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn(`⚠️ Error converting date for input "${value}":`, error.message);
    return "";
  }
}

function populateQuotationForm(quotation) {
  try {
    const proposalDate = dateForInput(quotation.proposal_date);
    const loadedValidityDays = Number.parseInt(quotation.validity_days, 10);

    // Safely calculate fallback validity days - use null if dates are invalid
    let fallbackValidityDays = null;
    if (proposalDate && quotation.valid_until) {
      const validUntil = dateForInput(quotation.valid_until);
      if (proposalDate && validUntil) {
        fallbackValidityDays = daysBetweenDates(proposalDate, validUntil);
      }
    }

    console.log(`📋 Loading quotation: "${quotation.quote_number || 'Draft'}" (validity_days from DB: ${loadedValidityDays}, calculated: ${fallbackValidityDays})`);

    safeSet(fields.clientName, quotation.client_name);
    safeSet(fields.phone, quotation.phone);
    safeSet(fields.location, quotation.project_location);
    safeSet(fields.proposalDate, proposalDate);
    safeSet(fields.quoteNo, quotation.quote_number);

    // Use loaded validity days if valid, otherwise use calculated, otherwise use default 7
    const validityDays = Number.isFinite(loadedValidityDays) && loadedValidityDays > 0
      ? loadedValidityDays
      : (fallbackValidityDays || 7);
    safeSet(fields.validityDays, validityDays);

    safeSet(fields.proposalTypeField, quotation.proposal_type || PROPOSAL_TYPES.FIBREGLASS_POOL);
    safeSet(fields.length, quotation.pool_length);
    safeSet(fields.width, quotation.pool_width);
    safeSet(fields.depth, quotation.pool_depth);
    safeSet(fields.unit, quotation.measurement_unit || "m");
    safeSet(fields.poolType, quotation.pool_type || "Fibreglass In-Ground Skimmer Pool");
    safeSet(fields.existingPoolType, quotation.existing_pool_type || quotation.pool_type || "RCC In-Ground Pool");
    safeSet(fields.revision, quotation.revision_no ?? "R0");
    safeSet(fields.baseRate, quotation.base_rate ?? 3900);
    safeSet(fields.gstRate, quotation.gst_rate ?? 18);
    safeSet(fields.shellUnitPrice, quotation.shell_price ?? "");
    safeSet(fields.installationUnitPrice, quotation.installation_price ?? "");
    safeSet(fields.mepUnitPrice, quotation.mep_price ?? "");
    fields.includeGst.checked = Boolean(quotation.include_gst);
    safeSet(fields.scope, quotation.scope);
    safeSet(fields.notes, quotation.notes);
    safeSet(fields.preparedByName, quotation.prepared_by_name ?? quotation.prepared_by ?? "Krishna Chandran");
    safeSet(fields.preparedByDesignation, quotation.prepared_by_designation ?? "Sales Engineer");
    safeSet(fields.preparedByPhone, quotation.prepared_by_phone ?? "+91 98953 99306");
    safeSet(fields.approvedByName, quotation.approved_by_name ?? quotation.approved_by ?? "Vipin M R");
    safeSet(fields.approvedByDesignation, quotation.approved_by_designation ?? "Business Development Manager");
    safeSet(fields.approvedByPhone, quotation.approved_by_phone ?? "+91 98473 99306");
    loadMepItems(quotation.mep_items || [], fields.poolType.value, quotation.proposal_type || PROPOSAL_TYPES.FIBREGLASS_POOL);

    setEditMode(quotation.id);
    render();

    console.log(`✅ Form populated successfully`);
  } catch (error) {
    console.error(`❌ Error populating form:`, error);
    // Still try to render to prevent complete crash
    render();
  }
}

function setSearchStatus(message, state = "") {
  searchStatus.textContent = message;
  searchStatus.dataset.state = state;
}

function cleanSearchTerm(term) {
  // Preserve the search term but trim whitespace
  // Don't remove % as it's used for ilike patterns
  return term.trim();
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function renderSearchResults(rows) {
  if (rows.length === 0) {
    searchResults.innerHTML = '';
    searchResultsWrap.hidden = true;
    return;
  }

  try {
    searchResults.innerHTML = rows.map((row) => {
      try {
        const dateStr = row.proposal_date ? formatDate(row.proposal_date) : "-";
        const revision = row.revision_no || parseQuoteNumberParts(row.quote_number)?.revision || "R0";
        return `
          <tr>
            <td>${escapeHtml(row.quote_number || "Draft")}</td>
            <td>${escapeHtml(revision)}</td>
            <td>${escapeHtml(row.client_name || "Client")}</td>
            <td>${escapeHtml(row.phone || "-")}</td>
            <td>${dateStr}</td>
            <td>${INR.format(Number(row.grand_total || 0))}</td>
            <td>
              <div class="result-actions">
                <button type="button" data-action="open" data-id="${escapeHtml(row.id)}">Open</button>
                <button type="button" data-action="edit" data-id="${escapeHtml(row.id)}">Edit</button>
                <button type="button" data-action="print" data-id="${escapeHtml(row.id)}">Print</button>
              </div>
            </td>
          </tr>
        `;
      } catch (rowError) {
        console.error(`⚠️ Error rendering row for quote "${row.quote_number}":`, rowError);
        return `
          <tr>
            <td>${escapeHtml(row.quote_number || "Draft")}</td>
            <td>${escapeHtml(row.client_name || "Client")}</td>
            <td>${escapeHtml(row.phone || "-")}</td>
            <td>-</td>
            <td>${INR.format(Number(row.grand_total || 0))}</td>
            <td>
              <div class="result-actions">
                <button type="button" data-action="open" data-id="${escapeHtml(row.id)}">Open</button>
                <button type="button" data-action="edit" data-id="${escapeHtml(row.id)}">Edit</button>
                <button type="button" data-action="print" data-id="${escapeHtml(row.id)}">Print</button>
              </div>
            </td>
          </tr>
        `;
      }
    }).join("");
    searchResultsWrap.hidden = false;
  } catch (error) {
    console.error(`❌ Error rendering search results:`, error);
    searchResults.innerHTML = '';
    searchResultsWrap.hidden = true;
  }
}

async function searchQuotations() {
  if (!supabaseClient) {
    setSearchStatus("Supabase is not configured.", "error");
    return;
  }

  const term = cleanSearchTerm(searchInput.value);
  if (term.length < 1) {
    renderSearchResults([]);
    setSearchStatus("Enter search term to search.");
    return;
  }

  setSearchStatus("Searching...", "loading");

  // Log search debug info
  console.log(`🔍 Search initiated for term: "${term}"`);

  // Construct the ilike pattern for case-insensitive partial matching
  const pattern = `%${term}%`;
  console.log(`📋 Using ilike pattern: "${pattern}"`);

  try {
    // Build query with multiple OR conditions for all searchable fields
    let query = supabaseClient
      .from("quotations")
      .select("id, quote_number, revision_no, client_name, phone, proposal_date, grand_total, created_at")
      .or(`quote_number.ilike.${pattern},client_name.ilike.${pattern},phone.ilike.${pattern}`)
      .order("quote_number", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(25);

    const { data, error } = await query;

    if (error) {
      console.error("❌ Search error:", error);
      console.error("Error details:", error.message, error.code);
      renderSearchResults([]);
      setSearchStatus(`Search failed: ${error.message}`, "error");
      return;
    }

    console.log(`✅ Search completed. Found ${data?.length || 0} result(s)`);
    if (data && data.length > 0) {
      console.table(data.map(d => ({
        quote: d.quote_number,
        client: d.client_name,
        phone: d.phone
      })));
    }

    renderSearchResults(data || []);

    if (data?.length === 0) {
      setSearchStatus(`No quotations found for "${term}".`);
    } else {
      setSearchStatus(data?.length ? `${data.length} quotation${data.length === 1 ? "" : "s"} found.` : "No quotations found.");
    }
  } catch (error) {
    console.error("❌ Search exception:", error);
    renderSearchResults([]);
    setSearchStatus(`Search error: ${error.message}`, "error");
  }
}

async function fetchQuotationById(quoteId) {
  const { data, error } = await supabaseClient
    .from("quotations")
    .select("*")
    .eq("id", quoteId)
    .single();

  if (error) throw error;
  return data;
}

async function loadQuotation(quoteId, { printAfterLoad = false, mode = "open" } = {}) {
  if (!supabaseClient) {
    alert("Supabase is not configured.");
    return;
  }

  setSearchStatus("Loading quotation...", "loading");
  try {
    console.log(`📂 Loading quotation with ID: ${quoteId} (mode: ${mode})`);
    const quotation = await fetchQuotationById(quoteId);
    console.log(`✅ Quotation loaded:`, quotation.quote_number);
    populateQuotationForm(quotation);

    // Clear search results and show success message
    renderSearchResults([]);
    searchInput.value = "";

    setSearchStatus(`${quotation.quote_number || "Proposal"} loaded in edit mode.`);
    showSuccessMessage(mode === "edit" ? "Proposal ready to edit." : "Proposal loaded successfully.");

    // Scroll to form for better UX
    const formPanel = document.querySelector(".input-panel");
    if (formPanel) {
      formPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (printAfterLoad) {
      console.log(`🖨️ Printing quotation after 250ms`);
      setTimeout(() => window.print(), 250);
    }
  } catch (error) {
    console.error("❌ Load error:", error);
    setSearchStatus(`Could not load quotation: ${error.message}`, "error");
  }
}

async function saveProposalToSupabase() {
  if (!supabaseClient) {
    alert("Supabase is not configured. Please add your Supabase URL and anon key to app.js.");
    return;
  }

  const isUpdate = Boolean(currentQuoteId);
  saveButton.disabled = true;
  saveButton.textContent = isUpdate ? "Updating..." : "Saving...";

  try {
    if (!isUpdate) {
      await ensureQuoteNumber();
    }
    const quotationData = collectQuotationData({ forUpdate: isUpdate });
    let data;
    let error;

    if (isUpdate) {
      ({ data, error } = await supabaseClient
        .from("quotations")
        .update(quotationData)
        .eq("id", currentQuoteId)
        .select());

      if (error && error.message?.includes("last_modified")) {
        console.warn("The quotations table is missing last_modified. Retrying update without that column.", error);
        const fallbackData = { ...quotationData };
        delete fallbackData.last_modified;
        ({ data, error } = await supabaseClient
          .from("quotations")
          .update(fallbackData)
          .eq("id", currentQuoteId)
          .select());
      }

      if (error && error.message?.includes("mep_items")) {
        console.warn("The quotations table is missing mep_items. Retrying update without that column.", error);
        const fallbackData = { ...quotationData };
        delete fallbackData.mep_items;
        ({ data, error } = await supabaseClient
          .from("quotations")
          .update(fallbackData)
          .eq("id", currentQuoteId)
          .select());
      }
    } else {
      ({ data, error } = await supabaseClient.from("quotations").insert([quotationData]).select());
      if (error && error.message?.includes("mep_items")) {
        console.warn("The quotations table is missing mep_items. Retrying insert without that column.", error);
        const fallbackData = { ...quotationData };
        delete fallbackData.mep_items;
        ({ data, error } = await supabaseClient.from("quotations").insert([fallbackData]).select());
      }
    }

    if (error) {
      console.error("Supabase error:", error);
      alert(`Error ${isUpdate ? "updating" : "saving"} proposal: ${error.message}`);
      return;
    }

    if (!isUpdate && data?.[0]?.id) {
      setEditMode(data[0].id);
    } else if (isUpdate) {
      hasUnsavedChanges = false;
      updateActionButtons();
    }

    showSuccessMessage(isUpdate ? "Proposal updated successfully" : "Proposal saved successfully");
    updateActionButtons();
    console.log(isUpdate ? "Updated proposal:" : "Saved proposal:", data);
  } catch (err) {
    console.error("Error:", err);
    alert(`An error occurred while ${isUpdate ? "updating" : "saving"} the proposal.`);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = currentQuoteId ? "Update" : "Save";
  }
}
function showSuccessMessage(message) {
  // Create temporary success message element
  const messageEl = document.createElement("div");
  messageEl.className = "proposal-notification";
  messageEl.textContent = message;
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(messageEl);

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  if (!document.querySelector("style[data-animations]")) {
    style.setAttribute("data-animations", "true");
    document.head.appendChild(style);
  }

  // Remove message after 4 seconds
  setTimeout(() => {
    messageEl.style.animation = "slideOut 0.3s ease-out forwards";
    setTimeout(() => messageEl.remove(), 300);
  }, 4000);
}

function sanitizeFilenamePart(value) {
  const text = String(value || "").trim().replace(/[\\/]+/g, "-").replace(/["\*\?<>\|:]+/g, "").replace(/\s+/g, " ").trim();
  return text;
}

function generatePdfFilename() {
  const client = sanitizeFilenamePart(fields.clientName.value) || "Proposal";
  const location = sanitizeFilenamePart(fields.location.value);
  
  // Generate pool size from dimensions and unit
  let poolSize = "";
  const length = fields.length.value ? Number(fields.length.value) : null;
  const width = fields.width.value ? Number(fields.width.value) : null;
  const depth = fields.depth.value ? Number(fields.depth.value) : null;
  const unit = fields.unit.value || "m";
  
  if (length && width && depth) {
    // Format without spaces: 6x2.75x1.2m
    poolSize = `${length}x${width}x${depth}${unit}`;
  }
  
  const quoteNo = sanitizeFilenamePart(fields.quoteNo.value.trim());
  const parts = [client];
  if (location) parts.push(location);
  if (poolSize) parts.push(poolSize);
  if (quoteNo) parts.push(quoteNo);
  
  const filename = `${parts.join(" - ")}.pdf`;
  return filename;
}

async function downloadProposalPdf() {
  if (!downloadPdfButton) return;
  
  downloadPdfButton.disabled = true;
  downloadPdfButton.textContent = "Generating...";
  
  try {
    // Check if html2pdf is available
    if (typeof html2pdf === "undefined") {
      alert("PDF library is not loaded. Please refresh the page and try again.");
      return;
    }

    const proposalElement = document.querySelector("#proposal");
    if (!proposalElement) {
      alert("Proposal element not found.");
      return;
    }

    // Hide notifications during PDF generation
    const notifications = document.querySelectorAll(".proposal-notification");
    notifications.forEach(n => n.style.display = "none");

    const filename = generatePdfFilename();
    
    const options = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" }
    };

    await html2pdf().set(options).from(proposalElement).save();
    
    showSuccessMessage(`PDF downloaded: ${filename}`);
  } catch (error) {
    console.error("PDF generation error:", error);
    alert(`Error generating PDF: ${error.message}`);
  } finally {
    downloadPdfButton.disabled = false;
    downloadPdfButton.textContent = "PDF";
  }
}

// Initialize print, PDF, and revision buttons as disabled until proposal is saved
printButton.disabled = true;
downloadPdfButton.disabled = true;
if (fields.createRevisionButton) {
  fields.createRevisionButton.disabled = true;
}

saveButton.addEventListener("click", saveProposalToSupabase);
printButton.addEventListener("click", () => window.print());
downloadPdfButton?.addEventListener("click", downloadProposalPdf);
if (fields.createRevisionButton) {
  fields.createRevisionButton.addEventListener("click", createRevision);
}

searchButton.addEventListener("click", searchQuotations);
searchInput.addEventListener("input", () => {
  // Debounce search with shorter timeout for better UX
  clearTimeout(searchDebounceTimer);
  console.log(`⏱️ Debouncing search for: "${searchInput.value}"`);

  // Only search if there's content (allow single character searches)
  if (searchInput.value.trim().length >= 1) {
    searchDebounceTimer = setTimeout(() => {
      console.log(`⏱️ Debounce timeout reached, executing search`);
      searchQuotations();
    }, 300);
  } else {
    // Clear results if search box is empty
    renderSearchResults([]);
    setSearchStatus("Search by quote number, client name, or phone number.");
  }
});
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    console.log(`⌨️ Enter key pressed, executing search`);
    clearTimeout(searchDebounceTimer);
    searchQuotations();
  }
});
clearSearchButton.addEventListener("click", () => {
  console.log(`🗑️ Clear search clicked`);
  searchInput.value = "";
  renderSearchResults([]);
  searchInput.focus();
  setSearchStatus("Search by quote number, client name, or phone number.");
});
searchResults.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const quoteId = button.dataset.id;
  const action = button.dataset.action;
  console.log(`🎯 Result action triggered: ${action} for quote ID: ${quoteId}`);
  loadQuotation(quoteId, {
    mode: action,
    printAfterLoad: action === "print"
  });
});

// Initial setup
const proposalType = getProposalTypeFromField();
loadMepItems(undefined, fields.poolType.value, proposalType);
render();
