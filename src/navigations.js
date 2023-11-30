import { pageRoutes } from "./constants/routesList";

export const navigations = [
  { name: "Dashboard", path: pageRoutes.dashboard, icon: "dashboard" },
  { label: "Inventory", type: "label" },

  {
    name: "GemStone",
    icon: "camera",
    path: pageRoutes.master.gemstone.gemstone,
  },
  { name: "Diamonds", path: pageRoutes.diamond, icon: "diamond" },
  {
    name: "Colored Diamond",
    path: pageRoutes.colorDiamond,
    icon: "star",
  },
  { name: "Product", path: pageRoutes.product, icon: "shopping_cart" },
  // { name: "Jewellery", path: pageRoutes.jewellery, icon: "diversity_2" },
  { name: "Customer", path: pageRoutes.customer, icon: "person" },
  // { name: "Discount", path: pageRoutes.discount, icon: "diamond" },

  { label: "Masters", type: "label" },
  {
    name: "Diamond",
    icon: "diamond",
    children: [
      { name: "Lab", iconText: "LB", path: pageRoutes.master.diamond.lab },
      { name: "Shape", iconText: "SP", path: pageRoutes.master.diamond.shape },
      {
        name: "Discount",
        path: pageRoutes.master.diamond.discount,
        iconText: "DD",
        // icon: "diamond",
      },
    ],
  },
  {
    name: "Jewellery",
    icon: "diversity_2",
    children: [
      {
        name: "Category",
        iconText: "CT",
        path: pageRoutes.master.jewellery.category,
      },
      {
        name: "SubCategory",
        iconText: "SC",
        path: pageRoutes.master.jewellery.subcategory,
      },
      {
        name: "Options",
        iconText: "OP",
        path: pageRoutes.master.jewellery.options,
      },
      {
        name: "Attributes",
        iconText: "AT",
        path: pageRoutes.master.jewellery.attributes,
      },
      {
        name: "Details Group",
        iconText: "DG",
        path: pageRoutes.master.jewellery.detailsGroup,
      },
      {
        name: "Details",
        iconText: "DG",
        path: pageRoutes.master.jewellery.details,
      },
      // {
      //   name: "Blog Category",
      //   iconText: "BC",
      //   path: pageRoutes.master.jewellery.blogCategory,
      // },
      // {
      //   name: "Blog",
      //   iconText: "BM",
      //   path: pageRoutes.master.jewellery.blog,
      // },
      // {
      //   name: "FAQ",
      //   iconText: "FM",
      //   path: pageRoutes.master.jewellery.faq,
      // },
      // {
      //   name: "Email Template",
      //   iconText: "ET",
      //   path: pageRoutes.master.jewellery.emailTemplate,
      // },
      {
        name: "Metal Price",
        iconText: "MP",
        path: pageRoutes.master.jewellery.metal,
      },
    ],
  },


  {
    name: "Orders Management",
    icon: "inventory2",
    children: [
      {
        name: "Order Details",
        iconText: "OD",
        path: pageRoutes.master.orders.orderPage,
      },
      {
        name: "Return Order Details",
        iconText: "ROD",
        path: pageRoutes.master.orders.returnOrder,
      },
      // { name: "User", iconText: "CT", path: pageRoutes.master.user.user },
    ],
  },
  {
    name: "User",
    icon: "account_circle",
    children: [
      // {
      //   name: "Permissions",
      //   iconText: "CT",
      //   path: pageRoutes.master.user.permissions,
      // },
      { name: "User", iconText: "CT", path: pageRoutes.master.user.user },
    ],
  },
  {
    name: "Miscellaneous",
    icon: "chat",
    children: [
      {
        name: "Blog Category",
        iconText: "BC",
        path: pageRoutes.master.blogs.blogCategory,
      },
      {
        name: "Blog",
        iconText: "BM",
        path: pageRoutes.master.blogs.blog,
      },
      {
        name: "FAQ",
        iconText: "FM",
        path: pageRoutes.master.blogs.faq,
      },
      {
        name: "Email Template",
        iconText: "ET",
        path: pageRoutes.master.blogs.emailTemplate,
      },
      {
        name: "Our Products",
        iconText: "OP",
        path: pageRoutes.master.blogs.ourProduct,
      },
      {
        name: "Feature Products",
        iconText: "FP",
        path: pageRoutes.master.blogs.featureProduct,
      },
    ],
  },
  {
    name: "Pages",
    icon: "chat",
    children: [
      {
        name: "Slider",
        iconText: "BC",
        path: pageRoutes.master.pages.slider,
      },
      {
        name: "Banner",
        iconText: "BC",
        path: pageRoutes.master.pages.banner,
      },
      {
        name: "Dynamic Menu",
        iconText: "BC",
        path: pageRoutes.master.pages.dynamicMenu,
      },
      {
        name: "Settings",
        iconText: "ST",
        path: pageRoutes.master.pages.setting,
      }
    ],
  },
];
