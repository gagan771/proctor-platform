// In: app/exam/[id]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import CodeEditor from './code-editor';

// This tells Next.js to not cache this page, so it's always fresh
export const revalidate = 0;

export default async function ProblemPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  // Fetch the specific problem using the ID from the URL
  const { data: problem } = await supabase
    .from('problems')
    .select('*')
    .eq('id', params.id)
    .single(); // .single() gets one record, or null if not found

  // If no problem is found, show a 404 page
  if (!problem) {
    notFound();
  }

  // Main container with Flexbox layout
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'sans-serif', height: 'calc(100vh - 40px)' }}>
      
      {/* Left Panel: Problem Description */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h1>{problem.title}</h1>
        <p><strong>Difficulty:</strong> {problem.difficulty}</p>
        <hr style={{ margin: '20px 0' }} />
        <div>
          <p>{problem.description.main}</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h4>Examples</h4>
          {problem.description.examples.map((example: any, index: number) => (
            <div key={index} style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
              <p><strong>Input:</strong> <code>{example.input}</code></p>
              <p><strong>Output:</strong> <code>{example.output}</code></p>
              {example.explanation && <p><small><em>{example.explanation}</em></small></p>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px' }}>
          <h4>Constraints</h4>
          <ul>
            {problem.description.constraints.map((constraint: any, index: number) => (
              <li key={index}><code>{constraint}</code></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel: Code Editor */}
      <div style={{ flex: 1 }}>
        <CodeEditor problemId={problem.id} />
      </div>

    </div>
  );
}