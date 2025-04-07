import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StatisticsScreen from '../screens/StatisticsScreen';
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen';
import SmartWatchScreen from '../screens/SmartWatchScreen';

export type StatisticsStackParamList = {
  StatisticsMain: undefined;
  WorkoutHistory: undefined;
  SmartWatch: undefined;
};

const Stack = createStackNavigator<StatisticsStackParamList>();

const StatisticsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StatisticsMain" component={StatisticsScreen} />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
      <Stack.Screen name="SmartWatch" component={SmartWatchScreen} />
    </Stack.Navigator>
  );
};

export default StatisticsNavigator;