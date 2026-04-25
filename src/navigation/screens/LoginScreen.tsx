import React, { useState, useContext } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@/services/authContext";

const BASE_IP = "192.168.56.1";
const API_URL = `http://${BASE_IP}:8000/api`;

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login, logout } = useContext(AuthContext); // ✅ use inside component

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data} = await axios.post(`${API_URL}/token/`, {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 15000
      }); // 10s timeout

      // ✅ Use AuthContext login (handles AsyncStorage + state)
      await login(data.access, data.refresh);

      Alert.alert("Login Successful", "Welcome back!");
      navigation.navigate("Map");
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Invalid credentials or server error.";
      Alert.alert("Login Failed", errorMessage);
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
     <View style={styles.container}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10, borderRadius: 5 },
});