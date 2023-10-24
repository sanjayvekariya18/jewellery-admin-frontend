const appConfig = {
  host: process.env.REACT_APP_API_HOST,
  prefix: process.env.REACT_APP_API_PREFIX,
  version: process.env.REACT_APP_API_VERSION,

  dateDisplayFormat: "DD/MM/YYYY",
  dateDisplayEditFormat: "YYYY-MM-DD",
  dateAndTimeDisplayFormat: "DD/MM/YYYY HH:mm A",
  defaultPerPage: 9999999,
  localStorage: {
    token: "jewellery-bearer-token", // for saving bearer token
  },

  persistKey: {
    authReducer: "auth",
  },

  default_pagination_state: {
    page: 0,
    rowsPerPage: 10,
  },
};

export default appConfig;
