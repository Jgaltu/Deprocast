import React from 'react';

export default function NeuralBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Neural Connections */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Neural Network Lines */}
        <g className="animate-pulse" style={{ animationDuration: '4s' }}>
          <path
            d="M100,200 Q300,100 500,200 T900,200"
            stroke="url(#neuralGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
          <path
            d="M200,400 Q400,300 600,400 T1000,400"
            stroke="url(#neuralGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            style={{ animationDelay: '1s' }}
          />
          <path
            d="M50,600 Q250,500 450,600 T850,600"
            stroke="url(#neuralGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            style={{ animationDelay: '2s' }}
          />
        </g>
        
        {/* Neural Nodes */}
        <g>
          <circle cx="100" cy="200" r="4" fill="#00d4ff" opacity="0.6" className="animate-ping" />
          <circle cx="500" cy="200" r="4" fill="#0ea5e9" opacity="0.6" className="animate-ping" style={{ animationDelay: '0.5s' }} />
          <circle cx="900" cy="200" r="4" fill="#3b82f6" opacity="0.6" className="animate-ping" style={{ animationDelay: '1s' }} />
          
          <circle cx="200" cy="400" r="4" fill="#00d4ff" opacity="0.6" className="animate-ping" style={{ animationDelay: '1.5s' }} />
          <circle cx="600" cy="400" r="4" fill="#0ea5e9" opacity="0.6" className="animate-ping" style={{ animationDelay: '2s' }} />
          <circle cx="1000" cy="400" r="4" fill="#3b82f6" opacity="0.6" className="animate-ping" style={{ animationDelay: '2.5s' }} />
          
          <circle cx="50" cy="600" r="4" fill="#00d4ff" opacity="0.6" className="animate-ping" style={{ animationDelay: '3s' }} />
          <circle cx="450" cy="600" r="4" fill="#0ea5e9" opacity="0.6" className="animate-ping" style={{ animationDelay: '3.5s' }} />
          <circle cx="850" cy="600" r="4" fill="#3b82f6" opacity="0.6" className="animate-ping" style={{ animationDelay: '4s' }} />
        </g>
      </svg>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}