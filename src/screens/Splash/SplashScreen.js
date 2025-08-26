import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = props => {
  const [animating, setAnimating] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(async () => {
      setAnimating(false);
      const value = await AsyncStorage.getItem('userDta');
      const dta = JSON.parse(value);
      console.log('dta', dta);
      if (dta !== null) {
        navigation.replace('Welcome');
      } else {
        navigation.replace('Login');
      }
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#f8a540'} />
      <View style={styles.logoContainer}>
        <Image
          source={require('../../asset/logo.png')}
          style={styles.logoStyle}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default SplashScreen;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8a540',
    padding: windowWidth * 0.04, // Responsive padding based on screen width
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    width: windowWidth * 0.7, // 70% of screen width
    height: windowHeight * 0.3, // 30% of screen height
    maxWidth: 400, // Maximum size for very large screens
    maxHeight: 300,
  },
  buttonStyle: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 15,
    width: windowWidth * 0.8, // 80% of screen width
    alignSelf: 'center',
  },
});