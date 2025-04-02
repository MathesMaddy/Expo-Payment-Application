import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView, Clipboard, Alert, Dimensions, StatusBar } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";
import Toast, { SuccessToast } from "react-native-toast-message";

import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {

  const router = useRouter();

  const { status, res } = useLocalSearchParams();
  const [ upiId, setUpiId ] = useState();
  const [ userData, setUserData ] = useState('');
  
  console.log(status, res);
  
  useEffect(() => {
    const checkUserAuth = async () => {
          try {            
            const token = await SecureStore.getItemAsync('token');
            if (token) {
              try {
                const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_GET_UPI_ID || ''
                const res = await fetch(apiUrl, {
                  method : "POST",
                  headers : {
                    "Content-Type" : 'application/json'
                  },
                  body : JSON.stringify({ token : token, transactions : true })
                })
                if(res.ok) {
                  const data = await res.json()
                  
                  console.log(data)
                  console.log('zz')
                  
                  setUpiId(data)
                  console.log(apiUrl)
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
    };
    
    checkUserAuth();
  
    // if (status) {
    //   if (Number(status) === 200) {
        
    //     Toast.show({
    //       type: "success",
    //       text1: res,
    //     });
    //   } else if (Number(status) === 406) {
    //     Toast.show({
    //       type: "error",
    //       text1: res,
    //       text2: "Insufficient balance or invalid request.",
    //     });
    //   } else {
    //     Toast.show({
    //       type: "info",
    //       text1: res,
    //     });
    //   }
    // }  
  }, [status, res]);
    
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
  };


  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={'dark-content'}/>
      <View style={styles.header}>
        <Text style={styles.logo}>YahviPay</Text>
        <TouchableOpacity onPress={() => router.push('/screens/profiledetails')}>
          <Image source={{ 
            uri: 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=' }} 
            style={styles.avatar} />
        </TouchableOpacity>
      </View>
      <View style={styles.bannerContainer}>
        <Image
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Refer Your Friends</Text>
          <Text style={styles.bannerSubtitle}>Get Cashback for each friend who joins</Text>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>Invite Now</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={{ flexDirection : 'row' }}>
        <TouchableOpacity style={styles.actionItem} onPress={() =>  router.push('/screens/payphonenumber')}>
          <View style={[styles.iconContainer, { backgroundColor: '#7E22CE' }]}>
            <Feather name='smartphone' size={20} color="white" />
          </View>
          <Text style={styles.actionText}>Pay to phone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={() =>  router.push('/screens/payupi')}>
          <View style={[styles.iconContainer, { backgroundColor: '#7E22CE' }]}>
            <FontAwesome5 name='credit-card' size={20} color="white" />
          </View>
          <Text style={styles.actionText}>Pay to UPI ID</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={() =>  router.push('/screens/banktransfer')}>
          <View style={[styles.iconContainer, { backgroundColor: '#7E22CE' }]}>
            <FontAwesome5 name='university' size={20} color="white" />
          </View>
          <Text style={styles.actionText}>Bank Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={() =>  router.push('/screens/checkbalance')}>
          <View style={[styles.iconContainer, { backgroundColor: '#7E22CE' }]}>
            <FontAwesome5 name='wallet' size={20} color="white" />
          </View>
          <Text style={styles.actionText}>Check Balance</Text>
        </TouchableOpacity>
        </View>
      </View>
      <View style={styles.upiContainer}>
        <Text style={styles.upiLabel}>My UPI ID</Text>
        <View style={styles.upiRow}>

          { upiId && 
          <> 
            <Text style={styles.upiId}>{upiId?.result?.upiId}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(upiId.result.upiId)} style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color="#7E22CE" />
            </TouchableOpacity> 
          </>}
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Bills & Recharge</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.rechargeOption} onPress={() => router.push('/screens/mobilerecharge')}>
            <View style={[styles.iconContainer, { backgroundColor: '#7E22CE' }]}>
              <Ionicons name='phone-portrait-outline' size={24} color="white" />
            </View>
            <Text style={styles.rechargeOptionText}>Mobile Recharge</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeOption} onPress={() => router.push('/screens/dthrecharge')}>
            <View style={[styles.iconContainer, { backgroundColor: '#7E22CE' }]}>
              <Ionicons name='tv-outline' size={24} color="white" />
            </View>
            <Text style={styles.rechargeOptionText}>DTH Recharge</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionContainer}>
          <View style={styles.transactionDetails}>
            <View style={styles.iconContainerGreen}>
              <Ionicons name="arrow-down" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.transactionText}>Received from David</Text>
              <Text style={styles.transactionTime}>Today, 10:42 AM</Text>
            </View>
          </View>
          <Text style={styles.transactionAmountGreen}>Rs.125.00</Text>
        </View>
        <View style={styles.transactionContainer}>
          <View style={styles.transactionDetails}>
            <View style={styles.iconContainerGreen}>
              <Ionicons name="arrow-up" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.transactionText}>Paid to Amazon</Text>
              <Text style={styles.transactionTime}>Yesterday, 8:15 PM</Text>
            </View>
          </View>
          <Text style={styles.transactionAmountRed}>-Rs.49.99</Text>
        </View>
        <View style={styles.transactionContainer}>
          <View style={styles.transactionDetails}>
            <View style={styles.iconContainerGreen}>
              <Ionicons name="arrow-up" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.transactionText}>Mobile Recharge</Text>
              <Text style={styles.transactionTime}>Mar 30, 2:30 PM</Text>
            </View>
          </View>
          <Text style={styles.transactionAmountRed}>-Rs.20.00</Text>
        </View>
      </View>
      
    </ScrollView>
  );
};

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

    width: 165, 
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

