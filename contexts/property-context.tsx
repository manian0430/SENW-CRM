'use client';

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Papa from 'papaparse';
// Explicitly import ParseError type from papaparse
import type { ParseResult, ParseError as PapaParseError } from 'papaparse';
import { transformCSVToProperties, type Property } from '@/lib/utils/property-data';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
  fetchProperties: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/data_source/properties.csv');
      if (!response.ok) {
        throw new Error(`Failed to fetch properties data: ${response.statusText}`);
      }
      const csvText = await response.text();

      // Define headers manually based on the known CSV structure
      const headers = ["APN/PIN/Tax 1","APN/PIN/Tax 2","APN/PIN/Tax 3","FIPS","Census Tract","Property Address","House Number","Pre Direction","Street","Street Suffix","Post Direction","Unit Type","Unit Number","City","State","ZIP 5","ZIP 4","Mailing Address","Mailing House Number","Mailing Pre Direction","Mailing Street","Mailing Street Suffix","Mailing Post Direction","Mailing Unit Type","Mailing Unit Number","Mailing City","Mailing State","Mailing ZIP 5","Mailing ZIP 4","MLS ID","Listing Type","Status","List Price","Days on Market","Contract Status Change Date","Township Name","Subdivision Code","Subdivision","Current Year Tax","Tax Amount","Tax Rate Code Area","Current Year Assessment","Total Assessed Value","Assessed Land","Assessed Improvement","Total Market Value","Market Value Land","Market Value Improvement","Estimated Value","Absentee Status","Exemption-Veterans","Exemption-Disabled","Exemption-Senior","Exemption-Widow","Exemption-Homestead","Block #","Lot #","Section #","County Use Code","Universal Land Use","State Land Use Code","Zoning","Plat Map Reference","Lot Acres","Lot SQFT","New Construction","Beds","Baths","Total Building Area","Living Area SQFT","Gross Area SQFT","Basement SQFT","Garage SQFT","Basement","Flooring Cover","Stories","Style","Year Built","Air conditioning","Heat Type","Fireplace indicator","Construction Type","Exterior Wall","Roof Material Type","Porch Type","Has Pool","Parking spaces","Parking Type","Total Units","Sell Score","Distressed Indicator","Distressed Recording Date","Distressed Case Number","Auction Date","Default Date","Recording Date","Document Type","Sales Price","Equity","Equity Percentage","Number Of Mortgages","Mortgage Loan Balance","Mortgage 1 Lender Name","Mortgage 1 Loan Type","Mortgage 1 Amount","Mortgage 1 Loan Date","Mortgage 1 Rate","Estimated Rate","Estimated Rate 2","Mortgage 1 Age","Mortgage 2 Lender Name","Mortgage 2 Loan Type","Mortgage 2 Amount","Mortgage 2 Loan Date","Mortgage 2 Rate","Mortgage 2 Age","Mortgage 3 Lender Name","Mortgage 3 Loan Type","Mortgage 3 Amount","Mortgage 3 Loan Date","Mortgage 3 Rate","Mortgage 3 Age","Mortgage 4 Lender Name","Mortgage 4 Loan Type","Mortgage 4 Amount","Mortgage 4 Loan Date","Mortgage 4 Rate","Mortgage 4 Age","Owner 1 First Name","Owner 1 Middle Name","Owner 1 Last Name","Owner 1 Full Name","Owner 1 Email Addresses","Owner 1 Phone Numbers","Owner 2 First Name","Owner 2 Middle Name","Owner 2 Last Name","Owner 2 Full Name","Owner 2 Email Addresses","Owner 2 Phone Numbers"];

      // Parse with header: false to treat first line as data
      const parsedData: ParseResult<string[]> = Papa.parse(csvText, {
        header: false, // Parse as arrays, not objects
        skipEmptyLines: true,
      });

      // Keep lenient error logging for data rows
      if (parsedData.errors.length > 0) {
        console.warn(`CSV parsing encountered ${parsedData.errors.length} errors. Attempting to proceed with valid data. See details below:`);
        parsedData.errors.forEach((err: PapaParseError, index: number) => {
          // Add 1 to index because we skipped the header row for error reporting purposes
          console.warn(`Parsing Error on data row ${index + 1}:`, err);
        });
        setError(`Failed to parse some CSV data (${parsedData.errors.length} errors). Data shown might be incomplete.`);
      }

      // Skip the actual header row from the data array
      const dataRows = parsedData.data.slice(1);

      // Map data rows to objects using the hardcoded headers
      const structuredData = dataRows.map(row => {
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          // Ensure row has enough columns before accessing index
          obj[header] = row && row.length > index ? row[index] : '';
        });
        return obj;
      });

      // Filter the structured data
      const validData = structuredData.filter((row: Record<string, string>) =>
        row && typeof row === 'object' && row['Property Address'] !== undefined && Object.values(row).some(val => val !== null && val !== '')
      );

       if (validData.length === 0 && structuredData.length > 0) {
         console.error("CSV parsing resulted in no valid data after filtering.");
         // Log specific errors if available
         if (parsedData.errors.length > 0) {
             parsedData.errors.forEach((err: PapaParseError, index: number) => {
                 console.error(`Parsing Error on data row ${index + 1}:`, err);
             });
         }
         throw new Error("Failed to parse CSV data: No valid rows found after filtering.");
      }

      const transformedProperties = transformCSVToProperties(validData);
      setProperties(transformedProperties);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Re-enable automatic fetching on mount
    fetchProperties();
  }, []);

  // Keep loading true initially
  // You might want to adjust this based on how you trigger fetching later
  // setLoading(false); // Keep loading true initially if fetchProperties might be called manually

  const value = { properties, loading, error, fetchProperties };

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}
