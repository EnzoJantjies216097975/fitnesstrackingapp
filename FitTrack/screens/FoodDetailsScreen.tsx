import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { addFoodToMeal } from '../redux/actions/nutritionActions';
import { NutritionStackParamList } from '../navigation/NutritionNavigator';
import { FoodItem } from '../types';

type FoodDetailsScreenNavigationProp = StackNavigationProp<
  NutritionStackParamList,
  'FoodDetails'
>;
type FoodDetailsScreenRouteProp = RouteProp<
  NutritionStackParamList,
  'FoodDetails'
>;

interface FoodDetailsScreenProps {
  navigation: FoodDetailsScreenNavigationProp;
  route: FoodDetailsScreenRouteProp;
}

const FoodDetailsScreen: React.FC<FoodDetailsScreenProps> = ({ route, navigation }) => {
  const { food, mealId } = route.params;
  const dispatch = useDispatch();
  const [servingSize, setServingSize] = useState(food.servingSize.toString());
  
  // Calculate nutrition based on serving size
  const calculateNutrition = (nutrientValue: number): number => {
    const ratio = parseFloat(servingSize) / food.servingSize;
    return Math.round(nutrientValue * ratio);
  };
  
  const handleAddToMeal = () => {
    const newServing = parseFloat(servingSize);
    if (isNaN(newServing) || newServing <= 0) {
      // Show error message
      return;
    }
    
    const adjustedFood: FoodItem = {
      ...food,
      servingSize: newServing,
      calories: calculateNutrition(food.calories),
      carbs: calculateNutrition(food.carbs),
      protein: calculateNutrition(food.protein),
      fat: calculateNutrition(food.fat),
    };
    
    dispatch(addFoodToMeal(mealId, adjustedFood));
    navigation.goBack();
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Food Details</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.foodHeader}>
        <Text style={styles.foodName}>{food.name}</Text>
        
        <View style={styles.servingContainer}>
          <Text style={styles.servingLabel}>Serving Size:</Text>
          <TextInput
            style={styles.servingInput}
            value={servingSize}
            onChangeText={setServingSize}
            keyboardType="decimal-pad"
          />
          <Text style={styles.servingUnit}>{food.servingUnit}</Text>
        </View>
      </View>
      
      <View style={styles.nutritionCard}>
        <Text style={styles.nutritionCardTitle}>Nutrition Facts</Text>
        
        <View style={styles.calorieRow}>
          <Text style={styles.calorieLabel}>Calories</Text>
          <Text style={styles.calorieValue}>{calculateNutrition(food.calories)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.nutrientRow}>
          <View style={styles.nutrientNameContainer}>
            <Text style={styles.nutrientName}>Total Carbohydrates</Text>
          </View>
          <View style={styles.nutrientValueContainer}>
            <Text style={styles.nutrientValue}>{calculateNutrition(food.carbs)}g</Text>
          </View>
        </View>
        
        <View style={styles.nutrientRow}>
          <View style={styles.nutrientNameContainer}>
            <Text style={styles.nutrientName}>Protein</Text>
          </View>
          <View style={styles.nutrientValueContainer}>
            <Text style={styles.nutrientValue}>{calculateNutrition(food.protein)}g</Text>
          </View>
        </View>
        
        <View style={styles.nutrientRow}>
          <View style={styles.nutrientNameContainer}>
            <Text style={styles.nutrientName}>Total Fat</Text>
          </View>
          <View style={styles.nutrientValueContainer}>
            <Text style={styles.nutrientValue}>{calculateNutrition(food.fat)}g</Text>
          </View>
        </View>
        
        {/* Add more detailed nutrition facts if available */}
        {food.nutrients && (
          <>
            <View style={styles.divider} />
            
            {food.nutrients.cholesterol !== undefined && (
              <View style={styles.nutrientRow}>
                <View style={styles.nutrientNameContainer}>
                  <Text style={styles.nutrientName}>Cholesterol</Text>
                </View>
                <View style={styles.nutrientValueContainer}>
                  <Text style={styles.nutrientValue}>
                    {calculateNutrition(food.nutrients.cholesterol)}mg
                  </Text>
                </View>
              </View>
            )}
            
            {food.nutrients.sodium !== undefined && (
              <View style={styles.nutrientRow}>
                <View style={styles.nutrientNameContainer}>
                  <Text style={styles.nutrientName}>Sodium</Text>
                </View>
                <View style={styles.nutrientValueContainer}>
                  <Text style={styles.nutrientValue}>
                    {calculateNutrition(food.nutrients.sodium)}mg
                  </Text>
                </View>
              </View>
            )}
            
            {food.nutrients.fiber !== undefined && (
              <View style={styles.nutrientRow}>
                <View style={styles.nutrientNameContainer}>
                  <Text style={[styles.nutrientName, { marginLeft: 16 }]}>Dietary Fiber</Text>
                </View>
                <View style={styles.nutrientValueContainer}>
                  <Text style={styles.nutrientValue}>
                    {calculateNutrition(food.nutrients.fiber)}g
                  </Text>
                </View>
              </View>
            )}
            
            {food.nutrients.sugar !== undefined && (
              <View style={styles.nutrientRow}>
                <View style={styles.nutrientNameContainer}>
                  <Text style={[styles.nutrientName, { marginLeft: 16 }]}>Sugars</Text>
                </View>
                <View style={styles.nutrientValueContainer}>
                  <Text style={styles.nutrientValue}>
                    {calculateNutrition(food.nutrients.sugar)}g
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>
      
      <View style={styles.calorieBreakdownCard}>
        <Text style={styles.calorieBreakdownTitle}>Calorie Breakdown</Text>
        
        <View style={styles.macroPercentagesContainer}>
          {/* Carbs */}
          <View style={styles.macroPercentItem}>
            <View 
              style={[