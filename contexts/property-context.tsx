'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import type { Property } from '@/types/supabase';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
  fetchProperties: () => Promise<void>;
  addProperty: (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => Promise<Property | null>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<Property | null>;
  deleteProperty: (id: string) => Promise<boolean>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([property])
        .select()
        .single();

      if (error) throw error;

      setProperties(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding property:', err);
      setError(err instanceof Error ? err.message : 'Failed to add property');
      return null;
    }
  };

  const updateProperty = async (id: string, property: Partial<Property>) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(property)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProperties(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      console.error('Error updating property:', err);
      setError(err instanceof Error ? err.message : 'Failed to update property');
      return null;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProperties(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting property:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete property');
      return false;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const value = {
    properties,
    loading,
    error,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}
