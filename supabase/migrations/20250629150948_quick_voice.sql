/*
  # Add missing onboarding columns

  1. New Columns
    - Add missing columns to onboarding_responses table that are referenced in the application code
    - All columns are nullable to support progressive data collection during onboarding flow

  2. Changes
    - Add avoidance_pattern column (TEXT)
    - Add work_environment column (TEXT) 
    - Add motivation_style column (TEXT)
    - Add session_length column (TEXT)
    - Add biggest_project column (TEXT)
    - Add current_frustration column (TEXT)
    - Add biggest_success column (TEXT)
    - Add success_factors column (TEXT)

  3. Notes
    - These columns support the onboarding flow data collection
    - All columns allow NULL values for progressive completion
*/

-- Add missing columns to onboarding_responses table
DO $$
BEGIN
  -- Add avoidance_pattern column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_responses' AND column_name = 'avoidance_pattern'
  ) THEN
    ALTER TABLE onboarding_responses ADD COLUMN avoidance_pattern TEXT;
  END IF;

  -- Add work_environment column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_responses' AND column_name = 'work_environment'
  ) THEN
    ALTER TABLE onboarding_responses ADD COLUMN work_environment TEXT;
  END IF;

  -- Add motivation_style column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_responses' AND column_name = 'motivation_style'
  ) THEN
    ALTER TABLE onboarding_responses ADD COLUMN motivation_style TEXT;
  END IF;

  -- Add session_length column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_responses' AND column_name = 'session_length'
  ) THEN
    ALTER TABLE onboarding_responses ADD COLUMN session_length TEXT;
  END IF;

  -- Add biggest_project column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_responses' AND column_name = 'biggest_project'
  ) THEN
    ALTER TABLE onboarding_responses ADD COLUMN biggest_project TEXT;
  END IF;

  -- Add current_frustration column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_responses' AND column_name = 'current_frustration'
  ) THEN
    ALTER TABLE onboarding_responses ADD COLUMN current_frustration TEXT;
  END IF;

  -- Add biggest_success column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_responses' AND column_name = 'biggest_success'
  ) THEN
    ALTER TABLE onboarding_responses ADD COLUMN biggest_success TEXT;
  END IF;

  -- Add success_factors column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_responses' AND column_name = 'success_factors'
  ) THEN
    ALTER TABLE onboarding_responses ADD COLUMN success_factors TEXT;
  END IF;
END $$;