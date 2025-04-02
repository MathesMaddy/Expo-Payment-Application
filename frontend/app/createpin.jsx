import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
import * as SecureStore from 'expo-secure-store';

export default function Createpin() {

  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const pinInputs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const router = useRouter();
  const { kycDetails } = useLocalSearchParams();
  const [ details, setDetails ] = useState(kycDetails)

  const [ detailsSubmited, setDetailsSubmited ] = useState(false);

  useEffect(() => {
    pinInputs.forEach((input, index) => {
      if (input.current) {
        input.current.setNativeProps({ maxLength: 1 });
      }
    });
  }, [pinInputs]);

  const handlePinChange = (text, index) => {
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    if (text && index < 5) {
      pinInputs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputs[index - 1].current.focus();
    }
  };

  const handlePinProceed = () => {
    const enteredPin = pin.join('');
    // Logic for PIN proceed
    console.log('Entered PIN:', enteredPin);
    // Add your PIN verification logic here
  };

//   console.log(pin.join('').length)
//   console.log(kycDetails)
  const HandleSubmit = async() => {
    const data = JSON.parse(details)

    
    console.log(data)
    let result = await SecureStore.getItemAsync('token');
        console.log(result)
        try {
          const apiUrl = process.env.EXPO_PUBLIC_API_KYC_DETAILS || '';
          console.log(apiUrl)
          const response = await fetch(apiUrl, {
            method : "POST",
            headers : {
              "Content-Type" : "application/json"
            },
            body : JSON.stringify({ token : result, details : { ...data, passwordPin : pin.join('')  }})
          })

          console.log('asdfasf')
          if(response.ok) {
          
            router.replace('/(tabs)')
          }
          else {
            console.log('qq')
            setDetailsSubmited(false);
          }
        }
        catch(e) {
          console.log(e)
        }
      // }
      // else {

      //   setDetailsSubmited(false)
      // }
    // }
    // else {
    //     console.log('zz')
    //     setDetailsSubmited(false);
    // }
  }

  return (
    <View style={styles.loginContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>YahviPay</Text>
      </View>


      <View style={styles.titleContainer}>
        <View>

        
        <Text style={styles.title}>Create Transaction PIN</Text>
        <Text style={styles.subtitle}>This secret pin is needed to complete transactions.</Text>
      

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter 6 digit PIN</Text>
        <View style={styles.pinContainer}>
          {pin.map((value, index) => (
            <TextInput
              key={index}
              ref={pinInputs[index]}
              style={styles.pinInput}
              secureTextEntry={true} // Hide the input
              keyboardType="number-pad"
              value={value}
              onChangeText={(text) => handlePinChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={[styles.pinProceedButton, pin.join('').length === 6 ? '' : styles.buttonDisable ]} onPress={() => HandleSubmit()} >
        <Text style={styles.pinProceedButtonText}>Proceed</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: width * 0.05,
    // justifyContent: 'space-around',
    height: height,
    width: width,
  },
  logoContainer: {
    paddingTop: height * 0.05,
  },
  logoText: {
    fontSize: width * 0.06,
    fontFamily: 'Pacifico',
    color: '#7E22CE',
  },
  titleContainer: {
    flex : 1,
    paddingTop: height * 0.02,
    justifyContent : 'space-between'
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: width * 0.038,
    color: 'gray',
    paddingTop: height * 0.01,
  },
  inputContainer: {
    paddingTop: height * 0.05,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#374151',
    paddingBottom: height * 0.01,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingTop: height * 0.01,
  },
  pinInput: {
    borderBottomWidth: 2,
    borderColor: '#D1D5DB',
    padding: width * 0.03,
    fontSize: width * 0.04,
    width: 40,
    textAlign: 'center',
  },
  pinProceedButton: {
    marginTop: height * 0.04,
    backgroundColor: '#7E22CE',
    padding: 17,
    borderRadius: 8,
    alignItems: 'center',
  },
  pinProceedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  buttonDisable : {

    backgroundColor : '#888'
  },
  termsContainer: {
    
  },
  termsText: {
    fontSize: width * 0.03,
    color: 'gray',
  },
  termsLink: {
    color: '#7E22CE',
  },
});

