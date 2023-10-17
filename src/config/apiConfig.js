import appConfig from "./appConfig";

const apiConfig = {
  baseURL: (
    appConfig.host +
    "/" +
    appConfig.prefix +
    "/" +
    appConfig.version +
    "/"
  ).replace(/([^:]\/)\/+/g, "$1"),

  publicURL: (appConfig.host + "/").replace(/([^:]\/)\/+/g, "$1"),

  // auth apis
  login: "login", // admin login

  // Categories Api
  category: "category",

  //lab
  lab: "lab",

  //shape
  shape: "shape",

  // attributes
  attributes: "attributes",

  //permission
  permission: "permission",

  //productDetailGroup
  productDetailGroup: "productDetailsGroup",

  //productDetails
  productDetails: "productDetails",

  //options
  options: "options",

  //subCategory
  subCategory: "subcategory",

  //category
  category: "category",

  //attributes
  attributes: "attributes",
};

export default apiConfig;
