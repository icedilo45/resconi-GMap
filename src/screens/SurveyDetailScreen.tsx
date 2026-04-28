import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert, TextInput } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { useSurveys } from "@/services/surveyContext";
import api from "@/services/api";

type SurveyDetailScreenRouteProp = RouteProp<RootStackParamList, "SurveyDetail">;

export default function SurveyDetailScreen({ route }: { route: SurveyDetailScreenRouteProp }) {
  const { survey } = route.params;
  const { loadSurveys } = useSurveys();
  const navigation = useNavigation<any>();

  const [notes, setNotes] = useState(survey.notes || "");

  // ✏️ Edit survey
  const handleEdit = async () => {
    try {
      await api.put(`/surveys/${survey.id}/`, { ...survey, notes });
      Alert.alert("Survey Updated", "Your changes have been saved.");
      await loadSurveys(); // refresh context
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to update survey.");
    }
  };

  // 🗑️ Delete survey
  const handleDelete = async () => {
    try {
      await api.delete(`/surveys/${survey.id}/`);
      Alert.alert("Survey Deleted", "This survey has been removed.");
      await loadSurveys(); // refresh context
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to delete survey.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Survey #{survey.id}</Text>

      {survey.photo_uri && (
        <Image source={{ uri: survey.photo_uri }} style={styles.photo} />
      )}

      {survey.latitude && survey.longitude && (
        <Text style={styles.text}>{`Location: (${survey.latitude}, ${survey.longitude})`}</Text>
      )}

      {survey.coords && (
        <Text style={styles.text}>{`Polygon vertices: ${survey.coords.length}`}</Text>
      )}

      {survey.num_trees && (
        <Text style={styles.text}>{`Trees: ${survey.num_trees}`}</Text>
      )}

      {survey.spacing && (
        <Text style={styles.text}>{`Spacing: ${survey.spacing} m`}</Text>
      )}

      {survey.estimated_area && (
        <Text style={styles.text}>{`Estimated Area: ${survey.estimated_area} m²`}</Text>
      )}

      <Text style={styles.text}>Notes:</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        placeholder="Edit notes"
      />

      <View style={styles.buttonRow}>
        <Button title="Save Changes" onPress={handleEdit} color="#007AFF" />
        <Button title="Delete Survey" onPress={handleDelete} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  text: { fontSize: 16, marginVertical: 4 },
  photo: { width: "100%", height: 250, borderRadius: 8, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
