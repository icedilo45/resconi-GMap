import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { login, register } from "../services/auth";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.replace("Map"); // go to map after login
    } catch (err) {
      Alert.alert("Login Failed", err instanceof Error ? err.message : String(err));
    }
  };

  const handleRegister = async () => {
    try {
      await register(email, password);
      navigation.replace("Map");
    } catch (err) {
      Alert.alert("Registration Failed", err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}