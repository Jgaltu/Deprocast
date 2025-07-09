import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Brain, Timer, CheckCircle, Zap } from 'lucide-react';
import { User, OnboardingData } from '../types';
import { OnboardingService } from '../services/onboardingService';

interface OnboardingFlowProps {
  user: User;
  onComplete: (data: OnboardingData) => void;
  onClose: () => void;
}

export default function OnboardingFlow({ user, onComplete, onClose }: OnboardingFlowProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({
    accomplishments: [],
    rewardPreferences: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [accomplishmentInputs, setAccomplishmentInputs] = useState(['', '', '']);
  const [sliderValue, setSliderValue] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const sliderRef = useRef<HTMLInputElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Add overflow hidden to body when modal opens
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0px'; // Prevent layout shift
    
    // Cleanup function to restore scroll when modal closes
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
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
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveProgress = async (slideData: Partial<OnboardingData>) => {
    try {
      await OnboardingService.saveProgress(user.id, currentSlide, slideData);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    setIsDragging(true);
  };

  const handleSliderRelease = async () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const newData = { ...onboardingData, baselineAnxiety: sliderValue };
    setOnboardingData(newData);
    
    // Save to Supabase
    await saveProgress(newData);
    
    // Auto-advance after a brief delay
    setTimeout(() => {
      setCurrentSlide(2);
    }, 1200);
  };

  const handleProcrastinationSelect = async (frequency: string) => {
    const newData = { ...onboardingData, procrastinationFrequency: frequency };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(3);
  };

  const handleAccomplishmentChange = (index: number, value: string) => {
    const newInputs = [...accomplishmentInputs];
    newInputs[index] = value;
    setAccomplishmentInputs(newInputs);

    // Start timer when first input is entered
    if (!timerActive && value.trim() && accomplishmentInputs.every(input => !input.trim())) {
      setTimerActive(true);
    }

    // Check if all three are filled
    if (newInputs.every(input => input.trim())) {
      const newData = { 
        ...onboardingData, 
        accomplishments: newInputs.filter(input => input.trim()),
        dopamineResponse: 8 // High response for completing the task
      };
      setOnboardingData(newData);
    }
  };

  const completeAccomplishmentTask = async () => {
    setTimerActive(false);
    const newData = { 
      ...onboardingData, 
      accomplishments: accomplishmentInputs.filter(input => input.trim()),
      dopamineResponse: 8
    };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(4);
  };

  const handleTriggerSelect = async (trigger: string) => {
    const newData = { ...onboardingData, triggerType: trigger };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(6);
  };

  const handleAvoidanceSelect = async (pattern: string) => {
    const newData = { ...onboardingData, avoidancePattern: pattern };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(7);
  };

  const handleEnvironmentSelect = async (environment: string) => {
    const newData = { ...onboardingData, workEnvironment: environment };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(8);
  };

  const handleMotivationSelect = async (motivation: string) => {
    const newData = { ...onboardingData, motivationStyle: motivation };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(9);
  };

  const handleRewardRating = (reward: string, rating: number) => {
    const newPreferences = { ...onboardingData.rewardPreferences, [reward]: rating };
    setOnboardingData({ ...onboardingData, rewardPreferences: newPreferences });
  };

  const completeRewardRating = async () => {
    await saveProgress(onboardingData);
    setCurrentSlide(10);
  };

  const handleSessionLengthSelect = async (length: string) => {
    const newData = { ...onboardingData, sessionLength: length };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(11);
  };

  const handleProjectInput = async (project: string) => {
    const newData = { ...onboardingData, biggestProject: project };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(12);
  };

  const handleFrustrationInput = async (frustration: string) => {
    const newData = { ...onboardingData, currentFrustration: frustration };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(13);
  };

  const handleSuccessInput = async (success: string, factors: string) => {
    const newData = { 
      ...onboardingData, 
      biggestSuccess: success,
      successFactors: factors
    };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(14);
  };

  const handleActionInputs = async (first: string, second: string, third: string) => {
    const newData = { 
      ...onboardingData, 
      firstAction: first,
      secondAction: second,
      thirdAction: third
    };
    setOnboardingData(newData);
    await saveProgress(newData);
    setCurrentSlide(15);
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      const completeData = {
        ...onboardingData,
        completionAttempted: true,
        resistanceLevel: 3, // Default low resistance
        signupTimestamp: new Date()
      } as OnboardingData;

      await OnboardingService.completeOnboarding(user.id, completeData);
      onComplete(completeData);
      
      // Close the onboarding modal and return to home
      handleClose();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleClose = () => {
    // Restore body scroll before closing
    document.body.style.overflow = 'unset';
    document.body.style.paddingRight = '0px';
    onClose();
  };

  const getSliderColor = (value: number) => {
    if (value <= 2) return 'from-green-400 to-emerald-500';
    if (value <= 4) return 'from-yellow-400 to-orange-400';
    if (value <= 6) return 'from-orange-400 to-red-400';
    if (value <= 8) return 'from-red-400 to-red-500';
    return 'from-red-500 to-red-600';
  };

  const getSliderBackground = (value: number) => {
    const percentage = (value / 10) * 100;
    if (value <= 2) return `linear-gradient(to right, #10b981 0%, #10b981 ${percentage}%, #374151 ${percentage}%, #374151 100%)`;
    if (value <= 4) return `linear-gradient(to right, #f59e0b 0%, #f59e0b ${percentage}%, #374151 ${percentage}%, #374151 100%)`;
    if (value <= 6) return `linear-gradient(to right, #f97316 0%, #f97316 ${percentage}%, #374151 ${percentage}%, #374151 100%)`;
    if (value <= 8) return `linear-gradient(to right, #ef4444 0%, #ef4444 ${percentage}%, #374151 ${percentage}%, #374151 100%)`;
    return `linear-gradient(to right, #dc2626 0%, #dc2626 ${percentage}%, #374151 ${percentage}%, #374151 100%)`;
  };

  const getEmoji = (value: number) => {
    if (value <= 2) return '😌';
    if (value <= 4) return '😐';
    if (value <= 6) return '😟';
    if (value <= 8) return '😰';
    return '😱';
  };

  const getStateLabel = (value: number) => {
    if (value <= 2) return 'Excited & Ready';
    if (value <= 4) return 'Slightly Hesitant';
    if (value <= 6) return 'Moderately Anxious';
    if (value <= 8) return 'Very Overwhelmed';
    return 'Extremely Anxious';
  };

  // Check if all rewards have been rated
  const allRewardsRated = () => {
    const rewards = [
      'Checking items off a list',
      'Beating a personal record',
      'External recognition/praise',
      'Learning something new',
      'Helping others',
      'Financial rewards',
      'Completing challenges'
    ];
    
    return rewards.every(reward => 
      onboardingData.rewardPreferences && 
      onboardingData.rewardPreferences[reward] && 
      onboardingData.rewardPreferences[reward] > 0
    );
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 1:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Your Brain on Procrastination</h2>
              <p className="text-slate-300 text-lg">Take this 30-second neural assessment</p>
            </div>

            <div className="space-y-8">
              <p className="text-xl text-slate-200">
                Think of your biggest postponed project right now.
              </p>
              <p className="text-lg text-cyan-400 font-semibold">
                Rate how you feel when you think about starting it:
              </p>

              <div className="space-y-8">
                {/* Enhanced Slider */}
                <div className="relative px-8">
                  <div className="relative">
                    <input
                      ref={sliderRef}
                      type="range"
                      min="1"
                      max="10"
                      value={sliderValue}
                      onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                      onMouseUp={handleSliderRelease}
                      onTouchEnd={handleSliderRelease}
                      className="slider-enhanced w-full h-6 rounded-full cursor-pointer appearance-none"
                      style={{
                        background: getSliderBackground(sliderValue)
                      }}
                    />
                    
                    {/* Slider Track Glow Effect */}
                    <div 
                      className={`absolute top-0 left-0 h-6 rounded-full blur-sm opacity-50 pointer-events-none transition-all duration-300`}
                      style={{
                        width: `${(sliderValue / 10) * 100}%`,
                        background: `linear-gradient(to right, ${
                          sliderValue <= 2 ? '#10b981' :
                          sliderValue <= 4 ? '#f59e0b' :
                          sliderValue <= 6 ? '#f97316' :
                          sliderValue <= 8 ? '#ef4444' : '#dc2626'
                        }, transparent)`
                      }}
                    />
                  </div>
                  
                  {/* Slider Labels */}
                  <div className="flex justify-between mt-6 px-2">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-2">😌</span>
                      <span className="text-green-400 font-semibold text-sm text-center">Excited & Ready</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-2">😰</span>
                      <span className="text-red-400 font-semibold text-sm text-center">Anxious & Overwhelmed</span>
                    </div>
                  </div>
                </div>

                {/* Current Value Display with Enhanced Animation */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-4 px-8 py-6 bg-gradient-to-r ${getSliderColor(sliderValue)} rounded-3xl shadow-2xl transform transition-all duration-500 ${isDragging ? 'scale-110' : 'scale-100'}`}>
                    <div className="text-4xl animate-pulse">
                      {getEmoji(sliderValue)}
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-xl">
                        {getStateLabel(sliderValue)}
                      </div>
                      <div className="text-white/80 text-sm font-mono">
                        Neural State: {sliderValue}/10
                      </div>
                    </div>
                    <Brain className="w-6 h-6 text-white animate-pulse" />
                  </div>
                </div>

                {/* Visual Feedback */}
                {isDragging && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                      <span className="text-cyan-400 text-sm font-mono">NEURAL.SCAN.ACTIVE</span>
                    </div>
                  </div>
                )}

                {/* Auto-advance indicator */}
                {sliderValue !== 5 && !isDragging && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 text-sm">Release to continue...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Pattern Recognition Test</h2>
              <p className="text-slate-300 text-lg">Let's identify your procrastination frequency</p>
            </div>

            <div className="space-y-6">
              <p className="text-xl text-slate-200">
                How many times have you said "I'll start tomorrow" about this project?
              </p>

              <div className="space-y-4">
                {[
                  { value: 'never', label: 'Never, I start everything immediately', feedback: 'Impressive! Let\'s see if we can optimize your already strong system.' },
                  { value: '1-3', label: '1-3 times (I\'m pretty disciplined)', feedback: 'Good discipline! We can help you reach 100% consistency.' },
                  { value: '4-10', label: '4-10 times (I procrastinate sometimes)', feedback: 'Normal pattern. We can eliminate this completely.' },
                  { value: '11-30', label: '11-30 times (I\'m a chronic procrastinator)', feedback: 'You\'re aware of the pattern. That\'s the first step to change.' },
                  { value: 'lost-count', label: 'I\'ve lost count (Help me, please)', feedback: 'You\'re not broken. Your brain is doing exactly what it evolved to do. Let\'s fix this.' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleProcrastinationSelect(option.value)}
                    className="w-full p-4 text-left bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600 hover:border-cyan-400/50 transition-all duration-300 text-slate-300 hover:text-white group"
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      <div className="w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">The Dopamine Trigger Test</h2>
              <p className="text-slate-300 text-lg">Let's prove something about your brain RIGHT NOW</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 border border-cyan-400/30">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">TASK: Write down 3 things you accomplished yesterday</h3>
                    <p className="text-cyan-400 text-sm">(Anything counts - making coffee, sending an email, breathing)</p>
                  </div>
                </div>

                {/* Enhanced Timer Display */}
                <div className="mb-8">
                  <div className="relative inline-flex items-center justify-center w-40 h-40">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-slate-800 to-blue-900 rounded-full p-8 border-2 border-cyan-400/50">
                      <div className="text-4xl font-bold text-cyan-400 font-mono">
                        {formatTime(timer)}
                      </div>
                    </div>
                  </div>
                  {timerActive && (
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                        <span className="text-cyan-400 text-sm font-mono">DOPAMINE.TRACKING.ACTIVE</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  {accomplishmentInputs.map((input, index) => (
                    <div key={index} className="relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => handleAccomplishmentChange(index, e.target.value)}
                        placeholder={`Accomplishment ${index + 1}...`}
                        className="w-full p-4 bg-slate-800/50 border-2 border-cyan-400/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-500 text-white placeholder:text-slate-400"
                      />
                      {input.trim() && (
                        <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                      )}
                    </div>
                  ))}
                </div>

                {accomplishmentInputs.every(input => input.trim()) && (
                  <button
                    onClick={completeAccomplishmentTask}
                    className="mt-8 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-400 hover:to-emerald-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1"
                  >
                    COMPLETE TASK
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">🎉 DOPAMINE ACHIEVED!</h2>
              
              <div className="bg-green-500/10 rounded-2xl p-6 border border-green-400/30 space-y-4">
                <p className="text-lg text-slate-200">
                  Notice that tiny satisfaction you felt clicking submit?<br/>
                  <span className="text-green-400 font-semibold">That's your brain's reward system working.</span>
                </p>
                
                <p className="text-slate-300">
                  Your brain just released actual dopamine from completing a simple task.
                </p>
                
                <p className="text-slate-300">
                  The problem isn't your motivation - it's that your complex projects 
                  don't trigger this reward system until the very end.
                </p>
                
                <p className="text-xl text-cyan-400 font-semibold">
                  What if every step felt like this?
                </p>
              </div>

              <button
                onClick={() => setCurrentSlide(5)}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1"
              >
                Continue to Assessment
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Your Biggest Procrastination Trigger</h2>
              <p className="text-slate-300 text-lg">Let's identify what stops you from starting</p>
            </div>

            <div className="space-y-4">
              {[
                'Projects that seem too complex',
                'Fear of not doing it perfectly',
                'Unclear where to start',
                'Boring or repetitive tasks',
                'Fear of failure/judgment'
              ].map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => handleTriggerSelect(trigger)}
                  className="w-full p-4 text-left bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600 hover:border-cyan-400/50 transition-all duration-300 text-slate-300 hover:text-white group"
                >
                  <div className="flex items-center justify-between">
                    <span>{trigger}</span>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Your Avoidance Pattern</h2>
              <p className="text-slate-300 text-lg">When you avoid starting a project, you typically:</p>
            </div>

            <div className="space-y-4">
              {[
                'Research and plan obsessively',
                'Do smaller, easier tasks instead',
                'Consume content (videos, tutorials, articles)',
                'Get distracted by social media',
                'Take a nap or procrastinate physically'
              ].map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => handleAvoidanceSelect(pattern)}
                  className="w-full p-4 text-left bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600 hover:border-cyan-400/50 transition-all duration-300 text-slate-300 hover:text-white group"
                >
                  <div className="flex items-center justify-between">
                    <span>{pattern}</span>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Your Optimal Work Environment</h2>
              <p className="text-slate-300 text-lg">You work best in:</p>
            </div>

            <div className="space-y-4">
              {[
                'Complete silence and isolation',
                'Background music or white noise',
                'Coffee shop or busy environment',
                'Short bursts with frequent breaks',
                'Long, uninterrupted focus sessions'
              ].map((environment) => (
                <button
                  key={environment}
                  onClick={() => handleEnvironmentSelect(environment)}
                  className="w-full p-4 text-left bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600 hover:border-cyan-400/50 transition-all duration-300 text-slate-300 hover:text-white group"
                >
                  <div className="flex items-center justify-between">
                    <span>{environment}</span>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Your Motivation Style</h2>
              <p className="text-slate-300 text-lg">You work best when:</p>
            </div>

            <div className="space-y-4">
              {[
                'There\'s a tight deadline approaching',
                'You have a clear, step-by-step plan',
                'Someone else is counting on you',
                'You can see immediate results',
                'You\'re competing with others'
              ].map((motivation) => (
                <button
                  key={motivation}
                  onClick={() => handleMotivationSelect(motivation)}
                  className="w-full p-4 text-left bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600 hover:border-cyan-400/50 transition-all duration-300 text-slate-300 hover:text-white group"
                >
                  <div className="flex items-center justify-between">
                    <span>{motivation}</span>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 9:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Reward System Mapping</h2>
              <p className="text-slate-300 text-lg">Rate how much these motivate you (1-5 scale):</p>
            </div>

            <div className="space-y-6">
              {[
                'Checking items off a list',
                'Beating a personal record',
                'External recognition/praise',
                'Learning something new',
                'Helping others',
                'Financial rewards',
                'Completing challenges'
              ].map((reward) => (
                <div key={reward} className="bg-slate-800/50 rounded-xl p-4 border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-semibold">{reward}</span>
                    <span className="text-cyan-400 font-bold">
                      {onboardingData.rewardPreferences?.[reward] || 0}/5
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRewardRating(reward, rating)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                          (onboardingData.rewardPreferences?.[reward] || 0) >= rating
                            ? 'bg-cyan-400 border-cyan-400'
                            : 'border-slate-600 hover:border-cyan-400'
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={completeRewardRating}
                disabled={!allRewardsRated()}
                className={`px-8 py-4 rounded-2xl font-bold shadow-2xl transform transition-all duration-500 ${
                  allRewardsRated()
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:-translate-y-1'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                }`}
              >
                {allRewardsRated() ? 'Continue' : 'Please rate all rewards to continue'}
              </button>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Your Ideal Session Length</h2>
              <p className="text-slate-300 text-lg">Your optimal productivity session length:</p>
            </div>

            <div className="space-y-4">
              {[
                { value: '15-25 minutes', label: '15-25 minutes (quick bursts)' },
                { value: '30-45 minutes', label: '30-45 minutes (moderate focus)' },
                { value: '1-2 hours', label: '1-2 hours (deep work)' },
                { value: '3+ hours', label: '3+ hours (marathon sessions)' },
                { value: 'varies', label: 'It varies by project' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSessionLengthSelect(option.value)}
                  className="w-full p-4 text-left bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600 hover:border-cyan-400/50 transition-all duration-300 text-slate-300 hover:text-white group"
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    <div className="w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      // Add more slides for remaining questions...
      default:
        return (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8">
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-400 to-pink-500 rounded-full p-4">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">Neural Profile Complete!</h2>
              <p className="text-slate-300 text-lg">
                Ready to generate your personalized productivity protocol?
              </p>

              <button
                onClick={completeOnboarding}
                disabled={isLoading}
                className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-3xl hover:from-purple-400 hover:to-pink-500 transition-all duration-500 font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Neural Profile...</span>
                  </div>
                ) : (
                  'Complete Onboarding'
                )}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-hidden">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
        <div className="relative bg-gradient-to-br from-slate-800/90 to-blue-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-cyan-400/30 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyan-400/20 sticky top-0 bg-gradient-to-br from-slate-800/95 to-blue-900/60 backdrop-blur-xl z-10">
            <div className="flex items-center gap-4">
              {currentSlide > 1 && (
                <button
                  onClick={goBack}
                  className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">Neural Assessment Protocol</h1>
                <p className="text-xs text-cyan-400 font-mono">
                  STAGE_{currentSlide.toString().padStart(2, '0')} // COGNITIVE.MAPPING.ACTIVE
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyan-400 font-mono">PROGRESS</span>
                <div className="flex gap-1">
                  {[...Array(14)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        i < currentSlide
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {currentSlide}/14
                </span>
              </div>

              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 min-h-[500px] flex items-center justify-center">
            {renderSlide()}
          </div>
        </div>
      </div>
    </div>
  );
}