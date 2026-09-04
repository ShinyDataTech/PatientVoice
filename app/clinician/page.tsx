'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Stethoscope, 
  RefreshCcw, 
  FileCode, 
  Send, 
  PhoneCall, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  UserCheck
} from 'lucide-react';
import { getStoredPatients, logClinicianAction, resetSeedStore, getPatient } from '@/lib/store/patient-store';
import { PatientProfile, CheckInRecord, ClinicianActionType } from '@/lib/types/patient';
import WoundDiffViewer from '@/components/WoundDiffViewer';
import RecoveryMetricsChart from '@/components/RecoveryMetricsChart';
import SbarNoteViewer from '@/components/SbarNoteViewer';
import FhirModal from '@/components/FhirModal';
import { useAccessibility } from '@/components/AccessibilityContext';

export default function ClinicianTriageHub() {
  const { playTone, speakText } = useAccessibility();
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pt-103'); // Default to Critical DVT case
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'CRITICAL' | 'MODERATE' | 'STABLE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFhirModalOpen, setIsFhirModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchPatients = () => {
    const loaded = getStoredPatients();
    setPatients(loaded);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleResetData = () => {
    const fresh = resetSeedStore();
    setPatients(fresh);
    setSelectedPatientId('pt-103');
    playTone('success');
    setActionSuccessMsg('Clinical patient store reset to default multi-archetype seed.');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleExecuteClinicalOrder = async (
    actionType: ClinicianActionType,
    nurseNotes: string,
    resolveAlert: boolean = true
  ) => {
    if (!selectedPatient) return;
    playTone('beep');

    try {
      const res = await fetch('/api/clinician/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          actionType,
          nurseName: 'RN Sarah Miller, Orthopedic Tele-Triage Coordinator',
          notes: nurseNotes,
          resolveAlert
        })
      });

      const data = await res.json();
      if (data.success) {
        fetchPatients();
        playTone('success');
        setActionSuccessMsg(`Action Executed: ${nurseNotes}`);
        speakText(`Clinical action logged: ${nurseNotes}`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error('Error logging clinical action:', e);
    }
  };

  // Filter patients
  const filteredPatients = patients.filter(p => {
    const matchesFilter = filterRisk === 'ALL' || p.status === filterRisk;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.surgeryType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const criticalCount = patients.filter(p => p.status === 'CRITICAL').length;
  const moderateCount = patients.filter(p => p.status === 'MODERATE').length;
  const stableCount = patients.filter(p => p.status === 'STABLE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Top Banner & Stats Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Clinician Triage Command Center</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Actionable Post-Discharge Orthopedic Surveillance & Guardrail Escalation Queue
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          {selectedPatient && (
            <button
              onClick={() => setIsFhirModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-clinical-500/20 hover:bg-clinical-500/30 text-clinical-300 text-xs font-bold border border-clinical-500/40 transition-colors"
            >
              <FileCode className="w-4 h-4" />
              <span>Export FHIR R4 Bundle</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="bg-emerald-950/80 border-2 border-emerald-500/80 rounded-2xl p-4 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Triage Priority Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Surveillance */}
        <div className="surface-card bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monitored Cohort</span>
            <div className="text-2xl font-black text-white mt-0.5">{patients.length} Patients</div>
            <span className="text-[11px] text-slate-500">Total Joint Replacements</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-slate-300">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Critical Red Alert */}
        <div 
          onClick={() => setFilterRisk('CRITICAL')}
          className={`surface-card border rounded-2xl p-4 flex items-center justify-between shadow-lg cursor-pointer transition-all ${
            filterRisk === 'CRITICAL' ? 'ring-2 ring-red-500 bg-red-950/40 border-red-500' : 'bg-slate-900 border-slate-800 hover:border-red-500/50'
          }`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Critical Escalations
            </span>
            <div className="text-2xl font-black text-red-400 mt-0.5">{criticalCount} Active</div>
            <span className="text-[11px] text-red-300/80">Immediate ER / DVT / PE Bypass</span>
          </div>
          <div className="p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Moderate Amber Review */}
        <div 
          onClick={() => setFilterRisk('MODERATE')}
          className={`surface-card border rounded-2xl p-4 flex items-center justify-between shadow-lg cursor-pointer transition-all ${
            filterRisk === 'MODERATE' ? 'ring-2 ring-amber-500 bg-amber-950/40 border-amber-500' : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Moderate Reviews</span>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{moderateCount} Flagged</div>
            <span className="text-[11px] text-amber-300/80">Wound SSI / Pain Adherence</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Stable Green */}
        <div 
          onClick={() => setFilterRisk('STABLE')}
          className={`surface-card border rounded-2xl p-4 flex items-center justify-between shadow-lg cursor-pointer transition-all ${
            filterRisk === 'STABLE' ? 'ring-2 ring-emerald-500 bg-emerald-950/40 border-emerald-500' : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Stable Recoveries</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{stableCount} On Track</div>
            <span className="text-[11px] text-emerald-300/80">Protocols Meeting Targets</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Triage Workspace: Patients Table & Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Queue List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="surface-card bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
            {/* Search & Filter Controls */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patient, MRN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-clinical-500"
                />
              </div>

              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 font-semibold focus:outline-none"
              >
                <option value="ALL">All ({patients.length})</option>
                <option value="CRITICAL">Critical ({criticalCount})</option>
                <option value="MODERATE">Moderate ({moderateCount})</option>
                <option value="STABLE">Stable ({stableCount})</option>
              </select>
            </div>

            {/* Patient Cards List */}
            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatient?.id;
                const isCritical = p.status === 'CRITICAL';
                const isModerate = p.status === 'MODERATE';
                const latest = p.latestCheckIn;

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      playTone('beep');
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-slate-800/90 border-clinical-500 ring-2 ring-clinical-500/30 shadow-lg'
                        : isCritical
                          ? 'bg-red-950/20 border-red-900/60 hover:bg-slate-800/60'
                          : isModerate
                            ? 'bg-amber-950/20 border-amber-900/60 hover:bg-slate-800/60'
                            : 'bg-slate-950/80 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-white">{p.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {p.mrn} • Day {p.postOpDay}
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        isCritical
                          ? 'bg-red-600 text-white animate-pulse'
                          : isModerate
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-emerald-500 text-slate-950'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 font-medium">
                      {p.surgeryType}
                    </div>

                    {latest && (
                      <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Pain: <strong className="text-white">{latest.voiceMetrics.painScore}/10</strong></span>
                        <span>Amb: <strong className="text-emerald-400">{latest.voiceMetrics.ambulationFeetToday}ft</strong></span>
                        <span>Temp: <strong className={latest.vitals.temperatureF >= 100.4 ? 'text-amber-400' : 'text-slate-300'}>{latest.vitals.temperatureF}°F</strong></span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep-Dive Patient Clinical Dossier (8 cols) */}
        {selectedPatient && (
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Active Patient Hero Banner */}
            <div className={`surface-card border rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl ${
              selectedPatient.status === 'CRITICAL'
                ? 'bg-red-950/30 border-red-500/60'
                : selectedPatient.status === 'MODERATE'
                  ? 'bg-amber-950/30 border-amber-500/60'
                  : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center gap-4">
                <img
                  src={selectedPatient.avatar}
                  alt={selectedPatient.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-white">{selectedPatient.name}</h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {selectedPatient.mrn}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      selectedPatient.status === 'CRITICAL' ? 'bg-red-600 text-white' : selectedPatient.status === 'MODERATE' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black'
                    }`}>
                      {selectedPatient.status} TRIAGE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {selectedPatient.age}yo {selectedPatient.gender} • {selectedPatient.surgeryType} (Day {selectedPatient.postOpDay})
                  </p>
                  <p className="text-xs text-slate-400">
                    Surgeon: {selectedPatient.primarySurgeon} • Facility: {selectedPatient.surgicalFacility}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Emergency Contact</span>
                <span className="text-xs font-semibold text-slate-200 block">
                  {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relationship})
                </span>
                <span className="text-xs text-teal-400 font-mono font-bold">
                  {selectedPatient.emergencyContact.phone}
                </span>
              </div>
            </div>

            {/* Deterministic Guardrail Alert Callout if present */}
            {selectedPatient.latestCheckIn?.guardrails.isEmergencyOverride && (
              <div className="bg-red-950 border-2 border-red-500 rounded-2xl p-5 flex flex-col gap-2 shadow-2xl shadow-red-950/50 animate-pulse">
                <div className="flex items-center gap-2 text-red-400 font-black text-base">
                  <ShieldAlert className="w-6 h-6" />
                  <span>{selectedPatient.latestCheckIn.guardrails.emergencyTitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-red-200 font-semibold">
                  {selectedPatient.latestCheckIn.guardrails.emergencyDirective}
                </p>
                <div className="mt-2 text-xs text-red-300">
                  <strong>Triggered Rules:</strong> {selectedPatient.latestCheckIn.guardrails.clinicalRationale.join('; ')}
                </div>
              </div>
            )}

            {/* Quick 1-Click Clinical Action Orders Panel */}
            <div className="surface-card bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-clinical-400" /> One-Click Clinical Order & Triage Dispatch:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {/* Action 1: Page Fellow */}
                <button
                  onClick={() => handleExecuteClinicalOrder('PAGE_FELLOW', 'STAT Page sent to On-Call Orthopedic Fellow for emergency review.')}
                  className="p-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-2 text-left transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-red-400 shrink-0" />
                  <span>🚨 Page On-Call Fellow</span>
                </button>

                {/* Action 2: Doppler Ultrasound */}
                <button
                  onClick={() => handleExecuteClinicalOrder('ORDER_DOPPLER_US', 'STAT Bilateral Lower Extremity Venous Duplex Ultrasound ordered.')}
                  className="p-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center gap-2 text-left transition-all"
                >
                  <Activity className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>🩺 Order STAT Doppler US</span>
                </button>

                {/* Action 3: Dispatch Home Health */}
                <button
                  onClick={() => handleExecuteClinicalOrder('DISPATCH_HOME_HEALTH', 'Home Health RN dispatched for same-day surgical site wound swab and assessment.')}
                  className="p-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 text-left transition-all"
                >
                  <Stethoscope className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>🏥 Dispatch Home Health RN</span>
                </button>

                {/* Action 4: Medication Adjustment */}
                <button
                  onClick={() => handleExecuteClinicalOrder('MED_ADJUSTMENT', 'Prescribed dissolvable Ondansetron ODT 4mg and revised analgesic schedule.')}
                  className="p-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-2 text-left transition-all"
                >
                  <Send className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>💊 Adjust Meds / Anti-Emetic</span>
                </button>

                {/* Action 5: Phone Triage */}
                <button
                  onClick={() => handleExecuteClinicalOrder('PHONE_TRIAGE_COMPLETED', 'Nurse conducted tele-triage call; symptoms reconciled and reassessed.')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 text-left transition-all"
                >
                  <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>📞 Log Phone Triage Note</span>
                </button>

                {/* Action 6: Resolve Stable */}
                <button
                  onClick={() => handleExecuteClinicalOrder('RESOLVED_STABLE', 'Patient assessed as recovering within expected clinical parameters. Alert marked resolved.', true)}
                  className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 text-left transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>✅ Mark Alert Resolved</span>
                </button>
              </div>
            </div>

            {/* Side-by-Side Wound Visual Comparison Diff Viewer */}
            <WoundDiffViewer
              assessment={selectedPatient.latestCheckIn?.woundAssessment}
              baselineImageUrl={selectedPatient.baselineWoundImage}
              patientName={selectedPatient.name}
              postOpDay={selectedPatient.postOpDay}
            />

            {/* Longitudinal Recovery Biomarkers Chart */}
            <RecoveryMetricsChart patient={selectedPatient} />

            {/* Automated SBAR Clinical Note */}
            {selectedPatient.latestCheckIn && (
              <SbarNoteViewer
                checkIn={selectedPatient.latestCheckIn}
                patientName={selectedPatient.name}
                onOpenFhirModal={() => setIsFhirModalOpen(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* FHIR R4 Modal */}
      {selectedPatient && (
        <FhirModal
          patient={selectedPatient}
          isOpen={isFhirModalOpen}
          onClose={() => setIsFhirModalOpen(false)}
        />
      )}
    </div>
  );
}
