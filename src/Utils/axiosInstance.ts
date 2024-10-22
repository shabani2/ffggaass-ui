import axios from 'axios'
import getApiUrl from './apiUrl';

const apiUrl = getApiUrl()
const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export default axiosInstance;