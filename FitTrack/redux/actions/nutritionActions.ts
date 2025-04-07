import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "redux";
import {  
    FETCH_MEALS_REQUEST,
    FETCH_MEALS_SUCCESS,
    FETCH_MEALS_FAILURE,
    ADD_MEAL,
    UPDATE_MEAL,
    DELETE_MEAL,
    UPDATE_NUTRITION_GOALS,
    ADD_FOOD_TO_MEAL,
    REMOVE_FOOD_FROM_MEAL,
    UPDATE_MEALS,
    FETCH_CALORIE_DATA_REQUEST,
    FETCH_CALORIE_DATA_SUCCESS,
    FETCH_CALORIE_DATA_FAILURE,
} from './types';
import { Meal, FoodItem, NutritionGoals, DailyCalories } from './types';
import { RootState } from './types';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

// Type for thunk actions
type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

/**
 * Function to compare dates without time
 * Used to filter meals by date
 */
const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Fetch meals for a specific date
 */
export const fetchMeals = (date: Date): AppThunk => async (dispatch) => {
  dispatch({ type: FETCH_MEALS_REQUEST });
  
  try {
    // In a production app, this would be an API call
    // For now, we're using AsyncStorage
    const mealsJson = await AsyncStorage.getItem('meals');
    const allMeals: Meal[] = mealsJson ? JSON.parse(mealsJson) : [];
    
    // Filter meals for the selected date
    const mealsForDate = allMeals.filter(meal => 
      isSameDay(meal.date, date)
    );
    
    dispatch({
      type: FETCH_MEALS_SUCCESS,
      payload: mealsForDate,
    });
  } catch (error) {
    dispatch({
      type: FETCH_MEALS_FAILURE,
      payload: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Add a new meal
 */
export const addMeal = (meal: Meal): AppThunk => async (dispatch) => {
  dispatch({
    type: ADD_MEAL,
    payload: meal,
  });
  
  // Save to AsyncStorage
  try {
    const mealsJson = await AsyncStorage.getItem('meals');
    const allMeals: Meal[] = mealsJson ? JSON.parse(mealsJson) : [];
    allMeals.push(meal);
    await AsyncStorage.setItem('meals', JSON.stringify(allMeals));
  } catch (error) {
    console.error('Error saving meal to storage', error);
  }
};

/**
 * Update an existing meal
 */
export const updateMeal = (meal: Meal): AppThunk => async (dispatch) => {
  dispatch({
    type: UPDATE_MEAL,
    payload: meal,
  });
  
  // Save to AsyncStorage
  try {
    const mealsJson = await AsyncStorage.getItem('meals');
    const allMeals: Meal[] = mealsJson ? JSON.parse(mealsJson) : [];
    const updatedMeals = allMeals.map(m => 
      m.id === meal.id ? meal : m
    );
    await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
  } catch (error) {
    console.error('Error updating meal in storage', error);
  }
};

/**
 * Delete a meal
 */
export const deleteMeal = (mealId: string): AppThunk => async (dispatch) => {
  dispatch({
    type: DELETE_MEAL,
    payload: mealId,
  });
  
  // Save to AsyncStorage
  try {
    const mealsJson = await AsyncStorage.getItem('meals');
    const allMeals: Meal[] = mealsJson ? JSON.parse(mealsJson) : [];
    const updatedMeals = allMeals.filter(meal => meal.id !== mealId);
    await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
  } catch (error) {
    console.error('Error deleting meal from storage', error);
  }
};

/**
 * Update nutrition goals
 */
export const updateNutritionGoals = (goals: NutritionGoals): AppThunk => async (dispatch) => {
  dispatch({
    type: UPDATE_NUTRITION_GOALS,
    payload: goals,
  });
  
  // Save to AsyncStorage
  try {
    await AsyncStorage.setItem('nutritionGoals', JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving nutrition goals to storage', error);
  }
};

/**
 * Add a food item to a meal
 */
export const addFoodToMeal = (mealId: string, food: FoodItem): AppThunk => async (dispatch, getState) => {
  try {
    // Get current meals from state
    const { meals } = getState().nutrition;
    
    // Find the meal to update
    const updatedMeals = meals.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          foods: [...meal.foods, { ...food, id: Date.now().toString() }]
        };
      }
      return meal;
    });
    
    // Update state
    dispatch({
      type: UPDATE_MEALS,
      payload: updatedMeals
    });
    
    // Save to AsyncStorage
    const mealsJson = await AsyncStorage.getItem('meals');
    const allMeals: Meal[] = mealsJson ? JSON.parse(mealsJson) : [];
    
    // Update the meal in all meals
    const updatedAllMeals = allMeals.map(meal => {
      if (meal.id === mealId) {
        const updatedMeal = updatedMeals.find(m => m.id === mealId);
        return updatedMeal || meal;
      }
      return meal;
    });
    
    await AsyncStorage.setItem('meals', JSON.stringify(updatedAllMeals));
  } catch (error) {
    console.error('Error adding food to meal:', error);
  }
};

/**
 * Remove a food item from a meal
 */
export const removeFoodFromMeal = (mealId: string, foodId: string): AppThunk => async (dispatch, getState) => {
  try {
    // Get current meals from state
    const { meals } = getState().nutrition;
    
    // Find the meal and remove the food
    const updatedMeals = meals.map(meal => {
      if (meal.id === mealId) {
        return {
          ...meal,
          foods: meal.foods.filter(food => food.id !== foodId)
        };
      }
      return meal;
    });
    
    // Update state
    dispatch({
      type: UPDATE_MEALS,
      payload: updatedMeals
    });
    