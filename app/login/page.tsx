// In: app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // <-- Import our NEW client helper

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClient(); // <-- Use the new helper

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Error logging in: ' + error.message);
    } else {
      // This line is important to ensure the page reloads with the new session
      router.refresh();
      router.push('/admin');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '96px auto', fontFamily: 'sans-serif' }}>
      <h3>Log In to Your Account</h3>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }}
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }}
      />
      <button onClick={handleSignIn} style={{ width: '100%', padding: '10px', background: '#333', color: '#fff', border: 'none' }}>
        Sign In
      </button>
    </div>
  );
}