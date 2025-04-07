import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}

type DateRangePreset = 'week' | 'month' | 'custom';

const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange 
}) => {
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
  const [predefinedRange, setPredefinedRange] = useState<DateRangePreset>('week');
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const handleStartDateChange = (event: any, date?: Date) => {
    setShowStartPicker(false);
    if (date) {
      // Don't allow start date after end date or after today
      const today = new Date();
      if (date > endDate || date > today) {
        return;
      }
      
      onStartDateChange(date);
      setPredefinedRange('custom');
    }
  };
  
  const handleEndDateChange = (event: any, date?: Date) => {
    setShowEndPicker(false);
    if (date) {
      // Don't allow end date before start date or after today
      const today = new Date();
      if (date < startDate || date > today) {
        return;
      }
      
      onEndDateChange(date);
      setPredefinedRange('custom');
    }
  };
  
  const setLastWeek = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
    
    onStartDateChange(oneWeekAgo);
    onEndDateChange(today);
    setPredefinedRange('week');
  };
  
  const setLastMonth = () => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 29);
    
    onStartDateChange(oneMonthAgo);
    onEndDateChange(today);
    setPredefinedRange('month');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.dateLabel}>From:</Text>
          <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
        </TouchableOpacity>
        
        <Ionicons name="arrow-forward" size={16} color="#757575" />
        
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.dateLabel}>To:</Text>
          <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.rangeButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.rangeButton,
            predefinedRange === 'week' && styles.activeRangeButton
          ]}
          onPress={setLastWeek}
        >
          <Text
            style={[
              styles.rangeButtonText,
              predefinedRange === 'week' && styles.activeRangeButtonText
            ]}
          >
            Last Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.rangeButton,
            predefinedRange === 'month' && styles.activeRangeButton
          ]}
          onPress={setLastMonth}
        >
          <Text
            style={[
              styles.rangeButtonText,
              predefinedRange === 'month' && styles.activeRangeButtonText
            ]}
          >
            Last Month
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.rangeButton,
            predefinedRange === 'custom' && styles.activeRangeButton
          ]}
          disabled={predefinedRange === 'custom'}
        >
          <Text
            style={[
              styles.rangeButtonText,
              predefinedRange === 'custom' && styles.activeRangeButtonText
            ]}
          >
            Custom
          </Text>
        </TouchableOpacity>
      </View>
      
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
          maximumDate={new Date()}
        />
      )}
      
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
          maximumDate={new Date()}
        />
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
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    padding: 8,
  },
  dateLabel: {
    fontSize: 12,
    color: '#757575',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  rangeButtonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeRangeButton: {
    borderBottomColor: '#4CAF50',
  },
  rangeButtonText: {
    fontSize: 14,
    color: '#757575',
  },
  activeRangeButtonText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default DateRangePicker;