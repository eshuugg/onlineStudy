import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { forgetPasswordDetails } from '../../redux/Slicers/loginSlicer';

const ResetPasswordScreen = ({ navigation, route }) => {
    // Get phone number from navigation params
    const { phoneNumber } = route.params;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const toast = useToast();

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
            valid = false;
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
            valid = false;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            valid = false;
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleResetPassword = () => {
        if (validateForm()) {
            setIsLoading(true);
            dispatch(forgetPasswordDetails({
                Mobile: phoneNumber,
                Password: newPassword
            })).then(res => {
                console.log('res', res)
                if (res?.IsSuccess) {
                    setTimeout(() => {
                        setIsLoading(false);
                        toast.show('Password reset successfully', {
                            type: 'success',
                            placement: 'top',
                            style: { marginTop: '12%' },
                            duration: 3000,
                            animationType: 'slide-in',
                        });
                        navigation.navigate('Login');
                    }, 1500);
                } else {
                    setIsLoading(false);
                    toast.show('Failed to reset password', {
                        type: 'danger',
                        placement: 'top',
                        style: { marginTop: '12%' },
                        duration: 3000,
                        animationType: 'slide-in',
                    });
                }
            })
            // Simulate API call to reset password

        }
    };

    return (
        <LinearGradient colors={['#1a2942', '#3e3e3e']} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>
                            Create a new password for your account
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={[styles.input, errors.newPassword && styles.errorInput]}
                                    placeholder="Enter new password"
                                    placeholderTextColor="#999"
                                    secureTextEntry={!passwordVisible}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TouchableOpacity
                                    style={styles.visibilityToggle}
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                >
                                    <Text style={styles.visibilityToggleText}>
                                        {passwordVisible ? 'Hide' : 'Show'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {errors.newPassword && (
                                <Text style={styles.errorText}>{errors.newPassword}</Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={[styles.input, errors.confirmPassword && styles.errorInput]}
                                    placeholder="Confirm new password"
                                    placeholderTextColor="#999"
                                    secureTextEntry={!confirmPasswordVisible}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity
                                    style={styles.visibilityToggle}
                                    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                >
                                    <Text style={styles.visibilityToggleText}>
                                        {confirmPasswordVisible ? 'Hide' : 'Show'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                            )}
                        </View>

                        <Text style={styles.phoneNumberText}>
                            For phone number: +91-{phoneNumber}
                        </Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleResetPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Reset Password</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Text style={styles.backButtonText}>Back to OTP Verification</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
    },
    input: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    errorInput: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    visibilityToggle: {
        padding: 15,
    },
    visibilityToggleText: {
        color: '#1a2942',
        fontWeight: 'bold',
    },
    phoneNumberText: {
        color: '#FFDB58',
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 15,
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
});

export default ResetPasswordScreen;