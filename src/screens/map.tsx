import React, { useEffect, useState } from "react";
import { View, Alert, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polygon, Circle } from "react-native-maps";
import {
  fetchPointSurveys,
  fetchPolygonSurveys,
  fetchCenterPointSurveys,
  syncSurveys,
} from "../services/surveyService";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";

export default function MapScreen() {
  const navigation = useNavigation<any>();

  // Use the canonical types from geo.ts
  const [points, setPoints] = useState<SurveyPoint[]>([]);
  const [polygons, setPolygons] = useState<SurveyPolygon[]>([]);
  const [centerPoints, setCenterPoints] = useState<CenterPointSurvey[]>([]);

  const loadData = async () => {
    try {
      setPoints(await fetchPointSurveys());
      setPolygons(await fetchPolygonSurveys());
      setCenterPoints(await fetchCenterPointSurveys());
    } catch (err) {
      console.error("Failed to load surveys:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    try {
      await syncSurveys();
      Alert.alert("Sync Complete", "Your offline surveys have been uploaded.");
      await loadData(); // refresh map with synced data
    } catch (err) {
      Alert.alert("Sync Failed", "Please check your connection and try again.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 5.6037,
          longitude: -0.1870,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Points */}
        {points.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.coords.latitude, longitude: p.coords.longitude }}
            title={p.notes}
          />
        ))}

        {/* Polygons */}
        {polygons.map((poly) => (
          <Polygon
            key={poly.id}
            coordinates={poly.coords}
            strokeColor="green"
            fillColor="rgba(0,200,0,0.3)"
            strokeWidth={2}
          />
        ))}

        {/* Center Points */}
        {centerPoints.map((c) => (
          <Circle
            key={c.id}
            center={{ latitude: c.center.latitude, longitude: c.center.longitude }}
            radius={Math.sqrt(c.estimatedArea / Math.PI)}
            strokeColor="blue"
            fillColor="rgba(0,0,255,0.2)"
          />
        ))}
      </MapView>

      <Button title="View Surveys" onPress={() => navigation.navigate("SurveyList")} />
      <Button title="Sync Now" onPress={handleSync} />
    </View>
  );
}