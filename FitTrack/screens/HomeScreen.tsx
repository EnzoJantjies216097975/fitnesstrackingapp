import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import WorkoutCard from '../components/';
import NutritionSummary from '../components/NutritionSummary';
import { fetchWorkouts } from '../redux/actions/workoutActions';
import { fetchMeals } from '../redux/actions/nutritionActions';
import { HomeStackParamList } from '../navigation/HomeNavigator';
import { RootState, Workout } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'HomeMain'
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.user);
  const { workouts, currentWorkout } = useSelector((state: RootState) => state.workouts);
  const { totalNutrients, dailyGoals } = useSelector((state: RootState) => state.nutrition);
  const { workoutStats, healthStats } = useSelector((state: RootState) => state.stats);
  
  useEffect(() => {
    dispatch(fetchWorkouts());
    dispatch(fetchMeals(new Date()));
  }, [dispatch]);
  
  const recentWorkouts = workouts.slice(0, 2);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  // Navigate to different screens based on tab
  const navigateToWorkouts = (screenName: string, params?: object) => {
    navigation.navigate('Workouts' as any, { 
      screen: screenName,
      params
    });
  };
  
  const navigateToNutrition = (screenName: string, params?: object) => {
    navigation.navigate('Nutrition' as any, { 
      screen: screenName,
      params
    });
  };
  
  const navigateToStatistics = (screenName: string, params?: object) => {
    navigation.navigate('Statistics' as any, { 
      screen: screenName,
      params
    });
  };
  
  const navigateToProfile = (screenName: string, params?: object) => {
    navigation.navigate('Profile' as any, { 
      screen: screenName,
      params
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{profile.name || 'User'}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => navigateToProfile('ProfileMain')}
        >
          <Ionicons name="person-circle" size={40} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color="#FF9800" />
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>
              {workoutStats.totalCaloriesBurned || 0}
            </Text>
            <Text style={styles.statLabel}>Calories Burned</Text>
          </View>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#2196F3" />
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>
              {Math.round((workoutStats.totalTime || 0) / 60)}
            </Text>
            <Text style={styles.statLabel}>Workout Min</Text>
          </View>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="footsteps" size={24} color="#4CAF50" />
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>
              {healthStats.averageSteps || 0}
            </Text>
            <Text style={styles.statLabel}>Avg Steps</Text>
          </View>
        </View>
      </View>
      
      {currentWorkout ? (
        <TouchableOpacity
          style={styles.currentWorkoutBanner}
          onPress={() => navigateToWorkouts('ActiveWorkout')}
        >
          <View style={styles.currentWorkoutInfo}>
            <Text style={styles.currentWorkoutTitle}>Active Workout</Text>
            <Text style={styles.currentWorkoutName}>{currentWorkout.workout?.name}</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.quickStartBanner}
          onPress={() => navigateToWorkouts('TabataTimer')}
        >
          <View style={styles.quickStartInfo}>
            <Text style={styles.quickStartTitle}>Quick Start</Text>
            <Text style={styles.quickStartSubtitle}>Tabata Timer</Text>
          </View>
          <Ionicons name="timer-outline" size={32} color="#fff" />
        </TouchableOpacity>
      )}
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Nutrition</Text>
        <TouchableOpacity
          onPress={() => navigateToNutrition('NutritionDashboard')}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <NutritionSummary
        totalNutrients={totalNutrients}
        dailyGoals={dailyGoals}
        onPress={() => navigateToNutrition('NutritionDashboard')}
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        <TouchableOpacity
          onPress={() => navigateToWorkouts('WorkoutsList')}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {recentWorkouts.length > 0 ? (
        recentWorkouts.map((workout: Workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={() => navigation.navigate('WorkoutDetail', { workoutId: workout.id })}
          />
        ))
      ) : (
        <View style={styles.emptyWorkoutsContainer}>
          <Ionicons name="barbell-outline" size={48} color="#E0E0E0" />
          <Text style={styles.emptyWorkoutsText}>No recent workouts</Text>
          <TouchableOpacity
            style={styles.createWorkoutButton}
            onPress={() => navigateToWorkouts('CreateWorkout')}
          >
            <Text style={styles.createWorkoutButtonText}>Create a Workout</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Smart Watch</Text>
        <TouchableOpacity
          onPress={() => navigateToStatistics('SmartWatch')}
        >
          <Text style={styles.seeAllText}>Connect</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.smartWatchCard}
        onPress={() => navigateToStatistics('SmartWatch')}
      >
        <View style={styles.smartWatchIconContainer}>
          <Ionicons name="watch-outline" size={40} color="#4CAF50" />
        </View>
        <View style={styles.smartWatchInfo}>
          <Text style={styles.smartWatchTitle}>Volkano Smart Watch</Text>
          <Text style={styles.smartWatchSubtitle}>Connect your watch to track heart rate and steps</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#757575" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  greeting: {
    fontSize: 16,
    color: '#757575',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileIcon: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    width: '31%',
  },
  statInfo: {
    marginLeft: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  currentWorkoutBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  currentWorkoutInfo: {
    flex: 1,
  },
  currentWorkoutTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  currentWorkoutName: {
    color: '#fff',
    fontSize: 18,
  },
  quickStartBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  quickStartInfo: {
    flex: 1,
  },
  quickStartTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickStartSubtitle: {
    color: '#fff',
    fontSize: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  emptyWorkoutsContainer: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  emptyWorkoutsText: {
    fontSize: 16,
    color: '#757575',
    marginVertical: 8,
  },
  createWorkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  createWorkoutButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  smartWatchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  smartWatchIconContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 8,
    marginRight: 16,
  },
  smartWatchInfo: {
    flex: 1,
  },
  smartWatchTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  smartWatchSubtitle: {
    fontSize: 12,
    color: '#757575',
  },
});

// Definition of the NutritionSummary component used in HomeScreen
// In a real app, this would be in its own file: src/components/NutritionSummary.tsx
interface NutritionSummaryProps {
  totalNutrients: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  dailyGoals: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  onPress: () => void;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ 
  totalNutrients, 
  dailyGoals, 
  onPress 
}) => {
  // Calculate percentage of calorie goal
  const caloriePercentage = Math.min(100, Math.round((totalNutrients.calories / dailyGoals.calories) * 100));
  
  return (
    <TouchableOpacity style={nutritionStyles.container} onPress={onPress}>
      <View style={nutritionStyles.calorieRow}>
        <View style={nutritionStyles.calorieInfo}>
          <Text style={nutritionStyles.calorieValue}>{Math.round(totalNutrients.calories)}</Text>
          <Text style={nutritionStyles.calorieLabel}>calories consumed</Text>
        </View>
        <View style={nutritionStyles.goalContainer}>
          <Text style={nutritionStyles.goalLabel}>Goal: {dailyGoals.calories}</Text>
          <View style={nutritionStyles.goalBar}>
            <View 
              style={[
                nutritionStyles.goalProgress, 
                { 
                  width: `${caloriePercentage}%`,
                  backgroundColor: caloriePercentage > 100 ? '#F44336' : '#4CAF50'
                }
              ]} 
            />
          </View>
          <Text style={nutritionStyles.goalPercentage}>{caloriePercentage}%</Text>
        </View>
      </View>
      
      <View style={nutritionStyles.macroContainer}>
        <View style={nutritionStyles.macroItem}>
          <Text style={nutritionStyles.macroValue}>{Math.round(totalNutrients.carbs)}g</Text>
          <View style={nutritionStyles.macroLabelContainer}>
            <View style={[nutritionStyles.macroIndicator, { backgroundColor: '#4CAF50' }]} />
            <Text style={nutritionStyles.macroLabel}>Carbs</Text>
          </View>
        </View>
        
        <View style={nutritionStyles.macroItem}>
          <Text style={nutritionStyles.macroValue}>{Math.round(totalNutrients.protein)}g</Text>
          <View style={nutritionStyles.macroLabelContainer}>
            <View style={[nutritionStyles.macroIndicator, { backgroundColor: '#2196F3' }]} />
            <Text style={nutritionStyles.macroLabel}>Protein</Text>
          </View>
        </View>
        
        <View style={nutritionStyles.macroItem}>
          <Text style={nutritionStyles.macroValue}>{Math.round(totalNutrients.fat)}g</Text>
          <View style={nutritionStyles.macroLabelContainer}>
            <View style={[nutritionStyles.macroIndicator, { backgroundColor: '#FF9800' }]} />
            <Text style={nutritionStyles.macroLabel}>Fat</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const nutritionStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calorieInfo: {
    flex: 1,
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calorieLabel: {
    fontSize: 12,
    color: '#757575',
  },
  goalContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  goalLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  goalBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgress: {
    height: '100%',
    borderRadius: 4,
  },
  goalPercentage: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  macroLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#757575',
  },
});

// Definition of the WorkoutCard component used in HomeScreen
// In a real app, this would be in its own file: src/components/WorkoutCard.tsx
interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress }) => {
  // Calculate total exercises
  const exerciseCount = workout.exercises.length;
  
  // Estimate time (assuming 3 minutes per exercise as a rough estimate)
  const estimatedTime = exerciseCount * 3;
  
  return (
    <TouchableOpacity style={workoutCardStyles.container} onPress={onPress}>
      <View style={workoutCardStyles.content}>
        <Text style={workoutCardStyles.name}>{workout.name}</Text>
        {workout.description && (
          <Text style={workoutCardStyles.description} numberOfLines={1}>
            {workout.description}
          </Text>
        )}
        
        <View style={workoutCardStyles.stats}>
          <View style={workoutCardStyles.stat}>
            <Ionicons name="barbell-outline" size={16} color="#757575" />
            <Text style={workoutCardStyles.statText}>{exerciseCount} exercises</Text>
          </View>
          
          <View style={workoutCardStyles.stat}>
            <Ionicons name="time-outline" size={16} color="#757575" />
            <Text style={workoutCardStyles.statText}>~{estimatedTime} min</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#757575" />
    </TouchableOpacity>
  );
};

const workoutCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
});

export default HomeScreen;