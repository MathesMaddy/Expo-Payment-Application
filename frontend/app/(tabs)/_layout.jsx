import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{

      tabBarActiveTintColor : '#615fff',
      headerShown : false,
      tabBarStyle : { height : 60, paddingTop : 5

      }
    }}>
      <Tabs.Screen 
          name="index" 
          options={{ 
              title: 'Home', 
              tabBarIcon : ({size}) => <MaterialCommunityIcons name="home" size={24} />
      }}/>

      <Tabs.Screen 
          name="qrscan" 
          options={{ 
              title : 'QR Scan', 
              tabBarIcon : ({size}) => <MaterialCommunityIcons name="qrcode-scan" size={24} />,
              tabBarStyle : { display : 'none' }
          }}
      />
      
      <Tabs.Screen 
          name="history" 
          options={{ 
              title : 'History', 
              tabBarIcon : () => <MaterialCommunityIcons name="history" size={24} />}}
      />
      
    </Tabs>
  )
}
