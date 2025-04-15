import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native'
import React from 'react'


export default function kycdetails() {

  const handleProceed = () => {

  }

  return (

    <View style={styles.container}>
          <View>    
          <Image
            source={require("@/assets/images/react-logo.png")}
            style={styles.logo}
            resizeMode="contain"
            />
          <Text style={styles.heading}>Verfiy your mobile number</Text>
          <Text style={styles.createAccount}>This verifies your identify and helps you securely log in to YahviPay</Text>
          <Text style={styles.enterNumber}>Enter OTP send to +91 {}</Text>
          <TextInput
            style={styles.input}
            placeholder="----- -----"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            
            />
          <TouchableOpacity style={ styles.button } onPress={handleProceed} >
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
    
            </View>
          <Text style={styles.termsConditions}>By proceeding, you are agreeing to <Text style={{ color : '#0E7C7B' }}>YahviPay's Terms and Conditions</Text> & <Text style={{ color : '#' }}>Privacy Policy.</Text></Text>
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop : 50,
    paddingBottom : 15,
    justifyContent : 'space-between'
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    paddingBottom : 3
  },
  createAccount : {
    fontSize : 13,
    fontWeight : 400,
    color : 'grey'
  },
  enterNumber : {
    fontSize : 17,
    fontWeight : 500,
    paddingTop : 25,
    paddingBottom : 5
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop : 3,
    fontSize: 18,
    marginBottom: 12,
    fontWeight : 800,
    letterSpacing : 8
  },
  button: {
    width: "100%",
    backgroundColor: "#0E7C7B",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonDisable : {

    backgroundColor : '#888'
  },
  signupText: {
    marginTop: 16,
    color: "#666",
  },
  signupLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
  termsConditions : {
    color : '#888',
    fontSize : 13
  }
});