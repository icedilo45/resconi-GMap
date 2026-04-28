import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useSurveys } from "@/services/surveyContext";

export default function SurveyListScreen() {
  const { pointSurveys, polygonSurveys, centerSurveys, loadSurveys } = useSurveys();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadSurveys();
      setLoading(false);
    };
    fetchData();
  }, []);

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
            {item.photo_uri && <Image source={{ uri: item.photo_uri }} style={styles.photo} />}
          </View>
        )}
      />

      <Text style={styles.header}>Polygon Surveys</Text>
      <FlatList
        data={polygonSurveys}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{`Vertices: ${item.coords.length}`}</Text>
            <Text>{`Notes: ${item.notes || "None"}`}</Text>
            {item.photo_uri && <Image source={{ uri: item.photo_uri }} style={styles.photo} />}
          </View>
        )}
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
            {item.photo_uri && <Image source={{ uri: item.photo_uri }} style={styles.photo} />}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  card: { padding: 12, marginVertical: 6, backgroundColor: "#f9f9f9", borderRadius: 6 },
  photo: { width: 200, height: 200, marginTop: 8, borderRadius: 6 },
});
