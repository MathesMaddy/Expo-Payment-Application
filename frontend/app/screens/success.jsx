import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
const { width, height } = Dimensions.get('window');

const SuccessScreen = () => {

    const { amount, status, name } = useLocalSearchParams();
    const router = useRouter();
  return (
    <View style={styles.homeContainer}>
      {/* Header */}
      

      {/* Success Content */}
      <View style={[styles.successContent, status === 'paid' ? '' : { backgroundColor : '#da0002' }]}>
        <View style={styles.checkCircle}>

            { status === 'paid' ? ( <Feather name="check" size={48} color="#16A34A" /> ) : ( <Entypo name="cross" size={48} color="#da0002" /> )}
          
        </View>
        <Text style={styles.successTitle}>send ₹{amount} to {name}</Text>
        <Text style={styles.successSubtitle}>{ status === 'paid' ? 'Successfully Transfer' : 'Transaction Failed' }</Text>
        <TouchableOpacity style={[styles.viewDetailsButton, status === 'paid' ? '' : { color : '#da0002' }]} >
          <Text style={[styles.viewDetailsText, status === 'paid' ? '#16A34A' : { color : '#da0002', }]}>VIEW DETAILS</Text>
        </TouchableOpacity>
        <View style={[styles.doneContainer, ]}>
          <TouchableOpacity style={styles.doneButton} onPress={() => router.replace('(tabs)')}>
            <Text style={[styles.doneText, status === 'paid' ? '#16A34A' : { color : '#da0002', } ]}>DONE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: width * 0.12,
    height: width * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: width * 0.045,
    fontWeight: '500',
    marginLeft: width * 0.03,
  },
  successContent: {
    flex: 1,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.1,
    paddingBottom: height * 0.1,
  },
  checkCircle: {
    width: width * 0.24,
    height: width * 0.24,
    backgroundColor: '#ffffff',
    borderRadius: width * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.03,
    marginTop: height * 0.1,
  },
  successTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: height * 0.01,
  },
  successSubtitle: {
    fontSize: width * 0.045,
    color: '#ffffff',
    marginBottom: height * 0.04,
  },
  viewDetailsButton: {
    backgroundColor: '#ffffff',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: width * 0.5,
    marginBottom: height * 0.04,
  },
  viewDetailsText: {
    color: '#16A34A',
    fontWeight: '500',
  },
  doneContainer: {
    marginTop: 'auto',
    width : width - 50,
    backgroundColor : '#fff',
},
doneButton: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
},
doneText: {
    textAlign : 'center',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default SuccessScreen;