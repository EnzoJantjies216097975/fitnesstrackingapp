// Add this function inside the component
const NutritionSettingsScreen = ({ navigation }) => {
    // ... existing code ...
  
    // Calculate recommended calories based on user profile
    const calculateRecommendedCalories = () => {
      // Get user data from profile
      const { gender, age, weight, height, activityLevel } = profile;
      
      // Calculate BMR using the Mifflin-St Jeor Equation
      let bmr;
      if (gender.toLowerCase() === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }
      
      // Apply activity multiplier
      const activityMultipliers = {
        sedentary: 1.2,
        lightlyActive: 1.375,
        moderatelyActive: 1.55,
        veryActive: 1.725,
        extremelyActive: 1.9
      };
      
      const multiplier = activityMultipliers[activityLevel] || activityMultipliers.moderatelyActive;
      const tdee = Math.round(bmr * multiplier);
      
      // Calculate macro splits (default to 40/30/30 carbs/protein/fat)
      const carbs = Math.round((tdee * 0.4) / 4); // 4 calories per gram
      const protein = Math.round((tdee * 0.3) / 4); // 4 calories per gram
      const fat = Math.round((tdee * 0.3) / 9); // 9 calories per gram
      
      return {
        calories: tdee,
        carbs,
        protein,
        fat
      };
    };
    
    // Add button to recalculate based on profile
    const recalculateGoals = () => {
      const recommendedGoals = calculateRecommendedCalories();
      setCalorieGoal(recommendedGoals.calories);
      setCarbGoal(recommendedGoals.carbs);
      setProteinGoal(recommendedGoals.protein);
      setFatGoal(recommendedGoals.fat);
    };
    
    // Add this to the JSX
    return (
      <View style={styles.container}>
        {/* ... existing code ... */}
        
        <TouchableOpacity
          style={styles.recalculateButton}
          onPress={recalculateGoals}
        >
          <Ionicons name="calculator-outline" size={20} color="#fff" />
          <Text style={styles.recalculateButtonText}>
            Recalculate Based on Profile
          </Text>
        </TouchableOpacity>
        
        {/* ... rest of the UI ... */}
      </View>
    );
  };