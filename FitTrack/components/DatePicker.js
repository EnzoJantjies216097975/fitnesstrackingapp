import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DatePicker = ({ selectedDate, onDateChange }) => {
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange(prevDay);
  };
  
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Don't allow selecting future dates
    if (nextDay <= new Date()) {
      onDateChange(nextDay);
    }
  };
  
  const goToToday = () => {
    onDateChange(new Date());
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={goToPreviousDay}
      >
        <Ionicons name="chevron-back" size={24} color="#757575" />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.dateContainer}
        onPress={goToToday}
      >
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        {!isToday(selectedDate) && (
          <Text style={styles.todayText}>Today</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={goToNextDay}
        disabled={isToday(selectedDate)}
      >
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={isToday(selectedDate) ? '#D3D3D3' : '#757575'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  arrowButton: {
    padding: 12,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  todayText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default DatePicker;