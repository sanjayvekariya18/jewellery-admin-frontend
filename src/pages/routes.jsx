import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "../auth/AuthGuard";
import { authRoles } from "../auth/authRoles";
import Loadable from "../components/Loadable";
import MatxLayout from "../components/MatxLayout/MatxLayout";
import { pageRoutes } from "../constants/routesList";

// session pages
const NotFound = Loadable(lazy(() => import("./sessions/NotFound")));
const JwtLogin = Loadable(lazy(() => import("./sessions/Login")));
const JwtRegister = Loadable(lazy(() => import("./sessions/JwtRegister")));
const ForgotPassword = Loadable(
  lazy(() => import("./sessions/ForgotPassword"))
);

// Pages
const DiamondMaster = Loadable(
  lazy(() => import("./Diamond/Diamonds/DiamondMaster"))
);
const Jewellery = Loadable(lazy(() => import("./Jewellery/Jewellery")));
const Customer = Loadable(lazy(() => import("./Customer/Customer")));
const Discount = Loadable(lazy(() => import("./Discount/Discount")));
const LabMaster = Loadable(
  lazy(() => import("./Master/Diamond/Lab/LabMaster"))
);
const ShapeMaster = Loadable(
  lazy(() => import("./Master/Diamond/Shape/ShapeMaster"))
);
const CategoryMaster = Loadable(
  lazy(() => import("./Master/Jewellery/Category/CategoryMaster"))
);
const CategoryMasterDetails = Loadable(
  lazy(() => import("./Master/Jewellery/Category/CategoryMasterDetails"))
);
const EditCategoryMasterDetails = Loadable(
  lazy(() => import("./Master/Jewellery/Category/editCategoryDetails"))
);
const SubcategoryMaster = Loadable(
  lazy(() => import("./Master/Jewellery/Subcategory/SubcategoryMaster"))
);
const OptionsMaster = Loadable(
  lazy(() => import("./Master/Jewellery/Options/OptionsMaster"))
);
const AttributesMaster = Loadable(
  lazy(() => import("./Master/Jewellery/Attributes/AttributesMaster"))
);
const DetailsGroupMaster = Loadable(
  lazy(() => import("./Master/Jewellery/DetailsGroup/DetailsGroupMaster"))
);
const DetailsMaster = Loadable(
  lazy(() => import("./Master/Jewellery/Details/DetailsMaster"))
);
const PermissionsMaster = Loadable(
  lazy(() => import("./Master/User/Permissions/PermissionsMaster"))
);
const UserMaster = Loadable(
  lazy(() => import("./Master/User/User/UserMaster"))
);
const UserPermissionsMaster = Loadable(
  lazy(() => import("./Master/User/User/UserPermissions"))
);
const GemstoneMaster = Loadable(
  lazy(() => import("./Master/Gemstone/Gemstones/GemstoneMaster"))
);
const OrderMaster = Loadable(
  lazy(() => import("./Master/Orders/Order/OrderMaster"))
);
const ReturnOrderMaster = Loadable(
  lazy(() => import("./Master/Orders/ReurnOrder/ReturnOrderMaster"))
);
const BlogCategoryMaster = Loadable(
  lazy(() => import("./Master/Jewellery/BlogCategory/BlogCategoryMaster"))
);
const BlogMaster = Loadable(
  lazy(() => import("./Master/Jewellery/Blog/BlogMaster"))
);
const EmailTemplateMaster = Loadable(
  lazy(() => import("./Master/Jewellery/EmailTemplate/EmailTemplateMaster"))
);
const FaqMaster = Loadable(
  lazy(() => import("./Master/Jewellery/Faq/FaqMaster"))
);
const MetalPriceMaster = Loadable(
  lazy(() => import("./Master/Jewellery/Metal/MetalPriceMaster"))
);
const ColorDiamondMaster = Loadable(
  lazy(() => import("./ColorDiamond/ColorDiamondMaster"))
);
const ProductMaster = Loadable(lazy(() => import("./Product/ProductMaster")));
const FindProductVariantMoreDetail = Loadable(
  lazy(() => import("./Product/FindProductVariantMoreDetail"))
);
const FindProductVariant = Loadable(
  lazy(() => import("./Product/FindProductVariant"))
);

// echart page
// const AppEchart = Loadable(lazy(() => import('./charts/echarts/AppEchart')));

// dashboard page
const Analytics = Loadable(lazy(() => import("./dashboard/Analytics")));

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      //   ...materialRoutes,
      // dashboard route
      {
        path: pageRoutes.dashboard,
        element: <Analytics />,
        auth: authRoles.admin,
      },

      { path: pageRoutes.product, element: <ProductMaster /> },
      {
        path: `${pageRoutes.variantProductId}/:productId`,
        element: <FindProductVariant />,
      },
      {
        path: `${pageRoutes.productVariantId}/:productVariantId`,
        element: <FindProductVariantMoreDetail />,
      },
      { path: pageRoutes.diamond, element: <DiamondMaster /> },
      { path: pageRoutes.colorDiamond, element: <ColorDiamondMaster /> },
      { path: pageRoutes.jewellery, element: <Jewellery /> },
      { path: pageRoutes.customer, element: <Customer /> },
      { path: pageRoutes.master.diamond.discount, element: <Discount /> },
      { path: pageRoutes.master.diamond.lab, element: <LabMaster /> },
      {
        path: pageRoutes.master.gemstone.gemstone,
        element: <GemstoneMaster />,
      },
      { path: pageRoutes.master.diamond.shape, element: <ShapeMaster /> },
      {
        path: pageRoutes.master.jewellery.category,
        element: <CategoryMaster />,
      },
      {
        path: pageRoutes.master.jewellery.createCategory,
        element: <CategoryMasterDetails isCreateMode={true} />,
      },
      {
        path: `${pageRoutes.master.jewellery.updateCategory}/:id`,
        element: <EditCategoryMasterDetails />,
      },
      // {
      //   path: `${pageRoutes.master.jewellery.updateCategory}/:id?`,
      //   element: <CategoryMasterDetails />,
      // },
      {
        path: pageRoutes.master.jewellery.subcategory,
        element: <SubcategoryMaster />,
      },
      { path: pageRoutes.master.jewellery.options, element: <OptionsMaster /> },
      {
        path: pageRoutes.master.jewellery.attributes,
        element: <AttributesMaster />,
      },
      {
        path: pageRoutes.master.jewellery.detailsGroup,
        element: <DetailsGroupMaster />,
      },
      {
        path: pageRoutes.master.blogs.blogCategory,
        element: <BlogCategoryMaster />,
      },

      {
        path: pageRoutes.master.blogs.blog,
        element: <BlogMaster />,
      },
      {
        path: pageRoutes.master.blogs.emailTemplate,
        element: <EmailTemplateMaster />,
      },
      {
        path: pageRoutes.master.blogs.faq,
        element: <FaqMaster />,
      },
      { path: pageRoutes.master.jewellery.details, element: <DetailsMaster /> },
      {
        path: pageRoutes.master.user.permissions,
        element: <PermissionsMaster />,
      },
      { path: pageRoutes.master.user.user, element: <UserMaster /> },
      {
        path: pageRoutes.master.user.userPermissions,
        element: <UserPermissionsMaster />,
      },
      {
        path: pageRoutes.master.orders.orderPage,
        element: <OrderMaster />,
      },
      {
        path: pageRoutes.master.orders.returnOrder,
        element: <ReturnOrderMaster />,
      },
      {
        path: pageRoutes.master.jewellery.metal,
        element: <MetalPriceMaster />,
      },
    ],
  },

  // session pages route
  { path: pageRoutes.general.error, element: <NotFound /> },
  { path: pageRoutes.general.login, element: <JwtLogin /> },
  { path: pageRoutes.general.signup, element: <JwtRegister /> },
  { path: pageRoutes.general.forgotPassword, element: <ForgotPassword /> },

  { path: "/", element: <Navigate to={pageRoutes.dashboard} /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
