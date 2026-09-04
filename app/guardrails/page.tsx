'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Flame, 
  HeartCrack, 
  Activity, 
  FileCheck,
  Stethoscope,
  Code
} from 'lucide-react';
import { evaluateClinicalGuardrails } from '@/lib/engine/guardrails';
import { VoiceCheckInMetrics, Vitals, WoundAssessment } from '@/lib/types/patient';

export default function GuardrailMatrixPage() {
  // Interactive Sandbox Controls
  const [chestPainOrSOB, setChestPainOrSOB] = useState(false);
  const [calfSwelling, setCalfSwelling] = useState(true);
  const [painScore, setPainScore] = useState(8);
  const [temperature, setTemperature] = useState(99.4);
  const [erythemaMarginMm, setErythemaMarginMm] = useState(4);
  const [dehiscenceMm, setDehiscenceMm] = useState(0);
  const [purulentExudate, setPurulentExudate] = useState(false);
  const [medAdherence, setMedAdherence] = useState<'FULL' | 'PARTIAL' | 'REFUSING_DUE_TO_SIDE_EFFECTS'>('FULL');

  // Compute evaluation in real time
  const sampleMetrics: VoiceCheckInMetrics = {
    transcript: 'Sandbox interactive simulation.',
    painScore,
    painTrend: painScore >= 7 ? 'ACUTE_SPIKE' : 'STABLE',
    mobilityStatus: 'WALKER_ASSISTED',
    ambulationFeetToday: 100,
    medicationAdherence: medAdherence,
    calfPainOrSwelling: calfSwelling,
    chestPainOrShortnessOfBreath: chestPainOrSOB,
    nauseaOrVomiting: false,
    bowelMovementSinceDischarge: true,
    sleepHours: 7,
    emotionalState: 'MANAGING'
  };

  const sampleVitals: Vitals = {
    temperatureF: temperature,
    heartRateBpm: 80,
    oxygenSatPercent: 97
  };

  const sampleWound: WoundAssessment = {
    erythemaMarginMm,
    dehiscenceMm,
    purulentDischarge: purulentExudate,
    drainageType: purulentExudate ? 'PURULENT' : 'NONE',
    drainageAmount: purulentExudate ? 'MODERATE' : 'NONE',
    warmthReported: false,
    stapleIntegrityPercent: 95,
    visualRiskScore: erythemaMarginMm > 20 ? 80 : 10,
    aiVisionNotes: 'Interactive sandbox wound simulation.',
    detectedAnomalies: []
  };

  const result = evaluateClinicalGuardrails(sampleMetrics, sampleVitals, sampleWound);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Deterministic Clinical Guardrail Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Dual-Layer Clinical Architecture: Hard Deterministic Safety Rules + Multimodal Extraction
            </p>
          </div>
        </div>
      </div>

      {/* Why Guardrails Matter (Architectural Difference vs Prompt Wrappers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>The Danger of Naive LLM Prompt Wrappers in Healthcare</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Generative LLMs are non-deterministic and can hallucinate benign reassurance when a patient reports subtle, life-threatening symptoms (e.g., dismissing calf pain as "routine post-op soreness" when it is an acute Deep Vein Thrombosis).
          </p>
        </div>

        <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>The PatientVoice Deterministic Guardrail Architecture</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            PatientVoice runs a synchronous rule engine before any generative response is rendered. If an orthopedic emergency trigger (Wells DVT, SIRS fever, PE dyspnea, dehiscence) is identified, the LLM is <strong>completely bypassed</strong>, immediately issuing emergency directives and alerting on-call surgeons.
          </p>
        </div>
      </div>

      {/* Interactive Guardrail Sandbox */}
      <div className="surface-card bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-clinical-400" />
            <h2 className="font-extrabold text-base sm:text-lg text-white">Live Clinical Guardrail Interactive Simulator</h2>
          </div>
          <span className="text-xs text-slate-400">Toggle parameters to test instant safety bypass</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Calf Swelling & Pain (DVT) */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Unilateral Calf Pain / Edema</span>
                <span className="text-[11px] text-slate-400">Wells Score criteria for Deep Vein Thrombosis</span>
              </div>
              <button
                type="button"
                onClick={() => setCalfSwelling(!calfSwelling)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  calfSwelling ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {calfSwelling ? 'POSITIVE (DVT Risk)' : 'NEGATIVE'}
              </button>
            </div>

            {/* Chest Pain / Shortness of Breath (PE) */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Chest Pain / Dyspnea</span>
                <span className="text-[11px] text-slate-400">Pulmonary Embolism emergency red-line</span>
              </div>
              <button
                type="button"
                onClick={() => setChestPainOrSOB(!chestPainOrSOB)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chestPainOrSOB ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {chestPainOrSOB ? 'POSITIVE (PE Risk)' : 'NEGATIVE'}
              </button>
            </div>

            {/* Temperature Slider */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Body Temperature: {temperature}°F</span>
                <span className={`font-mono font-bold ${temperature >= 101.5 ? 'text-red-400' : 'text-slate-400'}`}>
                  {temperature >= 101.5 ? 'Threshold Exceeded (≥101.5°F)' : 'Afebrile'}
                </span>
              </div>
              <input
                type="range"
                min="97.0"
                max="104.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="accent-red-500 cursor-pointer w-full"
              />
            </div>

            {/* Wound Erythema Slider */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Wound Erythema Halo: {erythemaMarginMm} mm</span>
                <span className={`font-mono font-bold ${erythemaMarginMm >= 20 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {erythemaMarginMm >= 20 ? 'SSI Warning (≥20mm)' : 'Normal (<20mm)'}
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="45"
                value={erythemaMarginMm}
                onChange={(e) => setErythemaMarginMm(parseInt(e.target.value, 10))}
                className="accent-amber-500 cursor-pointer w-full"
              />
            </div>

            {/* Pain Score */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Reported Pain Score: {painScore}/10</span>
                <span className={`font-mono font-bold ${painScore >= 8 ? 'text-purple-400' : 'text-slate-400'}`}>
                  {painScore >= 8 ? 'Severe Unmanaged (≥8/10)' : 'Acceptable'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painScore}
                onChange={(e) => setPainScore(parseInt(e.target.value, 10))}
                className="accent-teal-400 cursor-pointer w-full"
              />
            </div>
          </div>

          {/* Real-time Guardrail Output (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className={`h-full border-2 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-xl ${
              result.isEmergencyOverride
                ? 'bg-red-950/60 border-red-500 shadow-red-950/50'
                : result.actionRequired === 'SAME_DAY_CLINIC_VISIT'
                  ? 'bg-amber-950/40 border-amber-500 shadow-amber-950/50'
                  : 'bg-emerald-950/40 border-emerald-500 shadow-emerald-950/50'
            }`}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rule Engine Output</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    result.isEmergencyOverride ? 'bg-red-600 text-white animate-pulse' : result.actionRequired === 'SAME_DAY_CLINIC_VISIT' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black'
                  }`}>
                    {result.actionRequired}
                  </span>
                </div>

                <h3 className="font-black text-base text-white mt-1">
                  {result.emergencyTitle || (result.isEmergencyOverride ? 'CRITICAL EMERGENCY OVERRIDE' : 'Standard Monitoring Protocol')}
                </h3>

                {result.emergencyDirective && (
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    {result.emergencyDirective}
                  </p>
                )}
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5 text-xs">
                <span className="font-bold text-slate-300">Deterministic Rationale:</span>
                <ul className="space-y-1 text-slate-400">
                  {result.clinicalRationale.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] text-slate-400 italic">
                {result.isEmergencyOverride ? '⚡ Generative LLM is bypassed. Immediate 911 / ER alert triggered.' : '✅ Case processed through standard multimodal clinical extraction.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
