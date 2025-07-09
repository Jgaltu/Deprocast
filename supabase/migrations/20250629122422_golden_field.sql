/*
  # Deprocast Onboarding Database Schema

  1. New Tables
    - `user_profiles` - Extended user information and preferences
    - `onboarding_responses` - Complete onboarding flow responses
    - `neural_assessments` - Detailed neural profile analysis
    - `personalized_programs` - Generated program recommendations
    - `user_tasks` - Individual tasks and their completion status
    - `user_protocols` - Active productivity protocols
    - `user_rewards` - Available and claimed rewards
    - `panic_sessions` - Emergency mode interventions
    - `dopamine_tracking` - Dopamine response measurements

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Ensure data privacy and security compliance

  3. Relationships
    - All tables linked to auth.users via user_id
    - Proper foreign key constraints
    - Cascading deletes where appropriate
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_points integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  tasks_completed integer DEFAULT 0,
  protocols_completed integer DEFAULT 0,
  preferred_work_duration integer DEFAULT 45,
  preferred_break_duration integer DEFAULT 15,
  peak_productivity_hours text[] DEFAULT '{}',
  onboarding_completed boolean DEFAULT false,
  onboarding_completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Onboarding Responses Table
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Stage 1: Initial Hook
  baseline_anxiety integer CHECK (baseline_anxiety >= 1 AND baseline_anxiety <= 10),
  procrastination_frequency text,
  dopamine_response integer CHECK (dopamine_response >= 1 AND dopamine_response <= 10),
  accomplishments text[] DEFAULT '{}',
  
  -- Stage 2: Neural Assessment
  trigger_type text,
  avoidance_pattern text,
  work_environment text,
  motivation_style text,
  reward_preferences jsonb DEFAULT '{}',
  session_length text,
  biggest_project text,
  current_frustration text,
  biggest_success text,
  success_factors text,
  
  -- Stage 3: Proof of Concept
  first_action text,
  second_action text,
  third_action text,
  completion_attempted boolean DEFAULT false,
  resistance_level integer CHECK (resistance_level >= 1 AND resistance_level <= 10),
  
  -- Stage 4: Program Preview
  selected_program text,
  conversion_path text,
  
  -- Metadata
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  current_stage integer DEFAULT 1,
  total_time_spent integer DEFAULT 0, -- in seconds
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Neural Assessments Table
CREATE TABLE IF NOT EXISTS neural_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  onboarding_response_id uuid REFERENCES onboarding_responses(id) ON DELETE CASCADE,
  
  -- Computed Neural Profile
  primary_type text NOT NULL,
  trigger_type text NOT NULL,
  avoidance_pattern text NOT NULL,
  motivation_style text NOT NULL,
  reward_preferences text[] DEFAULT '{}',
  optimal_session_length text NOT NULL,
  procrastination_level text CHECK (procrastination_level IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'MEDIUM',
  dopamine_sensitivity text CHECK (dopamine_sensitivity IN ('RESPONSIVE', 'MODERATE', 'RESISTANT')) DEFAULT 'MODERATE',
  complexity_tolerance text CHECK (complexity_tolerance IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'MEDIUM',
  motivation_sustainability text CHECK (motivation_sustainability IN ('SPRINT', 'STEADY', 'MARATHON')) DEFAULT 'STEADY',
  
  -- Risk Assessment
  risk_factors text[] DEFAULT '{}',
  success_probability integer CHECK (success_probability >= 0 AND success_probability <= 100),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Personalized Programs Table
CREATE TABLE IF NOT EXISTS personalized_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  neural_assessment_id uuid REFERENCES neural_assessments(id) ON DELETE CASCADE,
  
  program_name text NOT NULL,
  program_type text DEFAULT 'standard',
  duration_weeks integer DEFAULT 3,
  
  -- Weekly Task Structure
  week1_tasks text[] DEFAULT '{}',
  week2_tasks text[] DEFAULT '{}',
  week3_tasks text[] DEFAULT '{}',
  
  -- Expected Outcomes
  expected_outcomes text[] DEFAULT '{}',
  success_metrics jsonb DEFAULT '{}',
  
  -- Program Status
  status text CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')) DEFAULT 'draft',
  started_at timestamptz,
  completed_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Tasks Table
CREATE TABLE IF NOT EXISTS user_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_id uuid REFERENCES personalized_programs(id) ON DELETE CASCADE,
  
  title text NOT NULL,
  description text,
  phase integer DEFAULT 1,
  week_number integer DEFAULT 1,
  day_number integer DEFAULT 1,
  
  status text CHECK (status IN ('pending', 'in_progress', 'completed', 'stuck', 'skipped')) DEFAULT 'pending',
  difficulty_level integer CHECK (difficulty_level >= 1 AND difficulty_level <= 5) DEFAULT 3,
  
  -- Time Tracking
  estimated_duration integer, -- minutes
  actual_duration integer, -- minutes
  started_at timestamptz,
  completed_at timestamptz,
  
  -- Dopamine & Performance
  dopamine_score integer CHECK (dopamine_score >= 1 AND dopamine_score <= 10),
  satisfaction_rating integer CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 10),
  
  -- Task Metadata
  task_type text DEFAULT 'standard',
  tags text[] DEFAULT '{}',
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Protocols Table
CREATE TABLE IF NOT EXISTS user_protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_id uuid REFERENCES personalized_programs(id) ON DELETE CASCADE,
  
  name text NOT NULL,
  current_phase integer DEFAULT 1,
  total_phases integer DEFAULT 5,
  
  status text CHECK (status IN ('active', 'paused', 'completed', 'cancelled')) DEFAULT 'active',
  progress_percentage integer CHECK (progress_percentage >= 0 AND progress_percentage <= 100) DEFAULT 0,
  
  start_date timestamptz DEFAULT now(),
  target_completion_date timestamptz,
  actual_completion_date timestamptz,
  
  -- Session Tracking
  total_sessions integer DEFAULT 0,
  successful_sessions integer DEFAULT 0,
  average_session_duration integer DEFAULT 0, -- minutes
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Rewards Table
CREATE TABLE IF NOT EXISTS user_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  title text NOT NULL,
  description text NOT NULL,
  points_required integer NOT NULL CHECK (points_required > 0),
  category text CHECK (category IN ('micro', 'mini', 'major')) NOT NULL,
  
  is_claimed boolean DEFAULT false,
  claimed_at timestamptz,
  
  -- Reward Metadata
  reward_type text DEFAULT 'standard',
  custom_reward boolean DEFAULT false,
  image_url text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Panic Sessions Table
CREATE TABLE IF NOT EXISTS panic_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id uuid REFERENCES user_tasks(id) ON DELETE SET NULL,
  
  trigger_reason text NOT NULL,
  ai_analysis text,
  solution_options text[] DEFAULT '{}',
  chosen_solution text,
  
  outcome text CHECK (outcome IN ('resolved', 'modified', 'pivoted', 'abandoned')),
  effectiveness_rating integer CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
  
  -- Session Metadata
  session_duration integer, -- seconds
  follow_up_needed boolean DEFAULT false,
  notes text,
  
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Dopamine Tracking Table
CREATE TABLE IF NOT EXISTS dopamine_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id uuid REFERENCES user_tasks(id) ON DELETE SET NULL,
  
  event_type text CHECK (event_type IN ('task_start', 'task_complete', 'reward_claim', 'milestone', 'breakthrough')) NOT NULL,
  dopamine_level integer CHECK (dopamine_level >= 1 AND dopamine_level <= 10) NOT NULL,
  
  -- Context
  trigger_description text,
  mood_before integer CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after integer CHECK (mood_after >= 1 AND mood_after <= 10),
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 10),
  
  -- Environmental Factors
  time_of_day time,
  day_of_week integer CHECK (day_of_week >= 1 AND day_of_week <= 7),
  work_environment text,
  
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE neural_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE panic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dopamine_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for onboarding_responses
CREATE POLICY "Users can read own onboarding responses"
  ON onboarding_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding responses"
  ON onboarding_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding responses"
  ON onboarding_responses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for neural_assessments
CREATE POLICY "Users can read own neural assessments"
  ON neural_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own neural assessments"
  ON neural_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own neural assessments"
  ON neural_assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for personalized_programs
CREATE POLICY "Users can read own programs"
  ON personalized_programs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own programs"
  ON personalized_programs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own programs"
  ON personalized_programs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_tasks
CREATE POLICY "Users can read own tasks"
  ON user_tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON user_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON user_tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_protocols
CREATE POLICY "Users can read own protocols"
  ON user_protocols
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own protocols"
  ON user_protocols
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own protocols"
  ON user_protocols
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_rewards
CREATE POLICY "Users can read own rewards"
  ON user_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards"
  ON user_rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards"
  ON user_rewards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for panic_sessions
CREATE POLICY "Users can read own panic sessions"
  ON panic_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own panic sessions"
  ON panic_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own panic sessions"
  ON panic_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for dopamine_tracking
CREATE POLICY "Users can read own dopamine tracking"
  ON dopamine_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dopamine tracking"
  ON dopamine_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id ON onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_neural_assessments_user_id ON neural_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_personalized_programs_user_id ON personalized_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_status ON user_tasks(status);
CREATE INDEX IF NOT EXISTS idx_user_protocols_user_id ON user_protocols(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_panic_sessions_user_id ON panic_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_dopamine_tracking_user_id ON dopamine_tracking(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_responses_updated_at BEFORE UPDATE ON onboarding_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_neural_assessments_updated_at BEFORE UPDATE ON neural_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personalized_programs_updated_at BEFORE UPDATE ON personalized_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_tasks_updated_at BEFORE UPDATE ON user_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_protocols_updated_at BEFORE UPDATE ON user_protocols FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_rewards_updated_at BEFORE UPDATE ON user_rewards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();