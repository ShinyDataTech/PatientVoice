export type RiskLevel = 'STABLE' | 'MODERATE' | 'CRITICAL';

export type SurgeryType = 
  | 'Total Knee Arthroplasty (TKA)'
  | 'Total Hip Arthroplasty (THA)'
  | 'Spinal Lumbar Decompression'
  | 'Anterior Cruciate Ligament (ACL) Reconstruction';

export interface Vitals {
  temperatureF: number;
  heartRateBpm?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSatPercent?: number;
}

export interface WoundAssessment {
  imageUrl?: string;
  baselineImageUrl?: string;
  erythemaMarginMm: number; // redness distance from incision
  erythemaMarginBaselineMm?: number;
  dehiscenceMm: number; // edge separation
  purulentDischarge: boolean;
  drainageType: 'NONE' | 'SEROUS' | 'SEROSANGUINOUS' | 'PURULENT' | 'BLOOD';
  drainageAmount: 'NONE' | 'SCANT' | 'MODERATE' | 'HEAVY';
  warmthReported: boolean;
  stapleIntegrityPercent: number;
  visualRiskScore: number; // 0 - 100
  aiVisionNotes: string;
  detectedAnomalies: string[];
}

export interface VoiceCheckInMetrics {
  transcript: string;
  audioDurationSeconds?: number;
  painScore: number; // 0 - 10
  painTrend: 'DECREASING' | 'STABLE' | 'INCREASING' | 'ACUTE_SPIKE';
  mobilityStatus: 'INDEPENDENT' | 'WALKER_ASSISTED' | 'CANE_ASSISTED' | 'BEDBOUND' | 'UNABLE_TO_BEAR_WEIGHT';
  ambulationFeetToday: number;
  medicationAdherence: 'FULL' | 'PARTIAL' | 'MISSED_DOSES' | 'REFUSING_DUE_TO_SIDE_EFFECTS';
  medicationNotes?: string;
  calfPainOrSwelling: boolean;
  chestPainOrShortnessOfBreath: boolean;
  nauseaOrVomiting: boolean;
  bowelMovementSinceDischarge: boolean;
  sleepHours: number;
  emotionalState: 'CONFIDENT' | 'MANAGING' | 'ANXIOUS' | 'DISTRESSED';
}

export interface GuardrailCheckResult {
  isEmergencyOverride: boolean;
  emergencyCategory?: 'DVT_SUSPECTED' | 'PULMONARY_EMBOLISM' | 'SEPSIS_INFECTION' | 'WOUND_DEHISCENCE' | 'MED_TOXICITY';
  emergencyTitle?: string;
  emergencyDirective?: string;
  clinicalRationale: string[];
  actionRequired: 'ER_IMMEDIATE_911' | 'URGENT_SURGICAL_EVALUATION' | 'SAME_DAY_CLINIC_VISIT' | 'STANDARD_MONITORING';
}

export type ClinicianActionType = 
  | 'RESOLVED_STABLE' 
  | 'DISPATCH_HOME_HEALTH' 
  | 'ORDER_DOPPLER_US' 
  | 'PAGE_FELLOW' 
  | 'MED_ADJUSTMENT' 
  | 'PHONE_TRIAGE_COMPLETED';

export interface CheckInRecord {
  id: string;
  patientId: string;
  timestamp: string; // ISO string
  postOpDay: number;
  riskLevel: RiskLevel;
  voiceMetrics: VoiceCheckInMetrics;
  woundAssessment?: WoundAssessment;
  vitals: Vitals;
  guardrails: GuardrailCheckResult;
  aiSummary: string;
  sbarNote: {
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
  };
  clinicianActionTaken?: {
    actionType: ClinicianActionType;
    nurseName: string;
    actionTimestamp: string;
    notes: string;
  };
}

export interface PatientProfile {
  id: string;
  mrn: string; // Medical Record Number
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  avatar: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  surgeryType: SurgeryType;
  surgeryDate: string; // ISO string (e.g. "2026-08-30")
  postOpDay: number;
  primarySurgeon: string;
  surgicalFacility: string;
  implantDetails?: string;
  allergies: string[];
  currentMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    purpose: string;
  }>;
  dischargeProtocols: {
    maxAcceptablePain: number;
    targetAmbulationFeetDay3: number;
    anticoagulationProtocol: string;
    woundCareInstructions: string;
  };
  status: RiskLevel;
  activeAlertCount: number;
  latestCheckIn?: CheckInRecord;
  historyCheckIns: CheckInRecord[];
  baselineWoundImage: string;
}

export interface FHIRClinicalImpression {
  resourceType: 'ClinicalImpression';
  id: string;
  status: 'completed' | 'in-progress';
  subject: {
    reference: string;
    display: string;
  };
  encounter?: {
    display: string;
  };
  effectiveDateTime: string;
  date: string;
  assessor: {
    display: string;
  };
  investigation: Array<{
    code: {
      text: string;
    };
    item: Array<{
      display: string;
    }>;
  }>;
  summary: string;
  finding: Array<{
    itemCodeableConcept: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
      text: string;
    };
  }>;
  prognosisCodeableConcept?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  }>;
  note: Array<{
    authorString: string;
    time: string;
    text: string;
  }>;
}
