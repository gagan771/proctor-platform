// In: app/session/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function logSessionEvent(submissionId: number, eventType: string) {
  try {
    console.log(`Logging event: ${eventType} for submission: ${submissionId}`);
    const supabase = await createClient();
    
    const { error } = await supabase.from('session_events').insert({
      submission_id: submissionId,
      event_type: eventType,
    });

    if (error) {
      console.error('Error logging session event:', error);
    } else {
      console.log(`Successfully logged ${eventType} event`);
    }
  } catch (error) {
    console.error('Exception in logSessionEvent:', error);
  }
}

export async function submitSolution(submissionId: number, code: string) {
  const supabase = await createClient();
  await supabase
    .from('submissions')
    .update({ code: code, status: 'submitted' })
    .eq('id', submissionId);
}

// NEW: This action logs a tab switch event
export async function logTabSwitch(submissionId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('proctoring_logs').insert({
    submission_id: submissionId,
    user_id: user.id,
    event_type: 'tab_switch',
  });
}