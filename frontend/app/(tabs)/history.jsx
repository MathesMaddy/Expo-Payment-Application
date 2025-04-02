import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
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
  const [ page, setPage ] = useState(1);
  const [ loading, setLoading ] = useState(true);
  const [ userId, setUserId ] = useState('')
  const [hasMore, setHasMore] = useState(true);
  
  const GetHistory = async() => {
    if (!hasMore || !loading) 
      return; 
    setLoading(true);

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
          body : JSON.stringify({ token : result })
        })

        if(response.ok) {

          const data = await response.json();
          console.log(data)
          setUserId(data.userId)
          setHistory(data.finalResult)
          // setPage(page + 1);
        }
        else {
          console.log('zz')
          setHistory([])
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
  useEffect(() => {

    console.log('zz')
    GetHistory()
  }, [])

  return (
    <SafeAreaView>
      <View style={{ width : width / 1.1, marginHorizontal : 'auto' }}>      
        {loading ? (
          <ActivityIndicator size="large" color="#0E7C7B" />
        ) : history.length ? (
                <View style={styles.sectionContainer}>
                  <View style={styles.header}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                  </View>
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
          <View style={styles.sectionContainer}>
            <View style={styles.header}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
            </View>
            <Text style={{ textAlign : 'center'}}>No Transactions History</Text>
          </View>
          }        
        <StatusBar style='auto' />
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F9FAFB", 
    padding: 16 
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 20 
  },
  logo: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#5B21B6" 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20 
  },
  bannerContainer: { 
    borderRadius: 12, 
    overflow: "hidden", 
    position: "relative", 
    marginBottom: 20 
  },
  bannerImage: { 
    width: "100%", 
    height: 150 
  },
  bannerOverlay: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: "center", 
    padding: 16, 
    backgroundColor: "rgba(91, 33, 182, 0.6)" 
  },
  bannerTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#fff" 
  },
  bannerSubtitle: { 
    fontSize: 14, 
    color: "#fff", 
    marginBottom: 8 
  },
  inviteButton: { 
    backgroundColor: "#fff", 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 8, 
    width : 100
  },
  inviteButtonText: { 
    color: "#5B21B6", 
    fontWeight: "bold" 
  },
  section: { 
    backgroundColor: "#fff", 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16 
  },
  rechargeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  rechargeOption: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent : 'space-evenly',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,

    width: 165, // Adjust width as needed for spacing
    cursor: 'pointer',
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rechargeOptionText: {
    width : 60,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  sectionTitle: { 
    
    fontSize: 16, 
    
    fontWeight: "bold", 
    color: "#374151", 
    marginBottom: 12 
  },
  actionItem: { 
    
    alignItems: "center", 
    flex: 1, 
    
    marginVertical: 8 
  },
  iconContainer: { 
    width: 50, 
    
    height: 50, 
    
    borderRadius: 25, 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 4 
  },
  actionText: { 
    fontSize: 12, 
    
    color: "#374151", 
    textAlign: "center" 
  },
  upiContainer: { 
    backgroundColor: "#fff", 
    padding: 16, 
    
    borderRadius: 12, 
    flexDirection: "column", 
    marginBottom: 16 
  },
  upiLabel: { 
    fontSize: 14, 
    color: "#6B7280" 
  },
  upiRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
  },
  upiId: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#374151" 
  },
  copyButton: { 
    padding: 8, 
    backgroundColor: "#F3F4F6", 
    borderRadius: 20 
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
    height : height - 50
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#5B21B6',
    fontWeight: '500',
  },
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
