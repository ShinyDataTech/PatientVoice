'use client';

import React, { useState } from 'react';
import { Copy, Check, FileCode, Stethoscope, Share2 } from 'lucide-react';
import { CheckInRecord } from '@/lib/types/patient';

interface SbarNoteViewerProps {
  checkIn: CheckInRecord;
  patientName: string;
  onOpenFhirModal?: () => void;
}

export default function SbarNoteViewer({
  checkIn,
  patientName,
  onOpenFhirModal
}: SbarNoteViewerProps) {
  const [copied, setCopied] = useState(false);
  const sbar = checkIn.sbarNote;

  const fullSbarText = `CLINICAL SBAR NOTE - PATIENTVOICE AMBIENT SURVEILLANCE
PATIENT: ${patientName} (Post-Op Day ${checkIn.postOpDay})
TIMESTAMP: ${new Date(checkIn.timestamp).toLocaleString()}
TRIAGE LEVEL: ${checkIn.riskLevel}

[S] SITUATION:
${sbar.situation}

[B] BACKGROUND:
${sbar.background}

[A] ASSESSMENT:
${sbar.assessment}

[R] RECOMMENDATION:
${sbar.recommendation}

GUARDRAIL ACTIONS: ${checkIn.guardrails.actionRequired}
RATIONALE: ${checkIn.guardrails.clinicalRationale.join('; ')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSbarText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Pre-Drafted SBAR Clinical Escalation Note</h3>
            <p className="text-xs text-slate-400">Automated synthesized EHR handover note</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to EMR Clipboard' : 'Copy SBAR'}</span>
          </button>

          {onOpenFhirModal && (
            <button
              onClick={onOpenFhirModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clinical-500/20 hover:bg-clinical-500/30 text-clinical-300 text-xs font-semibold border border-clinical-500/40 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>FHIR R4 JSON</span>
            </button>
          )}
        </div>
      </div>

      {/* SBAR Grid */}
      <div className="space-y-3 text-xs leading-relaxed">
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
          <span className="font-extrabold text-indigo-400 block mb-1 tracking-wide">
            [S] SITUATION
          </span>
          <p className="text-slate-200">{sbar.situation}</p>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
          <span className="font-extrabold text-sky-400 block mb-1 tracking-wide">
            [B] BACKGROUND
          </span>
          <p className="text-slate-200">{sbar.background}</p>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
          <span className="font-extrabold text-amber-400 block mb-1 tracking-wide">
            [A] ASSESSMENT
          </span>
          <p className="text-slate-200">{sbar.assessment}</p>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
          <span className="font-extrabold text-emerald-400 block mb-1 tracking-wide">
            [R] RECOMMENDATION
          </span>
          <p className="text-slate-200">{sbar.recommendation}</p>
        </div>
      </div>
    </div>
  );
}
