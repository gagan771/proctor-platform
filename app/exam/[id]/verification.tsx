// In: app/exam/[id]/verification-client.tsx
'use client';

import dynamic from 'next/dynamic';

// This dynamically imports the verification component, disabling Server-Side Rendering (SSR).
const VerificationComponent = dynamic(() => import('./verification'), {
  ssr: false,
  loading: () => <p>Loading Camera and AI Models...</p> // Display a loading message
});

// This wrapper component simply passes the props down to the real component.
export default function VerificationClient({ sessionId, referenceImageUrl }: { sessionId: string, referenceImageUrl: string }) {
  return <VerificationComponent sessionId={sessionId} referenceImageUrl={referenceImageUrl} />;
}