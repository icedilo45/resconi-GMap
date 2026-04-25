import React, { useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  getPointSurveys,
  getPolygonSurveys,
  getCenterPointSurveys,
  handleLogout,
} from "@/services/surveyService";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";

export default function SurveyListScreen() {
  const [pointSurveys, setPointSurveys] = useState<SurveyPoint[]>([]);
  const [polygonSurveys, setPolygonSurveys] = useState<SurveyPolygon[]>([]);
  const [centerSurveys, setCenterSurveys] = useState<CenterPointSurvey[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const [points, polygons, centers] = await Promise.all([
        getPointSurveys(),
        getPolygonSurveys(),
        getCenterPointSurveys(),
      ]);
      setPointSurveys(points);
      setPolygonSurveys(polygons);
      setCenterSurveys(centers);
    } catch (err: any) {
      console.error("Error fetching surveys:", err);
      if (err.response?.status === 401) {
        await handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSurveys();
    }, [])
  );

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Point Surveys</Text>
      <FlatList
        data={pointSurveys}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{`Lat: ${item.latitude}, Lng: ${item.longitude}`}</Text>
            <Text>{`Notes: ${item.notes || "None"}`}</Text>
            <Text>{`Updated: ${item.updated_at}`}</Text>
            {item.photo_uri && (
              <Image source={{ uri: item.photo_uri }} style={styles.photo} />
            )}
          </View>
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchSurveys} />}
      />

      <Text style={styles.header}>Polygon Surveys</Text>
      <FlatList
        data={polygonSurveys}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{`Vertices: ${item.coords.length}`}</Text>
            <Text>{`Notes: ${item.notes || "None"}`}</Text>
            <Text>{`Updated: ${item.updated_at}`}</Text>
            {item.photo_uri && (
              <Image source={{ uri: item.photo_uri }} style={styles.photo} />
            )}
          </View>
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchSurveys} />}
      />

      <Text style={styles.header}>Center Point Surveys</Text>
      <FlatList
        data={centerSurveys}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{`Center: (${item.latitude}, ${item.longitude})`}</Text>
            <Text>{`Trees: ${item.num_trees}, Spacing: ${item.spacing}m`}</Text>
            <Text>{`Area: ${item.estimated_area} m²`}</Text>
            <Text>{`Updated: ${item.updated_at}`}</Text>
            {item.photo_uri && (
              <Image source={{ uri: item.photo_uri }} style={styles.photo} />
            )}
          </View>
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchSurveys} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  card: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    elevation: 1,
  },
  photo: { width: 200, height: 200, marginTop: 8, borderRadius: 6 },
});
