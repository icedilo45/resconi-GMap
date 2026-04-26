import axios from 'axios';
import { API_BASE_URL_DEV } from '@env';

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL_DEV}/token/`, { username, password });
  return response.data; 
};

export const logout = async () => {
  await axios.post(`${API_BASE_URL_DEV}/token/logout/`); 
};