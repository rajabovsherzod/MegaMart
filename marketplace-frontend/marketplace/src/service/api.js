import axios from "axios";
import {getItem} from "../helpers/persistance-storage";

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(
  (config) => {
    const token = getItem("token");
    console.log('Token in interceptor:', token); // Token borligini tekshirish uchun
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('Interceptor error:', error);
    return Promise.reject(error);
  }
);
  
  export default axios;