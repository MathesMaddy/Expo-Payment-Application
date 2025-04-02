import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
const { width, height } = Dimensions.get('window');


const LoginScreen = () => {

  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [ phoneNumEnter, setPhoneNumEnter ] = useState(true);
  const router = useRouter();

  useEffect(() => {
      const checkUserAuth = async () => {
            try {            
              const token = await SecureStore.getItemAsync('token');
              if (token) {
                router.replace('/(tabs)')              
              } 
            } 
            catch (error) {
              console.error('Error checking auth:', error);
              router.replace('/')  
            } 
      };
      
      checkUserAuth();
    }, [])
  const HandleProceed = async() => {    
    if(phoneNumber.length === 10 && /^[0-9]*$/.test(phoneNumber)) {

      setPhoneNumEnter(true);      
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_LOGIN_NUMBER || '';
        console.log(apiUrl)
        const response = await fetch(apiUrl, {          
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({ phoneNo : Number(phoneNumber)})
        })
        if(response.ok) {

          let data = await response.json();
          await SecureStore.setItemAsync('token', data.token);
          let otp = data.success.split(' ')
          otp = otp[otp.length - 1]
          router.replace({ pathname : '/otp', params : { phoneNumber, getOTP : otp }})
        }
        else {
          setPhoneNumEnter(true);
        }
      }
      catch(e) {
        console.log(e)
      }
    }
    else {
      setPhoneNumEnter(false);
    }
  };
  return (
    <View style={styles.containerLogin}>
      <View>

      
      <View style={styles.containerLogo}>

        {/* <Image
         source={require("@/assets/images/react-logo.png")}
         style={styles.logo}
         resizeMode="contain"
        /> */}
        <Text style={styles.logo}>YahviPay</Text>
      </View>

      <View style={styles.containerTitle}>
        <Text style={styles.title}>Log in to payment app</Text>
        <Text style={styles.subtitle}>We will create an account if you don't have one</Text>
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>Enter mobile number</Text>
        <TextInput
          style={styles.input}
          placeholder="----------"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10}
        />
      </View>

      { !phoneNumEnter && <Text style={{ color : 'red', paddingBottom : 5, marginTop : -5 }}>Please enter valid phone number.</Text> }
      <TouchableOpacity 
        style={[styles.proceedButton, phoneNumber.length !== 10 && styles.buttonDisable]}
        onPress={HandleProceed}
        // disabled={!isButtonEnabled}
        disabled = { phoneNumber.length === 10 ? false : true }
      >
        <Text style={styles.proceedButtonText}>Proceed</Text>
      </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
        
    
  );
};

const styles = StyleSheet.create({
  containerLogin: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: width * 0.05, 
    justifyContent : 'space-between',
    height: height,
    width: width,
  },
  containerLogo: {

    paddingTop: height * 0.05,
  },
  logo: {
    fontSize: width * 0.06,
    color: '#7E22CE',
    fontWeight : 'bold'
  },
  containerTitle: {
    paddingTop: height * 0.03,
  },
  title: {
    fontSize: width * 0.053,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: width * 0.036,
    color: 'gray',
    paddingTop: height * 0.009,
  },
  containerInput: {
    paddingTop: height * 0.05,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#374151',
    marginBottom: height * 0.01,
  },
  input: { letterSpacing : 8, fontWeight : 'bold',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    padding: 18,
    fontSize: width * 0.042,
  },
  proceedButton: {
    marginTop: height * 0.03,
    backgroundColor: '#7E22CE',
    padding: height * 0.02,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  buttonDisable : {
    backgroundColor : '#888'
  },
  termsText: {
    fontSize: width * 0.030,
    color: 'gray',
  },
  termsLink: {
    color: '#7E22CE',
  },
});

export default LoginScreen;