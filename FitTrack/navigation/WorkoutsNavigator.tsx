import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import CreateWorkoutScreen from '../screens/CreateWorkoutScreen';
import EditWorkoutScreen from '../screens/EditWorkoutScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import ActiveWorkoutScreen from '../screens/ActiveWorkoutScreen';
import TabataTimerScreen from '../screens/TabataTimerScreen';

export type WorkoutsStackParamList = {
  WorkoutsList: undefined;
  CreateWorkout: undefined;
  EditWorkout: { workoutId: string };
  WorkoutDetail: { workoutId: string };
  ActiveWorkout: { workoutId?: string };
  TabataTimer: undefined;
};

const Stack = createStackNavigator<WorkoutsStackParamList>();

const WorkoutsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WorkoutsList" component={WorkoutsScreen} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
      <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
      <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
      <Stack.Screen name="TabataTimer" component={TabataTimerScreen} />
    </Stack.Navigator>
  );
};

export default WorkoutsNavigator;