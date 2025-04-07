// src/screens/NutritionScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { addMeal, deleteMeal, fetchMeals } from '../redux/actions/nutritionActions';
import DateTimePicker from '@react-native-community/datetimepicker';
import FoodSearchModal from '../components/FoodSearchModal';
import NutrientProgressBar from '../components/NutrientProgressBar';

const NutritionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { meals, totalNutrients, dailyGoals, loading } = useSelector(state => state.nutrition);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    foods: [],
    date: new Date(),
  });
  
  useEffect(() => {
    dispatch(fetchMeals(selectedDate));
  }, [dispatch, selectedDate]);
  
  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const addNewMeal = () => {
    if (!newMeal.name.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }
    
    if (newMeal.foods.length === 0) {
      Alert.alert('Error', 'Please add at least one food item');
      return;
    }
    
    dispatch(addMeal({
      ...newMeal,
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
    }));
    
    setNewMeal({
      name: '',
      foods: [],
      date: new Date(),
    });
    
    setShowAddMealModal(false);
  };
  
  const removeMeal = (mealId) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => dispatch(deleteMeal(mealId)),
          style: 'destructive',
        },
      ]
    );
  };
  
  const renderMealItem = ({ item }) => {
    const totalCalories = item.foods.reduce((sum, food) => sum + food.calories, 0);
    
    return (
      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.mealCalories}>{totalCalories} cal</Text>
        </View>
        
        <FlatList
          data={item.foods}
          keyExtractor={(food) => food.id}
          renderItem={({ item: food }) => (
            <View style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodServingSize}>{food.servingSize} {food.servingUnit}</Text>
              </View>
              <View style={styles.foodNutrients}>
                <Text style={styles.foodCalories}>{food.calories} cal</Text>
                <Text style={styles.foodMacros}>
                  {food.carbs}c {food.protein}p {food.fat}f
                </Text>
              </View>
            </View>
          )}
        />
        
        <View style={styles.mealFooter}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditMeal', { mealId: item.id })}
          >
            <Ionicons name="pencil" size={16} color="#4CAF50" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeMeal(item.id)}
          >
            <Ionicons name="trash" size={16} color="#F44336" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddMealModal(true)}
        >
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <Text style={styles.addButtonText}>Add Meal</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.dateSelector}
        onPress={() => setShowDatePicker(true)}
      >
        <Ionicons name="calendar" size={20} color="#4CAF50" />
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <Ionicons name="chevron-down" size={20} color="#757575" />
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Daily Summary</Text>
        
        <View style={styles.calorieCircle}>
          <Text style={styles.calorieValue}>{totalNutrients.calories}</Text>
          <Text style={styles.calorieLabel}>calories</Text>
          <Text style={styles.calorieGoal}>Goal: {dailyGoals.calories}</Text>
        </View>
        
        <View style={styles.macroContainer}>
          <NutrientProgressBar
            label="Carbs"
            current={totalNutrients.carbs}
            goal={dailyGoals.carbs}
            unit="g"
            color="#4CAF50"
          />
          
          <NutrientProgressBar
            label="Protein"
            current={totalNutrients.protein}
            goal={dailyGoals.protein}
            unit="g"
            color="#2196F3"
          />
          
          <NutrientProgressBar
            label="Fat"
            current={totalNutrients.fat}
            goal={dailyGoals.fat}
            unit="g"
            color="#FF9800"
          />
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Today's Meals</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading meals...</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          renderItem={renderMealItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.mealsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={48} color="#E0E0E0" />
              <Text style={styles.emptyText}>No meals tracked yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the "Add Meal" button to start tracking
              </Text>
            </View>
          }
        />
      )}
      
      {/* Add Meal Modal */}
      <Modal
        visible={showAddMealModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddMealModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Meal</Text>
              <TouchableOpacity onPress={() => setShowAddMealModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Meal Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Breakfast, Lunch, Dinner"
                value={newMeal.name}
                onChangeText={text => setNewMeal({...newMeal, name: text})}
              />
            </View>
            
            <Text style={styles.foodsTitle}>Foods</Text>
            
            {newMeal.foods.length > 0 ? (
              <FlatList
                data={newMeal.foods}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                  <View style={styles.selectedFoodItem}>
                    <View style={styles.selectedFoodInfo}>
                      <Text style={styles.selectedFoodName}>{item.name}</Text>
                      <Text style={styles.selectedFoodServingSize}>
                        {item.servingSize} {item.servingUnit} | {item.calories} cal
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        const updatedFoods = [...newMeal.foods];
                        updatedFoods.splice(index, 1);
                        setNewMeal({...newMeal, foods: updatedFoods});
                      }}
                    >
                      <Ionicons name="close-circle" size={24} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                )}
                style={styles.selectedFoodsList}
              />
            ) : (
              <View style={styles.noFoodsContainer}>
                <Text style={styles.noFoodsText}>No foods added yet</Text>
              </View>
            )}
            
            <FoodSearchModal
              onSelectFood={food => {
                setNewMeal({
                  ...newMeal,
                  foods: [...newMeal.foods, food],
                });
              }}
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddMealModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={addNewMeal}
              >
                <Text style={styles.saveButtonText}>Save Meal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 4,
    color: '#4CAF50',
    fontWeight: '600',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  dateText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: '#f5f5f5',
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calorieCircle: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calorieLabel: {
    fontSize: 14,
    color: '#757575',
  },
  calorieGoal: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  macroContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  mealsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  mealCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
  },
  foodServingSize: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  foodNutrients: {
    alignItems: 'flex-end',
  },
  foodCalories: {
    fontSize: 14,
    fontWeight: '500',
  },
  foodMacros: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  editButtonText: {
    marginLeft: 4,
    color: '#4CAF50',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    marginLeft: 4,
    color: '#F44336',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  foodsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  selectedFoodsList: {
    maxHeight: 200,
  },
  selectedFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedFoodInfo: {
    flex: 1,
  },
  selectedFoodName: {
    fontSize: 16,
  },
  selectedFoodServingSize: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  noFoodsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  noFoodsText: {
    color: '#757575',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#757575',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default NutritionScreen;





