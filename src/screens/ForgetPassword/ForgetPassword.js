import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Modal,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { resentOtp, verifyOtp } from '../../redux/Slicers/loginSlicer';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otpTimeout, setOtpTimeout] = useState(300); // 5 minutes
    const [otpResendDisabled, setOtpResendDisabled] = useState(false);
    const phoneInputRef = useRef();
    const otpInputRefs = useRef([]);
    const dispatch = useDispatch()
    const toast = useToast();
    const navigation = useNavigation();

    const validatePhoneNumber = () => {
        if (!phoneNumber.trim()) {
            toast.show('Please enter your phone number', {
                type: 'danger',
                placement: 'top',
                style: { marginTop: '12%' },
                duration: 3000,
                animationType: 'slide-in',
            });
            return false;
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            toast.show('Please enter a valid 10-digit phone number', {
                type: 'danger',
                placement: 'top',
                style: { marginTop: '12%' },
                duration: 3000,
                animationType: 'slide-in',
            });
            return false;
        }
        return true;
    };

    const handleSendOtp = () => {
        if (validatePhoneNumber()) {
            setIsLoading(true);
            dispatch(resentOtp({ Mobile: phoneNumber })).then(res => {
                console.log('res', res)
                // if (res) {

                // }
            })
            // Simulate API call to send OTP
            setTimeout(() => {
                setIsLoading(false);
                setOtpModalVisible(true);
                setOtpResendDisabled(true);
                setOtpTimeout(300); // Reset timer to 5 minutes
            }, 1000);
        }
    };

    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpError('');

        // Auto focus to next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    const verifyOtpData = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            setOtpError('Please enter a 6-digit OTP');
            return;
        }

        setIsLoading(true);
        dispatch(verifyOtp({ Otp: enteredOtp })).then(res => {
            console.log('res', res)
            if (res?.IsSuccess) {
                setTimeout(() => {
                    setIsLoading(false);
                    toast.show('OTP verified successfully', {
                        type: 'success',
                        placement: 'top',
                        style: { marginTop: '12%' },
                        duration: 3000,
                        animationType: 'slide-in',
                    });
                    setOtpModalVisible(false);
                    navigation.navigate('ResetPassword', { phoneNumber });
                }, 1000);
            } else {
                setIsLoading(false);
                setOtpError('Invalid OTP. Please try again.');
            }
        })
    };

    const resendOtp = () => {
        setOtpResendDisabled(true);
        setOtpTimeout(300); // Reset timer to 5 minutes
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
        dispatch(resentOtp({ Mobile: phoneNumber })).then(res => {
            console.log('res', res)
            if (res?.IsSuccess) {
                toast.show('OTP resent successfully', {
                    type: 'success',
                    placement: 'top',
                    style: { marginTop: '12%' },
                    duration: 3000,
                    animationType: 'slide-in',
                });
            } else {
                toast.show('Failed to resend OTP', {
                    type: 'danger',
                    placement: 'top',
                    style: { marginTop: '12%' },
                    duration: 3000,
                    animationType: 'slide-in',
                });
            }
        });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Countdown timer for OTP
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

    return (
        <LinearGradient colors={['#1a2942', '#3e3e3e']} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Forgot Password</Text>
                        <Text style={styles.subtitle}>
                            Enter your registered phone number to receive OTP
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                ref={phoneInputRef}
                                style={styles.input}
                                placeholder="Enter 10-digit phone number"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                maxLength={10}
                                autoFocus
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSendOtp}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Send OTP</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Text style={styles.backButtonText}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* OTP Verification Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={otpModalVisible}
                onRequestClose={() => setOtpModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>OTP Verification</Text>
                        <Text style={styles.modalSubtitle}>
                            Enter the 6-digit OTP sent to +91-{phoneNumber}
                        </Text>

                        <View style={styles.otpContainer}>
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <TextInput
                                    key={index}
                                    style={[styles.otpInput, otpError && styles.errorInput]}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    value={otp[index]}
                                    onChangeText={(text) => handleOtpChange(index, text)}
                                    ref={(ref) => (otpInputRefs.current[index] = ref)}
                                />
                            ))}
                        </View>
                        {otpError && <Text style={styles.errorText}>{otpError}</Text>}

                        <Text style={styles.timerText}>
                            {otpTimeout > 0 ? `OTP expires in ${formatTime(otpTimeout)}` : 'OTP expired'}
                        </Text>

                        <TouchableOpacity
                            style={[styles.resendButton, otpResendDisabled && styles.disabledButton]}
                            onPress={resendOtp}
                            disabled={otpResendDisabled}
                        >
                            <Text style={styles.resendButtonText}>
                                Resend OTP {otpResendDisabled && `(${formatTime(otpTimeout)})`}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={verifyOtpData}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.verifyButtonText}>Verify OTP</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        padding: 20,
        marginHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#FFDB58',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#1a2942',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#FFDB58',
        fontSize: 14,
    },
    // OTP Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 25,
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
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
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
    disabledButton: {
        opacity: 0.5,
    },
    resendButtonText: {
        color: '#1a2942',
        fontWeight: 'bold',
    },
    verifyButton: {
        backgroundColor: '#1a2942',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    verifyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ForgotPasswordScreen;