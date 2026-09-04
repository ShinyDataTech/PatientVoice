'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  audioFeedbackEnabled: boolean;
  toggleAudioFeedback: () => void;
  speakText: (text: string) => void;
  playTone: (type: 'beep' | 'success' | 'alert') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState(true);

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const savedHC = localStorage.getItem('pv_high_contrast') === 'true';
      const savedFS = localStorage.getItem('pv_font_size') as 'normal' | 'large' | 'xlarge';
      if (savedHC) setHighContrast(true);
      if (savedFS) setFontSize(savedFS);
    } catch (e) {
      // Ignore
    }
  }, []);

  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      try { localStorage.setItem('pv_high_contrast', String(next)); } catch (e) {}
      return next;
    });
  };

  const updateFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSize(size);
    try { localStorage.setItem('pv_font_size', size); } catch (e) {}
  };

  const toggleAudioFeedback = () => {
    setAudioFeedbackEnabled(prev => !prev);
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !audioFeedbackEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // slightly slower for clinical clarity
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const playTone = (type: 'beep' | 'success' | 'alert') => {
    if (typeof window === 'undefined' || !audioFeedbackEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'beep') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-lg';
    if (fontSize === 'xlarge') return 'text-xl';
    return '';
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        fontSize,
        setFontSize: updateFontSize,
        audioFeedbackEnabled,
        toggleAudioFeedback,
        speakText,
        playTone
      }}
    >
      <div className={`${highContrast ? 'high-contrast' : ''} ${getFontSizeClass()} min-h-screen transition-all duration-200`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
