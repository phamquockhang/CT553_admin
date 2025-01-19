import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface ApiOptions {
  auth: boolean;
}

export function createApiClient(
  resourceUrl: string,
  options: ApiOptions = { auth: true },
) {
  const axiosInstance = axios.create({
    baseURL: `${API_URL}/${resourceUrl}`,
    withCredentials: true,
  });
  if (options.auth) {
    axiosInstance.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    axiosInstance.interceptors.response.use(
      // when success
      (response) => {
        return response.data;
      },

      // when error
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await axios.post(
              `${API_URL}/auth/refresh-token`,
              {},
              {
                withCredentials: true,
              },
            );
            const newAccessToken = response.data.payload.accessToken;
            localStorage.setItem("access_token", newAccessToken);
            return axiosInstance(originalRequest);
          } catch (error) {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
            return Promise.reject(error);
          }
        }

        // handle orther errors from 3xx to 5xx here,  e.g. 3xx is redirect, 403 Forbidden, 404 Not Found, 500 Internal Server Error
        return error && error.response && error.response.data
          ? error.response.data
          : Promise.reject(error);
      },
    );
  }
  return axiosInstance;
}
