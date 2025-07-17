// In: app/exam/[id]/page.tsx
import Verification from "./verification";

export default function ExamEntryPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ maxWidth: '600px', margin: '96px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Exam Identity Verification</h2>
      <p>Please position your face clearly in the camera view below and take a picture to begin your exam.</p>
      <hr style={{ margin: '20px 0' }} />
      <Verification sessionId={params.id} />
    </div>
  );
}