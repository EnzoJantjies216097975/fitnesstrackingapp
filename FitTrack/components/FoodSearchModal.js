// src/components/FoodSearchModal.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchFoods } from './api/nutritionApi';

const FoodSearchModal = ({ onSelectFood }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingSize, setServingSize] = useState('1');
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchFoods(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching foods', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setServingSize('1');
  };
  
  const handleAddFood = () => {
    if (!selectedFood) return;
    
    const servingSizeNum = parseFloat(servingSize);
    if (isNaN(servingSizeNum) || servingSizeNum <= 0) return;
    
    const foodToAdd = {
      id: Date.now().toString(),
      name: selectedFood.name,
      servingSize: servingSizeNum,
      servingUnit: selectedFood.servingUnit,
      calories: Math.round(selectedFood.calories * servingSizeNum),
      carbs: Math.round(selectedFood.carbs * servingSizeNum),
      protein: Math.round(selectedFood.protein * servingSizeNum),
      fat: Math.round(selectedFood.fat * servingSizeNum),
    };
    
    onSelectFood(foodToAdd);
    
    // Reset selections
    setSelectedFood(null);
    setServingSize('1');
    setModalVisible(false);
  };
  
  return (
    <>
      <TouchableOpacity
        style={styles.addFoodButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle" size={20} color="#4CAF50" />
        <Text style={styles.addFoodButtonText}>Add Food</Text>
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Foods</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a food..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Ionicons name="search" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : selectedFood ? (
              <View style={styles.foodDetailsContainer}>
                <Text style={styles.foodDetailsTitle}>Food Details</Text>
                
                <View style={styles.foodDetails}>
                  <Text style={styles.foodName}>{selectedFood.name}</Text>
                  
                  <View style={styles.servingSizeContainer}>
                    <Text style={styles.servingSizeLabel}>Serving Size:</Text>
                    <TextInput
                      style={styles.servingSizeInput}
                      value={servingSize}
                      onChangeText={setServingSize}
                      keyboardType="decimal-pad"
                    />
                    <Text style={styles.servingUnit}>{selectedFood.servingUnit}</Text>
                  </View>
                  
                  <View style={styles.nutrientRow}>
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientValue}>
                        {Math.round(selectedFood.fat * parseFloat(servingSize || 0))}g
                      </Text>
                      <Text style={styles.nutrientLabel}>Fat</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddFood}
                  >
                    <Text style={styles.addButtonText}>Add to Meal</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setSelectedFood(null)}
                  >
                    <Text style={styles.backButtonText}>Back to Search</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.foodItem}
                    onPress={() => handleSelectFood(item)}
                  >
                    <View style={styles.foodItemDetails}>
                      <Text style={styles.foodItemName}>{item.name}</Text>
                      <Text style={styles.foodItemServing}>
                        {item.servingSize} {item.servingUnit}
                      </Text>
                    </View>
                    <Text style={styles.foodItemCalories}>{item.calories} cal</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyResultsContainer}>
                    <Text style={styles.emptyResultsText}>
                      {searchQuery.trim() ? 'No foods found. Try another search term.' : 'Search for foods to add to your meal.'}
                    </Text>
                  </View>
                }
                style={styles.foodsList}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  addFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  addFoodButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
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
    height: '80%',
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  foodsList: {
    flex: 1,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  foodItemDetails: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  foodItemServing: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  foodItemCalories: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyResultsText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  foodDetailsContainer: {
    flex: 1,
  },
  foodDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  foodDetails: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  servingSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  servingSizeLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  servingSizeInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 8,
    width: 60,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  servingUnit: {
    marginLeft: 8,
    fontSize: 16,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nutrientItem: {
    alignItems: 'center',
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FoodSearchModal;