import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import AntDesign from '@expo/vector-icons/AntDesign';
import * as Contacts from 'expo-contacts'
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get("window");

export default function payphonenumber() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchText, setSearchText] = useState('');

  const router = useRouter()
  
  const [contacts, setContacts] = useState([]);
  const [ searchNumber, setSearchNumber ] = useState('');
  const [ inputLimit, setInputLimit ] = useState(false);

  const [loading, setLoading] = useState(true);
  const [ noContacts, setNoContacts ] = useState(false);  
  const [ showInvalidNumber, setShowInvalidNumber ] = useState(false);

  useEffect( () => {    
    FetchContacts();
  }, []);

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
            phoneNumbers : cleanPhoneNumber(contact.phoneNumbers[0]?.number),
            section : contact.name.charAt(0)
          }))
          .filter(contact => contact.phoneNumbers.length === 10)
          
          
          try {
            let result = await SecureStore.getItemAsync('token');
            if(result) {
              const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_CHECK_PHONE_NUMBER || '';
              const res = await fetch(apiUrl, {                  
                method : 'POST',
                headers : {
                  "Content-Type" : 'application/json'
                },
                body : JSON.stringify({ token : result, phoneNo : formattedContacts })
              })
              if(res.ok) {
                const data = await res.json()
                setContacts(data)
              }
              else {
                setNoContacts(true)                  
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
    }
    else {
      setNoContacts(true)    
    }
    setLoading(false)
  }

  const cleanPhoneNumber = (number) => {
    if (!number) return '';
    let cleanedNumber = number.replace(/\D/g,''); 
    if (cleanedNumber.length > 10) {
      cleanedNumber = Number(cleanedNumber.slice(-10)); 
    }
    return cleanedNumber;
  };

  const HandleCheckNumber = async(text) => {
    if(text.length === 10) {
      try {
        let result = await SecureStore.getItemAsync('token');
        if(result) {
          const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_CHECK_PHONE_NUMBER || '';
          const res = await fetch(apiUrl, {            
            method : 'POST',
            headers : {
              "Content-Type" : 'application/json'
            },
            body : JSON.stringify({ token : result, phoneNo : [Number(text)] })
          })
          console.log('qqq')
          if(res.ok) {
            const data = await res.json()
            if(data) {
              setShowInvalidNumber(false)
              setSearchNumber(data)
            }
            else {
              setShowInvalidNumber(true)
            }
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
    
      router.push({ pathname : '/screens/payuser',  params : { paymentType : 'number', name : name, transferPhoneNumber : number } })  
  }

  const HandleSearchContacts = async(number) => {
    console.log(number.length)
    setSearchText(number)
    if(!isNaN(number)) {

      setInputLimit(true)
      if(number.length === 10) {
        console.log('q')
        setPhoneNumber(number)
        HandleCheckNumber(number)
      }
      else if(number.length === 9) {

        await FetchContacts()
      }
    }
    else {
      setInputLimit(false)
    }
  }

  console.log(contacts)
  const filteredContacts = contacts.filter(contact => contact.name?.includes(searchText) || contact.phoneNumbers.includes(searchText));

  const sections = [...new Set(filteredContacts.map(contact => contact.section))];

  
  console.log(sections)
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? padding : 'height'} style={styles.container}>
      <ScrollView>      
      <View style={styles.friendsContainer}>
        <View style={styles.contactCountContainer}>
          <Text style={styles.friendsTitle}>Make Payment to Friends</Text>
          <Text style={styles.contactsCount}>{contacts.length} contacts</Text>
        </View>
        <View style={styles.contactsListContainer}>
        <View style={styles.contactSearchWrapper}>
          <Ionicons name="search-outline" size={24} color="#A0AEC0" style={styles.icon} />
          <TextInput
            style={styles.contactSearchInput}
            placeholder="Search by name or phone number"
            value={searchText}
            maxLength={inputLimit ? 10 : 50}
            onChangeText={(value) => HandleSearchContacts(value)}
          />
        </View>

          { loading ? (
            <View>

              <ActivityIndicator size="large" color="#0E7C7B" />
            
            </View>

          ) : searchText.length === 10 ? (

            <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>{searchNumber.section}</Text>
                </View>
                  <TouchableOpacity style={styles.contactItem} onPress={() => HandleSelectedContact(searchNumber.phoneNumbers, searchNumber.name)}>
                    <View style={styles.contactInfo}>
                      <View>
                        <Text style={styles.contactName}>{searchNumber.name}</Text>
                        <Text style={styles.contactPhone}>{searchNumber.phoneNumbers}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color="#A0AEC0" />
                  </TouchableOpacity>
              </View>
          ) : (
            sections.map((section, item) => (
              <View key={item}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>{section}</Text>
                </View>
                { filteredContacts.filter(contact => contact.section === section).map((contact, item) => (
                  <TouchableOpacity key={item} style={styles.contactItem} onPress={() => HandleSelectedContact(contact.phoneNumbers, contact.name)}>
                    <View style={styles.contactInfo}>
                      <View>
                        <Text style={styles.contactName}>{contact.name}</Text>
                        <Text style={styles.contactPhone}>{contact.phoneNumbers}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color="#A0AEC0" />
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}      
        </View>
      </View>
      </ScrollView>
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
  contactCountContainer : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
    paddingVertical : width * 0.02
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  contactsCount : {
    color : "grey",
    fontSize : width * 0.035
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
    // marginBottom: 16,
  },
  contactSearchInput: {
    flex: 1,
    paddingVertical: 12,
  },
  contactsListContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
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
    borderTopWidth : 1,
    
    borderBottomWidth : 1,

    borderTopColor : '#F3F4F6',
    borderBottomColor : '#F3F4F6'
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