// import React from 'react';
// import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

// const CustomButton = ({ onPress, text, loading, disabled }) => {
//   return (
//     <TouchableOpacity
//       style={[styles.button, disabled && styles.disabledButton]}
//       onPress={onPress}
//       disabled={loading || disabled}
//     >
//       {loading ? (
//         <ActivityIndicator color={'#fff'} size={20} />
//       ) : (
//         <Text style={styles.buttonText}>{text}</Text>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: '#9496fa',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width:'70%'
//   },
//   disabledButton: {
//     backgroundColor: '#A9A9A9', // Greyed out when disabled
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default CustomButton;

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const CustomButton = ({
  onPress,
  text,
  loading,
  disabled,
  width = '100%',
  backgroundColor = '#9496fa',
  borderWidth = 0,
  borderColor = 'transparent',
  color = '#fff',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {width, backgroundColor, borderWidth, borderColor, color},
        disabled && styles.disabledButton,
      ]}
      onPress={!loading ? onPress : null}
      disabled={loading || disabled}>
      {loading ? (
        <ActivityIndicator color={color} size={20} />
      ) : (
        <Text style={[styles.buttonText, {color}]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // Greyed out when disabled
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
