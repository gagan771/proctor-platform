import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import CodeEditor from './code-editor';

export const dynamic = 'force-dynamic';

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: problemId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: problem } = await supabase
    .from('problems')
    .select('*')
    .eq('id', problemId)
    .single();
    
  if (!problem) {
    notFound();
  }

  // Check if user already has a submission for this problem
  const { data: existingSubmissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', user.id)
    .eq('problem_id', problem.id);

  let submission = existingSubmissions?.[0]; // Get the first existing submission

  if (!submission) {
    // Create new submission with default code and language_id
    const { data: newSubmission, error } = await supabase
      .from('submissions')
      .insert({
        user_id: user.id,
        problem_id: problem.id,
        code: problem.boilerplate_code || '', // Provide default code
        language_id: 63, // JavaScript language ID from Judge0
        status: 'started',
      })
      .select()
      .single();

    if (error || !newSubmission) {
      console.error("Error creating submission:", error);
      return <p>Error: Could not start the exam session. Please go back and try again.</p>;
    }
    
    submission = newSubmission;
  }

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'sans-serif', height: 'calc(100vh - 40px)' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h1>{problem.title}</h1>
        <p><strong>Difficulty:</strong> {problem.difficulty}</p>
        <hr style={{ margin: '20px 0' }} />
        <p>{problem.description.main}</p>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1 }}>
        <CodeEditor 
          problemId={problem.id} 
          submissionId={submission.id} 
          boilerplateCode={submission.code || problem.boilerplate_code} 
        />
      </div>
    </div>
  );
}