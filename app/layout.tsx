import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/components/AccessibilityContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'PatientVoice: Ambient Post-Op Recovery & Symptom Escalation Assistant',
  description: 'AI-driven post-discharge ambient voice & wound surveillance agent with deterministic emergency clinical guardrails for orthopedic surgery recovery.',
  keywords: ['orthopedic surgery', 'post-op recovery', 'ambient clinical AI', 'tele-triage', 'wound analysis', 'FHIR', 'DVT prevention'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col">
        <AccessibilityProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>PatientVoice™ • Ambient Clinical AI & Orthopedic Recovery Escalator • AI Builders Hackathon 2026</p>
              <p className="text-slate-400">HL7® FHIR® R4 Interoperable • Deterministic Guardrail Architecture</p>
            </div>
          </footer>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
