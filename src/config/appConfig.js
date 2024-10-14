const appConfig = {
  host: process.env.REACT_APP_API_HOST,
  prefix: process.env.REACT_APP_API_PREFIX,
  version: process.env.REACT_APP_API_VERSION,

  dateDisplayFormat: "DD/MM/YYYY",
  dateDisplayEditFormat: "YYYY-MM-DD",
  dateAndTimeDisplayFormat: "MMMM Do YYYY",
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

  D_Color: {
    0: "D",
    1: "E",
    2: "F",
    3: "G",
    4: "H",
    5: "I",
    6: "J",
    7: "K",
    8: "L",
    9: "M",
    10: "N",
    11: "OP",
    12: "QR",
    13: "ST",
    14: "UV",
    15: "WX",
    16: "YZ",
  },
  D_Clarity: {
    0: "FL",
    1: "IF",
    2: "VVS1",
    3: "VVS2",
    4: "VS1",
    5: "VS2",
    6: "SI1",
    7: "SI2",
    8: "I1",
    9: "I2",
    10: "I3",
  },
  D_Cut: {
    0: "EXCELLENT",
    2: "VERY GOOD",
    3: "GOOD",
    4: "FAIR",
    5: "POOR",
  },
  D_Symmetry: {
    0: "EXCELLENT",
    1: "VERY GOOD",
    2: "GOOD",
  },
  D_Polish: {
    0: "EXCELLENT",
    1: "VERY GOOD",
    2: "GOOD",
  },

  D_Girdle: {
    EXTREMELY_THIN: "Extremely thin",
    VERY_THIN: "Very thin",
    THIN_MEDIUM: "Thin or Medium",
    SLIGHTLY_THICK_THICK: "Slightly thick or thick",
    VERY_THICK: "Very thick",
    EXTREMELY_THICK: "Extremely thick",
  },

  D_Culet: {
    NONE: "None",
    VERY_SMALL: "Very Small",
    SMALL: "Small",
    MEDIUM: "Medium",
    SLIGHTLY_LARGE: "Slightly Large",
    LARGE: "Large",
    VERY_LARGE: "Very Large",
    EXTREMELY_LARGE: "Extremely Large",
  },
  D_Fluorescence: {
    0: "NONE",
    1: "FAINT",
    2: "MEDIUM",
    3: "STRONG",
    4: "VERY STRONG",
  },
};

export default appConfig;
