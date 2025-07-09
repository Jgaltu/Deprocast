import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Brain,
  Settings,
  Activity,
  Award,
  Zap,
  BarChart3
} from 'lucide-react';
import { User, UserProfile } from '../types';

interface ProfileReviewProps {
  user: User;
}

export default function ProfileReview({ user }: ProfileReviewProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<any>({});

  useEffect(() => {
    // Mock data - replace with actual API calls
    setProfile({
      id: '1',
      user_id: user.id,
      total_points: 2847,
      current_streak: 7,
      longest_streak: 23,
      tasks_completed: 156,
      protocols_completed: 12,
      preferred_work_duration: 45,
      preferred_break_duration: 15,
      peak_productivity_hours: ['09:00', '10:00', '11:00', '14:00', '15:00']
    });

    setSchedule([
      { time: '09:00', task: 'Deep Work Protocol - Phase 1', duration: 45, type: 'focus' },
      { time: '10:00', task: 'Neural Break', duration: 15, type: 'break' },
      { time: '10:15', task: 'Email Processing', duration: 30, type: 'admin' },
      { time: '11:00', task: 'Creative Project Work', duration: 60, type: 'creative' },
      { time: '12:00', task: 'Lunch & Movement', duration: 60, type: 'break' },
      { time: '13:00', task: 'Team Collaboration', duration: 45, type: 'social' },
      { time: '14:00', task: 'Deep Work Protocol - Phase 2', duration: 45, type: 'focus' },
      { time: '15:00', task: 'Review & Planning', duration: 30, type: 'planning' }
    ]);

    setWeeklyStats({
      tasksCompleted: [12, 15, 18, 14, 16, 20, 13],
      focusHours: [3.5, 4.2, 5.1, 3.8, 4.5, 5.8, 3.2],
      dopamineScore: [85, 92, 88, 79, 91, 95, 82]
    });
  }, [user.id]);

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'focus': return 'from-cyan-400 to-blue-500';
      case 'creative': return 'from-purple-400 to-pink-500';
      case 'admin': return 'from-yellow-400 to-orange-500';
      case 'social': return 'from-green-400 to-emerald-500';
      case 'planning': return 'from-indigo-400 to-purple-500';
      case 'break': return 'from-slate-400 to-slate-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'focus': return Brain;
      case 'creative': return Zap;
      case 'admin': return Settings;
      case 'social': return UserIcon;
      case 'planning': return Target;
      case 'break': return Clock;
      default: return Activity;
    }
  };

  if (!profile) {
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
      {/* Profile Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/30">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-40"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">Neural Profile</h2>
              <p className="text-cyan-400 font-mono text-sm mb-4">
                USER.ID: {user.email.split('@')[0].toUpperCase()}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-cyan-400">{profile.current_streak}</div>
                  <div className="text-xs text-slate-400 font-mono">CURRENT STREAK</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{profile.longest_streak}</div>
                  <div className="text-xs text-slate-400 font-mono">LONGEST STREAK</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-indigo-400">{profile.tasks_completed}</div>
                  <div className="text-xs text-slate-400 font-mono">TASKS DONE</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">{profile.protocols_completed}</div>
                  <div className="text-xs text-slate-400 font-mono">PROTOCOLS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <Settings className="w-5 h-5 text-cyan-400" />
                Neural Optimization
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Work Duration</span>
                  <span className="text-cyan-400 font-mono">{profile.preferred_work_duration}min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Break Duration</span>
                  <span className="text-cyan-400 font-mono">{profile.preferred_break_duration}min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Peak Hours</span>
                  <span className="text-cyan-400 font-mono">
                    {profile.peak_productivity_hours.length} slots
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Performance Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Completion Rate</span>
                  <span className="text-green-400 font-mono">
                    {Math.round((profile.tasks_completed / (profile.tasks_completed + 20)) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Focus Sessions</span>
                  <span className="text-blue-400 font-mono">{profile.protocols_completed * 8}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Avg Dopamine Score</span>
                  <span className="text-purple-400 font-mono">8.7/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Today's Neural Schedule</h3>
              <p className="text-blue-400 font-mono text-sm">OPTIMIZED.PRODUCTIVITY.TIMELINE</p>
            </div>
          </div>

          <div className="space-y-3">
            {schedule.map((item, index) => {
              const IconComponent = getTaskTypeIcon(item.type);
              const isCurrentTime = false; // You would implement actual time checking here
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    isCurrentTime
                      ? 'bg-cyan-500/20 border-cyan-400/50'
                      : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-mono text-cyan-400">{item.time}</div>
                  </div>
                  
                  <div className={`p-2 bg-gradient-to-r ${getTaskTypeColor(item.type)} rounded-lg`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-white">{item.task}</div>
                    <div className="text-sm text-slate-400">{item.duration} minutes</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-mono uppercase">
                      {item.type}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-400/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Weekly Performance Analysis</h3>
              <p className="text-indigo-400 font-mono text-sm">NEURAL.PATTERN.RECOGNITION</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                Tasks Completed
              </h4>
              <div className="flex items-end gap-1 h-20">
                {weeklyStats.tasksCompleted?.map((count: number, index: number) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-green-400 to-emerald-500 rounded-t"
                    style={{ height: `${(count / 20) * 100}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Focus Hours
              </h4>
              <div className="flex items-end gap-1 h-20">
                {weeklyStats.focusHours?.map((hours: number, index: number) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-blue-400 to-indigo-500 rounded-t"
                    style={{ height: `${(hours / 6) * 100}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Dopamine Score
              </h4>
              <div className="flex items-end gap-1 h-20">
                {weeklyStats.dopamineScore?.map((score: number, index: number) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-purple-400 to-pink-500 rounded-t"
                    style={{ height: `${score}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}