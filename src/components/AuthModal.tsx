import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Brain } from 'lucide-react';
import { signUp, signIn } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (!isLogin && password !== confirmPassword) {
      setError('Neural pathway synchronization failed: passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password);
      }

      if (result.error) {
        setError(`Authentication protocol error: ${result.error.message}`);
      } else {
        onAuthSuccess();
        onClose();
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Neural network connection failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
        <div className="relative bg-gradient-to-br from-slate-800/90 to-blue-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-md border border-cyan-400/30">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-slate-700/50 rounded-xl transition-colors duration-200 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-8 pb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-lg opacity-40"></div>
                <div className="relative p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isLogin ? 'Neural Access' : 'Initialize Protocol'}
                </h2>
                <p className="text-xs text-cyan-400 font-mono">
                  {isLogin ? 'AUTHENTICATE.NEURAL.LINK' : 'CREATE.NEURAL.PROFILE'}
                </p>
              </div>
            </div>
            
            <p className="text-slate-300">
              {isLogin 
                ? 'Reconnect to your cognitive enhancement dashboard' 
                : 'Begin your journey to neural optimization'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-cyan-400 font-mono">
                NEURAL.IDENTIFIER
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="neural.interface@domain.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border-2 border-cyan-400/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-500 text-white placeholder:text-slate-400 backdrop-blur-xl"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-cyan-400 font-mono">
                SECURITY.PROTOCOL
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter neural access key"
                  className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border-2 border-cyan-400/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-500 text-white placeholder:text-slate-400 backdrop-blur-xl"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-cyan-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password field (only for signup) */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-cyan-400 font-mono">
                  VERIFY.PROTOCOL
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm neural access key"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border-2 border-cyan-400/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-500 text-white placeholder:text-slate-400 backdrop-blur-xl"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-2xl backdrop-blur-xl">
                <p className="text-red-400 text-sm font-semibold">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-500 font-bold shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-mono">
                    {isLogin ? 'AUTHENTICATING...' : 'INITIALIZING...'}
                  </span>
                </div>
              ) : (
                <span className="font-mono">
                  {isLogin ? 'AUTHENTICATE' : 'INITIALIZE'}
                </span>
              )}
            </button>

            {/* Toggle mode */}
            <div className="text-center pt-6 border-t border-cyan-400/20">
              <p className="text-slate-400">
                {isLogin ? "Need neural profile initialization?" : "Already have neural access?"}
              </p>
              <button
                type="button"
                onClick={toggleMode}
                className="mt-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200 font-mono"
              >
                {isLogin ? 'CREATE.PROFILE' : 'ACCESS.EXISTING'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}