import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import MapScreen from "./screens/MapScreen";
import SurveyListScreen from "./screens/SurveyListScreen";
import EditSurveyScreen from "./screens/EditSurveyScreen";

import { AuthProvider } from "@/services/authContext";
import { navigationRef } from "@/navigationRef";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Map: undefined;
  SurveyList: undefined;
  EditSurvey: {
    survey: any;
    type: "point" | "polygon" | "center";
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="SurveyList" component={SurveyListScreen} />
          <Stack.Screen name="EditSurvey" component={EditSurveyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}