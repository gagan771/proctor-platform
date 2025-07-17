'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the Verification component with SSR disabled
const Verification = dynamic(() => import('./verification'), { ssr: false });

// This wrapper component ensures the dynamic import only runs on the client
export default function VerificationClient(props: { sessionId: string; referenceImageUrl: string }) {
  return <Verification {...props} />;
} 