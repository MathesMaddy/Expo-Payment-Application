import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// import { TextInput } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
const { width, height } = Dimensions.get('window');

export default function Payupi() {
  const [ upiId, setUpiId ] = useState('');
  
  const [ amount, setAmount ] = useState('');

  const [ showAmountSection, setShowAmountSection ] = useState(false);


  const [ showMessage, setShowMessage ] = useState(false);


  const router = useRouter();

  const changeInputs = () => {
    setShowAmountSection(true);
    setShowMessage(false);
  }

    const CheckUPIId = async() => {
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_CHECK_UPI_ID || '';
        const result = await SecureStore.getItemAsync('token');
        if(result) {
          const res = await fetch(apiUrl, {
            method : 'POST',
            headers : {
              "Content-Type" : 'application/json'
            },
            body : JSON.stringify({ token : result, upiId : upiId })
          })
          if(res.ok) {
            const data = await res.json()
            setUpiId(data)
            HandleUpiTransfer()
          }
          else {
            setShowMessage(true)
          }
        }
        else {
          router.replace('/')
        }
      }
      catch(e) {
        console.log(e);
      }
    } 

  const HandleUpiTransfer = () => {
    if(upiId && amount > 0) {
      router.replace({ pathname : '/screens/enterpinupi', params : { upiId : upiId, amount : amount, name : `${upiId.slice(0,4)}XXXX` }})
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <View style={styles.iconWrapper}>
           <Ionicons name="wallet-outline" size={32} color="#6366F1" />
         </View>
         <Text style={styles.headerText}>UPI Payment</Text>
         <Text style={styles.subText}>Pay any UPI app using UPI ID</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.subtitle}>Enter UPI ID</Text>

        {!showAmountSection ? (
          <View style={styles.upiInputContainer}>
            <TextInput
              style={styles.upiInput}
              placeholder="e.g.name@upi"
              value={upiId}
              onChangeText={setUpiId}
            />
            <TouchableOpacity
              style={[styles.continueButton, upiId.length > 5 ? '' : styles.buttonDisabled ]}
              onPress={changeInputs}    
              disabled={ upiId.length > 5 ? false : true }      
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.amountSection}>
            <View style={styles.upiDisplay}>
              <Text style={styles.payingToText}>Paying to</Text>
              <Text style={styles.displayUpiId}>{upiId}</Text>
            </View>
            { showMessage && <Text style={{ color : 'red', marginTop : -10, paddingBottom : 10 }}>Please enter valid UPI ID</Text> }
            <View style={styles.amountInputContainer}>
              <Text style={styles.amountLabel}>Enter Amount</Text>
              <View style={styles.amountInputWrapper}>
                <Text style={styles.dollarSign}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>
            <TouchableOpacity
              style={[styles.payButton, amount <= 0 ? styles.buttonDisabled : '' ]}
              onPress={CheckUPIId}
              disabled={amount <= 0 ? true : false}
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
      )}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',

    padding : 16
  },
  header: {
    backgroundColor: "#fff", 
    borderRadius: 12, 
    marginBottom: 20,
    padding : 16
  },
  iconWrapper: {
    // backgroundColor: "#6366F1",
    padding: 15,
    // borderRadius: 50,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  subText: {
    paddingTop : 5,
    fontSize: 18,
    color: "#666",
  },
  backButton: {
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: width * 0.053,
    fontWeight: '500',
    marginLeft: width * 0.02,
  },
  subtitle: {
    fontSize: width * 0.042,
    marginBottom: width * 0.04,
    fontWeight : 500
  },
  upiInputContainer: {
    marginBottom: width * 0.064,
  },
  upiInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: width * 0.032,
    marginBottom: width * 0.04,
  },
  continueButton: {
    backgroundColor: '#6A5ACD',
    paddingVertical: width * 0.032,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  amountSection: {
    marginBottom: width * 0.064,
  },
  upiDisplay: {
    backgroundColor: '#F9FAFB',
    padding: width * 0.04,
    borderRadius: 8,
    marginBottom: width * 0.04,
  },
  payingToText: {
    fontSize: width * 0.037,
    color: '#6B7280',
    marginBottom: width * 0.01,
  },
  displayUpiId: {
    fontSize: width * 0.042,
    fontWeight: '500',
  },
  amountInputContainer: {
    marginBottom: width * 0.064,
  },
  amountLabel: {
    fontSize: width * 0.037,
    fontWeight: '500',
    color: '#374151',
    marginBottom: width * 0.02,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: width * 0.032,
  },
  dollarSign: {
    fontSize: width * 0.048,
    fontWeight: '500',
    color: '#374151',
    marginRight: width * 0.01,
  },
  amountInput: {
    flex: 1,
    paddingVertical: width * 0.032,
    fontSize: width * 0.042,
  },
  payButton: {
    backgroundColor: '#6A5ACD',
    paddingVertical: width * 0.032,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled : {
    backgroundColor : '#888'
  },
  payButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});


// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const UpiPaymentScreen = () => {
//   const [upiId, setUpiId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [isUpiValid, setIsUpiValid] = useState(null); // null, true, false

//   const validateUpi = (input) => {
//     setUpiId(input);
//     const upiRegex = /^[\w.-]+@[a-zA-Z]+$/; // Basic UPI format validation
//     setIsUpiValid(upiRegex.test(input));
//   };

//   const handlePayment = () => {
//     if (!isUpiValid || !amount || parseFloat(amount) <= 0) {
//       alert("Enter a valid UPI ID and amount");
//       return;
//     }
//     alert(`Paying ₹${amount} to ${upiId}`);
//   };

//   return (
//     <View style={styles.container}>
//       {/* UPI Payment Header */}
//       <View style={styles.header}>
//         <View style={styles.iconWrapper}>
//           <Ionicons name="wallet-outline" size={32} color="#6366F1" />
//         </View>
//         <Text style={styles.headerText}>UPI Payment</Text>
//         <Text style={styles.subText}>Pay to any UPI ID instantly</Text>
//       </View>

//       {/* UPI ID Input */}
//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Enter UPI ID</Text>
//         <View style={styles.inputWrapper}>
//           <TextInput
//             style={styles.input}
//             placeholder="example@upi"
//             value={upiId}
//             onChangeText={validateUpi}
//           />
//           {isUpiValid === true && <Ionicons name="checkmark-circle" size={24} color="green" />}
//           {isUpiValid === false && <Ionicons name="close-circle" size={24} color="red" />}
//         </View>
//         {isUpiValid === false && <Text style={styles.errorText}>Please enter a valid UPI ID</Text>}
//       </View>

//       {/* Amount Input */}
//       {isUpiValid && (
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Enter Amount</Text>
//           <View style={styles.inputWrapper}>
//             <Text style={styles.currency}>₹</Text>
//             <TextInput
//               style={[styles.input, styles.amountInput]}
//               placeholder="0.00"
//               keyboardType="numeric"
//               value={amount}
//               onChangeText={setAmount}
//             />
//           </View>
//         </View>
//       )}

//       {/* Pay Button */}
//       {isUpiValid && amount > 0 && (
//         <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
//           <Text style={styles.payButtonText}>Pay ₹{amount}</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#F9FAFB",
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   iconWrapper: {
//     backgroundColor: "#6366F1",
//     padding: 15,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   subText: {
//     fontSize: 14,
//     color: "#666",
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#333",
//     marginBottom: 5,
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     backgroundColor: "#fff",
//   },
//   input: {
//     flex: 1,
//     height: 50,
//     fontSize: 16,
//     color: "#333",
//   },
//   currency: {
//     fontSize: 18,
//     color: "#555",
//     marginRight: 5,
//   },
//   amountInput: {
//     textAlign: "left",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 12,
//     marginTop: 5,
//   },
//   payButton: {
//     backgroundColor: "#6366F1",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   payButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

// export default UpiPaymentScreen;

