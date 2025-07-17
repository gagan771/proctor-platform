// In: app/session/[id]/code-editor.tsx
'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { submitSolution } from '../actions'; // <-- This path is now correct

export default function CodeEditor({ problemId }: { problemId: number }) {
  const [code, setCode] = useState('// JavaScript code goes here\nconsole.log("Hello, World!");');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleEditorChange(value: string | undefined) {
    setCode(value || '');
  }

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput('');
    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, language_id: 63 }),
      });
      const data = await response.json();
      if (data.stdout) { setOutput(data.stdout); } 
      else if (data.stderr) { setOutput(`Error: ${data.stderr}`); }
      else { setOutput('Execution finished with no output.'); }
    } catch (error) {
      setOutput('Failed to connect to the execution server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (confirm('Are you sure you want to submit? This action cannot be undone.')) {
      setIsLoading(true);
      await submitSolution(problemId, code, 63);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '5px 5px 0 0', overflow: 'hidden' }}>
        <div style={{ background: '#333', color: '#fff', padding: '5px 10px' }}>
          JavaScript Editor
        </div>
        <Editor height="50vh" language="javascript" theme="vs-dark" value={code} onChange={handleEditorChange} />
      </div>
      <div style={{ padding: '10px 0', display: 'flex', gap: '10px' }}>
        <button onClick={handleRunCode} disabled={isLoading} style={{ padding: '10px 15px' }}>
          {isLoading ? 'Running...' : 'Run Code'}
        </button>
        <button onClick={handleSubmit} disabled={isLoading} style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none' }}>
          {isLoading ? 'Submitting...' : 'Submit Final Code'}
        </button>
      </div>
      <div style={{ flexGrow: 1, background: '#1e1e1e', color: '#d4d4d4', padding: '10px', fontFamily: 'monospace', borderRadius: '0 0 5px 5px', whiteSpace: 'pre-wrap' }}>
        <p style={{ margin: 0, padding: 0, fontWeight: 'bold' }}>Output:</p>
        {output}
      </div>
    </div>
  );
}