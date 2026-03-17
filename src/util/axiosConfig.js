import axios from "axios";
import { BASEURL } from "./apiEndpoints";

const axiosConfig = axios.create({
    baseURL: BASEURL,
    withCredentials: true, // 🍪 CRITICAL: send cookies
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// ❌ REMOVE request interceptor completely (no token needed)

// ✅ Keep response interceptor
axiosConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server error. Please try again later");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosConfig;