# Supabase Integration Setup Guide

This quotation app has been successfully connected to Supabase. Follow these steps to configure it.

## Changes Made

### 1. **index.html**
- Added Supabase JavaScript SDK CDN in the `<head>` section
- Added a new "Save" button in the topbar next to the Print button

### 2. **app.js**
- Initialized Supabase client at the top of the file
- Added `collectQuotationData()` function to gather all form data
- Added `saveProposalToSupabase()` function to insert data into the database
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
  project_location VARCHAR(255),
  proposal_date DATE,
  quote_number VARCHAR(50),
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
  scope TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 3: Enable Row Level Security (Optional but Recommended)
If you want public write access without authentication:

```sql
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert" ON quotations
  FOR INSERT TO anon
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

## Notes

- The UI remains unchanged - only a Save button was added
- All calculations and proposal generation work as before
- No frameworks were added - uses vanilla JavaScript
- Error handling with user-friendly messages
- Success messages auto-dismiss after 4 seconds
