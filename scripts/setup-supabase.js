/**
 * This script sets up the required Supabase storage buckets for the document management system.
 * 
 * Run this script once to initialize your Supabase project:
 * node scripts/setup-supabase.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('Setting up Supabase for document management...')
  
  try {
    // Step 1: Create "documents" storage bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets()
    const documentsBucket = buckets.find(bucket => bucket.name === 'documents')
    
    if (!documentsBucket) {
      console.log('Creating documents storage bucket...')
      const { error } = await supabase.storage.createBucket('documents', {
        public: false,
        fileSizeLimit: 10485760, // 10MB limit per file
      })
      
      if (error) throw error
      console.log('✅ Documents bucket created')
    } else {
      console.log('✅ Documents bucket already exists')
    }
    
    // Step 2: Check if documents table exists
    console.log('Checking if documents table exists...')
    const { error: tableError } = await supabase.from('documents').select('*').limit(1)
    
    if (tableError && tableError.message.includes('does not exist')) {
      console.log('⚠️ Documents table does not exist')
      console.log('\nPlease create the documents table using the Supabase dashboard:')
      console.log('1. Go to your Supabase project dashboard')
      console.log('2. Navigate to "SQL Editor"')
      console.log('3. Create a new query and paste the following SQL:')
      console.log(`
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  property_id TEXT,
  property_name TEXT,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  size TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE
);
      `)
      console.log('4. Run the query')
    } else if (tableError) {
      console.error('Error checking documents table:', tableError)
    } else {
      console.log('✅ Documents table already exists')
    }
    
    // Step 3: Configure storage policies
    console.log('\nSetting up storage policies...')
    
    try {
      const { error: uploadPolicyError } = await supabase.storage.from('documents').setPublicAccessControl({
        upsert: 'authenticated',
        read: 'authenticated',
        delete: 'authenticated'
      })
      
      if (uploadPolicyError) throw uploadPolicyError
      console.log('✅ Storage policies configured')
    } catch (policyError) {
      console.log('⚠️ Could not configure storage policies automatically')
      console.log('\nPlease set up storage policies using the Supabase dashboard:')
      console.log('1. Go to your Supabase project dashboard')
      console.log('2. Navigate to "Storage" > "Policies"')
      console.log('3. Set up policies for the "documents" bucket to allow authenticated users to:')
      console.log('   - Insert/upload files')
      console.log('   - Select/download files')
      console.log('   - Delete files')
    }
    
    console.log('\n✅ Setup process completed!')
    
  } catch (error) {
    console.error('Error setting up Supabase:', error)
    process.exit(1)
  }
}

main() 