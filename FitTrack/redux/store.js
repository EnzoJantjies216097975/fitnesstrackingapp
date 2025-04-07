import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import reducers
import workoutReducer from './reducers/workoutReducer';
import exerciseReducer from './reducers/exerciseReducer';
import nutritionReducer from './reducers/nutritionReducer';
import userReducer from './reducers/userReducer';
import statsReducer from './reducers/statsReducer';

// Configure persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['workouts', 'exercises', 'nutrition', 'user'], // Persisted reducers
};

// Combine reducers
const rootReducer = combineReducers({
  workouts: workoutReducer,
  exercises: exerciseReducer,
  nutrition: nutritionReducer,
  user: userReducer,
  stats: statsReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with middleware
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };