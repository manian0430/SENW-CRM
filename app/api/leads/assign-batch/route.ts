import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { log_ids } = await request.json()

    if (!log_ids || !Array.isArray(log_ids) || log_ids.length === 0) {
      return NextResponse.json({ error: 'Log IDs are required' }, { status: 400 })
    }

    // 1. Fetch the logs with all needed info
    const { data: logs, error: logsError } = await supabaseAdmin
      .from('communications_log')
      .select('id, from_address, to_address, body, subject, communication_type, property:property_id(property_address)')
      .in('id', log_ids)

    if (logsError || !logs) {
      console.error('Error fetching logs:', logsError)
      return NextResponse.json({ error: 'Could not fetch communication logs' }, { status: 500 })
    }

    // 2. Fetch active agents in the lead rotation
    const { data: agents, error: agentsError } = await supabaseAdmin
      .from('team_members')
      .select('id, name')
      .eq('is_in_lead_rotation', true)
      .eq('status', 'Active')
      .order('id', { ascending: true })

    if (agentsError || !agents || agents.length === 0) {
      console.error('Error fetching agents or no agents in rotation:', agentsError)
      return NextResponse.json({ error: 'Could not find any active agents in the rotation' }, { status: 500 })
    }

    // 3. Get the last assigned agent index
    const { data: setting, error: settingError } = await supabaseAdmin
      .from('automation_settings')
      .select('value')
      .eq('key', 'last_assigned_agent_index')
      .single()

    if (settingError) {
      console.error('Error fetching automation settings:', settingError)
      return NextResponse.json({ error: 'Could not fetch automation settings' }, { status: 500 })
    }
    
    let lastIndex = (setting.value as {index: number})?.index ?? -1
    let createdLeads = [];

    // 4. For each log, create a new lead
    for (const log of logs) {
      const nextIndex = (lastIndex + 1) % agents.length
      const nextAgent = agents[nextIndex]

      // Compose notes/description
      let notes = `Imported from log\nType: ${log.communication_type}\n`;
      if (log.subject) notes += `Subject: ${log.subject}\n`;
      if (log.body) notes += `Message: ${log.body}\n`;
      // Handle property address whether property is an array or object
      let propertyAddress = undefined;
      if (log.property && Array.isArray(log.property) && log.property.length > 0 && 'property_address' in log.property[0]) {
        propertyAddress = log.property[0].property_address;
      } else if (log.property && typeof log.property === 'object' && 'property_address' in log.property) {
        propertyAddress = log.property.property_address;
      }
      if (propertyAddress) notes += `Property: ${propertyAddress}\n`;
      notes += `From: ${log.from_address || ''}\nTo: ${log.to_address || ''}`;

      // Compose name (fallback to contact info or generic)
      let name = log.from_address || log.to_address || 'Imported Lead';

      // Compose contact info
      let email = log.from_address?.includes('@') ? log.from_address : undefined;
      let phone = log.from_address && !log.from_address.includes('@') ? log.from_address : undefined;
      if (!email && log.to_address?.includes('@')) email = log.to_address;
      if (!phone && log.to_address && !log.to_address.includes('@')) phone = log.to_address;

      // Insert the new lead
      const { data: newLead, error: insertError } = await supabaseAdmin
        .from('leads')
        .insert({
          name,
          email,
          phone,
          status: 'New',
          agent_name: nextAgent.name,
          notes,
          is_hot: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting new lead from log', log.id, insertError)
        continue;
      } else {
        createdLeads.push({ id: newLead.id, name: newLead.name, agent: nextAgent.name });
        // Update round-robin index only on success
        const { error: settingUpdateError } = await supabaseAdmin
          .from('automation_settings')
          .update({ value: { index: nextIndex } })
          .eq('key', 'last_assigned_agent_index')
        if (!settingUpdateError) {
          lastIndex = nextIndex;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Created ${createdLeads.length} new leads from selected logs.`,
      leads: createdLeads
    })

  } catch (error) {
    console.error('Error in assign-batch route:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
} 