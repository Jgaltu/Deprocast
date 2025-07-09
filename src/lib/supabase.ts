import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      email_subscriptions: {
        Row: {
          id: string
          email: string
          created_at: string
          subscribed: boolean
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          subscribed?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          subscribed?: boolean
        }
      }
      onboarding_responses: {
        Row: {
          id: string
          user_id: string
          baseline_anxiety: number | null
          procrastination_frequency: string | null
          dopamine_response: number | null
          accomplishments: string[]
          trigger_type: string | null
          avoidance_pattern: string | null
          work_environment: string | null
          motivation_style: string | null
          reward_preferences: any
          session_length: string | null
          biggest_project: string | null
          current_frustration: string | null
          biggest_success: string | null
          success_factors: string | null
          first_action: string | null
          second_action: string | null
          third_action: string | null
          completion_attempted: boolean
          resistance_level: number | null
          selected_program: string | null
          conversion_path: string | null
          started_at: string
          completed_at: string | null
          current_stage: number
          total_time_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          baseline_anxiety?: number | null
          procrastination_frequency?: string | null
          dopamine_response?: number | null
          accomplishments?: string[]
          trigger_type?: string | null
          avoidance_pattern?: string | null
          work_environment?: string | null
          motivation_style?: string | null
          reward_preferences?: any
          session_length?: string | null
          biggest_project?: string | null
          current_frustration?: string | null
          biggest_success?: string | null
          success_factors?: string | null
          first_action?: string | null
          second_action?: string | null
          third_action?: string | null
          completion_attempted?: boolean
          resistance_level?: number | null
          selected_program?: string | null
          conversion_path?: string | null
          started_at?: string
          completed_at?: string | null
          current_stage?: number
          total_time_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          baseline_anxiety?: number | null
          procrastination_frequency?: string | null
          dopamine_response?: number | null
          accomplishments?: string[]
          trigger_type?: string | null
          avoidance_pattern?: string | null
          work_environment?: string | null
          motivation_style?: string | null
          reward_preferences?: any
          session_length?: string | null
          biggest_project?: string | null
          current_frustration?: string | null
          biggest_success?: string | null
          success_factors?: string | null
          first_action?: string | null
          second_action?: string | null
          third_action?: string | null
          completion_attempted?: boolean
          resistance_level?: number | null
          selected_program?: string | null
          conversion_path?: string | null
          started_at?: string
          completed_at?: string | null
          current_stage?: number
          total_time_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          total_points: number
          current_streak: number
          longest_streak: number
          tasks_completed: number
          protocols_completed: number
          preferred_work_duration: number
          preferred_break_duration: number
          peak_productivity_hours: string[]
          onboarding_completed: boolean
          onboarding_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_points?: number
          current_streak?: number
          longest_streak?: number
          tasks_completed?: number
          protocols_completed?: number
          preferred_work_duration?: number
          preferred_break_duration?: number
          peak_productivity_hours?: string[]
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_points?: number
          current_streak?: number
          longest_streak?: number
          tasks_completed?: number
          protocols_completed?: number
          preferred_work_duration?: number
          preferred_break_duration?: number
          peak_productivity_hours?: string[]
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      neural_assessments: {
        Row: {
          id: string
          user_id: string
          onboarding_response_id: string | null
          primary_type: string
          trigger_type: string
          avoidance_pattern: string
          motivation_style: string
          reward_preferences: string[]
          optimal_session_length: string
          procrastination_level: 'LOW' | 'MEDIUM' | 'HIGH'
          dopamine_sensitivity: 'RESPONSIVE' | 'MODERATE' | 'RESISTANT'
          complexity_tolerance: 'LOW' | 'MEDIUM' | 'HIGH'
          motivation_sustainability: 'SPRINT' | 'STEADY' | 'MARATHON'
          risk_factors: string[]
          success_probability: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          onboarding_response_id?: string | null
          primary_type: string
          trigger_type: string
          avoidance_pattern: string
          motivation_style: string
          reward_preferences?: string[]
          optimal_session_length: string
          procrastination_level?: 'LOW' | 'MEDIUM' | 'HIGH'
          dopamine_sensitivity?: 'RESPONSIVE' | 'MODERATE' | 'RESISTANT'
          complexity_tolerance?: 'LOW' | 'MEDIUM' | 'HIGH'
          motivation_sustainability?: 'SPRINT' | 'STEADY' | 'MARATHON'
          risk_factors?: string[]
          success_probability?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          onboarding_response_id?: string | null
          primary_type?: string
          trigger_type?: string
          avoidance_pattern?: string
          motivation_style?: string
          reward_preferences?: string[]
          optimal_session_length?: string
          procrastination_level?: 'LOW' | 'MEDIUM' | 'HIGH'
          dopamine_sensitivity?: 'RESPONSIVE' | 'MODERATE' | 'RESISTANT'
          complexity_tolerance?: 'LOW' | 'MEDIUM' | 'HIGH'
          motivation_sustainability?: 'SPRINT' | 'STEADY' | 'MARATHON'
          risk_factors?: string[]
          success_probability?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_tasks: {
        Row: {
          id: string
          user_id: string
          program_id: string | null
          title: string
          description: string | null
          phase: number
          week_number: number
          day_number: number
          status: 'pending' | 'in_progress' | 'completed' | 'stuck' | 'skipped'
          difficulty_level: number
          estimated_duration: number | null
          actual_duration: number | null
          started_at: string | null
          completed_at: string | null
          dopamine_score: number | null
          satisfaction_rating: number | null
          task_type: string
          tags: string[]
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          program_id?: string | null
          title: string
          description?: string | null
          phase?: number
          week_number?: number
          day_number?: number
          status?: 'pending' | 'in_progress' | 'completed' | 'stuck' | 'skipped'
          difficulty_level?: number
          estimated_duration?: number | null
          actual_duration?: number | null
          started_at?: string | null
          completed_at?: string | null
          dopamine_score?: number | null
          satisfaction_rating?: number | null
          task_type?: string
          tags?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          program_id?: string | null
          title?: string
          description?: string | null
          phase?: number
          week_number?: number
          day_number?: number
          status?: 'pending' | 'in_progress' | 'completed' | 'stuck' | 'skipped'
          difficulty_level?: number
          estimated_duration?: number | null
          actual_duration?: number | null
          started_at?: string | null
          completed_at?: string | null
          dopamine_score?: number | null
          satisfaction_rating?: number | null
          task_type?: string
          tags?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_protocols: {
        Row: {
          id: string
          user_id: string
          program_id: string | null
          name: string
          current_phase: number
          total_phases: number
          status: 'active' | 'paused' | 'completed' | 'cancelled'
          progress_percentage: number
          start_date: string
          target_completion_date: string | null
          actual_completion_date: string | null
          total_sessions: number
          successful_sessions: number
          average_session_duration: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          program_id?: string | null
          name: string
          current_phase?: number
          total_phases?: number
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          progress_percentage?: number
          start_date?: string
          target_completion_date?: string | null
          actual_completion_date?: string | null
          total_sessions?: number
          successful_sessions?: number
          average_session_duration?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          program_id?: string | null
          name?: string
          current_phase?: number
          total_phases?: number
          status?: 'active' | 'paused' | 'completed' | 'cancelled'
          progress_percentage?: number
          start_date?: string
          target_completion_date?: string | null
          actual_completion_date?: string | null
          total_sessions?: number
          successful_sessions?: number
          average_session_duration?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_rewards: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          points_required: number
          category: 'micro' | 'mini' | 'major'
          is_claimed: boolean
          claimed_at: string | null
          reward_type: string
          custom_reward: boolean
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          points_required: number
          category: 'micro' | 'mini' | 'major'
          is_claimed?: boolean
          claimed_at?: string | null
          reward_type?: string
          custom_reward?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          points_required?: number
          category?: 'micro' | 'mini' | 'major'
          is_claimed?: boolean
          claimed_at?: string | null
          reward_type?: string
          custom_reward?: boolean
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      panic_sessions: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          trigger_reason: string
          ai_analysis: string | null
          solution_options: string[]
          chosen_solution: string | null
          outcome: 'resolved' | 'modified' | 'pivoted' | 'abandoned' | null
          effectiveness_rating: number | null
          session_duration: number | null
          follow_up_needed: boolean
          notes: string | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          trigger_reason: string
          ai_analysis?: string | null
          solution_options?: string[]
          chosen_solution?: string | null
          outcome?: 'resolved' | 'modified' | 'pivoted' | 'abandoned' | null
          effectiveness_rating?: number | null
          session_duration?: number | null
          follow_up_needed?: boolean
          notes?: string | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          trigger_reason?: string
          ai_analysis?: string | null
          solution_options?: string[]
          chosen_solution?: string | null
          outcome?: 'resolved' | 'modified' | 'pivoted' | 'abandoned' | null
          effectiveness_rating?: number | null
          session_duration?: number | null
          follow_up_needed?: boolean
          notes?: string | null
          created_at?: string
          resolved_at?: string | null
        }
      }
      dopamine_tracking: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          event_type: 'task_start' | 'task_complete' | 'reward_claim' | 'milestone' | 'breakthrough'
          dopamine_level: number
          trigger_description: string | null
          mood_before: number | null
          mood_after: number | null
          energy_level: number | null
          time_of_day: string | null
          day_of_week: number | null
          work_environment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          event_type: 'task_start' | 'task_complete' | 'reward_claim' | 'milestone' | 'breakthrough'
          dopamine_level: number
          trigger_description?: string | null
          mood_before?: number | null
          mood_after?: number | null
          energy_level?: number | null
          time_of_day?: string | null
          day_of_week?: number | null
          work_environment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          event_type?: 'task_start' | 'task_complete' | 'reward_claim' | 'milestone' | 'breakthrough'
          dopamine_level?: number
          trigger_description?: string | null
          mood_before?: number | null
          mood_after?: number | null
          energy_level?: number | null
          time_of_day?: string | null
          day_of_week?: number | null
          work_environment?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Onboarding helper functions
export const saveOnboardingResponse = async (userId: string, data: any) => {
  const { data: response, error } = await supabase
    .from('onboarding_responses')
    .upsert({
      user_id: userId,
      ...data,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  return { data: response, error }
}

export const getOnboardingResponse = async (userId: string) => {
  const { data, error } = await supabase
    .from('onboarding_responses')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const createUserProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: userId,
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const createNeuralAssessment = async (userId: string, assessmentData: any) => {
  const { data, error } = await supabase
    .from('neural_assessments')
    .insert({
      user_id: userId,
      ...assessmentData
    })
    .select()
    .single()
  
  return { data, error }
}

export const trackDopamineEvent = async (userId: string, eventData: any) => {
  const { data, error } = await supabase
    .from('dopamine_tracking')
    .insert({
      user_id: userId,
      ...eventData
    })
    .select()
    .single()
  
  return { data, error }
}

// Additional helper functions for onboarding data management
export const updateOnboardingStage = async (userId: string, stage: number, stageData: any) => {
  const { data, error } = await supabase
    .from('onboarding_responses')
    .upsert({
      user_id: userId,
      current_stage: stage,
      ...stageData,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  return { data, error }
}

export const completeOnboarding = async (userId: string, finalData: any) => {
  const { data, error } = await supabase
    .from('onboarding_responses')
    .upsert({
      user_id: userId,
      ...finalData,
      completed_at: new Date().toISOString(),
      current_stage: 14,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  return { data, error }
}

export const getOnboardingProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('onboarding_responses')
    .select('current_stage, baseline_anxiety, procrastination_frequency, accomplishments, trigger_type, avoidance_pattern')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}