import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert, TextInput } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { useSurveys } from "@/services/surveyContext";
import api from "@/services/api";
import * as ImagePicker from "react-native-image-picker";
import * as Location from "expo-location";
import MapView, { Polygon, Marker, LatLng } from "react-native-maps";
import * as turf from "@turf/turf";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { exportCSV, exportPDF } from "@/services/exportService";

type SurveyDetailScreenRouteProp = RouteProp<RootStackParamList, "SurveyDetail">;

export default function SurveyDetailScreen({ route }: { route: SurveyDetailScreenRouteProp }) {
  const { survey } = route.params;
  const { loadSurveys } = useSurveys();
  const navigation = useNavigation<any>();

  const [notes, setNotes] = useState(survey.notes || "");
  const [spacing, setSpacing] = useState(survey.spacing?.toString() || "");
  const [numTrees, setNumTrees] = useState(survey.num_trees?.toString() || "");
  const [estimatedArea, setEstimatedArea] = useState(survey.estimated_area?.toString() || "");
  const [photoUri, setPhotoUri] = useState(survey.photo_uri || "");
  const [coords, setCoords] = useState(survey.coords || []);
  const [centroid, setCentroid] = useState<{ latitude: number; longitude: number } | null>(null);
  const [treeDensity, setTreeDensity] = useState<string>("");
  const [densityLevel, setDensityLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [recommendation, setRecommendation] = useState<string>("");
  const [densityHistory, setDensityHistory] = useState<{ timestamp: string; value: number }[]>(survey.density_history || []);

  // 📸 Re-capture photo
  const recapturePhoto = async () => {
    const photo = await ImagePicker.launchCamera({ mediaType: "photo" });
    if (photo.assets && photo.assets[0].uri) {
      setPhotoUri(photo.assets[0].uri);
    }
  };

  // ➕ Add polygon vertex (current GPS)
  const addPolygonPoint = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    setCoords([...coords, { latitude: loc.coords.latitude, longitude: loc.coords.longitude }]);
  };

  // ➖ Remove last polygon vertex
  const removeLastPoint = () => {
    setCoords(coords.slice(0, -1));
  };

  // 🖱️ Handle dragging vertices
  const handleDragEnd = (index: number, e: any) => {
    const newCoords = [...coords];
    newCoords[index] = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    };
    setCoords(newCoords);
  };

  // 🧮 Live polygon area + centroid + tree density
  useEffect(() => {
    if (coords.length >= 3) {
      const polygon = turf.polygon([coords.map((c: LatLng) => [c.longitude, c.latitude])]);
      const area = turf.area(polygon); // m²
      setEstimatedArea(area.toFixed(2));

      const center = turf.centroid(polygon);
      const [lng, lat] = center.geometry.coordinates;
      setCentroid({ latitude: lat, longitude: lng });

      const n = parseInt(numTrees);
      if (!isNaN(n) && area > 0) {
        const density = n / area; // trees per m²
        setTreeDensity(density.toFixed(4)); // keep 4 decimals for precision
        
        // Determine density level
        if (density < 0.005) {
          setDensityLevel('low');
          setRecommendation("Density is low. Consider planting more trees to increase density.");
        } else if (density < 0.02) {
          setDensityLevel('medium');
          setRecommendation('Density is moderate. Acceptable level but monitor growth. ')
        } else {
          setDensityLevel('high');
          setRecommendation("Density is high. Consider thinning to reduce competition among trees.");
        }
      }
    }
  }, [coords, numTrees]);

  // ✏️ Save edits
  const handleEdit = async () => {
     try {
      const densityValue = parseFloat(treeDensity);
      const newHistory = [
        ...densityHistory,
        { timestamp: new Date().toISOString(), value: densityValue },
      ];

      await api.put(`/surveys/${survey.id}/`, {
        ...survey,
        notes,
        spacing: parseFloat(spacing),
        num_trees: parseInt(numTrees),
        estimated_area: parseFloat(estimatedArea),
        photo_uri: photoUri,
        coords,
        density_history: newHistory,
      });
      setDensityHistory(newHistory);
      Alert.alert("Survey Updated", "Your changes have been saved.");
      await loadSurveys();
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to update survey.");
    }
  };

  // chart rendering
  {densityHistory.length > 0 && (
    <LineChart
      data={{
        labels: densityHistory.map(h => new Date(h.timestamp).toLocaleDateString()),
        datasets: [{ data: densityHistory.map(h => h.value) }],
      }}
      width={Dimensions.get("window").width - 32}
      height={220}
      yAxisSuffix=" trees/m²"
      chartConfig={{
        backgroundColor: "#fff",
        backgroundGradientFrom: "#f5f5f5",
        backgroundGradientTo: "#eaeaea",
        decimalPlaces: 4,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      style={{ marginVertical: 12, borderRadius: 8 }}
    />
  )}

  // Delete survey
  const handleDelete = async () => {
    try {
      await api.delete(`/surveys/${survey.id}/`);
      Alert.alert("Survey Deleted", "This survey has been removed.");
      await loadSurveys();
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to delete survey.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Survey #{survey.id}</Text>

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      ) : (
        <Text style={styles.text}>No photo available</Text>
      )}
      <Button title="Re-capture Photo" onPress={recapturePhoto} />

      <Text style={styles.label}>Number of Trees</Text>
      <TextInput style={styles.input} value={numTrees} onChangeText={setNumTrees} keyboardType="numeric" />

      <Text style={styles.label}>Spacing (m)</Text>
      <TextInput style={styles.input} value={spacing} onChangeText={setSpacing} keyboardType="numeric" />

      <Text style={styles.text}>{`Estimated Area: ${estimatedArea} m²`}</Text>
      {treeDensity && 
        <Text 
          style={[
            styles.text,
            densityLevel === 'low' ? { color: 'green' } : densityLevel === 'medium' ? { color: 'orange' } : { color: 'red' }
          ]}>
            {`Tree Density: ${treeDensity} trees/m² (${densityLevel ? densityLevel.toUpperCase() : 'N/A'})`}
        </Text>}
      {densityLevel && (
        <Text style={styles.text}>{`Density Level: ${densityLevel}`}</Text>
      )}
      {recommendation && (
        <Text style={styles.recommend}>{`Recommendation: ${recommendation}`}</Text>
      )}
      <Text style={styles.label}>Notes</Text>
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Edit notes" />

      {/* Polygon Editing Map */}
      {coords.length > 0 && (
        <MapView style={styles.map}>
          <Polygon coordinates={coords} strokeColor="blue" fillColor="rgba(0,0,255,0.2)" />
          {coords.map((c: LatLng, idx: number) => (
            <Marker
              key={idx}
              coordinate={c}
              draggable
              onDragEnd={(e) => handleDragEnd(idx, e)}
              title={`Vertex ${idx + 1}`}
              description="Drag to adjust"
            />
          ))}
          {centroid && (
            <Marker
              coordinate={centroid}
              pinColor="green"
              title="Centroid"
              description="Polygon center"
            />
          )}
        </MapView>
      )}
      <View style={styles.buttonRow}>
        <Button title="Add Polygon Point" onPress={addPolygonPoint} />
        <Button title="Remove Last Point" onPress={removeLastPoint} color="orange" />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Save Changes" onPress={handleEdit} color="#007AFF" />
        <Button title="Delete Survey" onPress={handleDelete} color="red" />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Export CSV" onPress={() => exportCSV(`density_${survey.id}.csv`, densityHistory)} />
        <Button title="Export PDF" onPress={() => exportPDF(`density_${survey.id}.pdf`, densityHistory, survey.id)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  text: { fontSize: 16, marginVertical: 4 },
  photo: { width: "100%", height: 250, borderRadius: 8, marginBottom: 12 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 6, marginVertical: 8 },
  map: { height: 250, marginVertical: 12 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  recommend: { fontSize: 15, marginVertical: 5, fontStyle: 'italic' },
});
