import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router';
import { Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

export default function Mobilerecharge() {


  const [selectedBillType, setSelectedBillType] = useState('');
  
  const [ billType, setBillType ] = useState(['jio prepaid','airtel prepaid','vi prepaid','bsnl prepaid']);

  const [loading, setLoading] = useState(true);
  // const [screen, setScreen] = useState(Dimensions.get("window"));

  const [ rechargePhoneNumber, setRechargePhoneNumber ] = useState('');
  const [ amount, setAmount ] = useState(0)
  const [ showAmount, setShowAmount ] = useState(false);
  const [ price, setPrice ] = useState('');
  const [ showMessagePhoneNo, setShowMessagePhoneNo ] = useState('')
  const [ showMessageBillType, setShowMessageBillType ] = useState('')
  
  const [ showMessagePrice, setShowMessagePrice ] = useState(false)
  const [ showAmountSection, setShowAmountSection ] = useState(false)
  useEffect(() => {
    
    const FetchContacts = async () => {
    
    }
    FetchContacts();
  }, []);
  
  const router = useRouter()
 
  // const HandlePay = (number, name) => {
  //   if(number.length === 10) {
  //     console.log(number)
  //     router.push({ pathname : '/screens/payuser',  params : {  } })
  //   }
  // }

  const HandleEnterNumberPay = (text) => {
    console.log(rechargePhoneNumber, selectedBillType)

    if(rechargePhoneNumber.length !== 10) {
      setShowMessagePhoneNo(true)
    }
    else {
      
      setShowMessagePhoneNo(false)
    }
    if(!selectedBillType) {

      setShowMessageBillType(true)
    }
    else {
      setShowMessageBillType(false)
    }
    if(rechargePhoneNumber.length === 10 && selectedBillType) {
      setShowAmount(true);
      if(Number(amount) > 0) {
        console.log('z')

        setShowMessagePrice(false)
        
        router.push({ pathname : 'screens/mobilerecharge/enterpin', params : { rechargePhoneNumber : rechargePhoneNumber, amount : amount, billType : selectedBillType }})
      }
      else {
        setShowMessagePrice(true)
      }

      // router.push({ pathname : '/screens/payuser',  params : {  } })
    }

    else {

      setShowAmount(false)
    }

  }

  return (
    <View style={styles.container}>
    <View style={styles.header}>
       <View style={styles.iconWrapper}>
         <Ionicons name='phone-portrait-outline' size={32} color="#6366F1" />
       </View>
       <Text style={styles.headerText}>Mobile Recharge</Text>
       <Text style={styles.subText}>Send money to any Bank</Text>
    </View>

    <View style={styles.header}>
      <Text style={styles.subtitle}>Enter phone number</Text>

      <TextInput
        placeholder="phone number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={rechargePhoneNumber}
        onChangeText={(text) => setRechargePhoneNumber(text)}
        style={styles.upiInput}
      />

    { showMessagePhoneNo && <Text>Please enter phone number to process</Text> }
      <Picker
        selectedValue={selectedBillType}
        onValueChange={(itemValue) => setSelectedBillType(itemValue)}
        style={styles.picker}
        >
        <Picker.Item label="Select an Option" value="" />
        { billType.map((item, index) => (
          
          <Picker.Item key={index} label={item} value={item} />    
        ))}
      
      </Picker>
      { showMessageBillType && <Text>Please choose bill type</Text> }
      
    { showAmountSection && (
              <View style={styles.amountSection}>
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
                      maxLength={10}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.payButton, amount <= 0 ? styles.buttonDisabled : '' ]}
                  onPress={HandleEnterNumberPay}
                  disabled={amount <= 0 ? true : false}
                >
                  <Text style={styles.payButtonText}>Pay Now</Text>
                </TouchableOpacity>
              </View>
          )}

    { !showAmountSection && 
      <TouchableOpacity
            style={[styles.continueButton, rechargePhoneNumber.length === 10 ? '' : styles.buttonDisabled ]}
            onPress={() => setShowAmountSection(true)}    
            disabled={ rechargePhoneNumber.length === 10 ? false : true }      
          >
            <Text style={styles.continueButtonText}>Send Money</Text>
      </TouchableOpacity> 
    }


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