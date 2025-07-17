// In: app/exam/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function submitSolution(
  problemId: number,
  code: string,
  languageId: number
) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to submit.' };
  }

  const submissionData = {
    user_id: user.id,
    problem_id: problemId,
    code: code,
    language_id: languageId,
    status: 'submitted', // Set an initial status
  };

  const { error } = await supabase.from('submissions').insert(submissionData);

  if (error) {
    console.error('Error submitting solution:', error);
    return { error: 'Failed to save submission.' };
  }

  // On success, redirect to a completion page
  redirect('/exam/completed');
}