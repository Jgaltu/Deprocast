import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Brain, 
  Zap, 
  Target,
  ArrowRight,
  Timer,
  Award,
  TrendingUp
} from 'lucide-react';
import { User, Task, Protocol } from '../types';

interface ProtocolDashboardProps {
  user: User;
}

export default function ProtocolDashboard({ user }: ProtocolDashboardProps) {
  const [currentProtocol, setCurrentProtocol] = useState<Protocol | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [phase, setPhase] = useState(1);

  // Real data - no mock data
  useEffect(() => {
    // This would fetch actual protocol data from the database
    // For now, showing loading state until real data is implemented
    setCurrentProtocol(null);
    setCurrentTask(null);
  }, [user.id]);

  const startProtocol = () => {
    setIsActive(true);
    if (currentTask) {
      setCurrentTask({ ...currentTask, status: 'in_progress' });
    }
  };

  const pauseProtocol = () => {
    setIsActive(false);
  };

  const completeTask = () => {
    if (currentTask) {
      setCurrentTask({ 
        ...currentTask, 
        status: 'completed',
        actual_duration: timeElapsed,
        completed_at: new Date().toISOString()
      });
      setIsActive(false);
      celebrateCompletion();
    }
  };

  const celebrateCompletion = () => {
    console.log('🎉 DOPAMINE SPIKE RECORDED! Task completed successfully!');
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show setup required state since no mock data
  return (
    <div className="space-y-8">
      {/* Protocol Setup Required */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30 text-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-4">
              <Target className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Protocol Ready for Activation
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Your personalized neural optimization protocol has been configured and is ready to begin. 
            Start your first session to begin the cognitive transformation process.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-700/30 rounded-2xl p-6 border border-cyan-400/20">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-cyan-400" />
                <span className="font-semibold text-cyan-400 font-mono">NEURAL MAPPING</span>
              </div>
              <p className="text-slate-300 text-sm">
                Your brain patterns have been analyzed and optimized pathways identified
              </p>
            </div>

            <div className="bg-slate-700/30 rounded-2xl p-6 border border-blue-400/20">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
                <span className="font-semibold text-blue-400 font-mono">DOPAMINE SYSTEM</span>
              </div>
              <p className="text-slate-300 text-sm">
                Reward pathways calibrated for maximum motivation and task completion
              </p>
            </div>

            <div className="bg-slate-700/30 rounded-2xl p-6 border border-purple-400/20">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-purple-400" />
                <span className="font-semibold text-purple-400 font-mono">PROGRESS TRACKING</span>
              </div>
              <p className="text-slate-300 text-sm">
                Real-time monitoring system ready to track your cognitive improvements
              </p>
            </div>
          </div>

          <button
            onClick={startProtocol}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-3xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-500 font-bold text-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-2 group-hover:scale-105">
              <div className="flex items-center gap-4">
                <Play className="w-8 h-8 animate-pulse" />
                <span>Initiate First Session</span>
                <ArrowRight className="w-8 h-8 animate-pulse" />
              </div>
              <div className="text-sm font-mono mt-2 opacity-90">
                NEURAL.PROTOCOL.ACTIVATION
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Protocol Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30">
            <div className="flex items-center gap-3 mb-4">
              <Timer className="w-6 h-6 text-green-400" />
              <span className="font-semibold text-green-400">Session Management</span>
            </div>
            <p className="text-slate-300 mb-4">
              Optimized work sessions with built-in break timing and focus enhancement techniques
            </p>
            <ul className="text-slate-400 text-sm space-y-2">
              <li>• Personalized session lengths</li>
              <li>• Automatic break reminders</li>
              <li>• Focus state monitoring</li>
              <li>• Productivity analytics</li>
            </ul>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <span className="font-semibold text-purple-400">AI Coaching</span>
            </div>
            <p className="text-slate-300 mb-4">
              Real-time guidance and intervention when procrastination patterns are detected
            </p>
            <ul className="text-slate-400 text-sm space-y-2">
              <li>• Pattern recognition</li>
              <li>• Instant interventions</li>
              <li>• Motivation boosters</li>
              <li>• Adaptive strategies</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
          <h3 className="text-xl font-bold text-white mb-4">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Initial Assessment</h4>
              <p className="text-slate-400 text-sm">
                Complete baseline cognitive assessment to establish your starting point
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-white mb-2">First Session</h4>
              <p className="text-slate-400 text-sm">
                Begin with guided micro-tasks designed to trigger immediate dopamine responses
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Continuous Optimization</h4>
              <p className="text-slate-400 text-sm">
                System learns and adapts to your patterns for maximum effectiveness
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}