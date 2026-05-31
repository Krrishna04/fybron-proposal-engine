# Supabase Integration Setup Guide

This quotation app has been successfully connected to Supabase. Follow these steps to configure it.

## Changes Made

### 1. **index.html**
- Added Supabase JavaScript SDK CDN in the `<head>` section
- Added a new "Save" button in the topbar next to the Print button

### 2. **app.js**
- Initialized Supabase client at the top of the file
- Added `collectQuotationData()` function to gather all form data
- Added quote search, retrieval, edit mode, print-from-search, and save/update logic
- Added `saveProposalToSupabase()` function to insert or update data in the database
- Added `showSuccessMessage()` function to display success notifications
- Added event listener to the Save button for form submission

## Configuration Steps

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create a new account
3. Click "New Project" and follow the setup wizard
4. Note your **Project URL** and **Anon Key** from the API settings

### Step 2: Create Database Table
In your Supabase dashboard, go to SQL Editor and run this query:

```sql
CREATE TABLE quotations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  client_name VARCHAR(255),
  phone VARCHAR(50),
  project_location VARCHAR(255),
  proposal_date DATE,
  quote_number VARCHAR(50),
  validity_days NUMERIC,
  valid_until DATE,
  pool_length NUMERIC,
  pool_width NUMERIC,
  pool_depth NUMERIC,
  measurement_unit VARCHAR(10),
  pool_type VARCHAR(255),
  surface_area_sqft NUMERIC,
  volume_litres NUMERIC,
  base_rate NUMERIC,
  gst_rate NUMERIC,
  shell_price NUMERIC,
  installation_price NUMERIC,
  mep_price NUMERIC,
  subtotal NUMERIC,
  gst_amount NUMERIC,
  grand_total NUMERIC,
  include_gst BOOLEAN,
  include_main_works BOOLEAN,
  include_installation BOOLEAN,
  include_mep_items BOOLEAN,
  include_surface_preparation BOOLEAN,
  include_testing BOOLEAN,
  scope TEXT,
  notes TEXT,
  prepared_by VARCHAR(255),
  approved_by VARCHAR(255),
  prepared_by_name VARCHAR(255),
  prepared_by_designation VARCHAR(255),
  prepared_by_phone VARCHAR(50),
  approved_by_name VARCHAR(255),
  approved_by_designation VARCHAR(255),
  approved_by_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE,
  last_modified TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

If your table already exists, add the newer columns with:

```sql
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS validity_days NUMERIC;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS valid_until DATE;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS prepared_by VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS prepared_by_name VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS prepared_by_designation VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS prepared_by_phone VARCHAR(50);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_by_name VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_by_designation VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_by_phone VARCHAR(50);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS include_main_works BOOLEAN;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS include_installation BOOLEAN;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS include_mep_items BOOLEAN;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS include_surface_preparation BOOLEAN;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS include_testing BOOLEAN;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE;
```

### Step 3: Enable Row Level Security (Optional but Recommended)
If you want public write access without authentication:

```sql
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert" ON quotations
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "allow_select" ON quotations
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "allow_update" ON quotations
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
```

### Step 4: Update API Credentials
Open `app.js` and replace the placeholder values:

```javascript
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
```

With your actual credentials from the Supabase dashboard:
- Copy your **Project URL** (Settings → API → Project URL)
- Copy your **Anon Key** (Settings → API → Anon Key)

## How to Use

1. Fill in the quotation form with proposal details
2. Click the **Save** button in the top bar
3. A success message will appear if the data is saved successfully
4. Check your Supabase dashboard to verify the data was inserted
5. Use **Find Existing Quote** to search by quote number, client name, or phone number
6. Click **Open**, **Edit**, or **Print** from the results table

## Data Fields Saved

The following information is captured and saved:
- Client name and project location
- Proposal date and quote number
- Pool dimensions (length, width, depth, unit)
- Pool type
- Surface area and volume calculations
- Pricing details (base rate, GST, shell, installation, MEP)
- Totals (subtotal, GST amount, grand total)
- Scope of work and notes
- Phone number, prepared/approved by names, designations, phones, and last modified timestamp

## Notes

- The UI now includes a quote search panel and edit mode, while keeping the existing proposal layout
- All calculations and proposal generation work as before
- No frameworks were added - uses vanilla JavaScript
- Error handling with user-friendly messages
- Success messages auto-dismiss after 4 seconds
