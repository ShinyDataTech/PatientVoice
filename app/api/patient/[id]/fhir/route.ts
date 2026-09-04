import { NextRequest, NextResponse } from 'next/server';
import { getPatient } from '@/lib/store/patient-store';
import { generateFHIRBundle } from '@/lib/fhir/exporter';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    const patient = getPatient(patientId);

    if (!patient) {
      return NextResponse.json(
        { error: `Patient with ID ${patientId} not found` },
        { status: 404 }
      );
    }

    const bundle = generateFHIRBundle(patient);

    return NextResponse.json(bundle, {
      status: 200,
      headers: {
        'Content-Type': 'application/fhir+json',
        'Content-Disposition': `inline; filename="fhir-bundle-${patient.mrn}.json"`
      }
    });
  } catch (error: any) {
    console.error('Error generating FHIR export:', error);
    return NextResponse.json(
      { error: error.message || 'Error generating FHIR bundle' },
      { status: 500 }
    );
  }
}
