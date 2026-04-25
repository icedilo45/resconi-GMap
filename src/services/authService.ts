import axios from 'axios';

// Use your computer's IP address, not 'localhost', for Android Emulators
const BASE_IP = "192.168.56.1";
const API_URL = `http://${BASE_IP}:8000/api`; 

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/token/`, { username, password });
  // Django Simple JWT returns 'access' and 'refresh' tokens
  return response.data; 
};

export const logout = async () => {
  await axios.post(`${API_URL}/token/logout/`); 
};