import React, { useEffect, useState } from "react";
import { View, Text, Alert, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polygon, Circle } from "react-native-maps";
import { fetchPointSurveys, fetchPolygonSurveys, fetchCenterPointSurveys } from "../services/surveyServices";
// import { saveLocalPoint, saveLocalPolygon, saveLocalCenterPoint } from "../storage/localStorage";
import { syncSurveys } from "../services/surveyServices";
export default function MapScreen() {
  const navigation = useNavigation<any>();
  const [points, setPoints] = useState<any[]>([]);
  const [polygons, setPolygons] = useState<any[]>([]);
  const [centerPoints, setCenterPoints] = useState<any[]>([]);

  const loadData = async () => {
    setPoints(await fetchPointSurveys());
    setPolygons(await fetchPolygonSurveys());
    setCenterPoints(await fetchCenterPointSurveys());
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
        {points.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.coords.latitude, longitude: p.coords.longitude }}
            title={p.notes}
          />
        ))}

        {polygons.map((poly) => (
          <Polygon
            key={poly.id}
            coordinates={poly.coords}
            strokeColor="green"
            fillColor="rgba(0,200,0,0.3)"
            strokeWidth={2}
          />
        ))}

        {centerPoints.map((c) => (
          <Circle
            key={c.id}
            center={c.center}
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