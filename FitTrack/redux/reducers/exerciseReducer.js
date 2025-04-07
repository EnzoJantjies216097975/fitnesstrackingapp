import {
    FETCH_EXERCISES_REQUEST,
    FETCH_EXERCISES_SUCCESS,
    FETCH_EXERCISES_FAILURE,
    CREATE_EXERCISE,
    UPDATE_EXERCISE,
    DELETE_EXERCISE,
  } from '../actions/types';
  
  const initialState = {
    exercises: [],
    loading: false,
    error: null,
  };
  
  const exerciseReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_EXERCISES_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
        
      case FETCH_EXERCISES_SUCCESS:
        return {
          ...state,
          exercises: action.payload,
          loading: false,
          error: null,
        };
        
      case FETCH_EXERCISES_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
        
      case CREATE_EXERCISE:
        return {
          ...state,
          exercises: [...state.exercises, action.payload],
        };
        
      case UPDATE_EXERCISE:
        return {
          ...state,
          exercises: state.exercises.map(exercise => 
            exercise.id === action.payload.id ? action.payload : exercise
          ),
        };
        
      case DELETE_EXERCISE:
        return {
          ...state,
          exercises: state.exercises.filter(exercise => exercise.id !== action.payload),
        };
        
      default:
        return state;
    }
  };
  
  export default exerciseReducer;