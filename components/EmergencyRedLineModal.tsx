'use client';

import React from 'react';
import { PhoneCall, AlertOctagon, HeartHandshake, ShieldAlert, ArrowRight } from 'lucide-react';
import { GuardrailCheckResult } from '@/lib/types/patient';

interface EmergencyModalProps {
  guardrails: GuardrailCheckResult;
  patientName: string;
  onDismiss?: () => void;
}

export default function EmergencyRedLineModal({
  guardrails,
  patientName,
  onDismiss
}: EmergencyModalProps) {
  if (!guardrails.isEmergencyOverride) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-950 border-4 border-red-600 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-950/80 flex flex-col gap-6 text-white">
        {/* Pulsing Emergency Header */}
        <div className="flex items-center gap-4 border-b border-red-900/60 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border-2 border-red-500 flex items-center justify-center shrink-0 animate-pulse">
            <AlertOctagon className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase bg-red-600 text-white tracking-wider">
                Emergency Red-Line Protocol
              </span>
              <span className="text-xs text-red-300 font-mono font-semibold">Bypass Code: {guardrails.emergencyCategory}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-red-400 mt-1">
              {guardrails.emergencyTitle || 'Critical Clinical Escalation Triggered'}
            </h2>
          </div>
        </div>

        {/* Primary Action Box */}
        <div className="bg-red-950/50 border-2 border-red-500/80 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">Mandatory Emergency Directive:</h3>
              <p className="text-sm sm:text-base text-red-200 mt-1 font-medium leading-relaxed">
                {guardrails.emergencyDirective}
              </p>
            </div>
          </div>

          {/* Quick Action Dial Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <a
              href="tel:911"
              className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-base sm:text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-red-600/40 transition-transform active:scale-95"
            >
              <PhoneCall className="w-6 h-6 animate-bounce" />
              <span>DIAL 911 NOW</span>
            </a>

            <a
              href="tel:5553498122"
              className="bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-sm py-4 px-6 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-clinical-400" />
              <span>Call Surgical On-Call</span>
            </a>
          </div>
        </div>

        {/* Clinical Rationale Details */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Deterministic Safety Criteria Triggered:</h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
            {guardrails.clinicalRationale.map((rationale, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>{rationale}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions while waiting */}
        <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-400 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
          <HeartHandshake className="w-5 h-5 text-teal-400 shrink-0" />
          <p>
            <strong>{patientName}</strong>, please remain calmly seated or lying down. Do NOT attempt to drive yourself. Your surgical triage team has received an automated high-priority alert.
          </p>
        </div>

        {onDismiss && (
          <div className="flex justify-end">
            <button
              onClick={onDismiss}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 underline transition-colors"
            >
              <span>Acknowledge and View Clinical Summary</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
