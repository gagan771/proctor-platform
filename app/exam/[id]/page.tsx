// In: app/exam/[id]/page.tsx
import VerificationClient from './VerificationClient';

// The FIX: Removed the 'async' keyword from the function definition.
export default function ExamEntryPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const localReferenceImageUrl = "/my-face.jpg"; 

  return (
    <div style={{ maxWidth: '600px', margin: '96px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Exam Identity Verification</h2>
      <p>Please position your face clearly in the camera view below.</p>
      <hr style={{ margin: '20px 0' }} />

      <VerificationClient 
        sessionId={id}
        referenceImageUrl={localReferenceImageUrl} 
      />
    </div>
  );
}