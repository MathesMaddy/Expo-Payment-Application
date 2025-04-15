import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');

export default function payuser() {


  const [inputText, setInputText] = useState('');
  const [isPaymentMode, setIsPaymentMode] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  const { name, transferPhoneNumber } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: name });
    
    const fetchData = async() => {
      let result = await SecureStore.getItemAsync('token');
      if(result) {
        try {
          const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_GET_USER_TRANSACTION || '';
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: result, phoneNo: transferPhoneNumber })
          });
          
          if(res.ok) {
            const data = await res.json();
            setTransactions(data);
          }
          else if(res.status === 404) {
            setTransactions([]);
          }
          else {
            router.replace('/');
          }
        }
        catch(e) {
          console.log(e);
        }
      }
      else {
        router.replace('/');
      }
    };
    
    fetchData();
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [navigation, transferPhoneNumber]);

  const handleInputChange = (text) => {
    setInputText(text);
    
    const isNumber = /^\d/.test(text);
    setIsPaymentMode(isNumber);
    
    if (isNumber) {
      setIsButtonDisabled(Number(text) <= 0);
    } 
    else {
      setIsButtonDisabled(text.trim() === '');
    }
  };

  const handleButtonPress = async() => {
    if (isPaymentMode) {
      if(Number(inputText) <= 100000) {
        router.push({
          pathname: '/screens/enterpin', 
          params: { 
            phoneNumber: transferPhoneNumber, 
            amount: inputText, 
            name: name 
          }
        });
      }
    } 
    else {
      let result = await SecureStore.getItemAsync('token');
      if(result) {
        try {
          const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_SEND_USER_MESSAGE || '';
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
              token: result, 
              message: inputText, 
              phoneNo: transferPhoneNumber 
            })
          });

          if(res.ok) {
            const data = await res.json();
            setTransactions([...transactions, data]);
            setIsButtonDisabled(true);
          }
          else if(res.status === 404) {
            setTransactions([]);
          }
          else {
            router.replace('/');
          }
        }
        catch(e) {
          console.log(e);
        }
      }
      else {
        router.replace('/');
      }      
      setInputText(''); 
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentList} ref={scrollViewRef}>
        {transactions.length > 0 || messages.length > 0 ? (
          <>
            {transactions.map((transaction, index) => (
              <View key={`transaction-${index}`} style={styles.transactionItem}>
                <Text style={styles.transactionDate}>{transaction.createdAt}</Text>        
                {transaction.transactionId ? (
                  <View
                    style={[
                      styles.transactionBox, 
                      transaction.sender === 'send' ? styles.sentTransaction : styles.receivedTransaction
                    ]}
                  >
                    <View style={styles.transactionContent}>
                      <Text style={styles.transactionAmount}>Rs.{transaction.paymentAmount}</Text>
                      <Text style={styles.transactionSuccess}>
                        {transaction.sender === 'send' ? 'Transaction Send' : 'Transaction Receive'}
                      </Text>
                    </View>
                    <Text style={styles.transactionDescription}>{transaction.paymentStatus}</Text>
                  </View>
                ) : (
                  <View key={`message-${index}`} style={styles.messageItem}>
                    <View
                      style={[
                        styles.messageBox, 
                        transaction.sender === 'send' ? styles.sentMessage : styles.receivedMessage
                      ]}
                    >
                      <Text style={styles.messageText}>{transaction.text}</Text>
                      <Text style={styles.messageTimestamp}>{transaction.time}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </>
        ) : (
          <View style={styles.noContentContainer}>
            <Ionicons name="chatbubbles-outline" size={35} color="black" style={styles.noContentIcon}/>
            <Text style={styles.noContent}>No messages or transactions yet</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          {isPaymentMode && (
            <FontAwesome5 name="rupee-sign" size={24} style={styles.inputIcon} />
          )}
          <TextInput
            style={styles.textInput}
            placeholder={isPaymentMode ? "0" : "Type a message"}
            keyboardType={isPaymentMode ? "numeric" : "default"}
            value={inputText}
            onChangeText={handleInputChange}
          />
        </View>

        <TouchableOpacity style={[styles.actionButton, isButtonDisabled && styles.buttonDisabled]} disabled={isButtonDisabled} onPress={handleButtonPress}>
          {isPaymentMode ? (
            <Text style={styles.buttonText}>Pay</Text>
          ) : (
            <Ionicons name="send" size={22} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentList: {
    flex: 1,
    paddingTop: width * 0.05,
    paddingHorizontal: 16,
    marginBottom: 80,
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height - 220,
  },
  noContentIcon: {
    borderRadius: 50,
    padding: 20,
    backgroundColor: '#E5E7EB',
  },
  noContent: {
    paddingTop: width * 0.03,
    fontSize: width * 0.035,
    fontWeight: '500',
  },
  transactionItem: {
    marginBottom: 16,
  },
  transactionDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  transactionBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 5,
    width: 200,
  },
  sentTransaction: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-end',
  },
  receivedTransaction: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-start',
  },
  transactionContent: {
    justifyContent: 'flex-start',
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  transactionSuccess: {
    color: 'white',
    paddingTop: 5,
  },
  transactionDescription: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 8,
  },
  messageItem: {
    marginBottom: 12,
  },
  messageBox: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    maxWidth: '75%',
  },
  sentMessage: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#1F2937',
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#6B7280',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  inputIcon: {
    marginRight: 8,
    color: '#6B7280',
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  actionButton: {
    backgroundColor: '#7E22CE',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});