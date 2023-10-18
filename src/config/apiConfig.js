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

  //userPermission
  userPermission: "userPermission",

  customer: "customer",
  customerActive: "customer/active/:id",
  diamondDiscount: "diamondDiscount",
};


export default apiConfig;
