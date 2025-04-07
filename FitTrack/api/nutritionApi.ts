// src/api/nutritionApi.js
import axios from 'axios';

// Using a nutrition database API (example: Edamam, Nutritionix, etc.)
// You'll need to register for an API key
const API_KEY = 'your_api_key';
const API_URL = 'https://api.example.com/nutrition';

// Search for foods in the database
export const searchFoods = async (query) => {
  try {
    // This is a mock implementation - replace with actual API call
    // const response = await axios.get(`${API_URL}/search`, {
    //   params: {
    //     query,
    //     api_key: API_KEY,
    //   }
    // });
    
    // Return mock data for demonstration
    return mockSearchResults(query);
  } catch (error) {
    console.error('Error searching foods:', error);
    throw error;
  }
};

// Get detailed nutrition information for a specific food
export const getFoodDetails = async (foodId) => {
  try {
    // This is a mock implementation - replace with actual API call
    // const response = await axios.get(`${API_URL}/food/${foodId}`, {
    //   params: {
    //     api_key: API_KEY,
    //   }
    // });
    
    // Return mock data for demonstration
    return mockFoodDetails(foodId);
  } catch (error) {
    console.error('Error getting food details:', error);
    throw error;
  }
};

// Mock data for demonstration purposes
const mockSearchResults = (query) => {
  const lowerQuery = query.toLowerCase();
  
  const allFoods = [
    {
      id: '1',
      name: 'Chicken Breast',
      servingSize: 100,
      servingUnit: 'g',
      calories: 165,
      carbs: 0,
      protein: 31,
      fat: 3.6,
    },
    {
      id: '2',
      name: 'Brown Rice',
      servingSize: 100,
      servingUnit: 'g',
      calories: 112,
      carbs: 24,
      protein: 2.6,
      fat: 0.9,
    },
    {
      id: '3',
      name: 'Broccoli',
      servingSize: 100,
      servingUnit: 'g',
      calories: 34,
      carbs: 7,
      protein: 2.8,
      fat: 0.4,
    },
    {
      id: '4',
      name: 'Salmon',
      servingSize: 100,
      servingUnit: 'g',
      calories: 206,
      carbs: 0,
      protein: 22,
      fat: 13,
    },
    {
      id: '5',
      name: 'Sweet Potato',
      servingSize: 100,
      servingUnit: 'g',
      calories: 86,
      carbs: 20,
      protein: 1.6,
      fat: 0.1,
    },
    {
      id: '6',
      name: 'Greek Yogurt',
      servingSize: 100,
      servingUnit: 'g',
      calories: 59,
      carbs: 3.6,
      protein: 10,
      fat: 0.4,
    },
    {
      id: '7',
      name: 'Banana',
      servingSize: 1,
      servingUnit: 'medium',
      calories: 105,
      carbs: 27,
      protein: 1.3,
      fat: 0.4,
    },
    {
      id: '8',
      name: 'Eggs',
      servingSize: 1,
      servingUnit: 'large',
      calories: 72,
      carbs: 0.4,
      protein: 6.3,
      fat: 5,
    },
    {
      id: '9',
      name: 'Avocado',
      servingSize: 1,
      servingUnit: 'medium',
      calories: 240,
      carbs: 12,
      protein: 3,
      fat: 22,
    },
    {
      id: '10',
      name: 'Whey Protein Powder',
      servingSize: 30,
      servingUnit: 'g',
      calories: 113,
      carbs: 2,
      protein: 24,
      fat: 1,
    },
  ];
  
  // Filter foods based on query
  return allFoods.filter(food => 
    food.name.toLowerCase().includes(lowerQuery)
  );
};

const mockFoodDetails = (foodId) => {
  const allFoods = [
    {
      id: '1',
      name: 'Chicken Breast',
      servingSize: 100,
      servingUnit: 'g',
      calories: 165,
      carbs: 0,
      protein: 31,
      fat: 3.6,
      nutrients: {
        cholesterol: 85,
        sodium: 74,
        potassium: 256,
        fiber: 0,
        sugar: 0,
        vitaminA: 0,
        vitaminC: 0,
        calcium: 15,
        iron: 1,
      },
    },
    // ... other detailed food items
  ];
  
  return allFoods.find(food => food.id === foodId) || null;
};Math.round(selectedFood.calories * parseFloat(servingSize || 0))}
                      </Text>
                      <Text style={styles.nutrientLabel}>Calories</Text>
                    </View>
                    
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientValue}>
                        {Math.round(selectedFood.carbs * parseFloat(servingSize || 0))}g
                      </Text>
                      <Text style={styles.nutrientLabel}>Carbs</Text>
                    </View>
                    
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientValue}>
                        {Math.round(selectedFood.protein * parseFloat(servingSize || 0))}g
                      </Text>
                      <Text style={styles.nutrientLabel}>Protein</Text>
                    </View>
                    
                    <View style={styles.nutrientItem}>
                      <Text style={styles.nutrientValue}>
                        {