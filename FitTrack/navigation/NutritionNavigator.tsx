import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NutritionScreen from '../screens/NutritionScreen';
import NutritionDashboardScreen from '../screens/NutritionDashboardScreen';
import EditMealScreen from '../screens/EditMealScreen';
import NutritionSettingsScreen from '../screens/NutritionSettingsScreen';
import FoodDetailsScreen from '../screens/FoodDetailsScreen';
import CalorieBalanceScreen from '../screens/CalorieBalanceScreen';

export type NutritionStackParamList = {
  NutritionDashboard: undefined;
  NutritionMain: undefined;
  EditMeal: { mealId: string };
  NutritionSettings: undefined;
  FoodDetails: { food: FoodItem; mealId: string };
  CalorieBalance: undefined;
};

const Stack = createStackNavigator<NutritionStackParamList>();

const NutritionNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="NutritionDashboard" component={NutritionDashboardScreen} />
      <Stack.Screen name="NutritionMain" component={NutritionScreen} />
      <Stack.Screen name="EditMeal" component={EditMealScreen} />
      <Stack.Screen name="NutritionSettings" component={NutritionSettingsScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
      <Stack.Screen name="CalorieBalance" component={CalorieBalanceScreen} />
    </Stack.Navigator>
  );
};

export default NutritionNavigator;