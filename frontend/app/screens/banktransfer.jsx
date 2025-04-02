import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Banktransfer() {

  const [ bankAccountNumber, setBankAccountNumber ] = useState('');
  const router = useRouter();
  const [ confirmBankAccountNumber, setConfirmBankAccountNumber ] = useState('');

  const [ showAmountSection, setShowAmountSection ] = useState(false);

  const [ amount, setAmount ] = useState(0);

  const [ ifscCode, setIfscCode ] = useState('');
  const [ showMessage, setShowMessage ] = useState(false);

  const [ message, setMessage ] = useState('');


  const HandleBankTransfer = () => {


    setMessage('')
    setShowMessage(false)
    if ( bankAccountNumber.length < 9 || bankAccountNumber.length > 18 || 
      confirmBankAccountNumber.length < 9 ||
      confirmBankAccountNumber.length > 18
    ) {
      setMessage({container : 'accountNumber', message : "Please enter a valid account number"});
      setShowMessage(true);
      return;
    }

    if (bankAccountNumber !== confirmBankAccountNumber) {

      setMessage({container : 'accountNumber', message : "Account number is not matching" });
      setShowMessage(true);
      return;
    }

    if (!/^[A-Z]{4}[A-Z0-9]{7}$/.test(ifscCode)) {
      
      setMessage({ container : 'ifsc', message : "IFSC should be 4 Capital letters, followed by 7 letters or digits"});
      setShowMessage(true);
      return;
    }
    router.push({ pathname : '/screens/enterpinbanktransfer', params : { bankAccountNumber : bankAccountNumber, ifscCode : ifscCode, amount : amount, name : `XXXX${bankAccountNumber.slice(-4)}` }})

    
  }
  // return (
  //   <View>
      
  //     <Text>banktransfer</Text>
  //     <TextInput
  //       placeholder="Bank account number"
  //       placeholderTextColor="#888"
  //       keyboardType="phone-pad"
  //       value={bankAccountNumber}
  //       onChangeText={(text) => setBankAccountNumber(text)}
  //       style={styles.input}
  //     />

  //     { message.container === 'accountNumber' ? <Text>{message.message}</Text> : ''}
       
  //     <TextInput

  //       placeholder="Confirm bank account number"
  //       placeholderTextColor="#888"
  //       keyboardType="phone-pad"
  //       value={confirmBankAccountNumber}
  //       onChangeText={(text) => setConfirmBankAccountNumber(text)}
  //       style={styles.input}
  //     />

  //     { message.container === 'accountNumber' ? <Text>{message.message}</Text> : ''}
  //     <TextInput
  //       placeholder="IFSC code"
  //       placeholderTextColor="#888"
  //       keyboardType="default"
        
  //       value={ifscCode}
  //       onChangeText={(text) => setIfscCode(text)}
  //       style={styles.input}
  //     />
  //     { message.container === 'ifsc' ? <Text>{message.message}</Text> : ''}
  //     <View>
        
  //       <TouchableOpacity onPress={() => HandleBankTransfer()} style={styles.payButton}>
  //         <Text style={{ fontSize : width * 0.04, color : 'white', textAlign : 'center', fontWeight : 400 }}>Continue</Text>
  //       </TouchableOpacity>
  //       <Text>This information will be securely saved as per YahviPay Terms of Service and Privacy Policy</Text>
  //     </View>
  //   </View>
  // )


  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <View style={styles.iconWrapper}>
           <FontAwesome5 name="university" size={32} color="#6366F1" />
         </View>
         <Text style={styles.headerText}>Bank Transfer</Text>
         <Text style={styles.subText}>Send money to any Bank</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.subtitle}>Enter Account Details</Text>

        <TextInput
        placeholder="Bank account number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={bankAccountNumber}
        onChangeText={(text) => setBankAccountNumber(text)}
        style={styles.upiInput}
        />

      { message.container === 'accountNumber' ? <Text style={{ paddingBottom : 10, marginTop : -8, color : '#da0002' }}>{message.message}</Text> : ''}
       
      <TextInput

        placeholder="Confirm bank account number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={confirmBankAccountNumber}
        onChangeText={(text) => setConfirmBankAccountNumber(text)}
        style={styles.upiInput}
      />

      { message.container === 'accountNumber' ? <Text style={{ paddingBottom : 10, marginTop : -8, color : '#da0002' }}>{message.message}</Text> : ''}
      <TextInput
        placeholder="IFSC code"
        placeholderTextColor="#888"
        keyboardType="default"
        
        value={ifscCode}
        onChangeText={(text) => setIfscCode(text)}
        style={styles.upiInput}
      />
      { message.container === 'ifsc' ? <Text style={{ paddingBottom : 10, marginTop : -8, color : '#da0002' }}>{message.message}</Text> : ''}

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
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.payButton, amount <= 0 ? styles.buttonDisabled : '' ]}
                    onPress={HandleBankTransfer}
                    onPressIn={HandleBankTransfer}
                    disabled={amount <= 0 ? true : false}
                  >
                    <Text style={styles.payButtonText}>Pay Now</Text>
                  </TouchableOpacity>
                </View>
            )}

      { !showAmountSection && 
        <TouchableOpacity
              style={[styles.continueButton, bankAccountNumber && confirmBankAccountNumber && ifscCode ? '' : styles.buttonDisabled ]}
              onPress={() => setShowAmountSection(true)}    
              disabled={ bankAccountNumber && confirmBankAccountNumber && ifscCode ? false : true }      
            >
              <Text style={styles.continueButtonText}>Send Money</Text>
        </TouchableOpacity> 
      }


    </View>
    </View>
  );
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