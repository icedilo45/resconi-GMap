import AsyncStorage from "@react-native-async-storage/async-storage";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "../utils/geo";

export const saveLocalPoint = async (point: SurveyPoint) => {
  const existing = await AsyncStorage.getItem("points");
  const points = existing ? JSON.parse(existing) : [];
  points.push(point);
  await AsyncStorage.setItem("points", JSON.stringify(points));
};

export const getLocalPoints = async (): Promise<SurveyPoint[]> => {
  const existing = await AsyncStorage.getItem("points");
  return existing ? JSON.parse(existing) : [];
};

export const saveLocalPolygon = async (polygon: SurveyPolygon) => {
  const existing = await AsyncStorage.getItem("polygons");
  const polygons = existing ? JSON.parse(existing) : [];
  polygons.push(polygon);
  await AsyncStorage.setItem("polygons", JSON.stringify(polygons));
};

export const getLocalPolygons = async (): Promise<SurveyPolygon[]> => {
  const existing = await AsyncStorage.getItem("polygons");
  return existing ? JSON.parse(existing) : [];
};

export const saveLocalCenterPoint = async (survey: CenterPointSurvey) => {
  const existing = await AsyncStorage.getItem("centerpoints");
  const centerpoints = existing ? JSON.parse(existing) : [];
  centerpoints.push(survey);
  await AsyncStorage.setItem("centerpoints", JSON.stringify(centerpoints));
};

export const getLocalCenterPoints = async (): Promise<CenterPointSurvey[]> => {
  const existing = await AsyncStorage.getItem("centerpoints");
  return existing ? JSON.parse(existing) : [];
};

export const deleteLocalPoint = async (id: string) => {
  const existing = await AsyncStorage.getItem("points");
  const points = existing ? JSON.parse(existing) : [];
  const updated = points.filter((p: any) => p.id !== id);
  await AsyncStorage.setItem("points", JSON.stringify(updated));
};

export const deleteLocalPolygon = async (id: string) => {
  const existing = await AsyncStorage.getItem("polygons");
  const polygons = existing ? JSON.parse(existing) : [];
  const updated = polygons.filter((p: any) => p.id !== id);
  await AsyncStorage.setItem("polygons", JSON.stringify(updated));
};

export const deleteLocalCenterPoint = async (id: string) => {
  const existing = await AsyncStorage.getItem("centerpoints");
  const centers = existing ? JSON.parse(existing) : [];
  const updated = centers.filter((c: any) => c.id !== id);
  await AsyncStorage.setItem("centerpoints", JSON.stringify(updated));
};

export const updateLocalPoint = async (updatedPoint: any) => {
  const existing = await AsyncStorage.getItem("points");
  const points = existing ? JSON.parse(existing) : [];
  const newPoints = points.map((p: any) => (p.id === updatedPoint.id ? updatedPoint : p));
  await AsyncStorage.setItem("points", JSON.stringify(newPoints));
};

export const updateLocalPolygon = async (updatedPolygon: any) => {
  const existing = await AsyncStorage.getItem("polygons");
  const polygons = existing ? JSON.parse(existing) : [];
  const newPolygons = polygons.map((p: any) => (p.id === updatedPolygon.id ? updatedPolygon : p));
  await AsyncStorage.setItem("polygons", JSON.stringify(newPolygons));
};

export const updateLocalCenterPoint = async (updatedCenter: any) => {
  const existing = await AsyncStorage.getItem("centerpoints");
  const centers = existing ? JSON.parse(existing) : [];
  const newCenters = centers.map((c: any) => (c.id === updatedCenter.id ? updatedCenter : c));
  await AsyncStorage.setItem("centerpoints", JSON.stringify(newCenters));
};