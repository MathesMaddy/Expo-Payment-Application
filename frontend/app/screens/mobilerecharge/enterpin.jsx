import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
import * as SecureStore from 'expo-secure-store';

export default function enterpinupi() {

  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const pinInputs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const router = useRouter();

  const [ detailsSubmited, setDetailsSubmited ] = useState(false);
  const { rechargePhoneNumber, amount, billType } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: billType }); 
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

  const HandleSubmit = async() => {
    if(pin.join('').length === 6) {
    try {
            const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_MOBILE_RECHARGE || '';
            
            console.log(apiUrl)
            
            let result = await SecureStore.getItemAsync('token');
    
            console.log(`Retrieved token: ${result}`);
    
            const response = await fetch(apiUrl, {
              method : "POST",
              headers : {
                "Content-Type" : "application/json"
              },
              body : JSON.stringify({ token : result, phoneNo : rechargePhoneNumber, billType: billType, price : amount, passwordPin : pin })
            })
            if(response.ok) {
              router.replace({ pathname : 'screens/success', params : { status : "paid", amount : amount, name : billType }})
            }
            else if(response.status === 406) {
              
              router.replace({ pathname : 'screens/success', params : { status : "failed", amount : amount, name : billType  }})
              //   setOtpEntered(false);
            }
            else {
              router.replace({ pathname : 'screens/success', params : { status : "failed", amount : amount, name : billType  }})
            }
          }
          catch(e) {
            console.log(e)
          }    
    }
}

  return (
    <View style={styles.loginContainer}>
    <View style={styles.header}>
        <Text style={{ color : 'white', fontSize : 20, fontFamily : 'bold' }}>YahviPay</Text>
    <View style={{ justifyContent : 'space-between', flexDirection : 'row', paddingTop : 10 }}>
        
        <Text style={{ color : 'white', fontSize : 20, fontFamily : 'bold' }}>{billType}</Text>
        <Text style={{ color : 'white', fontSize : 20, fontFamily : 'bold' }}>₹{amount}</Text>
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

