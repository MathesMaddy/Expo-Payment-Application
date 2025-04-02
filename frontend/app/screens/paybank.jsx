import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { TextInput } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get("window");

export default function payuser() {

    const { name, bankAccountNumber, ifscCode } = useLocalSearchParams();

    
    const [ amount, setAmount ] = useState(0);
    const router = useRouter();

    const navigation = useNavigation();

    useEffect(() => {
      navigation.setOptions({ title: name }); // Set header title
    }, [navigation, bankAccountNumber]);
    
    const HandlePay = () => {
        
        if(Number(amount) <= 100000) {
            router.push({pathname : '/screens/enterpinbanktransfer', params : { bankAccountNumber : bankAccountNumber, ifscCode : ifscCode, amount : amount }})

        }
    }

  return (
    <View style={styles.container}>     
      <View style={styles.amountContainer}>
        <View>
          <Text style={styles.header}>Send Money</Text>
          <Text style={styles.subHeader}>to any UPI app</Text>
        </View>

      </View> 
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter amount to pay"
          placeholderTextColor="#888"
          keyboardType="phone-pad"

          value={amount}
          onChangeText={(text) => setAmount(text)}
          maxLength={6}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => HandlePay()} style={[styles.payButton]} disabled = { !Number(amount) ? true : false }>
          {/* <Text style={{ fontSize : width * 0.04, color : 'white', textAlign : 'center', fontWeight : 400 }}>Make payment</Text> */}
          
          <MaterialCommunityIcons name="send-circle" color="#0E7C7B" size={50} style={[styles.sendIcon, !Number(amount) ? { color : '#888' } : '']}/>
        </TouchableOpacity>
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'space-between',
    paddingTop : 20,
  },
  amountContainer : {

    paddingHorizontal : 15
  },
  header : {
    fontSize : width * 0.05,
    fontWeight : 500,
    letterSpacing : 1,
    paddingBottom : 3
  },
  subHeader : {
    color : '#888',
    paddingBottom : 15
  },
  inputContainer : {

    borderColor : '#888',
    borderWidth : 1,
    // paddingHorizontal : 15,
    // paddingVertical : 10,
    borderRadius : 5,
    height : 50,
    width : width,
    flexDirection : 'row',
    justifyContent : 'space-between'
  },
  input : {
    height : 50,
    fontSize : width * 0.045,
    letterSpacing : 2,
    fontWeight : 500,
    marginLeft : 15,
    width : width - 100
  },
  contactHeader : {
    color : '#888',
    paddingTop : 15,
    fontSize : width * 0.038,
    paddingBottom : 15
  },
  payButton : {
    paddingHorizontal : 10,
    paddingVertical : 8,
    // borderWidth : 1,
    // backgroundColor : 'white',
    // borderRadius : 10,
    
    
    justifyContent : 'center',
    alignContent : 'center'
  },
  sendIcon : {
    height : 50,
    width : 50
  }
})