import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Brain, 
  Lightbulb, 
  RefreshCw, 
  ArrowRight, 
  Zap,
  Target,
  Clock,
  TrendingDown,
  Activity,
  CheckCircle,
  Timer,
  Flame,
  Calendar,
  Settings,
  Award,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { User } from '../types';

interface EmergencyPanelProps {
  user: User;
}

type SolutionType = 'circuit_breaker' | 'task_modification' | 'strategic_pivot';

interface Solution {
  id: SolutionType;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: string;
}

interface EmergencyResetData {
  lastSuccessfulDay: string;
  procrastinationTriggers: string[];
  failedComponents: string[];
  motivationLevel: number;
  availableTime: number;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistPhase {
  id: string;
  title: string;
  timeframe: string;
  description: string;
  items: ChecklistItem[];
  color: string;
}

export default function EmergencyPanel({ user }: EmergencyPanelProps) {
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isEmergencyReset, setIsEmergencyReset] = useState(false);
  const [showFullProtocol, setShowFullProtocol] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resetData, setResetData] = useState<EmergencyResetData>({
    lastSuccessfulDay: '',
    procrastinationTriggers: [],
    failedComponents: [],
    motivationLevel: 5,
    availableTime: 36
  });
  const [protocolStarted, setProtocolStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [protocolStartTime, setProtocolStartTime] = useState<Date | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const [checklist, setChecklist] = useState<ChecklistPhase[]>([
    {
      id: 'pre-protocol',
      title: 'Pre-Protocol Setup',
      timeframe: 'Complete before Hour 1',
      description: 'Essential preparation for the 36-hour neural rescue mission',
      color: 'from-purple-400 to-pink-500',
      items: [
        { id: 'clear-calendar', text: 'Clear your calendar for 36 hours of focused work', completed: false },
        { id: 'setup-tracking', text: 'Set up your Page tracking Site (ONSITE)', completed: false },
        { id: 'identify-project', text: 'Identify your primary project', completed: false },
        { id: 'gather-tools', text: 'Gather any necessary tools/resources', completed: false },
        { id: 'inform-others', text: 'Inform others of your unavailability', completed: false },
        { id: 'prepare-rewards', text: 'Prepare your reward list', completed: false },
        { id: 'setup-exercise', text: 'Set up your exercise space/equipment', completed: false }
      ]
    },
    {
      id: 'phase-1',
      title: 'Phase 1 Milestones',
      timeframe: 'Hours 1-12',
      description: 'Foundation building and momentum establishment',
      color: 'from-cyan-400 to-blue-500',
      items: [
        { id: 'trigger-audit', text: 'Complete procrastination trigger audit', completed: false },
        { id: 'break-down-project', text: 'Break down project into 12 micro-tasks', completed: false },
        { id: 'complete-first-6', text: 'Complete first 6 micro-tasks', completed: false },
        { id: 'document-dopamine', text: 'Document dopamine rating changes', completed: false },
        { id: 'establish-rhythm', text: 'Establish task completion rhythm', completed: false },
        { id: 'measure-baseline', text: 'Measure baseline vs. current performance', completed: false }
      ]
    },
    {
      id: 'phase-2',
      title: 'Phase 2 Milestones',
      timeframe: 'Hours 13-24',
      description: 'System optimization and reward calibration',
      color: 'from-blue-400 to-indigo-500',
      items: [
        { id: 'design-rewards', text: 'Design variable reward schedule', completed: false },
        { id: 'complete-7-10', text: 'Complete micro-tasks 7-10', completed: false },
        { id: 'implement-rewards', text: 'Implement and test reward system', completed: false },
        { id: 'document-flow', text: 'Document flow state patterns', completed: false },
        { id: 'identify-conditions', text: 'Identify optimal work conditions', completed: false },
        { id: 'pattern-analysis', text: 'Complete pattern recognition analysis', completed: false }
      ]
    },
    {
      id: 'phase-3',
      title: 'Phase 3 Milestones',
      timeframe: 'Hours 25-36',
      description: 'Neural consolidation and system establishment',
      color: 'from-indigo-400 to-purple-500',
      items: [
        { id: 'neuroplasticity-protocol', text: 'Complete neuroplasticity exercise protocol', completed: false },
        { id: 'leverage-enhancement', text: 'Leverage post-exercise cognitive enhancement', completed: false },
        { id: 'finish-remaining', text: 'Finish all remaining micro-tasks', completed: false },
        { id: 'design-maintenance', text: 'Design permanent maintenance system', completed: false },
        { id: 'document-transformation', text: 'Document complete transformation data', completed: false },
        { id: 'setup-tracking', text: 'Set up long-term tracking systems', completed: false }
      ]
    }
  ]);

  const panicReasons = [
    'Task feels overwhelming',
    'Lost motivation/focus',
    'Unclear about next steps',
    'Perfectionism paralysis',
    'External distractions',
    'Energy/mood crash',
    'Time pressure anxiety',
    'Imposter syndrome'
  ];

  const triggerPanicMode = () => {
    setIsPanicMode(true);
    setIsEmergencyReset(false);
    setShowFullProtocol(false);
  };

  const triggerEmergencyReset = () => {
    setIsEmergencyReset(true);
    setIsPanicMode(false);
    setShowFullProtocol(false);
  };

  const startFullProtocol = () => {
    setShowFullProtocol(true);
    setProtocolStarted(true);
    setProtocolStartTime(new Date());
    setCurrentPhase(0);
    setIsEmergencyReset(false);
    setIsPanicMode(false);
  };

  const togglePhaseExpansion = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const toggleChecklistItem = (phaseId: string, itemId: string) => {
    setChecklist(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          items: phase.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return phase;
    }));
  };

  const getPhaseProgress = (phase: ChecklistPhase) => {
    const completed = phase.items.filter(item => item.completed).length;
    return Math.round((completed / phase.items.length) * 100);
  };

  const getTotalProgress = () => {
    const totalItems = checklist.reduce((sum, phase) => sum + phase.items.length, 0);
    const completedItems = checklist.reduce((sum, phase) => 
      sum + phase.items.filter(item => item.completed).length, 0
    );
    return Math.round((completedItems / totalItems) * 100);
  };

  const getElapsedTime = () => {
    if (!protocolStartTime) return '00:00:00';
    const now = new Date();
    const elapsed = now.getTime() - protocolStartTime.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const analyzeSituation = async () => {
    if (!selectedReason) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const analysis = generateAIAnalysis(selectedReason);
      const solutionOptions = generateSolutions(selectedReason);
      
      setAiAnalysis(analysis);
      setSolutions(solutionOptions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateAIAnalysis = (reason: string): string => {
    const analyses: Record<string, string> = {
      'Task feels overwhelming': 'Neural scan indicates cognitive overload in the prefrontal cortex. Your brain is attempting to process too much information simultaneously, triggering the amygdala stress response. This is a normal protective mechanism.',
      'Lost motivation/focus': 'Dopamine levels have dropped below optimal threshold. Your reward prediction system needs recalibration. The anterior cingulate cortex is showing reduced activation, indicating decreased executive control.',
      'Unclear about next steps': 'Analysis shows decision paralysis in the dorsolateral prefrontal cortex. Multiple neural pathways are competing for attention without clear prioritization. This creates cognitive friction.',
      'Perfectionism paralysis': 'Detected hyperactivity in the anterior cingulate cortex combined with elevated cortisol. Your brain is stuck in an error-detection loop, preventing forward progress.',
      'External distractions': 'Attention networks are fragmented. The default mode network is overactive, indicating mind-wandering. Environmental stimuli are overwhelming your filtering mechanisms.',
      'Energy/mood crash': 'Neurotransmitter depletion detected. Serotonin and dopamine levels require restoration. Your circadian rhythm may be misaligned with your current task demands.',
      'Time pressure anxiety': 'Stress response system activated. Cortisol elevation is impairing working memory and creative thinking. The sympathetic nervous system is in overdrive.',
      'Imposter syndrome': 'Self-doubt patterns detected in the medial prefrontal cortex. Negative self-talk is creating neural interference with task execution pathways.'
    };
    
    return analyses[reason] || 'Neural analysis in progress...';
  };

  const generateSolutions = (reason: string): Solution[] => {
    const baseSolutions: Solution[] = [
      {
        id: 'circuit_breaker',
        title: 'Neural Circuit Breaker',
        description: 'Take a 5-minute cognitive reset break to restore optimal brain function',
        icon: RefreshCw,
        color: 'from-blue-400 to-cyan-500',
        action: 'ACTIVATE BREAK'
      },
      {
        id: 'task_modification',
        title: 'Task Modification',
        description: 'Break down the current task into smaller, manageable neural chunks',
        icon: Target,
        color: 'from-green-400 to-emerald-500',
        action: 'MODIFY TASK'
      },
      {
        id: 'strategic_pivot',
        title: 'Strategic Pivot',
        description: 'Switch to a different task that better matches your current neural state',
        icon: ArrowRight,
        color: 'from-purple-400 to-pink-500',
        action: 'PIVOT NOW'
      }
    ];

    return baseSolutions;
  };

  const executeSolution = (solution: Solution) => {
    console.log(`Executing solution: ${solution.id}`);
    setIsPanicMode(false);
    setSelectedReason('');
    setAiAnalysis('');
    setSolutions([]);
  };

  // Show Full Protocol View
  if (showFullProtocol) {
    return (
      <div className="space-y-8">
        {/* Protocol Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">36-Hour Neural Rescue Mission</h2>
                  <p className="text-purple-400 font-mono text-sm">EMERGENCY.RESET.PROTOCOL.ACTIVE</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-400 font-mono">
                  {getElapsedTime()}
                </div>
                <div className="text-sm text-slate-400">Mission Time</div>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Overall Progress</span>
                <span className="text-purple-400 font-bold">{getTotalProgress()}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${getTotalProgress()}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              {checklist.map((phase, index) => (
                <div key={phase.id} className="text-center">
                  <div className={`text-lg font-bold bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                    {getPhaseProgress(phase)}%
                  </div>
                  <div className="text-xs text-slate-400">{phase.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checklist Phases */}
        <div className="space-y-6">
          {checklist.map((phase, index) => {
            const isExpanded = expandedPhases.has(phase.id);
            const progress = getPhaseProgress(phase);
            const isCompleted = progress === 100;
            
            return (
              <div key={phase.id} className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${phase.color} opacity-10 rounded-2xl blur-xl`}></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-600 overflow-hidden">
                  
                  {/* Phase Header */}
                  <button
                    onClick={() => togglePhaseExpansion(phase.id)}
                    className="w-full p-6 text-left hover:bg-slate-700/30 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 bg-gradient-to-r ${phase.color} rounded-xl`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <Timer className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                          <p className="text-slate-400 text-sm">{phase.timeframe}</p>
                          <p className="text-slate-300 text-sm mt-1">{phase.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-2xl font-bold bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                            {progress}%
                          </div>
                          <div className="text-xs text-slate-400">
                            {phase.items.filter(item => item.completed).length}/{phase.items.length} complete
                          </div>
                        </div>
                        
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${phase.color} h-2 rounded-full transition-all duration-1000`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </button>
                  
                  {/* Phase Items */}
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="space-y-3">
                        {phase.items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                              item.completed
                                ? 'bg-green-500/10 border-green-400/30'
                                : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                            }`}
                            onClick={() => toggleChecklistItem(phase.id, item.id)}
                          >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              item.completed
                                ? 'bg-green-400 border-green-400'
                                : 'border-slate-500 hover:border-slate-400'
                            }`}>
                              {item.completed && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className={`flex-1 ${
                              item.completed ? 'text-green-300 line-through' : 'text-slate-300'
                            }`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Protocol Controls */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Mission Control</h3>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowFullProtocol(false)}
                className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all duration-300"
              >
                Pause Mission
              </button>
              <button
                onClick={() => {
                  setShowFullProtocol(false);
                  setProtocolStarted(false);
                  setProtocolStartTime(null);
                  setChecklist(prev => prev.map(phase => ({
                    ...phase,
                    items: phase.items.map(item => ({ ...item, completed: false }))
                  })));
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-red-400 hover:to-orange-500 transition-all duration-300"
              >
                Reset Mission
              </button>
              {getTotalProgress() === 100 && (
                <button
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 font-bold"
                >
                  Complete Mission
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Emergency Reset Setup
  if (isEmergencyReset) {
    return (
      <div className="space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-red-400/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-red-400 to-orange-500 rounded-2xl animate-pulse">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Emergency Reset Protocol</h2>
                <p className="text-red-400 font-mono text-sm">NEURAL.PATHWAY.RESCUE.MISSION</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-red-500/10 rounded-2xl border border-red-400/30 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Situation Assessment</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-red-400 mb-2">
                      Last Successful Day
                    </label>
                    <input
                      type="date"
                      value={resetData.lastSuccessfulDay}
                      onChange={(e) => setResetData({...resetData, lastSuccessfulDay: e.target.value})}
                      className="w-full p-3 bg-slate-800/50 border border-red-400/30 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-red-400 mb-2">
                      Current Motivation Level (1-10)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={resetData.motivationLevel}
                      onChange={(e) => setResetData({...resetData, motivationLevel: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="text-center text-white font-bold mt-2">
                      {resetData.motivationLevel}/10
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-red-400 mb-2">
                      Current Procrastination Triggers
                    </label>
                    <textarea
                      placeholder="List what's causing you to procrastinate right now..."
                      className="w-full p-3 bg-slate-800/50 border border-red-400/30 rounded-xl text-white h-24"
                      onChange={(e) => setResetData({...resetData, procrastinationTriggers: e.target.value.split('\n').filter(t => t.trim())})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-red-400 mb-2">
                      What System Components Failed?
                    </label>
                    <textarea
                      placeholder="What parts of your productivity system stopped working?"
                      className="w-full p-3 bg-slate-800/50 border border-red-400/30 rounded-xl text-white h-24"
                      onChange={(e) => setResetData({...resetData, failedComponents: e.target.value.split('\n').filter(c => c.trim())})}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={startFullProtocol}
                  disabled={!resetData.lastSuccessfulDay}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-400 hover:to-pink-500 transition-all duration-500 font-bold disabled:opacity-50 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1"
                >
                  START 36-HOUR RESCUE MISSION
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Panic Mode
  if (isPanicMode) {
    return (
      <div className="space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-red-400/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-red-400 to-orange-500 rounded-2xl animate-pulse">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Panic Mode Active</h2>
                <p className="text-red-400 font-mono text-sm">NEURAL.INTERVENTION.PROTOCOL</p>
              </div>
            </div>

            {!selectedReason && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">What's causing the block?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {panicReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className="p-4 text-left bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600 hover:border-red-400/50 transition-all duration-300 text-slate-300 hover:text-white"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedReason && !aiAnalysis && (
              <div className="text-center">
                <button
                  onClick={analyzeSituation}
                  disabled={isAnalyzing}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-2xl hover:from-red-400 hover:to-orange-500 transition-all duration-500 font-bold disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>ANALYZING NEURAL STATE...</span>
                    </div>
                  ) : (
                    'ANALYZE SITUATION'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Analysis Results */}
        {aiAnalysis && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Neural Analysis Complete</h3>
                  <p className="text-blue-400 font-mono text-sm">COGNITIVE.STATE.ASSESSMENT</p>
                </div>
              </div>
              
              <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-400/20 mb-6">
                <p className="text-slate-300 leading-relaxed">{aiAnalysis}</p>
              </div>

              <h4 className="text-lg font-bold text-white mb-4">Recommended Interventions:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {solutions.map((solution) => (
                  <div key={solution.id} className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${solution.color} opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity duration-500`}></div>
                    <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-600 hover:border-slate-400 transition-all duration-300">
                      <div className={`p-3 bg-gradient-to-r ${solution.color} rounded-xl mb-4 w-fit`}>
                        <solution.icon className="w-6 h-6 text-white" />
                      </div>
                      <h5 className="font-bold text-white mb-2">{solution.title}</h5>
                      <p className="text-slate-300 text-sm mb-4">{solution.description}</p>
                      <button
                        onClick={() => executeSolution(solution)}
                        className={`w-full py-3 bg-gradient-to-r ${solution.color} text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold`}
                      >
                        {solution.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default Emergency Mode Selection
  return (
    <div className="space-y-8">
      {/* Emergency Mode Header */}
      <div className="text-center space-y-4">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative p-6 bg-gradient-to-r from-red-400 to-orange-500 rounded-full">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-white">Emergency Neural Protocol</h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          When you're stuck, overwhelmed, or losing momentum, activate emergency mode for 
          instant AI analysis and solution options
        </p>
      </div>

      {/* Emergency Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panic Button */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-red-400/30 text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-red-400 to-orange-500 rounded-full p-4">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Immediate Panic Button</h3>
            <p className="text-slate-300 mb-6">
              Stuck on a specific task right now? Get instant AI analysis and solution options.
            </p>
            
            <button
              onClick={triggerPanicMode}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-2xl hover:from-red-400 hover:to-orange-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-1"
            >
              ACTIVATE PANIC MODE
            </button>
          </div>
        </div>

        {/* Emergency Reset */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-400 to-pink-500 rounded-full p-4">
                <Flame className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">36-Hour Reset Protocol</h3>
            <p className="text-slate-300 mb-6">
              Fallen back into procrastination patterns? Get a complete neural pathway rescue mission with structured checklist.
            </p>
            
            <button
              onClick={triggerEmergencyReset}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-400 hover:to-pink-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1"
            >
              START RESET PROTOCOL
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-red-400/20">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-red-400" />
            <span className="font-semibold text-red-400 font-mono">INSTANT ANALYSIS</span>
          </div>
          <p className="text-slate-300">
            AI analyzes your current neural state and identifies the root cause of your block
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/20">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-400" />
            <span className="font-semibold text-purple-400 font-mono">36-HOUR PROTOCOL</span>
          </div>
          <p className="text-slate-300">
            Complete neural pathway rescue mission with structured checklist and progress tracking
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/20">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="font-semibold text-yellow-400 font-mono">RAPID RECOVERY</span>
          </div>
          <p className="text-slate-300">
            Resume optimal productivity within minutes using targeted neural interventions
          </p>
        </div>
      </div>
    </div>
  );
}