import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  savePointSurvey,
  savePolygonSurvey,
  saveCenterPointSurvey,
  uploadPhoto,
} from "@/services/surveyService";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";

export default function SurveyCreateScreen() {
  const [type, setType] = useState<"point" | "polygon" | "center">("point");

  // Common fields
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [notes, setNotes] = useState("");

  // Polygon-specific
  const [coords, setCoords] = useState(""); // JSON string of [{latitude, longitude}, ...]

  // CenterPoint-specific
  const [spacing, setSpacing] = useState("");
  const [numTrees, setNumTrees] = useState("");
  const [estimatedArea, setEstimatedArea] = useState("");

  // Photo upload
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      let photoPath: string | undefined = undefined;

      if (photoUri) {
        const formData = new FormData();
        formData.append("file", {
          uri: photoUri,
          name: "survey_photo.jpg",
          type: "image/jpeg",
        } as any);
        const uploadRes = await uploadPhoto(formData);
        photoPath = uploadRes.path; // ✅ backend returns a string URL
      }

      if (type === "point") {
        await savePointSurvey({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          notes,
          photo_uri: photoPath,
        } as SurveyPoint);
      } else if (type === "polygon") {
        await savePolygonSurvey({
          coords: JSON.parse(coords),
          notes,
          photo_uri: photoPath,
        } as SurveyPolygon);
      } else if (type === "center") {
        await saveCenterPointSurvey({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          spacing: parseFloat(spacing),
          num_trees: parseInt(numTrees),
          estimated_area: parseFloat(estimatedArea),
          notes,
          photo_uri: photoPath,
        } as CenterPointSurvey);
      }

      Alert.alert("Success", "Survey created successfully!");
      setLatitude(""); setLongitude(""); setNotes(""); setCoords("");
      setSpacing(""); setNumTrees(""); setEstimatedArea(""); setPhotoUri(null);
    } catch (err: any) {
      console.error("Error creating survey:", err);
      Alert.alert("Error", "Failed to create survey");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create {type} Survey</Text>

      {/* Survey Type Toggle */}
      <View style={styles.toggleRow}>
        <Button title="Point" onPress={() => setType("point")} />
        <Button title="Polygon" onPress={() => setType("polygon")} />
        <Button title="Center" onPress={() => setType("center")} />
      </View>

      {/* Common Fields */}
      {(type === "point" || type === "center") && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
          />
        </>
      )}

      {type === "polygon" && (
        <TextInput
          style={styles.input}
          placeholder='Coords JSON (e.g. [{"latitude":6.7,"longitude":-1.6}])'
          value={coords}
          onChangeText={setCoords}
        />
      )}

      {type === "center" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Spacing (m)"
            value={spacing}
            onChangeText={setSpacing}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Trees"
            value={numTrees}
            onChangeText={setNumTrees}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Estimated Area (m²)"
            value={estimatedArea}
            onChangeText={setEstimatedArea}
            keyboardType="numeric"
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
      />

      {/* Photo Upload */}
      <View style={styles.toggleRow}>
        <Button title="Pick Photo" onPress={pickImage} />
        <Button title="Take Photo" onPress={takePhoto} />
      </View>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}

      <Button title="Save Survey" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  toggleRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 6,
    borderRadius: 4,
  },
  preview: { width: 200, height: 200, marginVertical: 10 },
});
