import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutrientProgressBarProps {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

const NutrientProgressBar: React.FC<NutrientProgressBarProps> = ({ 
  label, 
  current, 
  goal, 
  unit, 
  color 
}) => {
  const progressPercentage = Math.min(Math.round((current / goal) * 100), 100);
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          {current}{unit} / {goal}{unit}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progressPercentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  values: {
    fontSize: 14,
    color: '#757575',
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});

export default NutrientProgressBar;

// // src/components/NutrientProgressBar.js
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const NutrientProgressBar = ({ label, current, goal, unit, color }) => {
//   const progressPercentage = Math.min(Math.round((current / goal) * 100), 100);
  
//   return (
//     <View style={styles.container}>
//       <View style={styles.labelContainer}>
//         <Text style={styles.label}>{label}</Text>
//         <Text style={styles.values}>
//           {current}{unit} / {goal}{unit}
//         </Text>
//       </View>
      
//       <View style={styles.progressContainer}>
//         <View
//           style={[
//             styles.progressBar,
//             { width: `${progressPercentage}%`, backgroundColor: color },
//           ]}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 12,
//   },
//   labelContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   values: {
//     fontSize: 14,
//     color: '#757575',
//   },
//   progressContainer: {
//     height: 10,
//     backgroundColor: '#E0E0E0',
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   progressBar: {
//     height: '100%',
//     borderRadius: 5,
//   },
// });

// export default NutrientProgressBar;