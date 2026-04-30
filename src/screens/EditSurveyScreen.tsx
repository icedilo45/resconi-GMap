import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import {
  updatePointSurvey,
  updatePolygonSurvey,
  updateCenterPointSurvey,
} from "@/services/surveyService";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

type EditSurveyScreenProps = {
  route: {
    params: {
      survey: SurveyPoint | SurveyPolygon | CenterPointSurvey;
      type: "point" | "polygon" | "center";
      onUpdate?: (updatedSurvey: SurveyPoint | SurveyPolygon | CenterPointSurvey) => void;
    };
  };
  navigation: any;
};

export default function EditSurveyScreen({ route, navigation }: EditSurveyScreenProps) {
  const { survey, type, onUpdate } = route.params;
  const [notes, setNotes] = useState(survey.notes || "");

  const savePreference = async (key: string, value: boolean) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  };

  const getPreference = async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : true; // default to true if not set
  };

  const handleUpdate = async () => { 
    try {
      let updated;
      if (type === "point") {
        await updatePointSurvey(survey.id, { ...survey, notes })
        updated = { ...survey, notes } as SurveyPoint;
      } else if (type === "polygon") {
        await updatePolygonSurvey(survey.id, { ...survey, notes });
        updated = { ...survey, notes } as SurveyPolygon;
      } else if (type === "center") {
        await updateCenterPointSurvey(survey.id, { ...survey, notes });
        updated = { ...survey, notes } as CenterPointSurvey;
      }

       // Optimistically update list
    if (updated && onUpdate) onUpdate(updated);

    // Silent background refresh to ensure sync with backend
    setTimeout(() => {
      navigation.navigate("SurveyList", { refresh: true });
    }, 500);

    Alert.alert("Success", "Survey updated successfully");
    navigation.goBack();
  } catch (err) {
    console.error("Update failed:", err);
    Alert.alert("Error", "Failed to update survey");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        placeholder="Edit notes"
      />
      <Button title="Save Changes" onPress={handleUpdate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});
