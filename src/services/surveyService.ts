import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { navigationRef } from "@/navigationRef";
import { CenterPointSurvey, SurveyPoint, SurveyPolygon } from "@/utils/geo";

const BASE_IP = "192.168.56.1";  // ✅ your LAN IP
const API_URL = `http://${BASE_IP}:8000/api`;

// --- Auth Helpers ---
async function getAuthHeader() {
  const token = await AsyncStorage.getItem("access");
  return { Authorization: `Bearer ${token}` };
}

// --- Auth ---
export async function login(username: string, password: string) {
  const res = await axios.post(`${API_URL}/token/`, { username, password });
  const { access, refresh } = res.data;
  await AsyncStorage.setItem("access", access);
  await AsyncStorage.setItem("refresh", refresh);
  return res.data;
}

export async function refreshToken() {
  const refresh = await AsyncStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token stored");
  const res = await axios.post(`${API_URL}/token/refresh/`, { refresh });
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

// --- Point Surveys ---
export async function getPointSurveys(): Promise<SurveyPoint[]> {
  const res = await axios.get(`${API_URL}/points/`, { headers: await getAuthHeader() });
  return res.data;
}

export async function savePointSurvey(payload: SurveyPoint) {
  const res = await axios.post(`${API_URL}/points/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function updatePointSurvey(id: number, payload: Partial<SurveyPoint>) {
  const res = await axios.patch(`${API_URL}/points/${id}/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function deletePointSurvey(id: number) {
  await axios.delete(`${API_URL}/points/${id}/`, { headers: await getAuthHeader() });
}

// --- Polygon Surveys ---
export async function getPolygonSurveys(): Promise<SurveyPolygon[]> {
  const res = await axios.get(`${API_URL}/polygons/`, { headers: await getAuthHeader() });
  return res.data;
}

export async function savePolygonSurvey(payload: SurveyPolygon) {
  const res = await axios.post(`${API_URL}/polygons/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function updatePolygonSurvey(id: number, payload: Partial<SurveyPolygon>) {
  const res = await axios.patch(`${API_URL}/polygons/${id}/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function deletePolygonSurvey(id: number) {
  await axios.delete(`${API_URL}/polygons/${id}/`, { headers: await getAuthHeader() });
}

// --- Center Point Surveys ---
export async function getCenterPointSurveys(): Promise<CenterPointSurvey[]> {
  const res = await axios.get(`${API_URL}/centerpoints/`, { headers: await getAuthHeader() });
  return res.data;
}

export async function saveCenterPointSurvey(payload: CenterPointSurvey) {
  const res = await axios.post(`${API_URL}/centerpoints/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function updateCenterPointSurvey(id: number, payload: Partial<CenterPointSurvey>) {
  const res = await axios.patch(`${API_URL}/centerpoints/${id}/`, payload, { headers: await getAuthHeader() });
  return res.data;
}

export async function deleteCenterPointSurvey(id: number) {
  await axios.delete(`${API_URL}/centerpoints/${id}/`, { headers: await getAuthHeader() });
}

// --- Photo Upload ---
export async function uploadPhoto(formData: FormData) {
  const res = await axios.post(`${API_URL}/upload-photo/`, formData, {
    headers: { ...(await getAuthHeader()), "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
