import { FHIRClinicalImpression, PatientProfile, CheckInRecord } from '../types/patient';

/**
 * FHIR R4 Clinical Resource Exporter.
 * Generates standards-compliant HL7 FHIR ClinicalImpression and Observation bundles.
 */

export function generateFHIRClinicalImpression(
  patient: PatientProfile,
  checkIn: CheckInRecord
): FHIRClinicalImpression {
  const codeSystem = 'http://snomed.info/sct';
  const loincSystem = 'http://loinc.org';

  // Map triage finding to SNOMED codes
  let snomedFindingCode = '308283009'; // Postoperative state (finding)
  let snomedFindingText = 'Normal post-operative recovery trajectory';

  if (checkIn.riskLevel === 'CRITICAL') {
    if (checkIn.guardrails.emergencyCategory === 'DVT_SUSPECTED') {
      snomedFindingCode = '128053003';
      snomedFindingText = 'Deep venous thrombosis of lower extremity suspected (disorder)';
    } else if (checkIn.guardrails.emergencyCategory === 'PULMONARY_EMBOLISM') {
      snomedFindingCode = '59282003';
      snomedFindingText = 'Pulmonary embolism suspected (disorder)';
    } else {
      snomedFindingCode = '434621000124103';
      snomedFindingText = 'Surgical site infection suspected';
    }
  } else if (checkIn.riskLevel === 'MODERATE') {
    if (checkIn.woundAssessment?.purulentDischarge || (checkIn.woundAssessment?.erythemaMarginMm ?? 0) >= 20) {
      snomedFindingCode = '434621000124103';
      snomedFindingText = 'Localized surgical site inflammation / early infection';
    } else {
      snomedFindingCode = '278414003';
      snomedFindingText = 'Inadequate pain control / medication non-adherence';
    }
  }

  return {
    resourceType: 'ClinicalImpression',
    id: `patientvoice-ci-${checkIn.id}`,
    status: 'completed',
    subject: {
      reference: `Patient/${patient.mrn}`,
      display: `${patient.name} (MRN: ${patient.mrn})`
    },
    encounter: {
      display: `Post-Operative Remote Surveillance - Day ${checkIn.postOpDay}`
    },
    effectiveDateTime: checkIn.timestamp,
    date: new Date().toISOString(),
    assessor: {
      display: 'PatientVoice Ambient AI Clinical Agent v1.0.0 (Validated Orchestrator)'
    },
    investigation: [
      {
        code: {
          text: 'Patient Ambient Voice & Multimodal Wound Assessment'
        },
        item: [
          { display: `Pain Score: ${checkIn.voiceMetrics.painScore}/10 (LOINC: 72514-3)` },
          { display: `Ambulation: ${checkIn.voiceMetrics.ambulationFeetToday} ft (${checkIn.voiceMetrics.mobilityStatus})` },
          { display: `Body Temperature: ${checkIn.vitals.temperatureF}°F (LOINC: 8310-5)` },
          { display: `Medication Adherence: ${checkIn.voiceMetrics.medicationAdherence}` },
          { display: `Wound Erythema: ${checkIn.woundAssessment?.erythemaMarginMm ?? 0} mm (Baseline: ${checkIn.woundAssessment?.erythemaMarginBaselineMm ?? 4} mm)` },
          { display: `Wound Edge Separation: ${checkIn.woundAssessment?.dehiscenceMm ?? 0} mm` }
        ]
      }
    ],
    summary: checkIn.aiSummary,
    finding: [
      {
        itemCodeableConcept: {
          coding: [
            {
              system: codeSystem,
              code: snomedFindingCode,
              display: snomedFindingText
            }
          ],
          text: snomedFindingText
        }
      }
    ],
    prognosisCodeableConcept: [
      {
        coding: [
          {
            system: codeSystem,
            code: checkIn.riskLevel === 'CRITICAL' ? '65872000' : checkIn.riskLevel === 'MODERATE' ? '6736007' : '170968001',
            display: checkIn.riskLevel === 'CRITICAL' ? 'Critical / Poor prognosis without emergency intervention' : checkIn.riskLevel === 'MODERATE' ? 'Guarded prognosis - Clinical review required' : 'Good recovery prognosis'
          }
        ],
        text: `Triage Classification: ${checkIn.riskLevel}`
      }
    ],
    note: [
      {
        authorString: 'SBAR Automated Escalation Synthesis',
        time: checkIn.timestamp,
        text: `SITUATION: ${checkIn.sbarNote.situation}\nBACKGROUND: ${checkIn.sbarNote.background}\nASSESSMENT: ${checkIn.sbarNote.assessment}\nRECOMMENDATION: ${checkIn.sbarNote.recommendation}`
      },
      {
        authorString: 'Deterministic Clinical Guardrails',
        time: checkIn.timestamp,
        text: `Action Required: ${checkIn.guardrails.actionRequired}. Rationale: ${checkIn.guardrails.clinicalRationale.join(' | ')}`
      }
    ]
  };
}

export function generateFHIRBundle(patient: PatientProfile): object {
  const latest = patient.latestCheckIn || patient.historyCheckIns[patient.historyCheckIns.length - 1];
  const clinicalImpression = latest ? generateFHIRClinicalImpression(patient, latest) : null;

  return {
    resourceType: 'Bundle',
    type: 'collection',
    timestamp: new Date().toISOString(),
    entry: [
      {
        fullUrl: `urn:uuid:patient-${patient.mrn}`,
        resource: {
          resourceType: 'Patient',
          id: patient.mrn,
          identifier: [
            {
              system: 'http://hospital.org/mrn',
              value: patient.mrn
            }
          ],
          name: [
            {
              use: 'official',
              text: patient.name
            }
          ],
          gender: patient.gender.toLowerCase(),
          telecom: [
            {
              system: 'phone',
              value: patient.phone,
              use: 'mobile'
            }
          ],
          contact: [
            {
              relationship: [
                {
                  text: patient.emergencyContact.relationship
                }
              ],
              name: {
                text: patient.emergencyContact.name
              },
              telecom: [
                {
                  system: 'phone',
                  value: patient.emergencyContact.phone
                }
              ]
            }
          ]
        }
      },
      ...(clinicalImpression ? [{
        fullUrl: `urn:uuid:clinical-impression-${clinicalImpression.id}`,
        resource: clinicalImpression
      }] : [])
    ]
  };
}
