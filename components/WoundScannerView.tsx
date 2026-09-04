'use client';

import React, { useState } from 'react';
import { Camera, Scan, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { WoundAssessment } from '@/lib/types/patient';

interface WoundScannerViewProps {
  assessment?: WoundAssessment;
  isScanning: boolean;
  onRetake?: () => void;
}

export default function WoundScannerView({
  assessment,
  isScanning,
  onRetake
}: WoundScannerViewProps) {
  const [showOverlay, setShowOverlay] = useState(true);

  const imageUrl = assessment?.imageUrl || '/images/wounds/knee-baseline-clean.svg';
  const hasInfection = assessment && (assessment.erythemaMarginMm >= 20 || assessment.purulentDischarge);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-clinical-400 border border-teal-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">Surgical Incision Computer Vision Analysis</h3>
            <p className="text-xs text-slate-400">Automated erythema perimeter & staple approximation</p>
          </div>
        </div>

        {assessment && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                showOverlay
                  ? 'bg-clinical-500/20 text-clinical-300 border-clinical-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {showOverlay ? 'AI Diagnostics ON' : 'Raw View'}
            </button>
            {onRetake && (
              <button
                onClick={onRetake}
                title="Retake wound photo"
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Viewport Frame */}
      <div className="relative w-full aspect-square max-h-[380px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {/* Wound Image */}
        <img
          src={imageUrl}
          alt="Post-operative surgical incision"
          className="w-full h-full object-contain select-none"
        />

        {/* Laser Scanline Animation when scanning */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline" />
            <div className="absolute bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-2">
              <Scan className="w-4 h-4 animate-spin" />
              <span>Analyzing wound margin & pixel chromaticity...</span>
            </div>
          </div>
        )}

        {/* AI Diagnostics Overlay HUD */}
        {!isScanning && assessment && showOverlay && (
          <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
            {/* Top Risk Badge */}
            <div className="flex justify-between items-start">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-md ${
                hasInfection
                  ? 'bg-red-950/90 text-red-300 border border-red-500/50'
                  : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
              }`}>
                {hasInfection ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {hasInfection ? 'Erythema Expansion Flagged' : 'Normal Healing Perimeter'}
              </span>

              <span className="px-2 py-0.5 rounded bg-slate-900/90 text-[11px] font-mono font-semibold text-slate-300 border border-slate-700">
                Score: {assessment.visualRiskScore}/100
              </span>
            </div>

            {/* Bottom Floating Stats */}
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="block text-[10px] text-slate-400">Erythema Margin</span>
                <span className={`font-mono font-bold ${assessment.erythemaMarginMm >= 20 ? 'text-red-400 font-extrabold' : 'text-emerald-400'}`}>
                  {assessment.erythemaMarginMm} mm
                </span>
              </div>
              <div className="border-x border-slate-800">
                <span className="block text-[10px] text-slate-400">Dehiscence</span>
                <span className={`font-mono font-bold ${assessment.dehiscenceMm > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {assessment.dehiscenceMm} mm
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Exudate</span>
                <span className={`font-bold ${assessment.purulentDischarge ? 'text-red-400' : 'text-slate-300'}`}>
                  {assessment.drainageType}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clinical Vision Summary */}
      {assessment && (
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-clinical-400" />
            <span>AI Vision Diagnostic Summary</span>
          </div>
          <p className="text-slate-400 leading-relaxed">{assessment.aiVisionNotes}</p>
        </div>
      )}
    </div>
  );
}
