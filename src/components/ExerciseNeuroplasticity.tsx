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
  Activity,
  TrendingUp,
  Heart,
  Wind,
  Flame,
  Award,
  Sparkles,
  Crown,
  Star,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Eye,
  Smile,
  Volume2,
  Calendar,
  MapPin,
  Dumbbell,
  Mountain,
  Waves,
  Sun,
  Moon,
  Coffee,
  Apple,
  Droplets,
  ThermometerSun,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { User } from '../types';

interface ExerciseNeuroplasticityProps {
  user: User;
  onComplete: () => void;
}

interface ExerciseProfile {
  age: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  limitations: string[];
  preferences: string[];
  timeOfDay: string;
  maxHeartRate: number;
  targetZoneMin: number;
  targetZoneMax: number;
}

interface ExerciseSession {
  id: string;
  name: string;
  duration: number;
  intensity: 'light' | 'moderate' | 'high';
  description: string;
  instructions: string[];
  benefits: string[];
  heartRateTarget: string;
}

interface BDNFMetrics {
  currentLevel: number;
  peakLevel: number;
  duration: number;
  cognitiveEnhancement: number;
  rewardCircuitryStrength: number;
}

interface PhysiologicalMarkers {
  heartRate: number;
  perceivedExertion: number;
  energyLevel: number;
  moodRating: number;
  focusClarity: number;
  motivationLevel: number;
}

export default function ExerciseNeuroplasticity({ user, onComplete }: ExerciseNeuroplasticityProps) {
  const [currentPhase, setCurrentPhase] = useState(1); // 1: Profile, 2: Session 1, 3: Session 2, 4: Completion
  const [exerciseProfile, setExerciseProfile] = useState<ExerciseProfile>({
    age: 30,
    fitnessLevel: 'intermediate',
    equipment: [],
    limitations: [],
    preferences: [],
    timeOfDay: '',
    maxHeartRate: 190,
    targetZoneMin: 114,
    targetZoneMax: 162
  });
  const [currentSession, setCurrentSession] = useState<ExerciseSession | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentExercisePhase, setCurrentExercisePhase] = useState(0);
  const [bdnfMetrics, setBdnfMetrics] = useState<BDNFMetrics>({
    currentLevel: 100,
    peakLevel: 100,
    duration: 0,
    cognitiveEnhancement: 0,
    rewardCircuitryStrength: 0
  });
  const [physiologicalMarkers, setPhysiologicalMarkers] = useState<PhysiologicalMarkers>({
    heartRate: 70,
    perceivedExertion: 1,
    energyLevel: 7,
    moodRating: 7,
    focusClarity: 7,
    motivationLevel: 7
  });
  const [isGeneratingProtocol, setIsGeneratingProtocol] = useState(false);
  const [personalizedSessions, setPersonalizedSessions] = useState<ExerciseSession[]>([]);
  const [completedSessions, setCompletedSessions] = useState<ExerciseSession[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [expandedInstructions, setExpandedInstructions] = useState(false);

  const sessionTimerRef = useRef<NodeJS.Timeout>();

  const equipmentOptions = [
    'No equipment (bodyweight only)',
    'Dumbbells',
    'Resistance bands',
    'Yoga mat',
    'Treadmill',
    'Stationary bike',
    'Kettlebells',
    'Pull-up bar',
    'Jump rope',
    'Foam roller'
  ];

  const exercisePreferences = [
    'Cardio/Running',
    'Strength training',
    'Yoga/Stretching',
    'High-intensity intervals',
    'Dancing',
    'Swimming',
    'Cycling',
    'Martial arts',
    'Team sports',
    'Outdoor activities'
  ];

  const timeOfDayOptions = [
    'Early morning (6-8 AM)',
    'Morning (8-10 AM)',
    'Late morning (10-12 PM)',
    'Afternoon (12-3 PM)',
    'Late afternoon (3-6 PM)',
    'Evening (6-8 PM)',
    'Night (8-10 PM)'
  ];

  // Timer effect
  useEffect(() => {
    if (isSessionActive) {
      sessionTimerRef.current = setInterval(() => {
        setSessionTimer(prev => prev + 1);
        
        // Update BDNF metrics during exercise
        setBdnfMetrics(prev => ({
          ...prev,
          currentLevel: Math.min(prev.currentLevel + 2, 300),
          peakLevel: Math.max(prev.peakLevel, prev.currentLevel + 2),
          duration: prev.duration + 1,
          cognitiveEnhancement: Math.min(prev.cognitiveEnhancement + 0.5, 85),
          rewardCircuitryStrength: Math.min(prev.rewardCircuitryStrength + 0.3, 75)
        }));
      }, 1000);
    } else {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    }

    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isSessionActive]);

  // Calculate heart rate zones
  useEffect(() => {
    const maxHR = 220 - exerciseProfile.age;
    const targetMin = Math.round(maxHR * 0.6);
    const targetMax = Math.round(maxHR * 0.85);
    
    setExerciseProfile(prev => ({
      ...prev,
      maxHeartRate: maxHR,
      targetZoneMin: targetMin,
      targetZoneMax: targetMax
    }));
  }, [exerciseProfile.age]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generatePersonalizedProtocol = () => {
    setIsGeneratingProtocol(true);
    
    // Simulate AI protocol generation
    setTimeout(() => {
      const sessions = generateExerciseSessions();
      setPersonalizedSessions(sessions);
      setIsGeneratingProtocol(false);
      setCurrentPhase(2);
    }, 3000);
  };

  const generateExerciseSessions = (): ExerciseSession[] => {
    const baseSession: ExerciseSession = {
      id: 'session-1',
      name: 'BDNF Activation Protocol',
      duration: 45 * 60, // 45 minutes in seconds
      intensity: 'moderate',
      description: 'Optimized for maximum BDNF production and reward circuitry enhancement',
      instructions: [
        'Minutes 1-5: Light warm-up (walking, gentle stretching)',
        'Minutes 6-15: Moderate intensity (60-70% max heart rate)',
        'Minutes 16-35: Interval training (2 min high, 1 min recovery, repeat)',
        'Minutes 36-40: Cool-down (gradual intensity reduction)',
        'Minutes 41-45: Meditation/breathing focus'
      ],
      benefits: [
        '200-300% increase in BDNF levels',
        'Enhanced medial orbitofrontal cortex activity',
        'Strengthened reward anticipation pathways',
        'Improved cognitive performance for 2-4 hours post-exercise'
      ],
      heartRateTarget: `${exerciseProfile.targetZoneMin}-${exerciseProfile.targetZoneMax} BPM`
    };

    // Customize based on user preferences and equipment
    if (exerciseProfile.preferences.includes('Cardio/Running')) {
      baseSession.instructions[1] = 'Minutes 6-15: Moderate jogging or brisk walking';
      baseSession.instructions[2] = 'Minutes 16-35: Running intervals (2 min fast, 1 min walk)';
    } else if (exerciseProfile.preferences.includes('Strength training')) {
      baseSession.instructions[1] = 'Minutes 6-15: Light resistance exercises';
      baseSession.instructions[2] = 'Minutes 16-35: Circuit training (bodyweight or weights)';
    } else if (exerciseProfile.preferences.includes('Yoga/Stretching')) {
      baseSession.instructions[1] = 'Minutes 6-15: Dynamic yoga flow';
      baseSession.instructions[2] = 'Minutes 16-35: Power yoga intervals';
    }

    return [baseSession];
  };

  const startExerciseSession = (session: ExerciseSession) => {
    setCurrentSession(session);
    setSessionTimer(0);
    setCurrentExercisePhase(0);
    setIsSessionActive(true);
    
    // Reset BDNF metrics for new session
    setBdnfMetrics({
      currentLevel: 100,
      peakLevel: 100,
      duration: 0,
      cognitiveEnhancement: 0,
      rewardCircuitryStrength: 0
    });
  };

  const completeSession = () => {
    if (currentSession) {
      setCompletedSessions(prev => [...prev, currentSession]);
      setCurrentSession(null);
      setIsSessionActive(false);
      setSessionTimer(0);
      
      // Show completion celebration
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        if (completedSessions.length === 0) {
          // After first session, show option for second session or completion
          setCurrentPhase(3);
        } else {
          // After second session, complete the protocol
          setCurrentPhase(4);
        }
      }, 3000);
    }
  };

  const getCurrentPhaseInstructions = () => {
    if (!currentSession) return '';
    
    const elapsed = sessionTimer;
    if (elapsed < 300) return currentSession.instructions[0]; // 0-5 minutes
    if (elapsed < 900) return currentSession.instructions[1]; // 5-15 minutes
    if (elapsed < 2100) return currentSession.instructions[2]; // 15-35 minutes
    if (elapsed < 2400) return currentSession.instructions[3]; // 35-40 minutes
    return currentSession.instructions[4]; // 40-45 minutes
  };

  const getPhaseProgress = () => {
    if (!currentSession) return 0;
    return Math.min((sessionTimer / currentSession.duration) * 100, 100);
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Exercise Profile Setup */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-orange-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Exercise Profile Configuration</h3>
                    <p className="text-orange-400 font-mono text-sm">PERSONALIZED.NEUROPLASTICITY.OPTIMIZATION</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Age and Fitness Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-bold text-white mb-4">Age</label>
                      <input
                        type="number"
                        value={exerciseProfile.age}
                        onChange={(e) => setExerciseProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 30 }))}
                        className="w-full p-4 bg-slate-800/50 border-2 border-orange-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-400 transition-all duration-500 text-white"
                        min="18"
                        max="80"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-lg font-bold text-white mb-4">Fitness Level</label>
                      <select
                        value={exerciseProfile.fitnessLevel}
                        onChange={(e) => setExerciseProfile(prev => ({ ...prev, fitnessLevel: e.target.value as any }))}
                        className="w-full p-4 bg-slate-800/50 border-2 border-orange-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-400 transition-all duration-500 text-white"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Heart Rate Zones Display */}
                  <div className="bg-orange-500/10 rounded-2xl border border-orange-400/20 p-6">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                      <Heart className="w-5 h-5 text-orange-400" />
                      Your Neuroplasticity Heart Rate Zones
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{exerciseProfile.maxHeartRate}</div>
                        <div className="text-sm text-slate-400">Max Heart Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{exerciseProfile.targetZoneMin}-{exerciseProfile.targetZoneMax}</div>
                        <div className="text-sm text-slate-400">Target Zone (60-85%)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">BDNF Optimal</div>
                        <div className="text-sm text-slate-400">Neuroplasticity Zone</div>
                      </div>
                    </div>
                  </div>

                  {/* Available Equipment */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">Available Equipment</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {equipmentOptions.map((equipment) => (
                        <label key={equipment} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600 hover:border-orange-400/50 transition-all duration-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exerciseProfile.equipment.includes(equipment)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setExerciseProfile(prev => ({ ...prev, equipment: [...prev.equipment, equipment] }));
                              } else {
                                setExerciseProfile(prev => ({ ...prev, equipment: prev.equipment.filter(eq => eq !== equipment) }));
                              }
                            }}
                            className="w-4 h-4 text-orange-400"
                          />
                          <span className="text-slate-300">{equipment}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Exercise Preferences */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">Exercise Preferences</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {exercisePreferences.map((preference) => (
                        <label key={preference} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600 hover:border-orange-400/50 transition-all duration-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exerciseProfile.preferences.includes(preference)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setExerciseProfile(prev => ({ ...prev, preferences: [...prev.preferences, preference] }));
                              } else {
                                setExerciseProfile(prev => ({ ...prev, preferences: prev.preferences.filter(pref => pref !== preference) }));
                              }
                            }}
                            className="w-4 h-4 text-orange-400"
                          />
                          <span className="text-slate-300">{preference}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Time of Day */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">Preferred Exercise Time</label>
                    <select
                      value={exerciseProfile.timeOfDay}
                      onChange={(e) => setExerciseProfile(prev => ({ ...prev, timeOfDay: e.target.value }))}
                      className="w-full p-4 bg-slate-800/50 border-2 border-orange-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-400 transition-all duration-500 text-white"
                    >
                      <option value="">Select preferred time...</option>
                      {timeOfDayOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  {/* Physical Limitations */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">Physical Limitations or Injuries</label>
                    <textarea
                      value={exerciseProfile.limitations.join('\n')}
                      onChange={(e) => setExerciseProfile(prev => ({ ...prev, limitations: e.target.value.split('\n').filter(l => l.trim()) }))}
                      placeholder="List any injuries, limitations, or areas to avoid..."
                      className="w-full p-4 bg-slate-800/50 border-2 border-orange-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-400 transition-all duration-500 text-white placeholder:text-slate-400 h-24"
                    />
                  </div>
                </div>

                {/* Generate Protocol Button */}
                {exerciseProfile.equipment.length > 0 && exerciseProfile.preferences.length > 0 && exerciseProfile.timeOfDay && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={generatePersonalizedProtocol}
                      disabled={isGeneratingProtocol}
                      className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-400 hover:to-red-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-1 disabled:opacity-50"
                    >
                      {isGeneratingProtocol ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>GENERATING NEUROPLASTICITY PROTOCOL...</span>
                        </div>
                      ) : (
                        'GENERATE PERSONALIZED EXERCISE PROTOCOL'
                      )}
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
            {/* Exercise Session Interface */}
            {currentSession ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-red-400/30">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{currentSession.name}</h3>
                        <p className="text-red-400 text-sm">{currentSession.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-400 font-mono">
                        {formatTime(sessionTimer)}
                      </div>
                      <div className="text-sm text-slate-400">
                        / {formatTime(currentSession.duration)}
                      </div>
                    </div>
                  </div>

                  {/* Current Phase Instructions */}
                  <div className="bg-red-500/10 rounded-2xl border border-red-400/20 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-white">Current Phase Instructions</h4>
                      <button
                        onClick={() => setExpandedInstructions(!expandedInstructions)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        {expandedInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        <span className="text-sm">All Instructions</span>
                      </button>
                    </div>
                    
                    <div className="text-lg text-slate-300 mb-4">
                      {getCurrentPhaseInstructions()}
                    </div>
                    
                    {expandedInstructions && (
                      <div className="space-y-2 pt-4 border-t border-red-400/20">
                        {currentSession.instructions.map((instruction, index) => (
                          <div key={index} className="text-sm text-slate-400">
                            {instruction}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">Session Progress</span>
                      <span className="text-red-400 font-bold">{Math.round(getPhaseProgress())}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-red-400 to-pink-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${getPhaseProgress()}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Session Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setIsSessionActive(!isSessionActive)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                        isSessionActive
                          ? 'bg-orange-500 hover:bg-orange-400 text-white'
                          : 'bg-green-500 hover:bg-green-400 text-white'
                      }`}
                    >
                      {isSessionActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      {isSessionActive ? 'Pause' : 'Start/Resume'}
                    </button>
                    
                    <button
                      onClick={completeSession}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Complete Session
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Session Selection */
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Start Your BDNF Activation Session</h3>
                      <p className="text-blue-400 font-mono text-sm">NEUROPLASTICITY.ENHANCEMENT.READY</p>
                    </div>
                  </div>

                  {personalizedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-6 bg-slate-700/30 rounded-xl border border-slate-600 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group"
                      onClick={() => startExerciseSession(session)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                          {session.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-blue-400">
                            {Math.floor(session.duration / 60)} minutes
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 text-sm mb-4">{session.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-semibold text-blue-400 mb-2">Target Heart Rate:</h5>
                          <p className="text-slate-300 text-sm">{session.heartRateTarget}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-blue-400 mb-2">Expected Benefits:</h5>
                          <ul className="text-slate-300 text-sm space-y-1">
                            {session.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BDNF Metrics Display */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-green-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Real-time BDNF Monitoring</h3>
                    <p className="text-green-400 font-mono text-sm">BRAIN.DERIVED.NEUROTROPHIC.FACTOR</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {bdnfMetrics.currentLevel}%
                    </div>
                    <div className="text-sm text-slate-400 mb-2">Current BDNF Level</div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(bdnfMetrics.currentLevel / 3, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {Math.round(bdnfMetrics.cognitiveEnhancement)}%
                    </div>
                    <div className="text-sm text-slate-400 mb-2">Cognitive Enhancement</div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${bdnfMetrics.cognitiveEnhancement}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {Math.round(bdnfMetrics.rewardCircuitryStrength)}%
                    </div>
                    <div className="text-sm text-slate-400 mb-2">Reward Circuitry</div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${bdnfMetrics.rewardCircuitryStrength}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-green-500/10 rounded-2xl border border-green-400/20 p-4">
                  <p className="text-slate-300 text-sm">
                    <strong className="text-green-400">BDNF Enhancement:</strong> Exercise increases BDNF by 200-300% 
                    and remains elevated for 2-4 hours post-exercise, optimizing neuroplasticity and reward system function.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            {/* Session Completion Summary */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-green-400/30 text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-4">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  First Session Complete!
                </h3>
                <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                  Your BDNF levels are now elevated and your reward circuitry is primed. 
                  You can continue with cognitive work or complete a second session for maximum benefit.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setCurrentPhase(4)}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1"
                  >
                    Continue to Cognitive Work
                  </button>
                  
                  <button
                    onClick={() => {
                      setCurrentSession(null);
                      setCurrentPhase(2);
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-400 hover:to-red-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-1"
                  >
                    Second Exercise Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            {/* Protocol Completion */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
                  <div className="absolute inset-0 bg-purple-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-purple-400 to-pink-500 rounded-full p-6">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-4">
                  Exercise-Induced Neuroplasticity Complete!
                </h2>
                <p className="text-purple-400 text-xl mb-8 font-semibold">
                  36-Hour Neural Transformation Protocol Successfully Completed
                </p>
                
                <div className="bg-purple-500/10 rounded-2xl border border-purple-400/30 p-8 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Final Neural Enhancement Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">{bdnfMetrics.peakLevel}%</div>
                      <div className="text-sm text-slate-400">Peak BDNF Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">{Math.round(bdnfMetrics.cognitiveEnhancement)}%</div>
                      <div className="text-sm text-slate-400">Cognitive Enhancement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">{Math.round(bdnfMetrics.rewardCircuitryStrength)}%</div>
                      <div className="text-sm text-slate-400">Reward Circuitry</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400">2-4hrs</div>
                      <div className="text-sm text-slate-400">Enhancement Duration</div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/10 rounded-2xl border border-cyan-400/30 p-6 mb-8">
                  <h4 className="font-bold text-white mb-4">Post-Exercise Cognitive Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="text-left">
                      <h5 className="font-semibold text-cyan-400 mb-2">Enhanced Functions:</h5>
                      <ul className="text-slate-300 space-y-1">
                        <li>• Improved working memory</li>
                        <li>• Enhanced focus and attention</li>
                        <li>• Increased motivation</li>
                        <li>• Better mood regulation</li>
                      </ul>
                    </div>
                    <div className="text-left">
                      <h5 className="font-semibold text-cyan-400 mb-2">Optimal Activities:</h5>
                      <ul className="text-slate-300 space-y-1">
                        <li>• Complex problem solving</li>
                        <li>• Creative work</li>
                        <li>• Learning new skills</li>
                        <li>• Strategic planning</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onComplete}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                  <div className="relative px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-3xl hover:from-purple-400 hover:to-pink-500 transition-all duration-500 font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 group-hover:scale-105">
                    <div className="flex items-center gap-4">
                      <Trophy className="w-8 h-8 animate-pulse" />
                      <span>Complete 36-Hour Protocol</span>
                      <Sparkles className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="text-sm font-mono mt-2 opacity-90">
                      NEURAL.TRANSFORMATION.MASTERY
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show celebration modal
  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-slate-800/90 to-green-900/50 backdrop-blur-2xl rounded-3xl p-12 border border-green-400/30 text-center max-w-2xl">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-50 animate-ping"></div>
              <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-6">
                <Activity className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">
              🏃‍♂️ BDNF ACTIVATION COMPLETE! 🧠
            </h2>
            <p className="text-xl text-green-400 mb-6 font-semibold">
              Exercise Session Successfully Completed
            </p>
            
            <div className="bg-green-500/10 rounded-2xl border border-green-400/30 p-6 mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Brain className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-green-400">+1,000 Neural Points</span>
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-slate-300 text-lg">
                Your BDNF levels are now elevated by 200-300% and will remain enhanced for the next 2-4 hours!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-700/30 rounded-xl p-3 border border-green-400/20">
                <div className="text-green-400 font-semibold">Enhanced Neuroplasticity</div>
                <div className="text-slate-300">Brain ready for optimal learning</div>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-3 border border-blue-400/20">
                <div className="text-blue-400 font-semibold">Reward System Boost</div>
                <div className="text-slate-300">Motivation circuits activated</div>
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
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-orange-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Exercise-Induced Neuroplasticity</h1>
                <p className="text-orange-400 font-mono text-sm">HOURS 25-36 // BDNF.ACTIVATION.PROTOCOL</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">
                Phase {currentPhase}/4
              </div>
              <div className="text-sm text-slate-400">Neural Enhancement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Medial Orbitofrontal Cortex Advantage */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">The Medial Orbitofrontal Cortex Advantage</h3>
              <p className="text-cyan-400 font-mono text-sm">REWARD.CIRCUITRY.ENHANCEMENT</p>
            </div>
          </div>

          <div className="bg-cyan-500/10 rounded-2xl border border-cyan-400/20 p-6">
            <p className="text-slate-300 text-lg leading-relaxed">
              <strong className="text-cyan-400">Aerobic exercise specifically enhances brain responses to rewards</strong> in the 
              medial orbitofrontal cortex—the region responsible for motivation and reward anticipation. This creates 
              a powerful synergy with your newly established neural pathways, making productive behaviors even more 
              rewarding and automatic.
            </p>
          </div>
        </div>
      </div>

      {/* Phase Content */}
      {renderPhase()}
    </div>
  );
}