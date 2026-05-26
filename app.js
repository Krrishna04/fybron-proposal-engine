const form = document.querySelector("#proposalForm");
const printButton = document.querySelector("#printProposal");
const saveButton = document.querySelector("#saveProposal");
const searchInput = document.querySelector("#quoteSearch");
const searchButton = document.querySelector("#searchQuotes");
const clearSearchButton = document.querySelector("#clearSearch");
const searchStatus = document.querySelector("#searchStatus");
const searchResultsWrap = document.querySelector("#searchResultsWrap");
const searchResults = document.querySelector("#searchResults");

let supabaseClient = null;
let currentQuoteId = null;
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
  length: document.querySelector("#length"),
  width: document.querySelector("#width"),
  depth: document.querySelector("#depth"),
  unit: document.querySelector("#unit"),
  poolType: document.querySelector("#poolType"),
  baseRate: document.querySelector("#baseRate"),
  gstRate: document.querySelector("#gstRate"),
  shellUnitPrice: document.querySelector("#shellUnitPrice"),
  installationUnitPrice: document.querySelector("#installationUnitPrice"),
  mepUnitPrice: document.querySelector("#mepUnitPrice"),
  includeGst: document.querySelector("#includeGst"),
  scope: document.querySelector("#scope"),
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
  technicalSummary: document.querySelector("#technicalSummary"),
  quoteRows: document.querySelector("#quoteRows"),
  amountWords: document.querySelector("#amountWords"),
  grandTotal: document.querySelector("#grandTotal"),
  itemRows: document.querySelector("#itemRows"),
  outScope: document.querySelector("#outScope"),
  outNotes: document.querySelector("#outNotes"),
  outPreparedByName: document.querySelector("#outPreparedByName"),
  outPreparedByDesignation: document.querySelector("#outPreparedByDesignation"),
  outPreparedByPhone: document.querySelector("#outPreparedByPhone"),
  outApprovedByName: document.querySelector("#outApprovedByName"),
  outApprovedByDesignation: document.querySelector("#outApprovedByDesignation"),
  outApprovedByPhone: document.querySelector("#outApprovedByPhone")
};

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const decimalFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
const measurementFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
const RCC_POOL_TYPE = "RCC Swimming Pool Waterproofing & Filtration System";

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

function formatDate(dateValue) {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function parseDateInput(dateValue) {
  if (!dateValue) return null;
  const [year, month, day] = String(dateValue).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
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
  const start = parseDateInput(startDateValue);
  const end = parseDateInput(endDateValue);
  if (!start || !end) return null;
  return Math.round((end - start) / 86400000);
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
    { photo: "filter", item: `Alfa Aerosol Vessel ${filterDia} DIA [Pressure sand filter]`, brand: "Alfa", qty: "1 No" },
    { photo: "sand", item: "Purity Sand", brand: "Purity", qty: `${sandQty} Kg` },
    { photo: "light", item: "Pool Light (12V x 24W)", brand: "Fybron", qty: `${lights} No` },
    { photo: "drive", item: "LED Driver", brand: "Fybron", qty: `${Math.ceil(lights / 2)} No` },
    { photo: "pump", item: `Pool Pump ${pump}`, brand: "Fybron", qty: "1 No" },
    { photo: "net", item: "Net with 5 micron mesh", brand: "Standard", qty: "1 No" },
    { photo: "hose", item: "Vacuum Hose", brand: "Standard", qty: `${vacuumHose} M` },
    { photo: "vacuum", item: "Vacuum Head", brand: "Standard", qty: "1 No" },
    { photo: "point", item: "Vacuum Point", brand: "Fybron", qty: "1 No" },
    { photo: "brush", item: "Brush", brand: "Standard", qty: "1 No" },
    { photo: "ladder", item: "SS Ladder (4 Steps)", brand: "SS 304", qty: "1 No" },
    { photo: "rod", item: "Telescopic Rod", brand: "Standard", qty: "1 No" },
    { photo: "skimmer", item: "Skimmer Basket", brand: "Fybron", qty: "1 No" },
    { photo: "eyeball", item: "Eye Ball", brand: "Fybron", qty: "3 Nos" },
    { photo: "drain", item: "Main Drain Cover", brand: "Fybron", qty: "1 No" },
    { photo: "pipe", item: "Plumbing Materials (plant room pipes, fittings, valves, PVC pipe)", brand: "PVC", qty: "Required" },
    { photo: "kit", item: "Testing Kit for pH and Chlorine", brand: "Standard", qty: "1 No" }
  ];
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

function buildProposalState() {
  const length = asNumber(fields.length, 0);
  const width = asNumber(fields.width, 0);
  const depth = asNumber(fields.depth, 0);
  const unit = fields.unit.value;
  const lengthM = toMeters(length, unit);
  const widthM = toMeters(width, unit);
  const depthM = toMeters(depth, unit);
  const areaSqFt = sqFtFrom(length, width, unit);
  const volumeLitres = litresFrom(length, width, depth, unit);
  const baseRate = asNumber(fields.baseRate, 0);
  const gstRate = asNumber(fields.gstRate, 0);
  const chart = closestChart(lengthM, widthM, depthM, areaSqFt, baseRate);
  const defaultInstallation = Math.round(chart.shell * 0.18);
  const defaultShell = Math.max(0, chart.shell - defaultInstallation);
  const shellAmount = asNumber(fields.shellUnitPrice, 0) > 0 ? asNumber(fields.shellUnitPrice, 0) : defaultShell;
  const installationAmount = asNumber(fields.installationUnitPrice, 0) > 0 ? asNumber(fields.installationUnitPrice, 0) : defaultInstallation;
  const mepAmount = asNumber(fields.mepUnitPrice, 0) > 0 ? asNumber(fields.mepUnitPrice, 0) : chart.mep;
  const adjustedSubtotal = shellAmount + installationAmount + mepAmount;
  const gst = Math.round(adjustedSubtotal * (gstRate / 100));
  const grandTotal = fields.includeGst.checked ? adjustedSubtotal + gst : adjustedSubtotal;
  const dimensions = `${formatMeasurement(length)} x ${formatMeasurement(width)} x ${formatMeasurement(depth)} ${unit}`;
  const dimensionsM = `${formatMeasurement(lengthM)} x ${formatMeasurement(widthM)} x ${formatMeasurement(depthM)} m`;
  const areaText = `${decimalFormat.format(areaSqFt)} SQFT`;
  const volumeText = `${decimalFormat.format(Math.round(volumeLitres))} litres`;
  const poolType = fields.poolType.value;
  const client = textValue(fields.clientName, "Client");
  const location = textValue(fields.location, "Project site");
  const proposalDate = fields.proposalDate.value || dateInputValue(new Date());
  const validityDays = Math.max(1, Math.round(asNumber(fields.validityDays, 7)));
  const validUntil = addDaysToDate(proposalDate, validityDays);
  const matchText = `${chart.series} ${chart.length} x ${chart.width} x ${chart.depth} m${chart.tag ? ` (${chart.tag})` : ""}`;

  return {
    length,
    width,
    depth,
    unit,
    lengthM,
    widthM,
    depthM,
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
    client,
    location,
    preparedByName: textValue(fields.preparedByName, "Krishna Chandran"),
    preparedByDesignation: textValue(fields.preparedByDesignation, "Sales Engineer"),
    preparedByPhone: textValue(fields.preparedByPhone, "+91 98953 99306"),
    approvedByName: textValue(fields.approvedByName, "Vipin M R"),
    approvedByDesignation: textValue(fields.approvedByDesignation, "Business Development Manager"),
    approvedByPhone: textValue(fields.approvedByPhone, "+91 98473 99306"),
    matchText,
    isRcc: isRccWaterproofing(poolType)
  };
}

function proposalIntroHtml(state) {
  const client = escapeHtml(state.client);
  const location = escapeHtml(state.location);

  if (state.isRcc) {
    return `Dear Sir,<br><br>Thank you for your interest in Fybron Pools. With reference to your enquiry for RCC swimming pool waterproofing, filtration system works, restoration, and waterproof surface finishing at your site in ${location}, we are pleased to submit our quotation for ${client}. Please find the attached proposal detailing the scope and pricing. Should you need any clarification or technical assistance, we will be glad to assist.<br><br>Warm regards,<br>Team Fybron`;
  }

  return `Dear Sir,<br><br>Thank you for your interest in Fybron Composite Pools. With reference to your enquiry for the supply and installation of a custom-made fibreglass pool at your site in ${location}, we are pleased to submit our quotation for ${client}. Please find the attached proposal detailing the scope and pricing. Should you need any clarification or technical assistance, we will be glad to assist.<br><br>Warm regards,<br>Team Fybron`;
}

function renderSpecifications(state) {
  const finish = state.isRcc ? "GRP waterproof surface finish" : "Pigmented smooth gelcoat finish";
  const system = state.isRcc ? "Waterproofing, filtration, circulation, and restoration system" : "Skimmer type";

  output.specList.innerHTML = `
    <dt>Pool Type</dt><dd>${escapeHtml(state.poolType)}</dd>
    <dt>Shape</dt><dd>Rectangular</dd>
    <dt>Dimensions</dt><dd>${escapeHtml(state.dimensions)}${state.unit === "ft" ? ` (${escapeHtml(state.dimensionsM)})` : ""}</dd>
    <dt>Pool Area</dt><dd>${escapeHtml(state.areaText)}</dd>
    <dt>Pool Volume</dt><dd>${escapeHtml(state.volumeText)}</dd>
    <dt>Finish</dt><dd>${finish}</dd>
    <dt>Pool System</dt><dd>${system}</dd>
    <dt>Brand</dt><dd>FYBRON</dd>
  `;
}

function renderTechnicalSummary(state) {
  const lines = state.isRcc
    ? [
        "GRP waterproofing system for RCC swimming pool surfaces.",
        "Waterproof surface finish after required surface preparation and restoration work.",
        `Pool Area: ${state.areaText}.`,
        `Pool Volume: ${state.volumeText}.`,
        "Filtration system, pipelines, electrification, testing, and commissioning as per agreed scope.",
        "Existing RCC structure, surface condition, and leakage points shall be inspected before execution.",
        "Project execution is subject to site readiness, approved specifications, and agreed payment terms."
      ]
    : [
        "Pool Shell: factory-manufactured fibreglass pool shell.",
        "Pool Colour: Pale Blue.",
        `Pool Area: ${state.areaText}.`,
        `Pool Volume: ${state.volumeText}.`,
        "Interior Finish: pigmented smooth gelcoat finish, ensuring comfort, durability, and long-lasting performance.",
        "Exterior Finish: rough flow-coat finish for enhanced bonding and structural stability.",
        "Project execution is subject to site readiness, approved specifications, and agreed payment terms."
      ];

  output.technicalSummary.innerHTML = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
}

function renderPriceSummary(state) {
  const shellDescription = state.isRcc
    ? `GRP Waterproofing & Waterproof Surface Finish<br><small>RCC pool size: ${escapeHtml(state.dimensions)}</small>`
    : `Fibreglass Inground Pool Shell<br><small>Size: ${escapeHtml(state.dimensions)}</small>`;
  const installationDescription = state.isRcc
    ? "Restoration, Surface Preparation, Testing & Pool commissioning"
    : "Positioning, Installation, Testing & Pool commissioning";
  const mepDescription = state.isRcc
    ? "Filtration System, Pipelines, Electrification (MEP) & Pool Accessories"
    : "Pumps, Filter, Pipelines, Electrification (MEP) & Pool Accessories";

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
  output.chartMatch.textContent = state.chart.exact ? state.matchText : `Estimated from ${state.matchText}`;
  output.surfaceArea.textContent = state.areaText;
  output.volume.textContent = state.volumeText;
  output.estimate.textContent = INR.format(state.grandTotal);
  output.proposalTitle.textContent = `Proposal for Fybron ${state.poolType} - ${state.dimensions}`;
  output.outClient.textContent = state.client;
  output.outLocation.textContent = state.location;
  output.outDate.textContent = formatDate(state.proposalDate);
  output.outValidUntil.textContent = formatDate(state.validUntil);
  output.outQuoteNo.textContent = fields.quoteNo.value.trim() || "Draft";
  output.proposalIntro.innerHTML = proposalIntroHtml(state);
  output.poolImageSize.textContent = `Size: ${state.dimensions}`;
  renderSpecifications(state);
  renderTechnicalSummary(state);
  renderPriceSummary(state);
  renderAccessoryRows(state);
  renderSignatureBlock(state);
  output.outScope.textContent = fields.scope.value.trim();
  output.outNotes.innerHTML = escapeHtml(fields.notes.value.trim()).replace(/\n/g, "<br>");

  renderPoolDiagram(state.lengthM, state.widthM, state.depthM, state.dimensions);
}

function renderPoolDiagram(length, width, depth, dimensionLabel) {
  const diagramContainer = document.querySelector("#poolDiagram");
  
  // Use larger scale for print quality - 1 unit = 1 pixel in SVG
  const scale = 60; // 60px per meter for print quality
  const scaledLength = length * scale;
  const scaledWidth = width * scale;
  const scaledDepth = depth * scale;
  
  // Layout constants
  const topViewPadding = 60;
  const sideViewPadding = 60;
  const viewGap = 80;
  const bottomPadding = 80;
  
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

function setToday() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  fields.proposalDate.value = new Date(today - timezoneOffset).toISOString().slice(0, 10);
}

setToday();
form.addEventListener("input", render);
form.addEventListener("change", render);
// Save, search, and edit-mode functionality
function collectQuotationData({ forUpdate = false } = {}) {
  const state = buildProposalState();
  const now = new Date().toISOString();

  const data = {
    client_name: state.client,
    phone: fields.phone.value.trim(),
    project_location: state.location,
    proposal_date: state.proposalDate,
    quote_number: fields.quoteNo.value.trim() || "Draft",
    validity_days: state.validityDays,
    valid_until: state.validUntil,
    pool_length: state.length,
    pool_width: state.width,
    pool_depth: state.depth,
    measurement_unit: state.unit,
    pool_type: state.poolType,
    surface_area_sqft: Math.round(state.areaSqFt * 100) / 100,
    volume_litres: Math.round(state.volumeLitres),
    base_rate: state.baseRate,
    gst_rate: state.gstRate,
    shell_price: state.shellAmount,
    installation_price: state.installationAmount,
    mep_price: state.mepAmount,
    subtotal: state.adjustedSubtotal,
    gst_amount: state.gst,
    grand_total: state.grandTotal,
    include_gst: fields.includeGst.checked,
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
  saveButton.textContent = currentQuoteId ? "Update" : "Save";
  saveButton.title = currentQuoteId ? "Update existing quotation" : "Save proposal";
}

function safeSet(input, value) {
  if (!input) return;
  input.value = value ?? "";
}

function dateForInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function populateQuotationForm(quotation) {
  const proposalDate = dateForInput(quotation.proposal_date);
  const loadedValidityDays = Number.parseInt(quotation.validity_days, 10);
  const fallbackValidityDays = daysBetweenDates(proposalDate, dateForInput(quotation.valid_until));
  safeSet(fields.clientName, quotation.client_name);
  safeSet(fields.phone, quotation.phone);
  safeSet(fields.location, quotation.project_location);
  safeSet(fields.proposalDate, proposalDate);
  safeSet(fields.quoteNo, quotation.quote_number);
  safeSet(fields.validityDays, Number.isFinite(loadedValidityDays) && loadedValidityDays > 0 ? loadedValidityDays : fallbackValidityDays || 7);
  safeSet(fields.length, quotation.pool_length);
  safeSet(fields.width, quotation.pool_width);
  safeSet(fields.depth, quotation.pool_depth);
  safeSet(fields.unit, quotation.measurement_unit || "m");
  safeSet(fields.poolType, quotation.pool_type || "Fibreglass In-Ground Skimmer Pool");
  safeSet(fields.baseRate, quotation.base_rate ?? 3900);
  safeSet(fields.gstRate, quotation.gst_rate ?? 18);
  safeSet(fields.shellUnitPrice, quotation.shell_price ?? 0);
  safeSet(fields.installationUnitPrice, quotation.installation_price ?? 0);
  safeSet(fields.mepUnitPrice, quotation.mep_price ?? 0);
  fields.includeGst.checked = Boolean(quotation.include_gst);
  safeSet(fields.scope, quotation.scope);
  safeSet(fields.notes, quotation.notes);
  safeSet(fields.preparedByName, quotation.prepared_by_name ?? quotation.prepared_by ?? "Krishna Chandran");
  safeSet(fields.preparedByDesignation, quotation.prepared_by_designation ?? "Sales Engineer");
  safeSet(fields.preparedByPhone, quotation.prepared_by_phone ?? "+91 98953 99306");
  safeSet(fields.approvedByName, quotation.approved_by_name ?? quotation.approved_by ?? "Vipin M R");
  safeSet(fields.approvedByDesignation, quotation.approved_by_designation ?? "Business Development Manager");
  safeSet(fields.approvedByPhone, quotation.approved_by_phone ?? "+91 98473 99306");

  setEditMode(quotation.id);
  printButton.disabled = false;
  render();
}

function setSearchStatus(message, state = "") {
  searchStatus.textContent = message;
  searchStatus.dataset.state = state;
}

function cleanSearchTerm(term) {
  return term.trim().replace(/[%,()]/g, " ").replace(/\s+/g, " ");
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function renderSearchResults(rows) {
  searchResults.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.quote_number || "Draft")}</td>
      <td>${escapeHtml(row.client_name || "Client")}</td>
      <td>${escapeHtml(row.phone || "-")}</td>
      <td>${row.proposal_date ? formatDate(row.proposal_date) : "-"}</td>
      <td>${INR.format(Number(row.grand_total || 0))}</td>
      <td>
        <div class="result-actions">
          <button type="button" data-action="open" data-id="${escapeHtml(row.id)}">Open</button>
          <button type="button" data-action="edit" data-id="${escapeHtml(row.id)}">Edit</button>
          <button type="button" data-action="print" data-id="${escapeHtml(row.id)}">Print</button>
        </div>
      </td>
    </tr>
  `).join("");
  searchResultsWrap.hidden = rows.length === 0;
}

async function searchQuotations() {
  if (!supabaseClient) {
    setSearchStatus("Supabase is not configured.", "error");
    return;
  }

  const term = cleanSearchTerm(searchInput.value);
  if (term.length < 2) {
    renderSearchResults([]);
    setSearchStatus("Enter at least 2 characters to search.");
    return;
  }

  setSearchStatus("Searching...", "loading");
  const pattern = `%${term}%`;
  const { data, error } = await supabaseClient
    .from("quotations")
    .select("id, quote_number, client_name, phone, proposal_date, grand_total, created_at")
    .or(`quote_number.ilike.${pattern},client_name.ilike.${pattern},phone.ilike.${pattern}`)
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    console.error("Search error:", error);
    renderSearchResults([]);
    setSearchStatus(`Search failed: ${error.message}`, "error");
    return;
  }

  renderSearchResults(data || []);
  setSearchStatus(data?.length ? `${data.length} quotation${data.length === 1 ? "" : "s"} found.` : "No quotations found.");
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
    const quotation = await fetchQuotationById(quoteId);
    populateQuotationForm(quotation);
    setSearchStatus(`${quotation.quote_number || "Quotation"} loaded in edit mode.`);
    showSuccessMessage(mode === "edit" ? "Quotation ready to edit." : "Quotation loaded successfully.");

    if (printAfterLoad) {
      setTimeout(() => window.print(), 250);
    }
  } catch (error) {
    console.error("Load error:", error);
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
    } else {
      ({ data, error } = await supabaseClient.from("quotations").insert([quotationData]).select());
    }

    if (error) {
      console.error("Supabase error:", error);
      alert(`Error ${isUpdate ? "updating" : "saving"} proposal: ${error.message}`);
      return;
    }

    if (!isUpdate && data?.[0]?.id) {
      setEditMode(data[0].id);
    }

    showSuccessMessage(isUpdate ? "Quotation updated successfully" : "Quotation saved successfully");
    printButton.disabled = false;
    console.log(isUpdate ? "Updated quotation:" : "Saved quotation:", data);
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

// Initialize print button as disabled until proposal is saved
printButton.disabled = true;

saveButton.addEventListener("click", saveProposalToSupabase);
printButton.addEventListener("click", () => window.print());

searchButton.addEventListener("click", searchQuotations);
searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(searchQuotations, 350);
});
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchQuotations();
  }
});
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  renderSearchResults([]);
  setSearchStatus("Search by quote number, client name, or phone number.");
});
searchResults.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const quoteId = button.dataset.id;
  const action = button.dataset.action;
  loadQuotation(quoteId, {
    mode: action,
    printAfterLoad: action === "print"
  });
});

render();
