// In: app/session/[id]/code-editor.tsx
'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { submitSolution, logTabSwitch } from '../actions';

// It now accepts problemId and the NEW submissionId
export default function CodeEditor({ problemId, submissionId }: { problemId: number, submissionId: number }) {
  const [code, setCode] = useState('// Your code goes here');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // NEW: This useEffect hook handles tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Tab switched away");
        // Call the server action to log the event
        logTabSwitch(submissionId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [submissionId]); // Rerun if submissionId changes

  const handleRunCode = async () => { /* ... unchanged ... */ };

  const handleSubmit = async () => {
    if (confirm('Are you sure you want to submit?')) {
      setIsLoading(true);
      // The submit action now only needs the submissionId and code
      await submitSolution(submissionId, code);
      setIsLoading(false);
    }
  };

  return (
    // The JSX for the editor and buttons is unchanged...
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Editor part */}
      <div style={{ border: '1px solid #ccc', borderRadius: '5px 5px 0 0', overflow: 'hidden' }}>
        <Editor height="50vh" language="javascript" theme="vs-dark" value={code} onChange={(v) => setCode(v || '')} />
      </div>
      {/* Action buttons area */}
      <div style={{ padding: '10px 0', display: 'flex', gap: '10px' }}>
        <button onClick={handleRunCode} disabled={isLoading}>Run Code</button>
        <button onClick={handleSubmit} disabled={isLoading}>Submit Final Code</button>
      </div>
      {/* Output panel */}
      <div style={{ flexGrow: 1, background: '#1e1e1e', color: '#d4d4d4', padding: '10px' }}>
        <p>Output:</p>
        {output}
      </div>
    </div>
  );
}