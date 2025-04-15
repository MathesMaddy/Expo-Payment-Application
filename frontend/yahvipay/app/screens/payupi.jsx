import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// import { TextInput } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

import * as SecureStore from 'expo-secure-store';
const { width, height } = Dimensions.get('window');

export default function payupi() {
  const [ upiId, setUpiId ] = useState('');
  
  const [ amount, setAmount ] = useState('');

  const [ showAmountSection, setShowAmountSection ] = useState(false);

  const [ recentPay, setRecentPay ] = useState([]);
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

  useEffect(() => {
    const FetchRecentPay = async() => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          try {
            const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_CHECK_RECENT_UPI_PAY || ''
            const res = await fetch(apiUrl, {
              method : "POST",
              headers : {
                "Content-Type" : 'application/json'
              },
              body : JSON.stringify({ token : token })
            })
            if(res.ok) {
              const data = await res.json()
              console.log(data)
              setRecentPay(data)
            }
          }
          catch(e) {
            console.log(e)
          }
        } 
      } 
      catch (error) {
        console.error('Error checking auth:', error);
        router.replace('/')  
      } 
    }
    FetchRecentPay();
  }, [])

  const HandleClearAll = () => {
    setUpiId('')
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
        <View style={styles.clearHeader}>
          <Text style={styles.subtitle}>Enter UPI ID</Text>
          <TouchableOpacity onPress={() => HandleClearAll()}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>

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
      { recentPay.length ? (
        
        <View style={styles.recentPayHeader}>
          <Text style={styles.recentPayTitle}>Recent Pay</Text>
          <View style={styles.recentPayContainer}>
            { recentPay.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => setUpiId(item.upiId)}>
                <View style={styles.recentPay}>
                  <View style={styles.recentPayProfileImageContainer}>
                    <Text style={styles.recentPayProfileImage}>{item.profileImage}</Text> 
                  </View>
                  <Text style={styles.recentPayName}>{item.fullName}</Text>  
                </View>
              </TouchableOpacity>
            )) }
          </View>
        </View>
      ) : ''}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding : 16
  },
  header: {
    backgroundColor: "#fff", 
    borderRadius: 12, 
    marginBottom: 20,
    padding : 16
  },
  clearHeader : {
    flexDirection : 'row',
    
    justifyContent : 'space-between'
  },
  clearAllText : {
    color : '#6A5ACD',
    fontSize : 15,
    fontWeight : 500
  },
  iconWrapper: {
    padding: 15,
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
  recentPayHeader : {
    backgroundColor: "#fff", 
    borderRadius: 12, 
    marginBottom: 20,
    padding : 16,
  },  
  recentPayTitle : {
    fontSize : 18,
    fontWeight : 500,
    marginBottom : 15
  },
  recentPayContainer : {
    flexDirection : 'row',
    gap : 20,
    width : '100%'
  },
  recentPay : {    
    justifyContent : 'center',
    alignItems : 'center'
  },
  recentPayProfileImageContainer : {
    backgroundColor : '#6A5ACD',
    height : 50,
    width : 50,
  
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 50
  },
  recentPayProfileImage : {
    color : 'white',
    fontSize : 30,
  },
  recentPayName : {
    marginTop : 5,
    fontSize : 15
  }
});