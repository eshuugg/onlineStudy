import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {navigationRef} from './src/components/PageNavigations/PageNavigtion';

const axiosInstance = axios.create({
  baseURL: 'https://demo.careercarrier.org/api/',
});

axiosInstance.interceptors.request.use(async config => {
  const value = await AsyncStorage.getItem('userDta');
  const dta = JSON.parse(value);
  console.log('dta', dta);
  if (value !== null) {
    config.headers = {
      'Content-Type': 'application/json',
      SecurityCode: dta.SecurityCode,
    };
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    console.log('erroewer', error.response.status);
    if (error.response.status === 401) {
      await AsyncStorage.removeItem('userDta');
      return navigationRef.navigate('Login');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
