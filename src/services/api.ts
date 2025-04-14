
import axios from 'axios';

const API_URL ='http://localhost:5000/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: async (userData: { name: string; email: string; password: string }) => {
    console.log("userdata", userData)
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (userData: { email: string; password: string }) => {
    const response = await api.post('/auth/login', userData);
    console.log("respnose", response.data)
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};


export const userService = {
  updateInterest: async (interest: string) => {
    const response = await api.put('/users/interest', { interest });
    return response.data;
  },
};


export const messageService = {
  getMessages: async () => {
    const response = await api.get('/messages');
    return response.data;
  },
};

export default api;