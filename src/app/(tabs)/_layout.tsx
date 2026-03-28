import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function TabsLayout() {
  return (
    <Tabs
        screenOptions={{ 
            tabBarActiveTintColor: "#0d6eff", 
            headerStyle: {
                backgroundColor: "#25292e",
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            tabBarStyle: {
                backgroundColor: "#25292e",
            }
        }}
    >
      <Tabs.Screen 
        name="index"
        options={{
            headerTitle: "RESCONI Geo App",
            tabBarIcon: ({ focused, color}) => (
                <Ionicons 
                    name={focused ? "home-sharp" : "home-outline"} 
                    size={24} 
                    color={color}
                />
            ),
        }}
    />

    <Tabs.Screen
        name="about"
        options={{
            headerTitle: "About",
            tabBarIcon: ({ focused, color }) => (
                <Ionicons 
                    name={
                        focused ? "information-circle-sharp" : "information-circle-outline"} 
                        size={24} 
                        color={color} 
                />
            )
        }}
    />

    <Tabs.Screen
        name="not-found"
        options={{
            headerShown: false
          }}
        />
    </Tabs>
  );
}