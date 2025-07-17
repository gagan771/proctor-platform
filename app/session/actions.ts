// In: app/session/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// This action now UPDATES the submission record with the final code
export async function submitSolution(submissionId: number, code: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('submissions')
    .update({ code: code, status: 'submitted', completed_at: new Date().toISOString() })
    .eq('id', submissionId);

  if (error) { console.error('Error updating submission:', error); return; }

  redirect('/exam/completed');
}

// NEW: This action logs a tab switch event
export async function logTabSwitch(submissionId: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('proctoring_logs').insert({
    submission_id: submissionId,
    user_id: user.id,
    event_type: 'tab_switch',
  });
}