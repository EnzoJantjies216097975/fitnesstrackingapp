import { useSelector } from 'react-redux';
import { calculateCaloriesBurned, getExerciseMET } from '../utils/calorieCalculator';
import CalorieBurnedCard from '../components/CalorieBurnedCard';
import SmartWatchAPI from '../api/smartWatchApi';

// Add these inside the component function
const ActiveWorkoutScreen = ({ navigation, route }) => {
  // Add these state variables
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [avgHeartRate, setAvgHeartRate] = useState(0);
  const [heartRateReadings, setHeartRateReadings] = useState([]);
  
  // Get user data from Redux store
  const { profile } = useSelector(state => state.user);
  const { smartWatch } = useSelector(state => state.user);
  
  // Update calorie calculations
  useEffect(() => {
    // Calculate elapsed time in minutes
    const elapsedMinutes = (Date.now() - new Date(startTime).getTime()) / (1000 * 60);
    
    if (smartWatch.connected) {
      // If smart watch is connected, use heart rate data
      const currentHeartRate = SmartWatchAPI.getHeartRate();
      
      // Add heart rate reading to array
      if (currentHeartRate > 0) {
        setHeartRateReadings(prev => [...prev, currentHeartRate]);
        
        // Calculate average heart rate
        const avgHR = heartRateReadings.reduce((sum, hr) => sum + hr, 0) / heartRateReadings.length;
        setAvgHeartRate(Math.round(avgHR));
        
        // Calculate calories from heart rate
        const calories = calculateCaloriesFromHeartRate(
          avgHR,
          profile.weight,
          profile.age,
          profile.gender,
          elapsedMinutes
        );
        
        setCaloriesBurned(calories);
      }
    } else {
      // If no smart watch, estimate based on exercise type and duration
      // Get an average MET value for the workout
      const metValues = workout.exercises.map(ex => {
        // Try to map the exercise name to a known type, or use default
        const exerciseType = mapExerciseToType(ex.name);
        return getExerciseMET(exerciseType, 'moderate');
      });
      
      const avgMET = metValues.reduce((sum, met) => sum + met, 0) / metValues.length;
      
      // Calculate calories
      const calories = calculateCaloriesBurned(avgMET, profile.weight, elapsedMinutes);
      setCaloriesBurned(calories);
    }
    
    // Update every 30 seconds
    const timer = setTimeout(() => {
      // Recalculate
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [startTime, workout, profile, heartRateReadings, smartWatch]);
  
  // Helper function to map exercise names to exercise types
  const mapExerciseToType = (exerciseName) => {
    exerciseName = exerciseName.toLowerCase();
    
    if (exerciseName.includes('run') || exerciseName.includes('sprint')) {
      return 'running';
    } else if (exerciseName.includes('jog')) {
      return 'jogging';
    } else if (exerciseName.includes('walk')) {
      return 'walking';
    } else if (exerciseName.includes('cycle') || exerciseName.includes('bike')) {
      return 'cycling';
    } else if (exerciseName.includes('swim')) {
      return 'swimming';
    } else if (exerciseName.includes('row')) {
      return 'rowing';
    } else if (exerciseName.includes('yoga')) {
      return 'yoga';
    } else if (exerciseName.includes('hiit')) {
      return 'hiit';
    } else if (exerciseName.includes('bench') || exerciseName.includes('squat') || 
              exerciseName.includes('deadlift') || exerciseName.includes('press')) {
      return 'weightTraining';
    } else if (exerciseName.includes('push') || exerciseName.includes('pull') || 
              exerciseName.includes('bodyweight')) {
      return 'bodyweight';
    }
    
    // Default to general weight training if no match
    return 'weightTraining';
  };
  
  // Add the CalorieBurnedCard to the UI
  return (
    <View style={styles.container}>
      {/* ... existing code ... */}
      
      {/* Add the CalorieBurnedCard after the workout timer */}
      <CalorieBurnedCard
        calories={caloriesBurned}
        duration={Math.round((Date.now() - new Date(startTime).getTime()) / (1000 * 60))}
        heartRate={avgHeartRate > 0 ? avgHeartRate : undefined}
      />
      
      {/* ... remaining code ... */}
    </View>
  );
};