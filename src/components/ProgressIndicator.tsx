import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-cyan-400 font-mono mr-2">PROGRESS</span>
      <div className="flex gap-1">
        {[...Array(totalSteps)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-1 rounded-full transition-all duration-500 ${
              i < currentStep
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400 font-mono ml-2">
        {currentStep}/{totalSteps}
      </span>
    </div>
  );
}