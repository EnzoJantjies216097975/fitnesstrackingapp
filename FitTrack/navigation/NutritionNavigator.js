import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NutritionScreen from '../screens/NutritionScreen';
import EditMealScreen from '../screens/EditMealScreen';
import NutritionSettingsScreen from '../screens/NutritionSettingsScreen';
import NutritionDashboardScreen from '../screens/NutritionDashboardScreen';
import EditMealScreen from '../screens/EditMealScreen';
import FoodDetailsScreen from '../screens/FoodDetailsScreen';

const Stack = createStackNavigator();

const NutritionNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
    }}
  >
      <Stack.Screen name="NutritionMain" component={NutritionScreen} />
      <Stack.Screen name="EditMeal" component={EditMealScreen} />
      <Stack.Screen name="NutritionSettings" component={NutritionSettingsScreen} />
      <Stack.Screen name="NutritionDashboard" component={NutritionDashboardScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
    </Stack.Navigator>
  );
};

export default NutritionNavigator;