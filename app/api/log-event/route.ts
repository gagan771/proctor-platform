// In: app/api/log-event/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { submissionId, eventType } = await request.json();
    
    if (!submissionId || !eventType) {
      return NextResponse.json({ error: 'Missing submissionId or eventType' }, { status: 400 });
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from('session_events')
      .insert({
        submission_id: submissionId,
        event_type: eventType,
      });

    if (error) {
      console.error('Error logging event:', error);
      return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in log-event API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}