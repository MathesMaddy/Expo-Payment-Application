import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'

import * as SecureStore from 'expo-secure-store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

export default function _layout() {


  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null);


  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        console.log('z')
        
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          console.log(token)
          setInitialRoute('(tabs)') // If logged in, go to home (tabs)
        } else {

          setInitialRoute('index') // If not logged in, stay on login screen
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setInitialRoute('index') // Default to login if error occurs
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  if (loading && initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }    
  return (
    <GestureHandlerRootView>
    <SafeAreaProvider>
    <Stack key={initialRoute} initialRouteName={initialRoute}>
       
        <Stack.Screen name='index' options={{ headerShown : false }} key={'index'}/>
        <Stack.Screen name='otp' options={{ headerShown : false }}  />

        <Stack.Screen name='history' options={{ headerShown : false }}/>

        <Stack.Screen name='kycdetails' options={{ headerShown : false }}/>
        <Stack.Screen name='createpin' options={{ headerShown : false }}/>

        <Stack.Screen name='(tabs)' options={{ headerShown : false }} key={'(tabs)'} />

        <Stack.Screen name='screens/profiledetails' options={{ headerTitle : 'Profile' }}  />
        <Stack.Screen name='screens/payphonenumber' options={{ headerTitle : 'Pay to phone number' }}  />
        <Stack.Screen name='screens/payupi' options={{ headerTitle : '' }}  />
        <Stack.Screen name='screens/banktransfer' options={{ headerTitle : '' }}  />
        <Stack.Screen name='screens/checkbalance' options={{ headerShown : false }}  />
        <Stack.Screen name='screens/payuser' />
        <Stack.Screen name='screens/payqrscan' />
        <Stack.Screen name='screens/enterpinupi' options={{ headerShown : false }} />
        <Stack.Screen name='screens/success' options={{ headerShown : false }} />
        <Stack.Screen name='screens/mobilerecharge/index' options={{ headerTitle : '' }} />
        <Stack.Screen name='screens/dthrecharge/index' options={{ headerTitle : '' }} />
    </Stack>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  ) 
}