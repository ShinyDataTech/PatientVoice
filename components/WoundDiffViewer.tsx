'use client';

import React, { useState } from 'react';
import { Columns, SplitSquareVertical, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { WoundAssessment } from '@/lib/types/patient';

interface WoundDiffViewerProps {
  assessment?: WoundAssessment;
  baselineImageUrl?: string;
  patientName: string;
  postOpDay: number;
}

export default function WoundDiffViewer({
  assessment,
  baselineImageUrl = '/images/wounds/knee-baseline-clean.svg',
  patientName,
  postOpDay
}: WoundDiffViewerProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'split'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);

  const currentImage = assessment?.imageUrl || baselineImageUrl;
  const baselineImage = assessment?.baselineImageUrl || baselineImageUrl;

  const erythemaDelta = (assessment?.erythemaMarginMm ?? 4) - (assessment?.erythemaMarginBaselineMm ?? 4);
  const isHighRisk = (assessment?.erythemaMarginMm ?? 0) >= 20 || assessment?.purulentDischarge;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-white">Visual Wound Progression & Diff Matrix</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              isHighRisk ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isHighRisk ? 'Erythema Expansion Flagged' : 'Stable Healing Margin'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparing Day 0 Surgical Baseline against Day {postOpDay} Remote Capture for {patientName}
          </p>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold transition-colors ${
              viewMode === 'side-by-side' ? 'bg-clinical-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold transition-colors ${
              viewMode === 'split' ? 'bg-clinical-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Interactive Slider</span>
          </button>
        </div>
      </div>

      {/* Comparison Viewport */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Baseline Day 0 Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Day 0 / Baseline In-OR Discharge
              </span>
              <span className="text-slate-500 font-mono">Erythema: 4 mm</span>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
              <img
                src={baselineImage}
                alt="Baseline surgical wound"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Current Day Post-Op Card */}
          <div className={`bg-slate-950 border rounded-xl p-3 flex flex-col gap-2 ${
            isHighRisk ? 'border-red-500/40 bg-red-950/10' : 'border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                {isHighRisk ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                <span>Day {postOpDay} Today Remote Capture</span>
              </span>
              <span className={`font-mono font-bold ${isHighRisk ? 'text-red-400' : 'text-emerald-400'}`}>
                Erythema: {assessment?.erythemaMarginMm ?? 4} mm
              </span>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
              <img
                src={currentImage}
                alt="Current surgical wound"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Split Slider Mode */
        <div className="flex flex-col gap-3">
          <div className="relative w-full aspect-video max-h-[380px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 select-none">
            {/* Current Image (Full Background) */}
            <img
              src={currentImage}
              alt="Current wound"
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Baseline Image (Clipped by slider position) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-cyan-400 shadow-xl"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={baselineImage}
                alt="Baseline wound"
                className="absolute inset-y-0 left-0 w-full h-full object-contain max-w-none"
                style={{ width: '100%' }}
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded text-[11px] font-bold text-slate-200 border border-slate-700">
                Baseline Day 0
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded text-[11px] font-bold text-white border border-slate-700">
              Day {postOpDay} Today
            </div>

            {/* Split Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-lg">
                ↔
              </div>
            </div>
          </div>

          {/* Slider input control */}
          <div className="flex items-center gap-3 px-2">
            <span className="text-xs text-slate-400 font-semibold">Baseline</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="flex-1 accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <span className="text-xs text-slate-400 font-semibold">Today</span>
          </div>
        </div>
      )}

      {/* Quantitative Delta Metrics Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Erythema Delta</span>
          <span className={`font-mono font-extrabold text-sm ${erythemaDelta > 10 ? 'text-red-400' : 'text-emerald-400'}`}>
            {erythemaDelta > 0 ? `+${erythemaDelta} mm` : `${erythemaDelta} mm`}
          </span>
        </div>
        <div className="border-l border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Wound Edge Gap</span>
          <span className={`font-mono font-extrabold text-sm ${(assessment?.dehiscenceMm ?? 0) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {assessment?.dehiscenceMm ?? 0} mm
          </span>
        </div>
        <div className="border-l border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Purulent Exudate</span>
          <span className={`font-extrabold text-sm ${assessment?.purulentDischarge ? 'text-red-400' : 'text-slate-300'}`}>
            {assessment?.purulentDischarge ? 'POSITIVE' : 'NEGATIVE'}
          </span>
        </div>
        <div className="border-l border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Staple Integrity</span>
          <span className="font-mono font-extrabold text-sm text-clinical-400">
            {assessment?.stapleIntegrityPercent ?? 100}%
          </span>
        </div>
      </div>
    </div>
  );
}
