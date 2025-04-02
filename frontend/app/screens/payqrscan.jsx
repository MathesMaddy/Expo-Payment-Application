import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { TextInput } from 'react-native-gesture-handler';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get("window");

export default function Payuser() {

    const { data } = useLocalSearchParams();
    console.log(data);
    
    const [ amount, setAmount ] = useState(0);

    const [ upiId, setUpiId ] = useState('');
    const [ name, setName ] = useState('');
    const router = useRouter();

    const navigation = useNavigation();

    useEffect(() => {
        const params = new URLSearchParams(data.split('?')[1]);
        const upiId = params.get('pa')// Payee UPI ID
        setUpiId(upiId)
        const name = decodeURIComponent(params.get('pn') || '') // Payee Name
        setName(name)
        navigation.setOptions({ title: name }); // Set header title        
    }, [navigation]);
    
    const HandlePay = () => {
        
        if(Number(amount) <= 100000) {
            router.push({pathname : '/screens/enterpinqrscan', params : { upiId : upiId, amount : amount }})

        }
    }

  return (
    // <View style={styles.container}>     
    //   <View style={styles.amountContainer}>
    //     <View>
    //       <Text style={styles.header}>Send Money</Text>
    //       <Text style={styles.subHeader}>to any UPI app</Text>
    //     </View>

    //   </View> 
    //   <View style={styles.inputContainer}>
    //     <TextInput
    //       placeholder="Enter amount to pay"
    //       placeholderTextColor="#888"
    //       keyboardType="phone-pad"

    //       value={amount}
    //       onChangeText={(text) => setAmount(text)}
    //       maxLength={6}
    //       style={styles.input}
    //     />

    //     <TouchableOpacity onPress={() => HandlePay()} style={[styles.payButton]} disabled = { !Number(amount) ? true : false }>
    //       {/* <Text style={{ fontSize : width * 0.04, color : 'white', textAlign : 'center', fontWeight : 400 }}>Make payment</Text> */}
          
    //       <MaterialCommunityIcons name="send-circle" color="#0E7C7B" size={50} style={[styles.sendIcon, !Number(amount) ? { color : '#888' } : '']}/>
    //     </TouchableOpacity>
    //   </View>
      
    // </View>

    <View style={styles.container}>
      <View style={styles.header}>
         <View style={styles.iconWrapper}>
           <Ionicons name="qr-code" size={32} color="#6366F1" />
         </View>
         <Text style={styles.headerText}>QR Payment</Text>
         <Text style={styles.subText}>Pay any QR Scan using YahviPay</Text>
      </View>

      <View style={styles.header}>

            <View style={styles.amountInputContainer}>
              <Text style={styles.amountLabel}>Enter Amount</Text>
              <View style={styles.amountInputWrapper}>
                <Text style={styles.dollarSign}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(text) => setAmount(text)}
                />
              </View>
            </View>
            <TouchableOpacity
              style={[styles.payButton, amount <= 0 ? styles.buttonDisabled : '' ]}
              onPress={() => HandlePay()}
              disabled={amount <= 0 ? true : false}
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
      </View>
    
    </View>
  )
}


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
})