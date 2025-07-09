import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Gift, 
  Star, 
  Zap, 
  Crown, 
  Award,
  Sparkles,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { User, Reward } from '../types';

interface RewardCenterProps {
  user: User;
}

export default function RewardCenter({ user }: RewardCenterProps) {
  const [userPoints, setUserPoints] = useState(0);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<Reward[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Real data would be fetched from database
    // For now, showing empty state since no mock data
    setUserPoints(0);
    setAvailableRewards([]);
    setClaimedRewards([]);
  }, [user.id]);

  const claimReward = (reward: Reward) => {
    if (userPoints >= reward.points_required) {
      setUserPoints(prev => prev - reward.points_required);
      setSelectedReward(reward);
      setShowCelebration(true);
      
      // Move reward to claimed
      setAvailableRewards(prev => prev.filter(r => r.id !== reward.id));
      setClaimedRewards(prev => [...prev, { ...reward, is_claimed: true, claimed_at: new Date().toISOString() }]);
      
      // Hide celebration after 3 seconds
      setTimeout(() => {
        setShowCelebration(false);
        setSelectedReward(null);
      }, 3000);
    }
  };

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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'micro': return 'MICRO REWARD';
      case 'mini': return 'MINI REWARD';
      case 'major': return 'MAJOR REWARD';
      default: return 'REWARD';
    }
  };

  return (
    <div className="space-y-8">
      {/* Celebration Modal */}
      {showCelebration && selectedReward && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-yellow-900/50 backdrop-blur-2xl rounded-3xl p-12 border border-yellow-400/30 text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50 animate-ping"></div>
                <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-6">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4">
                🎉 DOPAMINE BOOST ACTIVATED! 🎉
              </h2>
              <p className="text-xl text-yellow-400 mb-6 font-semibold">
                {selectedReward.title} Unlocked!
              </p>
              <p className="text-slate-300 mb-8">
                {selectedReward.description}
              </p>
              
              <div className="bg-yellow-500/10 rounded-2xl border border-yellow-400/30 p-6">
                <p className="text-yellow-400 font-semibold mb-2">
                  NEURAL REWARD SYSTEM ACTIVATED
                </p>
                <p className="text-slate-300 text-sm">
                  Your brain is releasing dopamine, reinforcing this positive behavior pattern. 
                  Enjoy your well-earned reward!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-white">Neural Reward Center</h2>
        <p className="text-slate-300 text-lg">
          Claim your dopamine-boosting rewards and reinforce positive neural pathways
        </p>
      </div>

      {/* Points Display */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h3 className="text-2xl font-bold text-white">Available Neural Points</h3>
          </div>
          <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            {userPoints.toLocaleString()}
          </div>
          <p className="text-slate-400 font-mono">DOPAMINE.CURRENCY.BALANCE</p>
          
          {userPoints === 0 && (
            <div className="mt-6 bg-blue-500/10 rounded-2xl border border-blue-400/30 p-6">
              <p className="text-blue-400 font-semibold mb-2">
                Start Earning Points
              </p>
              <p className="text-slate-300 text-sm">
                Complete tasks and protocols to earn neural points that can be redeemed for rewards
              </p>
            </div>
          )}
        </div>
      </div>

      {/* No Rewards Available State */}
      {availableRewards.length === 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-400 to-pink-500 rounded-full p-4">
                <Gift className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Rewards Coming Soon
            </h3>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Your personalized reward system will be activated once you begin completing 
              tasks and earning neural points through the protocol.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700/30 rounded-2xl p-6 border border-green-400/20">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="w-6 h-6 text-green-400" />
                  <span className="font-semibold text-green-400 font-mono">MICRO REWARDS</span>
                </div>
                <p className="text-slate-300 text-sm">
                  Quick dopamine hits for immediate motivation. Perfect for maintaining momentum.
                </p>
              </div>

              <div className="bg-slate-700/30 rounded-2xl p-6 border border-blue-400/20">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-blue-400" />
                  <span className="font-semibold text-blue-400 font-mono">MINI REWARDS</span>
                </div>
                <p className="text-slate-300 text-sm">
                  Medium-term incentives for completing challenging tasks or reaching goals.
                </p>
              </div>

              <div className="bg-slate-700/30 rounded-2xl p-6 border border-purple-400/20">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-6 h-6 text-purple-400" />
                  <span className="font-semibold text-purple-400 font-mono">MAJOR REWARDS</span>
                </div>
                <p className="text-slate-300 text-sm">
                  Significant rewards for major achievements and protocol completions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reward System Information */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-400/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">How the Reward System Works</h3>
              <p className="text-indigo-400 font-mono text-sm">DOPAMINE.OPTIMIZATION.PROTOCOL</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Earning Points</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Complete daily tasks: 10-50 points</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Finish protocol sessions: 25-100 points</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Maintain streaks: Bonus multipliers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Overcome procrastination: 50-200 points</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Reward Categories</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300">Micro (50-200 pts): Quick breaks, snacks</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">Mini (300-800 pts): Activities, treats</span>
                </div>
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-300">Major (1000+ pts): Experiences, purchases</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-slate-300">Custom: Personalized rewards</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-indigo-500/10 rounded-2xl border border-indigo-400/20 p-6">
            <p className="text-indigo-400 font-semibold mb-2">
              NEUROPLASTICITY ENHANCEMENT
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              This reward system is designed to strengthen neural pathways associated with task completion 
              and goal achievement. Each reward claim triggers dopamine release, reinforcing positive 
              behaviors and making future task initiation easier and more automatic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}