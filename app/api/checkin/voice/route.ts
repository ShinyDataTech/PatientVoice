import { NextRequest, NextResponse } from 'next/server';
import { analyzeVoiceTranscript } from '@/lib/engine/ai-analyzer';
import { addCheckIn, getPatient } from '@/lib/store/patient-store';
import { Vitals } from '@/lib/types/patient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientId, transcript, vitals, woundAssessment } = body;

    if (!patientId || !transcript) {
      return NextResponse.json(
        { error: 'Missing required fields: patientId and transcript are required' },
        { status: 400 }
      );
    }

    const patient = getPatient(patientId);
    if (!patient) {
      return NextResponse.json(
        { error: `Patient with ID ${patientId} not found` },
        { status: 404 }
      );
    }

    // 1. Analyze voice transcript to extract clinical metrics
    const voiceMetrics = analyzeVoiceTranscript(transcript, patient.postOpDay + 1);

    // 2. Default vitals if not supplied
    const patientVitals: Vitals = vitals || {
      temperatureF: 98.6,
      heartRateBpm: 75,
      oxygenSatPercent: 98
    };

    // 3. Process check-in through guardrails and store
    const result = addCheckIn(patientId, voiceMetrics, patientVitals, woundAssessment);

    return NextResponse.json({
      success: true,
      patient: result.patient,
      checkIn: result.checkIn,
      isEmergency: result.checkIn.guardrails.isEmergencyOverride,
      actionRequired: result.checkIn.guardrails.actionRequired
    });
  } catch (error: any) {
    console.error('Error in /api/checkin/voice:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing voice check-in' },
      { status: 500 }
    );
  }
}
