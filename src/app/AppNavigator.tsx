// src/app/AppNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "../screens/MapScreen";
import SurveyListScreen from "@/screens/SurveyListScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="SurveyList" component={SurveyListScreen} />
    </Stack.Navigator>
  );
}