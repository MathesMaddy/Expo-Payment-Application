import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';

import { router, useLocalSearchParams, useRouter } from 'expo-router'

import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');
export default function otp() {

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRef = useRef([]);
  const [ otpEntered, setOtpEntered ] = useState(true);
  const router = useRouter();


  const { phoneNumber, getOTP } = useLocalSearchParams();
  
  useEffect( () => {
    setTimeout(() => {
      let stringOTP = getOTP.toString();

      let otpArray = stringOTP.split('')

      setOtp(otpArray)
      
    }, 500);
  },[])

  const HandleOTP = (text, index) => {
    if(text.length > 1) return;
    const newOTP = [...otp];
    newOTP[index] = text;
    setOtp(newOTP);
    
    if(text && index < 5) { 
      inputRef.current[index + 1]?.focus();
    }
  }
  const HandleKeyPress = (e, index) => {
    
    if(e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {

      inputRef.current[index - 1]?.focus()
    }
  }
  const HandleSubmit = async() => {

    if(otp.join('').length === 4) {

      setOtpEntered(true)
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_VERIFY || '';
        
        console.log(apiUrl)
        
        let result = await SecureStore.getItemAsync('token');

        console.log(`Retrieved token: ${result}`);

        const response = await fetch(apiUrl, {
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({ token : result, otp : otp.join('')})
        })
        if(response.ok) {
          router.replace('/(tabs)')
        }
        else if(response.status === 406) {
          
          setOtpEntered(false);
        }
        else {
          router.replace('/kycdetails');
        }
      }
      catch(e) {
        console.log(e)
      }
    }
    else {
      setOtpEntered(false)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>YahviPay</Text>
      </View>
      <View style={styles.content}>
        <View>

        
        <Text style={styles.title}>Verify your mobile number</Text>
        <Text style={styles.subtitle}>
          This verifies your identity and helps you securely log in to YahviPay payment app.
        </Text>
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Enter OTP sent to {phoneNumber}</Text>
          <View style={styles.otpInputs}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => HandleOTP(text, index)}
                maxLength={1}
                keyboardType="number-pad"
                ref={inputRef[index]}
                onKeyPress={(e) => HandleKeyPress(e, index)}
              />
            ))}
          </View>

          { !otpEntered && <Text style={{ color : 'red', paddingBottom : 5 }}>Please enter valid OTP.</Text>}
        </View>
        <TouchableOpacity style={styles.verifyButton} onPress={HandleSubmit}>
          <Text style={styles.verifyButtonText}>Proceed</Text>
        </TouchableOpacity>
        
        </View>
        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: width * 0.05, 
  },
  header: {
    marginTop: width * 0.05,
  },
  logo: {
    paddingTop: width * 0.04,
    fontSize: width * 0.064,
    fontFamily: 'Pacifico',
    color: '#7E22CE',
  },
  content: {
    paddingTop: width * 0.08,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: width * 0.053,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: width * 0.036,
    color: 'gray',
    marginTop: width * 0.02,
  },
  otpContainer: {
    paddingTop: width * 0.05,
  },
  otpLabel: {
    fontSize: width * 0.04,
    fontWeight: '500',
    marginBottom: width * 0.026,
  },
  otpInputs: {
    flexDirection: 'row',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: width * 0.04, 
    fontSize: width * 0.048, 
    width: width * 0.15,
    textAlign: 'center',
    marginHorizontal: width * 0.01,
  },
  resendText: {
    color: '#7E22CE',
    marginTop: width * 0.026,
    alignSelf: 'flex-start',
  },
  verifyButton: {
    backgroundColor: '#7E22CE',

    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: width * 0.053, 
  },
  verifyButtonText: {
    color: 'white',
    fontSize: width * 0.048,
    fontWeight: '600',
  },
  termsText: {
    fontSize: width * 0.032,
    color: 'gray',
  },
  linkText: {
    color: '#7E22CE',
  },
});
