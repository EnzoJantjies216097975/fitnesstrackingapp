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
  } from '../actions/types';
  
  const initialState = {
    workouts: [],
    workoutHistory: [],
    currentWorkout: null,
    loading: false,
    error: null,
  };
  
  const workoutReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_WORKOUTS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
        
      case FETCH_WORKOUTS_SUCCESS:
        return {
          ...state,
          workouts: action.payload,
          loading: false,
          error: null,
        };
        
      case FETCH_WORKOUTS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
        
      case CREATE_WORKOUT:
        return {
          ...state,
          workouts: [...state.workouts, action.payload],
        };
        
      case UPDATE_WORKOUT:
        return {
          ...state,
          workouts: state.workouts.map(workout => 
            workout.id === action.payload.id ? action.payload : workout
          ),
        };
        
      case DELETE_WORKOUT:
        return {
          ...state,
          workouts: state.workouts.filter(workout => workout.id !== action.payload),
        };
        
      case START_WORKOUT:
        return {
          ...state,
          currentWorkout: {
            ...action.payload,
            startTime: new Date().toISOString(),
            completedExercises: [],
          },
        };
        
      case END_WORKOUT:
        const completedWorkout = {
          ...state.currentWorkout,
          endTime: new Date().toISOString(),
          duration: action.payload.duration,
          caloriesBurned: action.payload.caloriesBurned,
        };
        
        return {
          ...state,
          currentWorkout: null,
          workoutHistory: [...state.workoutHistory, completedWorkout],
        };
        
      case LOG_WORKOUT_SET:
        return {
          ...state,
          currentWorkout: {
            ...state.currentWorkout,
            completedExercises: [
              ...state.currentWorkout.completedExercises,
              action.payload,
            ],
          },
        };
        
      default:
        return state;
    }
  };
  
  export default workoutReducer;