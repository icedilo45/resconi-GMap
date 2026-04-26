import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "@/navigation/screens/LoginScreen";
import SurveyListScreen from "@/navigation/screens/SurveyListScreen";
import { navigationRef } from "@/navigationRef";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Surveys" component={SurveyListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
