import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import MapScreen from "../screens/map";
import SurveyListScreen from "../screens/SurveyListScreen";
import EditSurveyScreen from "../screens/EditSurveyScreen";

export type RootStackParamList = {
  Login: undefined;
  Map: undefined;
  SurveyList: undefined;
  EditSurvey: {
    survey: any; // could be SurveyPoint | SurveyPolygon | CenterPointSurvey
    type: "point" | "polygon" | "center";
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: "Survey Map" }}
        />
        <Stack.Screen
          name="SurveyList"
          component={SurveyListScreen}
          options={{ title: "Survey List" }}
        />
        <Stack.Screen
          name="EditSurvey"
          component={EditSurveyScreen}
          options={{ title: "Edit Survey" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}