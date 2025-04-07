// src/screens/WorkoutsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import WorkoutCard from '../components/WorkoutCard';
import { fetchWorkouts } from '../redux/actions/workoutActions';

const WorkoutsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { workouts, loading } = useSelector(state => state.workouts);

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  const renderWorkoutCard = ({ item }) => (
    <WorkoutCard
      workout={item}
      onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Workouts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateWorkout')}
        >
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <Text style={styles.addButtonText}>New Workout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <Text>Loading workouts...</Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkoutCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.workoutsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>No workouts found</Text>
              <Text style={styles.emptyListSubText}>Create your first workout now!</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  workoutsList: {
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyListSubText: {
    fontSize: 14,
    color: '#757575',
  },
});

export default WorkoutsScreen;

// src/screens/CreateWorkoutScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import ExerciseSelector from '../components/ExerciseSelector';
import { createWorkout } from '../redux/actions/workoutActions';

const CreateWorkoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState([]);

  const addExercise = exercise => {
    setExercises([...exercises, { ...exercise, sets: [], id: Date.now().toString() }]);
  };

  const removeExercise = exerciseId => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const addSet = (exerciseId, set) => {
    setExercises(
      exercises.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: [...ex.sets, { id: Date.now().toString(), ...set }],
          };
        }
        return ex;
      })
    );
  };

  const removeSet = (exerciseId, setId) => {
    setExercises(
      exercises.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.filter(set => set.id !== setId),
          };
        }
        return ex;
      })
    );
  };

  const saveWorkout = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please provide a workout name');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    const workout = {
      id: Date.now().toString(),
      name,
      description,
      exercises,
      createdAt: new Date().toISOString(),
    };

    dispatch(createWorkout(workout));
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Workout</Text>
        <TouchableOpacity onPress={saveWorkout}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Workout Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Full Body Workout"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your workout"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.exercisesContainer}>
        <Text style={styles.sectionTitle}>Exercises</Text>

        {exercises.map(exercise => (
          <ExerciseItem
            key={exercise.id}
            exercise={exercise}
            onRemove={() => removeExercise(exercise.id)}
            onAddSet={set => addSet(exercise.id, set)}
            onRemoveSet={setId => removeSet(exercise.id, setId)}
          />
        ))}

        <ExerciseSelector onSelectExercise={addExercise} />
      </View>
    </ScrollView>
  );
};

const ExerciseItem = ({ exercise, onRemove, onAddSet, onRemoveSet }) => {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const addSet = () => {
    if (!reps) {
      Alert.alert('Error', 'Please enter the number of reps');
      return;
    }

    onAddSet({ reps: parseInt(reps, 10), weight: weight ? parseFloat(weight) : 0 });
    setReps('');
    setWeight('');
  };

  return (
    <View style={styles.exerciseItem}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <TouchableOpacity onPress={onRemove}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.setsContainer}>
        <View style={styles.setHeader}>
          <Text style={styles.setHeaderText}>Set</Text>
          <Text style={styles.setHeaderText}>Reps</Text>
          <Text style={styles.setHeaderText}>Weight (kg)</Text>
          <Text style={styles.setHeaderText}></Text>
        </View>

        {exercise.sets.map((set, index) => (
          <View key={set.id} style={styles.setRow}>
            <Text style={styles.setText}>{index + 1}</Text>
            <Text style={styles.setText}>{set.reps}</Text>
            <Text style={styles.setText}>{set.weight > 0 ? set.weight : '-'}</Text>
            <TouchableOpacity onPress={() => onRemoveSet(set.id)}>
              <Ionicons name="close-circle" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.addSetRow}>
          <Text style={styles.setText}>{exercise.sets.length + 1}</Text>
          <TextInput
            style={styles.setInput}
            placeholder="Reps"
            value={reps}
            onChangeText={setReps}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.setInput}
            placeholder="Weight"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={addSet}>
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exercisesContainer: {
    marginTop: 8,
  },
  exerciseItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  setsContainer: {
    marginTop: 8,
  },
  setHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    marginBottom: 8,
  },
  setHeaderText: {
    flex: 1,
    fontWeight: '600',
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setText: {
    flex: 1,
    textAlign: 'center',
  },
  addSetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  setInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
    textAlign: 'center',
  },
});

export default CreateWorkoutScreen;