import { NextRequest, NextResponse } from 'next/server';
import { getStoredPatients, resetSeedStore } from '@/lib/store/patient-store';

export async function GET(req: NextRequest) {
  try {
    const patients = getStoredPatients();

    // Sort by risk priority: CRITICAL first, then MODERATE, then STABLE
    const priorityOrder: Record<string, number> = {
      CRITICAL: 1,
      MODERATE: 2,
      STABLE: 3
    };

    const sortedPatients = [...patients].sort((a, b) => {
      const pA = priorityOrder[a.status] || 99;
      const pB = priorityOrder[b.status] || 99;
      if (pA !== pB) return pA - pB;
      return b.activeAlertCount - a.activeAlertCount;
    });

    return NextResponse.json({
      success: true,
      patients: sortedPatients,
      summary: {
        total: sortedPatients.length,
        criticalCount: sortedPatients.filter(p => p.status === 'CRITICAL').length,
        moderateCount: sortedPatients.filter(p => p.status === 'MODERATE').length,
        stableCount: sortedPatients.filter(p => p.status === 'STABLE').length
      }
    });
  } catch (error: any) {
    console.error('Error in /api/clinician/patients:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch clinician triage feed' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === 'reset') {
      const freshPatients = resetSeedStore();
      return NextResponse.json({
        success: true,
        message: 'Successfully reset database to clinical seed profiles',
        patients: freshPatients
      });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
