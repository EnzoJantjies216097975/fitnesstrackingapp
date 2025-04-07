// App.js - Main entry point
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

// Import screen navigators
import HomeNavigator from './src/navigation/HomeNavigator';
import WorkoutsNavigator from './src/navigation/WorkoutsNavigator';
import NutritionNavigator from './src/navigation/NutritionNavigator';
import StatisticsNavigator from './src/navigation/StatisticsNavigator';
import ProfileNavigator from './src/navigation/ProfileNavigator';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Workouts') {
                  iconName = focused ? 'barbell' : 'barbell-outline';
                } else if (route.name === 'Nutrition') {
                  iconName = focused ? 'nutrition' : 'nutrition-outline';
                } else if (route.name === 'Statistics') {
                  iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#4CAF50',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Home" component={HomeNavigator} />
            <Tab.Screen name="Workouts" component={WorkoutsNavigator} />
            <Tab.Screen name="Nutrition" component={NutritionNavigator} />
            <Tab.Screen name="Statistics" component={StatisticsNavigator} />
            <Tab.Screen name="Profile" component={ProfileNavigator} />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}