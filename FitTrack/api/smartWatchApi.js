// src/api/smartWatchApi.js - Integration with Volkano Smart Watch API
import { Platform } from 'react-native';
import * as BleManager from 'react-native-ble-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Volkano Smart Watch specific identifiers
const VOLKANO_SERVICE_UUID = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'; // Replace with actual UUID
const HEART_RATE_CHARACTERISTIC = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'; // Replace with actual UUID
const STEP_COUNT_CHARACTERISTIC = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'; // Replace with actual UUID

class SmartWatchAPI {
  constructor() {
    this.deviceId = null;
    this.isConnected = false;
    this.listeners = [];
    this.heartRate = 0;
    this.steps = 0;
    this.calories = 0;
  }

  // Initialize BLE manager
  async init() {
    try {
      await BleManager.start({ showAlert: false });
      console.log('BLE Manager initialized');
      
      // Load previously connected device
      const savedDeviceId = await AsyncStorage.getItem('volkanoDeviceId');
      if (savedDeviceId) {
        this.deviceId = savedDeviceId;
        this.tryConnect();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize BLE Manager', error);
      return false;
    }
  }

  // Scan for nearby Volkano devices
  async scanForDevices() {
    try {
      await BleManager.scan([], 5, true);
      return new Promise((resolve) => {
        const subscription = BleManager.addListener('BleManagerDiscoverPeripheral', async (device) => {
          // Filter for Volkano devices
          if (device.name && device.name.includes('Volkano')) {
            const devices = await BleManager.getDiscoveredPeripherals();
            resolve(devices.filter(d => d.name && d.name.includes('Volkano')));
            subscription.remove();
          }
        });
        
        // Timeout after 5 seconds
        setTimeout(() => {
          subscription.remove();
          resolve([]);
        }, 5000);
      });
    } catch (error) {
      console.error('Error scanning for devices', error);
      return [];
    }
  }

  // Connect to a specific Volkano device
  async connectToDevice(deviceId) {
    try {
      await BleManager.connect(deviceId);
      console.log(`Connected to device: ${deviceId}`);
      
      // Discover services and characteristics
      await BleManager.retrieveServices(deviceId);
      
      // Save connected device
      this.deviceId = deviceId;
      this.isConnected = true;
      AsyncStorage.setItem('volkanoDeviceId', deviceId);
      
      // Start listening for heart rate updates
      this.startHeartRateNotifications();
      
      // Start listening for step count updates
      this.startStepCountNotifications();
      
      return true;
    } catch (error) {
      console.error(`Failed to connect to device: ${deviceId}`, error);
      return false;
    }
  }

  // Try to connect to previously paired device
  async tryConnect() {
    if (this.deviceId) {
      return this.connectToDevice(this.deviceId);
    }
    return false;
  }

  // Disconnect from device
  async disconnect() {
    if (this.deviceId && this.isConnected) {
      try {
        await BleManager.disconnect(this.deviceId);
        this.isConnected = false;
        console.log(`Disconnected from device: ${this.deviceId}`);
        return true;
      } catch (error) {
        console.error(`Failed to disconnect from device: ${this.deviceId}`, error);
        return false;
      }
    }
    return false;
  }

  // Start notifications for heart rate changes
  async startHeartRateNotifications() {
    if (!this.deviceId || !this.isConnected) return false;
    
    try {
      await BleManager.startNotification(
        this.deviceId,
        VOLKANO_SERVICE_UUID,
        HEART_RATE_CHARACTERISTIC
      );
      
      // Add listener for heart rate notifications
      this.listeners.push(
        BleManager.addListener('BleManagerDidUpdateValueForCharacteristic', ({ value, peripheral, characteristic }) => {
          if (peripheral === this.deviceId && characteristic === HEART_RATE_CHARACTERISTIC) {
            // Parse heart rate value based on Volkano's data format
            // This is an example - adjust based on actual data format
            this.heartRate = value[1];
            
            // Estimate calories burned based on heart rate
            this.updateCaloriesBurned();
          }
        })
      );
      
      return true;
    } catch (error) {
      console.error('Failed to start heart rate notifications', error);
      return false;
    }
  }

  // Start notifications for step count changes
  async startStepCountNotifications() {
    if (!this.deviceId || !this.isConnected) return false;
    
    try {
      await BleManager.startNotification(
        this.deviceId,
        VOLKANO_SERVICE_UUID,
        STEP_COUNT_CHARACTERISTIC
      );
      
      // Add listener for step count notifications
      this.listeners.push(
        BleManager.addListener('BleManagerDidUpdateValueForCharacteristic', ({ value, peripheral, characteristic }) => {
          if (peripheral === this.deviceId && characteristic === STEP_COUNT_CHARACTERISTIC) {
            // Parse step count value based on Volkano's data format
            // This is an example - adjust based on actual data format
            this.steps = (value[0] << 8) | value[1];
          }
        })
      );
      
      return true;
    } catch (error) {
      console.error('Failed to start step count notifications', error);
      return false;
    }
  }

  // Get current heart rate
  getHeartRate() {
    return this.heartRate;
  }

  // Get current step count
  getStepCount() {
    return this.steps;
  }

  // Get estimated calories burned
  getCaloriesBurned() {
    return this.calories;
  }

  // Update calories burned calculation based on heart rate and user profile
  async updateCaloriesBurned() {
    try {
      // Get user profile data from storage
      const userProfileJson = await AsyncStorage.getItem('userProfile');
      if (!userProfileJson) return;
      
      const userProfile = JSON.parse(userProfileJson);
      const { age, gender, weight, height } = userProfile;
      
      // Calculate calories burned using the heart rate method
      // Formula: Calories = ((-55.0969 + (0.6309 × HR) + (0.1988 × W) + (0.2017 × A))/4.184) × T
      // Where:
      // HR = Heart rate (bpm)
      // W = Weight (kg)
      // A = Age (years)
      // T = Time in minutes
      
      // For simplicity, we're calculating calories per minute
      const timeInMinutes = 1; 
      
      // Gender-specific coefficient
      const genderCoefficient = gender.toLowerCase() === 'male' ? 1 : 0.85;
      
      // Calculate BMR (Basal Metabolic Rate) using the Harris-Benedict equation
      let bmr;
      if (gender.toLowerCase() === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      // Calculate calories burned per minute using heart rate
      const caloriesPerMinute = ((-55.0969 + (0.6309 * this.heartRate) + (0.1988 * weight) + (0.2017 * age)) / 4.184) * timeInMinutes * genderCoefficient;
      
      // Accumulate calories burned
      this.calories += caloriesPerMinute > 0 ? caloriesPerMinute : 0;
      
      return this.calories;
    } catch (error) {
      console.error('Error calculating calories burned', error);
      return this.calories;
    }
  }

  // Clean up on unmount
  cleanup() {
    // Remove all listeners
    this.listeners.forEach(listener => {
      listener.remove();
    });
    this.listeners = [];
    
    // Disconnect from device
    this.disconnect();
  }
}

// Export as singleton
export default new SmartWatchAPI();

// src/screens/SmartWatchScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import SmartWatchAPI from '../api/smartWatchApi';

const SmartWatchScreen = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [heartRate, setHeartRate] = useState(0);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const isFocused = useIsFocused();
  
  // Initialize BLE and try to connect to saved device on mount
  useEffect(() => {
    const initializeBLE = async () => {
      await SmartWatchAPI.init();
      const connected = await SmartWatchAPI.tryConnect();
      setIsConnected(connected);
    };
    
    initializeBLE();
    
    // Clean up on unmount
    return () => {
      SmartWatchAPI.cleanup();
    };
  }, []);
  
  // Update UI with latest data when screen is focused
  useEffect(() => {
    if (!isFocused) return;
    
    const interval = setInterval(() => {
      if (isConnected) {
        setHeartRate(SmartWatchAPI.getHeartRate());
        setSteps(SmartWatchAPI.getStepCount());
        setCalories(Math.round(SmartWatchAPI.getCaloriesBurned()));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isFocused, isConnected]);
  
  const scanForDevices = async () => {
    setIsScanning(true);
    setDevices([]);
    
    try {
      const foundDevices = await SmartWatchAPI.scanForDevices();
      setDevices(foundDevices);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan for devices');
    } finally {
      setIsScanning(false);
    }
  };
  
  const connectToDevice = async (deviceId) => {
    const connected = await SmartWatchAPI.connectToDevice(deviceId);
    setIsConnected(connected);
    
    if (connected) {
      setDevices([]);
    } else {
      Alert.alert('Error', 'Failed to connect to device');
    }
  };
  
  const disconnectDevice = async () => {
    const disconnected = await SmartWatchAPI.disconnect();
    setIsConnected(!disconnected);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Smart Watch</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.statusContainer}>
        <View style={styles.connectionStatus}>
          <Ionicons
            name={isConnected ? 'bluetooth' : 'bluetooth-outline'}
            size={24}
            color={isConnected ? '#4CAF50' : '#757575'}
          />
          <Text style={styles.connectionText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
        
        {!isConnected ? (
          <TouchableOpacity
            style={styles.scanButton}
            onPress={scanForDevices}
            disabled={isScanning}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Scan for Devices'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: '#F44336' }]}
            onPress={disconnectDevice}
          >
            <Text style={styles.scanButtonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isScanning && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Scanning for Volkano devices...</Text>
        </View>
      )}
      
      {devices.length > 0 && (
        <View style={styles.devicesContainer}>
          <Text style={styles.devicesTitle}>Available Devices</Text>
          {devices.map(device => (
            <TouchableOpacity
              key={device.id}
              style={styles.deviceItem}
              onPress={() => connectToDevice(device.id)}
            >
              <Ionicons name="watch-outline" size={24} color="#4CAF50" />
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceId}>{device.id}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#757575" />
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {isConnected && (
        <View style={styles.metricsContainer}>
          <Text style={styles.metricsTitle}>Health Metrics</Text>
          
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Ionicons name="heart" size={32} color="#F44336" />
              <Text style={styles.metricValue}>{heartRate}</Text>
              <Text style={styles.metricLabel}>BPM</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Ionicons name="footsteps" size={32} color="#2196F3" />
              <Text style={styles.metricValue}>{steps}</Text>
              <Text style={styles.metricLabel}>Steps</Text>
            </View>
          </View>
          
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Ionicons name="flame" size={32} color="#FF9800" />
              <Text style={styles.metricValue}>{calories}</Text>
              <Text style={styles.metricLabel}>Calories</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
},
statusContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  padding: 16,
  marginHorizontal: 16,
  marginTop: 16,
},
connectionStatus: {
  flexDirection: 'row',
  alignItems: 'center',
},
connectionText: {
  marginLeft: 8,
  fontSize: 16,
  fontWeight: '500',
},
scanButton: {
  backgroundColor: '#4CAF50',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 4,
},
scanButtonText: {
  color: '#fff',
  fontWeight: '600',
},
loadingContainer: {
  alignItems: 'center',
  marginTop: 32,
  marginBottom: 16,
},
loadingText: {
  marginTop: 8,
  fontSize: 16,
  color: '#757575',
},
devicesContainer: {
  margin: 16,
},
devicesTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 16,
},
deviceItem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  padding: 16,
  marginBottom: 8,
},
deviceInfo: {
  flex: 1,
  marginLeft: 16,
},
deviceName: {
  fontSize: 16,
  fontWeight: '500',
},
deviceId: {
  fontSize: 12,
  color: '#757575',
  marginTop: 4,
},
metricsContainer: {
  margin: 16,
},
metricsTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 16,
},
metricRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 16,
},
metricItem: {
  flex: 1,
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  padding: 16,
  marginHorizontal: 4,
},
metricValue: {
  fontSize: 24,
  fontWeight: 'bold',
  marginTop: 8,
},
metricLabel: {
  fontSize: 14,
  color: '#757575',
  marginTop: 4,
},
});

export default SmartWatchScreen;