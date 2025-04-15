import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
export default function RootLayout() {
  return (
    <Tabs screenOptions={{

      tabBarActiveTintColor : '#7E22CE',
      headerShown : false,
      tabBarStyle : { height : 60, paddingTop : 5 }
    }}>
      <Tabs.Screen 
          name="index" 
          options={{ 
              title: 'Home', 

              tabBarIcon : ({color, focused}) => <AntDesign name="home" size={24} color={focused ? '#7E22CE' : '#888'} />
              
      }}/>
      <Tabs.Screen 
          name="qrscan" 
          options={{ 
              title : 'QR Scan', 
              tabBarIcon : ({color, focused}) => <MaterialCommunityIcons name="qrcode-scan" size={24} color={focused ? '#7E22CE' : '#888'} />,
              tabBarStyle : { display : 'none' }
          }}
      />
      
      <Tabs.Screen 
          name="history" 
          options={{ 
              title : 'History', 
              tabBarIcon : ({color, focused}) => <MaterialCommunityIcons name="history" size={24} color={focused ? '#7E22CE' : '#888'} />}}
      />
      
    </Tabs>
  )
}
