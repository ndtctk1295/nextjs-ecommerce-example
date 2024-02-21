import axios from "axios";
import { useRouter } from "next/router";
const baseURL = process.env.NEXT_PUBLIC_API_URL;
const axiosInstance = axios.create({
  baseURL: baseURL, // replace with your API URL
});
axiosInstance.interceptors.request.use(
  (config) => {
    // const { jwt } = useContext(UserContext);
    const jwt = localStorage.getItem("jwt");
    // const { jwt } = useUser();
    if (jwt) {
      config.headers["Authorization"] = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(baseURL + "public/user/refresh", {
          refreshToken: refreshToken,
        });
        const newAccessToken = response.data.data;
        localStorage.setItem("jwt", newAccessToken); // Store the refreshed token
        // login(refreshToken, username); // Update the UserContext
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // Use the refreshed token for the original request
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
        console.log("this is error");
        useRouter().push("/login");
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
