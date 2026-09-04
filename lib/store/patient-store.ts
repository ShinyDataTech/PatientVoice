import { PatientProfile, CheckInRecord, RiskLevel, VoiceCheckInMetrics, WoundAssessment, Vitals, ClinicianActionType } from '../types/patient';
import { SEED_PATIENTS } from '../data/seed-patients';
import { evaluateClinicalGuardrails } from '../engine/guardrails';

const STORAGE_KEY = 'patientvoice_patients_state_v1';

// Server-side in-memory cache
let inMemoryPatients: PatientProfile[] = JSON.parse(JSON.stringify(SEED_PATIENTS));

export function getStoredPatients(): PatientProfile[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading from localStorage, using memory store', e);
    }
  }
  return inMemoryPatients;
}

export function savePatients(patients: PatientProfile[]): void {
  inMemoryPatients = patients;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.warn('Error saving to localStorage', e);
    }
  }
}

export function getPatient(patientId: string): PatientProfile | undefined {
  const patients = getStoredPatients();
  return patients.find(p => p.id === patientId || p.mrn === patientId);
}

export function resetSeedStore(): PatientProfile[] {
  const fresh = JSON.parse(JSON.stringify(SEED_PATIENTS));
  savePatients(fresh);
  return fresh;
}

export function addCheckIn(
  patientId: string,
  voiceMetrics: VoiceCheckInMetrics,
  vitals: Vitals,
  woundAssessment?: WoundAssessment
): { patient: PatientProfile; checkIn: CheckInRecord } {
  const patients = getStoredPatients();
  const index = patients.findIndex(p => p.id === patientId);

  if (index === -1) {
    throw new Error(`Patient ${patientId} not found`);
  }

  const patient = patients[index];
  const nextPostOpDay = patient.postOpDay + 1;
  const guardrails = evaluateClinicalGuardrails(voiceMetrics, vitals, woundAssessment);

  let riskLevel: RiskLevel = 'STABLE';
  if (guardrails.isEmergencyOverride || guardrails.actionRequired === 'ER_IMMEDIATE_911' || guardrails.actionRequired === 'URGENT_SURGICAL_EVALUATION') {
    riskLevel = 'CRITICAL';
  } else if (guardrails.actionRequired === 'SAME_DAY_CLINIC_VISIT' || voiceMetrics.painScore >= 6) {
    riskLevel = 'MODERATE';
  }

  // Generate automated SBAR note
  const sbarNote = {
    situation: `${patient.name} (Day ${nextPostOpDay} s/p ${patient.surgeryType}) submitted remote check-in. Urgency status: ${riskLevel}.`,
    background: `${patient.age}yo ${patient.gender} s/p ${patient.surgeryType} on ${patient.surgeryDate}. Surgeon: ${patient.primarySurgeon}.`,
    assessment: `Pain: ${voiceMetrics.painScore}/10 (${voiceMetrics.painTrend}). Mobility: ${voiceMetrics.ambulationFeetToday}ft (${voiceMetrics.mobilityStatus}). Temp: ${vitals.temperatureF}°F. Meds: ${voiceMetrics.medicationAdherence}. Wound Erythema: ${woundAssessment?.erythemaMarginMm ?? 4}mm.`,
    recommendation: guardrails.isEmergencyOverride 
      ? `EMERGENCY DISPATCH: ${guardrails.emergencyDirective}` 
      : riskLevel === 'MODERATE' 
        ? 'Contact patient for clinical review and medication/wound check.' 
        : 'Continue scheduled physical therapy and remote monitoring.'
  };

  const aiSummary = guardrails.isEmergencyOverride
    ? `EMERGENCY OVERRIDE: ${guardrails.emergencyTitle}. ${guardrails.emergencyDirective}`
    : `Day ${nextPostOpDay} check-in completed. Pain at ${voiceMetrics.painScore}/10 with ${voiceMetrics.ambulationFeetToday}ft ambulation. Risk classification: ${riskLevel}.`;

  const newCheckIn: CheckInRecord = {
    id: `chk-${patient.id}-d${nextPostOpDay}-${Date.now().toString().slice(-4)}`,
    patientId: patient.id,
    timestamp: new Date().toISOString(),
    postOpDay: nextPostOpDay,
    riskLevel,
    vitals,
    voiceMetrics,
    woundAssessment,
    guardrails,
    aiSummary,
    sbarNote
  };

  const updatedPatient: PatientProfile = {
    ...patient,
    postOpDay: nextPostOpDay,
    status: riskLevel,
    activeAlertCount: riskLevel === 'CRITICAL' ? 3 : riskLevel === 'MODERATE' ? 2 : 0,
    latestCheckIn: newCheckIn,
    historyCheckIns: [...patient.historyCheckIns, newCheckIn]
  };

  patients[index] = updatedPatient;
  savePatients(patients);

  return { patient: updatedPatient, checkIn: newCheckIn };
}

export function logClinicianAction(
  patientId: string,
  actionType: ClinicianActionType,
  nurseName: string,
  notes: string,
  resolveAlert: boolean = true
): PatientProfile {
  const patients = getStoredPatients();
  const index = patients.findIndex(p => p.id === patientId);

  if (index === -1) throw new Error(`Patient ${patientId} not found`);

  const patient = patients[index];
  const latest = patient.latestCheckIn;

  const actionTaken = {
    actionType,
    nurseName,
    actionTimestamp: new Date().toISOString(),
    notes
  };

  const updatedLatest: CheckInRecord | undefined = latest ? {
    ...latest,
    clinicianActionTaken: actionTaken,
    riskLevel: resolveAlert ? 'STABLE' : latest.riskLevel
  } : undefined;

  const updatedPatient: PatientProfile = {
    ...patient,
    status: resolveAlert ? 'STABLE' : patient.status,
    activeAlertCount: resolveAlert ? 0 : Math.max(0, patient.activeAlertCount - 1),
    latestCheckIn: updatedLatest
  };

  patients[index] = updatedPatient;
  savePatients(patients);
  return updatedPatient;
}
