import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons,Entypo } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';


export default function success() {

  const { amount, status, name, transactionId } = useLocalSearchParams();
  console.log(transactionId.replace('transactionId', ''), name)
  const router = useRouter()
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <View style={[styles.successIconInner, status === 'paid' ? '' : { backgroundColor : '#f14f34' }]}>
          
          { status === 'paid' ? ( <Ionicons name="checkmark" size={36} color="white" /> ) : ( <Entypo name="cross" size={36} color="white" /> )}
            
          </View>
        </View>
    

        <Text style={styles.title}> { status === 'paid' ? 'Payment Successful!' : 'Payment Failed!' }</Text>
        <Text style={styles.subtitle}> { status === 'paid' ? 'Your payment was processed successfully!' : 'Oops! Your payment could not go through' } </Text>

        <View style={[styles.transactionCard, status === 'paid' ? '' : { backgroundColor : '#f1d8d7' }]}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionHeaderText}>Transaction Details</Text>
          </View>

          <View style={styles.transactionDetail}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>{transactionId.replace('transactionId', '')}</Text>
          </View>
          <View style={styles.transactionDetail}>
            <Text style={styles.detailLabel}>Receiver Name</Text>
            <Text style={styles.detailValue}>{name}</Text>
          </View>

          <View style={styles.transactionDetail}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>Rs. {amount}</Text>
          </View>

          <View style={styles.transactionDetail}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>09 April 2025</Text>
          </View>

          <View style={styles.transactionDetail}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>Debit Card</Text>
          </View>

          <View style={styles.transactionDetail}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={[styles.statusContainer, status === 'paid' ? '' : { backgroundColor : '#f14f34' }]}>
              { status === 'paid' ? ( <Ionicons name="checkmark-circle" size={16} color="white" style={styles.statusIcon} /> ) : ( <Entypo name="cross" size={16} color="white" /> )}
              <Text style={styles.statusText}>{status === 'paid' ? "Success" : "Failed"}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.continueButton, status === 'paid' ? '' : { backgroundColor : '#f14f34' }] } onPress={() => router.replace('/(tabs)')}>  
          <Text style={styles.continueButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  successIconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  transactionCard: {
    width: '100%',
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
  },
  transactionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CD964',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: 'white',
    fontWeight: '500',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#4CD964',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});