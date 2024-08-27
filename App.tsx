import { StyleSheet, StatusBar, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

// SplashScreen
import SplashScreen from './src/Screens/SplashScreen/Index'

// Auth
// import SelectLanguage from './src/Screens/Auth/SelectLanguage'
import OnBord from './src/Screens/Auth/OnBord'
import Login from './src/Screens/Auth/Login'
import OTP from './src/Screens/Auth/OTP'

// Pages
import Profile from './src/Screens/Profile/Index'
import Home from './src/Screens/Home/Index'
import Podcast from './src/Screens/Podcast/Index'
import Panji from './src/Screens/Panji/Index'
import BookingRequest from './src/Screens/BookingRequest/Index'
import AllBooking from './src/Screens/AllBooking/Index'
import PoojaPending from './src/Screens/PoojaPending/Index'
import BookingDetails from './src/Screens/BookingDetails/Index'
import AddPujaDetails from './src/Screens/AddPujaDetails/Index'
import EditPujaDetails from './src/Screens/EditPujaDetails/Index'
import AllPuja from './src/Screens/AllPuja/Index'
import AddPujaItem from './src/Screens/AddPujaItem/Index'
import PersonalDetails from './src/Screens/PanditForm/PersonalDetails'
import Career from './src/Screens/PanditForm/Career'
import Address from './src/Screens/Address/Index'
import AreaOfService from './src/Screens/AreaOfService/Index'
import BankDetails from './src/Screens/BankDetails/Index'
import AboutUs from './src/Screens/AboutUs/Index'
import ContactUs from './src/Screens/ContactUs/Index'
import TermsOfUse from './src/Screens/TermsOfUse/Index'
import PrivacyPolicy from './src/Screens/PrivacyPolicy/Index'
import Help from './src/Screens/Help/Index'

const Stack = createNativeStackNavigator()

// export const base_url = "https://panditapp.mandirparikrama.com/"
export const base_url = "https://pandit.33crores.com/"

const App = () => {

  const [showSplash, setShowSplash] = useState(true);
  const [access_token, setAccess_token] = useState('');
  const [prifileStatus, setPrifileStatus] = useState("No record found"); //No record found, Profile exists, Career exists

  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem('storeAccesstoken');
      if (token !== null) {
        setAccess_token(token);
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
            setPrifileStatus(responseData.message);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log('No access token found.');
      }
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
    }
  };

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    // Handle background message here
  });

  useEffect(() => {
    getAccessToken();
    setTimeout(() => {
      setShowSplash(false);
    }, 5000)
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#c9170a" barStyle="light-content" />
      {!access_token ?
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {showSplash ? (<Stack.Screen name="SplashScreen" component={SplashScreen} options={{ presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right' }} />) : null}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="OTP" component={OTP} />
          <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
          <Stack.Screen name="Career" component={Career} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Podcast" component={Podcast} />
          <Stack.Screen name="Panji" component={Panji} />
          <Stack.Screen name="AllBooking" component={AllBooking} />
          <Stack.Screen name="PoojaPending" component={PoojaPending} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />
          <Stack.Screen name="BookingRequest" component={BookingRequest} />
          <Stack.Screen name="AddPujaDetails" component={AddPujaDetails} />
          <Stack.Screen name="EditPujaDetails" component={EditPujaDetails} />
          <Stack.Screen name="AllPuja" component={AllPuja} />
          <Stack.Screen name="AddPujaItem" component={AddPujaItem} />
          <Stack.Screen name="Address" component={Address} />
          <Stack.Screen name="AreaOfService" component={AreaOfService} />
          <Stack.Screen name="BankDetails" component={BankDetails} />
          <Stack.Screen name="OnBord" component={OnBord} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
          <Stack.Screen name="ContactUs" component={ContactUs} />
          <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="Help" component={Help} />
        </Stack.Navigator>
        :
        prifileStatus === "No record found" ?
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {showSplash ? (<Stack.Screen name="SplashScreen" component={SplashScreen} options={{ presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right' }} />) : null}
            <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="OTP" component={OTP} />
            <Stack.Screen name="Career" component={Career} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Podcast" component={Podcast} />
            <Stack.Screen name="Panji" component={Panji} />
            <Stack.Screen name="AllBooking" component={AllBooking} />
            <Stack.Screen name="PoojaPending" component={PoojaPending} />
            <Stack.Screen name="BookingDetails" component={BookingDetails} />
            <Stack.Screen name="BookingRequest" component={BookingRequest} />
            <Stack.Screen name="AddPujaDetails" component={AddPujaDetails} />
            <Stack.Screen name="EditPujaDetails" component={EditPujaDetails} />
            <Stack.Screen name="AllPuja" component={AllPuja} />
            <Stack.Screen name="AddPujaItem" component={AddPujaItem} />
            <Stack.Screen name="Address" component={Address} />
            <Stack.Screen name="AreaOfService" component={AreaOfService} />
            <Stack.Screen name="BankDetails" component={BankDetails} />
            <Stack.Screen name="OnBord" component={OnBord} />
            <Stack.Screen name="AboutUs" component={AboutUs} />
            <Stack.Screen name="ContactUs" component={ContactUs} />
            <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="Help" component={Help} />
          </Stack.Navigator>
          :
          // prifileStatus === "Profile exists" ?
          //   <Stack.Navigator screenOptions={{ headerShown: false }}>
          //     {showSplash ? (<Stack.Screen name="SplashScreen" component={SplashScreen} options={{ presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right' }} />) : null}
          //     <Stack.Screen name="Career" component={Career} />
          //     <Stack.Screen name="Login" component={Login} />
          //     <Stack.Screen name="OTP" component={OTP} />
          //     <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
          //     <Stack.Screen name="Home" component={Home} />
          //     <Stack.Screen name="Profile" component={Profile} />
          //     <Stack.Screen name="Podcast" component={Podcast} />
          //     <Stack.Screen name="Panji" component={Panji} />
          //     <Stack.Screen name="AllBooking" component={AllBooking} />
          //     <Stack.Screen name="PoojaPending" component={PoojaPending} />
          //     <Stack.Screen name="BookingDetails" component={BookingDetails} />
          //     <Stack.Screen name="BookingRequest" component={BookingRequest} />
          //     <Stack.Screen name="AddPujaDetails" component={AddPujaDetails} />
          //     <Stack.Screen name="EditPujaDetails" component={EditPujaDetails} />
          //     <Stack.Screen name="AllPuja" component={AllPuja} />
          //     <Stack.Screen name="AddPujaItem" component={AddPujaItem} />
          //     <Stack.Screen name="Address" component={Address} />
          //     <Stack.Screen name="AreaOfService" component={AreaOfService} />
          //     <Stack.Screen name="BankDetails" component={BankDetails} />
          //     <Stack.Screen name="OnBord" component={OnBord} />
          //     <Stack.Screen name="AboutUs" component={AboutUs} />
          //     <Stack.Screen name="ContactUs" component={ContactUs} />
          //     <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
          //     <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          //     <Stack.Screen name="Help" component={Help} />
          //   </Stack.Navigator>
          //   :
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {showSplash ? (<Stack.Screen name="SplashScreen" component={SplashScreen} options={{ presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right' }} />) : null}
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="OTP" component={OTP} />
            <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
            <Stack.Screen name="Career" component={Career} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Podcast" component={Podcast} />
            <Stack.Screen name="Panji" component={Panji} />
            <Stack.Screen name="AllBooking" component={AllBooking} />
            <Stack.Screen name="PoojaPending" component={PoojaPending} />
            <Stack.Screen name="BookingDetails" component={BookingDetails} />
            <Stack.Screen name="BookingRequest" component={BookingRequest} />
            <Stack.Screen name="AddPujaDetails" component={AddPujaDetails} />
            <Stack.Screen name="EditPujaDetails" component={EditPujaDetails} />
            <Stack.Screen name="AllPuja" component={AllPuja} />
            <Stack.Screen name="AddPujaItem" component={AddPujaItem} />
            <Stack.Screen name="Address" component={Address} />
            <Stack.Screen name="AreaOfService" component={AreaOfService} />
            <Stack.Screen name="BankDetails" component={BankDetails} />
            <Stack.Screen name="OnBord" component={OnBord} />
            <Stack.Screen name="AboutUs" component={AboutUs} />
            <Stack.Screen name="ContactUs" component={ContactUs} />
            <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="Help" component={Help} />
          </Stack.Navigator>
      }
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})