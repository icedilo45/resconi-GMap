import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import {
  savePointSurvey,
  savePolygonSurvey,
  saveCenterPointSurvey,
} from "../services/surveyService";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";

type EditSurveyRouteParams = {
  EditSurvey: {
    survey: SurveyPoint | SurveyPolygon | CenterPointSurvey;
    type: "point" | "polygon" | "center";
  };
};

export default function EditSurveyScreen() {
  const route = useRoute<RouteProp<EditSurveyRouteParams, "EditSurvey">>();
  const navigation = useNavigation<any>();
  const { survey, type } = route.params;

  // Local state for editing notes
  const [notes, setNotes] = useState(survey.notes || "");

  const handleSave = async () => {
    try {
      if (type === "point") {
        const updated: SurveyPoint = { ...(survey as SurveyPoint), notes };
        await savePointSurvey(updated);
      } else if (type === "polygon") {
        const updated: SurveyPolygon = { ...(survey as SurveyPolygon), notes };
        await savePolygonSurvey(updated);
      } else if (type === "center") {
        const updated: CenterPointSurvey = { ...(survey as CenterPointSurvey), notes };
        await saveCenterPointSurvey(updated);
      }

      Alert.alert("Success", "Survey updated successfully.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to update survey.");
      console.error("Save failed:", err);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Edit Survey</Text>

      {/* Show survey details */}
      {type === "point" && (
        <Text>
          Point at Lat: {(survey as SurveyPoint).coords.latitude}, Lng: {(survey as SurveyPoint).coords.longitude}
        </Text>
      )}

      {type === "polygon" && (
        <Text>Polygon with {(survey as SurveyPolygon).coords.length} vertices</Text>
      )}

      {type === "center" && (
        <Text>
          Center at Lat: {(survey as CenterPointSurvey).center.latitude}, Lng: {(survey as CenterPointSurvey).center.longitude}
        </Text>
      )}

      {/* Notes input */}
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Enter notes"
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />

      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}