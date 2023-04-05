import axios from "axios";
import { User } from "../utils/User";

export const baseURL = "http://127.0.0.1:4000/api/v1";

const axiosClient = axios.create({
  baseURL: baseURL,
  timeout: 30000,
});

const API = async (
  config = { method: "GET", data: {}, params: {}, url: "" },
  shouldAppendToken = true,
  customToken = null
) => {
  // Success
  const onSuccess = (response) => {
    return Promise.resolve(response?.data);
  };

  // Error
  const onError = (error) => {
    if (error?.response?.status === 401) {
      /**
       * If 401
       * Clear the token from offline store
       * and navigate to Initial Stack using Navigation Service
       */
      User.clearToken();
    }

    if (error?.response) {
      // Request was made but server responded with something
      // other than 2xx
      return Promise.reject(error?.response?.data);
    } else {
      // Something else happened while setting up the request
      // triggered the error
      return Promise.reject(error?.message);
    }
  };

  const headers = {
    "Content-Type": "application/json;charset=utf-8",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  // Append auth token
  if (shouldAppendToken) {
    try {
      const token = await User.getToken();
      // headers["Portal"] = userType === "talent" ? "Talent" : "User";
      if (customToken) {
        headers["Authorization"] = customToken;
        // headers["X-Share-Type"] = "Social-Media";
      } else if (token) {
        headers["Authorization"] = token;
      }
    } catch (error) {
      // Token is not found
      return Promise.reject(error?.message);
    }
  }

  // Set headers
  axiosClient.defaults.headers = headers;

  return axiosClient(config).then(onSuccess).catch(onError);
};

export default API;
