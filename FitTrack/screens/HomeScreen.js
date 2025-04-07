import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import WorkoutCard from '../components/WorkoutCard';
import NutritionSummary from '../components/NutritionSummary';
import { fetchWorkouts } from '../redux/actions/workoutActions';
import { fetchMeals } from '../redux/actions/nutritionActions';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.user);
  const { workouts, currentWorkout } = useSelector(state => state.workouts);
  const { totalNutrients, dailyGoals } = useSelector(state => state.nutrition);
  const { workoutStats, healthStats } = useSelector(state => state.stats);
  
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
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{profile.name || 'User'}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileIcon}
          onPress={() => navigation.navigate('Profile')}
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
          onPress={() => navigation.navigate('Workouts', { screen: 'ActiveWorkout' })}
        >
          <View style={styles.currentWorkoutInfo}>
            <Text style={styles.currentWorkoutTitle}>Active Workout</Text>
            <Text style={styles.currentWorkoutName}>{currentWorkout.name}</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.quickStartBanner}
          onPress={() => navigation.navigate('Workouts', { screen: 'TabataTimer' })}
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
          onPress={() => navigation.navigate('Nutrition')}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <NutritionSummary
        totalNutrients={totalNutrients}
        dailyGoals={dailyGoals}
        onPress={() => navigation.navigate('Nutrition')}
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Workouts')}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {recentWorkouts.length > 0 ? (
        recentWorkouts.map(workout => (
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
            onPress={() => navigation.navigate('Workouts', { screen: 'CreateWorkout' })}
          >
            <Text style={styles.createWorkoutButtonText}>Create a Workout</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Smart Watch</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Statistics', { screen: 'SmartWatch' })}
        >
          <Text style={styles.seeAllText}>Connect</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.smartWatchCard}
        onPress={() => navigation.navigate('Statistics', { screen: 'SmartWatch' })}
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
    paddingTop: 48,
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

export default HomeScreen;