import AsyncStorage from "@react-native-async-storage/async-storage";

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    console.log('Logged out successfully');
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

