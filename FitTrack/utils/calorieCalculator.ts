/**
 * Calorie Calculator Utility
 * 
 * This file contains utility functions for calculating calories burned during workouts,
 * based on different methods (MET values, heart rate, etc.) and for calculating
 * basal metabolic rate (BMR) and total daily energy expenditure (TDEE).
 */

// Types
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'extremelyActive';
export type ExerciseIntensity = 'light' | 'moderate' | 'vigorous';
export type ExerciseType = 
  | 'running' | 'jogging' | 'walking' | 'cycling' | 'swimming' | 'rowing' | 'elliptical' | 'stairmaster'
  | 'weightTraining' | 'bodyweight'
  | 'yoga' | 'pilates' | 'zumba' | 'hiit'
  | 'default';

/**
 * Calculate calories burned during a workout based on:
 * - Exercise intensity (MET value)
 * - User's weight in kg
 * - Duration in minutes
 * 
 * Formula: Calories = MET * Weight (kg) * Duration (hours)
 */
export const calculateCaloriesBurned = (
  metValue: number, 
  weightKg: number, 
  durationMinutes: number
): number => {
  // Convert duration to hours
  const durationHours = durationMinutes / 60;
  
  // Calculate calories burned
  return metValue * weightKg * durationHours;
};

/**
 * Get MET (Metabolic Equivalent of Task) values for common exercises
 * Values from the Compendium of Physical Activities
 */
export const getExerciseMET = (
  exerciseType: ExerciseType, 
  intensity: ExerciseIntensity = 'moderate'
): number => {
  const metValues: Record<ExerciseType, Record<ExerciseIntensity, number>> = {
    // Cardio exercises
    running: { light: 7.0, moderate: 9.8, vigorous: 12.3 },
    jogging: { light: 4.5, moderate: 7.0, vigorous: 9.0 },
    walking: { light: 2.5, moderate: 3.5, vigorous: 4.5 },
    cycling: { light: 4.0, moderate: 6.8, vigorous: 10.0 },
    swimming: { light: 4.5, moderate: 6.0, vigorous: 9.8 },
    rowing: { light: 3.5, moderate: 7.0, vigorous: 8.5 },
    elliptical: { light: 4.0, moderate: 5.0, vigorous: 7.5 },
    stairmaster: { light: 4.0, moderate: 6.0, vigorous: 9.0 },
    
    // Weight training
    weightTraining: { light: 3.0, moderate: 5.0, vigorous: 6.0 },
    bodyweight: { light: 2.5, moderate: 3.8, vigorous: 8.0 },
    
    // Class-based workouts
    yoga: { light: 2.5, moderate: 3.0, vigorous: 4.0 },
    pilates: { light: 2.8, moderate: 3.5, vigorous: 4.5 },
    zumba: { light: 4.0, moderate: 6.0, vigorous: 7.5 },
    hiit: { light: 6.0, moderate: 8.0, vigorous: 10.0 },
    
    // Default for unknown exercises
    default: { light: 3.0, moderate: 4.0, vigorous: 6.0 }
  };
  
  // Return the MET value for the requested exercise and intensity
  return (metValues[exerciseType] && metValues[exerciseType][intensity]) || metValues.default[intensity];
};

/**
 * Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation
 * BMR is the number of calories your body needs at rest
 * 
 * @param weight Weight in kg
 * @param height Height in cm
 * @param age Age in years
 * @param gender 'male' or 'female'
 * @returns BMR in calories per day
 */
export const calculateBMR = (
  weight: number, 
  height: number, 
  age: number, 
  gender: Gender
): number => {
  // Weight in kg, height in cm, age in years
  if (gender.toLowerCase() === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * TDEE is the total number of calories burned in a day including activity
 * 
 * @param bmr Basal Metabolic Rate
 * @param activityLevel Activity level factor
 * @returns TDEE in calories per day
 */
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2, // Little or no exercise
    lightlyActive: 1.375, // Light exercise 1-3 days a week
    moderatelyActive: 1.55, // Moderate exercise 3-5 days a week
    veryActive: 1.725, // Hard exercise 6-7 days a week
    extremelyActive: 1.9 // Very hard exercise & physical job or training twice a day
  };
  
  return bmr * (activityMultipliers[activityLevel] || activityMultipliers.moderatelyActive);
};

/**
 * Calculate calories burned during a Tabata workout
 * Tabata is typically very high intensity
 * 
 * @param weightKg User's weight in kg
 * @param totalMinutes Total workout duration in minutes
 * @param restRatio Proportion of workout spent resting (0.0 to 1.0)
 * @returns Calories burned
 */
export const calculateTabataCalories = (
  weightKg: number, 
  totalMinutes: number, 
  restRatio: number
): number => {
  // Tabata is typically very high intensity (MET ~10-15)
  // restRatio is the proportion of the workout spent resting (0.0 to 1.0)
  
  // Calculate effective MET value considering rest periods
  const activeMET = 14; // High intensity intervals
  const restMET = 2.5; // Rest periods
  
  const effectiveMET = (activeMET * (1 - restRatio)) + (restMET * restRatio);
  
  // Calculate calories
  return calculateCaloriesBurned(effectiveMET, weightKg, totalMinutes);
};

/**
 * Estimate calories burned from heart rate data
 * Using the formula: Calories/min = ((-55.0969 + (0.6309 × HR) + (0.1988 × W) + (0.2017 × A))/4.184) × T
 * Where HR = Heart Rate, W = Weight in kg, A = Age, T = Time in minutes
 * 
 * @param heartRate Average heart rate in BPM
 * @param weightKg Weight in kg
 * @param age Age in years
 * @param gender Gender (male or female)
 * @param minutes Duration in minutes
 * @returns Calories burned
 */
export const calculateCaloriesFromHeartRate = (
  heartRate: number, 
  weightKg: number, 
  age: number, 
  gender: Gender, 
  minutes: number
): number => {
  // Gender coefficient adjustment
  const genderCoef = gender.toLowerCase() === 'male' ? 1 : 0.85;
  
  // Calculate calories per minute
  const caloriesPerMinute = ((-55.0969 + (0.6309 * heartRate) + (0.1988 * weightKg) + (0.2017 * age)) / 4.184) * genderCoef;
  
  // Return total calories for the duration
  return Math.max(0, caloriesPerMinute * minutes);
};

/**
 * Map exercise names to exercise types for MET-based calculations
 * 
 * @param exerciseName Name of the exercise
 * @returns The corresponding exercise type
 */
export const mapExerciseToType = (exerciseName: string): ExerciseType => {
  const name = exerciseName.toLowerCase();
  
  if (name.includes('run') || name.includes('sprint')) {
    return 'running';
  } else if (name.includes('jog')) {
    return 'jogging';
  } else if (name.includes('walk')) {
    return 'walking';
  } else if (name.includes('cycle') || name.includes('bike')) {
    return 'cycling';
  } else if (name.includes('swim')) {
    return 'swimming';
  } else if (name.includes('row')) {
    return 'rowing';
  } else if (name.includes('elliptical')) {
    return 'elliptical';
  } else if (name.includes('stair')) {
    return 'stairmaster';
  } else if (name.includes('yoga')) {
    return 'yoga';
  } else if (name.includes('pilates')) {
    return 'pilates';
  } else if (name.includes('zumba')) {
    return 'zumba';
  } else if (name.includes('hiit') || name.includes('interval')) {
    return 'hiit';
  } else if (
    name.includes('weight') || 
    name.includes('bench') || 
    name.includes('squat') || 
    name.includes('deadlift') || 
    name.includes('press') ||
    name.includes('curl') ||
    name.includes('extension')
  ) {
    return 'weightTraining';
  } else if (
    name.includes('push up') || 
    name.includes('pull up') || 
    name.includes('bodyweight') ||
    name.includes('plank') ||
    name.includes('burpee') ||
    name.includes('body weight')
  ) {
    return 'bodyweight';
  }
  
  // Default to weight training if no match
  return 'weightTraining';
};

/**
 * Calculate calories needed for weight management goal
 * 
 * @param tdee Total Daily Energy Expenditure
 * @param goal Weight management goal
 * @returns Adjusted calorie target
 */
export const calculateCaloriesForGoal = (
  tdee: number, 
  goal: 'lose' | 'maintain' | 'gain'
): number => {
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500); // 500 calorie deficit for weight loss
    case 'gain':
      return Math.round(tdee + 500); // 500 calorie surplus for weight gain
    case 'maintain':
    default:
      return Math.round(tdee);
  }
};

/**
 * Calculate macronutrient targets based on calorie goal
 * Uses a standard distribution of macronutrients
 * 
 * @param calories Total calorie goal
 * @param distribution Desired macronutrient distribution (percentages)
 * @returns Macronutrient targets in grams
 */
export const calculateMacroTargets = (
  calories: number,
  distribution: { carbs: number; protein: number; fat: number } = { carbs: 40, protein: 30, fat: 30 }
): { carbs: number; protein: number; fat: number } => {
  // Ensure distribution adds up to 100%
  const total = distribution.carbs + distribution.protein + distribution.fat;
  const normalizedDistribution = {
    carbs: distribution.carbs / total * 100,
    protein: distribution.protein / total * 100,
    fat: distribution.fat / total * 100
  };
  
  // Calculate grams based on calorie allocation
  // Carbs: 4 calories per gram
  // Protein: 4 calories per gram
  // Fat: 9 calories per gram
  return {
    carbs: Math.round((calories * normalizedDistribution.carbs / 100) / 4),
    protein: Math.round((calories * normalizedDistribution.protein / 100) / 4),
    fat: Math.round((calories * normalizedDistribution.fat / 100) / 9)
  };
};