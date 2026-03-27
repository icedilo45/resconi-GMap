import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getLocalPoints, getLocalPolygons, getLocalCenterPoints,
         deleteLocalPoint, deleteLocalPolygon, deleteLocalCenterPoint } from "../storage/localStorage";

export default function SurveyListScreen() {
  const navigation = useNavigation<any>();
  const [points, setPoints] = useState<any[]>([]);
  const [polygons, setPolygons] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);

  const loadData = async () => {
    setPoints(await getLocalPoints());
    setPolygons(await getLocalPolygons());
    setCenters(await getLocalCenterPoints());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (type: string, id: string) => {
    if (type === "point") await deleteLocalPoint(id);
    if (type === "polygon") await deleteLocalPolygon(id);
    if (type === "center") await deleteLocalCenterPoint(id);
    Alert.alert("Deleted", `Survey ${id} removed`);
    await loadData();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>Points</Text>
      <FlatList
        data={points}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>{item.notes} ({item.coords.latitude}, {item.coords.longitude})</Text>
            <Button title="Delete" onPress={() => handleDelete("point", item.id)} />
            <Button title="Edit" onPress={() => navigation.navigate("EditSurvey", { survey: item, type: "point" })} />
          </View>
        )}
      />

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 20 }}>Polygons</Text>
      <FlatList
        data={polygons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>{item.notes} - {item.coords.length} vertices</Text>
            <Button title="Delete" onPress={() => handleDelete("polygon", item.id)} />
            <Button title="Edit" onPress={() => navigation.navigate("EditSurvey", { survey: item, type: "polygon" })} />
          </View>
        )}
      />

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 20 }}>Center Points</Text>
      <FlatList
        data={centers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>Spacing: {item.spacing}m, Trees: {item.numTrees}, Area: {item.estimatedArea} m²</Text>
            <Button title="Delete" onPress={() => handleDelete("center", item.id)} />
            <Button title="Edit" onPress={() => navigation.navigate("EditSurvey", { survey: item, type: "center" })} />
          </View>
        )}
      />
    </View>
  );
}