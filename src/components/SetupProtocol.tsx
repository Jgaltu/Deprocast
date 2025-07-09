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
  Edit3,
  Save,
  Settings,
  Award,
  Sparkles,
  Crown,
  Gift,
  Star,
  Activity,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  GripVertical
} from 'lucide-react';
import { User } from '../types';
import RewardScheduling from './RewardScheduling';
import AdvancedExecution from './AdvancedExecution';
import MomentumConsolidation from './MomentumConsolidation';
import ExerciseNeuroplasticity from './ExerciseNeuroplasticity';

interface SetupProtocolProps {
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
}

interface ExecutionEntry {
  id: string;
  taskName: string;
  startTime: string;
  completionTime: string;
  actualDuration: number;
  estimatedDuration: number;
  dopamineRating: number;
  nextTaskMotivation: number;
  obstaclesEncountered: string[];
  breakthroughMoments: string[];
  notes: string;
}

interface PomodoroSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  celebrationTime: number;
  reflectionTime: number;
}

export default function SetupProtocol({ user, onComplete }: SetupProtocolProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPhase, setCurrentPhase] = useState(1); // 1: Setup, 2: Reward Scheduling, 3: Advanced Execution, 4: Consolidation, 5: Exercise
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [exactMoment, setExactMoment] = useState('');
  const [triggerAnalysis, setTriggerAnalysis] = useState('');
  const [outcomeStatement, setOutcomeStatement] = useState({ result: '', date: '' });
  const [microTasks, setMicroTasks] = useState<MicroTask[]>([]);
  const [delayMeasurement, setDelayMeasurement] = useState({ baseline: 0, current: 0 });
  const [executionEntries, setExecutionEntries] = useState<ExecutionEntry[]>([]);
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    celebrationTime: 30,
    reflectionTime: 15
  });
  const [isEditingPomodoro, setIsEditingPomodoro] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Default micro-tasks
  const defaultMicroTasks: MicroTask[] = [
    { id: '1', title: 'Create project outline', description: 'Write a basic structure with main sections', estimatedMinutes: 15, difficulty: 2, category: 'Planning' },
    { id: '2', title: 'Research key requirements', description: 'Gather essential information and resources', estimatedMinutes: 20, difficulty: 3, category: 'Research' },
    { id: '3', title: 'Set up workspace', description: 'Organize files, tools, and environment', estimatedMinutes: 10, difficulty: 1, category: 'Setup' },
    { id: '4', title: 'Draft introduction', description: 'Write the opening section or overview', estimatedMinutes: 25, difficulty: 3, category: 'Writing' },
    { id: '5', title: 'Create first prototype', description: 'Build a basic version or mockup', estimatedMinutes: 30, difficulty: 4, category: 'Creation' },
    { id: '6', title: 'Review and refine', description: 'Check quality and make improvements', estimatedMinutes: 20, difficulty: 2, category: 'Review' },
    { id: '7', title: 'Gather feedback', description: 'Get input from others or test with users', estimatedMinutes: 15, difficulty: 2, category: 'Feedback' },
    { id: '8', title: 'Implement changes', description: 'Apply feedback and make revisions', estimatedMinutes: 25, difficulty: 3, category: 'Revision' },
    { id: '9', title: 'Create documentation', description: 'Write guides, notes, or explanations', estimatedMinutes: 20, difficulty: 2, category: 'Documentation' },
    { id: '10', title: 'Test functionality', description: 'Verify everything works as expected', estimatedMinutes: 15, difficulty: 2, category: 'Testing' },
    { id: '11', title: 'Polish and finalize', description: 'Add finishing touches and final review', estimatedMinutes: 20, difficulty: 3, category: 'Finalization' },
    { id: '12', title: 'Prepare for delivery', description: 'Package, format, or prepare for submission', estimatedMinutes: 15, difficulty: 2, category: 'Delivery' }
  ];

  // Initialize micro-tasks
  useEffect(() => {
    setMicroTasks(defaultMicroTasks);
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive]);

  // Start timer when user types
  const handleInputChange = (value: string, setter: (value: string) => void) => {
    if (!timerStarted && value.length === 1) {
      setIsTimerActive(true);
      setTimerStarted(true);
    }
    setter(value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateTriggerAnalysis = () => {
    const analyses = [
      "Neural pattern analysis reveals a classic 'complexity overwhelm' response. Your prefrontal cortex is experiencing decision fatigue when faced with undefined project scope. This triggers the amygdala's threat detection system, causing avoidance behaviors.",
      "Dopamine prediction error detected. Your brain's reward system cannot calculate expected satisfaction from an unclear outcome, leading to motivational paralysis. The anterior cingulate cortex shows reduced activation patterns.",
      "Analysis indicates 'perfectionism paralysis' - your brain is stuck in an error-detection loop. The anterior cingulate cortex is hyperactive, preventing task initiation until perfect conditions are met.",
      "Cognitive load assessment shows working memory overload. Your brain is attempting to process too many variables simultaneously, triggering the default mode network and mind-wandering behaviors."
    ];
    
    setTriggerAnalysis(analyses[Math.floor(Math.random() * analyses.length)]);
    setCurrentStep(3);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const addExecutionEntry = () => {
    const newEntry: ExecutionEntry = {
      id: Date.now().toString(),
      taskName: '',
      startTime: '',
      completionTime: '',
      actualDuration: 0,
      estimatedDuration: 0,
      dopamineRating: 5,
      nextTaskMotivation: 5,
      obstaclesEncountered: [],
      breakthroughMoments: [],
      notes: ''
    };
    setExecutionEntries([...executionEntries, newEntry]);
  };

  const updateExecutionEntry = (id: string, field: string, value: any) => {
    setExecutionEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const removeExecutionEntry = (id: string) => {
    setExecutionEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask === targetId) return;
    
    const draggedIndex = microTasks.findIndex(task => task.id === draggedTask);
    const targetIndex = microTasks.findIndex(task => task.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newTasks = [...microTasks];
    const [draggedItem] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedItem);
    
    setMicroTasks(newTasks);
    setDraggedTask(null);
  };

  const completePhase1 = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setCurrentPhase(2);
    }, 3000);
  };

  const completePhase2 = () => {
    setCurrentPhase(3);
  };

  const completePhase3 = () => {
    setCurrentPhase(4);
  };

  const completePhase4 = () => {
    setCurrentPhase(5);
  };

  const completePhase5 = () => {
    onComplete();
  };

  // Show Phase 5 if completed Phase 4
  if (currentPhase === 5) {
    return <ExerciseNeuroplasticity user={user} onComplete={completePhase5} />;
  }

  // Show Phase 4 if completed Phase 3
  if (currentPhase === 4) {
    return <MomentumConsolidation user={user} onComplete={completePhase4} />;
  }

  // Show Phase 3 if completed Phase 2
  if (currentPhase === 3) {
    return <AdvancedExecution user={user} onComplete={completePhase3} />;
  }

  // Show Phase 2 if completed Phase 1
  if (currentPhase === 2) {
    return <RewardScheduling user={user} onComplete={completePhase2} />;
  }

  // Show celebration modal
  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-slate-800/90 to-yellow-900/50 backdrop-blur-2xl rounded-3xl p-12 border border-yellow-400/30 text-center max-w-2xl">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50 animate-ping"></div>
              <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-6">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">
              🎉 PHASE 1 COMPLETE! 🎉
            </h2>
            <p className="text-xl text-yellow-400 mb-6 font-semibold">
              Neural Setup Protocol Successfully Configured
            </p>
            
            <div className="bg-yellow-500/10 rounded-2xl border border-yellow-400/30 p-6 mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Award className="w-8 h-8 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">+500 Neural Points</span>
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-slate-300 text-lg">
                Your brain has successfully completed the foundational setup for cognitive optimization!
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-slate-700/30 rounded-xl p-3 border border-green-400/20">
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <div className="text-green-400 font-semibold">Neural Mapping</div>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-3 border border-blue-400/20">
                <CheckCircle className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <div className="text-blue-400 font-semibold">Task Architecture</div>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-3 border border-purple-400/20">
                <CheckCircle className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <div className="text-purple-400 font-semibold">Tracking Setup</div>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-3 border border-cyan-400/20">
                <CheckCircle className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                <div className="text-cyan-400 font-semibold">Protocol Config</div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-slate-400 text-sm">
                Proceeding to Phase 2: Strategic Reward Scheduling...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Neural Pathway Mapping</h2>
              <p className="text-slate-300 text-lg">
                Let's identify your procrastination triggers and map your neural patterns
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Procrastination Trigger Audit</h3>
                    <p className="text-cyan-400 text-sm font-mono">TIMER.STARTS.ON.FIRST.KEYSTROKE</p>
                  </div>
                </div>

                {/* Timer Display */}
                <div className="text-center mb-8">
                  <div className="relative inline-flex items-center justify-center w-32 h-32">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-slate-800 to-blue-900 rounded-full p-6 border-2 border-cyan-400/50">
                      <div className="text-3xl font-bold text-cyan-400 font-mono">
                        {formatTime(elapsedTime)}
                      </div>
                    </div>
                  </div>
                  {timerStarted && (
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                        <span className="text-cyan-400 text-sm font-mono">NEURAL.TRACKING.ACTIVE</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      What's your biggest postponed project right now?
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => handleInputChange(e.target.value, setProjectName)}
                      placeholder="e.g., Writing my thesis, launching my business, learning to code..."
                      className="w-full p-4 bg-slate-800/50 border-2 border-cyan-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-500 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      Describe the exact moment you stopped working on it
                    </label>
                    <textarea
                      value={exactMoment}
                      onChange={(e) => handleInputChange(e.target.value, setExactMoment)}
                      placeholder="What were you thinking? What triggered the avoidance? Be specific..."
                      className="w-full p-4 bg-slate-800/50 border-2 border-cyan-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-500 text-white placeholder:text-slate-400 h-32"
                    />
                  </div>
                </div>

                {projectName.trim() && exactMoment.trim() && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={generateTriggerAnalysis}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1"
                    >
                      ANALYZE NEURAL PATTERNS
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">AI Trigger Analysis</h2>
              <p className="text-slate-300 text-lg">
                Neural pattern analysis complete - here's what's happening in your brain
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Neural Analysis Results</h3>
                    <p className="text-blue-400 text-sm font-mono">COGNITIVE.PATTERN.RECOGNITION</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-2xl border border-blue-400/20 p-6 mb-6">
                  <p className="text-slate-300 leading-relaxed text-lg">{triggerAnalysis}</p>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-400 hover:to-indigo-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1"
                  >
                    CONTINUE TO MICRO-TASK ARCHITECTURE
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Micro-Task Architecture</h2>
              <p className="text-slate-300 text-lg">
                Break down your project and define your success outcome
              </p>
            </div>

            {/* Outcome Statement */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-green-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Outcome Statement</h3>
                    <p className="text-green-400 text-sm font-mono">DEFINE.SUCCESS.CRITERIA</p>
                  </div>
                </div>

                <div className="bg-green-500/10 rounded-2xl border border-green-400/20 p-6">
                  <p className="text-lg text-white mb-4">
                    By completing this project, I will achieve{' '}
                    <input
                      type="text"
                      value={outcomeStatement.result}
                      onChange={(e) => setOutcomeStatement(prev => ({ ...prev, result: e.target.value }))}
                      placeholder="specific result"
                      className="inline-block min-w-[200px] px-3 py-1 bg-slate-800/50 border-b-2 border-green-400/50 focus:border-green-400 outline-none text-green-400 font-semibold"
                    />
                    {' '}by{' '}
                    <input
                      type="text"
                      value={outcomeStatement.date}
                      onChange={(e) => setOutcomeStatement(prev => ({ ...prev, date: e.target.value }))}
                      placeholder="specific date"
                      className="inline-block min-w-[150px] px-3 py-1 bg-slate-800/50 border-b-2 border-green-400/50 focus:border-green-400 outline-none text-green-400 font-semibold"
                    />
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Micro-Tasks with Drag & Drop */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">12 Micro-Tasks (Drag to Reorder)</h3>
                    <p className="text-purple-400 text-sm font-mono">DOPAMINE.REWARD.OPTIMIZATION</p>
                  </div>
                </div>

                <div className="bg-purple-500/10 rounded-2xl border border-purple-400/20 p-4 mb-6">
                  <p className="text-slate-300 text-sm">
                    <strong className="text-purple-400">Arrange in ascending dopamine reward order:</strong> Front-load 3-4 "quick wins" 
                    to establish momentum, schedule one "breakthrough task\" for optimal hours, end with \"integration tasks" 
                    that show visible progress.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {microTasks.map((task, index) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, task.id)}
                      className={`p-4 bg-slate-700/30 rounded-xl border border-slate-600 hover:border-purple-400/50 transition-all duration-300 cursor-move ${
                        draggedTask === task.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-slate-400" />
                          <span className="text-purple-400 font-bold text-lg">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">{task.title}</h4>
                          <p className="text-slate-400 text-xs mt-1">{task.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-500">{task.estimatedMinutes}min</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i < task.difficulty ? 'bg-yellow-400' : 'bg-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-slate-500 bg-slate-600 px-2 py-1 rounded">
                              {task.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {outcomeStatement.result.trim() && outcomeStatement.date.trim() && (
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-400 hover:to-pink-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1"
                >
                  CONFIRM TASK SEQUENCE
                </button>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Task Sequence Optimization</h2>
              <p className="text-slate-300 text-lg">
                Confirm your dopamine-optimized task order
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Optimized Sequence (45 minutes)</h3>
                    <p className="text-yellow-400 text-sm font-mono">DOPAMINE.REWARD.SCHEDULING</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 rounded-2xl border border-yellow-400/20 p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">Quick Wins (Tasks 1-4)</h4>
                      <p className="text-slate-300">Front-loaded momentum builders</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">Breakthrough Task (Task 8-10)</h4>
                      <p className="text-slate-300">Highest complexity during peak hours</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">Integration Tasks (Tasks 11-12)</h4>
                      <p className="text-slate-300">Visible progress demonstration</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-2xl hover:from-yellow-400 hover:to-orange-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-yellow-500/25 transform hover:-translate-y-1"
                  >
                    CONFIRM OPTIMIZATION
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Dopamine Baseline Measurement</h2>
              <p className="text-slate-300 text-lg">
                Measure your task initiation delay to establish baseline metrics
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-red-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-red-400 to-orange-500 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Task Initiation Delay Tracking</h3>
                    <p className="text-red-400 text-sm font-mono">PROCRASTINATION.MEASUREMENT.PROTOCOL</p>
                  </div>
                </div>

                <div className="bg-red-500/10 rounded-2xl border border-red-400/20 p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-red-400 mb-2">
                        Baseline Delay (Previous Projects)
                      </label>
                      <input
                        type="number"
                        value={delayMeasurement.baseline}
                        onChange={(e) => setDelayMeasurement(prev => ({ ...prev, baseline: parseInt(e.target.value) || 0 }))}
                        placeholder="Days typically delayed"
                        className="w-full p-3 bg-slate-800/50 border border-red-400/30 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-red-400 mb-2">
                        Current Project Delay
                      </label>
                      <input
                        type="number"
                        value={delayMeasurement.current}
                        onChange={(e) => setDelayMeasurement(prev => ({ ...prev, current: parseInt(e.target.value) || 0 }))}
                        placeholder="Days since you should have started"
                        className="w-full p-3 bg-slate-800/50 border border-red-400/30 rounded-xl text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-2xl border border-blue-400/20 p-4 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-blue-400">Important Note</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Get used to this measurement process - it will be crucial when you start the actual protocol. 
                    This data helps calibrate your neural response patterns and track improvement over time.
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setCurrentStep(6)}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-2xl hover:from-red-400 hover:to-orange-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-1"
                  >
                    RECORD BASELINE METRICS
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Execution Tracking Setup</h2>
              <p className="text-slate-300 text-lg">
                Create your neural feedback tracking system
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Execution Tracking Template</h3>
                    <p className="text-indigo-400 text-sm font-mono">NEURAL.FEEDBACK.SYSTEM</p>
                  </div>
                </div>

                {/* Warning about daily practice */}
                <div className="bg-orange-500/10 rounded-2xl border border-orange-400/30 p-6 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                    <span className="font-bold text-orange-400">CRITICAL: Daily Practice Required</span>
                  </div>
                  <p className="text-slate-300 mb-3">
                    <strong>Write at least one tracking entry each day</strong> to build muscle memory. 
                    This neural feedback loop is essential for automatic behavior formation.
                  </p>
                  <div className="bg-orange-500/10 rounded-xl border border-orange-400/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 font-semibold text-sm">Pro Tip:</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      The act of documenting triggers dopamine release and reinforces positive task completion patterns. 
                      Even tracking small wins builds the neural pathway for larger successes.
                    </p>
                  </div>
                </div>

                {/* Execution Entries */}
                <div className="space-y-4">
                  {executionEntries.map((entry, index) => (
                    <div key={entry.id} className="bg-slate-700/30 rounded-xl border border-slate-600 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-white">Tracking Entry #{index + 1}</h4>
                        <button
                          onClick={() => removeExecutionEntry(entry.id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-400 mb-2">Task Name</label>
                          <input
                            type="text"
                            value={entry.taskName}
                            onChange={(e) => updateExecutionEntry(entry.id, 'taskName', e.target.value)}
                            placeholder="Task name"
                            className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-400 mb-2">Duration (minutes)</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              value={entry.estimatedDuration}
                              onChange={(e) => updateExecutionEntry(entry.id, 'estimatedDuration', parseInt(e.target.value) || 0)}
                              placeholder="Estimated"
                              className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-sm"
                            />
                            <input
                              type="number"
                              value={entry.actualDuration}
                              onChange={(e) => updateExecutionEntry(entry.id, 'actualDuration', parseInt(e.target.value) || 0)}
                              placeholder="Actual"
                              className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-400 mb-2">Dopamine Rating (1-10)</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={entry.dopamineRating}
                            onChange={(e) => updateExecutionEntry(entry.id, 'dopamineRating', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-center text-white font-bold">{entry.dopamineRating}/10</div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-400 mb-2">Next Task Motivation (1-10)</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={entry.nextTaskMotivation}
                            onChange={(e) => updateExecutionEntry(entry.id, 'nextTaskMotivation', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-center text-white font-bold">{entry.nextTaskMotivation}/10</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-slate-400 mb-2">Notes</label>
                        <textarea
                          value={entry.notes}
                          onChange={(e) => updateExecutionEntry(entry.id, 'notes', e.target.value)}
                          placeholder="Obstacles encountered, breakthrough moments, insights..."
                          className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white text-sm h-20"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addExecutionEntry}
                    className="w-full p-4 border-2 border-dashed border-slate-600 rounded-xl hover:border-indigo-400/50 transition-colors duration-300 text-slate-400 hover:text-indigo-400"
                  >
                    + Add Tracking Entry
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setCurrentStep(7)}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-400 hover:to-purple-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-indigo-500/25 transform hover:-translate-y-1"
                  >
                    SETUP TRACKING SYSTEM
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Enhanced Execution Protocol</h2>
              <p className="text-slate-300 text-lg">
                Configure your Pomodoro+ Protocol for optimal neural performance
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-green-400/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
                      <Timer className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">The Pomodoro+ Protocol</h3>
                      <p className="text-green-400 text-sm font-mono">NEURAL.OPTIMIZATION.TIMING</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditingPomodoro(!isEditingPomodoro)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all duration-300"
                  >
                    {isEditingPomodoro ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    <span>{isEditingPomodoro ? 'Save' : 'Edit'}</span>
                  </button>
                </div>

                {/* Pomodoro Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  {[
                    { key: 'workDuration', label: 'Work Session', unit: 'min', color: 'text-green-400' },
                    { key: 'shortBreak', label: 'Short Break', unit: 'min', color: 'text-blue-400' },
                    { key: 'longBreak', label: 'Long Break', unit: 'min', color: 'text-indigo-400' },
                    { key: 'celebrationTime', label: 'Celebration', unit: 'sec', color: 'text-yellow-400' },
                    { key: 'reflectionTime', label: 'Reflection', unit: 'min', color: 'text-purple-400' }
                  ].map((setting) => (
                    <div key={setting.key} className="text-center">
                      <label className={`block text-sm font-semibold ${setting.color} mb-2`}>
                        {setting.label}
                      </label>
                      {isEditingPomodoro ? (
                        <input
                          type="range"
                          min={setting.key === 'celebrationTime' ? 10 : 5}
                          max={setting.key === 'celebrationTime' ? 60 : setting.key === 'workDuration' ? 60 : 30}
                          value={pomodoroSettings[setting.key as keyof PomodoroSettings]}
                          onChange={(e) => setPomodoroSettings(prev => ({
                            ...prev,
                            [setting.key]: parseInt(e.target.value)
                          }))}
                          className="w-full mb-2"
                        />
                      ) : null}
                      <div className={`text-2xl font-bold ${setting.color}`}>
                        {pomodoroSettings[setting.key as keyof PomodoroSettings]}{setting.unit}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Execution Rules */}
                <div className="bg-green-500/10 rounded-2xl border border-green-400/20 p-6 mb-6">
                  <h4 className="font-bold text-white mb-4">Enhanced Execution Rules</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-green-400 mb-2">Core Protocols:</h5>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• No research during execution hours</li>
                        <li>• Document every dopamine spike</li>
                        <li>• Celebrate micro-wins physically</li>
                        <li>• {pomodoroSettings.celebrationTime}-second celebration after each completion</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-green-400 mb-2">Advanced Techniques:</h5>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Pre-task dopamine priming (2 minutes)</li>
                        <li>• Flow state monitoring every 10 minutes</li>
                        <li>• 90-second reset protocol when stuck</li>
                        <li>• Variable reward scheduling optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={completePhase1}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl hover:from-green-400 hover:to-emerald-500 transition-all duration-500 font-bold text-xl shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-2 group-hover:scale-105">
                      <div className="flex items-center gap-4">
                        <CheckCircle className="w-8 h-8 animate-pulse" />
                        <span>Complete Phase 1 Setup</span>
                        <Trophy className="w-8 h-8 animate-pulse" />
                      </div>
                      <div className="text-sm font-mono mt-2 opacity-90">
                        NEURAL.FOUNDATION.COMPLETE
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Setup Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">PHASE 1: Setup Protocol</h1>
                <p className="text-cyan-400 font-mono text-sm">HOURS 1-12 // NEURAL.FOUNDATION.BUILDING</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">
                Step {currentStep}/7
              </div>
              <div className="text-sm text-slate-400">Foundation Setup</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(currentStep / 7) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {renderStep()}
    </div>
  );
}