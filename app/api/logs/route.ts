import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('communications_log')
      .select('*, property:properties(property_address)')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching communication logs in API route:', error);
      return NextResponse.json({ error: 'Failed to fetch logs', details: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in logs API route:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 