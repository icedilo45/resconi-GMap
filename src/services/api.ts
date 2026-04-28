import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL_DEV } from '@env';

const api = axios.create({
    baseURL: API_BASE_URL_DEV,
    timeout: 15000,
});

// Request interceptor: attach access token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = await AsyncStorage.getItem("refresh");
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE_URL_DEV}/api/token/refresh/`, { refresh });
          await AsyncStorage.setItem("access", data.access);

          // retry original request with new token
          error.config.headers.Authorization = `Bearer ${data.access}`;
          return api(error.config);
        } catch (refreshError) {
          await AsyncStorage.multiRemove(["access", "refresh"]);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;