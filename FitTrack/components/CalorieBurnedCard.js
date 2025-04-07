import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CalorieBurnedCard = ({ calories, duration, heartRate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flame-outline" size={24} color="#FF9800" />
        <Text style={styles.title}>Calories Burned</Text>
      </View>
      
      <Text style={styles.calorieCount}>{Math.round(calories)}</Text>
      
      <View style={styles.detailsContainer}>
        {duration && (
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#757575" />
            <Text style={styles.detailText}>{duration} min</Text>
          </View>
        )}
        
        {heartRate && (
          <View style={styles.detailItem}>
            <Ionicons name="heart-outline" size={16} color="#757575" />
            <Text style={styles.detailText}>{heartRate} bpm</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#FF9800',
  },
  calorieCount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    color: '#757575',
  },
});

export default CalorieBurnedCard;