export const apiEndPoint = {
  login: "login",
  lab: "lab",
  shape: "shape",
  productDetailsGroup: "productDetailsGroup",
  productDetails: "productDetails",
  category: "category",
  subcategory: "subcategory",
  options: "options",
  attributes: "attributes",
  user: "user",
  userPermission: "userPermission",
};

export const pageRoutes = {
  general: {
    login: "signin",
    signup: "signup",
    forgotPassword: "forgot_password",
    error: "404",
  },
  variantProductId:"/productVariant",
  productVariantId:"/productVariant/moreDetail",
  dashboard: "/dashboard/default",
  diamond: "/diamonds/diamonds",
  colorDiamond:"/colorDiamond",
  product:"/product",
  jewellery: "/jewellery",
  customer: "/customer",
  master: {
    diamond: {
      lab: "/master/diamond/lab",
      shape: "/master/diamond/shape",
      discount: "/master/diamond/discount",
    },
    gemstone: {
      gemstone: "/master/gemstone/gemstones",
    },
    jewellery: {
      category: "/master/jewellery/category",
      subcategory: "/master/jewellery/subcategory",
      options: "/master/jewellery/options",
      attributes: "/master/jewellery/attributes",
      detailsGroup: "/master/jewellery/details_group",
      details: "/master/jewellery/details",
      metal: "/master/jewellery/metal",
    },
    user: {
      permissions: "/master/user/permissions",
      user: "/master/user/user",
      userPermissions: "/master/user/user_permissions/:id",
    },
  },
};
