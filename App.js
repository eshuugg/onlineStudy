import React, {useEffect} from 'react';
import {Text, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//Page Navigation
import {PageNavigation as Welcome} from './src/components/PageNavigations/PageNavigtion.js';
//Screens
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {ToastProvider} from 'react-native-toast-notifications';
import {Provider} from 'react-redux';
import store from './src/redux/store.js';
import {navigationRef} from './src/components/PageNavigations/PageNavigtion';
import LoginScreen from './src/screens/Login/Login.js';
import SplashScreen from './src/screens/Splash/SplashScreen.js';
import FreeLiveClass from './src/screens/FreeClass/FreeLiveClass.js';
import FreeVideoClass from './src/screens/FreeClass/FreeVideo.js';
import FreeStudyMaterial from './src/screens/FreeClass/FreeStudyMaterial.js';
import PdfViewer from './src/screens/PDFViewer.js';
import OtherCourseDetailsScreen from './src/screens/OtherCourseDetails/OtherCourse.js';
import YouTubePlayer from './src/screens/YoutubePlayer.js';
import RegisterScreen from './src/screens/Register/Register.js';
import PurchaseLiveClass from './src/screens/PurchaseClass/PurchaseLiveClass.js';
import PurchaseVideoScreen from './src/screens/PurchaseClass/PurchaseVideo.js';
import PurchaseStudyMaterial from './src/screens/PurchaseClass/PurchaseStudyMaterial.js';
import ForgotPasswordScreen from './src/screens/ForgetPassword/ForgetPassword.js';
import ResetPasswordScreen from './src/screens/ForgetPassword/ResetPassword.js';
import MyOrders from './src/screens/MyOrders/MyOrders.js';
import MyCourses from './src/screens/MyCourses/MyCourses.js';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <ToastProvider>
        <NavigationContainer ref={navigationRef}>
          <SafeAreaView style={{flex: 1,backgroundColor:'#1a2942'}}>
            <Stack.Navigator
              initialRouteName="SplashScreen"
              screenOptions={{headerShown: false}}>
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Welcome" component={Welcome} />
              <Stack.Screen name="FreeLiveClass" component={FreeLiveClass} />
              <Stack.Screen name="FreeVideoClass" component={FreeVideoClass} />
              <Stack.Screen name="FreeStudyMaterial" component={FreeStudyMaterial} />
              <Stack.Screen name="ForgetPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
              <Stack.Screen name="PurchaseLiveClass" component={PurchaseLiveClass} />
              <Stack.Screen name="PurchaseVideoScreen" component={PurchaseVideoScreen} />
              <Stack.Screen name="PurchaseStudyMaterial" component={PurchaseStudyMaterial} />
              <Stack.Screen name="MyOrders" component={MyOrders} />
              <Stack.Screen name="MyCourses" component={MyCourses} />
              
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="PdfViewer" component={PdfViewer} />
              <Stack.Screen name="YouTubePlayer" component={YouTubePlayer} />
              <Stack.Screen name="OtherCourseDetails" component={OtherCourseDetailsScreen} />
            </Stack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </ToastProvider>
    </Provider>
  );
}
