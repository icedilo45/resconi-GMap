import axios from "axios";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";
import { getLocalPoints, getLocalPolygons, getLocalCenterPoints } from "../storage/localStorage";

const API_URL = "http://localhost:8000/api"; // change to your Django server URL

export const fetchPointSurveys = async () => {
  const res = await axios.get(`${API_URL}/points/`);
  return res.data;
};

export const fetchPolygonSurveys = async () => {
  const res = await axios.get(`${API_URL}/polygons/`);
  return res.data;
};

export const fetchCenterPointSurveys = async () => {
  const res = await axios.get(`${API_URL}/centerpoints/`);
  return res.data;
};

export const savePointSurvey = async (point: SurveyPoint) => {
  await axios.post(`${API_URL}/points/`, {
    ...point,
    updatedAt: new Date().toISOString(),
  });
};

export const savePolygonSurvey = async (polygon: SurveyPolygon) => {
  await axios.post(`${API_URL}/polygons/`, {
    ...polygon,
    updatedAt: new Date().toISOString(),
  });
};

export const saveCenterPointSurvey = async (centerPoint: CenterPointSurvey) => {
  await axios.post(`${API_URL}/centerpoints/`, {
    ...centerPoint,
    updatedAt: new Date().toISOString(),
  });
};

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