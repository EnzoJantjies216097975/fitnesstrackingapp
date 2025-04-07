import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchMeals } from '../redux/actions/nutritionActions';
import { fetchWorkoutHistory } from '../redux/actions/workoutActions';
import WeeklyCalorieChart from '../components/WeeklyCalorieChart';
import DateRangePicker from '../components/DateRangePicker';
import { NutritionStackParamList } from '../navigation/NutritionNavigator';
import { RootState, ChartData } from '../types';

type CalorieBalanceScreenNavigationProp = StackNavigationProp<
  NutritionStackParamList,
  'CalorieBalance'
>;

interface CalorieBalanceScreenProps {
  navigation: CalorieBalanceScreenNavigationProp;
}

const CalorieBalanceScreen: React.FC<CalorieBalanceScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.user);
  const { workoutHistory } = useSelector((state: RootState) => state.workouts);
  const { dailyGoals } = useSelector((state: RootState) => state.nutrition);
  
  // Start date is one week ago, end date is today
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
  
  const [startDate, setStartDate] = useState<Date>(oneWeekAgo);
  const [endDate, setEndDate] = useState<Date>(now);
  
  useEffect(() => {
    dispatch(fetchWorkoutHistory());
    
    // Fetch meals for each day in the date range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dispatch(fetchMeals(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }, [dispatch, startDate, endDate]);
  
  // Generate dates between start and end
  const generateDateRange = () => {
    const dates: Date[] = [];
    const labels: string[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      labels.push(currentDate.toLocaleDateString('en-US', { weekday: 'short' }));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return { dates, labels };
  };
  
  const { dates, labels } = generateDateRange();
  
  // Get workout calorie data
  const getWorkoutCalorieData = (): ChartData => {
    const calorieData = Array(dates.length).fill(0);
    
    workoutHistory.forEach(workout => {
      const workoutDate = new Date(workout.endTime);
      
      // Check if workout date is within range
      for (let i = 0; i < dates.length; i++) {
        if (
          workoutDate.getFullYear() === dates[i].getFullYear() &&
          workoutDate.getMonth() === dates[i].getMonth() &&
          workoutDate.getDate() === dates[i].getDate()
        ) {
          calorieData[i] += (workout.caloriesBurned || 0);
          break;
        }
      }
    });
    
    return { labels, data: calorieData };
  };
  
  // Get nutrition calorie data
  const getFoodCalorieData = (): ChartData => {
    // This would typically come from Redux state with all meal data
    // For now, we'll generate example data
    const calorieData = Array(dates.length).fill(0);
    
    // Fill with random data between 1500-2500 for demonstration
    // In a real app, this would come from your nutrition tracking
    for (let i = 0; i < calorieData.length; i++) {
      calorieData[i] = Math.floor(Math.random() * 1000) + 1500;
    }
    
    return { labels, data: calorieData };
  };
  
  // Get net calorie data (food intake - workout)
  const getNetCalorieData = (): ChartData => {
    const foodData = getFoodCalorieData().data;
    const workoutData = getWorkoutCalorieData().data;
    
    const netData = foodData.map((food, index) => food - workoutData[index]);
    
    return { labels, data: netData };
  };
  
  const workoutCalorieData = getWorkoutCalorieData();
  const foodCalorieData = getFoodCalorieData();
  const netCalorieData = getNetCalorieData();
  
  // Calculate period totals
  const totalFoodCalories = foodCalorieData.data.reduce((sum, cal) => sum + cal, 0);
  const totalWorkoutCalories = workoutCalorieData.data.reduce((sum, cal) => sum + cal, 0);
  const totalNetCalories = totalFoodCalories - totalWorkoutCalories;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Calorie Balance</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Period Summary</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemValue}>{Math.round(totalFoodCalories)}</Text>
              <Text style={styles.summaryItemLabel}>Calories In</Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemValue}>{Math.round(totalWorkoutCalories)}</Text>
              <Text style={styles.summaryItemLabel}>Calories Out</Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryItem}>
              <Text style={[
                styles.summaryItemValue,
                { color: totalNetCalories > 0 ? '#F44336' : '#4CAF50' }
              ]}>
                {totalNetCalories > 0 ? '+' : ''}{Math.round(totalNetCalories)}
              </Text>
              <Text style={styles.summaryItemLabel}>Net</Text>
            </View>
          </View>
          
          <View style={styles.goalContainer}>
            <Text style={styles.goalLabel}>
              {totalNetCalories > 0 ? 'Calorie Surplus:' : 'Calorie Deficit:'}
            </Text>
            <Text style={[
              styles.goalValue,
              { color: totalNetCalories > 0 ? '#F44336' : '#4CAF50' }
            ]}>
              {Math.abs(Math.round(totalNetCalories))} calories
            </Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Food Intake</Text>
        <WeeklyCalorieChart
          calorieData={foodCalorieData}
          title="Calories Consumed"
          color="#4CAF50"
        />
        
        <Text style={styles.sectionTitle}>Workouts</Text>
        <WeeklyCalorieChart
          calorieData={workoutCalorieData}
          title="Calories Burned"
          color="#FF9800"
        />
        
        <Text style={styles.sectionTitle}>Net Calories</Text>
        <View style={styles.netCalorieCard}>
          <Text style={styles.netCalorieTitle}>Daily Net Calories</Text>
          
          {netCalorieData.data.map((calories, index) => (
            <View key={index} style={styles.netCalorieRow}>
              <Text style={styles.netCalorieDay}>{labels[index]}</Text>
              <View style={styles.netCalorieBarContainer}>
                <View style={[
                  styles.netCalorieBar,
                  { 
                    backgroundColor: calories > 0 ? '#F44336' : '#4CAF50',
                    width: `${Math.min(Math.abs(calories) / 1000 * 50, 100)}%`
                  }
                ]} />
              </View>
              <Text style={[
                styles.netCalorieValue,
                { color: calories > 0 ? '#F44336' : '#4CAF50' }
              ]}>
                {calories > 0 ? '+' : ''}{calories}
              </Text>
            </View>
          ))}
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryItemValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryItemLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  goalLabel: {
    fontSize: 14,
    color: '#757575',
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  netCalorieCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
    elevation: 1,
  },
  netCalorieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  netCalorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  netCalorieDay: {
    width: 40,
    fontSize: 14,
    color: '#757575',
  },
  netCalorieBarContainer: {
    flex: 1,
    height: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  netCalorieBar: {
    height: '100%',
    borderRadius: 8,
  },
  netCalorieValue: {
    width: 60,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default CalorieBalanceScreen;