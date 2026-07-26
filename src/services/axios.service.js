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

// Separate client without auth interceptors to avoid refresh loops
const refreshClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let numberOfAjaxCAllPending = 0;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const forceLogout = () => {
  AuthStorage.deauthenticateUser();
  if (!window.location.pathname.includes("signin")) {
    window.location.href = "/signin";
  }
};

const requestMiddleware = (config) => {
  let token = AuthStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config?.data?.is_public_url || config?.params?.is_public_url) {
    config.baseURL = apiConfig.publicApiURL;
    delete config?.data?.is_public_url;
    delete config?.params?.is_public_url;
  }

  if (config.method === "post" || config.method === "put") {
    if (config.data instanceof FormData) {
      // Let the browser set multipart boundary; a bare multipart Content-Type breaks uploads.
      delete config.headers["Content-Type"];
    }
  }

  numberOfAjaxCAllPending++;

  return config;
};

const refreshAccessToken = async () => {
  const refreshToken = AuthStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const response = await refreshClient.post(apiConfig.refreshToken, { refreshToken });
  const data = response.data?.success ? response.data.data : null;
  if (!data?.token) {
    throw new Error("Unable to refresh session");
  }

  AuthStorage.setAuthTokens(data.token, data.refreshToken || refreshToken, true);
  if (data.user) {
    AuthStorage.setStorageJsonData(AuthStorage.STORAGEKEY.userData, data.user, true);
  }
  return data.token;
};

const handleUnauthorized = async (error) => {
  const originalRequest = error.config;
  const status = error.response?.data?.status || error.response?.status;
  const requestUrl = originalRequest?.url || "";

  if (status !== 401 || !originalRequest) {
    return null;
  }

  // Never try to refresh the refresh call itself
  if (requestUrl.includes(apiConfig.refreshToken) || requestUrl.includes(apiConfig.login)) {
    forceLogout();
    return Promise.reject(error);
  }

  if (originalRequest._retry) {
    forceLogout();
    return Promise.reject(error);
  }

  const retryWithClient = (token) => {
    originalRequest.headers.Authorization = `Bearer ${token}`;
    const client = originalRequest.responseType === "blob" ? excelInstance : instance;
    return client(originalRequest);
  };

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => retryWithClient(token));
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const newToken = await refreshAccessToken();
    processQueue(null, newToken);
    return retryWithClient(newToken);
  } catch (refreshError) {
    processQueue(refreshError, null);
    forceLogout();
    throw refreshError;
  } finally {
    isRefreshing = false;
  }
};

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

const successHandler = (response) => {
  if (response.config.url.includes(apiConfig.downloadInvoice)) {
    numberOfAjaxCAllPending--;
    return response.data;
  }

  numberOfAjaxCAllPending--;
  return response.data.success ? response.data.data : response.error;
};

const errorHandler = async (error) => {
  // in the case, server is stoped
  if (error.code == "ERR_NETWORK") {
    if (numberOfAjaxCAllPending > 0) {
      numberOfAjaxCAllPending = 0;
      HELPER.toaster.error("Something went wrong, Please try after sometimes.");
    }

    numberOfAjaxCAllPending--;

    return Promise.reject({
      errors: { message: ["Somthing went wrong."] },
      status: 501,
    });
  }

  numberOfAjaxCAllPending--;

  try {
    const retryResponse = await handleUnauthorized(error);
    if (retryResponse !== null) {
      return retryResponse;
    }
  } catch (_refreshError) {
    // Refresh failed and session was cleared; continue with original 401 payload.
  }

  let _obj = {
    errors:
      error?.response && error.response?.data?.error
        ? error.response?.data?.error
        : { message: ["Somthing went wrong."] },
    status:
      error?.response && error.response?.data?.status
        ? error.response?.data?.status
        : 501,
  };

  if ([400, 403].includes(_obj.status)) {
    HELPER.toaster.error(_obj.errors?.message);
  }

  return Promise.reject(_obj);
};

// Prepare Response
instance.interceptors.response.use(successHandler, errorHandler);
excelInstance.interceptors.response.use(successHandler, errorHandler);

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
