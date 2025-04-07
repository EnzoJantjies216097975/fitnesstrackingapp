// src/screens/NutritionDashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchMeals } from '../redux/actions/nutritionActions';
import { fetchWorkoutHistory } from '../redux/actions/workoutActions';
import CalorieTargetCard from '../components/CalorieTargetCard';
import NutrientProgressBar from '../components/NutrientProgressBar';
import DatePicker from '../components/DatePicker';
import { NutritionStackParamList } from '../navigation/NutritionNavigator';
import { Meal, RootState } from '../types';

type NutritionDashboardScreenNavigationProp = StackNavigationProp<
  NutritionStackParamList,
  'NutritionDashboard'
>;

interface NutritionDashboardScreenProps {
  navigation: NutritionDashboardScreenNavigationProp;
}

const NutritionDashboardScreen: React.FC<NutritionDashboardScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { meals, totalNutrients, dailyGoals } = useSelector((state: RootState) => state.nutrition);
  const { workoutHistory } = useSelector((state: RootState) => state.workouts);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [caloriesBurned, setCaloriesBurned] = useState<number>(0);
  
  useEffect(() => {
    dispatch(fetchMeals(selectedDate));
    dispatch(fetchWorkoutHistory());
  }, [dispatch, selectedDate]);
  
  // Calculate calories burned on the selected date
  useEffect(() => {
    // Filter workouts for the selected date
    const workoutsOnDate = workoutHistory.filter(workout => {
      const workoutDate = new Date(workout.endTime);
      return (
        workoutDate.getFullYear() === selectedDate.getFullYear() &&
        workoutDate.getMonth() === selectedDate.getMonth() &&
        workoutDate.getDate() === selectedDate.getDate()
      );
    });
    
    // Sum up calories burned
    const totalBurned = workoutsOnDate.reduce((sum, workout) => 
      sum + (workout.caloriesBurned || 0), 0);
    
    setCaloriesBurned(totalBurned);
  }, [workoutHistory, selectedDate]);
  
  const renderMealSummary = ({ item }: { item: Meal }) => {
    // Calculate total calories for this meal
    const mealCalories = item.foods.reduce((sum, food) => sum + food.calories, 0);
    
    return (
      <TouchableOpacity 
        style={styles.mealSummaryCard}
        onPress={() => navigation.navigate('EditMeal', { mealId: item.id })}
      >
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.mealTime}>
            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <Text style={styles.mealCalories}>{Math.round(mealCalories)} cal</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Calorie Tracker</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <DatePicker
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      
      <View style={styles.content}>
        <CalorieTargetCard
          caloriesConsumed={totalNutrients.calories}
          calorieTarget={dailyGoals.calories}
          caloriesBurned={caloriesBurned}
        />
        
        <TouchableOpacity
          style={styles.calorieBalanceButton}
          onPress={() => navigation.navigate('CalorieBalance')}
        >
          <View style={styles.calorieBalanceContent}>
            <Ionicons name="stats-chart" size={24} color="#4CAF50" />
            <View style={styles.calorieBalanceTextContainer}>
              <Text style={styles.calorieBalanceTitle}>Detailed Calorie Analysis</Text>
              <Text style={styles.calorieBalanceSubtitle}>
                View your calorie balance over time
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#757575" />
        </TouchableOpacity>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NutritionSettings')}>
            <Text style={styles.editGoalsText}>Edit Goals</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.macroContainer}>
          <NutrientProgressBar
            label="Carbs"
            current={totalNutrients.carbs}
            goal={dailyGoals.carbs}
            unit="g"
            color="#4CAF50"
          />
          
          <NutrientProgressBar
            label="Protein"
            current={totalNutrients.protein}
            goal={dailyGoals.protein}
            unit="g"
            color="#4CAF50"
          />
          
          <NutrientProgressBar
            label="Protein"
            current={totalNutrients.protein}
            goal={dailyGoals.protein}
            unit="g"
            color="#2196F3"
          />
          
          <NutrientProgressBar
            label="Fat"
            current={totalNutrients.fat}
            goal={dailyGoals.fat}
            unit="g"
            color="#FF9800"
          />
        </View>
        
        <View style={styles.calorieDetailsCard}>
          <View style={styles.calorieDetailsHeader}>
            <Text style={styles.calorieDetailsTitle}>Calorie Breakdown</Text>
          </View>
          
          <View style={styles.calorieDetailsRow}>
            <Text style={styles.calorieDetailsLabel}>Food Intake</Text>
            <Text style={styles.calorieDetailsValue}>
              {Math.round(totalNutrients.calories)} cal
            </Text>
          </View>
          
          <View style={styles.calorieDetailsRow}>
            <Text style={styles.calorieDetailsLabel}>Workouts</Text>
            <Text style={[styles.calorieDetailsValue, { color: '#4CAF50' }]}>
              -{Math.round(caloriesBurned)} cal
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.calorieDetailsRow}>
            <Text style={styles.calorieDetailsLabelBold}>Net</Text>
            <Text style={styles.calorieDetailsValueBold}>
              {Math.round(totalNutrients.calories - caloriesBurned)} cal
            </Text>
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NutritionMain')}>
            <Text style={styles.addMealText}>
              <Ionicons name="add-circle-outline" size={16} color="#4CAF50" />
              {' Add Meal'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {meals.length > 0 ? (
          <FlatList
            data={meals}
            renderItem={renderMealSummary}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyMealsContainer}>
            <Ionicons name="restaurant-outline" size={48} color="#E0E0E0" />
            <Text style={styles.emptyMealsText}>No meals recorded</Text>
            <Text style={styles.emptyMealsSubText}>
              Tap "Add Meal" to start tracking your food intake
            </Text>
          </View>
        )}
        
        <View style={styles.workoutCaloriesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workouts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
              <Text style={styles.viewWorkoutsText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {caloriesBurned > 0 ? (
            <View style={styles.workoutCaloriesCard}>
              <View style={styles.workoutCaloriesHeader}>
                <Ionicons name="flame-outline" size={24} color="#FF9800" />
                <Text style={styles.workoutCaloriesTitle}>Calories Burned</Text>
              </View>
              
              <Text style={styles.workoutCaloriesValue}>{Math.round(caloriesBurned)}</Text>
              
              <TouchableOpacity 
                style={styles.viewWorkoutsButton}
                onPress={() => navigation.navigate('Statistics', { screen: 'WorkoutHistory' })}
              >
                <Text style={styles.viewWorkoutsButtonText}>View Workouts</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noWorkoutsContainer}>
              <Ionicons name="barbell-outline" size={48} color="#E0E0E0" />
              <Text style={styles.noWorkoutsText}>No workout activity</Text>
              <TouchableOpacity
                style={styles.startWorkoutButton}
                onPress={() => navigation.navigate('Workouts')}
              >
                <Text style={styles.startWorkoutButtonText}>Start a Workout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editGoalsText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  addMealText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  viewWorkoutsText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  macroContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  calorieDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  calorieDetailsHeader: {
    marginBottom: 12,
  },
  calorieDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  calorieDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calorieDetailsLabel: {
    fontSize: 14,
    color: '#757575',
  },
  calorieDetailsValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  calorieDetailsLabelBold: {
    fontSize: 16,
    fontWeight: '600',
  },
  calorieDetailsValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  mealSummaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
  },
  mealTime: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyMealsContainer: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  },
  emptyMealsText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  emptyMealsSubText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 4,
  },
  workoutCaloriesContainer: {
    marginTop: 8,
  },
  workoutCaloriesCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  workoutCaloriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutCaloriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 8,
  },
  workoutCaloriesValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  viewWorkoutsButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  viewWorkoutsButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  noWorkoutsContainer: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 24,
  },
  noWorkoutsText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 8,
  },
  startWorkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  startWorkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calorieBalanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  calorieBalanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  calorieBalanceTextContainer: {
    marginLeft: 12,
  },
  calorieBalanceTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  calorieBalanceSubtitle: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
});

export default NutritionDashboardScreen;