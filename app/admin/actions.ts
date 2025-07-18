// In: app/admin/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function addProblem(formData: FormData) {
  const supabase = await createClient();

  let description;
  try {
    // This will now safely handle bad input
    description = JSON.parse(formData.get('description') as string);
  } catch (e) {
    console.error("Invalid JSON format:", e);
    // In a real app, you'd return a more user-friendly error
    return;
  }

  const problemData = {
    title: formData.get('title') as string,
    difficulty: formData.get('difficulty') as string,
    description: description, // Use the parsed description
  };

  const { error } = await supabase.from('problems').insert(problemData);

  if (error) {
    console.error('Error adding problem:', error);
    return;
  }

  // This line tells Next.js to refresh the data on the admin page
  revalidatePath('/admin');
}