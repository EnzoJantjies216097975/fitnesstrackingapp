// src/screens/TabataTimerScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Vibration, 
  Dimensions, 
  ScrollView,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { useKeepAwake } from 'expo-keep-awake';

const { width } = Dimensions.get('window');

const TIMER_STATES = {
  READY: 'READY',
  WORK: 'WORK',
  REST: 'REST',
  FINISHED: 'FINISHED',
  PAUSED: 'PAUSED',
};

const TabataTimerScreen = ({ navigation }) => {
  useKeepAwake(); // Prevent screen from sleeping during workout
  
  // Tabata settings
  const [workDuration, setWorkDuration] = useState(20);
  const [restDuration, setRestDuration] = useState(10);
  const [rounds, setRounds] = useState(8);
  const [prepTime, setPrepTime] = useState(10);
  
  // Timer state
  const [timerState, setTimerState] = useState(TIMER_STATES.READY);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(prepTime);
  const [isRunning, setIsRunning] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  
  // Sound effects
  const workSoundRef = useRef(null);
  const restSoundRef = useRef(null);
  const finalSoundRef = useRef(null);
  
  // Load sound effects
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: workSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/work.mp3')
        );
        workSoundRef.current = workSound;
        
        const { sound: restSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/rest.mp3')
        );
        restSoundRef.current = restSound;
        
        const { sound: finalSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/finish.mp3')
        );
        finalSoundRef.current = finalSound;
      } catch (error) {
        console.error('Failed to load sounds', error);
      }
    };
    
    loadSounds();
    
    return () => {
      // Unload sounds when component unmounts
      if (workSoundRef.current) {
        workSoundRef.current.unloadAsync();
      }
      if (restSoundRef.current) {
        restSoundRef.current.unloadAsync();
      }
      if (finalSoundRef.current) {
        finalSoundRef.current.unloadAsync();
      }
    };
  }, []);
  
  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // Time's up for current phase
            switch (timerState) {
              case TIMER_STATES.READY:
                // Prep time done, start first work interval
                playSound('work');
                vibrate();
                setTimerState(TIMER_STATES.WORK);
                return workDuration;
                
              case TIMER_STATES.WORK:
                // Work interval done
                if (currentRound < rounds) {
                  // Go to rest interval
                  playSound('rest');
                  vibrate();
                  setTimerState(TIMER_STATES.REST);
                  return restDuration;
                } else {
                  // Workout complete
                  playSound('finish');
                  vibrate([500, 500, 500]);
                  setIsRunning(false);
                  setTimerState(TIMER_STATES.FINISHED);
                  return 0;
                }
                
              case TIMER_STATES.REST:
                // Rest interval done, start next work interval
                playSound('work');
                vibrate();
                setCurrentRound(prev => prev + 1);
                setTimerState(TIMER_STATES.WORK);
                return workDuration;
                
              default:
                return prevTime;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timerState, currentRound, rounds, workDuration, restDuration]);
  
  const playSound = async (type) => {
    try {
      switch (type) {
        case 'work':
          if (workSoundRef.current) {
            await workSoundRef.current.replayAsync();
          }
          break;
          
        case 'rest':
          if (restSoundRef.current) {
            await restSoundRef.current.replayAsync();
          }
          break;
          
        case 'finish':
          if (finalSoundRef.current) {
            await finalSoundRef.current.replayAsync();
          }
          break;
      }
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  };
  
  const vibrate = (pattern = [400, 100, 400]) => {
    Vibration.vibrate(pattern);
  };
  
  const startTimer = () => {
    if (timerState === TIMER_STATES.READY || timerState === TIMER_STATES.PAUSED) {
      setIsRunning(true);
    } else if (timerState === TIMER_STATES.FINISHED) {
      resetTimer();
      setIsRunning(true);
    }
  };
  
  const pauseTimer = () => {
    setIsRunning(false);
    setTimerState(TIMER_STATES.PAUSED);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimerState(TIMER_STATES.READY);
    setCurrentRound(0);
    setTimeLeft(prepTime);
  };
  
  const renderTimerControls = () => {
    if (timerState === TIMER_STATES.FINISHED) {
      return (
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={resetTimer}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.controlButtonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.controlsContainer}>
        {isRunning ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={pauseTimer}
          >
            <Ionicons name="pause" size={24} color="#fff" />
            <Text style={styles.controlButtonText}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.startButton]}
            onPress={startTimer}
          >
            <Ionicons name="play" size={24} color="#fff" />
            <Text style={styles.controlButtonText}>
              {timerState === TIMER_STATES.PAUSED ? 'Resume' : 'Start'}
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={resetTimer}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
          <Text style={styles.controlButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const getTimerStatusColor = () => {
    switch (timerState) {
      case TIMER_STATES.WORK:
        return '#e53935'; // Red for work
      case TIMER_STATES.REST:
        return '#43a047'; // Green for rest
      case TIMER_STATES.FINISHED:
        return '#3949ab'; // Blue for finished
      default:
        return '#757575'; // Grey for ready/paused
    }
  };
  
  const getTimerStatusText = () => {
    switch (timerState) {
      case TIMER_STATES.READY:
        return 'GET READY';
      case TIMER_STATES.WORK:
        return 'WORK';
      case TIMER_STATES.REST:
        return 'REST';
      case TIMER_STATES.PAUSED:
        return 'PAUSED';
      case TIMER_STATES.FINISHED:
        return 'FINISHED';
      default:
        return '';
    }
  };
  
  const saveSettings = () => {
    setSettingsVisible(false);
    resetTimer(); // Reset timer with new settings
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Tabata Timer</Text>
        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.timerContainer}>
        <View 
          style={[
            styles.timerStatusContainer,
            { backgroundColor: getTimerStatusColor() }
          ]}
        >
          <Text style={styles.timerStatusText}>
            {getTimerStatusText()}
          </Text>
          {timerState === TIMER_STATES.WORK && (
            <Text style={styles.roundText}>Round {currentRound}/{rounds}</Text>
          )}
        </View>
        
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{timeLeft}</Text>
          <Text style={styles.secondsText}>seconds</Text>
        </View>
        
        {renderTimerControls()}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={24} color="#757575" />
          <Text style={styles.infoLabel}>Work</Text>
          <Text style={styles.infoValue}>{workDuration}s</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="bed-outline" size={24} color="#757575" />
          <Text style={styles.infoLabel}>Rest</Text>
          <Text style={styles.infoValue}>{restDuration}s</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="repeat-outline" size={24} color="#757575" />
          <Text style={styles.infoLabel}>Rounds</Text>
          <Text style={styles.infoValue}>{rounds}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="hourglass-outline" size={24} color="#757575" />
          <Text style={styles.infoLabel}>Total</Text>
          <Text style={styles.infoValue}>
            {Math.floor((workDuration + restDuration) * rounds / 60)}:{((workDuration + restDuration) * rounds % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      </View>
      
      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tabata Settings</Text>
              <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Work Duration: {workDuration}s</Text>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={60}
                step={5}
                value={workDuration}
                onValueChange={setWorkDuration}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#4CAF50"
              />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={saveSettings}
                >
                  <Text style={styles.saveButtonText}>Save Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  timerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerStatusContainer: {
    width: width - 40,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerStatusText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  roundText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#4CAF50',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  secondsText: {
    fontSize: 16,
    color: '#757575',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFC107',
  },
  resetButton: {
    backgroundColor: '#757575',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    color: '#757575',
    fontSize: 14,
    marginTop: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    elevation: 5,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
              />
              
              <Text style={styles.settingLabel}>Rest Duration: {restDuration}s</Text>
              <Slider
                style={styles.slider}
                minimumValue={5}
                maximumValue={60}
                step={5}
                value={restDuration}
                onValueChange={setRestDuration}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#4CAF50"
              />
              
              <Text style={styles.settingLabel}>Number of Rounds: {rounds}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                step={1}
                value={rounds}
                onValueChange={setRounds}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#4CAF50"
              />
              
              <Text style={styles.settingLabel}>Preparation Time: {prepTime}s</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={30}
                step={5}
                value={prepTime}
                onValueChange={setPrepTime}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#4CAF50"