'use client';

import React from 'react';
import { UserCheck, ShieldAlert, AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react';
import { PatientProfile } from '@/lib/types/patient';
import { SEED_PATIENTS } from '@/lib/data/seed-patients';

interface PatientQuickSwitcherProps {
  currentPatientId: string;
  onSelectPatient: (patientId: string) => void;
  onResetStore?: () => void;
}

export default function PatientQuickSwitcher({
  currentPatientId,
  onSelectPatient,
  onResetStore
}: PatientQuickSwitcherProps) {
  return (
    <div className="w-full bg-slate-900 border border-slate-800/90 rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <UserCheck className="w-4 h-4 text-clinical-400" />
          <span>Select Test Recovery Profile (Judge Sandbox Presets):</span>
        </div>

        {onResetStore && (
          <button
            onClick={onResetStore}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Reset Demo Profiles</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {SEED_PATIENTS.map((p) => {
          const isSelected = p.id === currentPatientId;
          const isCritical = p.status === 'CRITICAL';
          const isModerate = p.status === 'MODERATE';

          return (
            <button
              key={p.id}
              onClick={() => onSelectPatient(p.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                isSelected
                  ? 'bg-slate-800 border-clinical-500 ring-2 ring-clinical-500/20 shadow-md'
                  : 'bg-slate-950/80 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white truncate">{p.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 ${
                  isCritical
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : isModerate
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isCritical && <ShieldAlert className="w-2.5 h-2.5" />}
                  {isModerate && <AlertTriangle className="w-2.5 h-2.5" />}
                  {!isCritical && !isModerate && <CheckCircle className="w-2.5 h-2.5" />}
                  <span>{p.status}</span>
                </span>
              </div>

              <div className="text-[11px] text-slate-400">
                <span>{p.surgeryType.includes('Knee') ? 'TKA Knee' : 'THA Hip'} • Day {p.postOpDay}</span>
              </div>

              <div className="text-[10px] text-slate-400 line-clamp-1 italic">
                {p.id === 'pt-101' && 'Normal trajectory, pain 3/10'}
                {p.id === 'pt-102' && 'Early SSI: 28mm redness, temp 100.8°F'}
                {p.id === 'pt-103' && 'Critical: DVT calf pain + chest tightness'}
                {p.id === 'pt-104' && 'Non-adherence: Nausea + 8/10 pain'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
