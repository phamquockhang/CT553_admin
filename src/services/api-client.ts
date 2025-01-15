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
      (response) => {
        return response;
      },
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
        return Promise.reject(error);
      },
    );
  }
  return axiosInstance;
}
