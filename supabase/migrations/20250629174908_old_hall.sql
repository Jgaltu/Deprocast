/*
  # Create Execution Tracking Table

  1. New Tables
    - `execution_tracking`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `task_name` (text, not null)
      - `start_time` (timestamptz)
      - `completion_time` (timestamptz)
      - `actual_duration` (integer, minutes)
      - `estimated_duration` (integer, minutes)
      - `dopamine_rating` (integer, 1-10 scale)
      - `next_task_motivation` (integer, 1-10 scale)
      - `obstacles_encountered` (text array)
      - `breakthrough_moments` (text array)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `execution_tracking` table
    - Add policy for users to manage their own tracking data

  3. Indexes
    - Add indexes for user_id and created_at for performance
*/

CREATE TABLE IF NOT EXISTS execution_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Task Information
  task_name text NOT NULL,
  start_time timestamptz,
  completion_time timestamptz,
  
  -- Duration Tracking
  actual_duration integer, -- in minutes
  estimated_duration integer, -- in minutes
  
  -- Neural Response Metrics
  dopamine_rating integer CHECK (dopamine_rating >= 1 AND dopamine_rating <= 10),
  next_task_motivation integer CHECK (next_task_motivation >= 1 AND next_task_motivation <= 10),
  
  -- Qualitative Data
  obstacles_encountered text[] DEFAULT '{}',
  breakthrough_moments text[] DEFAULT '{}',
  
  -- Additional Context
  notes text,
  session_id uuid, -- For grouping related tasks
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE execution_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can manage own execution tracking"
  ON execution_tracking
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_execution_tracking_user_id ON execution_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_execution_tracking_created_at ON execution_tracking(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_execution_tracking_session ON execution_tracking(user_id, session_id);

-- Create trigger for updated_at
CREATE TRIGGER update_execution_tracking_updated_at
  BEFORE UPDATE ON execution_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();