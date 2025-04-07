import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ChartData } from '../types';

const { width } = Dimensions.get('window');

interface WeeklyCalorieChartProps {
  calorieData: ChartData;
  title?: string;
  color?: string;
  showStats?: boolean;
}

const WeeklyCalorieChart: React.FC<WeeklyCalorieChartProps> = ({ 
  calorieData, 
  title = 'Weekly Calories', 
  color = '#FF9800',
  showStats = true
}) => {
  // Calculate total and average
  const totalCalories = calorieData.data.reduce((sum, cal) => sum + cal, 0);
  const avgCalories = totalCalories / calorieData.data.length;
  const maxCalories = Math.max(...calorieData.data);
  
  // Convert color hex to rgba for the chart
  const hexToRgba = (hex: string, opacity: number): string => {
    const hexValue = hex.replace('#', '');
    const r = parseInt(hexValue.substring(0, 2), 16);
    const g = parseInt(hexValue.substring(2, 4), 16);
    const b = parseInt(hexValue.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <LineChart
        data={{
          labels: calorieData.labels,
          datasets: [
            {
              data: calorieData.data,
              color: (opacity = 1) => hexToRgba(color, opacity),
              strokeWidth: 2
            }
          ]
        }}
        width={width - 48}
        height={180}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: color
          }
        }}
        bezier
        style={styles.chart}
      />
      
      {showStats && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color }]}>
              {Math.round(totalCalories)}
            </Text>
            <Text style={styles.statLabel}>Weekly Total</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color }]}>
              {Math.round(avgCalories)}
            </Text>
            <Text style={styles.statLabel}>Daily Average</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color }]}>
              {maxCalories}
            </Text>
            <Text style={styles.statLabel}>Best Day</Text>
          </View>
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
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
});

export default WeeklyCalorieChart;