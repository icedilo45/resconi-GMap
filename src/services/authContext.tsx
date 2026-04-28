import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL_DEV } from "@env";


type AuthContextType = {
  user: string | null;
  loading: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("access");
      if (token) setUser(token);
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (access: string, refresh: string) => {
    await AsyncStorage.setItem("access", access);
    await AsyncStorage.setItem("refresh", refresh);
    setUser(access);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["access", "refresh"]);
    setUser(null);
  };

  // ✅ Refresh token logic
  const refreshToken = async () => {
    const refresh = await AsyncStorage.getItem("refresh");
    if (!refresh) {
      await logout();
      return null;
    }
    try {
      const { data } = await axios.post(`${API_BASE_URL_DEV}/api/token/refresh/`, { refresh });
      await AsyncStorage.setItem("access", data.access);
      setUser(data.access);
      return data.access;
    } catch (err) {
      // 🚫 Refresh failed → logout immediately
      await logout();
      return null;
    }
  };

  // ✅ Axios interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      async error => {
        if (error.response?.status === 401) {
          const newAccess = await refreshToken();
          if (newAccess) {
            error.config.headers.Authorization = `Bearer ${newAccess}`;
            return axios(error.config); // retry
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
