# PatientVoice: Technical Architecture & System Design

**Ambient Post-Op Recovery & Symptom Escalation Assistant**  
*Technical Architecture Specification — AI Builders Hackathon 2026*

---

## 1. System Overview

**PatientVoice** is architected as a distributed, high-reliability clinical application. It enforces strict separation between **safety-critical deterministic guardrails** and **generative conversational features**, ensuring HIPAA-aligned data isolation, zero-hallucination triage, and sub-second emergency routing.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (BROWSER)                          │
│                                                                             │
│  ┌─────────────────────────┐                   ┌─────────────────────────┐  │
│  │     PATIENT PORTAL      │                   │  CLINICIAN TRIAGE HUB   │  │
│  │  - Web Audio API (FFT)  │                   │  - Urgency Worklist     │  │
│  │  - Web Speech Engine    │                   │  - Split-Slider Diff    │  │
│  │  - CV Canvas Analyzer   │                   │  - SBAR Auto-Generator  │  │
│  │  - 911 Red-Line Screen  │                   │  - FHIR Bundle Viewer   │  │
│  └────────────┬────────────┘                   └────────────▲────────────┘  │
└───────────────┼─────────────────────────────────────────────┼───────────────┘
                │ HTTP POST / WebSocket                       │ REST API
                ▼                                             │
┌─────────────────────────────────────────────────────────────┼───────────────┐
│                    APPLICATION & INTELLIGENCE SERVER (NEXT.JS)               │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │              DETERMINISTIC GUARDRAIL ENGINE (SAFETY FIRST)             │  │
│  │  - Zero-Hallucination AST Rule Evaluator                              │  │
│  │  - Hardcoded Medical Triggers: DVT, PE, Sepsis, Dehiscence            │  │
│  │  - Emergency Red-Line Bypass Circuit                                  │  │
│  └──────────────────┬────────────────────────────────────────────────────┘  │
│                     │                                                       │
│          [Pass / Safe Recovery]                                             │
│                     ▼                                                       │
│  ┌──────────────────────────────────────┐  ┌─────────────────────────────┐  │
│  │         CLINICAL NLP PARSER          │  │     COMPUTER VISION ENGINE  │  │
│  │  - VAS Pain Extraction (0-10)        │  │  - Erythema Border Segment  │  │
│  │  - Mobility / Medication Adherence   │  │  - Staple Gap Approximation │  │
│  │  - GI / GU Functional Status         │  │  - Exudate Colorimetry      │  │
│  └──────────────────┬───────────────────┘  └──────────────┬──────────────┘  │
│                     │                                     │                 │
│                     └──────────────────┬──────────────────┘                 │
│                                        ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    CLINICAL SYNTHESIS & SBAR ENGINE                   │  │
│  │  - Longitudinal Sparkline Aggregator                                  │  │
│  │  - SBAR Handoff Note Formatter (Situation, Background, Assessment, Rec)│  │
│  │  - 1-Click Order Generation (Ultrasound, Culture, Rx titration)       │  │
│  └─────────────────────────────────────┬─────────────────────────────────┘  │
│                                        │                                    │
│                                        ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     HL7 FHIR R4 INTEROPERABILITY LAYER                │  │
│  │  - LOINC Coding: 72514-3 (Pain), 8310-5 (Temp), 8867-4 (Heart Rate)   │  │
│  │  - SNOMED CT: 128053003 (DVT), 284196006 (Wound dehiscence)          │  │
│  │  - Standard FHIR Bundle: ClinicalImpression + Observation + Encounter │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Specifications

### 2.1 Patient Audio & Voice Processing
* **Web Audio API Stream**: Real-time microphone input sampled at 44.1 kHz via `AudioContext` and `AnalyserNode`.
* **Visual Waveform**: Canvas 2D FFT rendering frequency domain spectrum (64 frequency bins) with responsive visual glow feedback.
* **Transcription Engine**: Web Speech Recognition API streaming spoken patient audio into clinical token stream without server-side audio storage (ensuring HIPAA compliance).

### 2.2 Computer Vision Wound Analysis
* **Colorimetric Segmentation**: Canvas pixel manipulation analyzing RGB and HSV color spaces.
* **Erythema Border Calculation**: Measures hyperemic skin margins surrounding surgical incision lines (in millimeters, calibrated to staple benchmarks).
* **Incision Edge Approximation**: Laplacian edge detection algorithm checking for wound gap / dehiscence (>2mm threshold triggers Warning state).
* **Exudate Classification**: Color tone classification detecting serosanguinous (expected) vs. purulent (infected) drainage.

### 2.3 Deterministic Safety Guardrail Matrix
The safety guardrail is isolated from all LLM components and executes with $O(1)$ deterministic evaluation.

```typescript
export interface ClinicalRule {
  id: string;
  conditionName: string;
  riskLevel: 'CRITICAL' | 'WARNING' | 'NORMAL';
  triggerKeywords: string[];
  vitalThresholds?: {
    temperatureMax?: number; // e.g. 101.5 F
    painMin?: number;        // e.g. 8/10
    erythemaMmMin?: number;  // e.g. 15 mm
  };
  immediateAction: 'CALL_911' | 'NOTIFY_SURGEON' | 'DISPATCH_ORDER' | 'ROUTINE';
  clinicalProtocol: string;
}
```

#### Deterministic Emergency Triggers:
1. **Acute DVT (Deep Vein Thrombosis)**: Unilateral calf swelling + heat / severe localized pain -> Immediate 911 modal + on-call surgeon pager.
2. **Pulmonary Embolism (PE)**: Sudden onset shortness of breath / pleuritic chest pain -> Immediate 911 modal.
3. **Surgical Site Infection (SSI)**: Erythema margin >15mm + purulent drainage + temp >101.0°F -> Warning escalation + Wound culture & oral antibiotic order draft.
4. **Wound Dehiscence**: Separation of fascial/skin margins >3mm -> Warning escalation + Urgent clinic evaluation order.

### 2.4 HL7 FHIR R4 Interoperability
PatientVoice formats all patient encounters into standard HL7 FHIR R4 JSON structures.

#### FHIR Resource Mapping:
* **`FHIR ClinicalImpression`**: Primary container for recovery assessment.
* **`FHIR Observation (Pain)`**: LOINC `72514-3` (*Pain severity - 0-10 verbal numeric rating score*).
* **`FHIR Observation (Temperature)`**: LOINC `8310-5` (*Body temperature*).
* **`FHIR Observation (Wound Erythema)`**: LOINC `72288-4` (*Erythema size*).
* **`FHIR Condition (Finding)`**: SNOMED CT `128053003` (*Deep venous thrombosis*) or `284196006` (*Disruption of surgical wound*).

---

## 3. Security, Privacy & HIPAA Compliance

1. **Zero Raw Audio Storage**: Patient audio is processed locally in-browser via Web Speech API; no audio files are persisted to disks or unencrypted databases.
2. **End-to-End Encryption**: All API communications use TLS 1.3 encryption in transit with AES-256 encryption at rest.
3. **Audit Logging**: Immutable timestamped event logging tracks every clinician triage action, order dispatch, and FHIR export.
4. **Role-Based Access Control (RBAC)**: Strict segregation between Patient views (zero PHI leakage of other records) and Clinician Workstations.
