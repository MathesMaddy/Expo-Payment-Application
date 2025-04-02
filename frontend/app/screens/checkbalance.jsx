import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';

const { width, height } = Dimensions.get('window');
import * as SecureStore from 'expo-secure-store';

export default function Checkbalance () {

    const [ pin, setPin ] = useState(['','','','','','']);
    const pinInputs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const [ amount, setAmount ] = useState(0);
  
    useEffect(() => {
        pinInputs.forEach((input, index) => {
          if (input.current) {
            input.current.setNativeProps({ maxLength: 1 });
          }
        });
      }, [pinInputs]);
    const router = useRouter();
    const HandleCheckBalance = async() => {
      if(pin.length === 6 && pin.join('').length === 6) {

      try {
              const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_CHECK_BALANCE || '';
              
              console.log(apiUrl)
              
              let result = await SecureStore.getItemAsync('token');
      
              console.log(`Retrieved token: ${result}`);
      
              const response = await fetch(apiUrl, {
                method : "POST",
                headers : {
                  "Content-Type" : "application/json"
                },
                body : JSON.stringify({ token : result, pin : pin })
              })
              if(response.ok) {
                const data = await response.json();
                console.log(data)
                setAmount(data)
                router.replace({ pathname : 'screens/successbalance', params : { status : 'paid', amount : data.accountBalace }})
              }
              else {
                router.replace({ pathname : 'screens/successbalance', params : { status : 'failed', amount : data }})
              }
            }
            catch(e) {
              console.log(e)
            }    
      }
  }
  const HandlePin = (text, index) => {
    if(text.length > 1) return;
    const newOTP = [...pin];
    newOTP[index] = text;
    setPin(newOTP);
    
    if(text && index < 5) {
      pinInputs[index + 1].current.focus();
    }
  }
  const HandleKeyPress = (e, index) => {
  
    if(e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputs[index - 1].current.focus();
    }
  }

  return (

    <View style={styles.loginContainer}>
        <View style={styles.header}>
            <Text style={{ color : 'white', fontSize : 20, fontFamily : 'bold' }}>YahviPay</Text>
        <View style={{ justifyContent : 'space-between', flexDirection : 'row', paddingTop : 10 }}>
            
            <Text style={{ color : 'white', fontSize : 20, fontFamily : 'bold' }}>Check Balance</Text>
            <Text style={{ color : 'white', fontSize : 20, fontFamily : 'bold' }}></Text>
        </View>
        </View>
        <View>
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
                  onChangeText={(text) => HandlePin(text, index)}
                  onKeyPress={(e) => HandleKeyPress(e, index)}
                />
              ))}
            </View>
          </View>
    
          <TouchableOpacity style={[styles.pinProceedButton, pin.join('').length === 6 ? '' : styles.buttonDisable ]} onPress={() => HandleCheckBalance()} >
            <Text style={styles.pinProceedButtonText}>Proceed</Text>
          </TouchableOpacity>
          </View>
        </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    // padding: width * 0.05,
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

  header : {
    backgroundColor : '#5B21B6',
    height : 100,
 
    padding : 16

  },
  inputContainer: {
    paddingTop: height * 0.05,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#374151',
    paddingBottom: height * 0.01,
    textAlign : 'center'
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
    marginTop: height * 0.1,
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
});
