import React, { useState, useEffect } from 'react';
import { Brain, Mail, ArrowRight, CheckCircle, AlertCircle, Zap, LogIn, Activity, TrendingUp, Target, Eye, Lightbulb } from 'lucide-react';
import { supabase } from './lib/supabase';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import NeuralBackground from './components/NeuralBackground';
import Dashboard from './components/Dashboard';

function App() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setShowDashboard(!!currentUser);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setShowDashboard(!!currentUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const { error: supabaseError } = await supabase
        .from('email_subscriptions')
        .insert([{ email: email.trim() }]);

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          setError('Neural pathway already established for this email');
        } else {
          setError('Connection failed. Retrying neural link...');
        }
      } else {
        setTimeout(() => {
          setIsSubscribed(true);
          setEmail('');
        }, 1500);
      }
    } catch (err) {
      setError('Neural network disruption detected. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setShowDashboard(!!user);
    });
  };

  const handleSignOut = () => {
    setUser(null);
    setShowDashboard(false);
  };

  // Show dashboard if user is authenticated
  if (showDashboard && user) {
    return <Dashboard user={user} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Neural Network Background */}
      <NeuralBackground />
      
      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%2300d4ff%22%20fill-opacity=%220.03%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>

      {/* Header */}
      <header className="relative px-6 py-8 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-300 transition-all duration-500">
                Deprocast
              </h1>
              <p className="text-xs text-cyan-300/70 font-mono tracking-wider">
                CONSCIOUSNESS.REALITY.PROTOCOL
              </p>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu user={user} onSignOut={handleSignOut} />
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl border border-cyan-400/30 text-cyan-300 hover:text-white hover:border-cyan-400/60 transition-all duration-500 group"
              >
                <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold">Neural Access</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative px-6 pb-16 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-12">
            <div className="space-y-8">
              <div className="relative">
                <h2 className="text-6xl md:text-7xl font-bold leading-tight">
                  <span className="text-white">Stop Being a</span>
                  <br />
                  <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
                    Victim
                  </span>
                  <br />
                  <span className="text-white">Become a</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                    Creator
                  </span>
                </h2>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl animate-ping"></div>
              </div>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-light">
                Your consciousness literally creates your reality. Most people live in mental prison without knowing it.
                <span className="text-cyan-400 font-semibold block mt-4">
                  Quantum physics proved this decades ago, but they don't teach it because aware people are harder to control.
                </span>
              </p>
            </div>

            {/* Consciousness Principles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Observer Effect */}
              <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/30 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-500 group">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="relative">
                    <Eye className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
                    <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-30"></div>
                  </div>
                  <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    The Observer Effect
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  In quantum mechanics, particles exist in multiple states until observed. 
                  <span className="text-cyan-400 font-semibold"> Your attention determines what becomes real.</span>
                </p>
                <div className="mt-4 text-xs text-cyan-300/70">
                  What you focus on expands • What you ignore disappears
                </div>
              </div>

              {/* Belief Filters */}
              <div className="bg-gradient-to-r from-slate-800/50 to-purple-900/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-500 group">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="relative">
                    <Lightbulb className="w-6 h-6 text-purple-400 group-hover:animate-pulse" />
                    <div className="absolute inset-0 bg-purple-400 rounded-full blur-md opacity-30"></div>
                  </div>
                  <span className="text-sm font-bold text-purple-400 uppercase tracking-wider font-mono">
                    Reality Filters
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Your beliefs are reality filters. Your brain deletes, distorts, and generalizes information to match your beliefs.
                  <span className="text-purple-400 font-semibold"> You're not experiencing objective reality.</span>
                </p>
                <div className="mt-4 text-xs text-purple-300/70">
                  Believe you're unlucky → notice every bad thing • Believe opportunities are everywhere → spot chances others miss
                </div>
              </div>

              {/* Victim vs Creator */}
              <div className="bg-gradient-to-r from-slate-800/50 to-red-900/30 backdrop-blur-xl rounded-3xl p-8 border border-red-400/20 hover:border-red-400/40 transition-all duration-500 group">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="relative">
                    <AlertCircle className="w-6 h-6 text-red-400 group-hover:animate-pulse" />
                    <div className="absolute inset-0 bg-red-400 rounded-full blur-md opacity-30"></div>
                  </div>
                  <span className="text-sm font-bold text-red-400 uppercase tracking-wider font-mono">
                    Victim Mindset
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Victims blame external factors. They create by default based on past programming and social conditioning.
                  <span className="text-red-400 font-semibold"> Unconscious creators trapped in mental prison.</span>
                </p>
                <div className="mt-4 text-xs text-red-300/70">
                  "I can't because..." • "It's not my fault..." • "I don't have control..."
                </div>
              </div>

              {/* Creator Mindset */}
              <div className="bg-gradient-to-r from-slate-800/50 to-green-900/30 backdrop-blur-xl rounded-3xl p-8 border border-green-400/20 hover:border-green-400/40 transition-all duration-500 group">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="relative">
                    <Target className="w-6 h-6 text-green-400 group-hover:animate-pulse" />
                    <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-30"></div>
                  </div>
                  <span className="text-sm font-bold text-green-400 uppercase tracking-wider font-mono">
                    Creator Mindset
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Creators take full responsibility for their experience. They deliberately design their internal state to generate desired external results.
                  <span className="text-green-400 font-semibold"> Conscious creators who understand the game.</span>
                </p>
                <div className="mt-4 text-xs text-green-300/70">
                  "How can I..." • "What can I learn..." • "I choose to..."
                </div>
              </div>
            </div>

            {/* The Meta-Level Hack */}
            <div className="bg-gradient-to-r from-slate-800/50 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-8 border border-indigo-400/20 hover:border-indigo-400/40 transition-all duration-500 group">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="relative">
                  <Brain className="w-6 h-6 text-indigo-400 group-hover:animate-pulse" />
                  <div className="absolute inset-0 bg-indigo-400 rounded-full blur-md opacity-30"></div>
                </div>
                <span className="text-sm font-bold text-indigo-400 uppercase tracking-wider font-mono">
                  The Meta-Level Hack
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg mb-4">
                <strong className="text-indigo-400">Become aware of your awareness.</strong> Watch your thoughts without identifying with them. 
                Observe your emotional patterns from a detached perspective.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Once you realize you're the observer of your experience, not the experience itself, 
                you gain the power to consciously choose what you observe.
              </p>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-indigo-300/70">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  Your outer world reflects your inner world
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  Change the inner, the outer must follow
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
                  Consciousness is the ultimate advantage
                </span>
              </div>
            </div>
          </div>

          {/* Neural Access Portal */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/80 to-blue-900/40 backdrop-blur-2xl rounded-3xl p-10 border border-cyan-400/30 shadow-2xl">
              {!isSubscribed ? (
                <>
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-lg opacity-40"></div>
                        <div className="relative p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white">
                        Stop Trying to Change Your Results
                      </h3>
                    </div>
                    
                    <p className="text-slate-300 text-lg mb-2">
                      Start changing your consciousness. The results will follow automatically.
                    </p>
                    <p className="text-cyan-400/70 text-sm font-mono">
                      CONSCIOUSNESS.TRANSFORMATION.PROTOCOL
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
                      <div className="relative flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="consciousness.shift@domain.com"
                            className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border-2 border-cyan-400/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-500 text-white placeholder:text-slate-400 text-lg backdrop-blur-xl"
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-500 flex items-center justify-center gap-3 font-bold text-lg shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span className="font-mono">CONNECTING...</span>
                            </>
                          ) : (
                            <>
                              <span>BREAK FREE</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="flex items-center justify-center gap-3 text-red-400 bg-red-500/10 p-4 rounded-2xl border border-red-500/30 backdrop-blur-xl">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-semibold">{error}</span>
                      </div>
                    )}
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm font-mono">
                      CONSCIOUSNESS.UPGRADE // REALITY.SHIFT // CREATOR.MODE.ACTIVATED
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8">
                    <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-4">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Consciousness Shift Initiated
                  </h3>
                  <p className="text-slate-300 text-lg mb-6">
                    Welcome to the reality creation protocol
                  </p>
                  <div className="bg-green-500/10 rounded-2xl border border-green-400/30 p-6 backdrop-blur-xl">
                    <p className="text-green-400 font-semibold mb-2">
                      VICTIM.MODE.DEACTIVATED
                    </p>
                    <p className="text-slate-300 text-sm">
                      Your journey from unconscious victim to conscious creator begins now. Check your email for the transformation protocol.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative px-6 py-12 border-t border-cyan-400/20 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <p className="text-slate-400 font-mono text-sm">
              DEPROCAST.CONSCIOUSNESS.PROTOCOL // REALITY.CREATION.SYSTEM
            </p>
            <div className="flex items-center justify-center gap-4 text-cyan-400/70">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span className="text-xs font-mono">CONSCIOUSNESS_BASED</span>
              </div>
              <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-mono">REALITY_DRIVEN</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;