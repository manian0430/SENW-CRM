import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Define the expected CSV headers and their mappings
const CSV_HEADERS = {
  'APN/PIN/Tax 1': 'apn',
  'Property Address': 'address',
  'List Price': 'price',
  'Skip Trace Status': 'status',
  'Beds': 'beds',
  'Baths': 'baths',
  'Living Area SQFT': 'livingArea',
  'Year Built': 'yearBuilt',
  'Parking spaces': 'parkingSpaces',
  'Parking Type': 'parkingType',
  'Universal Land Use': 'universalLandUse',
  'Owner 1 First Name': 'owner1FirstName',
  'Owner 1 Last Name': 'owner1LastName',
  'Owner 1 Full Name': 'owner1FullName',
  'Owner 1 Email Addresses': 'owner1EmailAddresses',
  'Owner 1 Phone Numbers': 'owner1PhoneNumbers'
}

// Function to clean and validate a property object
function cleanPropertyData(property) {
  return {
    apn: property.apn?.toString().trim() || '',
    address: property.address?.toString().trim() || '',
    city: property.city?.toString().trim() || '',
    state: property.state?.toString().trim() || '',
    zip5: property.zip5?.toString().trim() || '',
    price: property.price ? parseFloat(property.price.toString().replace(/[^0-9.-]+/g, '')) || 0 : 0,
    status: property.status?.toString().trim() || 'Active',
    beds: property.beds ? parseInt(property.beds.toString()) || 0 : 0,
    baths: property.baths ? parseFloat(property.baths.toString()) || 0 : 0,
    livingArea: property.livingArea ? parseInt(property.livingArea.toString()) || 0 : 0,
    yearBuilt: property.yearBuilt ? parseInt(property.yearBuilt.toString()) || 0 : 0,
    parkingSpaces: property.parkingSpaces ? parseInt(property.parkingSpaces.toString()) || 0 : 0,
    parkingType: property.parkingType?.toString().trim() || '',
    universalLandUse: property.universalLandUse?.toString().trim() || '',
    owner1FirstName: property.owner1FirstName?.toString().trim() || '',
    owner1LastName: property.owner1LastName?.toString().trim() || '',
    owner1FullName: property.owner1FullName?.toString().trim() || '',
    owner1EmailAddresses: property.owner1EmailAddresses?.toString().trim() || '',
    owner1PhoneNumbers: property.owner1PhoneNumbers?.toString().trim() || '',
    skipTraceStatus: property.skipTraceStatus?.toString().trim() || 'Ready for Outreach',
    skipTraceDate: property.skipTraceDate || new Date().toISOString(),
    skipTraceNotes: property.skipTraceNotes?.toString().trim() || '',
    skipTraceHistory: property.skipTraceHistory || []
  }
}

// Function to map CSV headers to our data structure
function mapCSVHeaders(headers) {
  const mapping = {}
  headers.forEach(header => {
    const cleanHeader = header.trim()
    if (CSV_HEADERS[cleanHeader]) {
      mapping[cleanHeader] = CSV_HEADERS[cleanHeader]
    }
  })
  return mapping
}

export async function POST(request) {
  try {
    const properties = await request.json()
    
    if (!Array.isArray(properties) || properties.length === 0) {
      return NextResponse.json({ error: 'No properties provided' }, { status: 400 })
    }

    const csvPath = path.join(process.cwd(), 'public', 'data_source', 'properties.csv')
    let existingCSV = ''
    
    try {
      existingCSV = fs.readFileSync(csvPath, 'utf8')
    } catch (e) {
      // If file doesn't exist, create header
      existingCSV = Object.keys(CSV_HEADERS).join(',') + '\n'
    }

    // Clean and validate each property
    const cleanedProperties = properties.map(property => cleanPropertyData(property))
    
    // Convert properties to CSV rows
    const newRows = cleanedProperties.map(property => {
      return Object.keys(CSV_HEADERS).map(header => {
        const field = CSV_HEADERS[header]
        const value = property[field]
        // Escape commas and quotes in the value
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      }).join(',')
    }).join('\n')

    // Append new rows to existing CSV
    const updatedCSV = existingCSV.trim() + '\n' + newRows + '\n'
    
    // Write back to file
    fs.writeFileSync(csvPath, updatedCSV)
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully imported ${properties.length} properties`,
      properties: cleanedProperties
    })
  } catch (error) {
    console.error('Error importing properties:', error)
    return NextResponse.json({ 
      error: 'Failed to import properties',
      details: error.message 
    }, { status: 500 })
  }
}