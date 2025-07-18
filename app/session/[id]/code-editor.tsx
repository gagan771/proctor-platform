// In: app/session/[id]/code-editor.tsx
'use client';

import { useState, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { submitSolution, logSessionEvent } from '../actions';

// Define the structure for the boilerplate prop
interface Boilerplate {
  [key: string]: string;
}

// Map our language names to Judge0's language IDs
const languageMap: { [key: string]: number } = {
  "bash": 46,
  "basic": 47,
  "c": 50,
  "c++": 54,
  "c#": 51,
  "clojure": 86,
  "cobol": 77,
  "common-lisp": 55,
  "d": 56,
  "dart": 57,
  "elixir": 58,
  "erlang": 59,
  "executable": 44,
  "fortran": 87,
  "go": 60,
  "groovy": 88,
  "haskell": 61,
  "java": 62,
  "javascript": 63,
  "kotlin": 78,
  "lua": 64,
  "objective-c": 79,
  "ocaml": 65,
  "octave": 66,
  "pascal": 67,
  "perl": 85,
  "php": 68,
  "prolog": 69,
  "python": 71,
  "r": 80,
  "ruby": 72,
  "rust": 73,
  "scala": 81,
  "sql": 82,
  "swift": 83,
  "typescript": 74,
  "vb.net": 84
};

// The component prop for boilerplateCode is now optional
export default function CodeEditor({ 
  problemId, 
  submissionId, 
  boilerplateCode, 
  initialCode 
}: { 
  problemId: number, 
  submissionId: number, 
  boilerplateCode?: Boilerplate | null,
  initialCode?: string 
}) {
  const safeBoilerplate = boilerplateCode || {};
  
  // Default to JavaScript if no languages are available from boilerplate
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(initialCode || safeBoilerplate[language] || '// Your code goes here');
  
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Proctoring hooks remain unchanged...
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log('Visibility changed, document.hidden:', document.hidden);
      if (document.hidden && submissionId) {
        console.log('Tab switch detected, logging event...');
        logSessionEvent(submissionId, 'tab_switch');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [submissionId]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      if (submissionId) {
        logSessionEvent(submissionId, 'copy_attempt');
      }
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      if (submissionId) {
        logSessionEvent(submissionId, 'paste_attempt');
      }
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    // Use safeBoilerplate to prevent errors
    setCode(safeBoilerplate[newLanguage] || `// Write your ${newLanguage} code here`);
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput('');
    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, language_id: languageMap[language] }),
      });
      const data = await response.json();
      if (data.stdout) setOutput(data.stdout);
      else if (data.stderr) setOutput(`Error: ${data.stderr}`);
      else setOutput('Execution finished with no output.');
    } catch (error) {
      setOutput('Failed to connect to the execution server.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    if (confirm('Are you sure you want to submit?')) {
      setIsLoading(true);
      // Pass only the required parameters
      await submitSolution(submissionId, code);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '5px 5px 0 0', overflow: 'hidden' }}>
        <div style={{ background: '#333', color: '#fff', padding: '5px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Editor</span>
          <select value={language} onChange={handleLanguageChange} style={{ background: '#555', color: 'white', border: 'none', padding: '2px' }}>
            {/* THE FIX: Iterate over the full languageMap to show all supported languages */}
            {Object.keys(languageMap).map(lang => (
              <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
            ))}
          </select>
        </div>
        <Editor
          height="50vh"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v || '')}
          onMount={handleEditorDidMount}
        />
      </div>
      <div style={{ padding: '10px 0', display: 'flex', gap: '10px' }}>
        <button onClick={handleRunCode} disabled={isLoading}>Run Code</button>
        <button onClick={handleSubmit} disabled={isLoading}>Submit Final Code</button>
      </div>
      <div style={{ flexGrow: 1, background: '#1e1e1e', color: '#d4d4d4', padding: '10px' }}>
        <p>Output:</p>
        {output}
      </div>
    </div>
  );
}