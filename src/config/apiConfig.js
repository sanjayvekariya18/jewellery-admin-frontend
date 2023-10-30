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
  findGemstone: "gemstone/:id",
  gemstonePriceRange: "gemstone/priceRange", //gemstonePriceRange
  visibility_gemstone: "gemstone/visibility/:id", //gemstone visible toggle
  gemstoneBulk: "gemstone/bulk_upload",

  //metalPrice
  metalPrice: "metalprice",

  // diamond
  diamonds: "diamonds",
  findDiamond: "diamonds/:id",
  visibility_diamond: "diamonds/visibility/:id", //diamond visible toggle
  diamondsBulk: "diamonds/bulk_upload",
  diamondCaratRange: "diamonds/caratRange", //diamond carat range
  diamondPriceRange: "diamonds/priceRange", //diamond price range
  diamondTableRange: "diamonds/tableRange", //diamond table range
  diamondDepthRange: "diamonds/depthRange", //diamond depth range

  // coloredDiamond
  ColoredBulk: "coloredDiamond/bulk_upload",
  coloredDiamond: "coloredDiamond",
  priceRange: "coloredDiamond/priceRange",  //price Range Filter
  caratRange: "coloredDiamond/caratRange", // carat Range Filter
  intensityRange: "coloredDiamond/intensityRange", // intensity Range Filter
  colorRange: "coloredDiamond/colorRange", // color Range Filter


  // Product Details
  product: "product",
  productBulk: "product/bulk",
  findProduct: "product/productVariant/:productId",
  findProductVariant: "product/productVariant/moreDetail/:productVariantId",
  productDownload: "product/template/:id"
};

export default apiConfig;
