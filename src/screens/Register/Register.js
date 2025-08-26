import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { registerData, resentOtp, verifyOtp } from '../../redux/Slicers/loginSlicer';
import { useDispatch } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');


export default function RegisterScreen(props) {
  const [formData, setFormData] = useState({
    Name: '',
    UserID: '',
    Email: '',
    Password: '',
    Mobile: '',
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpResendDisabled, setOtpResendDisabled] = useState(false);
  const [otpTimeout, setOtpTimeout] = useState(900);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const dispatch = useDispatch();
  const otpInputRefs = useRef([]);
  const toast = useToast();
  const navigation = useNavigation();


  useEffect(() => {
    let timer;
    if (otpModalVisible && otpTimeout > 0) {
      timer = setInterval(() => {
        setOtpTimeout(prev => prev - 1);
      }, 1000);
    } else if (otpTimeout === 0) {
      setOtpResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [otpModalVisible, otpTimeout]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
      valid = false;
    }

    if (!formData.UserID.trim()) {
      newErrors.UserID = 'User ID is required';
      valid = false;
    } else if (formData.UserID.length < 4) {
      newErrors.UserID = 'User ID must be at least 4 characters';
      valid = false;
    }

    if (!formData.Email.trim()) {
      newErrors.Email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.Email)) {
      newErrors.Email = 'Email is invalid';
      valid = false;
    }

    if (!formData.Password) {
      newErrors.Password = 'Password is required';
      valid = false;
    } else if (formData.Password.length < 6) {
      newErrors.Password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!formData.Mobile.trim()) {
      newErrors.Mobile = 'Mobile number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.Mobile)) {
      newErrors.Mobile = 'Mobile number must be 10 digits';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsLoading(true);
      dispatch(registerData(formData)).then(res => {
        setIsLoading(false);
        if (res?.IsSuccess) {
          setOtpModalVisible(true);
          setOtpResendDisabled(true);
          setOtpTimeout(900);
        } else {
          toast.show('Registration failed: ' + res?.Message, {
            type: 'danger',
            placement: 'top',
            style: { marginTop: '12%' },
            duration: 3000,
            animationType: 'slide-in',
          });
        }
      }).catch(error => {
        setIsLoading(false);
        toast.show('Failed to register: ' + error.message, {
          type: 'danger',
          placement: 'top',
          style: { marginTop: '12%' },
          duration: 3000,
          animationType: 'slide-in',
        });
      });
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');
  };

  const verifyOTPData = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }
    dispatch(verifyOtp({ Otp: enteredOtp })).then(res => {
      if (res.IsSuccess) {
        setTimeout(() => {
          setIsLoading(false);
          setOtpModalVisible(false);
          setRegistrationSuccess(true);
          toast.show('Registration Successful', {
            type: 'success',
            placement: 'top',
            style: { marginTop: '12%' },
            duration: 3000,
            animationType: 'slide-in',
          });
          navigation.navigate('Login');
        }, 1000);
      } else {
        setOtpError(res.message || 'Invalid OTP. Please try again.');
      }
    }).catch(error => {
      setOtpError('Failed to verify OTP. Please try again.');
      console.error('OTP Verification Error:', error);
    });
    // setIsLoading(true);


  };

  const resendOtp = () => {
    setOtpResendDisabled(true);
    setOtpTimeout(900);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    dispatch(resentOtp({ Mobile: formData.Mobile })).then(res => {
      if (res.IsSuccess) {
        toast.show('OTP resent successfully', {
          type: 'success',
          placement: 'top',
          style: { marginTop: '12%' },
          duration: 3000,
          animationType: 'slide-in',
        });
      } else {
        Alert.alert('Error', res.message || 'Failed to resend OTP');
      }
    })
    Alert.alert('OTP Resent', 'A new OTP has been sent to your mobile number');
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require('../../asset/bg.jpg')} // your background image path
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <View style={styles.header}>
                {/* <Image
                  source={{ uri: 'https://your-logo-url.com/logo.png' }}
                  style={styles.logo}
                /> */}
                <Text style={styles.title}>Register</Text>
              </View>

              <View style={styles.form}>
                <Image
                  source={require('../../asset/logo.png')}
                  style={styles.illustration}
                />

                {/* Form fields go here */}
                {/* Full Name */}
                <Text style={styles.label}>Full Name:</Text>
                <TextInput
                  style={[styles.input, errors.Name && styles.errorInput]}
                  placeholder="Enter your full name"
                  placeholderTextColor={'#D3D3D3'}
                  value={formData.Name}
                  onChangeText={(text) => handleChange('Name', text)}
                />
                {errors.Name && <Text style={styles.errorText}>{errors.Name}</Text>}

                {/* User ID */}
                <Text style={styles.label}>User ID:</Text>
                <TextInput
                  style={[styles.input, errors.UserID && styles.errorInput]}
                  placeholder="Choose a user ID"
                  placeholderTextColor={'#D3D3D3'}
                  value={formData.UserID}
                  autoCapitalize="none"
                  onChangeText={(text) => handleChange('UserID', text)}
                />
                {errors.UserID && <Text style={styles.errorText}>{errors.UserID}</Text>}

                {/* Email */}
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={[styles.input, errors.Email && styles.errorInput]}
                  placeholder="Enter your email"
                  placeholderTextColor={'#D3D3D3'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.Email}
                  onChangeText={(text) => handleChange('Email', text)}
                />
                {errors.Email && <Text style={styles.errorText}>{errors.Email}</Text>}

                {/* Password */}
                <Text style={styles.label}>Password:</Text>
                <TextInput
                  style={[styles.input, errors.Password && styles.errorInput]}
                  placeholder="Create a password"
                  placeholderTextColor={'#D3D3D3'}
                  secureTextEntry
                  value={formData.Password}
                  onChangeText={(text) => handleChange('Password', text)}
                />
                {errors.Password && <Text style={styles.errorText}>{errors.Password}</Text>}

                {/* Mobile */}
                <Text style={styles.label}>Mobile Number:</Text>
                <TextInput
                  style={[styles.input, errors.Mobile && styles.errorInput]}
                  placeholder="Enter mobile number"
                  placeholderTextColor={'#D3D3D3'}
                  keyboardType="phone-pad"
                  value={formData.Mobile}
                  onChangeText={(text) => handleChange('Mobile', text)}
                  maxLength={10}
                />
                {errors.Mobile && <Text style={styles.errorText}>{errors.Mobile}</Text>}

                {/* Register Button */}
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleSubmit}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.registerButtonText}>Register</Text>
                  )}
                </TouchableOpacity>

                {/* Link */}
                <View style={styles.links}>
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('Login')}>
                    <Text style={styles.linkText}>
                      Existing user? {' '}
                      <Text style={{ color: '#F6BE00', fontWeight: '700', fontSize: 16 }}>Login now</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>

      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Vertically center the form
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    // paddingVertical: '2%',
    marginBottom: '3%',
  },
  logo: {
    // width: '20%',
    // height: undefined,
    aspectRatio: 1,
    // marginBottom: '2%',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#fff',
    marginHorizontal: '8%',
    borderRadius: 10,
    marginBottom: '9%',
    padding: '5%',
    marginTop: '2%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  illustration: {
    width: '40%',
    height: undefined,
    aspectRatio: 1,
    alignSelf: 'center',
    marginBottom: '5%',
  },
  label: {
    fontSize: width * 0.042,
    marginBottom: '2%',
    color: '#1a2942',
    // fontWeight: '500',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#1a2942',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  links: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#1a2942',
    marginVertical: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  // OTP Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a2942',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
  },
  timerText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  resendButton: {
    padding: 10,
    alignItems: 'center',
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: '#1a2942',
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#1a2942',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#c2dfaf',
  },
});