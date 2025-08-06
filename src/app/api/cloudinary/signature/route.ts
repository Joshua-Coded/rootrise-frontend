import { NextResponse } from "next/server";
import { generateSignature } from "../../../../../lib/cloudinary/config";

// app/api/cloudinary/signature/route.ts

export async function GET() {
  try {
    const { signature, timestamp } = generateSignature();
    return NextResponse.json({ signature, timestamp });
  } catch (error) {
    console.error('Signature generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}