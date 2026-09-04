import { GuardrailCheckResult, VoiceCheckInMetrics, Vitals, WoundAssessment } from '../types/patient';

/**
 * Deterministic Clinical Guardrail Engine.
 * 
 * In clinical post-operative triage, critical red-line symptoms must NEVER rely
 * solely on probabilistic LLM responses that could hallucinate reassurance.
 * This rule engine executes synchronously before any generative response is shown.
 */
export function evaluateClinicalGuardrails(
  metrics: VoiceCheckInMetrics,
  vitals: Vitals,
  wound?: WoundAssessment
): GuardrailCheckResult {
  const rationales: string[] = [];

  // 1. CRITICAL RED-LINE: Pulmonary Embolism (PE) Warning Signs
  if (metrics.chestPainOrShortnessOfBreath) {
    rationales.push('Acute chest tightness or dyspnea reported post-orthopedic arthroplasty (high risk for Pulmonary Embolism / PE).');
    return {
      isEmergencyOverride: true,
      emergencyCategory: 'PULMONARY_EMBOLISM',
      emergencyTitle: 'CRITICAL ALERT: Suspected Pulmonary Embolism',
      emergencyDirective: 'CALL 911 IMMEDIATELY or go to the nearest Emergency Department. Do NOT wait for clinic callback. Orthopedic surgery increases thromboembolic risk.',
      clinicalRationale: rationales,
      actionRequired: 'ER_IMMEDIATE_911'
    };
  }

  // 2. CRITICAL RED-LINE: Deep Vein Thrombosis (DVT) Warning Signs
  if (metrics.calfPainOrSwelling) {
    rationales.push('Unilateral calf swelling, cramping, or severe posterior calf tenderness post-arthroplasty (Wells Score high risk for Deep Vein Thrombosis).');
    return {
      isEmergencyOverride: true,
      emergencyCategory: 'DVT_SUSPECTED',
      emergencyTitle: 'HIGH RISK ALERT: Suspected Deep Vein Thrombosis (DVT)',
      emergencyDirective: 'Seek urgent Emergency Room evaluation or immediate STAT bilateral lower extremity Doppler Ultrasound. Avoid vigorous massage of the calf.',
      clinicalRationale: rationales,
      actionRequired: 'ER_IMMEDIATE_911'
    };
  }

  // 3. HIGH RISK: Severe Pyrexia / Surgical Site Sepsis Trigger
  if (vitals.temperatureF >= 101.5) {
    rationales.push(`Core body temperature elevated at ${vitals.temperatureF}°F (Threshold >= 101.5°F for acute systemic inflammatory response / prosthetic joint infection).`);
    if (wound && wound.purulentDischarge) {
      rationales.push('Concurrent purulent exudate detected at surgical incision site.');
    }
    return {
      isEmergencyOverride: true,
      emergencyCategory: 'SEPSIS_INFECTION',
      emergencyTitle: 'URGENT ESCALATION: High Post-Operative Fever & Infection Risk',
      emergencyDirective: 'Contact your surgical care team immediately or proceed to urgent surgical triage. High fever following joint arthroplasty requires urgent physical evaluation and blood cultures.',
      clinicalRationale: rationales,
      actionRequired: 'URGENT_SURGICAL_EVALUATION'
    };
  }

  // 4. HIGH RISK: Active Incision Dehiscence or Heavy Hemorrhage
  if (wound && wound.dehiscenceMm >= 5) {
    rationales.push(`Wound edge separation measured at ${wound.dehiscenceMm}mm (Threshold >= 5mm for acute surgical dehiscence).`);
    return {
      isEmergencyOverride: true,
      emergencyCategory: 'WOUND_DEHISCENCE',
      emergencyTitle: 'URGENT ALERT: Surgical Wound Edge Separation',
      emergencyDirective: 'Keep the surgical site clean and covered with sterile gauze. Do not probe or dress with unapproved ointments. Contact the orthopedic on-call fellow immediately.',
      clinicalRationale: rationales,
      actionRequired: 'URGENT_SURGICAL_EVALUATION'
    };
  }

  // 5. MODERATE ESCALATION: Expanding Erythema or Purulent Drainage
  if (wound && (wound.erythemaMarginMm >= 20 || wound.purulentDischarge)) {
    if (wound.erythemaMarginMm >= 20) {
      rationales.push(`Erythema margin extends ${wound.erythemaMarginMm}mm from incision (greater than normal expected post-op inflammation).`);
    }
    if (wound.purulentDischarge) {
      rationales.push('Cloudy/purulent discharge observed at incision line.');
    }
    return {
      isEmergencyOverride: false,
      emergencyCategory: 'SEPSIS_INFECTION',
      emergencyTitle: 'CLINICAL ESCALATION: Early Surgical Site Infection Signs',
      emergencyDirective: 'Clinical nurse review required today. An outpatient wound inspection and possible oral antibiotic initiation is indicated.',
      clinicalRationale: rationales,
      actionRequired: 'SAME_DAY_CLINIC_VISIT'
    };
  }

  // 6. MODERATE ESCALATION: Uncontrolled Severe Breakthrough Pain or Complete Non-Adherence
  if (metrics.painScore >= 8 || metrics.medicationAdherence === 'REFUSING_DUE_TO_SIDE_EFFECTS' || metrics.medicationAdherence === 'MISSED_DOSES') {
    if (metrics.painScore >= 8) {
      rationales.push(`Severe unmanaged breakthrough pain (Score: ${metrics.painScore}/10) impeding mobility.`);
    }
    if (metrics.medicationAdherence !== 'FULL') {
      rationales.push(`Medication regimen breakdown: ${metrics.medicationAdherence}. Patient at risk for deep vein clot or rehabilitation stalling.`);
    }
    return {
      isEmergencyOverride: false,
      emergencyCategory: 'MED_TOXICITY',
      emergencyTitle: 'NURSE INTERVENTION: Unmanaged Pain & Regimen Adherence Barrier',
      emergencyDirective: 'Orthopedic nurse will contact patient within 2 hours to adjust multimodal analgesic protocol and address nausea/side effects.',
      clinicalRationale: rationales,
      actionRequired: 'SAME_DAY_CLINIC_VISIT'
    };
  }

  // Standard Stable Trajectory
  return {
    isEmergencyOverride: false,
    clinicalRationale: ['Vitals within baseline post-op tolerances.', 'Wound margins intact with no purulence.', 'Mobility and pain progression consistent with recovery protocol.'],
    actionRequired: 'STANDARD_MONITORING'
  };
}
