'use client';

import React from 'react';
import { TrendingUp, Footprints, Flame, Pill, Activity } from 'lucide-react';
import { PatientProfile, CheckInRecord } from '@/lib/types/patient';

interface RecoveryMetricsChartProps {
  patient: PatientProfile;
}

export default function RecoveryMetricsChart({ patient }: RecoveryMetricsChartProps) {
  const allCheckIns = [...patient.historyCheckIns];
  if (patient.latestCheckIn && !allCheckIns.find(c => c.id === patient.latestCheckIn?.id)) {
    allCheckIns.push(patient.latestCheckIn);
  }

  // Sort chronologically by postOpDay
  allCheckIns.sort((a, b) => a.postOpDay - b.postOpDay);

  const targetAmbulation = patient.dischargeProtocols.targetAmbulationFeetDay3 || 150;
  const maxPainThreshold = patient.dischargeProtocols.maxAcceptablePain || 5;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-clinical-400 border border-teal-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Longitudinal Recovery Biomarkers</h3>
            <p className="text-xs text-slate-400">Multi-day metric progression for {patient.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Pain (0-10)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Ambulation (ft)</span>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pain Trend Tracker */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Pain Score Curve (Target ≤ {maxPainThreshold}/10)
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">
              Latest: {patient.latestCheckIn?.voiceMetrics.painScore ?? 3}/10
            </span>
          </div>

          <div className="h-32 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-800">
            {allCheckIns.map((chk, idx) => {
              const score = chk.voiceMetrics.painScore;
              const heightPercent = Math.min(100, Math.max(10, (score / 10) * 100));
              const isOverLimit = score > maxPainThreshold;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className={`text-[11px] font-bold font-mono ${isOverLimit ? 'text-red-400 font-extrabold' : 'text-slate-300'}`}>
                    {score}
                  </span>
                  <div
                    className={`w-full max-w-[32px] rounded-t-lg transition-all ${
                      isOverLimit 
                        ? 'bg-gradient-to-t from-red-600 to-rose-400' 
                        : 'bg-gradient-to-t from-teal-600 to-cyan-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-slate-400 font-medium">Day {chk.postOpDay}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ambulation Tracker */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-400" /> Ambulation Distance (Target: {targetAmbulation} ft)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Latest: {patient.latestCheckIn?.voiceMetrics.ambulationFeetToday ?? 120} ft
            </span>
          </div>

          <div className="h-32 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-800">
            {allCheckIns.map((chk, idx) => {
              const feet = chk.voiceMetrics.ambulationFeetToday;
              const maxScale = Math.max(targetAmbulation * 1.3, 200);
              const heightPercent = Math.min(100, Math.max(8, (feet / maxScale) * 100));
              const reachedGoal = feet >= targetAmbulation;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className={`text-[11px] font-bold font-mono ${reachedGoal ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {feet}ft
                  </span>
                  <div
                    className={`w-full max-w-[32px] rounded-t-lg transition-all ${
                      reachedGoal
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                        : 'bg-gradient-to-t from-amber-600 to-yellow-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-slate-400 font-medium">Day {chk.postOpDay}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Temperature & Medication Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Core Temperature */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200">Core Body Temperature</span>
              <p className="text-[11px] text-slate-400">Fever Red-Line: ≥ 101.5°F</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`font-mono text-base font-extrabold ${
              (patient.latestCheckIn?.vitals.temperatureF ?? 98.6) >= 101.5 
                ? 'text-red-400' 
                : (patient.latestCheckIn?.vitals.temperatureF ?? 98.6) >= 100.4
                  ? 'text-amber-400'
                  : 'text-emerald-400'
            }`}>
              {patient.latestCheckIn?.vitals.temperatureF ?? 98.6}°F
            </span>
          </div>
        </div>

        {/* Anticoagulant & Medication Compliance */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200">Anticoagulant Protocol</span>
              <p className="text-[11px] text-slate-400">{patient.dischargeProtocols.anticoagulationProtocol}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              patient.latestCheckIn?.voiceMetrics.medicationAdherence === 'FULL'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {patient.latestCheckIn?.voiceMetrics.medicationAdherence || 'FULL'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
