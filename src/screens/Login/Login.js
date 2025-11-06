import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
// import {userLogin} from '../../redux/Slicer/loginSlicer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { userLogin } from '../../redux/Slicers/loginSlicer';
import { useToast } from 'react-native-toast-notifications';

const { width, height } = Dimensions.get('window');

const LoginScreen = props => {
  const [formData, setFormData] = useState({
    UserType: 'User',
    Email: '',
    Password: '',
  });
  const [errors, setErrors] = useState({
    Email: '',
    Password: '',
  });
  const [loader, setloader] = useState(false)

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toast = useToast();


  // Handle input changes
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validation function
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      Email: '',
      Password: '',
    };

    // Validate User ID (Mobile Number)
    if (!formData.Email.trim()) {
      newErrors.Email = 'Kindly provide a valid email or mobile number.';
      valid = false;
    }

    // Validate Password
    if (!formData.Password) {
      newErrors.Password = 'Kindly provide your password.';
      valid = false;
    }

    setErrors(newErrors);
    setloader(false)

    return valid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setloader(true)

      // Simulate API call or authentication
      console.log('Form submitted:', formData);
      dispatch(userLogin(formData)).then(async res => {
        console.log('res', res)
        if (res?.IsCustomer) {
          setloader(false)
          const dta = JSON.stringify(res);
          await AsyncStorage.setItem('userDta', dta);
          toast.show('Login Successful 🎉', {
            type: 'success',
            placement: 'top',
            style: { marginTop: '12%' },
            duration: 3000,
            animationType: 'slide-in',
          });

          // Navigate after a short delay so toast is visible
          setTimeout(() => {
            navigation.navigate('Welcome');
          }, 500);

          // Alert.alert('Successfull', 'You are successfully signed in.Enjoy learning!');
        } else {
          setloader(false)
          toast.show('Invalid email or password. Please try again.', {
            type: 'danger',
            placement: 'top',
            style: { marginTop: '12%' },
            duration: 3000,
            animationType: 'slide-in',
          });
          // Alert.alert('Wrong Login', 'Invalid email or password. Please try again.');
        }
      });

      // Show success message
      // Alert.alert('Login Successful', 'You have successfully logged in!', [
      //   {
      //     text: 'OK',
      //     onPress: () =>
      //       props.navigation.navigate('DrawerTabs', {screen: 'Dashboard'}),
      //   },
      // ]);

      // In a real app, you would call your authentication API here
      // Example:
      /*
      authAPI.login(formData)
        .then(response => {
          // Handle successful login
          props.navigation.navigate('DrawerTabs', {screen: 'Dashboard'});
        })
        .catch(error => {
          Alert.alert('Login Failed', error.message);
        });
      */
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../asset/bg.jpg')} // your background image path
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://your-logo-url.com/logo.png' }}
              style={styles.logo}
            />
            <Text style={styles.title}>Login</Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {/* Illustration */}
            <Image
              source={require('../../asset/logo.png')}
              style={styles.illustration}
            />

            {/* User ID Input */}
            <Text style={styles.label}>Userid</Text>
            <TextInput
              style={[styles.input, errors.Email && styles.errorInput]}
              placeholder="Email or Mobile Number"
              placeholderTextColor={'#D3D3D3'}
              value={formData.Email}
              onChangeText={text => handleChange('Email', text)}
            />
            {errors.Email ? (
              <Text style={styles.errorText}>{errors.Email}</Text>
            ) : null}

            {/* Password Input */}
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={[styles.input, errors.Password && styles.errorInput]}
              placeholder="Your Password"
              placeholderTextColor={'#D3D3D3'}
              secureTextEntry
              value={formData.Password}
              onChangeText={text => handleChange('Password', text)}
            />
            {errors.Password ? (
              <Text style={styles.errorText}>{errors.Password}</Text>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSubmit}
              activeOpacity={0.8}>
              {loader ? <ActivityIndicator color={'#fff'} size={'small'} /> : <Text style={styles.loginButtonText}>Login</Text>}
            </TouchableOpacity>

            {/* Links */}
            <View style={styles.links}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.7}>
                <Text style={styles.linkText}>
                  New here? <Text style={{ color: '#F6BE00', fontWeight: '700', fontSize: 16 }}>Create an account</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ForgetPassword')}>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => Linking.openURL('https://app.careercarrier.org/Home/TermsConditions')}>
                <Text style={styles.linkText}>Terms and Condition</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      {/* Background Gradient */}
      {/* <LinearGradient colors={['#1a2942', '#3e3e3e']} style={styles.background}> */}
      {/* Header Section */}

      {/* </LinearGradient> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  background: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.05,
  },
  header: {
    alignItems: 'center',
    paddingVertical: height * 0.03,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: height * 0.02,
  },
  title: {
    color: '#fff',
    fontSize: width * 0.06,
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#fff',
    marginHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    padding: width * 0.05,
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  illustration: {
    width: width * 0.3,
    height: width * 0.3,
    alignSelf: 'center',
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    color: '#1a2942',
  },
  input: {
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#fff',
    color: '#000',
  },
  errorInput: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: width * 0.03,
    marginBottom: height * 0.02,
  },
  loginButton: {
    backgroundColor: '#1a2942',
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: width * 0.8,
    marginTop: height * 0.01,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  links: {
    marginTop: height * 0.03,
    alignItems: 'center',
  },
  linkText: {
    color: '#1a2942',
    marginVertical: height * 0.01,
    fontSize: width * 0.035,
    fontWeight: '500',
  },
});

export default LoginScreen;
