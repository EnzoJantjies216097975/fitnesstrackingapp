import {
    FETCH_MEALS_REQUEST,
    FETCH_MEALS_SUCCESS,
    FETCH_MEALS_FAILURE,
    ADD_MEAL,
    UPDATE_MEAL,
    DELETE_MEAL,
    UPDATE_NUTRITION_GOALS,
  } from '../actions/types';
  
  const initialState = {
    meals: [],
    loading: false,
    error: null,
    totalNutrients: {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
    },
    dailyGoals: {
      calories: 2000,
      carbs: 250,
      protein: 150,
      fat: 70,
    },
  };
  
  const nutritionReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_MEALS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
        
      case FETCH_MEALS_SUCCESS:
        // Calculate total nutrients from meals
        const totalNutrients = calculateTotalNutrients(action.payload);
        
        return {
          ...state,
          meals: action.payload,
          totalNutrients,
          loading: false,
          error: null,
        };
        
      case FETCH_MEALS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
        
      case ADD_MEAL:
        const newMeals = [...state.meals, action.payload];
        return {
          ...state,
          meals: newMeals,
          totalNutrients: calculateTotalNutrients(newMeals),
        };
        
      case UPDATE_MEAL:
        const updatedMeals = state.meals.map(meal => 
          meal.id === action.payload.id ? action.payload : meal
        );
        
        return {
          ...state,
          meals: updatedMeals,
          totalNutrients: calculateTotalNutrients(updatedMeals),
        };
        
      case DELETE_MEAL:
        const mealsAfterDelete = state.meals.filter(meal => meal.id !== action.payload);
        
        return {
          ...state,
          meals: mealsAfterDelete,
          totalNutrients: calculateTotalNutrients(mealsAfterDelete),
        };
        
      case UPDATE_NUTRITION_GOALS:
        return {
          ...state,
          dailyGoals: action.payload,
        };
        
      default:
        return state;
    }
  };
  
  // Helper function to calculate total nutrients from meals
  const calculateTotalNutrients = (meals) => {
    return meals.reduce((total, meal) => {
      // Sum up nutrients from all foods in the meal
      const mealNutrients = meal.foods.reduce((mealTotal, food) => {
        return {
          calories: mealTotal.calories + food.calories,
          carbs: mealTotal.carbs + food.carbs,
          protein: mealTotal.protein + food.protein,
          fat: mealTotal.fat + food.fat,
        };
      }, { calories: 0, carbs: 0, protein: 0, fat: 0 });
      
      // Add to total
      return {
        calories: total.calories + mealNutrients.calories,
        carbs: total.carbs + mealNutrients.carbs,
        protein: total.protein + mealNutrients.protein,
        fat: total.fat + mealNutrients.fat,
      };
    }, { calories: 0, carbs: 0, protein: 0, fat: 0 });
  };
  
  export default nutritionReducer;