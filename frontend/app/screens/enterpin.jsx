// import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
// import React, { useRef, useState } from 'react'
// import { useLocalSearchParams, useRouter } from 'expo-router'
// import { TextInput } from 'react-native-gesture-handler';
// import * as SecureStore from 'expo-secure-store';
// const { width, height } = Dimensions.get("window");

// export default function Enterpin() {

//     const { phoneNumber, amount } = useLocalSearchParams();
//     const [ pin, setPin ] = useState(['','','','','','']);
//     const inputRef = useRef([]);

//     const router = useRouter();
//     console.log(phoneNumber, amount);
//     console.log(pin)

//     const HandlePay = async() => {
//         if(pin.length === 6) {

//         try {
//                 const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_PAYMENT || '';
                
//                 console.log(apiUrl)
                
//                 let result = await SecureStore.getItemAsync('token');
        
//                 console.log(`Retrieved token: ${result}`);
        
//                 const response = await fetch(apiUrl, {
//                   method : "POST",
//                   headers : {
//                     "Content-Type" : "application/json"
//                   },
//                   body : JSON.stringify({ token : result, phoneNo : phoneNumber, amount : amount, pin : pin })
//                 })
//                 if(response.ok) {
//                   router.replace({ pathname : '/(tabs)', params : { status : 200, res : 'Successfull Transfer'  }})
//                 }
//                 else if(response.status === 406) {
                  
//                   router.replace({ pathname : '/(tabs)', params : { status : 406, res : 'Invalid PIN'  }})
//                   //   setOtpEntered(false);
//                 }
//                 else {
//                   router.replace({ pathname : '/(tabs)', params : { status : 400, res : 'Payment Failed'  }})
//                 }
//               }
//               catch(e) {
//                 console.log(e)
//               }    
//         }
//     }
//     const HandlePin = (text, index) => {
//       if(text.length > 1) return;
//       const newOTP = [...pin];
//       newOTP[index] = text;
//       setPin(newOTP);
      
//       if(text && index < 5) {
//         inputRef.current[index + 1]?.focus();
//       }
//     }
//     const HandleKeyPress = (e, index) => {
    
//       if(e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
//         inputRef.current[index - 1]?.focus()
//       }
//     }
//   return (
//     <View>

//       <Text>enterpin</Text>

//       <View style={styles.pinContainer}>
//         { pin.map((item, index) => (
//           <TextInput
            
//             key={index}
//             ref={(f) => (inputRef.current[index] = f)}
//             style={[styles.input ]}
//             placeholderTextColor="#888"
//             value={item}
//             keyboardType="phone-pad"
//             onChangeText={(text) => HandlePin(text, index)}
//             onKeyPress={(e) => HandleKeyPress(e, index)}
//             maxLength={1}
//           />
//         ))}

//       </View>
//       <TouchableOpacity style={styles.payButton} onPress={() => HandlePay()}>
//             <Text style={{ fontSize : width * 0.04, color : 'white', textAlign : 'center', fontWeight : 400 }}>Pay</Text>
//         </TouchableOpacity>
//     </View>
//   )
// }

// const styles = StyleSheet.create({

//   pinContainer : {
//     width : width,
//     flexDirection : 'row',
//     justifyContent : 'center'
//   },
    
//   input : {
//     width : 50,
//     borderColor : 'black',
//     textAlign : 'center',
//     borderBottomWidth : 1,
//     marginHorizontal : 5,
//     paddingHorizontal : 17,
//     paddingVertical : 10
//   },
//   payButton : {
//     marginTop : 15,
//     paddingHorizontal : 10,
//     paddingVertical : 8,
//     borderWidth : 1,
//     backgroundColor : '#0E7C7B',
//     borderRadius : 10,
//   }
// })

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
  const { phoneNumber, amount, name } = useLocalSearchParams();
  const navigation = useNavigation();

  console.log(name)
  useEffect(() => {
    navigation.setOptions({ title: name }); 
    pinInputs.forEach((input, index) => {
      if (input.current) {
        input.current.setNativeProps({ maxLength: 1 });
      }
    });
  }, [pinInputs, name]);

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
    if(pin.length === 6) {

    try {
            const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_PAYMENT || '';
            
            console.log(apiUrl)
            
            let result = await SecureStore.getItemAsync('token');
    
            console.log(`Retrieved token: ${result}`);
    
            const response = await fetch(apiUrl, {
              method : "POST",
              headers : {
                "Content-Type" : "application/json"
              },
              body : JSON.stringify({ token : result, phoneNo : phoneNumber, amount : amount, pin : pin })
            })
            if(response.ok) {
              router.replace({ pathname : 'screens/success', params : { status : 'paid', amount : amount }})
            }
            else if(response.status === 406) {
              
              router.replace({ pathname : 'screens/success', params : { status : 'failed', amount : amount  }})
              //   setOtpEntered(false);
            }
            else {
              router.replace({ pathname : 'screens/success', params : { status : 'failed', amount : amount  }})
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
        
        <Text style={{ color : 'white', fontSize : 20, fontFamily : 'bold' }}>{name}</Text>
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

