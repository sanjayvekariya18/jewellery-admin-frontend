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
  labList: "list/lab",

  //shape
  shape: "shape",
  shapeList: "list/shape",

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
  visibility_gemstone: "gemstone/visibility/:id", //gemstone visible toggle
  gemstoneBulk: "gemstone/bulk_upload",
  //metalPrice
  metalPrice: "metalprice",

  // diamond
  diamonds: "diamonds",
  visibility_diamond: "diamonds/visibility/:id", //diamond visible toggle
  diamondsBulk: "diamonds/bulk_upload",



};

export default apiConfig;
