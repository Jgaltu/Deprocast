import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Play, 
  Pause, 
  AlertTriangle, 
  Trophy, 
  Target, 
  Clock, 
  Zap,
  TrendingUp,
  Calendar,
  Settings,
  Award,
  Activity,
  Rocket,
  Lock,
  ArrowRight
} from 'lucide-react';
import { User, OnboardingData } from '../types';
import ProtocolDashboard from './ProtocolDashboard';
import ProfileReview from './ProfileReview';
import EmergencyPanel from './EmergencyPanel';
import RewardCenter from './RewardCenter';
import OnboardingFlow from './OnboardingFlow';
import SetupProtocol from './SetupProtocol';
import { getUserProfile } from '../lib/supabase';

interface DashboardProps {
  user: User;
}

type DashboardView = 'overview' | 'protocol' | 'profile' | 'emergency' | 'rewards' | 'setup';

export default function Dashboard({ user }: DashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [hoveredLockedTab, setHoveredLockedTab] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    currentStreak: 0,
    totalPoints: 0,
    tasksCompleted: 0,
    protocolsActive: 0
  });

  // Check if user has completed onboarding and setup on component mount
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setIsLoadingProfile(true);
        const { data: profile, error } = await getUserProfile(user.id);
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error fetching user profile:', error);
        }
        
        if (profile && profile.onboarding_completed) {
          setHasCompletedOnboarding(true);
          setUserStats({
            currentStreak: profile.current_streak || 0,
            totalPoints: profile.total_points || 0,
            tasksCompleted: profile.tasks_completed || 0,
            protocolsActive: profile.protocols_completed || 0
          });
          
          // Check if they have completed the setup protocol
          // For now, we'll assume setup is complete if they have any protocols
          setHasCompletedSetup(profile.protocols_completed > 0);
        } else {
          setHasCompletedOnboarding(false);
          setHasCompletedSetup(false);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setHasCompletedOnboarding(false);
        setHasCompletedSetup(false);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    checkUserStatus();
  }, [user.id]);

  const navigationItems = [
    { id: 'overview', label: 'Neural Command', icon: Brain, color: 'from-cyan-400 to-blue-500', locked: false },
    { id: 'setup', label: 'Setup Protocol', icon: Settings, color: 'from-purple-400 to-pink-500', locked: !hasCompletedOnboarding },
    { id: 'protocol', label: 'Active Protocol', icon: Play, color: 'from-blue-400 to-indigo-500', locked: !hasCompletedSetup },
    { id: 'profile', label: 'Profile Review', icon: Target, color: 'from-indigo-400 to-purple-500', locked: !hasCompletedSetup },
    { id: 'emergency', label: 'Emergency Mode', icon: AlertTriangle, color: 'from-red-400 to-orange-500', locked: !hasCompletedSetup },
    { id: 'rewards', label: 'Reward Center', icon: Trophy, color: 'from-yellow-400 to-orange-500', locked: !hasCompletedSetup }
  ];

  const getLockedMessage = (tabId: string) => {
    const messages = {
      setup: 'SETUP.PROTOCOL.ACCESS.DENIED // ONBOARDING.SEQUENCE.REQUIRED',
      protocol: 'NEURAL.PROTOCOL.ACCESS.DENIED // SETUP.PROTOCOL.REQUIRED',
      profile: 'PROFILE.MATRIX.LOCKED // PROTOCOL.SETUP.INCOMPLETE',
      emergency: 'EMERGENCY.SYSTEMS.OFFLINE // SETUP.PROTOCOL.PENDING',
      rewards: 'DOPAMINE.VAULT.SEALED // PROTOCOL.INITIALIZATION.NEEDED'
    };
    return messages[tabId as keyof typeof messages] || 'ACCESS.RESTRICTED // COMPLETE.SETUP.PROTOCOL';
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    console.log('Onboarding completed:', data);
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
    
    // Update user stats based on completion
    setUserStats({
      currentStreak: 1,
      totalPoints: 100,
      tasksCompleted: 1,
      protocolsActive: 0
    });

    // Refresh the profile data to get the latest state
    try {
      const { data: profile } = await getUserProfile(user.id);
      if (profile) {
        setUserStats({
          currentStreak: profile.current_streak || 1,
          totalPoints: profile.total_points || 100,
          tasksCompleted: profile.tasks_completed || 1,
          protocolsActive: profile.protocols_completed || 0
        });
      }
    } catch (error) {
      console.error('Error refreshing profile after onboarding:', error);
    }

    // Automatically navigate to setup protocol
    setCurrentView('setup');
  };

  const handleSetupComplete = () => {
    setHasCompletedSetup(true);
    setCurrentView('protocol');
  };

  const handleTabClick = (itemId: string, isLocked: boolean) => {
    if (isLocked) {
      return; // Do nothing if locked
    }
    setCurrentView(itemId as DashboardView);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'setup':
        return <SetupProtocol user={user} onComplete={handleSetupComplete} />;
      case 'protocol':
        return <ProtocolDashboard user={user} />;
      case 'profile':
        return <ProfileReview user={user} />;
      case 'emergency':
        return <EmergencyPanel user={user} />;
      case 'rewards':
        return <RewardCenter user={user} />;
      default:
        return <OverviewDashboard 
          user={user} 
          stats={userStats} 
          onNavigate={setCurrentView}
          hasCompletedOnboarding={hasCompletedOnboarding}
          hasCompletedSetup={hasCompletedSetup}
          onStartOnboarding={() => setShowOnboarding(true)}
          isLoadingProfile={isLoadingProfile}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Navigation Header */}
      <header className="border-b border-cyan-400/20 bg-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-lg opacity-40"></div>
                <div className="relative p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Neural Dashboard</h1>
                <p className="text-xs text-cyan-400 font-mono">
                  {hasCompletedSetup ? 'COGNITIVE.OPTIMIZATION.ACTIVE' : 
                   hasCompletedOnboarding ? 'SETUP.PROTOCOL.REQUIRED' : 'INITIALIZATION.REQUIRED'}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-400">{userStats.currentStreak}</div>
                <div className="text-xs text-slate-400 font-mono">DAY STREAK</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">{userStats.totalPoints}</div>
                <div className="text-xs text-slate-400 font-mono">NEURAL POINTS</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-400">{userStats.tasksCompleted}</div>
                <div className="text-xs text-slate-400 font-mono">TASKS DONE</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-2 mt-6">
            {navigationItems.map((item) => {
              const isLocked = item.locked;
              const isActive = currentView === item.id;
              
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleTabClick(item.id, isLocked)}
                    onMouseEnter={() => isLocked && setHoveredLockedTab(item.id)}
                    onMouseLeave={() => setHoveredLockedTab(null)}
                    disabled={isLocked}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative ${
                      isActive && !isLocked
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : isLocked
                        ? 'text-slate-600 cursor-not-allowed opacity-50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="relative">
                      <item.icon className="w-4 h-4" />
                      {isLocked && (
                        <Lock className="w-3 h-3 absolute -top-1 -right-1 text-red-400" />
                      )}
                    </div>
                    <span className="font-semibold text-sm">{item.label}</span>
                    
                    {/* Locked indicator */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-red-500/10 rounded-xl border border-red-500/30 animate-pulse"></div>
                    )}
                  </button>
                  
                  {/* Hover tooltip for locked tabs */}
                  {isLocked && hoveredLockedTab === item.id && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-slate-800/90 to-red-900/50 backdrop-blur-2xl rounded-2xl border border-red-400/30 shadow-2xl p-4 min-w-[300px]">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-gradient-to-r from-red-400 to-orange-500 rounded-lg">
                              <Lock className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-red-400">ACCESS DENIED</div>
                              <div className="text-xs text-slate-400 font-mono">NEURAL.SECURITY.PROTOCOL</div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-300 font-mono leading-relaxed">
                            {getLockedMessage(item.id)}
                          </div>
                          <div className="mt-3 pt-3 border-t border-red-400/20">
                            <div className="text-xs text-red-400 font-semibold">
                              → {!hasCompletedOnboarding ? 'COMPLETE ONBOARDING' : 'COMPLETE SETUP PROTOCOL'} TO UNLOCK
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderCurrentView()}
      </main>

      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingFlow
          user={user}
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}

// Overview Dashboard Component
function OverviewDashboard({ 
  user, 
  stats, 
  onNavigate,
  hasCompletedOnboarding,
  hasCompletedSetup,
  onStartOnboarding,
  isLoadingProfile
}: { 
  user: User; 
  stats: any; 
  onNavigate: (view: DashboardView) => void;
  hasCompletedOnboarding: boolean;
  hasCompletedSetup: boolean;
  onStartOnboarding: () => void;
  isLoadingProfile: boolean;
}) {
  // Show loading state while checking onboarding status
  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-300">Loading neural profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">
          Welcome back, <span className="text-cyan-400">{user.email.split('@')[0]}</span>
        </h2>
        <p className="text-slate-300 text-lg">
          {hasCompletedSetup 
            ? "Your neural pathways are optimized and ready for peak performance"
            : hasCompletedOnboarding
            ? "Ready to set up your personalized productivity protocol?"
            : "Ready to begin your cognitive transformation journey?"
          }
        </p>
      </div>

      {/* Onboarding CTA */}
      {!hasCompletedOnboarding && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-400 to-pink-500 rounded-full p-4">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Rewire Your Brain?
            </h3>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Complete our neuroscience-based assessment to create your personalized 
              productivity protocol. Transform procrastination into unstoppable momentum.
            </p>
            
            <button
              onClick={onStartOnboarding}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-3xl hover:from-purple-400 hover:to-pink-500 transition-all duration-500 font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 group-hover:scale-105">
                <div className="flex items-center gap-4">
                  <Brain className="w-8 h-8 animate-pulse" />
                  <span>Initiate Onboarding Protocol</span>
                  <Zap className="w-8 h-8 animate-pulse" />
                </div>
                <div className="text-sm font-mono mt-2 opacity-90">
                  NEURAL.TRANSFORMATION.SEQUENCE
                </div>
              </div>
            </button>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>15-minute assessment</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300"></div>
                <span>Instant dopamine proof</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
                <span>Personalized program</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup Protocol CTA */}
      {hasCompletedOnboarding && !hasCompletedSetup && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30 text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-4">
                <Settings className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4">
              Set Up Your Protocol
            </h3>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Configure your personalized productivity system with commitment levels, 
              pricing options, and detailed preferences to create your automated program.
            </p>
            
            <button
              onClick={() => onNavigate('setup')}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-3xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-500 font-bold text-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-2 group-hover:scale-105">
                <div className="flex items-center gap-4">
                  <Settings className="w-8 h-8 animate-pulse" />
                  <span>Configure Protocol</span>
                  <ArrowRight className="w-8 h-8 animate-pulse" />
                </div>
                <div className="text-sm font-mono mt-2 opacity-90">
                  PERSONALIZED.SYSTEM.SETUP
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Locked Features Notice */}
      {hasCompletedOnboarding && !hasCompletedSetup && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-red-400/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-red-400 to-orange-500 rounded-xl">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Neural Systems Locked</h3>
                <p className="text-red-400 text-sm font-mono">SETUP.PROTOCOL.REQUIRED</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-700/30 rounded-xl p-4 border border-red-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-slate-300">Active Protocol</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">SETUP.CONFIGURATION.REQUIRED</p>
              </div>
              
              <div className="bg-slate-700/30 rounded-xl p-4 border border-red-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-slate-300">Profile Review</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">PROTOCOL.SETUP.PENDING</p>
              </div>
              
              <div className="bg-slate-700/30 rounded-xl p-4 border border-red-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-slate-300">Emergency Mode</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">SYSTEM.INITIALIZATION.NEEDED</p>
              </div>
              
              <div className="bg-slate-700/30 rounded-xl p-4 border border-red-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-slate-300">Reward Center</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">PROTOCOL.ACTIVATION.REQUIRED</p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-sm">
                Complete the setup protocol to unlock all neural optimization features
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Cards - Only show if setup completed */}
      {hasCompletedSetup && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Start Protocol Card */}
          <div className="relative group cursor-pointer" onClick={() => onNavigate('protocol')}>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-500 group-hover:transform group-hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Start Protocol</h3>
                  <p className="text-cyan-400 text-sm font-mono">INITIATE.NEURAL.SEQUENCE</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6">
                Begin your optimized productivity session with AI-guided task execution
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Ready to activate</span>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Emergency Mode Card */}
          <div className="relative group cursor-pointer" onClick={() => onNavigate('emergency')}>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-red-400/30 hover:border-red-400/60 transition-all duration-500 group-hover:transform group-hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-red-400 to-orange-500 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Emergency Mode</h3>
                  <p className="text-red-400 text-sm font-mono">PANIC.BUTTON.READY</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6">
                Stuck on a task? Get instant AI analysis and solution options
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Always available</span>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="relative group cursor-pointer" onClick={() => onNavigate('rewards')}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-500 group-hover:transform group-hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Claim Rewards</h3>
                  <p className="text-yellow-400 text-sm font-mono">DOPAMINE.BOOST.READY</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6">
                {stats.totalPoints} points available for reward redemption
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">3 rewards unlocked</span>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics - Only show if setup completed */}
      {hasCompletedSetup && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-400/20">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400 font-mono">NEURAL ACTIVITY</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{stats.currentStreak} days</div>
            <div className="text-sm text-slate-400">Current streak</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-indigo-400/20">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400 font-mono">COMPLETION</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{stats.tasksCompleted}</div>
            <div className="text-sm text-slate-400">Tasks completed</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/20">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-400 font-mono">REWARDS</span>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{stats.totalPoints}</div>
            <div className="text-sm text-slate-400">Neural points</div>
          </div>
        </div>
      )}
    </div>
  );
}