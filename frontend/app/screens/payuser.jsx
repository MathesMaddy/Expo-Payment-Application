// import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
// import { TextInput } from 'react-native-gesture-handler';
// import { AntDesign } from '@expo/vector-icons';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// const { width, height } = Dimensions.get("window");

// export default function payuser() {

//     const { name, transferPhoneNumber } = useLocalSearchParams();
//     console.log(transferPhoneNumber)
    
//     const [ amount, setAmount ] = useState(0);
//     const router = useRouter();

//     const navigation = useNavigation();

//     useEffect(() => {
//       navigation.setOptions({ title: name }); // Set header title
//     }, [navigation, transferPhoneNumber]);
    
//     const HandlePay = () => {
        
//         if(Number(amount) <= 100000) {
//             router.push({pathname : '/screens/enterpin', params : {phoneNumber : transferPhoneNumber, amount : amount}})

//         }
//     }

//   return (
//     <View style={styles.container}>     
//       <View style={styles.amountContainer}>
//         <View>
//           <Text style={styles.header}>Send Money</Text>
//           <Text style={styles.subHeader}>to any UPI app</Text>
//         </View>

//       </View> 
//       <View style={styles.inputContainer}>
//         <TextInput
//           placeholder="Enter amount to pay"
//           placeholderTextColor="#888"
//           keyboardType="phone-pad"

//           value={amount}
//           onChangeText={(text) => setAmount(text)}
//           maxLength={6}
//           style={styles.input}
//         />

//         <TouchableOpacity onPress={() => HandlePay()} style={[styles.payButton]} disabled = { !Number(amount) ? true : false }>
//           {/* <Text style={{ fontSize : width * 0.04, color : 'white', textAlign : 'center', fontWeight : 400 }}>Make payment</Text> */}
          
//           <MaterialCommunityIcons name="send-circle" color="#0E7C7B" size={50} style={[styles.sendIcon, !Number(amount) ? { color : '#888' } : '']}/>
//         </TouchableOpacity>
//       </View>
      
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container : {
//     flex : 1,
//     justifyContent : 'space-between',
//     paddingTop : 20,
//   },
//   amountContainer : {

//     paddingHorizontal : 15
//   },
//   header : {
//     fontSize : width * 0.05,
//     fontWeight : 500,
//     letterSpacing : 1,
//     paddingBottom : 3
//   },
//   subHeader : {
//     color : '#888',
//     paddingBottom : 15
//   },
//   inputContainer : {

//     borderColor : '#888',
//     borderWidth : 1,
//     // paddingHorizontal : 15,
//     // paddingVertical : 10,
//     borderRadius : 5,
//     height : 50,
//     width : width,
//     flexDirection : 'row',
//     justifyContent : 'space-between'
//   },
//   input : {
//     height : 50,
//     fontSize : width * 0.045,
//     letterSpacing : 2,
//     fontWeight : 500,
//     marginLeft : 15,
//     width : width - 100
//   },
//   contactHeader : {
//     color : '#888',
//     paddingTop : 15,
//     fontSize : width * 0.038,
//     paddingBottom : 15
//   },
//   payButton : {
//     paddingHorizontal : 10,
//     paddingVertical : 8,
//     // borderWidth : 1,
//     // backgroundColor : 'white',
//     // borderRadius : 10,
    
    
//     justifyContent : 'center',
//     alignContent : 'center'
//   },
//   sendIcon : {
//     height : 50,
//     width : 50
//   }
// })


// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const PayToPhoneScreen = () => {
//   const [amount, setAmount] = useState('');
//   const [isButtonDisabled, setIsButtonDisabled] = useState(true);

//   // Handle input change
//   const handleAmountChange = (value) => {
//     setAmount(value);
//     setIsButtonDisabled(value <= 0); // Disable button if amount is less than or equal to 0
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#4B5563" />
//         </TouchableOpacity>

//         <View style={styles.headerContent}>
//           <View style={styles.avatar}>
//             <Image
//               source={{ uri: 'https://public.readdy.ai/ai/img_res/6020f62b80ee9e14878b40147a1d50e7.jpg' }}
//               style={styles.avatarImage}
//             />
//           </View>
//           <Text style={styles.headerTitle}>Ethan Martinez</Text>
//         </View>
//       </View>

//       {/* Transaction History */}
//       <ScrollView contentContainerStyle={styles.transactionList}>
//         {/* Transaction 1 */}
//         <View style={styles.transactionItem}>
//           <Text style={styles.transactionDate}>Mar 28, 2025</Text>
//           <View style={styles.transactionBox}>
//             <View style={styles.transactionAmountContainer}>
//               <Text style={styles.transactionAmount}>$120.00</Text>
//             </View>
//             <Text style={styles.transactionDescription}>Rent share</Text>
//           </View>
//         </View>

//         {/* Transaction 2 */}
//         <View style={styles.transactionItem}>
//           <Text style={styles.transactionDate}>Mar 22, 2025</Text>
//           <View style={styles.transactionBox}>
//             <View style={styles.transactionAmountContainer}>
//               <Text style={styles.transactionAmount}>$45.00</Text>
//             </View>
//             <Text style={styles.transactionDescription}>Groceries</Text>
//           </View>
//         </View>

//         {/* Transaction 3 */}
//         <View style={styles.transactionItem}>
//           <Text style={styles.transactionDate}>Mar 18, 2025</Text>
//           <View style={styles.transactionBox}>
//             <View style={styles.transactionAmountContainer}>
//               <Text style={styles.transactionAmount}>$18.75</Text>
//             </View>
//             <Text style={styles.transactionDescription}>Uber</Text>
//           </View>
//         </View>

//         {/* Transaction 4 */}
//         <View style={styles.transactionItem}>
//           <Text style={styles.transactionDate}>Mar 12, 2025</Text>
//           <View style={styles.transactionBox}>
//             <View style={styles.transactionAmountContainer}>
//               <Text style={styles.transactionAmount}>$60.00</Text>
//             </View>
//             <Text style={styles.transactionDescription}>Utilities</Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Bottom Pay Section */}
//       <View style={styles.bottomSection}>
//         <View style={styles.inputContainer}>
//           <Text style={styles.dollarSign}>$</Text>
//           <TextInput
//             value={amount}
//             onChangeText={handleAmountChange}
//             style={styles.amountInput}
//             placeholder="0"
//             keyboardType="numeric"
//           />
//         </View>

//         <TouchableOpacity
//           style={[styles.payButton, isButtonDisabled && styles.payButtonDisabled]}
//           disabled={isButtonDisabled}
//         >
//           <Text style={styles.payButtonText}>Pay</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     zIndex: 10,
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginRight: 12,
//   },
//   avatarImage: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#4B5563',
//   },
//   transactionList: {
//     marginTop: 80,
//     paddingHorizontal: 16,
//     paddingBottom: 80,
//   },
//   transactionItem: {
//     marginBottom: 16,
//   },
//   transactionDate: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   transactionBox: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   transactionAmountContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   transactionAmount: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1D4ED8',
//   },
//   transactionDescription: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   bottomSection: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     zIndex: 10,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     paddingLeft: 12,
//     paddingRight: 16,
//   },
//   dollarSign: {
//     fontSize: 18,
//     color: '#4B5563',
//     fontWeight: '600',
//   },
//   amountInput: {
//     flex: 1,
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#1F2937',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingLeft: 10,
//   },
//   payButton: {
//     backgroundColor: '#E5E7EB',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginTop: 12,
//   },
//   payButtonDisabled: {
//     backgroundColor: '#D1D5DB',
//   },
//   payButtonText: {
//     fontSize: 16,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
// });

// export default PayToPhoneScreen;


import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';

import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
// import { TextInput } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const { width, height } = Dimensions.get('window');
const TransactionHistoryScreen = () => {

  const [amount, setAmount] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleAmountChange = (text) => {
    setAmount(text);
    setIsButtonDisabled(text <= 0);
  };

  const { name, transferPhoneNumber } = useLocalSearchParams();
  
  console.log(transferPhoneNumber)
  
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
      navigation.setOptions({ title: name }); 
  }, [navigation, transferPhoneNumber]);

  
  const HandlePay = () => {
    if(Number(amount) <= 100000) {
      router.push({pathname : '/screens/enterpin', params : { phoneNumber : transferPhoneNumber, amount : amount, name : name }})
    }
  }
  const transactions = [
    { date: 'Mar 28, 2025', amount: 120, type: 'sent', description: 'Rent share' },
    { date: 'Mar 22, 2025', amount: 45, type: 'received', description: 'Groceries' },
    { date: 'Mar 18, 2025', amount: 18.75, type: 'sent', description: 'Uber' },
    { date: 'Mar 12, 2025', amount: 60, type: 'received', description: 'Utilities' },
    { date: 'Mar 12, 2025', amount: 60, type: 'received', description: 'Utilities' },
    { date: 'Mar 12, 2025', amount: 60, type: 'received', description: 'Utilities' },
    { date: 'Mar 12, 2025', amount: 60, type: 'received', description: 'Utilities' },
  ];

  return (
    <View style={styles.container}>

      <ScrollView style={styles.transactionList}>
        {transactions.map((transaction, index) => (
          <View key={index} style={styles.transactionItem}>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
            <View
              style={[
                styles.transactionBox,
                transaction.type === 'sent' ? styles.sentTransaction : styles.receivedTransaction,
              ]}
            >
              <View style={styles.transactionContent}>
                <Text style={styles.transactionAmount}>Rs.{transaction.amount}</Text>
              </View>
              <Text style={styles.transactionDescription}>Paid</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.inputContainer}>

          <TextInput
            style={styles.amountInput}
            placeholder="0"
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
            min={1}
          />
        </View>

        <TouchableOpacity style={[styles.payButton, isButtonDisabled && styles.payButtonDisabled]} disabled={isButtonDisabled} onPress={() => HandlePay()}>
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  transactionList: {
    paddingTop: width * 0.05,
    paddingHorizontal: 16,
  },
  transactionItem: {
    marginBottom: 16,
  },
  transactionDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
    textAlign : 'center'
  },
  transactionBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,

    marginVertical : 5
  },
  sentTransaction: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-end',
  },
  receivedTransaction: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  transactionDescription: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    width: '100%',
    paddingLeft: 36,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '700',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    color: '#1F2937',
  },
  payButton: {
    backgroundColor: '#7E22CE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  payButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default TransactionHistoryScreen;
