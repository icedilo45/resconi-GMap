import AsyncStorage from "@react-native-async-storage/async-storage";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";

const POINTS_KEY = "local_points";
const POLYGONS_KEY = "local_polygons";
const CENTERPOINTS_KEY = "local_centerpoints";

// --- Save Functions ---
export const saveLocalPoint = async (point: SurveyPoint) => {
  const existing = await getLocalPoints();
  const updated = [...existing.filter(p => p.id !== point.id), point];
  await AsyncStorage.setItem(POINTS_KEY, JSON.stringify(updated));
};

export const saveLocalPolygon = async (polygon: SurveyPolygon) => {
  const existing = await getLocalPolygons();
  const updated = [...existing.filter(p => p.id !== polygon.id), polygon];
  await AsyncStorage.setItem(POLYGONS_KEY, JSON.stringify(updated));
};

export const saveLocalCenterPoint = async (centerPoint: CenterPointSurvey) => {
  const existing = await getLocalCenterPoints();
  const updated = [...existing.filter(c => c.id !== centerPoint.id), centerPoint];
  await AsyncStorage.setItem(CENTERPOINTS_KEY, JSON.stringify(updated));
};

// --- Get Functions ---
export const getLocalPoints = async (): Promise<SurveyPoint[]> => {
  const raw = await AsyncStorage.getItem(POINTS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const getLocalPolygons = async (): Promise<SurveyPolygon[]> => {
  const raw = await AsyncStorage.getItem(POLYGONS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const getLocalCenterPoints = async (): Promise<CenterPointSurvey[]> => {
  const raw = await AsyncStorage.getItem(CENTERPOINTS_KEY);
  return raw ? JSON.parse(raw) : [];
};

// --- Clear Functions (optional) ---
export const clearLocalPoints = async () => {
  await AsyncStorage.removeItem(POINTS_KEY);
};

export const clearLocalPolygons = async () => {
  await AsyncStorage.removeItem(POLYGONS_KEY);
};

export const clearLocalCenterPoints = async () => {
  await AsyncStorage.removeItem(CENTERPOINTS_KEY);
};