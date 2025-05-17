export type SocialPlatform = 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok' | 'bluesky' | 'truth'

export type SocialAccount = {
  id: string
  user_id: string
  platform: SocialPlatform
  account_id: string
  username: string
  display_name?: string
  profile_url?: string
  avatar_url?: string
  access_token?: string
  refresh_token?: string
  token_expires_at?: string
  platform_specific_data?: Record<string, any>
  is_active: boolean
  last_sync_at?: string
  created_at: string
  updated_at: string
}

export interface Database {
  social: {
    Tables: {
      accounts: {
        Row: SocialAccount
        Insert: Omit<SocialAccount, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SocialAccount, 'id'>>
      }
    }
  }
}

export type PhoneNumber = {
    number: string;
    dnc: boolean;
};

export type SkipTraceStatus = 'DNC' | 'Active Listing' | 'Ready for Outreach' | 'Pending' | 'Completed';

export interface Property {
    id: string;
    created_at?: string;
    updated_at?: string;
    
    // Property Identification
    apn_tax_1?: string;
    apn_tax_2?: string;
    apn_tax_3?: string;
    fips?: string;
    census_tract?: string;
    
    // Property Address
    property_address?: string;
    house_number?: string;
    pre_direction?: string;
    street?: string;
    street_suffix?: string;
    post_direction?: string;
    unit_type?: string;
    unit_number?: string;
    city?: string;
    state?: string;
    zip_5?: string;
    zip_4?: string;
    
    // Mailing Address
    mailing_address?: string;
    mailing_house_number?: string;
    mailing_pre_direction?: string;
    mailing_street?: string;
    mailing_street_suffix?: string;
    mailing_post_direction?: string;
    mailing_unit_type?: string;
    mailing_unit_number?: string;
    mailing_city?: string;
    mailing_state?: string;
    mailing_zip_5?: string;
    mailing_zip_4?: string;
    
    // Listing Information
    mls_id?: string;
    listing_type?: string;
    status?: string;
    list_price?: number;
    days_on_market?: number;
    contract_status_change_date?: string;
    
    // Property Details
    township_name?: string;
    subdivision_code?: string;
    subdivision?: string;
    current_year_tax?: number;
    tax_amount?: number;
    tax_rate_code_area?: string;
    current_year_assessment?: number;
    total_assessed_value?: number;
    assessed_land?: number;
    assessed_improvement?: number;
    total_market_value?: number;
    market_value_land?: number;
    market_value_improvement?: number;
    estimated_value?: number;
    
    // Status and Exemptions
    absentee_status?: boolean;
    exemption_veterans?: boolean;
    exemption_disabled?: boolean;
    exemption_senior?: boolean;
    exemption_widow?: boolean;
    exemption_homestead?: boolean;
    
    // Property Characteristics
    block_number?: string;
    lot_number?: string;
    section_number?: string;
    county_use_code?: string;
    universal_land_use?: string;
    state_land_use_code?: string;
    zoning?: string;
    plat_map_reference?: string;
    lot_acres?: number;
    lot_sqft?: number;
    new_construction?: string;
    beds?: number;
    baths?: number;
    total_building_area?: number;
    living_area_sqft?: number;
    gross_area_sqft?: number;
    basement_sqft?: number;
    garage_sqft?: number;
    basement?: string;
    flooring_cover?: string;
    stories?: number;
    style?: string;
    year_built?: number;
    air_conditioning?: string;
    heat_type?: string;
    fireplace_indicator?: string;
    construction_type?: string;
    exterior_wall?: string;
    roof_material_type?: string;
    porch_type?: string;
    has_pool?: boolean;
    parking_spaces?: number;
    parking_type?: string;
    total_units?: number;

    // Images and Skip Trace
    images?: string[];
    skip_trace_status?: string;

    // Owner Information
    owner_1_first_name?: string;
    owner_1_middle_name?: string;
    owner_1_last_name?: string;
    owner_1_full_name?: string;
    owner_1_email?: string;
    owner_1_phone_numbers?: string | null; // Changed type to string | null
    owner_2_first_name?: string;
    owner_2_middle_name?: string;
    owner_2_last_name?: string;
    owner_2_full_name?: string;
    owner_2_email?: string;
    owner_2_phone_numbers?: string | null; // Changed type to string | null

    // Financial Information
    equity?: number;
    equity_percentage?: number;
    number_of_mortgages?: number;
    mortgage_loan_balance?: number;

    // Mortgage 1
    mortgage_1_lender_name?: string;
    mortgage_1_loan_type?: string;
    mortgage_1_amount?: number;
    mortgage_1_loan_date?: string;
    mortgage_1_rate?: number;
    mortgage_1_age?: number;

    // Mortgage 2
    mortgage_2_lender_name?: string;
    mortgage_2_loan_type?: string;
    mortgage_2_amount?: number;
    mortgage_2_loan_date?: string;
    mortgage_2_rate?: number;
    mortgage_2_age?: number;
}

// Helper type for inserting a new property (omitting auto-generated fields)
export type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at'>;

// Helper type for updating a property
export type PropertyUpdate = Partial<PropertyInsert>; 