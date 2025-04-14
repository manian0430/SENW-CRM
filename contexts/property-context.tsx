'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Papa from 'papaparse';
import type { ParseResult } from 'papaparse';
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
        throw new Error('Failed to fetch properties data');
      }
      const csvText = await response.text();
      const parsedData: ParseResult<Record<string, string>> = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
      });

      if (parsedData.errors.length > 0) {
        console.error('CSV parsing errors:', parsedData.errors);
        throw new Error('Failed to parse CSV data');
      }

      const transformedProperties = transformCSVToProperties(parsedData.data);
      setProperties(transformedProperties);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

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