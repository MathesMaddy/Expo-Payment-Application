import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';


const { width, height } = Dimensions.get('window');

const KYCScreen = () => {
  
  const scrollViewRef = useRef();
  const router = useRouter()
  const [ kycDetails, setKycDetails ] = useState({
        fullName : '',
        bankName : '',
        bankAccountNumber : '',
        ifscCode : '',
        aadharNumber : '',
        panCard : '',
  })
  const [ detailsSubmited, setDetailsSubmited ] = useState(true);
  const [ isFocus, setIsFocus ] = useState(false);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }
  };

  const HandleSubmit = async() => {
    console.log('zzz')
    if(kycDetails.fullName && kycDetails.bankName && kycDetails.bankAccountNumber && kycDetails.ifscCode && kycDetails.aadharNumber && kycDetails.panCard ) {
        setDetailsSubmited(true)
        router.replace({ pathname : '/createpin',  params : { kycDetails : JSON.stringify(kycDetails) }})
    }
    else {
      setDetailsSubmited(false);
    }
  }

  console.log(kycDetails)

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
    <View>
      <View style={styles.containerLogo}>
        <Text style={styles.textLogo}>YahviPay</Text>
      </View>

      <View style={styles.containerTitle}>
        <Text style={styles.title}>Verify your KYC Details</Text>
        <Text style={styles.subtitle}>
          This verifies your KYC details to transfer money using payment app.
        </Text>
      </View>

      { !detailsSubmited && <Text style={{ color : 'red', fontSize : 15, paddingTop : width * 0.02}}>Please enter valid kyc details</Text> }
      <View style={styles.containerInput}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, !detailsSubmited && { borderColor : 'red' }, isFocus && { borderColor : '#7E22CE' }]}
          placeholder="Enter your full name"
          value={kycDetails.fullName}
          onChangeText={(text) => setKycDetails(prev => ({ ...prev, fullName : text }))}
        />
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>Bank Name</Text>
        <TextInput
          style={[styles.input, !detailsSubmited && { borderColor : 'red' }]}
          placeholder="Enter your bank name"
          value={kycDetails.bankName}
          onChangeText={(text) => setKycDetails(prev => ({ ...prev, bankName : text }))}
        />
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>Bank Account Number</Text>
        <TextInput
          style={[styles.input, !detailsSubmited && { borderColor : 'red' }]}
          placeholder="Enter your account number"
          keyboardType="number-pad"
          value={kycDetails.bankAccountNumber}
          onChangeText={(text) => setKycDetails(prev => ({ ...prev, bankAccountNumber : text }))}
        />
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>Bank IFSC Code</Text>
        <TextInput
          style={[styles.input, !detailsSubmited && { borderColor : 'red' }]}
          placeholder="Enter IFSC code"
          value={kycDetails.ifscCode}
          onChangeText={(text) => setKycDetails(prev => ({ ...prev, ifscCode : text }))}
        />
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>Aadhar Number</Text>
        <TextInput
          style={[styles.input, !detailsSubmited && { borderColor : 'red' }]}
          placeholder="Enter your Aadhar number"
          keyboardType="number-pad"
          value={kycDetails.aadharNumber}
          onChangeText={(text) => setKycDetails(prev => ({ ...prev, aadharNumber : text }))}
        />
      </View>

      <View style={styles.containerInput}>
        <Text style={styles.label}>PAN Number</Text>
        <TextInput
          style={[styles.input, !detailsSubmited && { borderColor : 'red' }]}
          placeholder="Enter your PAN number"
          value={kycDetails.panNumber}
          onChangeText={(text) => setKycDetails(prev => ({ ...prev, panCard : text }))}
          
          onFocus={scrollToBottom}
        />
      </View>

      <TouchableOpacity style={styles.kycProceedButton} onPress={HandleSubmit} >
        <Text style={styles.kycProceedButtonText}>Proceed</Text>
      </TouchableOpacity>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, 
    padding: width * 0.05, 
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
  },
  containerLogo: {
    paddingTop: height * 0.05,
  },
  textLogo: {
    fontSize: width * 0.06,
    fontFamily: 'Pacifico',
    color: '#7E22CE',
  },
  containerTitle: {
    paddingTop: height * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: width * 0.04,
    color: 'gray',
    marginTop: height * 0.01,
  },
  containerInput: {
    paddingTop: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#374151',
    paddingBottom: height * 0.01,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: width * 0.03,
    fontSize: width * 0.04,
  },
  kycProceedButton: {
    marginTop: height * 0.03,
    backgroundColor: '#7E22CE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  kycProceedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  disablebutton : {  
    backgroundColor : '#888'
  },
  termsContainer: {
    paddingTop: height * 0.03,
  },
  termsText: {
    fontSize: width * 0.03,
    color: 'gray',
  },
  termsLink: {
    color: '#7E22CE',
  },
});

export default KYCScreen;