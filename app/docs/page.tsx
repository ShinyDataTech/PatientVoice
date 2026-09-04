'use client';

import React from 'react';
import { FileCode, Database, Cpu, ShieldCheck, Heart, Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-clinical-500/10 text-clinical-400 border border-clinical-500/20">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">System Architecture & FHIR Documentation</h1>
            <p className="text-sm text-slate-400 mt-1">
              Technical Implementation, Multimodal Pipeline, and Health IT Standards
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-clinical-400 w-fit">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-white">1. Multimodal AI Ingestion</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ingests continuous Web Speech audio, extracting numeric pain metrics (0-10), ambulation distance, systemic thromboembolic symptoms, and computes computer vision wound perimeter analytics.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400 w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-white">2. Deterministic Guardrails</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminates probabilistic failure in safety-critical clinical triage. Evaluates Wells Score DVT indicators, PE dyspnea, and SIRS pyrexia thresholds to instantly bypass LLMs.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-white">3. HL7 FHIR R4 Interop</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generates standardized FHIR <code className="text-indigo-300">ClinicalImpression</code> and <code className="text-indigo-300">Observation</code> JSON resources mapped with SNOMED CT and LOINC codes for seamless Epic & Cerner integration.
          </p>
        </div>
      </div>

      {/* Deep-Dive Sections */}
      <div className="space-y-6">
        {/* Section 1: Synthetic Cohort Profiles */}
        <div className="surface-card bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xl">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>Synthetic Clinical Cohort (4 Archetypes)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <span className="font-bold text-emerald-400 block text-sm mb-1">Patient A: Eleanor Vance (71F)</span>
              <p className="text-slate-300">Day 3 Post-Op Total Knee Arthroplasty (TKA). Normal recovery trajectory, pain 3/10, walking 160ft with walker, incision clean and dry, afebrile (98.6°F).</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <span className="font-bold text-amber-400 block text-sm mb-1">Patient B: Marcus Sterling (58M)</span>
              <p className="text-slate-300">Day 4 Post-Op Total Hip Arthroplasty (THA). Early Surgical Site Infection: 28mm expanding erythema, purulent drainage on dressing, temp 100.8°F, pain rising to 6/10.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <span className="font-bold text-red-400 block text-sm mb-1">Patient C: Robert Chen (66M)</span>
              <p className="text-slate-300">Day 5 Post-Op Total Knee Arthroplasty (TKA). Critical Red-Line Trigger: Unilateral calf swelling (+3.5cm), severe pain on heel strike, sudden shortness of breath, SpO2 93%.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <span className="font-bold text-purple-400 block text-sm mb-1">Patient D: Brenda Miller (62F)</span>
              <p className="text-slate-300">Day 2 Post-Op Total Hip Arthroplasty (THA). Non-Adherence & Unmanaged Breakthrough Pain: Severe post-op emesis preventing retention of Eliquis & analgesics, pain 8/10, bedbound.</p>
            </div>
          </div>
        </div>

        {/* Section 2: REST API Reference */}
        <div className="surface-card bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 shadow-xl">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>REST API Endpoint Reference</span>
          </h2>
          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold mr-2">POST</span>
                <span className="text-slate-200">/api/checkin/voice</span>
              </div>
              <span className="text-slate-400 font-sans text-xs">Ingests speech transcript, extracts pain/mobility/red-lines</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold mr-2">POST</span>
                <span className="text-slate-200">/api/checkin/vision</span>
              </div>
              <span className="text-slate-400 font-sans text-xs">Ingests incision photo, computes erythema margin & dehiscence</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold mr-2">GET</span>
                <span className="text-slate-200">/api/clinician/patients</span>
              </div>
              <span className="text-slate-400 font-sans text-xs">Returns active triage feed sorted by urgency priority</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold mr-2">POST</span>
                <span className="text-slate-200">/api/clinician/resolve</span>
              </div>
              <span className="text-slate-400 font-sans text-xs">Executes 1-click clinical orders and resolves triage flags</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold mr-2">GET</span>
                <span className="text-slate-200">/api/patient/[id]/fhir</span>
              </div>
              <span className="text-slate-400 font-sans text-xs">Exports standard HL7 FHIR R4 ClinicalImpression Bundle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
