import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

// 🔐 REQUEST interceptor
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ RESPONSE interceptor (optional but recommended)
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Unauthorized or Forbidden");
      // optionally logout user
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;
