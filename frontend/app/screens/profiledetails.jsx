// import { View, Text, Button, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import * as ImagePicker from "expo-image-picker";

// import * as SecureStore from 'expo-secure-store';
// import { useRouter } from 'expo-router';

// import QRCode from "react-native-qrcode-svg";

// export default function Profiledetails() {

//   const [ userUpiId, setUserId ] = useState('something');
//   const [image, setImage] = useState(null);

//   const [ loading, setLoading ] = useState(true)

//   const router = useRouter();

//   const pickImage = async () => {
//     // Request permission
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       alert("Permission denied! Please enable access to gallery.");
//       return;
//     }

//     // Open image picker
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['images'],
//       allowsEditing: true,
//       aspect: [1, 1], // Square crop
//       quality: 1,
//     });
//     console.log(result)

//     if (!result.canceled) {
//       setImage(result.assets[0].uri); // Save selected image URI
//     }
  
//   };

//   const Logout = async() => {

//     let result = await SecureStore.setItemAsync('token', '');

//     router.replace('/')
//   }


//   useEffect( () => {
//     const GetUPIID = async() => {

//       const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_GET_UPI_ID || '';

//       let result = await SecureStore.getItemAsync('token');

//       console.log(result)

//       if(result) {
//         console.log('qqq')
//         try {
//           const res = await fetch(apiUrl, {
//             method : 'POST',
  
//             headers : {
//               'Content-Type' : 'application/json'
//             },
//             body : JSON.stringify({ token : result })
//           })
//           if(res.ok) {

//             const data = await res.json()
//             console.log(data)
  
//             setUserId(`upi://pay?pa=${data.upiId}&pn=${data.fullName}`)
  
//           }
//           else {
//             router.replace('/')
//           }
//         }
//         catch(e) {
  
//           console.log(e);
//         }
//         finally {
//           setLoading(false)
//         }
//       }
//       else {

//         router.replace('/')
//       }
//     }

//     GetUPIID();

//   }, []);
//   console.log(userUpiId)
//   return (
//     <View>

//       <Text>profiledetails</Text>
//       <View style={{ alignItems: "center", marginTop: 50 }}>

//         <Button title="Pick an Image" onPress={pickImage} />
//         {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 100, marginTop: 20 }} />}
//       </View>
//       <View>

//       {loading ? (
//               <ActivityIndicator size="large" color="#0E7C7B" />
//       ) : (
//         <QRCode 
//           value={userUpiId} // Data to encode in QR Code
//           size={200} // QR Code size
//           backgroundColor="white"
//           color="black"
//         />
//       )}
//       </View>
//       <View>
//         <TouchableOpacity onPress={() => Logout()} style={{ width : 100, borderWidth : 1 }}>

//           <Text>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )
// }

import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, Clipboard, Alert, Button, ActivityIndicator, Dimensions } from "react-native";
import { Ionicons, RiIcon } from "@expo/vector-icons";

import * as SecureStore from 'expo-secure-store';

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";

const { width, height } = Dimensions.get('window');

const userData = {
  avatar: "https://i.pravatar.cc/150?img=3",
  name: "John Doe",
  phone: "+1 234 567 890",
  upiId: "john@upi",
  qrCode: "https://via.placeholder.com/150",
};

export default function ProfileScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  const copyToClipboard = (upiId) => {
    Clipboard.setString(upiId);
    
  };

  const handleLogout = () => {
    setModalVisible(false);
    Alert.alert("Logged out successfully");
  };

  const [ qrUpiId, setQrUpiId ] = useState('something');
  const [ upiId, setUpiId ] = useState({
    fullName : '',
    phoneNo : '',
    upiId : ''
  })
  const [image, setImage] = useState(null);

  const [ loading, setLoading ] = useState(true)

  const router = useRouter();

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied! Please enable access to gallery.");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // Square crop
      quality: 1,
    });
    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Save selected image URI
    }
  
  };

  const Logout = async() => {

    let result = await SecureStore.setItemAsync('token', '');

    router.replace('/')
  }


  useEffect( () => {
    const GetUPIID = async() => {

      const apiUrl = process.env.EXPO_PUBLIC_API_PROCESS_GET_UPI_ID || '';

      let result = await SecureStore.getItemAsync('token');

      console.log(result)

      if(result) {
        console.log('qqq')
        try {
          const res = await fetch(apiUrl, {
            method : 'POST',
  
            headers : {
              'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ token : result })
          })
          if(res.ok) {

            const data = await res.json()
            console.log(data)
            setUpiId({
              fullName : data.fullName,
              phoneNo : data.phoneNo,
              upiId : data.upiId
            })
            setQrUpiId(`upi://pay?pa=${data.upiId}&pn=${data.fullName}`)
  
          }
          else {
            router.replace('/')
          }
        }
        catch(e) {
  
          console.log(e);
        }
        finally {
          setLoading(false)
        }
      }
      else {

        router.replace('/')
      }
    }

    GetUPIID();

  }, []);
  console.log(qrUpiId)
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={{ 
          
          uri: 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=' }} 
          style={styles.avatar} />
        <Text style={styles.name}>{upiId.fullName}</Text>
        <Text style={styles.phone}>+91 {upiId.phoneNo}</Text>
      </View>
      <View style={styles.qrContainer}>
        <Text style={styles.label}>Scan to pay me</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0E7C7B" />
          ) : (
          <QRCode
            value={qrUpiId} // Data to encode in QR Code
            size={200} // QR Code size
            backgroundColor="white"
            color="black"
          />
        )}
      </View>
      <View style={styles.upiContainer}>
        <Text style={styles.label}>My UPI ID</Text>
        <View style={styles.upiRow}>
          <Text style={styles.upiId}>{upiId.upiId}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(upiId.upiId)} style={styles.copyButton}>
            <Ionicons name="copy-outline" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="lock-closed-outline" size={20} color="#EF4444" />
          <Text style={styles.actionText}>Forgot PIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.actionButton}>
          <Ionicons name="log-out-outline" size={20} color="#6B7280" />
          <Text style={styles.actionText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout Confirmation</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={Logout} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#5B21B6",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  phone: {
    fontSize: 14,
    color: "#6B7280",
  },
  qrContainer: {
    width : width - 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  qrCode: {
    width: 350,
    height: 250,
    borderRadius: 8,
  },
  upiContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
  },
  upiRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  upiId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  copyButton: {
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 8,
  },
  actionContainer: {
    width: "100%",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#5B21B6",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
