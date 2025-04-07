import {
    FETCH_WORKOUTS_REQUEST,
    FETCH_WORKOUTS_SUCCESS,
    FETCH_WORKOUTS_FAILURE,
    CREATE_WORKOUT,
    UPDATE_WORKOUT,
    DELETE_WORKOUT,
    START_WORKOUT,
    END_WORKOUT,
    LOG_WORKOUT_SET,
  } from './types';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  export const fetchWorkouts = () => async (dispatch) => {
    dispatch({ type: FETCH_WORKOUTS_REQUEST });
    
    try {
      // In a real app, this would be an API call
      // For now, just fetch from AsyncStorage
      const workoutsJson = await AsyncStorage.getItem('workouts');
      const workouts = workoutsJson ? JSON.parse(workoutsJson) : [];
      
      dispatch({
        type: FETCH_WORKOUTS_SUCCESS,
        payload: workouts,
      });
    } catch (error) {
      dispatch({
        type: FETCH_WORKOUTS_FAILURE,
        payload: error.message,
      });
    }
  };
  
  export const createWorkout = (workout) => async (dispatch, getState) => {
    dispatch({
      type: CREATE_WORKOUT,
      payload: workout,
    });
    
    // Save to AsyncStorage
    try {
      const { workouts } = getState().workouts;
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
    } catch (error) {
      console.error('Error saving workout to storage', error);
    }
  };
  
  export const updateWorkout = (workout) => async (dispatch, getState) => {
    dispatch({
      type: UPDATE_WORKOUT,
      payload: workout,
    });
    
    // Save to AsyncStorage
    try {
      const { workouts } = getState().workouts;
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
    } catch (error) {
      console.error('Error updating workout in storage', error);
    }
  };
  
  export const deleteWorkout = (workoutId) => async (dispatch, getState) => {
    dispatch({
      type: DELETE_WORKOUT,
      payload: workoutId,
    });
    
    // Save to AsyncStorage
    try {
      const { workouts } = getState().workouts;
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
    } catch (error) {
      console.error('Error deleting workout from storage', error);
    }
  };
  
  export const startWorkout = (workout) => ({
    type: START_WORKOUT,
    payload: workout,
  });
  
  export const endWorkout = (data) => ({
    type: END_WORKOUT,
    payload: data,
  });
  
  export const logWorkoutSet = (exerciseData) => ({
    type: LOG_WORKOUT_SET,
    payload: exerciseData,
  });