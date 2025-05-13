-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Property Identification
    apn_tax_1 VARCHAR(50),
    apn_tax_2 VARCHAR(50),
    apn_tax_3 VARCHAR(50),
    fips VARCHAR(10),
    census_tract VARCHAR(50),
    
    -- Property Address
    property_address VARCHAR(255),
    house_number VARCHAR(20),
    pre_direction VARCHAR(10),
    street VARCHAR(100),
    street_suffix VARCHAR(20),
    post_direction VARCHAR(10),
    unit_type VARCHAR(20),
    unit_number VARCHAR(20),
    city VARCHAR(100),
    state CHAR(2),
    zip_5 VARCHAR(5),
    zip_4 VARCHAR(4),
    
    -- Mailing Address
    mailing_address VARCHAR(255),
    mailing_house_number VARCHAR(20),
    mailing_pre_direction VARCHAR(10),
    mailing_street VARCHAR(100),
    mailing_street_suffix VARCHAR(20),
    mailing_post_direction VARCHAR(10),
    mailing_unit_type VARCHAR(20),
    mailing_unit_number VARCHAR(20),
    mailing_city VARCHAR(100),
    mailing_state CHAR(2),
    mailing_zip_5 VARCHAR(5),
    mailing_zip_4 VARCHAR(4),
    
    -- Listing Information
    mls_id VARCHAR(50),
    listing_type VARCHAR(50),
    status VARCHAR(50),
    list_price DECIMAL(12,2),
    days_on_market INTEGER,
    contract_status_change_date DATE,
    
    -- Property Details
    township_name VARCHAR(100),
    subdivision_code VARCHAR(50),
    subdivision VARCHAR(100),
    current_year_tax DECIMAL(12,2),
    tax_amount DECIMAL(12,2),
    tax_rate_code_area VARCHAR(50),
    current_year_assessment DECIMAL(12,2),
    total_assessed_value DECIMAL(12,2),
    assessed_land DECIMAL(12,2),
    assessed_improvement DECIMAL(12,2),
    total_market_value DECIMAL(12,2),
    market_value_land DECIMAL(12,2),
    market_value_improvement DECIMAL(12,2),
    estimated_value DECIMAL(12,2),
    
    -- Status and Exemptions
    absentee_status BOOLEAN,
    exemption_veterans BOOLEAN,
    exemption_disabled BOOLEAN,
    exemption_senior BOOLEAN,
    exemption_widow BOOLEAN,
    exemption_homestead BOOLEAN,
    
    -- Property Characteristics
    block_number VARCHAR(50),
    lot_number VARCHAR(50),
    section_number VARCHAR(50),
    county_use_code VARCHAR(50),
    universal_land_use VARCHAR(100),
    state_land_use_code VARCHAR(50),
    zoning VARCHAR(50),
    plat_map_reference VARCHAR(100),
    lot_acres DECIMAL(10,4),
    lot_sqft INTEGER,
    new_construction BOOLEAN,
    beds NUMERIC(4,1),
    baths NUMERIC(4,1),
    total_building_area INTEGER,
    living_area_sqft INTEGER,
    gross_area_sqft INTEGER,
    basement_sqft INTEGER,
    garage_sqft INTEGER,
    basement VARCHAR(50),
    flooring_cover VARCHAR(100),
    stories NUMERIC(4,1),
    style VARCHAR(100),
    year_built INTEGER,
    air_conditioning BOOLEAN,
    heat_type VARCHAR(50),
    fireplace_indicator BOOLEAN,
    construction_type VARCHAR(50),
    exterior_wall VARCHAR(50),
    roof_material_type VARCHAR(50),
    porch_type VARCHAR(50),
    has_pool BOOLEAN,
    parking_spaces INTEGER,
    parking_type VARCHAR(50),
    total_units INTEGER,
    
    -- Financial and Status Indicators
    sell_score VARCHAR(50),
    distressed_indicator BOOLEAN,
    distressed_recording_date DATE,
    distressed_case_number VARCHAR(50),
    auction_date DATE,
    default_date DATE,
    recording_date DATE,
    document_type VARCHAR(100),
    sales_price DECIMAL(12,2),
    equity DECIMAL(12,2),
    equity_percentage DECIMAL(5,2),
    
    -- Mortgage Information
    number_of_mortgages INTEGER,
    mortgage_loan_balance DECIMAL(12,2),
    
    -- Mortgage 1
    mortgage_1_lender_name VARCHAR(100),
    mortgage_1_loan_type VARCHAR(50),
    mortgage_1_amount DECIMAL(12,2),
    mortgage_1_loan_date DATE,
    mortgage_1_rate DECIMAL(5,2),
    estimated_rate DECIMAL(5,2),
    estimated_rate_2 DECIMAL(5,2),
    mortgage_1_age DECIMAL(10,2),
    
    -- Mortgage 2
    mortgage_2_lender_name VARCHAR(100),
    mortgage_2_loan_type VARCHAR(50),
    mortgage_2_amount DECIMAL(12,2),
    mortgage_2_loan_date DATE,
    mortgage_2_rate DECIMAL(5,2),
    mortgage_2_age DECIMAL(10,2),
    
    -- Mortgage 3
    mortgage_3_lender_name VARCHAR(100),
    mortgage_3_loan_type VARCHAR(50),
    mortgage_3_amount DECIMAL(12,2),
    mortgage_3_loan_date DATE,
    mortgage_3_rate DECIMAL(5,2),
    mortgage_3_age DECIMAL(10,2),
    
    -- Mortgage 4
    mortgage_4_lender_name VARCHAR(100),
    mortgage_4_loan_type VARCHAR(50),
    mortgage_4_amount DECIMAL(12,2),
    mortgage_4_loan_date DATE,
    mortgage_4_rate DECIMAL(5,2),
    mortgage_4_age DECIMAL(10,2),
    
    -- Owner 1 Information
    owner_1_first_name VARCHAR(100),
    owner_1_middle_name VARCHAR(100),
    owner_1_last_name VARCHAR(100),
    owner_1_full_name VARCHAR(200),
    owner_1_email VARCHAR(255),
    owner_1_phone_numbers JSONB, -- Store as JSON array with phone numbers and DNC status
    
    -- Owner 2 Information
    owner_2_first_name VARCHAR(100),
    owner_2_middle_name VARCHAR(100),
    owner_2_last_name VARCHAR(100),
    owner_2_full_name VARCHAR(200),
    owner_2_email VARCHAR(255),
    owner_2_phone_numbers JSONB, -- Store as JSON array with phone numbers and DNC status
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_properties_apn ON properties(apn_tax_1);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city_state ON properties(city, state);
CREATE INDEX idx_properties_mls ON properties(mls_id);
CREATE INDEX idx_properties_zip ON properties(zip_5);

-- Add a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view all properties
CREATE POLICY "Users can view all properties"
    ON properties FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for authenticated users to insert properties
CREATE POLICY "Users can insert properties"
    ON properties FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy for authenticated users to update properties
CREATE POLICY "Users can update properties"
    ON properties FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Comments on table and columns
COMMENT ON TABLE properties IS 'Properties table storing comprehensive real estate property information';
COMMENT ON COLUMN properties.owner_1_phone_numbers IS 'JSON array storing phone numbers with DNC status. Format: [{"number": "555-123-4567", "dnc": false}]';
COMMENT ON COLUMN properties.owner_2_phone_numbers IS 'JSON array storing phone numbers with DNC status. Format: [{"number": "555-123-4567", "dnc": false}]'; 