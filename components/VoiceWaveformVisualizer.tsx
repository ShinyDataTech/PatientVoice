'use client';

import React, { useEffect, useRef } from 'react';

interface VoiceWaveformProps {
  isRecording: boolean;
  durationSeconds: number;
}

export default function VoiceWaveformVisualizer({ isRecording, durationSeconds }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Base line
      ctx.beginPath();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      if (isRecording) {
        // Draw 3 dynamic animated sine waves simulating voice audio harmonics
        const numWaves = 3;
        const colors = [
          'rgba(20, 184, 166, 0.85)', // clinical teal
          'rgba(56, 189, 248, 0.65)', // light blue
          'rgba(45, 212, 191, 0.45)'  // cyan
        ];

        for (let w = 0; w < numWaves; w++) {
          ctx.beginPath();
          ctx.lineWidth = 2.5 - w * 0.5;
          ctx.strokeStyle = colors[w];

          const frequency = 0.025 + w * 0.01;
          const amplitude = (height * 0.35) * Math.sin((phase * 0.05) + w);

          for (let x = 0; x < width; x++) {
            // Apply gaussian envelope so edges taper to zero
            const normalizedX = (x / width) * 2 - 1; // -1 to 1
            const envelope = Math.exp(-normalizedX * normalizedX * 3);
            
            const y = centerY + Math.sin(x * frequency + phase + w * 1.5) * amplitude * envelope;
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }

        phase += 0.08;
      } else {
        // Idle gentle pulse
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#334155';
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * 0.03 + phase) * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        phase += 0.02;
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRecording]);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col items-center gap-2">
      <div className="w-full flex items-center justify-between text-xs px-2 text-slate-400">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`} />
          <span className="font-medium">{isRecording ? 'Live Audio Stream (Web Speech API)' : 'Audio Inactive (Ready)'}</span>
        </div>
        <span className="font-mono text-slate-300 font-semibold">{formatDuration(durationSeconds)}</span>
      </div>

      <div className="w-full h-20 relative overflow-hidden rounded-lg bg-slate-900/60 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={80}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
