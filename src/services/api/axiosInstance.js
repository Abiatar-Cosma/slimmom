// src/services/api/axiosInstance.js
import axios from "axios";

// Folosește VITE_BACKEND_URL fără trailing slash (ex: https://slimmom-api.onrender.com)
const ORIGIN = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const instance = axios.create({
  baseURL: `${ORIGIN}/api`,
  withCredentials: true,
});

// --- Refresh token automat pe 401 (fără bucle sau dubluri) ---
let isRefreshing = false;
let waitQueue = [];

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // dacă nu avem răspuns sau deja am încercat o dată, ieșim
    if (!error.response || original?._retry) {
      return Promise.reject(error);
    }

    // doar pentru 401, dar:
    // - nu pentru /users/refresh (ca să nu buclăm)
    // - nu pentru /users/current (guest e normal -> nu forțăm refresh)
    if (
      status === 401 &&
      !original.url.endsWith("/users/refresh") &&
      !original.url.endsWith("/users/current")
    ) {
      original._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;

          // încearcă refresh — serverul setează cookies noi dacă există refresh token
          await instance.post("/users/refresh", null, {
            withCredentials: true,
          });

          // trezim cererile blocate
          waitQueue.forEach((resolve) => resolve());
          waitQueue = [];
          isRefreshing = false;
        } else {
          // așteaptă până se termină refresh-ul curent
          await new Promise((resolve) => waitQueue.push(resolve));
        }

        // reia cererea inițială cu cookies noi
        return instance(original);
      } catch (e) {
        isRefreshing = false;
        waitQueue = [];
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
