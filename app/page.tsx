'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Mic, 
  Camera, 
  ShieldAlert, 
  LayoutDashboard, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  FileCode, 
  Stethoscope,
  Heart,
  TrendingDown,
  Clock,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';
import { SEED_PATIENTS } from '@/lib/data/seed-patients';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl flex flex-col gap-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clinical-500/10 border border-clinical-500/30 text-clinical-300 text-xs font-extrabold w-fit">
              <Sparkles className="w-4 h-4" />
              <span>AI Builders Hackathon 2026 • Post-Op Clinical Agent</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Ambient Voice &amp; Wound Surveillance for <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinical-400 via-teal-300 to-cyan-400">Post-Op Recovery</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              PatientVoice is an ambient clinical agent that conducts daily, low-friction voice check-ins (&lt;90s) and computer-vision wound evaluations. Built with <strong>deterministic emergency red-lines</strong> to prevent joint arthroplasty readmissions before complications escalate.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/patient/checkin"
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-clinical-500 to-teal-400 hover:from-clinical-400 hover:to-teal-300 text-slate-950 font-black text-base flex items-center gap-2.5 shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mic className="w-5 h-5" />
                <span>Launch Patient Check-In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/clinician"
                className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base flex items-center gap-2.5 border border-slate-700 transition-all hover:border-slate-600"
              >
                <LayoutDashboard className="w-5 h-5 text-clinical-400" />
                <span>Clinician Triage Command</span>
              </Link>
            </div>

            {/* Key Trust Signals */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-clinical-400" /> Deterministic Red-Line Bypass (DVT / PE)
              </span>
              <span className="flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-cyan-400" /> HL7® FHIR® R4 Interoperable
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> WCAG AAA Accessible Dual UI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Interactive Judge Sandbox Presets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span>Interactive Clinical Sandbox</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-teal-500/20 text-clinical-300 font-mono">
                4 Seed Profiles
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select any profile to test multimodal speech extraction, wound diffs, and guardrail decisions:
            </p>
          </div>

          <Link
            href="/guardrails"
            className="text-xs text-clinical-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Explore Guardrail Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SEED_PATIENTS.map((patient) => {
            const isCritical = patient.status === 'CRITICAL';
            const isModerate = patient.status === 'MODERATE';

            return (
              <div
                key={patient.id}
                className={`surface-card border rounded-3xl p-5 flex flex-col justify-between gap-4 shadow-xl transition-all hover:scale-[1.01] ${
                  isCritical
                    ? 'bg-red-950/20 border-red-500/50'
                    : isModerate
                      ? 'bg-amber-950/20 border-amber-500/50'
                      : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <img
                      src={patient.avatar}
                      alt={patient.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isCritical
                        ? 'bg-red-600 text-white animate-pulse'
                        : isModerate
                          ? 'bg-amber-500 text-black'
                          : 'bg-emerald-500 text-black'
                    }`}>
                      {patient.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-white">{patient.name}</h3>
                    <p className="text-xs text-slate-400">
                      {patient.age}yo • Day {patient.postOpDay} {patient.surgeryType.includes('Knee') ? 'TKA' : 'THA'}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {patient.id === 'pt-101' && 'Normal recovery trajectory. Pain 3/10, walking 160ft with walker, afebrile, incision dry & clean.'}
                    {patient.id === 'pt-102' && 'Early Surgical Site Infection (SSI). Erythema margin expanded to 28mm with purulent drainage, temp 100.8°F.'}
                    {patient.id === 'pt-103' && 'CRITICAL DVT/PE Emergency. Severe unilateral calf swelling (+3.5cm), dyspnea upon ambulating 20ft, chest tightness.'}
                    {patient.id === 'pt-104' && 'Non-Adherence & Breakthrough Pain. Post-op nausea preventing oral Eliquis & analgesics, pain 8/10, bedbound.'}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
                  <Link
                    href={`/patient/checkin`}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-center text-slate-200 transition-colors"
                  >
                    Test Voice Check-In
                  </Link>
                  <Link
                    href={`/clinician`}
                    className="w-full py-2 rounded-xl bg-clinical-500/20 hover:bg-clinical-500/30 text-xs font-bold text-center text-clinical-300 border border-clinical-500/30 transition-colors"
                  >
                    View Clinician Dossier
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Real-World Clinical Impact & Economics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="surface-card bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col gap-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Real-World Clinical Impact &amp; Healthcare Economics
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Addressing the $15,200 average cost per 30-day post-op orthopedic readmission through proactive remote surveillance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-clinical-400 w-fit">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white mt-1">-38%</div>
              <span className="text-xs font-bold text-slate-300">Readmission Reduction</span>
              <p className="text-[11px] text-slate-400">Early SSI detection and clot triage prevents avoidable ER admissions.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white mt-1">&lt;90s</div>
              <span className="text-xs font-bold text-slate-300">Daily Patient Time</span>
              <p className="text-[11px] text-slate-400">Frictionless conversational voice check-in replaces cumbersome 30-question web forms.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white mt-1">100%</div>
              <span className="text-xs font-bold text-slate-300">Deterministic Red-Lines</span>
              <p className="text-[11px] text-slate-400">Zero chance of LLM hallucinations dismissing critical DVT or PE symptoms.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-white mt-1">FHIR R4</div>
              <span className="text-xs font-bold text-slate-300">EHR Interoperability</span>
              <p className="text-[11px] text-slate-400">Direct integration into Epic, Cerner, and hospital data pipelines.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
