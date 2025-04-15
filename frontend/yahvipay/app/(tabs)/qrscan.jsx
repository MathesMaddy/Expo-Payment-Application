import { View, Text, StyleSheet, Linking, Button, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

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
    if (data.startsWith("upi://pay?")) {
      router.push({ pathname : '/screens/payqrscan', params : { data : data }})
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
      </CameraView>
      <View style={styles.overlay}>
        <View style={[styles.overlayRow, { height: (height - width * 0.7) / 2 }]} />
          <View style={styles.overlayCenter}>
            <View style={styles.overlaySide} />
              <View style={styles.scanArea}>
                {/* Optional animated border or corner markers here */}
              </View>
            <View style={styles.overlaySide} />
          </View>
      
          <View style={[styles.overlayRow]} />
          <TouchableOpacity 
            style={[styles.flashButton, flash ? { backgroundColor : 'white' } : '']}
            onPress={toggleFlash}
          >
            <MaterialCommunityIcons
              name={flash ? 'flashlight-off' : 'flashlight'}
              size={30}
              color={flash ? 'black' : 'white'}
            />
          </TouchableOpacity>
          <TouchableOpacity 

            style={styles.closeButton}
            onPress={() => {
              setFlash(false);
              router.replace('/');
            }}
          >
            <MaterialCommunityIcons name="close" size={30} color="white" />
          </TouchableOpacity>
      </View>
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
  flashButton: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    
    padding: 15,
    borderRadius: 50,
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    
    padding: 15,
    borderRadius: 50,
  },

  overlay: {
    height : height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlayRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height : height
  },
  overlayCenter: {
    flexDirection: 'row',
  },
  overlaySide: {
    width: (width - width * 0.7) / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanArea: {
    width: width * 0.7,
    height: width * 0.7,

    borderColor : '#fff',
    borderWidth: 2,
    borderRadius: 16,
  },
});