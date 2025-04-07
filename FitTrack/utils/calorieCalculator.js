export const calculateCaloriesBurned = (metValue, weightKg, durationMinutes) => {
    // Convert duration to hours
    const durationHours = durationMinutes / 60;
    
    // Calculate calories burned
    return metValue * weightKg * durationHours;
  };
  
  /**
   * Get MET (Metabolic Equivalent of Task) values for common exercises
   * Values from the Compendium of Physical Activities
   */
  export const getExerciseMET = (exerciseType, intensity = 'moderate') => {
    const metValues = {
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
   */
  export const calculateBMR = (weight, height, age, gender) => {
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
   */
  export const calculateTDEE = (bmr, activityLevel) => {
    const activityMultipliers = {
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
   */
  export const calculateTabataCalories = (weightKg, totalMinutes, restRatio) => {
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
   */
  export const calculateCaloriesFromHeartRate = (heartRate, weightKg, age, gender, minutes) => {
    // Gender coefficient adjustment
    const genderCoef = gender.toLowerCase() === 'male' ? 1 : 0.85;
    
    // Calculate calories per minute
    const caloriesPerMinute = ((-55.0969 + (0.6309 * heartRate) + (0.1988 * weightKg) + (0.2017 * age)) / 4.184) * genderCoef;
    
    // Return total calories for the duration
    return Math.max(0, caloriesPerMinute * minutes);
  };