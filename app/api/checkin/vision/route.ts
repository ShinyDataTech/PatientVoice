import { NextRequest, NextResponse } from 'next/server';
import { analyzeWoundImage } from '@/lib/engine/ai-analyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, patientArchetype } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Wound image data or URL is required' },
        { status: 400 }
      );
    }

    const assessment = analyzeWoundImage(image, patientArchetype);

    return NextResponse.json({
      success: true,
      assessment
    });
  } catch (error: any) {
    console.error('Error in /api/checkin/vision:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing wound computer vision evaluation' },
      { status: 500 }
    );
  }
}
