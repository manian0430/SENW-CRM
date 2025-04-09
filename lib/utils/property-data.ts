export interface Property {
  images: string[]; // Array of image URLs
  // Identifiers
  apn: string;
  apn2: string;
  apn3: string;
  fips: string;
  censusTract: string;

  // Address Components
  address: string;
  houseNumber: string;
  preDirection: string;
  street: string;
  streetSuffix: string;
  postDirection: string;
  unitType: string;
  unitNumber: string;
  city: string;
  state: string;
  zip5: string;
  zip4: string;

  // Mailing Address
  mailingAddress: string;
  mailingHouseNumber: string;
  mailingPreDirection: string;
  mailingStreet: string;
  mailingStreetSuffix: string;
  mailingPostDirection: string;
  mailingUnitType: string;
  mailingUnitNumber: string;
  mailingCity: string;
  mailingState: string;
  mailingZip5: string;
  mailingZip4: string;

  // MLS and Listing Info
  mlsId: string;
  listingType: string;
  status: string;
  price: number;
  daysOnMarket: number;
  contractStatusChangeDate: string;

  // Location Info
  townshipName: string;
  subdivisionCode: string;
  subdivision: string;

  // Tax and Assessment
  currentYearTax: number;
  taxAmount: number;
  taxRateCodeArea: string;
  currentYearAssessment: number;
  totalAssessedValue: number;
  assessedLand: number;
  assessedImprovement: number;
  totalMarketValue: number;
  marketValueLand: number;
  marketValueImprovement: number;
  estimatedValue: number;

  // Property Status
  absenteeStatus: string;
  exemptionVeterans: boolean;
  exemptionDisabled: boolean;
  exemptionSenior: boolean;
  exemptionWidow: boolean;
  exemptionHomestead: boolean;

  // Property Details
  blockNumber: string;
  lotNumber: string;
  sectionNumber: string;
  countyUseCode: string;
  universalLandUse: string;
  stateLandUseCode: string;
  zoning: string;
  platMapReference: string;
  lotAcres: number;
  lotSqft: number;
  newConstruction: string;
  beds: number;
  baths: number;
  totalBuildingArea: number;
  livingAreaSqft: number;
  grossAreaSqft: number;
  basementSqft: number;
  garageSqft: number;
  basement: string;
  flooringCover: string;
  stories: number;
  style: string;
  yearBuilt: number;
  airConditioning: string;
  heatType: string;
  fireplaceIndicator: string;
  constructionType: string;
  exteriorWall: string;
  roofMaterialType: string;
  porchType: string;
  hasPool: string;
  parkingSpaces: number;
  parkingType: string;
  totalUnits: number;

  // Transaction Info
  sellScore: string;
  distressedIndicator: string;
  distressedRecordingDate: string;
  distressedCaseNumber: string;
  auctionDate: string;
  defaultDate: string;
  recordingDate: string;
  documentType: string;
  salesPrice: number;

  // Financial Info
  equity: number;
  equityPercentage: number;
  numberOfMortgages: number;
  mortgageLoanBalance: number;

  // Mortgage 1
  mortgage1LenderName: string;
  mortgage1LoanType: string;
  mortgage1Amount: number;
  mortgage1LoanDate: string;
  mortgage1Rate: string;
  mortgage1Age: string;

  // Mortgage 2
  mortgage2LenderName: string;
  mortgage2LoanType: string;
  mortgage2Amount: number;
  mortgage2LoanDate: string;
  mortgage2Rate: string;
  mortgage2Age: string;

  // Mortgage 3
  mortgage3LenderName: string;
  mortgage3LoanType: string;
  mortgage3Amount: number;
  mortgage3LoanDate: string;
  mortgage3Rate: string;
  mortgage3Age: string;

  // Mortgage 4
  mortgage4LenderName: string;
  mortgage4LoanType: string;
  mortgage4Amount: number;
  mortgage4LoanDate: string;
  mortgage4Rate: string;
  mortgage4Age: string;

  // Owner 1
  owner1FirstName: string;
  owner1MiddleName: string;
  owner1LastName: string;
  owner1FullName: string;
  owner1EmailAddresses: string;
  owner1PhoneNumbers: string;

  // Owner 2
  owner2FirstName: string;
  owner2MiddleName: string;
  owner2LastName: string;
  owner2FullName: string;
  owner2EmailAddresses: string;
  owner2PhoneNumbers: string;
}

interface CSVProperty {
  'APN/PIN/Tax 1': string;
  'Property Address': string;
  'List Price': string;
  'Status': string;
  'Beds': string;
  'Baths': string;
  'Living Area SQFT': string;
  'Year Built': string;
  'Parking spaces': string;
  'Parking Type': string;
  'County Use Code': string;
  'Universal Land Use': string;
}

export function transformCSVToProperties(csvData: any[]): Property[] {
  return csvData
    .map(record => {
      const property: Property = {
        images: [], // Assuming images are not provided in the CSV
        // Identifiers
        apn: record['APN/PIN/Tax 1'] || '',
        apn2: record['APN/PIN/Tax 2'] || '',
        apn3: record['APN/PIN/Tax 3'] || '',
        fips: record['FIPS'] || '',
        censusTract: record['Census Tract'] || '',

        // Address Components
        address: record['Property Address'] || '',
        houseNumber: record['House Number'] || '',
        preDirection: record['Pre Direction'] || '',
        street: record['Street'] || '',
        streetSuffix: record['Street Suffix'] || '',
        postDirection: record['Post Direction'] || '',
        unitType: record['Unit Type'] || '',
        unitNumber: record['Unit Number'] || '',
        city: record['City'] || '',
        state: record['State'] || '',
        zip5: record['ZIP 5'] || '',
        zip4: record['ZIP 4'] || '',

        // Mailing Address
        mailingAddress: record['Mailing Address'] || '',
        mailingHouseNumber: record['Mailing House Number'] || '',
        mailingPreDirection: record['Mailing Pre Direction'] || '',
        mailingStreet: record['Mailing Street'] || '',
        mailingStreetSuffix: record['Mailing Street Suffix'] || '',
        mailingPostDirection: record['Mailing Post Direction'] || '',
        mailingUnitType: record['Mailing Unit Type'] || '',
        mailingUnitNumber: record['Mailing Unit Number'] || '',
        mailingCity: record['Mailing City'] || '',
        mailingState: record['Mailing State'] || '',
        mailingZip5: record['Mailing ZIP 5'] || '',
        mailingZip4: record['Mailing ZIP 4'] || '',

        // MLS and Listing Info
        mlsId: record['MLS ID'] || '',
        listingType: record['Listing Type'] || '',
        status: record['Status'] || '',
        price: parseFloat(record['List Price']?.replace(/[^0-9.]/g, '')) || 0,
        daysOnMarket: parseInt(record['Days on Market']) || 0,
        contractStatusChangeDate: record['Contract Status Change Date'] || '',

        // Location Info
        townshipName: record['Township Name'] || '',
        subdivisionCode: record['Subdivision Code'] || '',
        subdivision: record['Subdivision'] || '',

        // Tax and Assessment
        currentYearTax: parseFloat(record['Current Year Tax']?.replace(/[^0-9.]/g, '')) || 0,
        taxAmount: parseFloat(record['Tax Amount']?.replace(/[^0-9.]/g, '')) || 0,
        taxRateCodeArea: record['Tax Rate Code Area'] || '',
        currentYearAssessment: parseFloat(record['Current Year Assessment']?.replace(/[^0-9.]/g, '')) || 0,
        totalAssessedValue: parseFloat(record['Total Assessed Value']?.replace(/[^0-9.]/g, '')) || 0,
        assessedLand: parseFloat(record['Assessed Land']?.replace(/[^0-9.]/g, '')) || 0,
        assessedImprovement: parseFloat(record['Assessed Improvement']?.replace(/[^0-9.]/g, '')) || 0,
        totalMarketValue: parseFloat(record['Total Market Value']?.replace(/[^0-9.]/g, '')) || 0,
        marketValueLand: parseFloat(record['Market Value Land']?.replace(/[^0-9.]/g, '')) || 0,
        marketValueImprovement: parseFloat(record['Market Value Improvement']?.replace(/[^0-9.]/g, '')) || 0,
        estimatedValue: parseFloat(record['Estimated Value']?.replace(/[^0-9.]/g, '')) || 0,

        // Property Status
        absenteeStatus: record['Absentee Status'] || '',
        exemptionVeterans: record['Exemption-Veterans'] === 'true',
        exemptionDisabled: record['Exemption-Disabled'] === 'true',
        exemptionSenior: record['Exemption-Senior'] === 'true',
        exemptionWidow: record['Exemption-Widow'] === 'true',
        exemptionHomestead: record['Exemption-Homestead'] === 'true',

        // Property Details
        blockNumber: record['Block #'] || '',
        lotNumber: record['Lot #'] || '',
        sectionNumber: record['Section #'] || '',
        countyUseCode: record['County Use Code'] || '',
        universalLandUse: record['Universal Land Use'] || '',
        stateLandUseCode: record['State Land Use Code'] || '',
        zoning: record['Zoning'] || '',
        platMapReference: record['Plat Map Reference'] || '',
        lotAcres: parseFloat(record['Lot Acres']) || 0,
        lotSqft: parseInt(record['Lot SQFT']) || 0,
        newConstruction: record['New Construction'] || '',
        beds: parseInt(record['Beds']) || 0,
        baths: parseInt(record['Baths']) || 0,
        totalBuildingArea: parseInt(record['Total Building Area']) || 0,
        livingAreaSqft: parseInt(record['Living Area SQFT']) || 0,
        grossAreaSqft: parseInt(record['Gross Area SQFT']) || 0,
        basementSqft: parseInt(record['Basement SQFT']) || 0,
        garageSqft: parseInt(record['Garage SQFT']) || 0,
        basement: record['Basement'] || '',
        flooringCover: record['Flooring Cover'] || '',
        stories: parseInt(record['Stories']) || 0,
        style: record['Style'] || '',
        yearBuilt: parseInt(record['Year Built']) || 0,
        airConditioning: record['Air conditioning'] || '',
        heatType: record['Heat Type'] || '',
        fireplaceIndicator: record['Fireplace indicator'] || '',
        constructionType: record['Construction Type'] || '',
        exteriorWall: record['Exterior Wall'] || '',
        roofMaterialType: record['Roof Material Type'] || '',
        porchType: record['Porch Type'] || '',
        hasPool: record['Has Pool'] || '',
        parkingSpaces: parseInt(record['Parking spaces']) || 0,
        parkingType: record['Parking Type'] || '',
        totalUnits: parseInt(record['Total Units']) || 0,

        // Transaction Info
        sellScore: record['Sell Score'] || '',
        distressedIndicator: record['Distressed Indicator'] || '',
        distressedRecordingDate: record['Distressed Recording Date'] || '',
        distressedCaseNumber: record['Distressed Case Number'] || '',
        auctionDate: record['Auction Date'] || '',
        defaultDate: record['Default Date'] || '',
        recordingDate: record['Recording Date'] || '',
        documentType: record['Document Type'] || '',
        salesPrice: parseFloat(record['Sales Price']?.replace(/[^0-9.]/g, '')) || 0,

        // Financial Info
        equity: parseFloat(record['Equity']?.replace(/[^0-9.]/g, '')) || 0,
        equityPercentage: parseFloat(record['Equity Percentage']) || 0,
        numberOfMortgages: parseInt(record['Number Of Mortgages']) || 0,
        mortgageLoanBalance: parseFloat(record['Mortgage Loan Balance']?.replace(/[^0-9.]/g, '')) || 0,

        // Mortgage 1
        mortgage1LenderName: record['Mortgage 1 Lender Name'] || '',
        mortgage1LoanType: record['Mortgage 1 Loan Type'] || '',
        mortgage1Amount: parseFloat(record['Mortgage 1 Amount']?.replace(/[^0-9.]/g, '')) || 0,
        mortgage1LoanDate: record['Mortgage 1 Loan Date'] || '',
        mortgage1Rate: record['Mortgage 1 Rate'] || '',
        mortgage1Age: record['Mortgage 1 Age'] || '',

        // Mortgage 2
        mortgage2LenderName: record['Mortgage 2 Lender Name'] || '',
        mortgage2LoanType: record['Mortgage 2 Loan Type'] || '',
        mortgage2Amount: parseFloat(record['Mortgage 2 Amount']?.replace(/[^0-9.]/g, '')) || 0,
        mortgage2LoanDate: record['Mortgage 2 Loan Date'] || '',
        mortgage2Rate: record['Mortgage 2 Rate'] || '',
        mortgage2Age: record['Mortgage 2 Age'] || '',

        // Mortgage 3
        mortgage3LenderName: record['Mortgage 3 Lender Name'] || '',
        mortgage3LoanType: record['Mortgage 3 Loan Type'] || '',
        mortgage3Amount: parseFloat(record['Mortgage 3 Amount']?.replace(/[^0-9.]/g, '')) || 0,
        mortgage3LoanDate: record['Mortgage 3 Loan Date'] || '',
        mortgage3Rate: record['Mortgage 3 Rate'] || '',
        mortgage3Age: record['Mortgage 3 Age'] || '',

        // Mortgage 4
        mortgage4LenderName: record['Mortgage 4 Lender Name'] || '',
        mortgage4LoanType: record['Mortgage 4 Loan Type'] || '',
        mortgage4Amount: parseFloat(record['Mortgage 4 Amount']?.replace(/[^0-9.]/g, '')) || 0,
        mortgage4LoanDate: record['Mortgage 4 Loan Date'] || '',
        mortgage4Rate: record['Mortgage 4 Rate'] || '',
        mortgage4Age: record['Mortgage 4 Age'] || '',

        // Owner 1
        owner1FirstName: record['Owner 1 First Name'] || '',
        owner1MiddleName: record['Owner 1 Middle Name'] || '',
        owner1LastName: record['Owner 1 Last Name'] || '',
        owner1FullName: record['Owner 1 Full Name'] || '',
        owner1EmailAddresses: record['Owner 1 Email Addresses'] || '',
        owner1PhoneNumbers: record['Owner 1 Phone Numbers'] || '',

        // Owner 2
        owner2FirstName: record['Owner 2 First Name'] || '',
        owner2MiddleName: record['Owner 2 Middle Name'] || '',
        owner2LastName: record['Owner 2 Last Name'] || '',
        owner2FullName: record['Owner 2 Full Name'] || '',
        owner2EmailAddresses: record['Owner 2 Email Addresses'] || '',
        owner2PhoneNumbers: record['Owner 2 Phone Numbers'] || ''
      };

      return property;
    })
    .filter(property => property.price > 0 && property.address); // Filter out invalid entries
} 