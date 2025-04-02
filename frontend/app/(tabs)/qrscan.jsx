import { View, Text, StyleSheet, Linking, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Qrscan() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const [flash, setFlash] = useState(false);
  
  console.log(hasPermission, scanned)
  useEffect(() => {

    const CameraStatus = async() => {
      
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      setHasPermission(status === "granted");
    }

    CameraStatus();
  }, []);
  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  
  const HandleQrCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log('zzz ' + type, data)
    console.log("Scanned QR Code:", data);

    if (data.startsWith("upi://pay?")) {

      router.push({ pathname : '/screens/payqrscan', params : { data : data }})
    } else {
      
    }
  };
  const toggleFlash = async () => {
    const newValue = !flash;
    
    console.log('zz ',newValue)
    setFlash(newValue);
  };
  const handleCameraReady = async () => {
    try {
      if (flash === true) {
        setTimeout(() => {
          setFlash(true);
          // setIsCameraReady(true);
        }, 1000);
      }
      // else {
      //   setIsCameraReady(true);
      // }
      
    } catch (error) {
      console.error('Failed to load flash preference:', error);
    }
  };
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onCameraReady={handleCameraReady}

        enableTorch={flash}

        onBarcodeScanned={HandleQrCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ["qr"],
        }}
      >
        {/* <View style={{ flex : 1, justifyContent : 'center', alignItems : 'center' }}>

          <View style={{ height : 250, width : 280, borderWidth : 1 }}></View>
        </View> */}
        <View style={styles.qrFrame} />
        <TouchableOpacity
          style={styles.flashButton}
          onPress={toggleFlash}
        >
          <MaterialCommunityIcons
            name={flash === 'off' ? 'flashlight' : 'flashlight-off'}
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </CameraView>
      {/* {scanned && (
        
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )} */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  qrFrame: {
    height: 250,
    width: 280,
    borderWidth: 2,
    borderColor: 'white',
    alignSelf: 'center',
    marginTop: '50%',
  },
  flashButton: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
  },
});