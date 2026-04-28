import React, { useState, useContext } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { AuthContext } from "@/services/authContext";
import api from "@/services/api";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await api.post("/api/token/", { username, password });
      await login(data.access, data.refresh);
      Alert.alert("Login Successful", "Welcome back!");
      // 🚫 No navigation.reset() here
      // AppNavigator will automatically switch to MapScreen when user is set
    } catch (error: any) {
      Alert.alert("Login Failed", error.response?.data?.detail || "Server error");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10, borderRadius: 5 },
});
