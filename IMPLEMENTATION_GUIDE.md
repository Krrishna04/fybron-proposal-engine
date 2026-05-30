# Multi-Type Proposal Engine Implementation Guide

## Overview

The Fybron Proposal Engine has been significantly enhanced to support multiple proposal types professionally. The system now intelligently adapts its layout, MEP items, calculations, and presentation based on the selected proposal type.

---

## 🎯 New Features Implemented

### 1. **Proposal Type System**

**Location:** Input Panel → "Proposal Type" dropdown

**Supported Types:**
- **Fibreglass Pool** - Premium layout for custom fibreglass pools
- **FRP Waterproofing / Lamination** - Technical style for existing RCC pools
- **FRP Lamination + MEP** - Combined waterproofing and MEP systems
- **MEP & Filtration Only** - Standalone MEP system focus

**How It Works:**
- Selection immediately affects visible sections in the proposal
- Automatically loads appropriate default MEP items
- Customizes proposal narrative and technical summary
- Triggers dynamic layout changes

---

### 2. **Dynamic Proposal Layouts**

The proposal preview automatically adapts based on proposal type:

#### **Fibreglass Pool Layout:**
- Shows: "Why Fybron Composite Pools" benefits section
- Shows: Pool Specifications section with standard details
- Shows: Pool schematic (premium style)
- Includes: Complete MEP & Water Treatment Scope

#### **FRP Waterproofing / Lamination Layout:**
- Hides: Fibreglass benefits and pool specifications
- Shows: "Existing Pool Details" section with treatment area breakdown
- Shows: Treatment area calculations (Floor, Wall, Total)
- Technical focus without premium product language
- Displays: Surface treatment area in sq.m and sq.ft

#### **FRP Lamination + MEP Layout:**
- Combines waterproofing details with MEP components
- Shows: Treatment area calculations
- Shows: MEP scope with combined items list
- Technical presentation style

#### **MEP & Filtration Only Layout:**
- Hides: Pool specifications and schematic
- Hides: Fibreglass-specific benefits
- Focus: Filtration system, pumps, electrical, plumbing
- Emphasis: MEP components and commissioning

---

### 3. **Treatment Area Calculations** 

**For RCC/FRP Proposals:**

**Automatic Calculations:**
- **Floor Area** = Length × Width
- **Wall Area** = 2×(Length×Depth) + 2×(Width×Depth)
- **Total Treatment Area** = Floor Area + Wall Area

**Display Format:**
- Shows in both square meters (sq.m) and square feet (sq.ft)
- Real-time updates as dimensions change
- Visible in input panel during editing
- Included in proposal export

**Fields Saved to Database:**
- `floor_area` (sq.m)
- `wall_area` (sq.m)
- `treatment_area` (sq.m)
- `treatment_area_sqft` (sq.ft)

---

### 4. **Dynamic MEP Item Presets**

**Automatic MEP Item Loading:**

When changing proposal type, the system automatically suggests relevant default items:

**Fibreglass Pool Defaults:**
- Sand Filter + Sand
- Underwater Lights & Drivers
- Circulation Pump
- Cleaning accessories (net, vacuum, brush)
- Ladder, Skimmer, Eye balls, Main drain
- Plumbing materials & testing kit

**FRP Waterproofing Defaults:**
- Gelcoat (Pigmented)
- CSM & Woven Roving
- Polyester Resin & Catalyst
- Release Agent & Pigment
- Surface Preparation Materials
- Topcoat

**FRP Lamination + MEP Defaults:**
- All waterproofing items
- Selected MEP components

**MEP Only Defaults:**
- Centrifugal Pump & Motor
- Sand Filter
- LED Lights & Drivers
- PVC Piping & Fittings
- Electrical Control Panel
- Skimmer, Main Drain
- Testing & Commissioning

**Manual Control:**
- Click "Add Item" to add custom items
- Edit any item description, brand, or quantity
- Changes instantly reflect in proposal preview
- Remove button to delete items
- Brand field is optional (displays "Standard" if empty)

---

### 5. **Improved MEP Table Layout**

**Column Width Optimization:**

| Column | Width | Purpose |
|--------|-------|---------|
| Item Description | 55% | Detailed component information |
| Brand Name | 25% | Manufacturer or supplier |
| Qty | 10% | Quantity needed |
| Action | 10% | Remove item button |

**Benefits:**
- Better space utilization
- Multiline item descriptions support
- Reduced empty spacing
- Professional compact layout
- Easier to read and edit

---

### 6. **Instant MEP Preview Updates**

**Real-Time Synchronization:**

- Any item added → Instantly appears in proposal preview
- Any item edited → Preview updates immediately
- Any item removed → Preview reflects change instantly
- No manual refresh needed
- Preview always matches input

**Preview Items Table:**
- Shows final MEP scope as seen by client
- Brand displays as entered (or "Standard" if blank)
- No auto-filling of brands
- Clean technical presentation

---

### 7. **PDF Download Functionality**

**New PDF Button:**
- Located in top toolbar next to Print button
- Label: "PDF"

**PDF Generation:**
- Filename format: `ClientName-Location-QuoteNumber.pdf`
- Example: `PalmGroveResort-Alappuzha-QU2026-MY-001.pdf`
- Professional A4 format
- Notifications hidden in PDF
- Print-quality rendering

**To Use:**
1. Fill in Client Name, Location, Quote Number
2. Click "PDF" button in top toolbar
3. File downloads automatically with standard name

---

### 8. **Print & PDF Optimization**

**Reduced Vertical Gaps:**
- Optimized margins (8mm all sides)
- Compact section spacing
- Reduced padding between elements
- Better page utilization

**Professional Appearance:**
- No notification messages in print
- Clean technical layout
- Maintains brand consistency
- Page-break optimization
- Proper table rendering

**What's Hidden in Print/PDF:**
- Workspace/builder panel (left side)
- Success notifications
- Search interface
- Builder UI elements

---

### 9. **Heading Improvements**

**No "Fybron" Duplication:**
- Pool Type dropdown options don't repeat "Fybron"
- Example: Use "Fibreglass Above-Ground Skimmer Pool" NOT "Fybron Fibreglass Above-Ground Skimmer Pool"
- Proposal title dynamically generated: "Proposal for [PoolType] - [Dimensions]"

**Long Heading Handling:**
- Automatic line breaks for lengthy titles
- Professional responsive formatting
- Mobile-friendly wrapping

---

### 10. **Enhanced Sections**

**Proposal Scope Summary:**
- Separate section from Commercial Summary
- Professional technical lines included
- Dynamic content based on proposal type
- Statements about:
  - Equipment brand variation based on availability
  - Installation subject to site conditions
  - Proposal based on provided dimensions

**Commercial Summary:**
- Renamed from "Price & Scope Summary"
- Shows pool shell, installation, and MEP pricing
- Tax calculation included if GST enabled
- Amount in words displayed

**Payment Terms & Timeline:**
- Pre-defined professional terms
- Manufacturing and delivery timelines
- Warranty and durability information
- Applies to all proposal types

---

## 💾 Database Integration

### New Supabase Fields

The following fields must be added to the `quotations` table:

```sql
-- Proposal type and configuration
ALTER TABLE quotations ADD COLUMN proposal_type TEXT DEFAULT 'fibreglass-pool';

-- Treatment area calculations (for RCC/FRP proposals)
ALTER TABLE quotations ADD COLUMN floor_area NUMERIC(10,2);
ALTER TABLE quotations ADD COLUMN wall_area NUMERIC(10,2);
ALTER TABLE quotations ADD COLUMN treatment_area NUMERIC(10,2);
ALTER TABLE quotations ADD COLUMN treatment_area_sqft NUMERIC(10,2);
```

### Saved Fields

The system now saves the following additional data:

- `proposal_type` - Selected proposal type
- `floor_area` - Calculated floor area in sq.m
- `wall_area` - Calculated wall area in sq.m
- `treatment_area` - Total treatment area in sq.m
- `treatment_area_sqft` - Total treatment area in sq.ft

### Backward Compatibility

- Existing quotations continue to work
- New fields are optional (NULL safe)
- Search functionality unaffected
- Retrieval/loading still works perfectly

---

## 📋 User Workflow

### Creating a New Fibreglass Pool Proposal:

1. **Select Proposal Type** → "Fibreglass Pool"
2. Enter Client details (name, phone, location)
3. Enter Pool dimensions (length, width, depth)
4. System loads default MEP items automatically
5. Edit MEP items if needed (add/remove/modify)
6. Set commercial prices or use price chart
7. Review proposal preview (right side)
8. **Save** or **Print** or **Download PDF**

### Creating a New RCC Waterproofing Proposal:

1. **Select Proposal Type** → "FRP Waterproofing / Lamination"
2. Enter Client details
3. Enter Pool dimensions
4. **Treatment area calculations appear automatically** in input panel
5. System loads waterproofing default items
6. Add/edit MEP items as needed
7. Set commercial prices
8. Preview shows "Existing Pool Details" section with treatment area
9. **Save** or **Print** or **Download PDF**

### Creating an MEP-Only Proposal:

1. **Select Proposal Type** → "MEP & Filtration Only"
2. Enter Client details
3. Enter Pool dimensions (used for MEP sizing)
4. System loads MEP-only defaults
5. Edit items as needed
6. Set commercial prices
7. Preview hides pool schematic and specifications
8. Focuses on filtration and electrical scope

---

## 🔍 Field Reference

### Input Panel Fields

**Client Section:**
- Client Name
- Phone Number
- Project Location

**Proposal Section:**
- Proposal Date
- Quote Number
- **Quotation Validity (Days)** - calculates valid-until date

**Pool Size Section:**
- Length, Width, Depth (with unit selector)
- **Treatment Area Display** (visible for RCC/FRP only)
  - Floor Area (sq.m)
  - Wall Area (sq.m)
  - Total Treatment Area (sq.m & sq.ft)

**Proposal Type Section:**
- **NEW: Proposal Type Dropdown**
  - Fibreglass Pool
  - FRP Waterproofing / Lamination
  - FRP Lamination + MEP
  - MEP & Filtration Only

**Pool Type Section:**
- Pool Type (product style selection)

**Commercial Section:**
- Fallback Rate (per sq.ft)
- GST %
- Shell Unit Price
- Installation Unit Price
- MEP Unit Price
- Include GST checkbox

**MEP Section:**
- **Improved MEP table** with better column spacing
- Add Item button
- Remove item buttons per row
- Better visibility and editing experience

---

## ⚙️ Technical Details

### Files Modified

1. **index.html**
   - Added proposal type dropdown
   - Added treatment area info display
   - Added PDF download button
   - Added html2pdf library reference
   - Enhanced proposal section structure

2. **app.js**
   - Added PROPOSAL_TYPES constants
   - Treatment area calculation functions
   - Dynamic MEP item presets per type
   - Layout visibility controller
   - PDF generation function
   - Enhanced save/load logic
   - Real-time MEP preview updates

3. **styles.css**
   - Treatment area info styling
   - MEP table column width optimization
   - Print media query optimization
   - Compact print layout
   - Reduced spacing for PDF output

### Libraries Added

- **html2pdf.js** (v0.10.1) - For PDF generation

### Data Flow

```
Proposal Type Selection
    ↓
Load Default MEP Items
    ↓
Render Dynamic Layout
    ↓
Calculate Treatment Area
    ↓
Update Preview
    ↓
Save to Supabase (with new fields)
```

---

## ✅ Backward Compatibility

✓ Existing save/search/retrieval works unchanged
✓ Old proposals load correctly
✓ All current styling preserved
✓ Print functionality enhanced (not broken)
✓ MEP items still editable
✓ Price chart matching still works
✓ Supabase integration robust

---

## 🚀 Next Steps / Optional Enhancements

### Potential Future Improvements:

1. **Email Templates** - Auto-send proposals via email with PDF
2. **Quotation Templates** - Save/load custom proposal templates
3. **Revision History** - Track changes to proposals
4. **Client Database** - Store client profiles for quick entry
5. **Bulk Operations** - Generate multiple quotes at once
6. **Mobile App** - React Native mobile companion
7. **Advanced Reporting** - Sales analytics and metrics
8. **Custom Branding** - Configurable company details per proposal type

---

## 📞 Support

For questions or issues:
- Check SUPABASE_SETUP.md for database configuration
- Verify html2pdf library is loaded (check browser console)
- Ensure all new Supabase columns are created
- Clear browser cache if styles don't update

---

**Implementation Date:** May 29, 2026  
**Version:** 2.0 - Multi-Type Architecture  
**Status:** Production Ready
