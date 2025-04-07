import {
    FETCH_STATS_REQUEST,
    FETCH_STATS_SUCCESS,
    FETCH_STATS_FAILURE,
  } from '../actions/types';
  
  const initialState = {
    workoutStats: {
      totalWorkouts: 0,
      totalTime: 0,
      totalCaloriesBurned: 0,
      workoutsThisWeek: 0,
      workoutsLastWeek: 0,
    },
    nutritionStats: {
      averageCalories: 0,
      averageCarbs: 0,
      averageProtein: 0,
      averageFat: 0,
      goalReachedDays: 0,
    },
    healthStats: {
      averageHeartRate: 0,
      averageSteps: 0,
      stepsThisWeek: 0,
      stepsLastWeek: 0,
    },
    loading: false,
    error: null,
  };
  
  const statsReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_STATS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
        
      case FETCH_STATS_SUCCESS:
        return {
          ...state,
          ...action.payload,
          loading: false,
          error: null,
        };
        
      case FETCH_STATS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
        
      default:
        return state;
    }
  };
  
  export default statsReducer;