import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "@/services/authContext";
import SplashScreen from "@/screens/SplashScreen";
import LoginScreen from "@/screens/LoginScreen";
import MapScreen from "@/screens/MapScreen";
import React from "react";
import SurveyCreateScreen from "./screens/SurveyCreateScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { center } from "@turf/turf";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  return (
    <SafeAreaView style={styles.area}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {loading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : user ? (
            <Stack.Screen name="Map" component={MapScreen} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
          <Stack.Screen name="CreateSurvey" component={SurveyCreateScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = {
  area: {
    flex: 1,
    alignItem: center,
  },
};