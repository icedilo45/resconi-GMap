import React, { useEffect, useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../services/authContext";

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const { login, logout } = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const access = await AsyncStorage.getItem("accessToken");
        const refresh = await AsyncStorage.getItem("refreshToken");

        if (access && refresh) {
          // Just mark user as logged in — Axios will handle refresh if needed
          await login(access, refresh);
          navigation.reset({ index: 0, routes: [{ name: "Map" }] });
        } else {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
}