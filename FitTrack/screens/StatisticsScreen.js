// Add this import
import { useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';

// Add this inside the component
const StatisticsScreen = ({ navigation }) => {
  // ...existing code...
  
  // Get data from Redux
  const { workoutHistory } = useSelector(state => state.workouts);
  const { profile } = useSelector(state => state.user);
  
  // Calculate weekly calories
  const getWeeklyCalorieData = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Filter workouts from the last 7 days
    const recentWorkouts = workoutHistory.filter(workout => 
      new Date(workout.endTime) >= oneWeekAgo
    );
    
    // Group by day and sum calories
    const dailyCalories = {};
    const labels = [];
    
    // Initialize with 0 values for all 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split('T')[0];
      
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
      labels.unshift(dayLabel);
      dailyCalories[dayKey] = 0;
    }
    
    // Fill in actual values from workouts
    recentWorkouts.forEach(workout => {
      if (workout.caloriesBurned) {
        const workoutDate = new Date(workout.endTime);
        const dayKey = workoutDate.toISOString().split('T')[0];
        
        if (dailyCalories[dayKey] !== undefined) {
          dailyCalories[dayKey] += workout.caloriesBurned;
        }
      }
    });
    
    // Convert to array for chart
    const data = Object.values(dailyCalories).reverse();
    
    return { labels, data };
  };
  
  // Get calorie data
  const calorieData = getWeeklyCalorieData();
  
  // Add this to the UI
  return (
    <ScrollView style={styles.container}>
      {/* ... existing code ... */}
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Calories Burned</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('WorkoutHistory')}
        >
          <Text style={styles.seeAllText}>See History</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartCard}>
        <LineChart
          data={{
            labels: calorieData.labels,
            datasets: [
              {
                data: calorieData.data,
                color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
                strokeWidth: 2
              }
            ]
          }}
          width={width - 40}
          height={180}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#FF9800'
            }
          }}
          bezier
          style={styles.chart}
        />
        
        <View style={styles.calorieStatsRow}>
          <View style={styles.calorieStatsItem}>
            <Text style={styles.calorieStatsValue}>
              {Math.round(calorieData.data.reduce((sum, cal) => sum + cal, 0))}
            </Text>
            <Text style={styles.calorieStatsLabel}>Weekly Total</Text>
          </View>
          
          <View style={styles.calorieStatsItem}>
            <Text style={styles.calorieStatsValue}>
              {Math.round(calorieData.data.reduce((sum, cal) => sum + cal, 0) / 7)}
            </Text>
            <Text style={styles.calorieStatsLabel}>Daily Average</Text>
          </View>
          
          <View style={styles.calorieStatsItem}>
            <Text style={styles.calorieStatsValue}>
              {Math.max(...calorieData.data)}
            </Text>
            <Text style={styles.calorieStatsLabel}>Best Day</Text>
          </View>
        </View>
      </View>
      
      {/* ... rest of the UI ... */}
    </ScrollView>
  );
};