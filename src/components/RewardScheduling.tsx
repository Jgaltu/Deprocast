import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Gift, 
  Star, 
  Crown, 
  Zap, 
  Clock, 
  Calendar,
  Shuffle,
  Target,
  Brain,
  CheckCircle,
  Plus,
  Minus,
  Edit3,
  Save,
  X,
  Sparkles,
  Timer,
  Award,
  Activity,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { User } from '../types';

interface RewardSchedulingProps {
  user: User;
  onComplete: () => void;
}

interface RewardItem {
  id: string;
  title: string;
  description: string;
  category: 'micro' | 'mini' | 'major';
  duration: number; // in minutes
  personalizedFor: string;
  isCustom: boolean;
}

interface ScheduledReward {
  id: string;
  rewardId: string;
  triggerType: 'task_completion' | 'time_based' | 'milestone';
  triggerValue: number; // tasks completed or time elapsed
  scheduledTime?: string;
  isActive: boolean;
  claimed: boolean;
}

interface PersonalityProfile {
  enjoyableActivities: string[];
  dailySchedule: string;
  stressLevel: number;
  moodBoosters: string[];
  availableTimeBlocks: string[];
}

export default function RewardScheduling({ user, onComplete }: RewardSchedulingProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile>({
    enjoyableActivities: [],
    dailySchedule: '',
    stressLevel: 5,
    moodBoosters: [],
    availableTimeBlocks: []
  });
  const [customRewards, setCustomRewards] = useState<RewardItem[]>([]);
  const [rewardSchedule, setRewardSchedule] = useState<ScheduledReward[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingReward, setEditingReward] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState('');
  const [newMoodBooster, setNewMoodBooster] = useState('');
  const [newTimeBlock, setNewTimeBlock] = useState('');

  // Predefined reward templates
  const rewardTemplates: RewardItem[] = [
    // Micro Rewards (10 minutes)
    { id: 'micro-1', title: 'Favorite Song', description: 'Listen to your favorite energizing song', category: 'micro', duration: 10, personalizedFor: 'music', isCustom: false },
    { id: 'micro-2', title: 'Quick Walk', description: '5-minute walk outside for fresh air', category: 'micro', duration: 10, personalizedFor: 'movement', isCustom: false },
    { id: 'micro-3', title: 'Premium Coffee', description: 'Make or buy your favorite premium coffee', category: 'micro', duration: 10, personalizedFor: 'treats', isCustom: false },
    { id: 'micro-4', title: 'Funny Video', description: 'Watch a specific funny YouTube video', category: 'micro', duration: 10, personalizedFor: 'entertainment', isCustom: false },
    { id: 'micro-5', title: 'Stretch Break', description: 'Quick stretching or yoga routine', category: 'micro', duration: 10, personalizedFor: 'wellness', isCustom: false },
    { id: 'micro-6', title: 'Social Check-in', description: 'Quick text or call to a friend', category: 'micro', duration: 10, personalizedFor: 'social', isCustom: false },
    { id: 'micro-7', title: 'Mindful Breathing', description: '5-minute meditation or breathing exercise', category: 'micro', duration: 10, personalizedFor: 'mindfulness', isCustom: false },
    { id: 'micro-8', title: 'Healthy Snack', description: 'Enjoy a specific healthy snack you love', category: 'micro', duration: 10, personalizedFor: 'nutrition', isCustom: false },

    // Mini Rewards (30 minutes)
    { id: 'mini-1', title: 'TV Episode', description: 'Watch one episode of your favorite show', category: 'mini', duration: 30, personalizedFor: 'entertainment', isCustom: false },
    { id: 'mini-2', title: 'Video Game Session', description: 'Play your favorite game for 30 minutes', category: 'mini', duration: 30, personalizedFor: 'gaming', isCustom: false },
    { id: 'mini-3', title: 'Friend Call', description: 'Have a proper catch-up call with a friend', category: 'mini', duration: 30, personalizedFor: 'social', isCustom: false },
    { id: 'mini-4', title: 'Favorite Meal', description: 'Order or cook your favorite meal', category: 'mini', duration: 30, personalizedFor: 'food', isCustom: false },
    { id: 'mini-5', title: 'Creative Time', description: 'Work on a personal creative project', category: 'mini', duration: 30, personalizedFor: 'creativity', isCustom: false },
    { id: 'mini-6', title: 'Nature Walk', description: 'Take a longer walk in nature or park', category: 'mini', duration: 30, personalizedFor: 'nature', isCustom: false },
    { id: 'mini-7', title: 'Reading Time', description: 'Read a book or articles you enjoy', category: 'mini', duration: 30, personalizedFor: 'learning', isCustom: false },
    { id: 'mini-8', title: 'Online Shopping', description: 'Browse and maybe buy something small', category: 'mini', duration: 30, personalizedFor: 'shopping', isCustom: false },

    // Major Rewards (2 hours)
    { id: 'major-1', title: 'Movie Night', description: 'Watch a full movie you\'ve been wanting to see', category: 'major', duration: 120, personalizedFor: 'entertainment', isCustom: false },
    { id: 'major-2', title: 'Dinner Out', description: 'Go to your favorite restaurant', category: 'major', duration: 120, personalizedFor: 'dining', isCustom: false },
    { id: 'major-3', title: 'Hobby Session', description: 'Dedicated time for your favorite hobby', category: 'major', duration: 120, personalizedFor: 'hobbies', isCustom: false },
    { id: 'major-4', title: 'Social Activity', description: 'Meet friends for an activity or hangout', category: 'major', duration: 120, personalizedFor: 'social', isCustom: false },
    { id: 'major-5', title: 'Spa Time', description: 'Self-care session: bath, skincare, relaxation', category: 'major', duration: 120, personalizedFor: 'wellness', isCustom: false },
    { id: 'major-6', title: 'Adventure Time', description: 'Explore a new place or try new activity', category: 'major', duration: 120, personalizedFor: 'adventure', isCustom: false }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'micro': return Gift;
      case 'mini': return Star;
      case 'major': return Crown;
      default: return Trophy;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'micro': return 'from-green-400 to-emerald-500';
      case 'mini': return 'from-blue-400 to-indigo-500';
      case 'major': return 'from-purple-400 to-pink-500';
      default: return 'from-yellow-400 to-orange-500';
    }
  };

  const addCustomActivity = (type: 'activity' | 'booster' | 'timeblock') => {
    if (type === 'activity' && newActivity.trim()) {
      setPersonalityProfile(prev => ({
        ...prev,
        enjoyableActivities: [...prev.enjoyableActivities, newActivity.trim()]
      }));
      setNewActivity('');
    } else if (type === 'booster' && newMoodBooster.trim()) {
      setPersonalityProfile(prev => ({
        ...prev,
        moodBoosters: [...prev.moodBoosters, newMoodBooster.trim()]
      }));
      setNewMoodBooster('');
    } else if (type === 'timeblock' && newTimeBlock.trim()) {
      setPersonalityProfile(prev => ({
        ...prev,
        availableTimeBlocks: [...prev.availableTimeBlocks, newTimeBlock.trim()]
      }));
      setNewTimeBlock('');
    }
  };

  const removeItem = (type: 'activity' | 'booster' | 'timeblock', index: number) => {
    if (type === 'activity') {
      setPersonalityProfile(prev => ({
        ...prev,
        enjoyableActivities: prev.enjoyableActivities.filter((_, i) => i !== index)
      }));
    } else if (type === 'booster') {
      setPersonalityProfile(prev => ({
        ...prev,
        moodBoosters: prev.moodBoosters.filter((_, i) => i !== index)
      }));
    } else if (type === 'timeblock') {
      setPersonalityProfile(prev => ({
        ...prev,
        availableTimeBlocks: prev.availableTimeBlocks.filter((_, i) => i !== index)
      }));
    }
  };

  const generatePersonalizedRewards = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const personalizedRewards: RewardItem[] = [];
      
      // Generate micro rewards from user activities
      personalityProfile.enjoyableActivities.slice(0, 4).forEach((activity, index) => {
        personalizedRewards.push({
          id: `custom-micro-${index}`,
          title: activity,
          description: `Enjoy ${activity.toLowerCase()} for 10 minutes`,
          category: 'micro',
          duration: 10,
          personalizedFor: 'custom',
          isCustom: true
        });
      });

      // Generate mini rewards from mood boosters
      personalityProfile.moodBoosters.slice(0, 4).forEach((booster, index) => {
        personalizedRewards.push({
          id: `custom-mini-${index}`,
          title: booster,
          description: `Dedicated time for ${booster.toLowerCase()}`,
          category: 'mini',
          duration: 30,
          personalizedFor: 'custom',
          isCustom: true
        });
      });

      // Generate major rewards (2 custom ones)
      if (personalityProfile.enjoyableActivities.length > 0) {
        personalizedRewards.push({
          id: 'custom-major-1',
          title: `Extended ${personalityProfile.enjoyableActivities[0]}`,
          description: `2-hour dedicated session for ${personalityProfile.enjoyableActivities[0].toLowerCase()}`,
          category: 'major',
          duration: 120,
          personalizedFor: 'custom',
          isCustom: true
        });
      }

      personalizedRewards.push({
        id: 'custom-major-2',
        title: 'Personal Choice Reward',
        description: 'Choose any 2-hour activity that brings you joy',
        category: 'major',
        duration: 120,
        personalizedFor: 'custom',
        isCustom: true
      });

      setCustomRewards(personalizedRewards);
      setIsGenerating(false);
      setCurrentStage(2);
    }, 3000);
  };

  const generateVariableSchedule = () => {
    const allRewards = [...rewardTemplates, ...customRewards];
    const microRewards = allRewards.filter(r => r.category === 'micro');
    const miniRewards = allRewards.filter(r => r.category === 'mini');
    const majorRewards = allRewards.filter(r => r.category === 'major');

    const schedule: ScheduledReward[] = [];

    // Generate 8 micro-rewards with variable ratio triggers
    const microTriggers = [1, 2, 3, 4, 6, 7, 9, 11]; // Variable completion counts
    microTriggers.forEach((trigger, index) => {
      const reward = microRewards[Math.floor(Math.random() * microRewards.length)];
      schedule.push({
        id: `micro-schedule-${index}`,
        rewardId: reward.id,
        triggerType: 'task_completion',
        triggerValue: trigger,
        isActive: true,
        claimed: false
      });
    });

    // Generate 4 mini-rewards with mixed triggers
    const miniTriggers = [
      { type: 'task_completion' as const, value: 5 },
      { type: 'task_completion' as const, value: 8 },
      { type: 'task_completion' as const, value: 10 },
      { type: 'task_completion' as const, value: 12 }
    ];
    miniTriggers.forEach((trigger, index) => {
      const reward = miniRewards[Math.floor(Math.random() * miniRewards.length)];
      schedule.push({
        id: `mini-schedule-${index}`,
        rewardId: reward.id,
        triggerType: trigger.type,
        triggerValue: trigger.value,
        isActive: true,
        claimed: false
      });
    });

    // Generate 2 major rewards for daily milestones
    [6, 12].forEach((trigger, index) => {
      const reward = majorRewards[Math.floor(Math.random() * majorRewards.length)];
      schedule.push({
        id: `major-schedule-${index}`,
        rewardId: reward.id,
        triggerType: 'task_completion',
        triggerValue: trigger,
        isActive: true,
        claimed: false
      });
    });

    setRewardSchedule(schedule);
    setCurrentStage(3);
  };

  const getRewardById = (id: string) => {
    return [...rewardTemplates, ...customRewards].find(r => r.id === id);
  };

  const regenerateSchedule = () => {
    generateVariableSchedule();
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Stage Header */}
            <div className="text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative p-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white">Variable Ratio Reward System Design</h2>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                Create unpredictable reward schedules that maintain long-term brain engagement using 
                the same neural mechanisms that make gambling addictive—but for productive behavior.
              </p>
            </div>

            {/* The Slot Machine Effect Explanation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                    <Shuffle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">The Slot Machine Effect</h3>
                    <p className="text-yellow-400 font-mono text-sm">VARIABLE.RATIO.REINFORCEMENT</p>
                  </div>
                </div>
                
                <div className="bg-yellow-500/10 rounded-2xl border border-yellow-400/20 p-6 mb-6">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    Variable ratio reinforcement creates the <span className="text-yellow-400 font-semibold">strongest behavioral patterns</span>. 
                    We're hijacking the same neural mechanisms that make gambling addictive—but for productive behavior.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-white mb-2">Micro-Rewards</h4>
                    <p className="text-slate-400 text-sm">Tasks 1-4 completions</p>
                    <p className="text-green-400 text-sm font-semibold">10-minute activities</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-white mb-2">Mini-Rewards</h4>
                    <p className="text-slate-400 text-sm">Every 2 tasks completed</p>
                    <p className="text-blue-400 text-sm font-semibold">30-minute activities</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-white mb-2">Major-Rewards</h4>
                    <p className="text-slate-400 text-sm">Daily milestone</p>
                    <p className="text-purple-400 text-sm font-semibold">2-hour experiences</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personality Profile Form */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Personalized Reward Design</h3>
                    <p className="text-cyan-400 font-mono text-sm">BEHAVIORAL.PSYCHOLOGY.OPTIMIZATION</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Enjoyable Activities */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      Things You Genuinely Enjoy (10+ activities)
                    </label>
                    <div className="space-y-3">
                      {personalityProfile.enjoyableActivities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600">
                          <span className="flex-1 text-slate-300">{activity}</span>
                          <button
                            onClick={() => removeItem('activity', index)}
                            className="p-1 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newActivity}
                          onChange={(e) => setNewActivity(e.target.value)}
                          placeholder="e.g., Playing guitar, reading sci-fi, cooking..."
                          className="flex-1 p-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder:text-slate-400"
                          onKeyPress={(e) => e.key === 'Enter' && addCustomActivity('activity')}
                        />
                        <button
                          onClick={() => addCustomActivity('activity')}
                          className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Daily Schedule */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      Your Typical Daily Schedule
                    </label>
                    <textarea
                      value={personalityProfile.dailySchedule}
                      onChange={(e) => setPersonalityProfile(prev => ({ ...prev, dailySchedule: e.target.value }))}
                      placeholder="Describe your routine: wake up time, work hours, meal times, etc."
                      className="w-full p-4 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder:text-slate-400 h-24"
                    />
                  </div>

                  {/* Stress Level */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      Current Stress Level (1-10)
                    </label>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={personalityProfile.stressLevel}
                        onChange={(e) => setPersonalityProfile(prev => ({ ...prev, stressLevel: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="text-center">
                        <span className="text-2xl font-bold text-cyan-400">{personalityProfile.stressLevel}/10</span>
                        <p className="text-slate-400 text-sm mt-1">
                          {personalityProfile.stressLevel <= 3 ? 'Low stress - ready for challenges' :
                           personalityProfile.stressLevel <= 6 ? 'Moderate stress - balanced approach' :
                           'High stress - need gentle rewards'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mood Boosters */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      Activities That Instantly Boost Your Mood
                    </label>
                    <div className="space-y-3">
                      {personalityProfile.moodBoosters.map((booster, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600">
                          <span className="flex-1 text-slate-300">{booster}</span>
                          <button
                            onClick={() => removeItem('booster', index)}
                            className="p-1 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newMoodBooster}
                          onChange={(e) => setNewMoodBooster(e.target.value)}
                          placeholder="e.g., Listening to upbeat music, calling a friend..."
                          className="flex-1 p-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder:text-slate-400"
                          onKeyPress={(e) => e.key === 'Enter' && addCustomActivity('booster')}
                        />
                        <button
                          onClick={() => addCustomActivity('booster')}
                          className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Available Time Blocks */}
                  <div>
                    <label className="block text-lg font-bold text-white mb-4">
                      Time Blocks Available for Rewards
                    </label>
                    <div className="space-y-3">
                      {personalityProfile.availableTimeBlocks.map((block, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600">
                          <span className="flex-1 text-slate-300">{block}</span>
                          <button
                            onClick={() => removeItem('timeblock', index)}
                            className="p-1 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newTimeBlock}
                          onChange={(e) => setNewTimeBlock(e.target.value)}
                          placeholder="e.g., 12:00-13:00 lunch break, 18:00-20:00 evening..."
                          className="flex-1 p-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder:text-slate-400"
                          onKeyPress={(e) => e.key === 'Enter' && addCustomActivity('timeblock')}
                        />
                        <button
                          onClick={() => addCustomActivity('timeblock')}
                          className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={generatePersonalizedRewards}
                    disabled={personalityProfile.enjoyableActivities.length < 3 || personalityProfile.moodBoosters.length < 2}
                    className={`px-8 py-4 rounded-2xl font-bold transition-all duration-500 ${
                      personalityProfile.enjoyableActivities.length >= 3 && personalityProfile.moodBoosters.length >= 2
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-400 hover:to-pink-500 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>GENERATING PERSONALIZED REWARDS...</span>
                      </div>
                    ) : (
                      'GENERATE PERSONALIZED REWARD SYSTEM'
                    )}
                  </button>
                  
                  {(personalityProfile.enjoyableActivities.length < 3 || personalityProfile.moodBoosters.length < 2) && (
                    <p className="text-red-400 text-sm mt-3">
                      Please add at least 3 enjoyable activities and 2 mood boosters to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Generated Rewards Display */}
            <div className="text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white">Personalized Rewards Generated!</h2>
              <p className="text-slate-300 text-lg">
                Your custom reward system has been created based on your preferences
              </p>
            </div>

            {/* Custom Rewards Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['micro', 'mini', 'major'].map((category) => {
                const categoryRewards = customRewards.filter(r => r.category === category);
                const IconComponent = getCategoryIcon(category);
                
                return (
                  <div key={category} className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(category)} opacity-10 rounded-2xl blur-xl`}></div>
                    <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-600">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`p-3 bg-gradient-to-r ${getCategoryColor(category)} rounded-xl`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white capitalize">{category} Rewards</h3>
                          <p className="text-slate-400 text-sm">
                            {category === 'micro' ? '10 minutes' : category === 'mini' ? '30 minutes' : '2 hours'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {categoryRewards.map((reward) => (
                          <div key={reward.id} className="p-3 bg-slate-700/30 rounded-xl border border-slate-600">
                            <h4 className="font-semibold text-white text-sm">{reward.title}</h4>
                            <p className="text-slate-400 text-xs mt-1">{reward.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <button
                onClick={generateVariableSchedule}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1"
              >
                CREATE VARIABLE SCHEDULE
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            {/* Schedule Header */}
            <div className="text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                  <Calendar className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white">Variable Ratio Schedule Generated</h2>
              <p className="text-slate-300 text-lg">
                Unpredictable reward timing for maximum dopamine impact
              </p>
            </div>

            {/* Schedule Display */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-400/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl">
                      <Shuffle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">24-Hour Reward Schedule</h3>
                      <p className="text-indigo-400 font-mono text-sm">VARIABLE.RATIO.OPTIMIZATION</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={regenerateSchedule}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all duration-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Regenerate</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['micro', 'mini', 'major'].map((category) => {
                    const categorySchedule = rewardSchedule.filter(s => {
                      const reward = getRewardById(s.rewardId);
                      return reward?.category === category;
                    });
                    
                    return (
                      <div key={category} className="space-y-4">
                        <h4 className="font-bold text-white capitalize text-center">
                          {category} Rewards ({categorySchedule.length})
                        </h4>
                        
                        {categorySchedule.map((scheduled, index) => {
                          const reward = getRewardById(scheduled.rewardId);
                          if (!reward) return null;
                          
                          return (
                            <div key={scheduled.id} className={`p-4 rounded-xl border ${
                              scheduled.claimed 
                                ? 'bg-green-500/10 border-green-400/30' 
                                : 'bg-slate-700/30 border-slate-600'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-white text-sm">{reward.title}</span>
                                {scheduled.claimed && <CheckCircle className="w-4 h-4 text-green-400" />}
                              </div>
                              
                              <p className="text-slate-400 text-xs mb-2">{reward.description}</p>
                              
                              <div className="flex items-center gap-2 text-xs">
                                <Target className="w-3 h-3 text-cyan-400" />
                                <span className="text-cyan-400">
                                  {scheduled.triggerType === 'task_completion' 
                                    ? `After ${scheduled.triggerValue} tasks`
                                    : `At ${scheduled.scheduledTime}`
                                  }
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* Schedule Summary */}
                <div className="mt-8 bg-indigo-500/10 rounded-2xl border border-indigo-400/20 p-6">
                  <h4 className="font-bold text-white mb-4">Schedule Psychology</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-indigo-400 mb-2">Unpredictability Factors:</h5>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Variable task completion triggers</li>
                        <li>• Mixed reward categories</li>
                        <li>• Randomized reward selection</li>
                        <li>• Surprise bonus opportunities</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-indigo-400 mb-2">Dopamine Optimization:</h5>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Anticipation builds motivation</li>
                        <li>• Surprise rewards boost satisfaction</li>
                        <li>• Variable timing prevents habituation</li>
                        <li>• Personalized rewards maximize impact</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Button */}
            <div className="text-center">
              <button
                onClick={onComplete}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative px-12 py-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl hover:from-green-400 hover:to-emerald-500 transition-all duration-500 font-bold text-xl shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-2 group-hover:scale-105">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-8 h-8 animate-pulse" />
                    <span>Complete Phase 2</span>
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="text-sm font-mono mt-2 opacity-90">
                    REWARD.SYSTEM.ACTIVATED
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Phase Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">PHASE 2: Strategic Reward Scheduling</h1>
                <p className="text-purple-400 font-mono text-sm">HOURS 13-24 // DOPAMINE.OPTIMIZATION.PROTOCOL</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                Stage {currentStage}/3
              </div>
              <div className="text-sm text-slate-400">Variable Ratio Design</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(currentStage / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Content */}
      {renderStage()}
    </div>
  );
}