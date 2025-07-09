export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  phase: number;
  status: 'pending' | 'in_progress' | 'completed' | 'stuck';
  difficulty_level: 1 | 2 | 3 | 4 | 5;
  estimated_duration: number; // minutes
  actual_duration?: number;
  dopamine_score?: number;
  created_at: string;
  completed_at?: string;
}

export interface Protocol {
  id: string;
  user_id: string;
  name: string;
  current_phase: number;
  total_phases: number;
  status: 'active' | 'paused' | 'completed';
  start_date: string;
  target_completion_date: string;
  progress_percentage: number;
}

export interface Reward {
  id: string;
  user_id: string;
  title: string;
  description: string;
  points_required: number;
  category: 'micro' | 'mini' | 'major';
  is_claimed: boolean;
  claimed_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  tasks_completed: number;
  protocols_completed: number;
  preferred_work_duration: number;
  preferred_break_duration: number;
  peak_productivity_hours: string[];
}

export interface PanicSession {
  id: string;
  user_id: string;
  task_id: string;
  trigger_reason: string;
  ai_analysis: string;
  solution_options: string[];
  chosen_solution: string;
  outcome: 'resolved' | 'modified' | 'pivoted';
  created_at: string;
}

// New onboarding types
export interface OnboardingData {
  // Stage 1: Initial Hook
  baselineAnxiety: number;
  procrastinationFrequency: string;
  dopamineResponse: number;
  accomplishments: string[];
  
  // Stage 2: Neural Assessment
  triggerType: string;
  avoidancePattern: string;
  workEnvironment: string;
  motivationStyle: string;
  rewardPreferences: { [key: string]: number };
  sessionLength: string;
  biggestProject: string;
  currentFrustration: string;
  biggestSuccess: string;
  successFactors: string;
  
  // Stage 3: Proof of Concept
  firstAction: string;
  secondAction: string;
  thirdAction: string;
  completionAttempted: boolean;
  resistanceLevel: number;
  
  // Stage 4: Program Preview
  selectedProgram?: string;
  conversionPath?: string;
  signupTimestamp?: Date;
}

export interface NeuralProfile {
  primaryType: string;
  triggerType: string;
  avoidancePattern: string;
  motivationStyle: string;
  rewardPreferences: string[];
  optimalSessionLength: string;
  procrastinationLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  dopamineSensitivity: 'RESPONSIVE' | 'MODERATE' | 'RESISTANT';
  complexityTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  motivationSustainability: 'SPRINT' | 'STEADY' | 'MARATHON';
}

export interface PersonalizedProgram {
  week1Tasks: string[];
  week2Tasks: string[];
  week3Tasks: string[];
  expectedOutcomes: string[];
  riskFactors: string[];
  successProbability: number;
}