// In: app/session/[id]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import CodeEditor from './code-editor';

export const revalidate = 0;

export default async function ProblemPage({ params }: { params: { id: string } }) {
  // The FIX: Destructure 'id' from params right away.
  const { id } = params;
  const supabase = createClient();

  const { data: problem } = await supabase
    .from('problems')
    .select('*')
    .eq('id', id) // <-- Use the 'id' variable here
    .single();

  if (!problem) {
    notFound();
  }

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'sans-serif', height: 'calc(100vh - 40px)' }}>
      {/* Left Panel: Problem Description */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h1>{problem.title}</h1>
        <p><strong>Difficulty:</strong> {problem.difficulty}</p>
        <hr style={{ margin: '20px 0' }} />
        {/* ... rest of the description rendering ... */}
        <div><p>{problem.description.main}</p></div>
      </div>
      {/* Right Panel: Code Editor */}
      <div style={{ flex: 1 }}>
        <CodeEditor problemId={problem.id} />
      </div>
    </div>
  );
}