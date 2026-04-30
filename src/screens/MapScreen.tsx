import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import MapView, { Marker, Polygon, Callout } from "react-native-maps";
import { useSurveys } from "@/services/surveyContext";
import { useNavigation } from "@react-navigation/native";

export default function MapScreen() {
  const { pointSurveys, polygonSurveys, centerSurveys } = useSurveys();
  const navigation = useNavigation<any>();

  return (
    <>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 5.6037, // Example: Accra
          longitude: -0.1870,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* Point Surveys */}
        {pointSurveys.map((p) => (
          <Marker
            key={`point-${p.id}`}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            image={require("../../assets/images/tree.png")}
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.title}>Point Survey {p.id}</Text>
                <Text>{`Lat: ${p.latitude}, Lng: ${p.longitude}`}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("SurveyDetail", { survey: p })}
                >
                  <Text style={styles.link}>View Details</Text>
                </TouchableOpacity>
              </View>
            </Callout>

          </Marker>
        ))}

        {/* Polygon Surveys */}
        {polygonSurveys.map((poly) => (
          <Polygon
            key={`polygon-${poly.id}`}
            coordinates={poly.coords}
            strokeColor="blue"
            fillColor="rgba(0,0,255,0.2)"
          />
        ))}

        {/* Center Point Surveys */}
        {centerSurveys.map((c) => (
          <Marker
            key={`center-${c.id}`}
            coordinate={{ latitude: c.latitude, longitude: c.longitude }}
            image={require("../../assets/icons/circle.png")}
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.title}>Center Survey {c.id}</Text>
                <Text>{`Trees: ${c.num_trees}, Spacing: ${c.spacing}m`}</Text>
                <Text>{`Area: ${c.estimated_area} m²`}</Text>
                {c.photo_uri && (
                  <Image source={{ uri: c.photo_uri }} style={styles.photo} />
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateSurvey")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: { color: "white", fontSize: 30, fontWeight: "bold" },
  callout: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
  title: { fontWeight: "bold", marginBottom: 4 },
  link: { color: "#007AFF", textDecorationLine: "underline" },
  photo: { width: 180, height: 120, marginTop: 6, borderRadius: 6 },
});
