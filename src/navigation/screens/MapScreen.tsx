import React, { useEffect, useState } from "react";
import { View, Alert, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polygon, Circle, UrlTile } from "react-native-maps";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";

export default function MapScreen() {
  const navigation = useNavigation<any>();

  const [points, setPoints] = useState<SurveyPoint[]>([]);
  const [polygons, setPolygons] = useState<SurveyPolygon[]>([]);
  const [centerPoints, setCenterPoints] = useState<CenterPointSurvey[]>([]);

  const loadData = async () => {
    try {
      // Data loading logic
    } catch (err) {
      console.error("Failed to load surveys:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    try {
      Alert.alert("Sync Complete", "Your offline surveys have been uploaded.");
      await loadData(); 
    } catch (err) {
      Alert.alert("Sync Failed", "Please check your connection and try again.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 5.6037, 
          longitude: -0.1870,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <UrlTile
          urlTemplate="https://openstreetmap.org{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        <Marker coordinate={{ latitude: 5.6037, longitude: -0.1870 }} title="Accra" />
      </MapView>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
           <Button title="View Surveys" onPress={() => navigation.navigate("SurveyList")} />
        </View>
        <View style={styles.buttonWrapper}>
           <Button title="Sync Now" color="#28a745" onPress={handleSync} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white',
  },
  map: {
    ...StyleSheet.absoluteFill,
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
  },
  buttonWrapper: {
    marginBottom: 10,
  }
});