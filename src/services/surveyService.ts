import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { navigationRef } from "@/navigationRef";
import { CenterPointSurvey, SurveyPoint, SurveyPolygon } from "@/utils/geo";
import { API_BASE_URL_DEV } from "@env";
import api from "@/services/api";


// --- Auth Helpers ---
async function getAuthHeader() {
  const token = await AsyncStorage.getItem("access");
  return { Authorization: `Bearer ${token}` };
}

// --- Auth ---
export async function login(username: string, password: string) {
  const res = await api.post(`${API_BASE_URL_DEV}/token/`, { username, password });
  const { access, refresh } = res.data;
  await AsyncStorage.setItem("access", access);
  await AsyncStorage.setItem("refresh", refresh);
  return res.data;
}

export async function refreshToken() {
  const refresh = await AsyncStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token stored");
  const res = await api.post(`${API_BASE_URL_DEV}/token/refresh/`, { refresh });
  const { access } = res.data;
  await AsyncStorage.setItem("access", access);
  return access;
}

export async function handleLogout() {
  await AsyncStorage.removeItem("access");
  await AsyncStorage.removeItem("refresh");
  navigationRef.current?.dispatch(
    CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
  );
}

export const createSurvey = async (payload: any) => {
  const { data } = await api.post("/surveys/", payload);
  return data;
};

export const fetchSurveys = async () => {
  const { data } = await api.get("/surveys/");
  return data; // returns array of surveys
};

// --- Point Surveys ---
export async function getPointSurveys(): Promise<SurveyPoint[]> {
  const res = await api.get(`${API_BASE_URL_DEV}/points/`, { headers: await getAuthHeader() });
  return res.data;
}

export async function savePointSurvey(payload: SurveyPoint) {
  const res = await api.post(`${API_BASE_URL_DEV}/points/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function updatePointSurvey(id: number, payload: Partial<SurveyPoint>) {
  const res = await api.patch(`${API_BASE_URL_DEV}/points/${id}/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function deletePointSurvey(id: number) {
  await api.delete(`${API_BASE_URL_DEV}/points/${id}/`, { headers: await getAuthHeader() });
}

// --- Polygon Surveys ---
export async function getPolygonSurveys(): Promise<SurveyPolygon[]> {
  const res = await api.get(`${API_BASE_URL_DEV}/polygons/`, { headers: await getAuthHeader() });
  return res.data;
}

export async function savePolygonSurvey(payload: SurveyPolygon) {
  const res = await api.post(`${API_BASE_URL_DEV}/polygons/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function updatePolygonSurvey(id: number, payload: Partial<SurveyPolygon>) {
  const res = await api.patch(`${API_BASE_URL_DEV}/polygons/${id}/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function deletePolygonSurvey(id: number) {
  await api.delete(`${API_BASE_URL_DEV}/polygons/${id}/`, { headers: await getAuthHeader() });
}

// --- Center Point Surveys ---
export async function getCenterPointSurveys(): Promise<CenterPointSurvey[]> {
  const res = await api.get(`${API_BASE_URL_DEV}/centerpoints/`, { headers: await getAuthHeader() });
  return res.data;
}

export async function saveCenterPointSurvey(payload: CenterPointSurvey) {
  const res = await api.post(`${API_BASE_URL_DEV}/centerpoints/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function updateCenterPointSurvey(id: number, payload: Partial<CenterPointSurvey>) {
  const res = await api.patch(`${API_BASE_URL_DEV}/centerpoints/${id}/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function deleteCenterPointSurvey(id: number) {
  await api.delete(`${API_BASE_URL_DEV}/centerpoints/${id}/`, { headers: await getAuthHeader() });
}

// --- Photo Upload ---
export async function uploadPhoto(formData: FormData) {
  const res = await api.post(`${API_BASE_URL_DEV}/upload-photo/`, formData, {
    headers: { ...(await getAuthHeader()), "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
