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


  user: "user",
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

  // reset password
  resetPassword: "user/:id/resetPassword",

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
  product: "product", // product details display
  productBulk: "product/bulk", // product bulk
  findProduct: "product/productVariant/:productId", // product variant
  findProductVariant: "product/productVariant/moreDetail/:productVariantId",  // product variant more detail
  productDownload: "product/template/:id", // product download
  visibility_product: "product/visibility/:id", //visibility product
  visibility_productVariant: "product/variant/visibility/:id", // visibility product variant
  productBySku: 'product/by-skus', //product variant by sku

  // orders 
  orders: "orders",
  changeOrderStatus: "orders/change-status", // order status change
  orderFilterDropDown: "orders/dropdowns", //order filter drop down
  cancelOrder: "orders/cancel-order", // cancel order
  approveOrRejectCancelOrder: "orders/cancel-order-request/approve-or-reject", //approve or reject order
  findOrder: "orders/:Id", //find order
  findProductDetail: "orders/order-product/:id", // find product detail
  downloadInvoice: "orders/download-invoice", // download invoice

  // return order
  returnOrder: "return-orders", // return order
  changeReturnOrderStatus: "return-orders/change-status",// change order status
  refundReturnOrder: "return-orders/refund-amount",// refund return order


  // add to a featured product
  featureProduct: "featureProduct/:id", //feature product
  allFeaturesProduct: "featureProduct", //all feature product
  updateFeatureProduct: "featureProduct", //update feature product


  // Our Product Details
  ourProduct: "ourProduct/:id", // our product
  allOurProduct: "ourProduct", // all our product
  // updateOurProduct: "ourProduct",


  // popular wedding
  popularWedding: "popularWedding/:id", // popular wedding
  allPopularWedding: "popularWedding", // all popular weddings


  // gift
  popularGift: "popularGift/:id", // popular gift
  allPopularGift: "popularGift", // all popular gift
  // updatePopularGift: "popularGift",


  // addToEngagement
  popularEngagement: "popularEngagement/:id", // popular Engagement
  allPopularEngagement: "popularEngagement", // all Popular Engagement

  // default value set in product
  productDefault: "product/default/:id", // product default

  // banner
  banner: "banner", //banner
  bannerUpdate: "banner/:id", //banner update

  // Slider Master
  sliderMaster: "slide_master", //slider master
  // UpdatesliderMaster: "slide_master/:id", //
  sliderBanner: "slide_banner/bulk", // slider banner bulk 
  SlideBanner: "slide_banner", // slider banner

  // Slider
  slider: "slider", // slider
  sliderUpdate: "slider/:id", // slider update

  // setting api call
  appSettings: "app-settings", // app settings
  appSettingsEdit: "app-settings/update", // app settings edit
  appSettingsUploadFile: "app-settings/upload-file", // app settings upload file
  saveAppSettingsHomeProduct: "app-settings/home-product", // save app settings

  // dymanic menu
  dynamicMenuList: "page", // dynamic menu list
  visibility_menu: "page/toggle/:id", // visibility menu
  linkUp: "link_up", //link up
  deleteLinkUp: "link_up/delete", // delete link up
  updateLinkUp: "link_up/:id", // update link up


  // notifications
  notifications: "notifications", // notification
  clearAllNotification: "notifications/clear-all", // clear all notification
  readNotification: "notifications/read", // read notification
  unRead: "notifications/unread-notifications", // unRead notification


  //Contact us
  contactUs: "contact-us", // contact us
  contactUsBulk: "contact-us/bulk", // contact us bulk


  // dashboard
  dashboardOrder: "dashboard/totalOrders", // dashboard order
  dashboardCustomer: "dashboard/totalCustomers", // dashboard customer
  dashboardProduct: "dashboard/totalProducts", // dashboard product
  dashboardCategory: "dashboard/totalCategory",// dashboard category

  // setting in tax 
  taxes: "taxes", // taxes 
  listStates: "list/states", // list states 
  listCountry:"list/countries", // list country
  visibility_tax:"taxes/toggle/:id" // visibility tax
};

export default apiConfig;
