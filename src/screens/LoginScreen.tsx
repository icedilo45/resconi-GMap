import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const API_URL = "http://localhost:8000/api"; // change to your Django server

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/token/`, {
        username,
        password,
      });

      const { access, refresh } = res.data;
      await AsyncStorage.setItem("accessToken", access);
      await AsyncStorage.setItem("refreshToken", refresh);
      // Store tokens securely (AsyncStorage or SecureStore)
      // Example with AsyncStorage:
      // await AsyncStorage.setItem("accessToken", access);
      // await AsyncStorage.setItem("refreshToken", refresh);

      Alert.alert("Login Successful", "Welcome back!");
      navigation.navigate("Map"); // go to map after login
    } catch (err) {
      Alert.alert("Login Failed", "Invalid credentials or server error.");
      console.error("Login error:", err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
        Login
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}