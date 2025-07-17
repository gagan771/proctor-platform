// In: app/session/[id]/code-editor.tsx
'use client';

import { useState, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { submitSolution } from '../actions';

export default function CodeEditor({ problemId, submissionId }: { problemId: number, submissionId: number }) {
  const [code, setCode] = useState('// Your code goes here');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tab-switch detection hook
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Log the event using our API route
        fetch('/api/log-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionId: submissionId, eventType: 'tab_switch' }),
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [submissionId]);

  // This function runs when the editor is ready
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Block Ctrl+C, Cmd+C (copy)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      fetch('/api/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: submissionId, eventType: 'copy_attempt' }),
      });
    });

    // Block Ctrl+V, Cmd+V (paste)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      fetch('/api/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: submissionId, eventType: 'paste_attempt' }),
      });
    });
  };


  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput('');
    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, language_id: 63 }), // 63 is JavaScript
      });
      const data = await response.json();
      if (data.stdout) {
        setOutput(data.stdout);
      } else if (data.stderr) {
        setOutput(`Error: ${data.stderr}`);
      } else {
        setOutput('Execution finished with no output.');
      }
    } catch (error) {
      setOutput('Failed to connect to the execution server.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    if (confirm('Are you sure you want to submit? This action cannot be undone.')) {
      setIsLoading(true);
      await submitSolution(submissionId, code);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '5px 5px 0 0', overflow: 'hidden' }}>
        <div style={{ background: '#333', color: '#fff', padding: '5px 10px' }}>
          JavaScript Editor
        </div>
        <Editor
          height="50vh"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v || '')}
          onMount={handleEditorDidMount}
        />
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