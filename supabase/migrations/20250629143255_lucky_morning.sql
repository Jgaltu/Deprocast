/*
  # Fix Onboarding Database Schema

  1. Tables to Create/Update
    - Update existing tables if they exist
    - Add missing columns to existing tables
    - Create new tables that don't exist

  2. Security
    - Only create policies that don't already exist
    - Update existing policies if needed

  3. Indexes and Triggers
    - Create missing indexes
    - Add missing triggers
*/

-- First, let's add missing columns to existing tables if they exist
DO $$ 
BEGIN
  -- Add missing columns to user_profiles if they don't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
    -- Add onboarding columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'onboarding_completed') THEN
      ALTER TABLE user_profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'onboarding_completed_at') THEN
      ALTER TABLE user_profiles ADD COLUMN onboarding_completed_at timestamptz;
    END IF;
  END IF;
END $$;

-- Create onboarding_responses table if it doesn't exist
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  
  -- Stage 1: Initial Hook & Baseline Assessment
  baseline_anxiety integer CHECK (baseline_anxiety >= 1 AND baseline_anxiety <= 10),
  procrastination_frequency text,
  dopamine_response integer CHECK (dopamine_response >= 1 AND dopamine_response <= 10),
  accomplishments text[] DEFAULT '{}',
  
  -- Stage 2: Neural Assessment - Triggers & Patterns
  trigger_type text,
  avoidance_pattern text,
  work_environment text,
  motivation_style text,
  reward_preferences jsonb DEFAULT '{}',
  session_length text,
  
  -- Stage 2: Current State Assessment
  biggest_project text,
  current_frustration text,
  biggest_success text,
  success_factors text,
  
  -- Stage 3: Proof of Concept Actions
  first_action text,
  second_action text,
  third_action text,
  completion_attempted boolean DEFAULT false,
  resistance_level integer CHECK (resistance_level >= 1 AND resistance_level <= 10),
  
  -- Stage 4: Program Selection & Conversion
  selected_program text,
  conversion_path text,
  
  -- Meta Information
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  current_stage integer DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 14),
  total_time_spent integer DEFAULT 0, -- in seconds
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'onboarding_responses_user_id_fkey'
  ) THEN
    ALTER TABLE onboarding_responses 
    ADD CONSTRAINT onboarding_responses_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create neural_assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS neural_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  onboarding_response_id uuid,
  
  -- Neural Profile Results
  primary_type text NOT NULL,
  trigger_type text NOT NULL,
  avoidance_pattern text NOT NULL,
  motivation_style text NOT NULL,
  reward_preferences text[] DEFAULT '{}',
  optimal_session_length text NOT NULL,
  
  -- Assessment Scores
  procrastination_level text CHECK (procrastination_level IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'MEDIUM',
  dopamine_sensitivity text CHECK (dopamine_sensitivity IN ('RESPONSIVE', 'MODERATE', 'RESISTANT')) DEFAULT 'MODERATE',
  complexity_tolerance text CHECK (complexity_tolerance IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'MEDIUM',
  motivation_sustainability text CHECK (motivation_sustainability IN ('SPRINT', 'STEADY', 'MARATHON')) DEFAULT 'STEADY',
  
  -- Risk Assessment
  risk_factors text[] DEFAULT '{}',
  success_probability integer CHECK (success_probability >= 0 AND success_probability <= 100),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraints for neural_assessments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'neural_assessments_user_id_fkey'
  ) THEN
    ALTER TABLE neural_assessments 
    ADD CONSTRAINT neural_assessments_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'neural_assessments_onboarding_response_id_fkey'
  ) THEN
    ALTER TABLE neural_assessments 
    ADD CONSTRAINT neural_assessments_onboarding_response_id_fkey 
    FOREIGN KEY (onboarding_response_id) REFERENCES onboarding_responses(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create personalized_programs table if it doesn't exist
CREATE TABLE IF NOT EXISTS personalized_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  neural_assessment_id uuid,
  
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

-- Add foreign key constraints for personalized_programs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'personalized_programs_user_id_fkey'
  ) THEN
    ALTER TABLE personalized_programs 
    ADD CONSTRAINT personalized_programs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'personalized_programs_neural_assessment_id_fkey'
  ) THEN
    ALTER TABLE personalized_programs 
    ADD CONSTRAINT personalized_programs_neural_assessment_id_fkey 
    FOREIGN KEY (neural_assessment_id) REFERENCES neural_assessments(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update user_tasks table to add program_id reference if it doesn't exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_tasks') THEN
    -- Add program_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_tasks' AND column_name = 'program_id') THEN
      ALTER TABLE user_tasks ADD COLUMN program_id uuid;
    END IF;
    
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'user_tasks_program_id_fkey'
    ) THEN
      ALTER TABLE user_tasks 
      ADD CONSTRAINT user_tasks_program_id_fkey 
      FOREIGN KEY (program_id) REFERENCES personalized_programs(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Update user_protocols table to add program_id reference if it doesn't exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_protocols') THEN
    -- Add program_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_protocols' AND column_name = 'program_id') THEN
      ALTER TABLE user_protocols ADD COLUMN program_id uuid;
    END IF;
    
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'user_protocols_program_id_fkey'
    ) THEN
      ALTER TABLE user_protocols 
      ADD CONSTRAINT user_protocols_program_id_fkey 
      FOREIGN KEY (program_id) REFERENCES personalized_programs(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Enable Row Level Security on new tables
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE neural_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_programs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for onboarding_responses (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'onboarding_responses' AND policyname = 'Users can read own onboarding responses'
  ) THEN
    CREATE POLICY "Users can read own onboarding responses"
      ON onboarding_responses
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'onboarding_responses' AND policyname = 'Users can insert own onboarding responses'
  ) THEN
    CREATE POLICY "Users can insert own onboarding responses"
      ON onboarding_responses
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'onboarding_responses' AND policyname = 'Users can update own onboarding responses'
  ) THEN
    CREATE POLICY "Users can update own onboarding responses"
      ON onboarding_responses
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create RLS Policies for neural_assessments (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'neural_assessments' AND policyname = 'Users can read own neural assessments'
  ) THEN
    CREATE POLICY "Users can read own neural assessments"
      ON neural_assessments
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'neural_assessments' AND policyname = 'Users can insert own neural assessments'
  ) THEN
    CREATE POLICY "Users can insert own neural assessments"
      ON neural_assessments
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'neural_assessments' AND policyname = 'Users can update own neural assessments'
  ) THEN
    CREATE POLICY "Users can update own neural assessments"
      ON neural_assessments
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create RLS Policies for personalized_programs (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'personalized_programs' AND policyname = 'Users can read own programs'
  ) THEN
    CREATE POLICY "Users can read own programs"
      ON personalized_programs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'personalized_programs' AND policyname = 'Users can insert own programs'
  ) THEN
    CREATE POLICY "Users can insert own programs"
      ON personalized_programs
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'personalized_programs' AND policyname = 'Users can update own programs'
  ) THEN
    CREATE POLICY "Users can update own programs"
      ON personalized_programs
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id ON onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_completed ON onboarding_responses(user_id, completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_stage ON onboarding_responses(user_id, current_stage);

CREATE INDEX IF NOT EXISTS idx_neural_assessments_user_id ON neural_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_neural_assessments_onboarding ON neural_assessments(onboarding_response_id);

CREATE INDEX IF NOT EXISTS idx_personalized_programs_user_id ON personalized_programs(user_id);

-- Create or replace the update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_onboarding_responses_updated_at'
  ) THEN
    CREATE TRIGGER update_onboarding_responses_updated_at
      BEFORE UPDATE ON onboarding_responses
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_neural_assessments_updated_at'
  ) THEN
    CREATE TRIGGER update_neural_assessments_updated_at
      BEFORE UPDATE ON neural_assessments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_personalized_programs_updated_at'
  ) THEN
    CREATE TRIGGER update_personalized_programs_updated_at
      BEFORE UPDATE ON personalized_programs
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;