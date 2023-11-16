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
  variantProductId: "/product-variant",
  productVariantId: "/product-variant/more-detail",
  findOrder:"/orders",
  dashboard: "/dashboard",
  diamond: "/diamonds",
  colorDiamond: "/color-diamond",
  product: "/product",
  jewellery: "/jewellery",
  customer: "/customer",
  master: {
    diamond: {
      lab: "/master/diamond/lab",
      shape: "/master/diamond/shape",
      discount: "/master/diamond/discount",
    },
    orders: {
      orderPage: "/master/order",
      returnOrder: "/master/orders/returnOrder",

    },
    gemstone: {
      gemstone: "/gemstone",
    },
    jewellery: {
      category: "/master/jewellery/category",
      createCategory: "/master/jewellery/category/create",
      updateCategory: "/master/jewellery/category/update",
      subcategory: "/master/jewellery/subcategory",
      options: "/master/jewellery/options",
      attributes: "/master/jewellery/attributes",
      detailsGroup: "/master/jewellery/details-group",
      details: "/master/jewellery/details",
      metal: "/master/jewellery/metal",
    },
    blogs: {
      blogCategory: "/master/blogs/blog-cateogry",
      blog: "/master/blogs/blog",
      faq: "/master/blogs/faq",
      emailTemplate: "/master/blogs/email-template",
    },
    user: {
      permissions: "/master/user/permissions",
      user: "/master/user/user",
      userPermissions: "/master/user/user_permissions/:id",
    },
  },
};
