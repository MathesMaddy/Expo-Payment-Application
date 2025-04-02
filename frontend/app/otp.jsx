// // import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native'
// // import React, { useEffect, useRef, useState } from 'react'
// // import { router, useLocalSearchParams, useRouter } from 'expo-router'

// // import * as SecureStore from 'expo-secure-store';


// // export default function otp() {
// //   const [otp, setOtp] = useState(["", "", "", ""]); 

// //   const inputRef = useRef([]);
// //   const [ otpEntered, setOtpEntered ] = useState(true);
// //   const navigate = useRouter();


// //   const { phoneNumber, getOTP } = useLocalSearchParams();
  
// //   useEffect( () => {
// //   setTimeout(() => {
// //     let stringOTP = getOTP.toString();

// //     let otpArray = stringOTP.split('')

// //     setOtp(otpArray)
    
// //   }, 500);
// //   },[])
// //   const HandleOTP = (text, index) => {
// //     if(text.length > 1) return;
// //     const newOTP = [...otp];
// //     newOTP[index] = text;
// //     setOtp(newOTP);
    
// //     if(text && index < 5) {
// //       inputRef.current[index + 1]?.focus();
// //     }
// //   }
// //   const HandleKeyPress = (e, index) => {
    
// //     if(e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
// //       inputRef.current[index - 1]?.focus()
// //     }
// //   }
// //   const HandleSubmit = async() => {

// //     if(otp.join('').length === 4) {

// //       setOtpEntered(true)
// //       try {
// //         const apiUrl = process.env.EXPO_PUBLIC_API_VERIFY || '';
        
// //         console.log(apiUrl)
        
// //         let result = await SecureStore.getItemAsync('token');

// //         console.log(`Retrieved token: ${result}`);

// //         const response = await fetch(apiUrl, {
// //           method : "POST",
// //           headers : {
// //             "Content-Type" : "application/json"
// //           },
// //           body : JSON.stringify({ token : result, otp : otp.join('')})
// //         })
// //         if(response.ok) {
// //           router.replace('/(tabs)')
// //         }
// //         else if(response.status === 406) {
          
// //           setOtpEntered(false);
// //         }
// //         else {
// //           router.replace('/kycdetails');
// //         }
// //       }
// //       catch(e) {
// //         console.log(e)
// //       }
// //     }
// //     else {
// //       setOtpEntered(false)
// //     }
// //   }

// //   return (

// //     <View style={styles.container}>
// //           <View>    
// //           <Image
// //             source={require("@/assets/images/react-logo.png")}
// //             style={styles.logo}
// //             resizeMode="contain"
// //             />
// //           <Text style={styles.heading}>Verfiy your mobile number</Text>
// //           <Text style={styles.createAccount}>This verifies your identify and helps you securely log in to YahviPay</Text>
// //           <Text style={styles.enterNumber}>Enter OTP send to +91 {phoneNumber}</Text>
// //           <View style={styles.OTPContainer}>
          
// //             { otp.map((item, index) => (

// //               <TextInput
// //                 key={index}
// //                 ref={(f) => (inputRef.current[index] = f)}
// //                 style={[styles.input, !otpEntered && { borderColor : 'red' } ]}
// //                 placeholderTextColor="#888"

// //                 value={item}
// //                 keyboardType="phone-pad"
// //                 onChangeText={(text) => HandleOTP(text, index)}
// //                 onKeyPress={(e) => HandleKeyPress(e, index)}
// //                 maxLength={1}
// //               />
// //             ))}
// //           </View>
// //             { !otpEntered && <Text style={{ color : 'red', paddingBottom : 5 }}>Please enter valid OTP.</Text>}
// //           <TouchableOpacity style={ styles.button } onPress={HandleSubmit} >
// //             <Text style={styles.buttonText} >Proceed</Text>
// //           </TouchableOpacity>
    
// //             </View>
// //           <Text style={styles.termsConditions}>By proceeding, you are agreeing to <Text style={{ color : '#0E7C7B' }}>YahviPay's Terms and Conditions</Text> & <Text style={{ color : '#' }}>Privacy Policy.</Text></Text>
// //         </View>
// //   )
// // }


// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "white",
// //     paddingHorizontal: 16,
// //     paddingTop : 50,
// //     paddingBottom : 15,
// //     justifyContent : 'space-between'
// //   },
// //   logo: {
// //     width: 50,
// //     height: 50,
// //     marginBottom: 20,
// //   },
// //   heading: {
// //     fontSize: 20,
// //     fontWeight: "500",
// //     color: "#333",
// //     paddingBottom : 3
// //   },
// //   createAccount : {
// //     fontSize : 13,
// //     fontWeight : 400,
// //     color : 'grey'
// //   },
// //   enterNumber : {
// //     fontSize : 17,
// //     fontWeight : 500,
// //     paddingTop : 25,
// //     paddingBottom : 5
// //   },
// //   OTPContainer: {

// //     flexDirection : 'row'
// //   },
// //   input: {
// //     textAlign : 'center',
// //     width: "12%",
// //     borderWidth: 1,
// //     marginRight : 8,
// //     borderColor: "#ccc",
// //     borderRadius: 8,
// //     padding: 12,
// //     marginTop : 3,
// //     fontSize: 18,
// //     marginBottom: 12,
// //     fontWeight : 800,
// //     letterSpacing : 8
// //   },
// //   button: {
// //     width: "100%",
// //     backgroundColor: "#0E7C7B",
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     marginTop: 5,
// //   },
// //   buttonText: {
// //     color: "white",
// //     textAlign: "center",
// //     fontSize: 16,
// //     fontWeight: "500",
// //   },
// //   buttonDisable : {

// //     backgroundColor : '#888'
// //   },
// //   signupText: {
// //     marginTop: 16,
// //     color: "#666",
// //   },
// //   signupLink: {
// //     color: "#2563eb",
// //     fontWeight: "600",
// //   },
// //   termsConditions : {
// //     color : '#888',
// //     fontSize : 13
// //   }
// // });


// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// const { width, height } = Dimensions.get('window');

// const VerificationScreen = ({ userData }) => {
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const otpInputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

//   useEffect(() => {
//     otpInputs.forEach((input, index) => {
//       if (input.current) {
//         input.current.setNativeProps({ maxLength: 1 });
//       }
//     });
//   }, [otpInputs]);

//   const handleOtpChange = (text, index) => {
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);

//     if (text && index < 3) {
//       otpInputs[index + 1].current.focus();
//     }
//   };

//   const handleKeyPress = (e, index) => {
//     if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
//       otpInputs[index - 1].current.focus();
//     }
//   };

//   const handleVerify = () => {
//     const enteredOtp = otp.join('');
//     // Logic for verifying OTP
//     console.log('Entered OTP:', enteredOtp);
//     // Add your verification logic here
//   };

//   return (
//     <View style={styles.loginContainer}>
//       <View style={styles.logoContainer}>
//         <Text style={styles.logoText}>logo</Text>
//       </View>

//       <View style={styles.titleContainer}>
//         <Text style={styles.title}>Verify your mobile number</Text>
//         <Text style={styles.subtitle}>
//           This verifies your identity and helps you securely log in to payment app.
//         </Text>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Enter OTP sent to {}</Text>
//         <View style={styles.otpContainer}>
//           {otp.map((value, index) => (
//             <TextInput
//               key={index}
//               ref={otpInputs[index]}
//               style={styles.otpInput}
//               keyboardType="number-pad"
//               value={value}
//               onChangeText={(text) => handleOtpChange(text, index)}
//               onKeyPress={(e) => handleKeyPress(e, index)}
//             />
//           ))}
//         </View>
//         <Text style={styles.resendOtp}>Resend OTP</Text>
//       </View>

//       <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
//         <Text style={styles.verifyButtonText}>Proceed</Text>
//       </TouchableOpacity>

//       <View style={styles.termsContainer}>
//         <Text style={styles.termsText}>
//           By continuing, you agree to our{' '}
//           <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
//           <Text style={styles.termsLink}>Privacy Policy</Text>
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loginContainer: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     padding: width * 0.05,
//     height: height,
//     width: width,
//   },
//   logoContainer: {
//     paddingTop: height * 0.05,
//   },
//   logoText: {
//     fontSize: width * 0.08,
//     fontFamily: 'Pacifico',
//     color: '#7E22CE',
//   },
//   titleContainer: {
//     paddingTop: height * 0.05,
//   },
//   title: {
//     fontSize: width * 0.06,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: width * 0.04,
//     color: 'gray',
//     paddingTop: height * 0.01,
//   },
//   inputContainer: {
//     paddingTop: height * 0.04,
//   },
//   label: {
//     fontSize: width * 0.04,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: height * 0.01,
//   },
//   otpContainer: {
//     flexDirection: 'row',
//     marginTop: height * 0.01,
//   },
//   otpInput: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     padding: width * 0.04,
//     fontSize: width * 0.04,
//     width: width * 0.12,
//     textAlign: 'center',
//   },
//   verifyButton: {
//     marginTop: height * 0.04,
//     backgroundColor: '#7E22CE',
//     padding: height * 0.02,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   verifyButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: width * 0.045,
//   },
//   termsContainer: {
//     marginBottom: height * 0.03,
//     alignItems: 'center',
//   },
//   termsText: {
//     fontSize: width * 0.03,
//     color: 'gray',
//     textAlign: 'center',
//   },
//   termsLink: {
//     color: '#7E22CE',
//   },
//     resendOtp:{
//         color: '#7E22CE',
//         marginTop: height * 0.015,
//         fontSize: width * 0.035,
//     }
// });

// export default VerificationScreen;
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';

import { router, useLocalSearchParams, useRouter } from 'expo-router'

import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');
export default function otp() {

  const [otp, setOtp] = useState(['', '', '', '']);
  // const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // const handleOtpChange = (text, index) => {
  //   const newOtp = [...otp];
  //   newOtp[index] = text;
  //   setOtp(newOtp);

  //   if (text && index < inputRefs.length - 1) {
  //     inputRefs[index + 1].current.focus();
  //   }
  // };

  // const handleKeyPress = (e, index) => {
  //   if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
  //     inputRefs[index - 1].current.focus();
  //   }
  // };

  // const handleVerify = () => {
  //   // Implement your verification logic here
  //   const enteredOtp = otp.join('');
  //   console.log('Entered OTP:', enteredOtp);
  //   // You'd typically send this OTP to your backend for verification
  //   navigation.navigate('Home'); // Navigate to the home screen after verification
  // };

  // const handleResend = () => {
  //   // Implement resend OTP logic here
  //   console.log('Resend OTP clicked');
  // };

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
          {/* <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity> */}
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
    padding: width * 0.05, // Responsive padding
  },
  header: {
    marginTop: width * 0.05, // Responsive marginTop
  },
  logo: {
    paddingTop: width * 0.04,
    fontSize: width * 0.064, // Responsive fontSize
    fontFamily: 'Pacifico',
    color: '#7E22CE',
  },
  content: {
    paddingTop: width * 0.08, // Responsive paddingTop
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
    marginTop: width * 0.02, // Responsive marginTop
  },
  otpContainer: {
    paddingTop: width * 0.05,
  },
  otpLabel: {
    fontSize: width * 0.04,
    fontWeight: '500',
    marginBottom: width * 0.026, // Responsive marginBottom
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
    marginTop: width * 0.053, // Responsive marginTop
  },
  verifyButtonText: {
    color: 'white',
    fontSize: width * 0.048, // Responsive fontSize
    fontWeight: '600',
  },
  footer: {
    // marginBottom: width * 0.053, // Responsive marginBottom
  },
  termsText: {
    fontSize: width * 0.032,
    color: 'gray',
  },
  linkText: {
    color: '#7E22CE',
  },
});



// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// const { width, height } = Dimensions.get('window');

// const CreatePinScreen = () => {
//   const [pin, setPin] = useState(['', '', '', '', '', '']);
//   const pinInputs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

//   useEffect(() => {
//     pinInputs.forEach((input, index) => {
//       if (input.current) {
//         input.current.setNativeProps({ maxLength: 1 });
//       }
//     });
//   }, [pinInputs]);

//   const handlePinChange = (text, index) => {
//     const newPin = [...pin];
//     newPin[index] = text;
//     setPin(newPin);

//     if (text && index < 5) {
//       pinInputs[index + 1].current.focus();
//     }
//   };

//   const handleKeyPress = (e, index) => {
//     if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
//       pinInputs[index - 1].current.focus();
//     }
//   };

//   const handlePinProceed = () => {
//     const enteredPin = pin.join('');
//     // Logic for PIN proceed
//     console.log('Entered PIN:', enteredPin);
//     // Add your PIN verification logic here
//   };

//   return (
//     <View style={styles.loginContainer}>
//       <View style={styles.logoContainer}>
//         <Text style={styles.logoText}>logo</Text>
//       </View>

//       <View style={styles.titleContainer}>
//         <Text style={styles.title}>Create Transaction PIN</Text>
//         <Text style={styles.subtitle}>This secret pin is needed to complete transactions.</Text>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Enter 6 digit PIN</Text>
//         <View style={styles.pinContainer}>
//           {pin.map((value, index) => (
//             <TextInput
//               key={index}
//               ref={pinInputs[index]}
//               style={styles.pinInput}
//               secureTextEntry={true} // Hide the input
//               keyboardType="number-pad"
//               value={value}
//               onChangeText={(text) => handlePinChange(text, index)}
//               onKeyPress={(e) => handleKeyPress(e, index)}
//             />
//           ))}
//         </View>
//       </View>

//       <TouchableOpacity style={styles.pinProceedButton} onPress={handlePinProceed}>
//         <Text style={styles.pinProceedButtonText}>Proceed</Text>
//       </TouchableOpacity>

//       <View style={styles.termsContainer}>
//         <Text style={styles.termsText}>
//           By continuing, you agree to our{' '}
//           <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
//           <Text style={styles.termsLink}>Privacy Policy</Text>
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loginContainer: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     padding: width * 0.05,
//     justifyContent: 'space-around',
//     height: height,
//     width: width,
//   },
//   logoContainer: {
//     marginTop: height * 0.05,
//   },
//   logoText: {
//     fontSize: width * 0.08,
//     fontFamily: 'Pacifico',
//     color: '#7E22CE',
//   },
//   titleContainer: {
//     marginTop: height * 0.08,
//   },
//   title: {
//     fontSize: width * 0.06,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: width * 0.04,
//     color: 'gray',
//     marginTop: height * 0.01,
//   },
//   inputContainer: {
//     marginTop: height * 0.05,
//   },
//   label: {
//     fontSize: width * 0.04,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: height * 0.01,
//   },
//   pinContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: height * 0.01,
//   },
//   pinInput: {
//     borderBottomWidth: 2,
//     borderColor: '#D1D5DB',
//     padding: width * 0.03,
//     fontSize: width * 0.04,
//     width: width * 0.1,
//     textAlign: 'center',
//   },
//   pinProceedButton: {
//     marginTop: height * 0.04,
//     backgroundColor: '#7E22CE',
//     padding: height * 0.02,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   pinProceedButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: width * 0.045,
//   },
//   termsContainer: {
//     marginBottom: height * 0.03,
//     alignItems: 'center',
//   },
//   termsText: {
//     fontSize: width * 0.03,
//     color: 'gray',
//     textAlign: 'center',
//   },
//   termsLink: {
//     color: '#7E22CE',
//   },
// });

// export default CreatePinScreen;