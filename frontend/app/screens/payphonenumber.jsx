// import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { TextInput } from 'react-native-gesture-handler'
// import { useRouter } from 'expo-router';
// import { Dimensions } from 'react-native';
// import AntDesign from '@expo/vector-icons/AntDesign';

// import * as Contacts from 'expo-contacts'
// import * as SecureStore from 'expo-secure-store';

// const { width, height } = Dimensions.get("window");

// export default function Payphonenumber() {

//   const router = useRouter()
//   const [contacts, setContacts] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [ transferPhoneNumber, setTransferPhoneNumber ] = useState('');

//   const [ enterPhoneNoDetail, setEnterPhoneNoDetail ] = useState('');

//   const [ toggleNumber, setToggleNumber ] = useState(false);

//   useEffect(() => {    
//     const FetchContacts = async () => {
//       const { status } = await Contacts.requestPermissionsAsync();
//       if (status === 'granted') {
//         const { data } = await Contacts.getContactsAsync({
//           fields: [Contacts.Fields.PhoneNumbers],
//         });
//         if (data.length > 0) {
//           const contact = data[0];
//           console.log(contact);
//           const formattedContacts = data.filter(contact => contact.phoneNumbers)
//             .map(contact => ({
//               id : contact.id,
//               name : contact.name,
//               phoneNumbers : cleanPhoneNumber(contact.phoneNumbers[0]?.number)
//             }))
//             .filter(contact => contact.phoneNumbers.length === 10)

//             console.log(formattedContacts);

//             try {
//               let result = await SecureStore.getItemAsync('token');
//               if(result) {
//                 const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_CHECK_PHONE_NUMBER || '';
//                 console.log('zz')
//                 const res = await fetch(apiUrl, {
                  
//                   method : 'POST',
//                   headers : {
//                     "Content-Type" : 'application/json'
//                   },
//                   body : JSON.stringify({ token : result, phoneNo : formattedContacts })
//                 })
//                 console.log('z')
//                 if(res.ok) {
//                   const data = await res.json()
//                   console.log(data)
//                   setContacts(data)
//                 }
//                 else {
                  
//                 }
//               }
//               else {
      
//               }
//             }
//             catch(e) {
//               console.log(e)
//             }       
//         }
//       }

//       setLoading(false)
//     }
//     FetchContacts();
//   }, []);
  
//   const HandleCheckNumber = async(text) => {
//     if(enterPhoneNoDetail.length === 10) {
//       console.log(enterPhoneNoDetail)
//       try {
//         let result = await SecureStore.getItemAsync('token');
//         if(result) {
//           const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_CHECK_PHONE_NUMBER || '';
//           console.log('zz')
//           const res = await fetch(apiUrl, {
            
//             method : 'POST',
//             headers : {
//               "Content-Type" : 'application/json'
//             },
//             body : JSON.stringify({ token : result, phoneNo : [enterPhoneNoDetail] })
//           })
//           console.log('z')
//           if(res.ok) {
//             const data = await res.json()
//             console.log(data)
//             if(data)
//               router.push({ pathname : '/screens/payuser', params : { paymentType : 'number', name : data.fullName, transferPhoneNumber : enterPhoneNoDetail }})
//           }
//           else {
            
//           }
//         }
//         else {

//         }
//       }
//       catch(e) {
//         console.log(e)
//       }
//     }
//     else {
//       setToggleNumber(false);
//     }
//   }

//   const cleanPhoneNumber = (number) => {
//     if (!number) return '';
//     let cleanedNumber = number.replace(/\D/g, ''); 
//     if (cleanedNumber.length > 10) {

//       cleanedNumber = Number(cleanedNumber.slice(-10)); 
//     }
//     return cleanedNumber;
//   };


//   const HandlePay = (number, name) => {
//     if(number.length === 10) {
//       console.log(number)
//       router.push({ pathname : '/screens/payuser',  params : { paymentType : 'number', name : name, transferPhoneNumber : number } })
//     }
//   }

//   const HandleEnterNumberPay = () => {
//     if(transferPhoneNumber.length === 10) {
//       console.log(transferPhoneNumber)
//       router.push({ pathname : '/screens/payuser',  params : { paymentType : 'number', name : transferPhoneNumber, transferPhoneNumber : transferPhoneNumber } })
//     }
//   }
//   return (
//     <View style={styles.container}>      
//       <View>
//         <Text style={styles.header}>Send Money</Text>
//         <Text style={styles.subHeader}>to any UPI app</Text>
//       </View>
//       <View style={styles.inputContainer}>
//         <AntDesign name="search1" size={24} color="black" />
//         <TextInput
        
//           placeholder="Search any mobile number"
//           placeholderTextColor="#888"
//           keyboardType="phone-pad"

//           value={enterPhoneNoDetail}
//           onChangeText={(text) => setEnterPhoneNoDetail(text)}
//           maxLength={10}
//           style={styles.input}
//         />
//       </View>
//       <View>
//         <TouchableOpacity onPress={() => HandleCheckNumber()} style={styles.payButton}>
//           <Text style={{ fontSize : width * 0.04, color : 'white', textAlign : 'center', fontWeight : 400 }}>Make payment</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={{ flexDirection : 'row', justifyContent : 'space-between' }}>
//         <Text style={styles.contactHeader}>Make Payments to Friends</Text>
//         <Text style={styles.contactHeader}>{contacts.length} Contacts</Text>

//       </View>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0E7C7B" />
//       ) : (
//         toggleNumber ? 

//           <TouchableOpacity 
//               style={styles.contactItem} 
//               onPress={() => { 
//                 // setTransferPhoneNumber(item.phoneNumbers)

//                 HandlePay(transferPhoneNumber.name, transferPhoneNumber.phoneNumbers) 
//               }}
//             >
//               <Text style={styles.contactName}>{transferPhoneNumber.name}</Text>
//               <Text style={styles.contactNumber}>{transferPhoneNumber.phoneNumbers}</Text>
//           </TouchableOpacity>
//         : <FlatList
//           data={contacts}
//           keyExtractor={item => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity 
//               style={styles.contactItem} 
//               onPress={() => { 
//                 // setTransferPhoneNumber(item.phoneNumbers)
//                 HandlePay(item.phoneNumbers, item.name) 
//               }}
//             >
//               <Text style={styles.contactName}>{item.name}</Text>
//               <Text style={styles.contactNumber}>{item.phoneNumbers}</Text>
//             </TouchableOpacity>
//           )}
//           />
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({

//   container : {
//     paddingTop : 20,
//     paddingHorizontal : 20
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
//     borderColor : 'black',
//     borderWidth : 1,
//     paddingHorizontal : 15,
//     paddingVertical : 10,
//     borderRadius : 20,
//     height : 50,
//     flexDirection : 'row',
//     alignItems : 'center'
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
//     marginTop : 15,
//     paddingHorizontal : 10,
//     paddingVertical : 8,
//     borderWidth : 1,
//     backgroundColor : '#0E7C7B',
//     borderRadius : 10,
//   },
//   contactHeader: { color: "#888", paddingTop: 15, fontSize: width * 0.038, paddingBottom: 15 },
//   contactItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
//   contactName: { fontSize: 16, fontWeight: "500" },
//   contactNumber: { fontSize: 14, color: "#888" },
// })

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AntDesign from '@expo/vector-icons/AntDesign';
import * as Contacts from 'expo-contacts'
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get("window");

const PayToPhoneScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchText, setSearchText] = useState('');

  const router = useRouter()
  
  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [ noContacts, setNoContacts ] = useState(false);  
  const [ showInvalidNumber, setShowInvalidNumber ] = useState(false);

  useEffect( () => {    
    const FetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
          const formattedContacts = data.filter(contact => contact.phoneNumbers)
            .map(contact => ({
              id : contact.id,
              name : contact.name,
              phoneNumbers : cleanPhoneNumber(contact.phoneNumbers[0]?.number)
            }))
            .filter(contact => contact.phoneNumbers.length === 10)

            setContacts(formattedContacts)
            // try {
            //   let result = await SecureStore.getItemAsync('token');
            //   if(result) {
            //     const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_CHECK_PHONE_NUMBER || '';

            //     const res = await fetch(apiUrl, {                  
            //       method : 'POST',
            //       headers : {
            //         "Content-Type" : 'application/json'
            //       },
            //       body : JSON.stringify({ token : result, phoneNo : formattedContacts })
            //     })
            //     if(res.ok) {
            //       const data = await res.json()
            //       setContacts(data)
            //     }
            //     else {
            //       setNoContacts(true)                  
            //     }
            //   }
            //   else {
            //     router.replace('/')
            //   }
            // }
            // catch(e) {
            //   console.log(e)
            // }       
        }
      }
      else {
        setNoContacts(true)    
      }
      setLoading(false)
    }
    FetchContacts();
  }, []);
  const cleanPhoneNumber = (number) => {

    if (!number) return '';
    let cleanedNumber = number.replace(/\D/g,''); 
    if (cleanedNumber.length > 10) {
      cleanedNumber = Number(cleanedNumber.slice(-10)); 
    }
    return cleanedNumber;
  };
  const HandleCheckNumber = async(text) => {
    if(phoneNumber.length === 10) {
      try {
        let result = await SecureStore.getItemAsync('token');
        if(result) {
          const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_CHECK_PHONE_NUMBER || '';
          const res = await fetch(apiUrl, {            
            method : 'POST',
            headers : {
              "Content-Type" : 'application/json'
            },
            body : JSON.stringify({ token : result, phoneNo : [phoneNumber] })
          })
          if(res.ok) {
            const data = await res.json()

            if(data)
              router.push({ pathname : '/screens/payuser', params : { paymentType : 'number', name : data.fullName, transferPhoneNumber : phoneNumber }})
          }
          else {
            setShowInvalidNumber(true)
          }
        }
        else {
          router.replace('/')
        }
      }
      catch(e) {
        console.log(e)
      }
    }
    else {
      
      setShowInvalidNumber(true)
    }
  }

  const HandleSelectedContact = (number, name) => {
    if(number.length === 10) {
      console.log(number)
      router.push({ pathname : '/screens/payuser',  params : { paymentType : 'number', name : name, transferPhoneNumber : number } })
    }
  }

  // const filteredContacts = contacts.length > 0 ? contacts.filter(contact => contact.name?.includes(searchText)) : '';

  // const sections = contacts.length > 0 ? [...new Set(filteredContacts.map(contact => contact.section))] : '';
  console.log(contacts)
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? padding : 'height'} style={styles.container}>
      
      <View style={styles.phoneNumberContainer}>
        <View style={styles.phoneInputWrapper}>
          <Ionicons name="phone-portrait-outline" size={24} color="#A0AEC0" style={styles.icon} />
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
          />
          { showInvalidNumber && <Text style={styles.errorMessage}>Please enter valid phone number</Text> }
        </View>
        <TouchableOpacity style={[styles.makePaymentButton, phoneNumber.length === 10 ? '' : styles.buttonDisable]} onPress={() => HandleCheckNumber()} disabled = { phoneNumber.length === 10 ? false : true }>
          <Text style={styles.makePaymentButtonText}>Make Payment</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.friendsContainer}>
        <Text style={styles.friendsTitle}>Make Payment to Friends</Text>

        <View style={styles.contactsListContainer}>

          { loading ? (

            <ActivityIndicator size="large" color="#0E7C7B" />
          ) : (
            <FlatList data={contacts} keyExtractor={item => item.id} renderItem={({ item }) => (
              <TouchableOpacity key={item.id} style={styles.contactItem} onPress={() => { HandleSelectedContact(item.phoneNumbers, item.name) }}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactPhone}>{item.phoneNumbers}</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={24} color="#A0AEC0" />
              </TouchableOpacity>
              )}
            />
          )}
      
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#F9FAFB',
  },
  phoneNumberContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  buttonDisable : {
    backgroundColor : '#888' 
  },
  icon: {
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize : 18,
    letterSpacing : 1
  },
  errorMessage : {

    color : 'red'
  },
  clearButton: {
    padding: 4,
  },
  makePaymentButton: {
    backgroundColor: '#5B21B6',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  makePaymentButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  friendsContainer: {
    marginTop: 20,
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  recentRecipientsContainer: {
    marginBottom: 16,
  },
  recentRecipientsLabel: {
    color: '#6B7280',
    marginBottom: 8,
  },
  recentRecipientsScroll: {
    flexDirection: 'row',
  },
  recipientItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  recipientImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    width: 64,
  },
  contactSearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  contactSearchInput: {
    flex: 1,
    paddingVertical: 12,
  },
  contactsListContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0,
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactInfo: {
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  contactPhone: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default PayToPhoneScreen;