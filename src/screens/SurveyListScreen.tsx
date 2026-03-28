import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  fetchPointSurveys,
  fetchPolygonSurveys,
  fetchCenterPointSurveys,
} from "../services/surveyService";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";

export default function SurveyListScreen() {
  const navigation = useNavigation<any>();

  const [points, setPoints] = useState<SurveyPoint[]>([]);
  const [polygons, setPolygons] = useState<SurveyPolygon[]>([]);
  const [centerPoints, setCenterPoints] = useState<CenterPointSurvey[]>([]);

  const loadData = async () => {
    try {
      setPoints(await fetchPointSurveys());
      setPolygons(await fetchPolygonSurveys());
      setCenterPoints(await fetchCenterPointSurveys());
    } catch (err) {
      Alert.alert("Error", "Failed to load surveys.");
      console.error("Failed to load surveys:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderPoint = ({ item }: { item: SurveyPoint }) => (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text>Point Survey: {item.id}</Text>
      <Text>Lat: {item.coords.latitude}, Lng: {item.coords.longitude}</Text>
      {item.notes && <Text>Notes: {item.notes}</Text>}
      <Button
        title="Edit"
        onPress={() => navigation.navigate("EditSurvey", { survey: item, type: "point" })}
      />
    </View>
  );

  const renderPolygon = ({ item }: { item: SurveyPolygon }) => (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text>Polygon Survey: {item.id}</Text>
      <Text>Vertices: {item.coords.length}</Text>
      {item.notes && <Text>Notes: {item.notes}</Text>}
      <Button
        title="Edit"
        onPress={() => navigation.navigate("EditSurvey", { survey: item, type: "polygon" })}
      />
    </View>
  );

  const renderCenterPoint = ({ item }: { item: CenterPointSurvey }) => (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text>Center Point Survey: {item.id}</Text>
      <Text>Lat: {item.center.latitude}, Lng: {item.center.longitude}</Text>
      <Text>Spacing: {item.spacing}m</Text>
      <Text>Trees: {item.numTrees}</Text>
      <Text>Area: {item.estimatedArea} m²</Text>
      {item.notes && <Text>Notes: {item.notes}</Text>}
      <Button
        title="Edit"
        onPress={() => navigation.navigate("EditSurvey", { survey: item, type: "center" })}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Survey List</Text>

      <FlatList
        data={points}
        renderItem={renderPoint}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={{ marginTop: 10 }}>Points</Text>}
      />

      <FlatList
        data={polygons}
        renderItem={renderPolygon}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={{ marginTop: 10 }}>Polygons</Text>}
      />

      <FlatList
        data={centerPoints}
        renderItem={renderCenterPoint}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={{ marginTop: 10 }}>Center Points</Text>}
      />
    </View>
  );
}