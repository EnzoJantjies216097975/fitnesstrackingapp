import {
    UPDATE_USER_PROFILE,
    UPDATE_USER_SETTINGS,
    CONNECT_SMART_WATCH,
    DISCONNECT_SMART_WATCH,
  } from '../actions/types';
  
  const initialState = {
    profile: {
      name: '',
      age: 0,
      gender: '',
      weight: 0,
      height: 0,
      activityLevel: 'moderate',
    },
    settings: {
      darkMode: false,
      notifications: true,
      units: 'metric', // 'metric' or 'imperial'
    },
    smartWatch: {
      connected: false,
      deviceId: null,
      lastSyncTime: null,
    },
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_USER_PROFILE:
        return {
          ...state,
          profile: {
            ...state.profile,
            ...action.payload,
          },
        };
        
      case UPDATE_USER_SETTINGS:
        return {
          ...state,
          settings: {
            ...state.settings,
            ...action.payload,
          },
        };
        
      case CONNECT_SMART_WATCH:
        return {
          ...state,
          smartWatch: {
            connected: true,
            deviceId: action.payload.deviceId,
            lastSyncTime: new Date().toISOString(),
          },
        };
        
      case DISCONNECT_SMART_WATCH:
        return {
          ...state,
          smartWatch: {
            ...state.smartWatch,
            connected: false,
          },
        };
        
      default:
        return state;
    }
  };
  
  export default userReducer;