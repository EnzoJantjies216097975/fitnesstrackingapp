import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CalorieTargetCard = ({ 
  caloriesConsumed, 
  calorieTarget, 
  caloriesBurned = 0, 
  showRemaining = true 
}) => {
  // Calculate calories remaining (target - consumed + burned)
  const caloriesRemaining = calorieTarget - caloriesConsumed + caloriesBurned;
  
  // Calculate percentage of target consumed
  const percentConsumed = Math.min(100, Math.round((caloriesConsumed / calorieTarget) * 100));
  
  // Determine color based on percentage
  const getColor = () => {
    if (percentConsumed < 75) return '#4CAF50'; // Green
    if (percentConsumed < 90) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calorie Target</Text>
        {caloriesBurned > 0 && (
          <View style={styles.burnedContainer}>
            <Ionicons name="flame-outline" size={16} color="#FF9800" />
            <Text style={styles.burnedText}>+{Math.round(caloriesBurned)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.calorieDisplay}>
        <Text style={styles.consumed}>{Math.round(caloriesConsumed)}</Text>
        <Text style={styles.separator}>/</Text>
        <Text style={styles.target}>{calorieTarget}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${percentConsumed}%`, backgroundColor: getColor() }
          ]} 
        />
      </View>
      
      {showRemaining && (
        <View style={styles.remainingContainer}>
          <Text style={styles.remainingLabel}>
            {caloriesRemaining >= 0 ? 'Remaining' : 'Exceeded by'}:
          </Text>
          <Text 
            style={[
              styles.remainingValue,
              { color: caloriesRemaining >= 0 ? '#4CAF50' : '#F44336' }
            ]}
          >
            {Math.abs(Math.round(caloriesRemaining))} cal
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  burnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  burnedText: {
    color: '#FF9800',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  calorieDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  consumed: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    fontSize: 20,
    fontWeight: '600',
    color: '#757575',
    marginHorizontal: 4,
  },
  target: {
    fontSize: 16,
    color: '#757575',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  remainingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  remainingLabel: {
    fontSize: 14,
    color: '#757575',
  },
  remainingValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CalorieTargetCard;