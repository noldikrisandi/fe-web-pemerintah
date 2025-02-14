import axios from 'axios';

// URL API base
const apiBaseUrl = 'https://api-web-pemerintah-production.up.railway.app/';
// const apiBaseUrl = 'http://localhost:8080/';

// Membuat instance axios
const apiConnection = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mengatur interceptors jika diperlukan untuk menangani request atau response global
apiConnection.interceptors.request.use(
  (config) => {
    // Jika perlu menambahkan token atau informasi lainnya
    // Misalnya, jika ada token autentikasi:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
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
    // Menangani error global (misalnya jika token sudah tidak valid)
    if (error.response && error.response.status === 401) {
      // Redirect ke login atau tindakan lainnya
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiConnection;
