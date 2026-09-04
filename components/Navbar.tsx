'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Mic, 
  ShieldAlert, 
  LayoutDashboard, 
  Eye, 
  Volume2, 
  VolumeX, 
  Sparkles,
  FileText,
  HelpCircle
} from 'lucide-react';
import { useAccessibility } from './AccessibilityContext';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    highContrast, 
    toggleHighContrast, 
    fontSize, 
    setFontSize, 
    audioFeedbackEnabled, 
    toggleAudioFeedback 
  } = useAccessibility();

  const isPatient = pathname.startsWith('/patient');
  const isClinician = pathname.startsWith('/clinician');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Accessibility Bar */}
      <div className="bg-slate-900 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-clinical-400">
              <Sparkles className="w-3.5 h-3.5" /> AI Builders Hackathon 2026
            </span>
            <span className="text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">Orthopedic Post-Op Ambient Tele-Triage</span>
          </div>

          {/* Accessibility Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleHighContrast}
              aria-label="Toggle High Contrast Mode"
              className={`px-2 py-0.5 rounded border text-xs font-medium flex items-center gap-1 transition-colors ${
                highContrast 
                  ? 'bg-yellow-400 text-black border-yellow-300 font-bold' 
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{highContrast ? 'High Contrast ON' : 'High Contrast (WCAG)'}</span>
            </button>

            <div className="flex items-center border border-slate-700 rounded bg-slate-800 px-1 py-0.5 text-xs">
              <span className="text-slate-400 px-1 font-semibold">Text:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'normal' ? 'bg-clinical-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                100%
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'large' ? 'bg-clinical-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                125%
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'xlarge' ? 'bg-clinical-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                150%
              </button>
            </div>

            <button
              onClick={toggleAudioFeedback}
              title={audioFeedbackEnabled ? 'Disable Audio Voice Prompts' : 'Enable Audio Voice Prompts'}
              className={`p-1 rounded border text-xs transition-colors ${
                audioFeedbackEnabled 
                  ? 'bg-slate-800 text-clinical-400 border-slate-700' 
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {audioFeedbackEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-clinical-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-900/40 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-clinical-300 transition-colors">
                  PatientVoice
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-clinical-500/20 text-clinical-300 border border-clinical-500/30">
                  Clinical AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Ambient Post-Op Recovery & Guardrail Triage</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/patient/checkin"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isPatient
                  ? 'bg-clinical-500 text-slate-950 shadow-md shadow-clinical-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Patient Check-In</span>
            </Link>

            <Link
              href="/clinician"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isClinician
                  ? 'bg-clinical-500 text-slate-950 shadow-md shadow-clinical-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Clinician Hub</span>
            </Link>

            <Link
              href="/guardrails"
              className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/guardrails'
                  ? 'bg-slate-800 text-red-400 border border-red-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Emergency Rules</span>
            </Link>

            <Link
              href="/docs"
              className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all ${
                pathname === '/docs' ? 'bg-slate-800 text-white' : ''
              }`}
            >
              <FileText className="w-4 h-4 text-clinical-400" />
              <span>Architecture & FHIR</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
