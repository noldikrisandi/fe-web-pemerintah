import axios from 'axios';

// bisa koneksi dengan local 8080 atau langsung railway
const apiBaseUrl = 'https://api-web-pemerintah-production.up.railway.app/';
// const apiBaseUrl = 'http://localhost:8080/';


const apiConnection = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiConnection.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiConnection.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default apiConnection;
