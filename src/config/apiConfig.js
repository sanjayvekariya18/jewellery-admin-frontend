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
  attributesId: "attributes/:id",

  //permission
  permission: "permission",

  //productDetailGroup
  productDetailGroup: "productDetailsGroup",

  //productDetails
  productDetails: "productDetails",

  //options
  options: "options",
  optionsList: "list/option",

  //optionsAttributes
  optionsAttributes: "options/attribute/:name",

  //subCategory
  subCategory: "subcategory",

  //userPermission
  userPermission: "userPermission",

  //customer
  customer: "customer",
  customerActive: "customer/active/:id",
  diamondDiscount: "diamondDiscount",

  //changePassword
  changePassword: "user/password",

  // gemstone,
  gemstone: "gemstone",
  visibility: "gemstone/visibility/:id", //gemstone visible toggle
  gemstoneBulk: "gemstone/bulk_upload",
  visibility_gemstone: "gemstone/visibility/:id",
  //metalPrice
  metalPrice: "metalprice",

  // diamond
  diamonds: "diamonds",
  visibility: "diamonds/visibility/:id", //gemstone visible toggle
  diamondsBulk: "diamonds/bulk_upload",
};

export default apiConfig;
