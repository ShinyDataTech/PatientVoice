'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, ExternalLink } from 'lucide-react';
import { PatientProfile } from '@/lib/types/patient';
import { generateFHIRBundle } from '@/lib/fhir/exporter';

interface FhirModalProps {
  patient: PatientProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function FhirModal({ patient, isOpen, onClose }: FhirModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fhirBundle = generateFHIRBundle(patient);
  const jsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/fhir+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fhir-clinical-impression-${patient.mrn}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-clinical-400 border border-teal-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>HL7® FHIR® R4 Clinical Resource Payload</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-clinical-500/20 text-clinical-300 font-mono">
                  Epic / Cerner Interoperable
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                FHIR Bundle (ClinicalImpression + Observations) for {patient.name} ({patient.mrn})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-clinical-600 hover:bg-clinical-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* JSON Content Display */}
        <div className="p-4 flex-1 overflow-y-auto bg-slate-900/80 font-mono text-xs text-emerald-400">
          <pre className="whitespace-pre-wrap">{jsonString}</pre>
        </div>

        {/* Footer Note */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Standards: HL7 FHIR Release 4 (LOINC & SNOMED CT Ontology Mapping)</span>
          <a
            href={`/api/patient/${patient.id}/fhir`}
            target="_blank"
            rel="noreferrer"
            className="text-clinical-400 hover:underline flex items-center gap-1"
          >
            <span>Raw Endpoint (/api/patient/{patient.id}/fhir)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
