import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import Slider from '@react-native-community/slider';
import { updateNutritionGoals } from '../redux/actions/nutritionActions';
import { calculateBMR, calculateTDEE } from '../utils/calorieCalculator';
import { NutritionStackParamList } from '../navigation/NutritionNavigator';
import { RootState, NutritionGoals } from '../types';

type NutritionSettingsScreenNavigationProp = StackNavigationProp<
  NutritionStackParamList,
  'NutritionSettings'
>;

interface NutritionSettingsScreenProps {
  navigation: NutritionSettingsScreenNavigationProp;
}

const NutritionSettingsScreen: React.FC<NutritionSettingsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.user);
  const { dailyGoals } = useSelector((state: RootState) => state.nutrition);
  
  const [calorieGoal, setCalorieGoal] = useState<number>(dailyGoals.calories);
  const [carbGoal, setCarbGoal] = useState<number>(dailyGoals.carbs);
  const [proteinGoal, setProteinGoal] = useState<number>(dailyGoals.protein);
  const [fatGoal, setFatGoal] = useState<number>(dailyGoals.fat);
  const [macroDistribution, setMacroDistribution] = useState<{
    carbs: number;
    protein: number;
    fat: number;
  }>({
    carbs: Math.round((dailyGoals.carbs * 4) / dailyGoals.calories * 100),
    protein: Math.round((dailyGoals.protein * 4) / dailyGoals.calories * 100),
    fat: Math.round((dailyGoals.fat * 9) / dailyGoals.calories * 100),
  });
  
  // Update macro goals when calorie goal or distribution changes
  useEffect(() => {
    const newCarbGoal = Math.round((calorieGoal * macroDistribution.carbs / 100) / 4);
    const newProteinGoal = Math.round((calorieGoal * macroDistribution.protein / 100) / 4);
    const newFatGoal = Math.round((calorieGoal * macroDistribution.fat / 100) / 9);
    
    setCarbGoal(newCarbGoal);
    setProteinGoal(newProteinGoal);
    setFatGoal(newFatGoal);
  }, [calorieGoal, macroDistribution]);
  
  // Calculate recommended calories based on user profile
  const calculateRecommendedCalories = () => {
    // Get user data from profile
    const { gender, age, weight, height, activityLevel, goal } = profile;
    
    // Calculate BMR using the Mifflin-St Jeor Equation
    const bmr = calculateBMR(weight, height, age, gender);
    
    // Apply activity multiplier
    const tdee = calculateTDEE(bmr, activityLevel);
    
    // Adjust based on goal if available
    let targetCalories = tdee;
    if (goal) {
      if (goal === 'lose') {
        targetCalories -= 500; // 500 calorie deficit for weight loss
      } else if (goal === 'gain') {
        targetCalories += 500; // 500 calorie surplus for weight gain
      }
    }
    
    // Calculate macro splits (default to 40/30/30 carbs/protein/fat)
    const carbs = Math.round((targetCalories * 0.4) / 4); // 4 calories per gram
    const protein = Math.round((targetCalories * 0.3) / 4); // 4 calories per gram
    const fat = Math.round((targetCalories * 0.3) / 9); // 9 calories per gram
    
    return {
      calories: Math.round(targetCalories),
      carbs,
      protein,
      fat
    };
  };
  
  const recalculateGoals = () => {
    const recommendedGoals = calculateRecommendedCalories();
    setCalorieGoal(recommendedGoals.calories);
    
    // Update macro distribution based on new recommendations
    setMacroDistribution({
      carbs: Math.round((recommendedGoals.carbs * 4) / recommendedGoals.calories * 100),
      protein: Math.round((recommendedGoals.protein * 4) / recommendedGoals.calories * 100),
      fat: Math.round((recommendedGoals.fat * 9) / recommendedGoals.calories * 100),
    });
  };
  
  const saveGoals = () => {
    // Validate goals
    if (calorieGoal < 500 || calorieGoal > 10000) {
      Alert.alert('Invalid Calorie Goal', 'Please enter a reasonable calorie goal (500-10000)');
      return;
    }
    
    // Check that macros add up to approximately 100%
    const totalPercent = macroDistribution.carbs + macroDistribution.protein + macroDistribution.fat;
    if (totalPercent < 95 || totalPercent > 105) {
      Alert.alert('Invalid Macros', 'Macronutrient percentages should add up to approximately 100%');
      return;
    }
    
    const newGoals: NutritionGoals = {
      calories: calorieGoal,
      carbs: carbGoal,
      protein: proteinGoal,
      fat: fatGoal,
    };
    
    dispatch(updateNutritionGoals(newGoals));
    navigation.goBack();
  };
  
  const updateMacroDistribution = (type: 'carbs' | 'protein' | 'fat', value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    setMacroDistribution(prev => {
      // Adjust the other values proportionally to maintain approximately 100% total
      const newDist = { ...prev, [type]: numValue };
      const total = Object.values(newDist).reduce((sum, val) => sum + val, 0);
      
      // If the total is far from 100%, adjust the other values
      if (Math.abs(total - 100) > 5) {
        const othersTotal = total - numValue;
        const remainingPercent = 100 - numValue;
        
        // Distribute remaining percentage proportionally between the other two macros
        if (type === 'carbs') {
          const proteinRatio = prev.protein / (prev.protein + prev.fat);
          newDist.protein = Math.round(remainingPercent * proteinRatio);
          newDist.fat = Math.round(remainingPercent * (1 - proteinRatio));
        } else if (type === 'protein') {
          const carbsRatio = prev.carbs / (prev.carbs + prev.fat);
          newDist.carbs = Math.round(remainingPercent * carbsRatio);
          newDist.fat = Math.round(remainingPercent * (1 - carbsRatio));
        } else { // fat
          const carbsRatio = prev.carbs / (prev.carbs + prev.protein);
          newDist.carbs = Math.round(remainingPercent * carbsRatio);
          newDist.protein = Math.round(remainingPercent * (1 - carbsRatio));
        }
      }
      
      return newDist;
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Nutrition Goals</Text>
        <TouchableOpacity onPress={saveGoals}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.recalculateButton}
          onPress={recalculateGoals}
        >
          <Ionicons name="calculator-outline" size={20} color="#fff" />
          <Text style={styles.recalculateButtonText}>
            Recalculate Based on Profile
          </Text>
        </TouchableOpacity>
        
        <View style={styles.calorieSection}>
          <Text style={styles.sectionTitle}>Daily Calorie Goal</Text>
          
          <View style={styles.calorieInputContainer}>
            <TextInput
              style={styles.calorieInput}
              value={calorieGoal.toString()}
              onChangeText={(text) => {
                const value = parseInt(text);
                if (!isNaN(value)) {
                  setCalorieGoal(value);
                } else if (text === '') {
                  setCalorieGoal(0);
                }
              }}
              keyboardType="number-pad"
            />
            <Text style={styles.calorieUnit}>calories</Text>
          </View>
          
          <Slider
            style={styles.slider}
            minimumValue={1000}
            maximumValue={4000}
            step={50}
            value={calorieGoal}
            onValueChange={(value) => setCalorieGoal(value)}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#4CAF50"
          />
          
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1000</Text>
            <Text style={styles.sliderLabel}>4000</Text>
          </View>
        </View>
        
        <View style={styles.macroSection}>
          <Text style={styles.sectionTitle}>Macronutrient Distribution</Text>
          
          <View style={styles.macroRow}>
            <View style={styles.macroLabelContainer}>
              <View style={[styles.macroColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            
            <View style={styles.macroValueContainer}>
              <TextInput
                style={styles.macroPercentInput}
                value={macroDistribution.carbs.toString()}
                onChangeText={(text) => updateMacroDistribution('carbs', text)}
                keyboardType="number-pad"
              />
              <Text style={styles.percentSign}>%</Text>
            </View>
            
            <Text style={styles.macroGrams}>{carbGoal}g</Text>
          </View>
          
          <View style={styles.macroRow}>
            <View style={styles.macroLabelContainer}>
              <View style={[styles.macroColor, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            
            <View style={styles.macroValueContainer}>
              <TextInput
                style={styles.macroPercentInput}
                value={macroDistribution.protein.toString()}
                onChangeText={(text) => updateMacroDistribution('protein', text)}
                keyboardType="number-pad"
              />
              <Text style={styles.percentSign}>%</Text>
            </View>
            
            <Text style={styles.macroGrams}>{proteinGoal}g</Text>
          </View>
          
          <View style={styles.macroRow}>
            <View style={styles.macroLabelContainer}>
              <View style={[styles.macroColor, { backgroundColor: '#FF9800' }]} />
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
            
            <View style={styles.macroValueContainer}>
              <TextInput
                style={styles.macroPercentInput}
                value={macroDistribution.fat.toString()}
                onChangeText={(text) => updateMacroDistribution('fat', text)}
                keyboardType="number-pad"
              />
              <Text style={styles.percentSign}>%</Text>
            </View>
            
            <Text style={styles.macroGrams}>{fatGoal}g</Text>
          </View>
          
          <View style={styles.macroTotalRow}>
            <Text style={styles.macroTotalLabel}>Total</Text>
            <Text style={[
              styles.macroTotalValue,
              { color: Math.abs(macroDistribution.carbs + macroDistribution.protein + macroDistribution.fat - 100) <= 5 ? '#4CAF50' : '#F44336' }
            ]}>
              {macroDistribution.carbs + macroDistribution.protein + macroDistribution.fat}%
            </Text>
          </View>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Macronutrients</Text>
          <Text style={styles.infoText}>
            Carbohydrates and protein provide 4 calories per gram, while fat provides 9 calories per gram. 
            A balanced diet typically includes 45-65% carbs, 10-35% protein, and 20-35% fat.
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveGoals}
        >
          <Text style={styles.saveButtonText}>Save Nutrition Goals</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  recalculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  recalculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  calorieSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calorieInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    width: 120,
  },
  calorieUnit: {
    fontSize: 16,
    marginLeft: 8,
    color: '#757575',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    color: '#757575',
    fontSize: 12,
  },
  macroSection: {
    marginBottom: 24,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  macroLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  macroColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  macroLabel: {
    fontSize: 16,
  },
  macroValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  macroPercentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 8,
    width: 60,
    textAlign: 'center',
  },
  percentSign: {
    marginLeft: 4,
    fontSize: 16,
  },
  macroGrams: {
    width: 60,
    textAlign: 'right',
    fontSize: 16,
  },
  macroTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  macroTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  macroTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#757575',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NutritionSettingsScreen;