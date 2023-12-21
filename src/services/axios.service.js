import axios from "axios";
import AuthStorage from "../utils/authStorage";
import { apiConfig } from "../config";
import { HELPER } from ".";

const instance = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const excelInstance = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "blob",
});

const requestMiddleware = (config) => {
  let token = AuthStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config?.data?.is_public_url || config?.params?.is_public_url) {
    config.baseURL = apiConfig.publicURL;
    delete config?.data?.is_public_url;
    delete config?.params?.is_public_url;
  }

  if (config.method === "post" || config.method === "put") {
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
  }

  return config;
}

// Prepare request
instance.interceptors.request.use(
  requestMiddleware,
  (error) => Promise.reject(error)
);

// excel file instance
excelInstance.interceptors.request.use(
  requestMiddleware,
  (error) => Promise.reject(error)
);


// Prepare Response
instance.interceptors.response.use(
  (response) => {
    if (
      response.config.url.includes(apiConfig.downloadInvoice)
  ) {
      return response.data;
  }

    return response.data.success ? response.data.data : response.error;
  },
  (error) => {
    // in the case, server is stoped
    if (error.code === "ERR_NETWORK") {
      HELPER.toaster.error("Something went wrong, Please try after sometimes.");
    }

    if (error.response.data.status === 401) {
      AuthStorage.deauthenticateUser();
    }

    return Promise.reject({
      errors:
        error?.response && error.response?.data?.error
          ? error.response?.data?.error
          : { message: ["Somthing went wrong."] },
      status:
        error?.response && error.response?.data?.status
          ? error.response?.data?.status
          : 501,
    });
  }
);

const post = (url, data, headers = {}) => instance.post(url, data, headers);

const destroy = (url) => instance.delete(url);

const get = (url, params) =>
  instance.get(url, {
    params,
  });

const getExcel = (url, params) =>
  excelInstance.get(url, {
    params,
  });

const put = (url, data, headers = {}) => instance.put(url, data, headers);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  post,
  destroy,
  get,
  getExcel,
  put,
};
