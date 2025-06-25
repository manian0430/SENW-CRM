import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const { lead_id } = await request.json()

    if (!lead_id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })
    }

    // 1. Fetch active agents in the lead rotation
    const { data: agents, error: agentsError } = await supabase
      .from('team_members')
      .select('id, name')
      .eq('is_in_lead_rotation', true)
      .eq('status', 'Active')
      .order('id', { ascending: true })

    if (agentsError || !agents || agents.length === 0) {
      console.error('Error fetching agents or no agents in rotation:', agentsError)
      return NextResponse.json({ error: 'Could not find any active agents in the rotation' }, { status: 500 })
    }

    // 2. Get the last assigned agent index
    const { data: setting, error: settingError } = await supabase
      .from('automation_settings')
      .select('value')
      .eq('key', 'last_assigned_agent_index')
      .single()

    if (settingError) {
      console.error('Error fetching automation settings:', settingError)
      return NextResponse.json({ error: 'Could not fetch automation settings' }, { status: 500 })
    }
    
    const lastIndex = (setting.value as {index: number})?.index ?? -1
    const nextIndex = (lastIndex + 1) % agents.length
    const nextAgent = agents[nextIndex]

    // 3. Assign the lead and mark as hot
    const { error: leadUpdateError } = await supabase
      .from('leads')
      .update({ agent_name: nextAgent.name, is_hot: true })
      .eq('id', lead_id)

    if (leadUpdateError) {
      console.error('Error updating lead:', leadUpdateError)
      return NextResponse.json({ error: 'Failed to assign lead' }, { status: 500 })
    }

    // 4. Update the last assigned agent index
    const { error: settingUpdateError } = await supabase
      .from('automation_settings')
      .update({ value: { index: nextIndex } })
      .eq('key', 'last_assigned_agent_index')

    if (settingUpdateError) {
      // If this fails, the assignment still succeeded, but we should log it
      console.error('Critical: Failed to update the round-robin index.', settingUpdateError)
    }

    return NextResponse.json({ 
      success: true, 
      message: `Lead ${lead_id} assigned to agent ${nextAgent.name}` 
    })

  } catch (error) {
    console.error('Error in assign lead route:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
} 