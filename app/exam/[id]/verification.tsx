// In: app/exam/[id]/verification.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as faceapi from 'face-api.js';

export default function Verification({ sessionId }: { sessionId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [feedback, setFeedback] = useState('Please wait, loading AI models...');

  // This would come from the user's profile in a real app
  const referenceImageUrl = '/path-to-your-reference-id-photo.jpg';

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      ]);
      startVideo();
      setFeedback('Position your face in the camera and take a picture.');
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(err => console.error("Error accessing webcam:", err));
  };

  const handleVerification = async () => {
    setFeedback('Verifying...');

    // 1. Load the reference image from the user's profile
    const referenceImage = await faceapi.fetchImage(referenceImageUrl);
    const referenceResult = await faceapi.detectSingleFace(referenceImage).withFaceLandmarks().withFaceDescriptor();

    if (!referenceResult) {
      setFeedback('Could not find a face in the reference ID photo.');
      return;
    }

    // 2. Take snapshot from the live video
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const liveResult = await faceapi.detectSingleFace(canvas).withFaceLandmarks().withFaceDescriptor();

      if (!liveResult) {
        setFeedback('Could not detect a face in the live video. Please try again.');
        return;
      }

      // 3. Compare the two faces
      const faceMatcher = new faceapi.FaceMatcher(referenceResult);
      const bestMatch = faceMatcher.findBestMatch(liveResult.descriptor);

      if (bestMatch.label === 'person 1' && bestMatch.distance < 0.5) {
        setFeedback('✅ Verification Successful!');
        setIsVerified(true);
      } else {
        setFeedback('❌ Verification Failed. Faces do not match. Please try again.');
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: '500px' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <p><strong>Status:</strong> {feedback}</p>

      {!isVerified ? (
        <button onClick={handleVerification} style={{ width: '100%', maxWidth: '500px', padding: '10px', marginTop: '10px' }}>
          Verify My Identity
        </button>
      ) : (
        <Link href={`/session/${sessionId}`} style={{ display: 'block', textAlign: 'center', background: '#28a745', color: 'white', padding: '15px', textDecoration: 'none', borderRadius: '5px' }}>
          Proceed to Exam
        </Link>
      )}
    </div>
  );
}