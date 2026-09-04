'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Camera, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Heart, 
  CheckCircle, 
  Volume2, 
  RefreshCcw,
  UploadCloud,
  FileCheck,
  Activity
} from 'lucide-react';
import { getStoredPatients, getPatient, addCheckIn, resetSeedStore } from '@/lib/store/patient-store';
import { PatientProfile, CheckInRecord, WoundAssessment, Vitals } from '@/lib/types/patient';
import VoiceWaveformVisualizer from '@/components/VoiceWaveformVisualizer';
import WoundScannerView from '@/components/WoundScannerView';
import EmergencyRedLineModal from '@/components/EmergencyRedLineModal';
import PatientQuickSwitcher from '@/components/PatientQuickSwitcher';
import { useAccessibility } from '@/components/AccessibilityContext';

export default function PatientCheckInPage() {
  const { speakText, playTone } = useAccessibility();
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pt-101');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);

  // Voice Recording & Transcript State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Wound Vision State
  const [woundImage, setWoundImage] = useState<string>('/images/wounds/knee-baseline-clean.svg');
  const [woundAssessment, setWoundAssessment] = useState<WoundAssessment | undefined>(undefined);
  const [isScanningWound, setIsScanningWound] = useState(false);

  // Vitals State
  const [tempInput, setTempInput] = useState<number>(98.6);

  // Submission & Guardrail Result State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCheckIn, setSubmittedCheckIn] = useState<CheckInRecord | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Load patients on mount
  useEffect(() => {
    const loaded = getStoredPatients();
    setPatients(loaded);
    const p = loaded.find(item => item.id === selectedPatientId) || loaded[0];
    if (p) {
      setSelectedPatient(p);
      setWoundImage(p.baselineWoundImage || '/images/wounds/knee-baseline-clean.svg');
      setTempInput(p.latestCheckIn?.vitals.temperatureF || 98.6);
    }
  }, [selectedPatientId]);

  // Handle patient switch
  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    const p = getPatient(id);
    if (p) {
      setSelectedPatient(p);
      setSubmittedCheckIn(null);
      setTranscript('');
      setWoundAssessment(undefined);
      setWoundImage(p.baselineWoundImage || '/images/wounds/knee-baseline-clean.svg');
      setTempInput(p.latestCheckIn?.vitals.temperatureF || 98.6);
      playTone('beep');
    }
  };

  const handleReset = () => {
    const fresh = resetSeedStore();
    setPatients(fresh);
    handleSelectPatient('pt-101');
    playTone('success');
  };

  // Speech Recognition Handling
  const startRecording = () => {
    playTone('beep');
    setIsRecording(true);
    setRecordingSeconds(0);
    setTranscript('');

    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript + ' ';
        }
        setTranscript(current.trim());
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition error/fallback:', e);
      };

      rec.start();
      recognitionRef.current = rec;
    }
  };

  const stopRecording = () => {
    playTone('beep');
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
  };

  // Quick Preset Scenarios for Judge Testing
  const applyPresetScenario = (type: 'NORMAL' | 'INFECTION' | 'CRITICAL_DVT' | 'NON_ADHERENCE') => {
    stopRecording();
    playTone('beep');

    if (type === 'NORMAL') {
      setSelectedPatientId('pt-101');
      setTranscript("Good morning! My right knee is feeling a little stiff when I first get up, but the pain is around a 3 out of 10. I used my front-wheeled walker and did two laps around the living room—about 160 feet. I've taken my morning Eliquis and Tylenol, no stomach issues at all. No calf pain, breathing fine.");
      setWoundImage('/images/wounds/knee-baseline-clean.svg');
      setTempInput(98.6);
    } else if (type === 'INFECTION') {
      setSelectedPatientId('pt-102');
      setTranscript("Hi team. My left hip has been feeling noticeably hotter and throbbing more since yesterday afternoon. Pain has crept back up to a 6 out of 10. When I looked at the incision dressing this morning, the skin around it looks quite red and angry, spreading outward about an inch, and there was a bit of yellowish discharge on the gauze. I checked my temp and it was 100.8.");
      setWoundImage('/images/wounds/hip-infection-erythema.svg');
      setTempInput(100.8);
    } else if (type === 'CRITICAL_DVT') {
      setSelectedPatientId('pt-103');
      setTranscript("I woke up in serious trouble this morning. My left calf feels like it is on fire and swollen tight as a drum—much larger than my right leg. The calf pain is easily an 8 out of 10 whenever I try to put my heel down. On top of that, just walking 20 feet left me completely winded and out of breath with a tightness across my chest. I took my Lovenox yesterday evening, but I'm really frightened right now.");
      setWoundImage('/images/wounds/knee-baseline-clean.svg');
      setTempInput(99.4);
    } else if (type === 'NON_ADHERENCE') {
      setSelectedPatientId('pt-104');
      setTranscript("I'm having a very rough time today. I woke up so horribly nauseous that every time I tried to take my pain pill or my Eliquis blood thinner, I threw it straight back up. Because of that, my hip pain has shot up to an 8 out of 10. I haven't been able to get out of bed all morning, not even to use the walker. Incision looks dry, but I cannot keep any medicine down and I'm in tears from the pain.");
      setWoundImage('/images/wounds/hip-baseline-clean.svg');
      setTempInput(98.9);
    }
  };

  // Run computer vision scan on wound
  const handleScanWound = async () => {
    setIsScanningWound(true);
    playTone('beep');

    try {
      const res = await fetch('/api/checkin/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: woundImage,
          patientArchetype: selectedPatientId === 'pt-102' ? 'INFECTION' : selectedPatientId === 'pt-103' ? 'CRITICAL_DVT' : 'STABLE'
        })
      });
      const data = await res.json();
      if (data.success) {
        setWoundAssessment(data.assessment);
        playTone('success');
      }
    } catch (e) {
      console.error('Wound scan error:', e);
    } finally {
      setIsScanningWound(false);
    }
  };

  // Submit complete check-in
  const handleSubmitCheckIn = async () => {
    if (!transcript.trim()) {
      alert('Please record or enter a recovery voice update first.');
      return;
    }

    setIsSubmitting(true);
    playTone('beep');

    try {
      // Auto-run wound scan if not yet evaluated
      let assessmentToUse = woundAssessment;
      if (!assessmentToUse) {
        const visionRes = await fetch('/api/checkin/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: woundImage,
            patientArchetype: selectedPatientId === 'pt-102' ? 'INFECTION' : selectedPatientId === 'pt-103' ? 'CRITICAL_DVT' : 'STABLE'
          })
        });
        const vData = await visionRes.json();
        if (vData.success) {
          assessmentToUse = vData.assessment;
          setWoundAssessment(assessmentToUse);
        }
      }

      const vitals: Vitals = {
        temperatureF: tempInput,
        heartRateBpm: selectedPatientId === 'pt-103' ? 104 : 76,
        oxygenSatPercent: selectedPatientId === 'pt-103' ? 93 : 98
      };

      const res = await fetch('/api/checkin/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatientId,
          transcript,
          vitals,
          woundAssessment: assessmentToUse
        })
      });

      const data = await res.json();

      if (data.success) {
        setSubmittedCheckIn(data.checkIn);
        setSelectedPatient(data.patient);

        if (data.isEmergency) {
          playTone('alert');
          setShowEmergencyModal(true);
          speakText(`Emergency protocol activated: ${data.checkIn.guardrails.emergencyDirective}`);
        } else {
          playTone('success');
          speakText(`Thank you ${selectedPatient?.name}. Your daily recovery check-in has been analyzed and sent to your surgical team.`);
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedPatient) {
    return <div className="p-8 text-center text-slate-400">Loading patient profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Top Banner / Quick Selector for Hackathon Judges */}
      <PatientQuickSwitcher
        currentPatientId={selectedPatientId}
        onSelectPatient={handleSelectPatient}
        onResetStore={handleReset}
      />

      {/* Patient Header Card */}
      <div className="surface-card bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4 sm:gap-5">
          <img
            src={selectedPatient.avatar}
            alt={selectedPatient.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-clinical-500/40 shadow-lg shadow-teal-900/30"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white">{selectedPatient.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {selectedPatient.mrn}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-clinical-500/20 text-clinical-300 border border-clinical-500/30">
                Post-Op Day {selectedPatient.postOpDay}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              <strong>{selectedPatient.surgeryType}</strong> • {selectedPatient.primarySurgeon}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Ambulation: {selectedPatient.dischargeProtocols.targetAmbulationFeetDay3} ft • Pain Goal: ≤ {selectedPatient.dischargeProtocols.maxAcceptablePain}/10
            </p>
          </div>
        </div>

        {/* Emergency Red-Line Warning Reminder */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shrink-0 max-w-xs">
          <ShieldCheck className="w-8 h-8 text-teal-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-200 block">Deterministic Guardrails Active</span>
            <span className="text-slate-400 text-[11px]">Instant 911 / ER bypass for DVT or PE symptoms</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Voice Check-In (Left) + Wound Vision (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Check-In Module (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="surface-card bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-clinical-400 border border-teal-500/20 flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg text-white">Daily Voice Recovery Check-In</h2>
                  <p className="text-xs text-slate-400">Speak naturally for &lt;90s. AI extracts pain, mobility, and safety red-lines.</p>
                </div>
              </div>

              <span className="text-xs text-clinical-400 font-semibold hidden sm:inline">
                Web Speech API Ready
              </span>
            </div>

            {/* Quick Test Scenario Buttons for Judges */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Judge Quick-Fill Presets:
                </span>
                <span className="text-[10px] text-slate-500">1-Click Test Scenarios</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => applyPresetScenario('NORMAL')}
                  className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-emerald-950/40 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30 hover:border-emerald-500 transition-all text-left"
                >
                  🟢 1. Normal Recovery
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScenario('INFECTION')}
                  className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-amber-950/40 text-[11px] font-semibold text-amber-300 border border-amber-500/30 hover:border-amber-500 transition-all text-left"
                >
                  🟡 2. SSI / Redness
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScenario('CRITICAL_DVT')}
                  className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-red-950/40 text-[11px] font-semibold text-red-300 border border-red-500/30 hover:border-red-500 transition-all text-left"
                >
                  🔴 3. DVT / PE Alert
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetScenario('NON_ADHERENCE')}
                  className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-purple-950/40 text-[11px] font-semibold text-purple-300 border border-purple-500/30 hover:border-purple-500 transition-all text-left"
                >
                  🟣 4. Nausea & Pain
                </button>
              </div>
            </div>

            {/* Live Waveform Visualizer */}
            <VoiceWaveformVisualizer
              isRecording={isRecording}
              durationSeconds={recordingSeconds}
            />

            {/* Big Tactile Record Button */}
            <div className="flex flex-col items-center justify-center gap-3 py-2">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                aria-label={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center gap-1 transition-all transform active:scale-95 shadow-2xl ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-500 text-white ring-8 ring-red-600/30 animate-pulse'
                    : 'bg-gradient-to-tr from-clinical-600 to-teal-400 hover:from-clinical-500 hover:to-teal-300 text-slate-950 ring-8 ring-teal-500/20'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8 sm:w-10 sm:h-10" /> : <Mic className="w-8 h-8 sm:w-10 sm:h-10" />}
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {isRecording ? 'Tap to Stop' : 'Tap to Speak'}
                </span>
              </button>

              <p className="text-xs text-slate-400 text-center max-w-sm">
                {isRecording
                  ? 'Listening... Describe your pain, walking distance, medications, and any symptoms.'
                  : 'Press the microphone to record your check-in or click any scenario above.'}
              </p>
            </div>

            {/* Transcript Text Area */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Transcript / Patient Response:</span>
                <span className="text-slate-500 font-normal">Editable for correction</span>
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Your voice check-in transcript will appear here in real-time..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-clinical-500 focus:border-transparent leading-relaxed"
              />
            </div>

            {/* Core Vitals Input (Optional Temp adjustment) */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-slate-200 block">Core Body Temperature (°F)</label>
                <span className="text-[11px] text-slate-400">Threshold: ≥ 101.5°F triggers urgent infection guardrail</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="96.0"
                  max="106.0"
                  value={tempInput}
                  onChange={(e) => setTempInput(parseFloat(e.target.value) || 98.6)}
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-white text-center focus:outline-none focus:ring-2 focus:ring-clinical-500"
                />
                <span className="text-xs text-slate-400 font-semibold">°F</span>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="button"
              onClick={handleSubmitCheckIn}
              disabled={isSubmitting || !transcript.trim()}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                isSubmitting || !transcript.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-clinical-500 hover:bg-clinical-400 text-slate-950 shadow-clinical-500/30 active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  <span>Evaluating Clinical Guardrails & Metrics...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Daily Check-In to Surgical Team</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Wound Photo Evaluation & Results (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Wound Scanner Card */}
          <WoundScannerView
            assessment={woundAssessment}
            isScanning={isScanningWound}
            onRetake={() => {
              setWoundAssessment(undefined);
              handleScanWound();
            }}
          />

          {/* Quick Wound Image Selector Dropzone */}
          <div className="surface-card bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-teal-400" /> Select Wound Image Sample:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setWoundImage('/images/wounds/knee-baseline-clean.svg');
                  setWoundAssessment(undefined);
                }}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                  woundImage.includes('clean')
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Clean Incision</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWoundImage('/images/wounds/hip-infection-erythema.svg');
                  setWoundAssessment(undefined);
                }}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                  woundImage.includes('infection')
                    ? 'bg-red-950/40 border-red-500 text-red-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Erythema / SSI</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleScanWound}
              disabled={isScanningWound}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Camera className="w-4 h-4 text-clinical-400" />
              <span>Run Incision Computer Vision Analysis</span>
            </button>
          </div>

          {/* Submission Result / Guidance Readout */}
          {submittedCheckIn && (
            <div className={`surface-card border rounded-3xl p-5 flex flex-col gap-3 shadow-xl animate-fade-in ${
              submittedCheckIn.riskLevel === 'CRITICAL'
                ? 'bg-red-950/30 border-red-500/60'
                : submittedCheckIn.riskLevel === 'MODERATE'
                  ? 'bg-amber-950/30 border-amber-500/60'
                  : 'bg-emerald-950/30 border-emerald-500/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Evaluation Result</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  submittedCheckIn.riskLevel === 'CRITICAL'
                    ? 'bg-red-600 text-white'
                    : submittedCheckIn.riskLevel === 'MODERATE'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-emerald-500 text-slate-950'
                }`}>
                  {submittedCheckIn.riskLevel} TRIAGE
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {submittedCheckIn.aiSummary}
              </p>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Extracted Pain Score</span>
                  <span className="font-mono font-bold text-white">{submittedCheckIn.voiceMetrics.painScore}/10</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ambulation</span>
                  <span className="font-mono font-bold text-emerald-400">{submittedCheckIn.voiceMetrics.ambulationFeetToday} ft</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Med Adherence</span>
                  <span className="font-bold text-clinical-400">{submittedCheckIn.voiceMetrics.medicationAdherence}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Red-Line Modal Takeover */}
      {submittedCheckIn && showEmergencyModal && (
        <EmergencyRedLineModal
          guardrails={submittedCheckIn.guardrails}
          patientName={selectedPatient.name}
          onDismiss={() => setShowEmergencyModal(false)}
        />
      )}
    </div>
  );
}
