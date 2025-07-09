import { supabase, saveOnboardingResponse, createUserProfile, createNeuralAssessment } from '../lib/supabase';
import { OnboardingData, NeuralProfile, PersonalizedProgram } from '../types';

export class OnboardingService {
  
  // Save onboarding progress as user goes through the flow
  static async saveProgress(userId: string, stage: number, data: Partial<OnboardingData>) {
    try {
      // Convert camelCase to snake_case for database
      const dbData = {
        baseline_anxiety: data.baselineAnxiety,
        procrastination_frequency: data.procrastinationFrequency,
        dopamine_response: data.dopamineResponse,
        accomplishments: data.accomplishments,
        trigger_type: data.triggerType,
        avoidance_pattern: data.avoidancePattern,
        work_environment: data.workEnvironment,
        motivation_style: data.motivationStyle,
        reward_preferences: data.rewardPreferences,
        session_length: data.sessionLength,
        biggest_project: data.biggestProject,
        current_frustration: data.currentFrustration,
        biggest_success: data.biggestSuccess,
        success_factors: data.successFactors,
        first_action: data.firstAction,
        second_action: data.secondAction,
        third_action: data.thirdAction,
        completion_attempted: data.completionAttempted,
        resistance_level: data.resistanceLevel,
        selected_program: data.selectedProgram,
        conversion_path: data.conversionPath,
        current_stage: stage,
        updated_at: new Date().toISOString()
      };

      const { data: response, error } = await saveOnboardingResponse(userId, dbData);
      
      if (error) throw error;
      return response;
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
      throw error;
    }
  }

  // Complete the full onboarding process
  static async completeOnboarding(userId: string, onboardingData: OnboardingData) {
    try {
      // Convert camelCase to snake_case for database
      const dbData = {
        baseline_anxiety: onboardingData.baselineAnxiety,
        procrastination_frequency: onboardingData.procrastinationFrequency,
        dopamine_response: onboardingData.dopamineResponse,
        accomplishments: onboardingData.accomplishments,
        trigger_type: onboardingData.triggerType,
        avoidance_pattern: onboardingData.avoidancePattern,
        work_environment: onboardingData.workEnvironment,
        motivation_style: onboardingData.motivationStyle,
        reward_preferences: onboardingData.rewardPreferences,
        session_length: onboardingData.sessionLength,
        biggest_project: onboardingData.biggestProject,
        current_frustration: onboardingData.currentFrustration,
        biggest_success: onboardingData.biggestSuccess,
        success_factors: onboardingData.successFactors,
        first_action: onboardingData.firstAction,
        second_action: onboardingData.secondAction,
        third_action: onboardingData.thirdAction,
        completion_attempted: onboardingData.completionAttempted,
        resistance_level: onboardingData.resistanceLevel,
        selected_program: onboardingData.selectedProgram,
        conversion_path: onboardingData.conversionPath,
        completed_at: new Date().toISOString(),
        current_stage: 14
      };

      // 1. Save complete onboarding response
      const { data: onboardingResponse, error: onboardingError } = await saveOnboardingResponse(userId, dbData);

      if (onboardingError) throw onboardingError;

      // 2. Generate neural profile
      const neuralProfile = this.generateNeuralProfile(onboardingData);
      
      // 3. Save neural assessment
      const { data: assessment, error: assessmentError } = await createNeuralAssessment(userId, {
        onboarding_response_id: onboardingResponse.id,
        ...neuralProfile
      });

      if (assessmentError) throw assessmentError;

      // 4. Create user profile with onboarding completed flag
      const userProfileData = this.generateUserProfile(onboardingData, neuralProfile);
      const { data: profile, error: profileError } = await createUserProfile(userId, {
        ...userProfileData,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      });

      if (profileError) throw profileError;

      // 5. Generate personalized program
      const personalizedProgram = this.generatePersonalizedProgram(onboardingData, neuralProfile);
      
      // 6. Create initial rewards
      await this.createInitialRewards(userId, neuralProfile);

      return {
        onboardingResponse,
        neuralProfile: assessment,
        userProfile: profile,
        personalizedProgram
      };

    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }

  // Generate neural profile from onboarding data
  static generateNeuralProfile(data: OnboardingData): Omit<NeuralProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
    // Analyze procrastination type
    const primaryType = this.determinePrimaryType(data);
    
    // Determine procrastination level
    const procrastinationLevel = this.determineProcrastinationLevel(data);
    
    // Determine dopamine sensitivity
    const dopamineSensitivity = this.determineDopamineSensitivity(data);
    
    // Determine complexity tolerance
    const complexityTolerance = this.determineComplexityTolerance(data);
    
    // Determine motivation sustainability
    const motivationSustainability = this.determineMotivationSustainability(data);
    
    // Calculate success probability
    const successProbability = this.calculateSuccessProbability(data);
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(data);

    return {
      primary_type: primaryType,
      trigger_type: data.triggerType || 'unknown',
      avoidance_pattern: data.avoidancePattern || 'unknown',
      motivation_style: data.motivationStyle || 'unknown',
      reward_preferences: Object.keys(data.rewardPreferences || {}).filter(key => 
        data.rewardPreferences[key] >= 4
      ),
      optimal_session_length: data.sessionLength || '30-45 minutes',
      procrastination_level: procrastinationLevel,
      dopamine_sensitivity: dopamineSensitivity,
      complexity_tolerance: complexityTolerance,
      motivation_sustainability: motivationSustainability,
      risk_factors: riskFactors,
      success_probability: successProbability
    };
  }

  // Generate user profile data
  static generateUserProfile(data: OnboardingData, neuralProfile: any) {
    const workDuration = this.getOptimalWorkDuration(data.sessionLength);
    const breakDuration = this.getOptimalBreakDuration(workDuration);
    const peakHours = this.determinePeakHours(neuralProfile);

    return {
      total_points: 100, // Starting points
      current_streak: 0,
      longest_streak: 0,
      tasks_completed: 0,
      protocols_completed: 0,
      preferred_work_duration: workDuration,
      preferred_break_duration: breakDuration,
      peak_productivity_hours: peakHours
    };
  }

  // Generate personalized program
  static generatePersonalizedProgram(data: OnboardingData, neuralProfile: any): PersonalizedProgram {
    const week1Tasks = this.generateWeek1Tasks(data, neuralProfile);
    const week2Tasks = this.generateWeek2Tasks(data, neuralProfile);
    const week3Tasks = this.generateWeek3Tasks(data, neuralProfile);
    const expectedOutcomes = this.generateExpectedOutcomes(neuralProfile);

    return {
      week1Tasks,
      week2Tasks,
      week3Tasks,
      expectedOutcomes,
      riskFactors: neuralProfile.risk_factors,
      successProbability: neuralProfile.success_probability
    };
  }

  // Create initial rewards based on user preferences
  static async createInitialRewards(userId: string, neuralProfile: any) {
    const rewards = [
      {
        user_id: userId,
        title: '15-Minute Break',
        description: 'Guilt-free break time with your favorite activity',
        points_required: 100,
        category: 'micro' as const,
        reward_type: 'time_based'
      },
      {
        user_id: userId,
        title: 'Favorite Snack',
        description: 'Treat yourself to that special snack you love',
        points_required: 250,
        category: 'micro' as const,
        reward_type: 'consumable'
      },
      {
        user_id: userId,
        title: 'Coffee Shop Session',
        description: 'Work from your favorite coffee shop for a session',
        points_required: 500,
        category: 'mini' as const,
        reward_type: 'experience'
      },
      {
        user_id: userId,
        title: 'Movie Night',
        description: 'Watch that movie you\'ve been wanting to see',
        points_required: 750,
        category: 'mini' as const,
        reward_type: 'entertainment'
      },
      {
        user_id: userId,
        title: 'Weekend Adventure',
        description: 'Plan a special weekend activity or trip',
        points_required: 2000,
        category: 'major' as const,
        reward_type: 'experience'
      }
    ];

    try {
      const { data, error } = await supabase
        .from('user_rewards')
        .insert(rewards);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating initial rewards:', error);
      throw error;
    }
  }

  // Helper methods for analysis
  private static determinePrimaryType(data: OnboardingData): string {
    if (data.triggerType?.includes('complex')) return 'Complexity Overwhelm';
    if (data.triggerType?.includes('perfect')) return 'Perfectionism Paralysis';
    if (data.triggerType?.includes('unclear')) return 'Decision Fatigue';
    if (data.triggerType?.includes('boring')) return 'Motivation Deficit';
    return 'General Procrastination';
  }

  private static determineProcrastinationLevel(data: OnboardingData): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (data.procrastinationFrequency?.includes('lost count')) return 'HIGH';
    if (data.procrastinationFrequency?.includes('11-30')) return 'HIGH';
    if (data.procrastinationFrequency?.includes('4-10')) return 'MEDIUM';
    if (data.procrastinationFrequency?.includes('1-3')) return 'LOW';
    return 'MEDIUM';
  }

  private static determineDopamineSensitivity(data: OnboardingData): 'RESPONSIVE' | 'MODERATE' | 'RESISTANT' {
    if (data.dopamineResponse >= 8) return 'RESPONSIVE';
    if (data.dopamineResponse >= 5) return 'MODERATE';
    return 'RESISTANT';
  }

  private static determineComplexityTolerance(data: OnboardingData): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (data.baselineAnxiety >= 8) return 'LOW';
    if (data.baselineAnxiety >= 5) return 'MEDIUM';
    return 'HIGH';
  }

  private static determineMotivationSustainability(data: OnboardingData): 'SPRINT' | 'STEADY' | 'MARATHON' {
    if (data.sessionLength?.includes('15-25')) return 'SPRINT';
    if (data.sessionLength?.includes('3+')) return 'MARATHON';
    return 'STEADY';
  }

  private static calculateSuccessProbability(data: OnboardingData): number {
    let probability = 50; // Base probability

    // Positive factors
    if (data.completionAttempted) probability += 20;
    if (data.dopamineResponse >= 7) probability += 15;
    if (data.baselineAnxiety <= 5) probability += 10;
    if (data.accomplishments.length >= 3) probability += 10;

    // Negative factors
    if (data.procrastinationFrequency?.includes('lost count')) probability -= 20;
    if (data.baselineAnxiety >= 8) probability -= 15;
    if (data.resistanceLevel >= 8) probability -= 10;

    return Math.max(10, Math.min(95, probability));
  }

  private static identifyRiskFactors(data: OnboardingData): string[] {
    const risks: string[] = [];

    if (data.baselineAnxiety >= 8) risks.push('High baseline anxiety');
    if (data.procrastinationFrequency?.includes('lost count')) risks.push('Chronic procrastination pattern');
    if (data.resistanceLevel >= 8) risks.push('High resistance to change');
    if (!data.completionAttempted) risks.push('Low task completion motivation');
    if (data.triggerType?.includes('perfect')) risks.push('Perfectionism paralysis');

    return risks;
  }

  private static getOptimalWorkDuration(sessionLength: string): number {
    if (sessionLength?.includes('15-25')) return 25;
    if (sessionLength?.includes('30-45')) return 45;
    if (sessionLength?.includes('1-2')) return 90;
    if (sessionLength?.includes('3+')) return 180;
    return 45; // Default
  }

  private static getOptimalBreakDuration(workDuration: number): number {
    if (workDuration <= 25) return 5;
    if (workDuration <= 45) return 15;
    if (workDuration <= 90) return 20;
    return 30;
  }

  private static determinePeakHours(neuralProfile: any): string[] {
    // Default peak hours - could be customized based on user data
    return ['09:00', '10:00', '11:00', '14:00', '15:00'];
  }

  private static generateWeek1Tasks(data: OnboardingData, neuralProfile: any): string[] {
    return [
      'Complete 3-minute micro-task to build momentum',
      'Break down your main project into 5 micro-actions',
      'Practice the 2-minute rule with daily tasks',
      'Set up your optimal work environment',
      'Complete first micro-action from your project breakdown',
      'Track your dopamine response to task completion',
      'Establish your daily productivity ritual'
    ];
  }

  private static generateWeek2Tasks(data: OnboardingData, neuralProfile: any): string[] {
    return [
      'Implement your personalized focus protocol',
      'Complete 3 micro-actions from your main project',
      'Practice procrastination interruption techniques',
      'Optimize your reward timing for maximum dopamine',
      'Handle your first resistance moment using AI coaching',
      'Build your task completion celebration ritual',
      'Establish sustainable momentum patterns'
    ];
  }

  private static generateWeek3Tasks(data: OnboardingData, neuralProfile: any): string[] {
    return [
      'Complete major milestone in your main project',
      'Master complex task breakdown independently',
      'Implement advanced focus and flow techniques',
      'Create your long-term productivity system',
      'Handle multiple projects using neural switching',
      'Establish relapse prevention protocols',
      'Graduate to self-directed neural management'
    ];
  }

  private static generateExpectedOutcomes(neuralProfile: any): string[] {
    return [
      '70-85% reduction in project initiation delay',
      `Sustained focus sessions of ${neuralProfile.optimal_session_length}+`,
      'Completion of primary project within 21 days',
      'Transferable system for future projects',
      'Measurable dopamine response optimization',
      'Reduced procrastination anxiety by 60%+',
      'Established neural pathway automation'
    ];
  }
}