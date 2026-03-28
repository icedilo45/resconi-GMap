import axios from "axios";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";
import { getLocalPoints, getLocalPolygons, getLocalCenterPoints } from "../storage/localStorage";

const API_URL = "http://localhost:8000/api"; // change to your Django server URL

// --- Fetch Surveys ---
export const fetchPointSurveys = async (): Promise<SurveyPoint[]> => {
  const res = await axios.get(`${API_URL}/points/`);
  return res.data.map((p: any) => ({
    id: p.id,
    coords: { latitude: p.latitude, longitude: p.longitude },
    notes: p.notes,
    photoUri: p.photoUri,
  }));
};

export const fetchPolygonSurveys = async (): Promise<SurveyPolygon[]> => {
  const res = await axios.get(`${API_URL}/polygons/`);
  return res.data.map((poly: any) => ({
    id: poly.id,
    coords: poly.coords, // already an array of { latitude, longitude }
    notes: poly.notes,
  }));
};

export const fetchCenterPointSurveys = async (): Promise<CenterPointSurvey[]> => {
  const res = await axios.get(`${API_URL}/centerpoints/`);
  return res.data.map((c: any) => ({
    id: c.id,
    center: { latitude: c.latitude, longitude: c.longitude },
    spacing: c.spacing,
    numTrees: c.numTrees,
    estimatedArea: c.estimatedArea,
    notes: c.notes,
  }));
};

// --- Save Surveys ---
export const savePointSurvey = async (point: SurveyPoint) => {
  await axios.post(`${API_URL}/points/`, {
    id: point.id,
    latitude: point.coords.latitude,
    longitude: point.coords.longitude,
    notes: point.notes,
    photoUri: point.photoUri,
    updatedAt: new Date().toISOString(),
  });
};

export const savePolygonSurvey = async (polygon: SurveyPolygon) => {
  await axios.post(`${API_URL}/polygons/`, {
    id: polygon.id,
    coords: polygon.coords,
    notes: polygon.notes,
    updatedAt: new Date().toISOString(),
  });
};

export const saveCenterPointSurvey = async (centerPoint: CenterPointSurvey) => {
  await axios.post(`${API_URL}/centerpoints/`, {
    id: centerPoint.id,
    latitude: centerPoint.center.latitude,
    longitude: centerPoint.center.longitude,
    spacing: centerPoint.spacing,
    numTrees: centerPoint.numTrees,
    estimatedArea: centerPoint.estimatedArea,
    notes: centerPoint.notes,
    updatedAt: new Date().toISOString(),
  });
};

// --- Sync Offline Surveys ---
export const syncSurveys = async () => {
  try {
    const points = await getLocalPoints();
    for (const p of points) {
      await savePointSurvey(p);
    }

    const polygons = await getLocalPolygons();
    for (const poly of polygons) {
      await savePolygonSurvey(poly);
    }

    const centers = await getLocalCenterPoints();
    for (const c of centers) {
      await saveCenterPointSurvey(c);
    }

    console.log("Sync complete! Updates applied.");
  } catch (err) {
    console.error("Sync failed:", err);
  }
};

// --- Photo Upload ---
export const uploadPhoto = async (uri: string, id: string) => {
  const formData = new FormData();
  formData.append("photo", {
    uri,
    type: "image/jpeg",
    name: `${id}.jpg`,
  } as any);

  await axios.post(`${API_URL}/upload-photo/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};