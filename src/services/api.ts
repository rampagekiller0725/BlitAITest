import { Auth } from "aws-amplify";
import axios, { AxiosRequestConfig } from "axios";
import { parseToken } from "utilities";
import { isExpiredToken } from "utilities";

class API {
  constructor() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("idToken");
        if (token && !isExpiredToken(parseToken(token))) {
          const item = { ...config };
          item.headers.Authorization = `Bearer ${token}`;
          return item;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error &&
          error.response &&
          (error.response.status === 400 ||
            error.response.status === 403 ||
            error.response.status === 401)
        ) {
          Auth.signOut().then(() => {
            localStorage.clear();
            window.location.href = "/";
          });
        }
      }
    );

    axios.defaults.baseURL = "https://api.blit.ai";
  }

  async get(url: string, config?: AxiosRequestConfig) {
    return axios.get(url, config);
  }

  async post(url: string, data: any, config?: AxiosRequestConfig) {
    return axios.post(url, data, config);
  }

  async put(url: string, data: any, config?: AxiosRequestConfig) {
    return axios.put(url, data, config);
  }

  async delete(url: string) {
    return axios.delete(url);
  }
}

const api = new API();

export default api;
