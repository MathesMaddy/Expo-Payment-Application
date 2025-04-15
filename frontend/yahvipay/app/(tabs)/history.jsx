import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';

import * as SecureStore from 'expo-secure-store';
import moment from "moment";
import { router } from 'expo-router';

const { height, width } = Dimensions.get('window');

export default function history() {


  const [ history, setHistory ] = useState([]);
  const [ limit, setLimit ] = useState(1);
  const [ page, setPage ] = useState(1);
  const [ loading, setLoading ] = useState(true);
  const [ userId, setUserId ] = useState('')
  const [ hasMore, setHasMore ] = useState(true);
  const [ months, setMonths ] = useState('');
  // const [ transactionsMonths, setTransactionMonths ] = useState('');
  const [ categories, setCategories ] = useState('');
  const [ status, setStatus ] = useState('');

  const GetHistory = async(text) => {
    // setLoading(true);
    if(months || categories || status) {
      setPage(1)
    }
    try {
      
    

      const apiUrl = `${process.env.EXPO_PUBLIC_API_PAYMENT_HISTORY}` || ''
      console.log(apiUrl)
      let result = await SecureStore.getItemAsync('token');

      if(result) {
        const response = await fetch(apiUrl, {

          method : 'POST',
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({ token : result, months : months, categories : categories, status : status, limit : 10, page : page })
        })

        
        if(response.ok) {

          const data = await response.json();
          console.log(data)
          setUserId(data.userId)
          if(months || categories || status) {
            setHistory([...history, ...data.finalResult])
          }
          else {
            setHistory([ ...history, ...data.finalResult])          
          }
          setPage(page + 1);
        }
        else if(response.status === 406){
          console.log('q')
          setHasMore(false);
        }
      }
      else {
        router.replace('/')
      }
    }
    catch(e) {
      console.log(e)
    }
    finally {
      setLoading(false)
    }
  } 
  useEffect(() => { setHistory([])
    
    setHasMore(true)
    setPage((prev) => prev / prev)
    GetHistory()
  }, [months, categories, status])
  
  const HandleClearAll = () => { setPage(1);
    setMonths('');
    setCategories('');
    setStatus('');
  }
  console.log(months, categories, status);

  return (
    <SafeAreaView>
      <View style={styles.container}>      
        <View style={styles.sectionContainer}>
          <View style={styles.header}>
            <Text style={styles.sectionTitle}>Recent Transactions History</Text>
            <Text style={styles.sectionSubTitle}>View and filter your past transactions</Text>
                    
            <View style={styles.filterContainer}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterHeaderText}>Filters</Text>
                <TouchableOpacity style={styles.filterClearButton} onPress={() => HandleClearAll()}>
                  <Text style={styles.filterClearText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.filterGrid}>
                <View style={styles.filterDropdownContainer}>
                  <Picker style={styles.filterPicker} mode="dropdown" placeholder="Months" selectedValue={months} onValueChange={(value) => setMonths(value)}>
                    <Picker.Item style={styles.filterPicker} label="Months" value="" />
                    <Picker.Item style={styles.filterPicker} label='This months' value='0' />                          
                    <Picker.Item style={styles.filterPicker} label='Last 30 days' value='30' />
                    <Picker.Item style={styles.filterPicker} label='Last 90 days' value='90' />
                  </Picker>
                  {/* <Ionicons name="arrow-down" size={20} color="gray" style={styles.filterIcon} /> */}
                </View>

                <View style={styles.filterDropdownContainer}>
                  <Picker style={styles.filterPicker}  mode="dropdown" placeholder="Categories" selectedValue={categories} onValueChange={(value) => setCategories(value)}>
                    <Picker.Item style={styles.filterPicker} label="Categories" value="" />
                    <Picker.Item style={styles.filterPicker} label="Money Sent" value="send" />
                    <Picker.Item style={styles.filterPicker} label="Money Received" value="received" />
                    {/* <Picker.Item style={styles.filterPicker} label="Recharge & Bills" value="recharge" /> */}
                  </Picker>
                  {/* <Ionicons name="arrow-down" size={20} color="gray" style={styles.icon} /> */}
                </View>

                <View style={styles.filterDropdownContainer}>
                  <Picker style={styles.filterPicker} selectedValue={status} mode="dropdown" onValueChange={(value) => setStatus(value)}>
                    <Picker.Item style={styles.filterPicker} label="Status" value="" />
                    <Picker.Item style={styles.filterPicker} label="Success" value="paid" />
                    <Picker.Item style={styles.filterPicker} label="Failed" value="failed" />
                    <Picker.Item style={styles.filterPicker} label="Pending" value="pending" />
                  </Picker>
                  {/* <Ionicons name="arrow-down" size={20} color="gray" style={styles.icon} /> */}
                </View>
              </View>
            </View>
          </View>
          { loading ? (
            <ActivityIndicator size="large" color="#0E7C7B" />
          ) : history.length ? (
          <View style={styles.historyContainer}>
            <FlatList
              data={history}
              keyExtractor={item => item.transactionId}
              onEndReached={GetHistory}
              renderItem={({ item }) => (
                <TouchableOpacity key={item.transactionId}>
                    <View style={styles.transactionContainer}>
                      <View style={styles.transactionDetails}>
                        <View style={styles.iconContainerGreen}>
                        {item.sender === userId ? 
                          <Ionicons name="arrow-up" size={24} color="white" /> 
                            : 
                          <Ionicons name="arrow-down" size={24} color="white" /> 
                        }
                        </View>
                        <View>
                          <Text style={styles.transactionText}>{item.sender === userId ? 'Paid to' : 'Received from'}</Text>
                          <Text style={styles.transactionText}>{item.sender === userId ? item.receiverName : item.senderName}</Text>
                          <Text style={styles.transactionTime}>{item.createdAt}</Text>
                        </View>
                      </View>
                      <Text style={styles.transactionAmountGreen}>₹{item.paymentAmount}</Text>
                    </View>
                </TouchableOpacity>
              )}
            />
          </View>
          ) : 

          <View style={styles.loadingContainer}>
            <View style={styles.loadingHeader}>
              {/* <Text style={styles.sectionTitle}>Recent Transactions</Text> */}
              <Ionicons name="receipt" size={40} color="white" />
            </View>
            <Text style={{ textAlign : 'center'}}>No Transactions History</Text>
          </View>
          }   
        </View>     
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  section: { 
    backgroundColor: "#fff", 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16 
  },
  sectionSubTitle : {
    color : '#888',
  },
  actionItem: { 
    alignItems: "center", 
    flex: 1, 
    marginVertical: 8 
  },
  container : { 
    // backgroundColor: "#fff", 
    padding: 16, 
  },
  sectionContainer: {
    borderRadius: 8,
    // padding: 16,
    marginBottom: 150,
    height : height - 50
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    paddingBottom: 2,
  },
  header: {
    // paddingBottom: ,
    backgroundColor : '#fff',
    padding : 16, borderRadius : 5
  },

  loadingContainer : {
    flex : 1,
    marginTop : 16,
    backgroundColor : '#fff',
    justifyContent : 'center',
    alignItems : 'center'
  },
  loadingHeader : {
    padding : 10,
    borderRadius : 50,
    backgroundColor : 'grey',
    
    width : 80,
    height : 80,
    marginBottom : 10,
    justifyContent : 'center',

    alignItems : 'center'
  },
  filterContainer: {
    marginTop : 10,

    paddingVertical: 10, 
    
    // borderTopColor : '#9f9f9f', borderBottomColor : '#9f9f9f', borderTopWidth : 1, borderBottomWidth : 1,
    
    backgroundColor: 'white',
  },
  historyContainer : {
    paddingTop : 20,
    marginBottom : 220,
    
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4A4A',
  },
  filterClearButton: {
    paddingVertical: 4,
  },
  filterClearText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007BFF',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },  
  filterDropdownContainer: {
    position: 'relative',
    flex: 1,
  },
  filterPicker: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    // borderRadius: 8,
    // paddingHorizontal: 12,
    // paddingVertical: 8,
    
    fontSize: 12,
    color: 'black',
  },
  filterIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  viewAllText: {
    fontSize: 8,
    color: '#5B21B6',
    fontWeight: '500',
  },
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor : '#fff',
    paddingBottom: 16,
    padding : 16
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainerGreen: {
    width: 40,
    height: 40,
    backgroundColor: '#10B981',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerRed: {
    width: 40,
    height: 40,
    backgroundColor: '#F87171',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerBlue: {
    width: 40,
    height: 40,
    backgroundColor: '#93C5FD',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  transactionTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmountGreen: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16A34A',
  },
  transactionAmountRed: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
});
