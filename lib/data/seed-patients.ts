import { PatientProfile } from '../types/patient';

export const SEED_PATIENTS: PatientProfile[] = [
  {
    id: 'pt-101',
    mrn: 'MRN-8849201',
    name: 'Eleanor Vance',
    age: 71,
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '(555) 349-8120',
    emergencyContact: {
      name: 'Thomas Vance',
      relationship: 'Spouse',
      phone: '(555) 349-8122'
    },
    surgeryType: 'Total Knee Arthroplasty (TKA)',
    surgeryDate: '2026-09-01',
    postOpDay: 3,
    primarySurgeon: 'Dr. Sarah Jenkins, MD (Orthopedic Reconstructive Surgery)',
    surgicalFacility: 'St. Jude Center for Advanced Joint Replacement',
    implantDetails: 'Stryker Triathlon Total Knee System (Right Knee)',
    allergies: ['Penicillin (Rash)', 'Codeine (Nausea)'],
    currentMedications: [
      { name: 'Apixaban (Eliquis)', dosage: '2.5 mg', frequency: 'Twice daily', purpose: 'DVT/PE Prophylaxis' },
      { name: 'Celecoxib (Celebrex)', dosage: '200 mg', frequency: 'Daily', purpose: 'NSAID / Anti-inflammatory' },
      { name: 'Acetaminophen', dosage: '1000 mg', frequency: 'Every 8 hours', purpose: 'Baseline Pain Control' },
      { name: 'Oxycodone', dosage: '5 mg', frequency: 'Every 6 hours PRN', purpose: 'Breakthrough Pain' }
    ],
    dischargeProtocols: {
      maxAcceptablePain: 5,
      targetAmbulationFeetDay3: 150,
      anticoagulationProtocol: 'Eliquis 2.5mg BID x 30 days',
      woundCareInstructions: 'Keep dry until Day 10. Report erythema >10mm or drainage.'
    },
    status: 'STABLE',
    activeAlertCount: 0,
    baselineWoundImage: '/images/wounds/knee-baseline-clean.svg',
    latestCheckIn: {
      id: 'chk-101-d3',
      patientId: 'pt-101',
      timestamp: '2026-09-04T08:30:00Z',
      postOpDay: 3,
      riskLevel: 'STABLE',
      vitals: {
        temperatureF: 98.6,
        heartRateBpm: 72,
        bloodPressureSystolic: 124,
        bloodPressureDiastolic: 78,
        oxygenSatPercent: 98
      },
      voiceMetrics: {
        transcript: "Good morning! My right knee is feeling a little stiff when I first get up, but the pain is around a 3 out of 10. I used my front-wheeled walker and did two laps around the living room and kitchen—about 160 feet. I've taken my morning Eliquis and Tylenol with oatmeal, no stomach issues at all. No calf pain, breathing fine.",
        audioDurationSeconds: 42,
        painScore: 3,
        painTrend: 'DECREASING',
        mobilityStatus: 'WALKER_ASSISTED',
        ambulationFeetToday: 160,
        medicationAdherence: 'FULL',
        medicationNotes: 'Full adherence to DVT prophylaxis and scheduled analgesics.',
        calfPainOrSwelling: false,
        chestPainOrShortnessOfBreath: false,
        nauseaOrVomiting: false,
        bowelMovementSinceDischarge: true,
        sleepHours: 7,
        emotionalState: 'CONFIDENT'
      },
      woundAssessment: {
        imageUrl: '/images/wounds/knee-baseline-clean.svg',
        baselineImageUrl: '/images/wounds/knee-baseline-clean.svg',
        erythemaMarginMm: 4,
        erythemaMarginBaselineMm: 4,
        dehiscenceMm: 0,
        purulentDischarge: false,
        drainageType: 'NONE',
        drainageAmount: 'NONE',
        warmthReported: false,
        stapleIntegrityPercent: 100,
        visualRiskScore: 6,
        aiVisionNotes: 'Right knee anterior midline incision dry and well-approximated with intact surgical staples. Benign minimal periwound hyperemia (<4mm).',
        detectedAnomalies: ['Clean margins', 'No dehiscence']
      },
      guardrails: {
        isEmergencyOverride: false,
        clinicalRationale: ['Vitals afebrile at 98.6°F', 'Pain controlled at 3/10', 'Exceeded ambulation goal (160ft vs 150ft target)'],
        actionRequired: 'STANDARD_MONITORING'
      },
      aiSummary: 'Patient Eleanor Vance is progressing favorably on Post-Op Day 3. Pain well-managed at 3/10, walking 160ft with walker, afebrile, and compliant with Eliquis anticoagulation.',
      sbarNote: {
        situation: 'Eleanor Vance (Day 3 post-op TKA) completed morning voice check-in.',
        background: '71yo female s/p Right Total Knee Arthroplasty (09/01/2026). Discharge pain goal <=5.',
        assessment: 'Recovery is on track. Pain 3/10 (improving), mobility 160ft, incision clean, afebrile.',
        recommendation: 'Continue standard post-op care protocol and outpatient physical therapy.'
      }
    },
    historyCheckIns: [
      {
        id: 'chk-101-d1',
        patientId: 'pt-101',
        timestamp: '2026-09-02T09:15:00Z',
        postOpDay: 1,
        riskLevel: 'STABLE',
        vitals: { temperatureF: 99.1, heartRateBpm: 78 },
        voiceMetrics: {
          transcript: "First day home. Knee is swollen and pain is about a 5 out of 10, but pain meds helped.",
          painScore: 5,
          painTrend: 'STABLE',
          mobilityStatus: 'WALKER_ASSISTED',
          ambulationFeetToday: 60,
          medicationAdherence: 'FULL',
          calfPainOrSwelling: false,
          chestPainOrShortnessOfBreath: false,
          nauseaOrVomiting: false,
          bowelMovementSinceDischarge: false,
          sleepHours: 5,
          emotionalState: 'MANAGING'
        },
        guardrails: { isEmergencyOverride: false, clinicalRationale: ['Expected Day 1 post-op baseline'], actionRequired: 'STANDARD_MONITORING' },
        aiSummary: 'Day 1 baseline established. Expected surgical site soreness.',
        sbarNote: {
          situation: 'Day 1 baseline check-in.',
          background: 'TKA discharge Day 1.',
          assessment: 'Tolerating diet and oral analgesics.',
          recommendation: 'Ice knee 20 mins every 2 hours.'
        }
      },
      {
        id: 'chk-101-d2',
        patientId: 'pt-101',
        timestamp: '2026-09-03T08:45:00Z',
        postOpDay: 2,
        riskLevel: 'STABLE',
        vitals: { temperatureF: 98.8, heartRateBpm: 74 },
        voiceMetrics: {
          transcript: "Slept better last night. Pain is down to a 4. Walked about 110 feet with the walker.",
          painScore: 4,
          painTrend: 'DECREASING',
          mobilityStatus: 'WALKER_ASSISTED',
          ambulationFeetToday: 110,
          medicationAdherence: 'FULL',
          calfPainOrSwelling: false,
          chestPainOrShortnessOfBreath: false,
          nauseaOrVomiting: false,
          bowelMovementSinceDischarge: true,
          sleepHours: 6.5,
          emotionalState: 'CONFIDENT'
        },
        guardrails: { isEmergencyOverride: false, clinicalRationale: ['Improving trend'], actionRequired: 'STANDARD_MONITORING' },
        aiSummary: 'Day 2 showed progressive pain improvement and increased walking tolerance.',
        sbarNote: {
          situation: 'Day 2 check-in.',
          background: 'TKA recovery.',
          assessment: 'Pain dropped from 5 to 4, mobility increased to 110ft.',
          recommendation: 'Advance home exercise program as tolerated.'
        }
      }
    ]
  },
  {
    id: 'pt-102',
    mrn: 'MRN-4921094',
    name: 'Marcus Sterling',
    age: 58,
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '(555) 782-4419',
    emergencyContact: {
      name: 'Laura Sterling',
      relationship: 'Wife',
      phone: '(555) 782-4411'
    },
    surgeryType: 'Total Hip Arthroplasty (THA)',
    surgeryDate: '2026-08-31',
    postOpDay: 4,
    primarySurgeon: 'Dr. Michael Chang, MD (Adult Reconstruction & Joint Replacement)',
    surgicalFacility: 'University Orthopedic Institute',
    implantDetails: 'Zimmer Biomet G7 Acetabular System (Left Hip, Posterior Approach)',
    allergies: ['Sulfa drugs (Hives)'],
    currentMedications: [
      { name: 'Rivaroxaban (Xarelto)', dosage: '10 mg', frequency: 'Daily with food', purpose: 'Thrombosis prevention' },
      { name: 'Meloxicam', dosage: '15 mg', frequency: 'Daily', purpose: 'Anti-inflammatory' },
      { name: 'Tramadol', dosage: '50 mg', frequency: 'Every 6 hours PRN', purpose: 'Moderate Pain' }
    ],
    dischargeProtocols: {
      maxAcceptablePain: 4,
      targetAmbulationFeetDay3: 200,
      anticoagulationProtocol: 'Xarelto 10mg daily x 35 days',
      woundCareInstructions: 'Inspect dressing daily. Keep dry. Alert if redness spreads >15mm.'
    },
    status: 'MODERATE',
    activeAlertCount: 2,
    baselineWoundImage: '/images/wounds/hip-baseline-clean.svg',
    latestCheckIn: {
      id: 'chk-102-d4',
      patientId: 'pt-102',
      timestamp: '2026-09-04T07:45:00Z',
      postOpDay: 4,
      riskLevel: 'MODERATE',
      vitals: {
        temperatureF: 100.8,
        heartRateBpm: 88,
        bloodPressureSystolic: 138,
        bloodPressureDiastolic: 84,
        oxygenSatPercent: 97
      },
      voiceMetrics: {
        transcript: "Hi team. My left hip has been feeling noticeably hotter and throbbing more since yesterday afternoon. Pain has crept back up to a 6 out of 10. When I looked at the incision dressing this morning, the skin around it looks quite red and angry, spreading outward about an inch, and there was a bit of yellowish discharge on the gauze. I checked my temp and it was 100.8. Still took my Xarelto with breakfast.",
        audioDurationSeconds: 54,
        painScore: 6,
        painTrend: 'INCREASING',
        mobilityStatus: 'WALKER_ASSISTED',
        ambulationFeetToday: 90,
        medicationAdherence: 'FULL',
        medicationNotes: 'Compliant with anticoagulants, taking tramadol for increasing pain.',
        calfPainOrSwelling: false,
        chestPainOrShortnessOfBreath: false,
        nauseaOrVomiting: false,
        bowelMovementSinceDischarge: true,
        sleepHours: 4.5,
        emotionalState: 'ANXIOUS'
      },
      woundAssessment: {
        imageUrl: '/images/wounds/hip-infection-erythema.svg',
        baselineImageUrl: '/images/wounds/hip-baseline-clean.svg',
        erythemaMarginMm: 28,
        erythemaMarginBaselineMm: 4,
        dehiscenceMm: 1.8,
        purulentDischarge: true,
        drainageType: 'PURULENT',
        drainageAmount: 'MODERATE',
        warmthReported: true,
        stapleIntegrityPercent: 88,
        visualRiskScore: 78,
        aiVisionNotes: 'Visual analysis reveals 28mm circumferential erythema (delta +24mm vs Day 0 baseline) with yellowish purulent exudate at inferior incision pole. Superficial wound edge separation 1.8mm.',
        detectedAnomalies: [
          'Expanding erythema (>25mm from margin)',
          'Purulent exudate present on dressing',
          'Low-grade pyrexia (100.8°F)'
        ]
      },
      guardrails: {
        isEmergencyOverride: false,
        emergencyCategory: 'SEPSIS_INFECTION',
        emergencyTitle: 'MODERATE ESCALATION: Early Surgical Site Infection (SSI) Suspected',
        emergencyDirective: 'Clinical nurse review required today. Schedule same-day wound clinic evaluation for wound culture and empirical oral antibiotic initiation.',
        clinicalRationale: [
          'Erythema margin expanded to 28mm (greater than normal post-op inflammation)',
          'Purulent discharge present on dressing',
          'Low-grade fever 100.8°F with pain rising from 4 to 6/10'
        ],
        actionRequired: 'SAME_DAY_CLINIC_VISIT'
      },
      aiSummary: 'Marcus Sterling exhibits classical early Surgical Site Infection (SSI) signs on Day 4 post-op THA: expanding periwound erythema (28mm), purulent drainage, pyrexia of 100.8°F, and pain escalation to 6/10.',
      sbarNote: {
        situation: 'Marcus Sterling (Day 4 post-op THA) has developed signs of early surgical site infection.',
        background: '58yo male s/p Left Total Hip Arthroplasty (08/31/2026). Initial recovery was unremarkable until Day 3.',
        assessment: 'Suspected superficial SSI. Periwound erythema 28mm (+24mm vs baseline), purulent discharge, temp 100.8°F, pain increased to 6/10.',
        recommendation: '1. Contact patient for clinic wound review today. 2. Obtain wound swab for C&S. 3. Consider starting Cefalexin 500mg QID pending cultures.'
      }
    },
    historyCheckIns: [
      {
        id: 'chk-102-d2',
        patientId: 'pt-102',
        timestamp: '2026-09-02T08:00:00Z',
        postOpDay: 2,
        riskLevel: 'STABLE',
        vitals: { temperatureF: 98.7, heartRateBpm: 76 },
        voiceMetrics: {
          transcript: "Doing okay today. Pain is about a 4 out of 10. Walked 140 feet around the house.",
          painScore: 4,
          painTrend: 'STABLE',
          mobilityStatus: 'WALKER_ASSISTED',
          ambulationFeetToday: 140,
          medicationAdherence: 'FULL',
          calfPainOrSwelling: false,
          chestPainOrShortnessOfBreath: false,
          nauseaOrVomiting: false,
          bowelMovementSinceDischarge: true,
          sleepHours: 6,
          emotionalState: 'MANAGING'
        },
        guardrails: { isEmergencyOverride: false, clinicalRationale: ['Normal Day 2 post-op'], actionRequired: 'STANDARD_MONITORING' },
        aiSummary: 'Day 2 check-in was unremarkable with good mobility.',
        sbarNote: {
          situation: 'Day 2 THA check-in.',
          background: 'THA post-op.',
          assessment: 'Stable pain 4/10.',
          recommendation: 'Continue protocol.'
        }
      }
    ]
  },
  {
    id: 'pt-103',
    mrn: 'MRN-7730198',
    name: 'Robert Chen',
    age: 66,
    gender: 'Male',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '(555) 914-2283',
    emergencyContact: {
      name: 'Grace Chen',
      relationship: 'Daughter',
      phone: '(555) 914-2288'
    },
    surgeryType: 'Total Knee Arthroplasty (TKA)',
    surgeryDate: '2026-08-30',
    postOpDay: 5,
    primarySurgeon: 'Dr. Katherine Rivera, MD (Orthopedic Oncology & Arthroplasty)',
    surgicalFacility: 'Metro Health Academic Medical Center',
    implantDetails: 'Smith & Nephew Legion Total Knee System (Left Knee)',
    allergies: ['Aspirin (Bronchospasm / Asthma)'],
    currentMedications: [
      { name: 'Enoxaparin (Lovenox)', dosage: '40 mg', frequency: 'SubQ Daily', purpose: 'DVT prevention' },
      { name: 'Oxycodone/Acetaminophen', dosage: '5/325 mg', frequency: 'Every 4-6 hours PRN', purpose: 'Severe post-op pain' },
      { name: 'Gabapentin', dosage: '300 mg', frequency: 'Nightly', purpose: 'Neuropathic pain' }
    ],
    dischargeProtocols: {
      maxAcceptablePain: 5,
      targetAmbulationFeetDay3: 200,
      anticoagulationProtocol: 'Lovenox 40mg SubQ daily x 14 days',
      woundCareInstructions: 'Aquacel dressing in place. DO NOT SOAK. Red flags: Calf tightness, shortness of breath.'
    },
    status: 'CRITICAL',
    activeAlertCount: 3,
    baselineWoundImage: '/images/wounds/knee-baseline-clean.svg',
    latestCheckIn: {
      id: 'chk-103-d5',
      patientId: 'pt-103',
      timestamp: '2026-09-04T06:15:00Z',
      postOpDay: 5,
      riskLevel: 'CRITICAL',
      vitals: {
        temperatureF: 99.4,
        heartRateBpm: 104,
        bloodPressureSystolic: 146,
        bloodPressureDiastolic: 92,
        oxygenSatPercent: 93
      },
      voiceMetrics: {
        transcript: "I woke up in serious trouble this morning. My left calf feels like it is on fire and swollen tight as a drum—much larger than my right leg. The calf pain is easily an 8 out of 10 whenever I try to put my heel down. On top of that, just walking 20 feet to the bathroom left me completely winded and out of breath with a tightness across my chest. I took my Lovenox yesterday evening, but I'm really frightened right now.",
        audioDurationSeconds: 48,
        painScore: 8,
        painTrend: 'ACUTE_SPIKE',
        mobilityStatus: 'UNABLE_TO_BEAR_WEIGHT',
        ambulationFeetToday: 20,
        medicationAdherence: 'FULL',
        medicationNotes: 'Patient received Lovenox injection yesterday, but symptoms strongly indicate DVT/PE.',
        calfPainOrSwelling: true,
        chestPainOrShortnessOfBreath: true,
        nauseaOrVomiting: false,
        bowelMovementSinceDischarge: true,
        sleepHours: 3,
        emotionalState: 'DISTRESSED'
      },
      woundAssessment: {
        imageUrl: '/images/wounds/knee-baseline-clean.svg',
        baselineImageUrl: '/images/wounds/knee-baseline-clean.svg',
        erythemaMarginMm: 5,
        erythemaMarginBaselineMm: 4,
        dehiscenceMm: 0,
        purulentDischarge: false,
        drainageType: 'NONE',
        drainageAmount: 'NONE',
        warmthReported: false,
        stapleIntegrityPercent: 100,
        visualRiskScore: 12,
        aiVisionNotes: 'Surgical incision itself is intact with minimal redness. Emergency etiology is vascular/thromboembolic (severe unilateral calf edema, tachypnea, O2 sat 93%, pleuritic chest tightness).',
        detectedAnomalies: [
          'CRITICAL SYSTEMIC: Acute unilateral calf swelling + tenderness',
          'CRITICAL SYSTEMIC: Dyspnea upon minimal exertion + Chest tightness',
          'Tachycardia (HR 104 bpm) and relative hypoxia (O2 Sat 93%)'
        ]
      },
      guardrails: {
        isEmergencyOverride: true,
        emergencyCategory: 'PULMONARY_EMBOLISM',
        emergencyTitle: 'CRITICAL EMERGENCY: High Suspicion of DVT & Pulmonary Embolism (PE)',
        emergencyDirective: 'IMMEDIATE 911 / EMERGENCY ROOM DISPATCH. Do NOT attempt to walk or drive yourself. Remain seated and await EMS. Surgical team paged simultaneously.',
        clinicalRationale: [
          'Acute dyspnea and chest tightness post-major orthopedic arthroplasty',
          'Unilateral calf pain and marked swelling (+3.5cm) indicating active lower-extremity DVT',
          'Resting tachycardia (HR 104) and borderline hypoxia (SpO2 93%)'
        ],
        actionRequired: 'ER_IMMEDIATE_911'
      },
      aiSummary: 'CRITICAL MEDICAL EMERGENCY: Robert Chen reports severe unilateral calf swelling and tenderness with concurrent acute chest tightness, shortness of breath, tachycardia (HR 104), and hypoxia (SpO2 93%). High probability of DVT with early Pulmonary Embolism.',
      sbarNote: {
        situation: 'EMERGENCY RED-LINE TRIGGER: Robert Chen (Day 5 post-op TKA) exhibits severe symptoms of DVT with possible Pulmonary Embolism.',
        background: '66yo male s/p Left Total Knee Arthroplasty on 08/30/2026. Anticoagulated with Lovenox.',
        assessment: 'CRITICAL: Acute unilateral calf swelling/pain (8/10), dyspnea, chest tightness, HR 104, SpO2 93%. Wells Score > 4 (High Risk DVT/PE).',
        recommendation: '1. Patient instructed to call 911 immediately. 2. Immediate notification sent to on-call Orthopedic Fellow and ER Attending. 3. Order STAT CT Pulmonary Angiogram & Bilateral Venous Duplex.'
      }
    },
    historyCheckIns: [
      {
        id: 'chk-103-d2',
        patientId: 'pt-103',
        timestamp: '2026-09-01T09:00:00Z',
        postOpDay: 2,
        riskLevel: 'STABLE',
        vitals: { temperatureF: 98.6, heartRateBpm: 76, oxygenSatPercent: 98 },
        voiceMetrics: {
          transcript: "Everything was going smoothly. Pain was a 4 and I was doing my ankle pumps.",
          painScore: 4,
          painTrend: 'STABLE',
          mobilityStatus: 'WALKER_ASSISTED',
          ambulationFeetToday: 130,
          medicationAdherence: 'FULL',
          calfPainOrSwelling: false,
          chestPainOrShortnessOfBreath: false,
          nauseaOrVomiting: false,
          bowelMovementSinceDischarge: true,
          sleepHours: 7,
          emotionalState: 'MANAGING'
        },
        guardrails: { isEmergencyOverride: false, clinicalRationale: ['Stable post-op status'], actionRequired: 'STANDARD_MONITORING' },
        aiSummary: 'Day 2 check-in was unremarkable.',
        sbarNote: {
          situation: 'Day 2 TKA check-in.',
          background: 'TKA recovery.',
          assessment: 'Stable.',
          recommendation: 'Continue Lovenox.'
        }
      }
    ]
  },
  {
    id: 'pt-104',
    mrn: 'MRN-3309182',
    name: 'Brenda Miller',
    age: 62,
    gender: 'Female',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '(555) 602-9931',
    emergencyContact: {
      name: 'David Miller',
      relationship: 'Son',
      phone: '(555) 602-9934'
    },
    surgeryType: 'Total Hip Arthroplasty (THA)',
    surgeryDate: '2026-09-02',
    postOpDay: 2,
    primarySurgeon: 'Dr. Anthony Rossi, MD (Joint Replacement & Orthopedic Surgery)',
    surgicalFacility: 'St. Jude Center for Advanced Joint Replacement',
    implantDetails: 'Stryker Accolade II Hip Stem with Tritanium Cup (Right Hip)',
    allergies: ['Morphine (Severe Nausea/Vomiting)', 'Latex'],
    currentMedications: [
      { name: 'Apixaban (Eliquis)', dosage: '2.5 mg', frequency: 'Twice daily', purpose: 'Blood clot prevention' },
      { name: 'Hydromorphone (Dilaudid)', dosage: '2 mg', frequency: 'Every 4-6 hours PRN', purpose: 'Breakthrough pain' },
      { name: 'Ondansetron (Zofran)', dosage: '4 mg', frequency: 'Every 8 hours PRN', purpose: 'Anti-nausea' }
    ],
    dischargeProtocols: {
      maxAcceptablePain: 4,
      targetAmbulationFeetDay3: 150,
      anticoagulationProtocol: 'Eliquis 2.5mg BID x 30 days',
      woundCareInstructions: 'Prineo mesh dressing intact. Keep dry.'
    },
    status: 'MODERATE',
    activeAlertCount: 2,
    baselineWoundImage: '/images/wounds/hip-baseline-clean.svg',
    latestCheckIn: {
      id: 'chk-104-d2',
      patientId: 'pt-104',
      timestamp: '2026-09-04T09:00:00Z',
      postOpDay: 2,
      riskLevel: 'MODERATE',
      vitals: {
        temperatureF: 98.9,
        heartRateBpm: 84,
        bloodPressureSystolic: 118,
        bloodPressureDiastolic: 74,
        oxygenSatPercent: 98
      },
      voiceMetrics: {
        transcript: "I'm having a very rough time today. I woke up so horribly nauseous that every time I tried to take my pain pill or my Eliquis blood thinner, I threw it straight back up. Because of that, my hip pain has shot up to an 8 out of 10. I haven't been able to get out of bed all morning, not even to use the walker. The incision dressing looks completely fine and dry, but I just cannot keep any medicine down and I'm in tears from the pain.",
        audioDurationSeconds: 52,
        painScore: 8,
        painTrend: 'ACUTE_SPIKE',
        mobilityStatus: 'BEDBOUND',
        ambulationFeetToday: 0,
        medicationAdherence: 'REFUSING_DUE_TO_SIDE_EFFECTS',
        medicationNotes: 'Severe emesis preventing ingestion of oral Eliquis (anticoagulant) and Dilaudid (analgesic).',
        calfPainOrSwelling: false,
        chestPainOrShortnessOfBreath: false,
        nauseaOrVomiting: true,
        bowelMovementSinceDischarge: false,
        sleepHours: 3.5,
        emotionalState: 'DISTRESSED'
      },
      woundAssessment: {
        imageUrl: '/images/wounds/hip-baseline-clean.svg',
        baselineImageUrl: '/images/wounds/hip-baseline-clean.svg',
        erythemaMarginMm: 4,
        erythemaMarginBaselineMm: 4,
        dehiscenceMm: 0,
        purulentDischarge: false,
        drainageType: 'NONE',
        drainageAmount: 'NONE',
        warmthReported: false,
        stapleIntegrityPercent: 100,
        visualRiskScore: 5,
        aiVisionNotes: 'Right hip surgical dressing is clean, dry, and intact with zero signs of hematoma or discharge. Clinical problem is pharmacological non-adherence due to uncontrolled intractable post-op emesis.',
        detectedAnomalies: [
          'Medication regimen breakdown: Missed Eliquis dose increases DVT risk',
          'Breakthrough pain spike (8/10) with complete ambulation cessation'
        ]
      },
      guardrails: {
        isEmergencyOverride: false,
        emergencyCategory: 'MED_TOXICITY',
        emergencyTitle: 'MODERATE ESCALATION: Intractable Nausea, Missed Anticoagulation, Unmanaged Pain',
        emergencyDirective: 'Orthopedic nurse tele-triage call within 1 hour. Sublingual or transdermal anti-emetic (Promethazine/Scopolamine) indicated to restore oral intake of Eliquis and analgesic.',
        clinicalRationale: [
          'Severe intractable nausea preventing oral intake of required blood thinners (Eliquis)',
          'Pain score 8/10 causing acute immobility (bedbound Day 2)',
          'Patient at secondary risk for DVT and rehabilitation stalling'
        ],
        actionRequired: 'SAME_DAY_CLINIC_VISIT'
      },
      aiSummary: 'Brenda Miller (Day 2 post-op THA) is experiencing acute medication non-adherence due to severe post-op emesis, missing essential Eliquis doses and suffering uncontrolled 8/10 pain with zero ambulation.',
      sbarNote: {
        situation: 'Brenda Miller (Day 2 post-op THA) unable to retain medications due to severe nausea; pain 8/10, bedbound.',
        background: '62yo female s/p Right Total Hip Arthroplasty (09/02/2026). Known allergy/sensitivity to Morphine.',
        assessment: 'Post-operative opioid-induced nausea and vomiting causing missed doses of Eliquis and uncontrolled breakthrough pain. Wound intact.',
        recommendation: '1. Call patient immediately to triage. 2. Prescribe Ondansetron ODT 4mg (dissolvable) or Phenergan suppository. 3. Resume Eliquis once nausea suppressed. 4. Convert oral hydromorphone to alternative analgesic.'
      }
    },
    historyCheckIns: [
      {
        id: 'chk-104-d1',
        patientId: 'pt-104',
        timestamp: '2026-09-03T10:00:00Z',
        postOpDay: 1,
        riskLevel: 'STABLE',
        vitals: { temperatureF: 98.7, heartRateBpm: 78 },
        voiceMetrics: {
          transcript: "First day home from hospital. Hip is sore, about a 5 out of 10. Managed to walk 50 feet with the walker.",
          painScore: 5,
          painTrend: 'STABLE',
          mobilityStatus: 'WALKER_ASSISTED',
          ambulationFeetToday: 50,
          medicationAdherence: 'FULL',
          calfPainOrSwelling: false,
          chestPainOrShortnessOfBreath: false,
          nauseaOrVomiting: false,
          bowelMovementSinceDischarge: false,
          sleepHours: 5,
          emotionalState: 'MANAGING'
        },
        guardrails: { isEmergencyOverride: false, clinicalRationale: ['Normal initial post-op day'], actionRequired: 'STANDARD_MONITORING' },
        aiSummary: 'Day 1 baseline established with mild expected post-op pain.',
        sbarNote: {
          situation: 'Day 1 THA check-in.',
          background: 'THA post-op.',
          assessment: 'Tolerating oral intake initially.',
          recommendation: 'Monitor for opioid side effects.'
        }
      }
    ]
  }
];
