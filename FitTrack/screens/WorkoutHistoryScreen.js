// Add inside the component
const WorkoutHistoryScreen = ({ navigation }) => {
    // ...existing code...
    
    // Render workout history item with calories information
    const renderWorkoutItem = ({ item }) => {
      const date = new Date(item.endTime);
      
      return (
        <TouchableOpacity
          style={styles.workoutItem}
          onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
        >
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutName}>{item.name}</Text>
            <Text style={styles.workoutDate}>
              {date.toLocaleDateString()} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          <View style={styles.workoutStats}>
            <View style={styles.workoutStat}>
              <Ionicons name="time-outline" size={16} color="#757575" />
              <Text style={styles.workoutStatValue}>
                {Math.round(item.duration || 0)} min
              </Text>
            </View>
            
            <View style={styles.workoutStat}>
              <Ionicons name="barbell-outline" size={16} color="#757575" />
              <Text style={styles.workoutStatValue}>
                {item.completedExercises?.length || 0} exercises
              </Text>
            </View>
            
            <View style={styles.workoutStat}>
              <Ionicons name="flame-outline" size={16} color="#FF9800" />
              <Text style={[styles.workoutStatValue, { color: '#FF9800' }]}>
                {Math.round(item.caloriesBurned || 0)} cal
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };
    
    // ...rest of the component
  };