// In: app/admin/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AddProblemForm from './add-problem-form';
import Link from 'next/link';

export default async function AdminPage() {
  const supabase = createClient();

  // Check for user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch all problems from the database
  const { data: problems } = await supabase.from('problems').select('*');

  return (
    <div style={{ maxWidth: '800px', margin: '96px auto', fontFamily: 'sans-serif' }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.email}</p>
      
      <hr style={{ margin: '20px 0' }} />

      <h3>Existing Problems</h3>
      <ul>
        {problems?.map((problem) => (
          <li key={problem.id}>
            {/* This link now points directly to the exam session, skipping verification */}
            <Link href={`/session/${problem.id}`} style={{ color: '#0070f3', textDecoration: 'underline' }}>
              {problem.title}
            </Link>
            {' '}- <strong>{problem.difficulty}</strong>
          </li>
        ))}
      </ul>
      
      {/* Add the form component to the page */}
      <AddProblemForm />
    </div>
  );
}
