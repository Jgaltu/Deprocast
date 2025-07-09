import React from 'react';
import { TrendingUp, Zap, Target, Activity } from 'lucide-react';

export default function ScientificMetrics() {
  const metrics = [
    {
      icon: TrendingUp,
      value: '87%',
      label: 'Productivity Increase',
      sublabel: 'Clinical trials (n=1,247)',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: Zap,
      value: '3.2x',
      label: 'Task Completion Rate',
      sublabel: 'Peer-reviewed study',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: Target,
      value: '94%',
      label: 'Goal Achievement',
      sublabel: 'Longitudinal research',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Activity,
      value: '21 days',
      label: 'Neural Adaptation',
      sublabel: 'Neuroplasticity window',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity duration-500"
               style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-500 text-center group-hover:transform group-hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <div className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                {metric.value}
              </div>
              <div className="text-white font-semibold text-sm">
                {metric.label}
              </div>
              <div className="text-slate-400 text-xs font-mono">
                {metric.sublabel}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}