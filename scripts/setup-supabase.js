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
  console.log('Setting up Supabase for the CRM system...')
  
  try {
    // Step 1: Set up document management
    console.log('\n== DOCUMENT MANAGEMENT SETUP ==')
    
    // Create "documents" storage bucket if it doesn't exist
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
    
    // Check if documents table exists
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
    
    // Step 2: Set up team management
    console.log('\n== TEAM MANAGEMENT SETUP ==')
    
    // Create "avatars" storage bucket if it doesn't exist
    const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars')
    
    if (!avatarsBucket) {
      console.log('Creating avatars storage bucket...')
      const { error } = await supabase.storage.createBucket('avatars', {
        public: true, // Avatar images are typically public
        fileSizeLimit: 5242880, // 5MB limit per file
      })
      
      if (error) throw error
      console.log('✅ Avatars bucket created')
    } else {
      console.log('✅ Avatars bucket already exists')
    }
    
    // Check if team_members table exists
    console.log('Checking if team_members table exists...')
    const { error: teamTableError } = await supabase.from('team_members').select('*').limit(1)
    
    if (teamTableError && teamTableError.message.includes('does not exist')) {
      console.log('⚠️ Team members table does not exist')
      console.log('\nPlease create the team_members table using the Supabase dashboard:')
      console.log('1. Go to your Supabase project dashboard')
      console.log('2. Navigate to "SQL Editor"')
      console.log('3. Create a new query and paste the following SQL:')
      console.log(`
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `)
      console.log('4. Run the query')
    } else if (teamTableError) {
      console.error('Error checking team_members table:', teamTableError)
    } else {
      console.log('✅ Team members table already exists')
    }
    
    // Step 3: Configure storage policies
    console.log('\n== STORAGE POLICIES ==')
    console.log('Please set up storage policies using the Supabase dashboard:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Navigate to "Storage" > "Policies"')
    console.log('3. For the "documents" bucket:')
    console.log('   - Allow authenticated users to upload, download, and delete files')
    console.log('4. For the "avatars" bucket:')
    console.log('   - Allow authenticated users to upload and delete files')
    console.log('   - Allow public access to download/view files')
    
    console.log('\n✅ Setup process completed!')
    
  } catch (error) {
    console.error('Error setting up Supabase:', error)
    process.exit(1)
  }
}

main() 