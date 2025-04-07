// Types for User
export interface UserProfile {
    id?: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    weight: number;
    height: number;
    activityLevel: 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'extremelyActive';
    goal?: 'lose' | 'maintain' | 'gain';
    photoUrl?: string;
  }
  
  export interface UserSettings {
    darkMode: boolean;
    notifications: boolean;
    units: 'metric' | 'imperial';
    language?: string;
  }
  
  export interface SmartWatchInfo {
    connected: boolean;
    deviceId: string | null;
    lastSyncTime: string | null;
    model?: string;
  }
  
  export interface UserState {
    profile: UserProfile;
    settings: UserSettings;
    smartWatch: SmartWatchInfo;
    isLoading: boolean;
    error: string | null;
  }
  
  // Types for Workouts
  export interface Exercise {
    id: string;
    name: string;
    muscleGroup: string;
    category: string;
    equipment: string;
    instructions: string;
  }
  
  export interface ExerciseSet {
    id: string;
    reps: number;
    weight: number;
    duration?: number; // In seconds, for timed exercises
    completed?: boolean;
  }
  
  export interface WorkoutExercise {
    id: string;
    exerciseId: string;
    name: string;
    sets: ExerciseSet[];
    notes?: string;
  }
  
  export interface Workout {
    id: string;
    name: string;
    description?: string;
    exercises: WorkoutExercise[];
    duration?: number; // In minutes
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface CompletedExercise {
    id: string;
    exerciseId: string;
    name: string;
    sets: ExerciseSet[];
    startTime: string;
    endTime: string;
  }
  
  export interface CompletedWorkout {
    id: string;
    workoutId: string;
    name: string;
    startTime: string;
    endTime: string;
    duration: number; // In minutes
    completedExercises: CompletedExercise[];
    caloriesBurned: number;
    avgHeartRate?: number;
    notes?: string;
  }
  
  export interface WorkoutState {
    workouts: Workout[];
    workoutHistory: CompletedWorkout[];
    currentWorkout: {
      workout: Workout | null;
      startTime: string | null;
      completedExercises: CompletedExercise[];
    } | null;
    isLoading: boolean;
    error: string | null;
  }
  
  // Types for Nutrition
  export interface Nutrient {
    cholesterol?: number;
    sodium?: number;
    potassium?: number;
    fiber?: number;
    sugar?: number;
    vitaminA?: number;
    vitaminC?: number;
    calcium?: number;
    iron?: number;
  }
  
  export interface FoodItem {
    id: string;
    name: string;
    servingSize: number;
    servingUnit: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    nutrients?: Nutrient;
    barcode?: string;
    brand?: string;
    isFavorite?: boolean;
  }
  
  export interface Meal {
    id: string;
    name: string;
    foods: FoodItem[];
    date: string;
    time?: string;
    notes?: string;
  }
  
  export interface NutritionGoals {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    sugar?: number;
    fiber?: number;
    sodium?: number;
  }
  
  export interface NutrientTotals {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    sugar?: number;
    fiber?: number;
    sodium?: number;
  }
  
  export interface DailyCalories {
    [date: string]: number;
  }
  
  export interface NutritionState {
    meals: Meal[];
    dailyGoals: NutritionGoals;
    totalNutrients: NutrientTotals;
    calorieData: DailyCalories;
    isLoading: boolean;
    error: string | null;
  }
  
  // Types for Statistics and Analytics
  export interface WorkoutStats {
    totalWorkouts: number;
    totalTime: number;
    totalCaloriesBurned: number;
    workoutsThisWeek: number;
    workoutsLastWeek: number;
    avgWorkoutDuration: number;
    mostFrequentExercise?: string;
  }
  
  export interface NutritionStats {
    averageCalories: number;
    averageCarbs: number;
    averageProtein: number;
    averageFat: number;
    goalReachedDays: number;
    calorieDeficitDays: number;
    calorieSurplusDays: number;
  }
  
  export interface HealthStats {
    averageHeartRate: number;
    averageSteps: number;
    stepsThisWeek: number;
    stepsLastWeek: number;
    bestStepDay?: string;
    totalDistance?: number;
  }
  
  export interface StatsState {
    workoutStats: WorkoutStats;
    nutritionStats: NutritionStats;
    healthStats: HealthStats;
    isLoading: boolean;
    error: string | null;
  }
  
  // Root State type
  export interface RootState {
    user: UserState;
    workouts: WorkoutState;
    nutrition: NutritionState;
    stats: StatsState;
  }
  
  // Navigation prop types
  export type RootStackParamList = {
    HomeStack: undefined;
    WorkoutsStack: undefined;
    NutritionStack: undefined;
    StatisticsStack: undefined;
    ProfileStack: undefined;
  };
  
  // Helper types
  export interface ChartData {
    labels: string[];
    data: number[];
  }
  
  export interface DateRange {
    startDate: Date;
    endDate: Date;
  }