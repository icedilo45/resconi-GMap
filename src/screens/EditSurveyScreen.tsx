import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { updateLocalPoint, updateLocalPolygon, updateLocalCenterPoint } from "../storage/localStorage";

export default function EditSurveyScreen({ route, navigation }: any) {
  const { survey, type } = route.params;
  const [notes, setNotes] = useState(survey.notes || "");
  const [spacing, setSpacing] = useState(survey.spacing?.toString() || "");
  const [numTrees, setNumTrees] = useState(survey.numTrees?.toString() || "");

  const handleSave = async () => {
    if (type === "point") {
      await updateLocalPoint({ ...survey, notes });
    }
    if (type === "polygon") {
      await updateLocalPolygon({ ...survey, notes });
    }
    if (type === "center") {
      await updateLocalCenterPoint({
        ...survey,
        spacing: parseFloat(spacing),
        numTrees: parseInt(numTrees),
        notes,
      });
    }
    Alert.alert("Updated", "Survey updated successfully");
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Edit Survey</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes"
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      {type === "center" && (
        <>
          <TextInput
            value={spacing}
            onChangeText={setSpacing}
            placeholder="Tree Spacing (m)"
            keyboardType="numeric"
            style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
          />
          <TextInput
            value={numTrees}
            onChangeText={setNumTrees}
            placeholder="Number of Trees"
            keyboardType="numeric"
            style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
          />
        </>
      )}
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}