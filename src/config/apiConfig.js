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
  categoryId: "category/:id",
  listCategory: "list/category",

  //lab
  lab: "lab",
  labList: "list/lab",

  //shape
  shape: "shape",
  shapeList: "list/shape",

  // attributes
  attributes: "attributes",
  attributesId: "attributes/:id",
  attributesList: "/list/attribute",

  //permission
  permission: "permission",

  //productDetailGroup
  productDetailGroup: "productDetailsGroup",
  listProductDetailGroup: "list/details_group",

  //productDetails
  productDetails: "productDetails",
  productDetailsList: "/list/details",

  //options
  options: "options",
  optionsList: "list/option",

  //blogCategory
  blogCategory: "blog_categories",
  blogCategoryId: "blog_categories/:id",
  listblogCategory: "list/blog_categories",

  //emailTemplate
  emailTemplate: "email_template",
  emailTemplateId: "email_template/:id",

  //blog
  blog: "blog",
  blogId: "blog/:id",

  // faq
  faq: "faq",
  faqId: "faq/:id",

  //optionsAttributes
  optionsAttributes: "options/attribute/:name",

  //subCategory
  subCategory: "subcategory",
  listSubCategory: "list/subcategory",

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
  priceRange: "coloredDiamond/priceRange", //price Range Filter
  caratRange: "coloredDiamond/caratRange", // carat Range Filter
  intensityRange: "coloredDiamond/intensityRange", // intensity Range Filter
  colorRange: "coloredDiamond/colorRange", // color Range Filter

  // Product Details
  product: "product",
  productBulk: "product/bulk",
  findProduct: "product/productVariant/:productId",
  findProductVariant: "product/productVariant/moreDetail/:productVariantId",
  productDownload: "product/template/:id",
  visibility_product: "product/visibility/:id",
  visibility_productVariant: "product/variant/visibility/:id",

  // orders 
  orders: "orders",
  changeOrderStatus: "orders/change-status",
  orderFilterDropDown: "orders/dropdowns",
  cancelOrder: "orders/cancel-order",
  approveCancelOrder: "orders/cancel-order-request/approve",
  findOrder: "orders/:Id",
  findProductDetail: "orders/order-product/:id",

  // return order
  returnOrder: "return-orders",
  changeReturnOrderStatus: "return-orders/change-status",
  refundReturnOrder: "return-orders/refund-amount",


  // add to a featured product
  featureProduct: "featureProduct/:id",
  allFeaturesProduct: "featureProduct",
  updateFeatureProduct: "featureProduct",


  // Our Product Details
  ourProduct: "ourProduct/:id",
  allOurProduct: "ourProduct",
  updateOurProduct: "ourProduct",

  // banner
  banner: "banner",
  bannerUpdate: "banner/:id",

  // Slider Master
  sliderMaster: "slide_master",
  UpdatesliderMaster: "slide_master/:id",
  sliderBanner: "slide_banner/bulk",
  SlideBanner: "slide_banner",

  // Slider
  slider: "slider",
  sliderUpdate: "slider/:id",
};

export default apiConfig;
