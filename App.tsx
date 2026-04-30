import React from "react";
import { AuthProvider } from "@/services/authContext";
import AppNavigator from "././src/AppNavigator";
import { SurveyProvider } from "@/services/surveyContext";

export default function App() {
  return (
    <AuthProvider>
      <SurveyProvider>
        <AppNavigator />
      </SurveyProvider>
    </AuthProvider>
  );
}
