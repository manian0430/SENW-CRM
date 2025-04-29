import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupSocialSchema() {
  try {
    console.log('Setting up social media schema...')
    
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'social-schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')
    
    // Execute the schema SQL
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSql })
    
    if (error) {
      throw error
    }
    
    console.log('✅ Social media schema created successfully')
    
    // Verify tables were created
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'social')
    
    if (tablesError) {
      throw tablesError
    }
    
    console.log('\nCreated tables:')
    tables?.forEach(table => {
      console.log(`- ${table.table_name}`)
    })
    
  } catch (error) {
    console.error('Error setting up social media schema:', error)
    process.exit(1)
  }
}

setupSocialSchema() 