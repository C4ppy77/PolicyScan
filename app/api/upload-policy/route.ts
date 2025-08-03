import { getPolicyDataFromImage } from '@/app/services/geminiService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('policyImage') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Convert the file to a Buffer, which is what our service expects
    const imageBuffer = Buffer.from(await file.arrayBuffer());

    // Call the Gemini service with the image buffer and its MIME type
    const policyData = await getPolicyDataFromImage(imageBuffer, file.type);

    // On success, return the structured data from Gemini
    return NextResponse.json(policyData, { status: 200 });

  } catch (error: any) {
    // If anything goes wrong, return a generic error message
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}