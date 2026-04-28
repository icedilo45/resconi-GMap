import React, { useState } from "react";
import { View, Text, Button, TextInput, Alert, StyleSheet, Image } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import * as Location from "expo-location";
import MapView, { Marker, Polygon } from "react-native-maps";
import api from "@/services/api";
import { useSurveys } from "@/services/surveyContext";

export default function SurveyCreateScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [spacing, setSpacing] = useState("");
  const [numTrees, setNumTrees] = useState("");
  const [estimatedArea, setEstimatedArea] = useState("");
  const { addSurvey } = useSurveys();

  // Capture photo + GPS
  const takePhotoWithLocation = async () => {
    const photo = await ImagePicker.launchCamera({ mediaType: "photo" });
    if (!photo.assets) return;

    const loc = await Location.getCurrentPositionAsync({});
    setPhotoUri(photo.assets[0].uri ?? null);
    setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
  };

  // Add polygon vertex
  const addPolygonPoint = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    setCoords([...coords, { latitude: loc.coords.latitude, longitude: loc.coords.longitude }]);
  };

  // Calculate trees + area
  const calculateTrees = () => {
    const s = parseFloat(spacing);
    const n = parseInt(numTrees);
    if (!isNaN(s) && !isNaN(n)) {
      const area = n * (s * s);
      setEstimatedArea(area.toFixed(2));
    }
  };

  // Save survey to backend
  const saveSurvey = async () => {
    try {
      const payload = {
        photo_uri: photoUri,
        center: location,
        coords,
        spacing: parseFloat(spacing),
        num_trees: parseInt(numTrees),
        estimated_area: parseFloat(estimatedArea),
      };
      await addSurvey(payload); // ✅ updates context immediately
      Alert.alert("Survey Saved", "Your survey has been uploaded successfully.");
    } catch (err) {
      Alert.alert("Error", "Failed to save survey.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take Photo + GPS" onPress={takePhotoWithLocation} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}

      <TextInput
        placeholder="Spacing (m)"
        value={spacing}
        onChangeText={setSpacing}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Number of Trees"
        value={numTrees}
        onChangeText={setNumTrees}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Calculate Area" onPress={calculateTrees} />
      {estimatedArea && <Text>Estimated Area: {estimatedArea} m²</Text>}

      <Button title="Add Polygon Point" onPress={addPolygonPoint} />

      <MapView style={styles.map}>
        {location && <Marker coordinate={location} title="Center Point" />}
        {coords.length > 0 && <Polygon coordinates={coords} strokeColor="blue" fillColor="rgba(0,0,255,0.2)" />}
      </MapView>

      <Button title="Save Survey" onPress={saveSurvey} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", marginVertical: 5, padding: 8, borderRadius: 5 },
  image: { width: "100%", height: 200, marginVertical: 10 },
  map: { flex: 1, marginVertical: 10 },
});
