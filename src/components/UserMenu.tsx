import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown, Activity, Brain } from 'lucide-react';
import { signOut } from '../lib/supabase';

interface UserMenuProps {
  user: any;
  onSignOut: () => void;
}

export default function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-800/50 to-blue-900/30 backdrop-blur-xl rounded-2xl border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-500 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-semibold text-white">
            {user.email?.split('@')[0]}
          </div>
          <div className="text-xs text-cyan-400 font-mono">
            NEURAL.ACTIVE
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-blue-900/50 backdrop-blur-2xl rounded-2xl border border-cyan-400/30 shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-cyan-400/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user.email}</p>
                      <p className="text-xs text-cyan-400 font-mono">NEURAL.PROTOCOL.ACTIVE</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700/30 rounded-xl flex items-center gap-3 transition-all duration-200 group">
                    <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
                    <span>Neural Dashboard</span>
                  </button>
                  
                  <button className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700/30 rounded-xl flex items-center gap-3 transition-all duration-200 group">
                    <Settings className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
                    <span>Protocol Settings</span>
                  </button>
                  
                  <div className="border-t border-cyan-400/20 mt-2 pt-2">
                    <button 
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-all duration-200 group"
                    >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>Disconnect Neural Link</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}