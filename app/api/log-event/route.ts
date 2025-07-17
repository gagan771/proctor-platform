// In: app/api/log-event/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log("--- /api/log-event endpoint hit ---"); // DEBUG
  
  const supabase = createClient();
  
  // First, check if there's a logged-in user for this request
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log("No user found. Unauthorized."); // DEBUG
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  console.log("User found:", user.id); // DEBUG

  // Get the data sent from the editor component
  const { submissionId, eventType } = await request.json();
  console.log("Received data:", { submissionId, eventType }); // DEBUG

  // Basic validation
  if (!submissionId || !eventType) {
    return NextResponse.json({ error: 'Missing submissionId or eventType' }, { status: 400 });
  }

  // Insert the new log into the proctoring_logs table
  const { error } = await supabase.from('proctoring_logs').insert({
    submission_id: submissionId,
    user_id: user.id,
    event_type: eventType,
  });

  if (error) {
    console.error('Error logging event:', error);
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
  }

  console.log("Event logged successfully!"); // DEBUG
  // Send a success response back to the client
  return NextResponse.json({ success: true });
}