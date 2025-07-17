// In: app/api/run-code/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, language_id } = await request.json();

    // The FIX is in the line below: using a template literal (`) instead of a regular string.
    const response = await fetch(`https://` + process.env.JUDGE0_API_HOST + `/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY!,
        'X-RapidAPI-Host': process.env.JUDGE0_API_HOST!,
      },
      body: JSON.stringify({
        source_code: code,
        language_id: language_id,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    // Added better error logging for debugging
    console.error("Error in /api/run-code:", error.message);
    return NextResponse.json({ error: 'Failed to run code' }, { status: 500 });
  }
}