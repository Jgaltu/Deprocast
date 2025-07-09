import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Timer, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Trophy,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Activity,
  TrendingUp,
  Lightbulb,
  Wind,
  Heart,
  Eye,
  Smile,
  Volume2,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Award,
  Settings,
  BarChart3,
  Flame,
  Star,
  Crown
} from 'lucide-react';
import { User } from '../types';

interface AdvancedExecutionProps {
  user: User;
  onComplete: () => void;
}

interface MicroTask {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: string;
  status: 'pending' | 'in_progress' | 'completed';
  startTime?: string;
  completionTime?: string;
  actualDuration?: number;
  dopamineRating?: number;
  flowStateRating?: number;
}

interface ResetProtocolStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: React.ComponentType<any>;
  instructions: string[];
}

interface FlowStateMetrics {
  taskInitiationSpeed: number;
  decisionFatigueReduction: number;
  sustainedAttentionImprovement: number;
  currentHour: number;
}

export default function AdvancedExecution({ user, onComplete }: AdvancedExecutionProps) {
  const [currentTask, setCurrentTask] = useState<MicroTask | null>(null);
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [taskTimer, setTaskTimer] = useState(0);
  const [flowCheckTimer, setFlowCheckTimer] = useState(0);
  const [showResetProtocol, setShowResetProtocol] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [resetTimer, setResetTimer] = useState(0);
  const [primingComplete, setPrimingComplete] = useState(false);
  const [currentReward, setCurrentReward] = useState('');
  const [flowState, setFlowState] = useState<'absorbed' | 'resistant' | 'neutral'>('neutral');
  const [metrics, setMetrics] = useState<FlowStateMetrics>({
    taskInitiationSpeed: 15,
    decisionFatigueReduction: 25,
    sustainedAttentionImprovement: 40,
    currentHour: 16
  });
  const [completedTasks, setCompletedTasks] = useState<MicroTask[]>([]);
  const [showFlowOptimization, setShowFlowOptimization] = useState(false);
  const [environmentState, setEnvironmentState] = useState({
    location: '',
    distractions: '',
    energyLevel: 7,
    timeSinceBreak: 0
  });

  const taskTimerRef = useRef<NodeJS.Timeout>();
  const flowCheckRef = useRef<NodeJS.Timeout>();
  const resetTimerRef = useRef<NodeJS.Timeout>();

  // Advanced micro-tasks (7-10)
  const advancedTasks: MicroTask[] = [
    {
      id: '7',
      title: 'Implement core functionality',
      description: 'Build the main feature or component of your project',
      estimatedMinutes: 35,
      difficulty: 4,
      category: 'Implementation',
      status: 'pending'
    },
    {
      id: '8',
      title: 'Optimize and refine',
      description: 'Improve performance and user experience',
      estimatedMinutes: 30,
      difficulty: 3,
      category: 'Optimization',
      status: 'pending'
    },
    {
      id: '9',
      title: 'Integration testing',
      description: 'Test how all components work together',
      estimatedMinutes: 25,
      difficulty: 3,
      category: 'Testing',
      status: 'pending'
    },
    {
      id: '10',
      title: 'Final polish and documentation',
      description: 'Add finishing touches and create documentation',
      estimatedMinutes: 30,
      difficulty: 2,
      category: 'Finalization',
      status: 'pending'
    }
  ];

  const resetProtocolSteps: ResetProtocolStep[] = [
    {
      id: 'breathing',
      title: 'Deep Breathing',
      description: '4-7-8 breathing pattern to reset nervous system',
      duration: 60,
      icon: Wind,
      instructions: [
        'Inhale through nose for 4 counts',
        'Hold breath for 7 counts',
        'Exhale through mouth for 8 counts',
        'Repeat 3 complete cycles'
      ]
    },
    {
      id: 'movement',
      title: 'Physical Activation',
      description: 'Movement to increase blood flow and alertness',
      duration: 60,
      icon: Activity,
      instructions: [
        'Choose: jumping jacks, push-ups, or stretching',
        'Perform for 45 seconds continuously',
        'Focus on activating your entire body',
        'End with 15 seconds of gentle movement'
      ]
    },
    {
      id: 'visualization',
      title: 'Outcome Visualization',
      description: 'Mental rehearsal of successful task completion',
      duration: 30,
      icon: Eye,
      instructions: [
        'Reread your current micro-task',
        'Visualize yourself completing it successfully',
        'Imagine the satisfaction and reward',
        'Set clear intention for the next 25 minutes'
      ]
    }
  ];

  // Timer effects
  useEffect(() => {
    if (isTaskActive) {
      taskTimerRef.current = setInterval(() => {
        setTaskTimer(prev => prev + 1);
        setFlowCheckTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (taskTimerRef.current) clearInterval(taskTimerRef.current);
    }

    return () => {
      if (taskTimerRef.current) clearInterval(taskTimerRef.current);
    };
  }, [isTaskActive]);

  useEffect(() => {
    if (showResetProtocol && resetStep < resetProtocolSteps.length) {
      const currentStepDuration = resetProtocolSteps[resetStep].duration;
      setResetTimer(currentStepDuration);
      
      resetTimerRef.current = setInterval(() => {
        setResetTimer(prev => {
          if (prev <= 1) {
            if (resetStep < resetProtocolSteps.length - 1) {
              setResetStep(resetStep + 1);
              return resetProtocolSteps[resetStep + 1].duration;
            } else {
              setShowResetProtocol(false);
              setResetStep(0);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (resetTimerRef.current) clearInterval(resetTimerRef.current);
    };
  }, [showResetProtocol, resetStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTask = (task: MicroTask) => {
    setCurrentTask({ ...task, status: 'in_progress', startTime: new Date().toISOString() });
    setTaskTimer(0);
    setFlowCheckTimer(0);
    setIsTaskActive(true);
    setPrimingComplete(false);
  };

  const completeTask = () => {
    if (currentTask) {
      const completedTask = {
        ...currentTask,
        status: 'completed' as const,
        completionTime: new Date().toISOString(),
        actualDuration: Math.floor(taskTimer / 60)
      };
      
      setCompletedTasks(prev => [...prev, completedTask]);
      setCurrentTask(null);
      setIsTaskActive(false);
      setTaskTimer(0);
      setFlowCheckTimer(0);
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        taskInitiationSpeed: Math.min(prev.taskInitiationSpeed + 2, 25),
        decisionFatigueReduction: Math.min(prev.decisionFatigueReduction + 3, 35),
        sustainedAttentionImprovement: Math.min(prev.sustainedAttentionImprovement + 5, 60)
      }));
    }
  };

  const startResetProtocol = () => {
    setShowResetProtocol(true);
    setResetStep(0);
    setIsTaskActive(false);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-orange-400';
      case 4: return 'text-red-400';
      case 5: return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getFlowStateColor = (state: string) => {
    switch (state) {
      case 'absorbed': return 'from-green-400 to-emerald-500';
      case 'resistant': return 'from-red-400 to-orange-500';
      default: return 'from-blue-400 to-indigo-500';
    }
  };

  // Show Reset Protocol Modal
  if (showResetProtocol) {
    const currentStep = resetProtocolSteps[resetStep];
    const IconComponent = currentStep.icon;
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gradient-to-br from-slate-800/90 to-blue-900/50 backdrop-blur-2xl rounded-3xl p-12 border border-cyan-400/30 text-center max-w-2xl">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-6">
                <IconComponent className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              90-Second Reset Protocol
            </h2>
            <p className="text-xl text-cyan-400 mb-2 font-semibold">
              Step {resetStep + 1}/3: {currentStep.title}
            </p>
            <p className="text-slate-300 mb-8">
              {currentStep.description}
            </p>
            
            {/* Timer */}
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-slate-800 to-blue-900 rounded-full p-6 border-2 border-cyan-400/50">
                <div className="text-3xl font-bold text-cyan-400 font-mono">
                  {resetTimer}s
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="bg-cyan-500/10 rounded-2xl border border-cyan-400/30 p-6">
              <h3 className="font-bold text-white mb-4">Instructions:</h3>
              <ul className="text-slate-300 space-y-2">
                {currentStep.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Progress */}
            <div className="mt-8">
              <div className="flex justify-center gap-2">
                {resetProtocolSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= resetStep ? 'bg-cyan-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Phase Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Advanced Execution Phase</h1>
                <p className="text-purple-400 font-mono text-sm">HOURS 16-20 // COMPOUND.MOMENTUM.EFFECT</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                Tasks 7-10
              </div>
              <div className="text-sm text-slate-400">Enhanced Protocol</div>
            </div>
          </div>
        </div>
      </div>

      {/* Compound Momentum Metrics */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-green-400/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Compound Momentum Effect</h3>
              <p className="text-green-400 font-mono text-sm">MEASURABLE.NEURAL.CHANGES.DETECTED</p>
            </div>
          </div>

          <div className="bg-green-500/10 rounded-2xl border border-green-400/20 p-6 mb-6">
            <p className="text-slate-300 text-lg mb-4">
              By hour {metrics.currentHour}, your brain is showing measurable neuroplasticity changes:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {metrics.taskInitiationSpeed}%
                </div>
                <div className="text-sm text-slate-400">Task Initiation Speed</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${metrics.taskInitiationSpeed}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {metrics.decisionFatigueReduction}%
                </div>
                <div className="text-sm text-slate-400">Decision Fatigue Reduction</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${metrics.decisionFatigueReduction}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {metrics.sustainedAttentionImprovement}%
                </div>
                <div className="text-sm text-slate-400">Sustained Attention</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${metrics.sustainedAttentionImprovement}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Execution Protocol */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Enhanced Execution Protocol</h3>
              <p className="text-cyan-400 font-mono text-sm">ADVANCED.NEURAL.OPTIMIZATION</p>
            </div>
          </div>

          {/* Pre-task Dopamine Priming */}
          <div className="bg-cyan-500/10 rounded-2xl border border-cyan-400/20 p-6 mb-6">
            <h4 className="font-bold text-white mb-4 flex items-center gap-3">
              <Smile className="w-5 h-5 text-cyan-400" />
              Pre-task Dopamine Priming (2 minutes)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-white text-sm">Visualize Reward</span>
                </div>
                <p className="text-slate-300 text-xs">
                  Picture the specific reward you'll earn upon completion
                </p>
              </div>
              
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Smile className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-white text-sm">Physical Smile</span>
                </div>
                <p className="text-slate-300 text-xs">
                  Smile for 30 seconds to activate facial feedback loop
                </p>
              </div>
              
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-white text-sm">Verbal Affirmation</span>
                </div>
                <p className="text-slate-300 text-xs">
                  State aloud your task and reward connection
                </p>
              </div>
            </div>
          </div>

          {/* During-task Flow Anchoring */}
          <div className="bg-blue-500/10 rounded-2xl border border-blue-400/20 p-6">
            <h4 className="font-bold text-white mb-4 flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-400" />
              During-task Flow Anchoring (Every 10 minutes)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-blue-400 mb-2">Flow State Check:</h5>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Am I fully absorbed or fighting resistance?</li>
                  <li>• Is my attention naturally focused?</li>
                  <li>• Do I feel energized or drained?</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-blue-400 mb-2">Response Protocol:</h5>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• <span className="text-green-400">Absorbed:</span> Continue without interruption</li>
                  <li>• <span className="text-red-400">Resistant:</span> Implement 90-second reset</li>
                  <li>• <span className="text-yellow-400">Neutral:</span> Gentle refocus technique</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Task Execution */}
      {currentTask ? (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentTask.title}</h3>
                  <p className="text-yellow-400 text-sm">{currentTask.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400 font-mono">
                  {formatTime(taskTimer)}
                </div>
                <div className="text-sm text-slate-400">
                  Est: {currentTask.estimatedMinutes}min
                </div>
              </div>
            </div>

            {/* Flow State Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">Current Flow State</span>
                <div className="flex gap-2">
                  {['absorbed', 'neutral', 'resistant'].map((state) => (
                    <button
                      key={state}
                      onClick={() => setFlowState(state as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                        flowState === state
                          ? `bg-gradient-to-r ${getFlowStateColor(state)} text-white`
                          : 'bg-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {state.charAt(0).toUpperCase() + state.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Flow Check Timer */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-1">Next flow check in:</div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((600 - (flowCheckTimer % 600)) / 600) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-cyan-400 font-mono text-sm">
                  {Math.floor((600 - (flowCheckTimer % 600)) / 60)}:{((600 - (flowCheckTimer % 600)) % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Task Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsTaskActive(!isTaskActive)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                  isTaskActive
                    ? 'bg-orange-500 hover:bg-orange-400 text-white'
                    : 'bg-green-500 hover:bg-green-400 text-white'
                }`}
              >
                {isTaskActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isTaskActive ? 'Pause' : 'Resume'}
              </button>
              
              <button
                onClick={startResetProtocol}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 flex items-center gap-3"
              >
                <RefreshCw className="w-5 h-5" />
                90s Reset
              </button>
              
              <button
                onClick={completeTask}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5" />
                Complete
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Task Selection */
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-400/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Select Next Micro-Task</h3>
                <p className="text-indigo-400 font-mono text-sm">ADVANCED.EXECUTION.READY</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advancedTasks.filter(task => !completedTasks.find(ct => ct.id === task.id)).map((task) => (
                <div
                  key={task.id}
                  className="p-6 bg-slate-700/30 rounded-xl border border-slate-600 hover:border-indigo-400/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => startTask(task)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                      Task #{task.id}: {task.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${getDifficultyColor(task.difficulty)}`}>
                        Difficulty {task.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-4">{task.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 bg-slate-600 px-2 py-1 rounded">
                      {task.category}
                    </span>
                    <span className="text-indigo-400 font-mono text-sm">
                      ~{task.estimatedMinutes}min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Tasks Summary */}
      {completedTasks.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-green-400/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Completed Tasks</h3>
                <p className="text-green-400 font-mono text-sm">NEURAL.MOMENTUM.BUILDING</p>
              </div>
            </div>

            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-400/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <span className="font-semibold text-white">Task #{task.id}: {task.title}</span>
                      <div className="text-xs text-slate-400">{task.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-mono text-sm">
                      {task.actualDuration}min
                    </div>
                    <div className="text-xs text-slate-400">
                      Est: {task.estimatedMinutes}min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Complete Phase Button */}
      {completedTasks.length === 4 && (
        <div className="text-center">
          <button
            onClick={onComplete}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-3xl hover:from-purple-400 hover:to-pink-500 transition-all duration-500 font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 group-hover:scale-105">
              <div className="flex items-center gap-4">
                <Crown className="w-8 h-8 animate-pulse" />
                <span>Complete Advanced Execution Phase</span>
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="text-sm font-mono mt-2 opacity-90">
                COMPOUND.MOMENTUM.ACHIEVED
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}