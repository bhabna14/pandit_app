import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from '../../../App';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';

const OTP = (props) => {

    const navigation = useNavigation();
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (otp.length === 6) {
            pressHandler();
        }
    }, [otp]);

    // Request user permission for notifications
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
            getFCMToken();
        }
    }

    const [fcmToken, setFcmToken] = useState(null);

    // Get the FCM token for the device
    async function getFCMToken() {
        try {
            const token = await messaging().getToken();
            console.log('FCM Token:', token);
            setFcmToken(token);
        } catch (error) {
            console.log('Error getting FCM token:', error);
        }
    }

    useEffect(() => {
        requestUserPermission();
    }, [])

    const pressHandler = async () => {
        let platformName = DeviceInfo.getSystemName();
        let deviceModel = DeviceInfo.getModel();
        setIsLoading(true);
        try {
            if (otp === "" || otp.length != 6) {
                setErrorMessage('Please enter a valid OTP');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('orderId', props.route.params.order_id);
            formData.append('otp', otp);
            formData.append('phoneNumber', props.route.params.phone);
            formData.append('device_id', fcmToken);
            formData.append('device_model', deviceModel);
            formData.append('platform', platformName);

            // console.log("formData", formData);
            // return;

            const response = await fetch(base_url + "api/pandit-verify-otp", {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Login successfully', data);
                await AsyncStorage.setItem('storeAccesstoken', data.token);
                // navigation.replace('PersonalDetails');
                getProfileStatus();
            } else {
                // Handle error response
                setErrorMessage(data.message || 'Failed to Login. Please try again.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            }
        } catch (error) {
            setErrorMessage('Failed to Login. Please try again.--');
            setShowError(true);
            console.log("Error-=-=", error);
            setTimeout(() => {
                setShowError(false);
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    }

    const getProfileStatus = async () => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            const response = await fetch(base_url + 'api/check-panditid', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const responseData = await response.json();
            if (response.ok) {
                console.log("Profile Status", responseData.message);
                if (responseData.message === "No record found") {
                    navigation.replace('PersonalDetails');
                }
                if (responseData.message === "Profile exists") {
                    // navigation.replace('Career');
                    navigation.replace('Home');
                }
                if (responseData.message === "Career exists") {
                    navigation.replace('Home');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
            <ImageBackground source={require('../../assets/images/Login_BG.png')} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                    <Image
                        source={require('../../assets/images/whitelogo.png')}
                        style={{ height: 130, width: 130, resizeMode: 'contain' }}
                    />
                </View>
                <View style={styles.footer}>
                    <Text style={{ fontSize: 16, fontFamily: 'okra', fontWeight: 'semibold', color: '#353535', marginBottom: 18, }}>Enter OTP For Login</Text>
                    <FloatingLabelInput
                        label="OTP"
                        value={otp}
                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                        labelStyles={{
                            backgroundColor: '#ffffff',
                            paddingHorizontal: 5,
                        }}
                        maxLength={6}
                        keyboardType="numeric"
                        onChangeText={value => setOtp(value)}
                        containerStyles={{
                            borderWidth: 0.5,
                            borderColor: '#353535',
                            backgroundColor: '#ffffff',
                            padding: 10,
                            borderRadius: 8,
                            marginVertical: 12,
                            marginHorizontal: 50,
                            borderRadius: 100,
                        }}
                    />
                    {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
                </View>
                <View style={styles.bottom}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#c80100" />
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={pressHandler}>
                            <Text style={styles.buttonText}>SUBMIT</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ImageBackground>
        </View>
    )
}

export default OTP

const styles = StyleSheet.create({
    footer: {
        // flex: 0.3,
        height: 135,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 10,
        marginTop: 10,
    },

    textInput: {
        fontSize: 18,
        color: '#353535',
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cacaca',
        fontFamily: 'Titillium Web',
    },
    bottom: {
        flex: 0.5,
        backgroundColor: 'transparent',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        padding: 10,
        height: 45,
        width: 150,
        marginBottom: 12,
        backgroundColor: '#c80100',
        //padding: 10,
        borderRadius: 100,
        alignItems: 'center',
        shadowOffset: { height: 10, width: 10 },
        shadowOpacity: 0.6,
        shadowColor: 'black',
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#ffffff',
        fontFamily: 'Titillium Web',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        fontSize: 14,
    },
})