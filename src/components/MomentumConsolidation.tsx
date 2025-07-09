import React, { useState, useEffect } from 'react';
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
  Lightbulb,
  FileText,
  BarChart3,
  Eye,
  Settings,
  Award,
  Sparkles,
  Crown,
  Star,
  Flame,
  Calendar,
  MapPin,
  Thermometer,
  Coffee,
  Music,
  Sun,
  Moon,
  Headphones,
  Monitor,
  Wifi,
  Home,
  Building,
  Users,
  Volume2,
  Wind,
  Smile,
  Heart,
  Bookmark,
  Edit3,
  Save,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';
import { User } from '../types';

interface MomentumConsolidationProps {
  user: User;
  onComplete: () => void;
}

interface NeuralDocumentation {
  executionDifferences: string;
  initiationSpeedComparison: string;
  resistanceDisappearance: string;
  overallTransformation: string;
}

interface PerformancePattern {
  environmentalFactors: string[];
  optimalTimeOfDay: string;
  peakMotivationPeriod: string;
  bestTaskTypes: string[];
  dopamineSpikes: string[];
}

interface ConsolidationMetrics {
  neuroplasticityWindow: number;
  pathwayStrength: number;
  retentionProbability: number;
  transferabilityScore: number;
}

interface EnvironmentalFactor {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  rating: number;
  notes: string;
}

interface TaskCharacteristic {
  id: string;
  name: string;
  dopamineLevel: number;
  frequency: number;
  notes: string;
}

export default function MomentumConsolidation({ user, onComplete }: MomentumConsolidationProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [documentation, setDocumentation] = useState<NeuralDocumentation>({
    executionDifferences: '',
    initiationSpeedComparison: '',
    resistanceDisappearance: '',
    overallTransformation: ''
  });
  const [patterns, setPatterns] = useState<PerformancePattern>({
    environmentalFactors: [],
    optimalTimeOfDay: '',
    peakMotivationPeriod: '',
    bestTaskTypes: [],
    dopamineSpikes: []
  });
  const [metrics, setMetrics] = useState<ConsolidationMetrics>({
    neuroplasticityWindow: 85,
    pathwayStrength: 78,
    retentionProbability: 92,
    transferabilityScore: 88
  });
  const [environmentalFactors, setEnvironmentalFactors] = useState<EnvironmentalFactor[]>([
    { id: 'location', name: 'Work Location', icon: MapPin, rating: 0, notes: '' },
    { id: 'temperature', name: 'Room Temperature', icon: Thermometer, rating: 0, notes: '' },
    { id: 'lighting', name: 'Lighting Conditions', icon: Sun, rating: 0, notes: '' },
    { id: 'noise', name: 'Background Noise', icon: Volume2, rating: 0, notes: '' },
    { id: 'music', name: 'Music/Audio', icon: Music, rating: 0, notes: '' },
    { id: 'beverages', name: 'Drinks Available', icon: Coffee, rating: 0, notes: '' },
    { id: 'setup', name: 'Workspace Setup', icon: Monitor, rating: 0, notes: '' },
    { id: 'connectivity', name: 'Internet/Tools', icon: Wifi, rating: 0, notes: '' }
  ]);
  const [taskCharacteristics, setTaskCharacteristics] = useState<TaskCharacteristic[]>([
    { id: 'creative', name: 'Creative Tasks', dopamineLevel: 0, frequency: 0, notes: '' },
    { id: 'analytical', name: 'Analytical Tasks', dopamineLevel: 0, frequency: 0, notes: '' },
    { id: 'implementation', name: 'Implementation Tasks', dopamineLevel: 0, frequency: 0, notes: '' },
    { id: 'planning', name: 'Planning Tasks', dopamineLevel: 0, frequency: 0, notes: '' },
    { id: 'review', name: 'Review/Testing Tasks', dopamineLevel: 0, frequency: 0, notes: '' },
    { id: 'communication', name: 'Communication Tasks', dopamineLevel: 0, frequency: 0, notes: '' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const timeOfDayOptions = [
    '6:00-8:00 AM (Early Morning)',
    '8:00-10:00 AM (Morning)',
    '10:00-12:00 PM (Late Morning)',
    '12:00-2:00 PM (Early Afternoon)',
    '2:00-4:00 PM (Afternoon)',
    '4:00-6:00 PM (Late Afternoon)',
    '6:00-8:00 PM (Evening)',
    '8:00-10:00 PM (Night)'
  ];

  const motivationPeriods = [
    'Right after waking up',
    'After morning coffee/breakfast',
    'Mid-morning energy peak',
    'Post-lunch recovery',
    'Afternoon focus window',
    'Evening wind-down',
    'Late night creativity',
    'Deadline pressure moments'
  ];

  useEffect(() => {
    // Simulate real-time neuroplasticity window optimization
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        neuroplasticityWindow: Math.min(prev.neuroplasticityWindow + 1, 95),
        pathwayStrength: Math.min(prev.pathwayStrength + 0.5, 85),
        retentionProbability: Math.min(prev.retentionProbability + 0.3, 96),
        transferabilityScore: Math.min(prev.transferabilityScore + 0.4, 92)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const updateEnvironmentalFactor = (id: string, field: string, value: any) => {
    setEnvironmentalFactors(prev => prev.map(factor => 
      factor.id === id ? { ...factor, [field]: value } : factor
    ));
  };

  const updateTaskCharacteristic = (id: string, field: string, value: any) => {
    setTaskCharacteristics(prev => prev.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const generatePatternAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const topEnvironmentalFactors = environmentalFactors
        .filter(factor => factor.rating >= 8)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map(factor => factor.name);

      const highDopamineTasks = taskCharacteristics
        .filter(task => task.dopamineLevel >= 8)
        .sort((a, b) => b.dopamineLevel - a.dopamineLevel)
        .map(task => task.name);

      const results = {
        topEnvironmentalFactors,
        optimalTaskSequence: [
          'Start with highest dopamine task type',
          'Alternate between creative and analytical',
          'Save implementation for peak energy periods',
          'End with review tasks for closure'
        ],
        peakEfficiencyPeriods: [
          patterns.optimalTimeOfDay,
          patterns.peakMotivationPeriod
        ].filter(Boolean),
        dopamineOptimization: highDopamineTasks,
        permanentSystemRecommendations: [
          'Replicate top 3 environmental conditions',
          'Schedule complex tasks during identified peak periods',
          'Use high-dopamine task types as momentum builders',
          'Implement 25-minute focus blocks with 5-minute celebrations',
          'Track daily initiation delay to maintain awareness',
          'Create environmental triggers for automatic task start'
        ]
      };

      setAnalysisResults(results);
      setIsAnalyzing(false);
      setCurrentStage(3);
    }, 4000);
  };

  const completeConsolidation = () => {
    setShowCelebration(true);
    setTimeout(() => {
      onComplete();
    }, 4000);
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Neural Pathway Documentation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Neural Pathway Documentation</h3>
                    <p className="text-blue-400 font-mono text-sm">NEUROPLASTICITY.CONSOLIDATION.PROTOCOL</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-2xl border border-blue-400/20 p-6 mb-6">
                  <p className="text-slate-300 text-lg mb-4">
                    <strong className="text-blue-400">Critical Documentation Window:</strong> Your brain is currently in peak 
                    neuroplasticity state. Documenting these changes now will strengthen the neural pathways permanently.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      What felt different during execution compared to your usual work sessions?
                    </label>
                    <textarea
                      value={documentation.executionDifferences}
                      onChange={(e) => setDocumentation(prev => ({ ...prev, executionDifferences: e.target.value }))}
                      placeholder="Describe the mental state, focus quality, resistance levels, energy patterns..."
                      className="w-full p-4 bg-slate-800/50 border-2 border-blue-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-500 text-white placeholder:text-slate-400 h-32"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      Compare your task initiation speed: Hour 1 vs Hour 21
                    </label>
                    <textarea
                      value={documentation.initiationSpeedComparison}
                      onChange={(e) => setDocumentation(prev => ({ ...prev, initiationSpeedComparison: e.target.value }))}
                      placeholder="How quickly did you start tasks at the beginning vs now? What changed?"
                      className="w-full p-4 bg-slate-800/50 border-2 border-blue-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-500 text-white placeholder:text-slate-400 h-32"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      Document specific moments when resistance disappeared
                    </label>
                    <textarea
                      value={documentation.resistanceDisappearance}
                      onChange={(e) => setDocumentation(prev => ({ ...prev, resistanceDisappearance: e.target.value }))}
                      placeholder="What triggered the shift from resistance to flow? Be specific about the moment..."
                      className="w-full p-4 bg-slate-800/50 border-2 border-blue-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-500 text-white placeholder:text-slate-400 h-32"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      Overall transformation summary
                    </label>
                    <textarea
                      value={documentation.overallTransformation}
                      onChange={(e) => setDocumentation(prev => ({ ...prev, overallTransformation: e.target.value }))}
                      placeholder="How do you feel different now compared to when you started? What has fundamentally changed?"
                      className="w-full p-4 bg-slate-800/50 border-2 border-blue-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-500 text-white placeholder:text-slate-400 h-32"
                    />
                  </div>
                </div>

                {Object.values(documentation).every(value => value.trim()) && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setCurrentStage(2)}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-400 hover:to-indigo-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1"
                    >
                      CONTINUE TO PATTERN RECOGNITION
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
            {/* Success Pattern Recognition */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-green-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Success Pattern Recognition</h3>
                    <p className="text-green-400 font-mono text-sm">PERFORMANCE.OPTIMIZATION.ANALYSIS</p>
                  </div>
                </div>

                {/* Environmental Factors */}
                <div className="bg-green-500/10 rounded-2xl border border-green-400/20 p-6 mb-8">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-green-400" />
                    Environmental Conditions Analysis
                  </h4>
                  <p className="text-slate-300 mb-6">
                    Rate each environmental factor based on how much it contributed to your peak performance (1-10):
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {environmentalFactors.map((factor) => {
                      const IconComponent = factor.icon;
                      return (
                        <div key={factor.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                          <div className="flex items-center gap-3 mb-3">
                            <IconComponent className="w-5 h-5 text-green-400" />
                            <span className="font-semibold text-white">{factor.name}</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-400">Impact Rating</span>
                                <span className="text-green-400 font-bold">{factor.rating}/10</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={factor.rating}
                                onChange={(e) => updateEnvironmentalFactor(factor.id, 'rating', parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>
                            
                            <input
                              type="text"
                              value={factor.notes}
                              onChange={(e) => updateEnvironmentalFactor(factor.id, 'notes', e.target.value)}
                              placeholder="Specific details about this factor..."
                              className="w-full p-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timing Analysis */}
                <div className="bg-green-500/10 rounded-2xl border border-green-400/20 p-6 mb-8">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-400" />
                    Optimal Timing Analysis
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-green-400 mb-3">
                        Time of day when you felt most motivated:
                      </label>
                      <select
                        value={patterns.optimalTimeOfDay}
                        onChange={(e) => setPatterns(prev => ({ ...prev, optimalTimeOfDay: e.target.value }))}
                        className="w-full p-3 bg-slate-800/50 border border-green-400/30 rounded-xl text-white"
                      >
                        <option value="">Select optimal time...</option>
                        {timeOfDayOptions.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-green-400 mb-3">
                        Peak motivation period:
                      </label>
                      <select
                        value={patterns.peakMotivationPeriod}
                        onChange={(e) => setPatterns(prev => ({ ...prev, peakMotivationPeriod: e.target.value }))}
                        className="w-full p-3 bg-slate-800/50 border border-green-400/30 rounded-xl text-white"
                      >
                        <option value="">Select peak period...</option>
                        {motivationPeriods.map((period) => (
                          <option key={period} value={period}>{period}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Task Type Analysis */}
                <div className="bg-green-500/10 rounded-2xl border border-green-400/20 p-6">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-400" />
                    Task Type Dopamine Analysis
                  </h4>
                  <p className="text-slate-300 mb-6">
                    Rate each task type based on dopamine response and how frequently you want to do them:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {taskCharacteristics.map((task) => (
                      <div key={task.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600">
                        <h5 className="font-semibold text-white mb-3">{task.name}</h5>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-400">Dopamine Level</span>
                              <span className="text-green-400 font-bold">{task.dopamineLevel}/10</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={task.dopamineLevel}
                              onChange={(e) => updateTaskCharacteristic(task.id, 'dopamineLevel', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-400">Frequency Preference</span>
                              <span className="text-blue-400 font-bold">{task.frequency}/10</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={task.frequency}
                              onChange={(e) => updateTaskCharacteristic(task.id, 'frequency', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          
                          <input
                            type="text"
                            value={task.notes}
                            onChange={(e) => updateTaskCharacteristic(task.id, 'notes', e.target.value)}
                            placeholder="Notes about this task type..."
                            className="w-full p-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Analysis Button */}
                {patterns.optimalTimeOfDay && patterns.peakMotivationPeriod && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={generatePatternAnalysis}
                      disabled={isAnalyzing}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-400 hover:to-emerald-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>ANALYZING NEURAL PATTERNS...</span>
                        </div>
                      ) : (
                        'GENERATE PATTERN ANALYSIS'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            {/* Pattern Analysis Results */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Pattern Analysis Results</h3>
                    <p className="text-purple-400 font-mono text-sm">NEURAL.OPTIMIZATION.INSIGHTS</p>
                  </div>
                </div>

                {analysisResults && (
                  <div className="space-y-6">
                    {/* Top Environmental Factors */}
                    <div className="bg-purple-500/10 rounded-2xl border border-purple-400/20 p-6">
                      <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                        <Star className="w-5 h-5 text-purple-400" />
                        Top 3 Environmental Factors for Peak Performance
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {analysisResults.topEnvironmentalFactors.map((factor: string, index: number) => (
                          <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-purple-400/20 text-center">
                            <div className="text-2xl font-bold text-purple-400 mb-2">#{index + 1}</div>
                            <div className="text-white font-semibold">{factor}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Optimal Task Sequence */}
                    <div className="bg-blue-500/10 rounded-2xl border border-blue-400/20 p-6">
                      <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                        <Target className="w-5 h-5 text-blue-400" />
                        Optimal Task Sequence Pattern
                      </h4>
                      <div className="space-y-3">
                        {analysisResults.optimalTaskSequence.map((step: string, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <span className="text-slate-300">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Peak Efficiency Periods */}
                    <div className="bg-green-500/10 rounded-2xl border border-green-400/20 p-6">
                      <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-green-400" />
                        Peak Prefrontal Cortex Efficiency Periods
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResults.peakEfficiencyPeriods.map((period: string, index: number) => (
                          <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-green-400/20">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-green-400" />
                              <span className="text-white font-semibold">{period}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dopamine Optimization */}
                    <div className="bg-yellow-500/10 rounded-2xl border border-yellow-400/20 p-6">
                      <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Highest Dopamine Response Tasks
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {analysisResults.dopamineOptimization.map((task: string, index: number) => (
                          <div key={index} className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold">
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Permanent System Recommendations */}
                    <div className="bg-cyan-500/10 rounded-2xl border border-cyan-400/20 p-6">
                      <h4 className="font-bold text-white mb-4 flex items-center gap-3">
                        <Settings className="w-5 h-5 text-cyan-400" />
                        Permanent Productivity System Design
                      </h4>
                      <div className="space-y-3">
                        {analysisResults.permanentSystemRecommendations.map((recommendation: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <button
                    onClick={completeConsolidation}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-3xl hover:from-purple-400 hover:to-pink-500 transition-all duration-500 font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 group-hover:scale-105">
                      <div className="flex items-center gap-4">
                        <Crown className="w-8 h-8 animate-pulse" />
                        <span>Complete Neural Consolidation</span>
                        <Sparkles className="w-8 h-8 animate-pulse" />
                      </div>
                      <div className="text-sm font-mono mt-2 opacity-90">
                        NEUROPLASTICITY.WINDOW.OPTIMIZED
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

  // Show celebration modal
  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/30 to-yellow-500/30 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-slate-800/90 to-yellow-900/50 backdrop-blur-2xl rounded-3xl p-12 border border-yellow-400/30 text-center max-w-3xl">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-50 animate-ping"></div>
              <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-8">
                <Crown className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h2 className="text-5xl font-bold text-white mb-6">
              🧠 NEURAL TRANSFORMATION COMPLETE! 🧠
            </h2>
            <p className="text-2xl text-yellow-400 mb-8 font-semibold">
              24-Hour Brain Rewiring Protocol Successfully Completed
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-yellow-500/10 rounded-2xl border border-yellow-400/30 p-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Brain className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">+2,500 Neural Points</span>
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-slate-300">
                  Massive neural point bonus for completing the full 24-hour transformation protocol!
                </p>
              </div>
              
              <div className="bg-green-500/10 rounded-2xl border border-green-400/30 p-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Trophy className="w-8 h-8 text-green-400" />
                  <span className="text-xl font-bold text-green-400">Master Achievement</span>
                  <Award className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-slate-300">
                  Unlocked: "Neural Architect" - Complete brain rewiring mastery
                </p>
              </div>
            </div>

            <div className="bg-purple-500/10 rounded-2xl border border-purple-400/30 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Transformation Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-400">{metrics.neuroplasticityWindow}%</div>
                  <div className="text-sm text-slate-400">Neuroplasticity</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">{metrics.pathwayStrength}%</div>
                  <div className="text-sm text-slate-400">Pathway Strength</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">{metrics.retentionProbability}%</div>
                  <div className="text-sm text-slate-400">Retention Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">{metrics.transferabilityScore}%</div>
                  <div className="text-sm text-slate-400">Transferability</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-slate-400 text-lg">
                Your brain has been successfully rewired. The neural pathways for productivity 
                are now permanently established and will continue strengthening with use.
              </p>
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
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Momentum Consolidation</h1>
                <p className="text-indigo-400 font-mono text-sm">HOURS 21-24 // NEUROPLASTICITY.WINDOW.OPTIMIZATION</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-400">
                Stage {currentStage}/3
              </div>
              <div className="text-sm text-slate-400">Neural Consolidation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Neuroplasticity Window Metrics */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Neuroplasticity Window Optimization</h3>
              <p className="text-cyan-400 font-mono text-sm">CRITICAL.CONSOLIDATION.PERIOD</p>
            </div>
          </div>

          <div className="bg-cyan-500/10 rounded-2xl border border-cyan-400/20 p-6 mb-6">
            <p className="text-slate-300 text-lg mb-4">
              <strong className="text-cyan-400">Hours 21-24 represent a critical neuroplasticity window.</strong> Your brain 
              is most receptive to forming permanent neural pathways during this period. Proper consolidation now 
              ensures these changes become automatic and lasting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {metrics.neuroplasticityWindow}%
              </div>
              <div className="text-sm text-slate-400 mb-2">Neuroplasticity Window</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.neuroplasticityWindow}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {metrics.pathwayStrength}%
              </div>
              <div className="text-sm text-slate-400 mb-2">Pathway Strength</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.pathwayStrength}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {metrics.retentionProbability}%
              </div>
              <div className="text-sm text-slate-400 mb-2">Retention Probability</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.retentionProbability}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {metrics.transferabilityScore}%
              </div>
              <div className="text-sm text-slate-400 mb-2">Transferability Score</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.transferabilityScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Content */}
      {renderStage()}
    </div>
  );
}