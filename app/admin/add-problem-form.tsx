// In: app/admin/add-problem-form.tsx
'use client';

import { addProblem } from './actions';

export default function AddProblemForm() {
  return (
    <form action={addProblem} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '20px' }}>
      <h4>Add New Problem</h4>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title</label>
        <input type="text" id="title" name="title" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="difficulty" style={{ display: 'block', marginBottom: '5px' }}>Difficulty</label>
        <select id="difficulty" name="difficulty" required style={{ width: '100%', padding: '8px' }}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description (JSON)</label>
        <textarea id="description" name="description" rows={5} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder='{ "main": "Your problem description here..." }'></textarea>
      </div>
      <button type="submit" style={{ padding: '10px 15px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Add Problem
      </button>
    </form>
  );
}