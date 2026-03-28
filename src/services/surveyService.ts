import axios from "axios";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";
import { getLocalPoints, getLocalPolygons, getLocalCenterPoints } from "../storage/localStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";


const API_URL = "http://localhost:8000/api"; // change to your Django server URL
const api = axios.create({
  baseURL: API_URL,
});

// Attach access token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token stored");

        // Request new access token
        const res = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        await AsyncStorage.setItem("accessToken", newAccessToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Optionally redirect to login
      }
    }

    return Promise.reject(error);
  }
);


// --- Fetch Surveys ---
export const fetchPointSurveys = async (): Promise<SurveyPoint[]> => {
  const res = await api.get('/points/');
  return res.data.map((p: any) => ({
    id: p.id,
    coords: { latitude: p.latitude, longitude: p.longitude },
    notes: p.notes,
    photoUri: p.photoUri,
  }));
};

export const fetchPolygonSurveys = async (): Promise<SurveyPolygon[]> => {
  const res = await api.get('/polygons/');
  return res.data.map((poly: any) => ({
    id: poly.id,
    coords: poly.coords, // already an array of { latitude, longitude }
    notes: poly.notes,
  }));
};

export const fetchCenterPointSurveys = async (): Promise<CenterPointSurvey[]> => {
  const res = await api.get('/centerpoints/');
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
  await api.post('/points/', {
    id: point.id,
    latitude: point.coords.latitude,
    longitude: point.coords.longitude,
    notes: point.notes,
    photoUri: point.photoUri,
    updatedAt: new Date().toISOString(),
  });
};

export const savePolygonSurvey = async (polygon: SurveyPolygon) => {
  await api.post('/polygons/', {
    id: polygon.id,
    coords: polygon.coords,
    notes: polygon.notes,
    updatedAt: new Date().toISOString(),
  });
};

export const saveCenterPointSurvey = async (centerPoint: CenterPointSurvey) => {
  await api.post('/centerpoints/', {
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

  await api.post('/upload-photo/', formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};