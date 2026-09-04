import { NextRequest, NextResponse } from 'next/server';
import { logClinicianAction, getPatient } from '@/lib/store/patient-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientId, actionType, nurseName, notes, resolveAlert = true } = body;

    if (!patientId || !actionType) {
      return NextResponse.json(
        { error: 'Missing required parameters: patientId and actionType are required' },
        { status: 400 }
      );
    }

    const patient = getPatient(patientId);
    if (!patient) {
      return NextResponse.json(
        { error: `Patient ${patientId} not found` },
        { status: 404 }
      );
    }

    const updatedPatient = logClinicianAction(
      patientId,
      actionType,
      nurseName || 'RN On-Call Triage Specialist',
      notes || `Clinical action logged: ${actionType}`,
      resolveAlert
    );

    return NextResponse.json({
      success: true,
      patient: updatedPatient,
      message: `Action '${actionType}' logged and patient triage status updated.`
    });
  } catch (error: any) {
    console.error('Error in /api/clinician/resolve:', error);
    return NextResponse.json(
      { error: error.message || 'Error resolving clinical alert' },
      { status: 500 }
    );
  }
}
