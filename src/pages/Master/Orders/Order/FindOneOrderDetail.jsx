import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import {
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Table,
  TableBody,
  Typography,
  Button,
  IconButton,
  Icon,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import { API } from "../../../../services";
import { useParams } from "react-router-dom";
import { apiConfig } from "../../../../config";
import { Breadcrumb, Container } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import MaxHeightMenu from "../../../../components/MaxHeightMenu";
import ProductDetail from "./ProductDetail";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 1000,
  },
  tableHeader: {
    color: theme.palette.common.black,
    letterSpacing: 2,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  billing: {
    color: theme.palette.common.black,
    letterSpacing: 2,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#f9f9f9",
    },
  },
  noUnderline: {
    textDecoration: "none",
  },
}));

const FindOneOrderDetail = () => {
  const { Id } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [findProduct, setFindProduct] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});
  useEffect(() => {
    API.get(apiConfig.findOrder.replace(":Id", Id))
      .then((res) => {
        setOrderDetail(res)
      })
  }, [])

  const toggleGemstonePopup = () => {
    if (findProduct) {
      setProductDetail(null); // Reset gemStoneData when closing the modal
    }
    setFindProduct(!findProduct); // Toggle modal visibility
  };
  const productData = orderDetail.orderProducts;
  const orderTracking = orderDetail.orderTracking;
  const classes = useStyles();
  const totalSubtotal = productData && productData.reduce((accumulator, product) => {
    const subtotal =
      product.productVariant && product.gemstone
        ? ((product.productVariant.totalPrice || 0) + product.gemstone.price) * product.quantity
        : product.productVariant
          ? (product.productVariant.totalPrice || 0) * product.quantity
          : product.gemstone
            ? product.gemstone.price * product.quantity
            : product.diamond
              ? product.diamond.price * product.quantity
              : 0;

    return accumulator + subtotal;
  }, 0);

  const generatePDF = () => {
    const element = document.getElementById("order-details");
    if (element) {
      html2pdf().from(element).save();
    }
  };

  const getProductDetail = (id) => {
    // API.get(apiConfig.findProductDetail.replace(":id", id)).then((res) => {
    setFindProduct(true);
    setProductDetail(id);
    // });
  };


  return (


    <Container>
      <Box
        className="breadcrumb"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.orders },
            { name: "Order", path: pageRoutes.master.orders.orderPage },
            { name: "Order Detail" },
          ]}
        />
      </Box>
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <Button variant="contained" onClick={generatePDF}>Generate PDF</Button>
      </div>
      <div id="order-details">
        <Box>
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              aria-label="product orders table main-order-details-table"
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    className={`${classes.tableHeader} ${classes.noUnderline}`}
                  >
                    Product
                  </TableCell>
                  <TableCell
                    className={`${classes.tableHeader} ${classes.noUnderline}`}
                    style={{ paddingLeft: "0" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    className={`${classes.tableHeader} ${classes.noUnderline}`}
                    style={{ paddingLeft: "0" }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    className={`${classes.tableHeader} ${classes.noUnderline}`}
                    style={{ paddingLeft: "0" }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    className={`${classes.tableHeader} ${classes.noUnderline}`}
                    style={{ paddingLeft: "0" }}
                  >
                    Total
                  </TableCell>
                  <TableCell
                    className={`${classes.tableHeader} ${classes.noUnderline}`}
                    style={{ paddingLeft: "0" }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {productData && productData.map((product, index) => {
                  return (
                    <TableRow key={index} className={classes.tableRow}>
                      <TableCell className={`${classes.noUnderline}`}>
                        {product.productVariant ? product.productVariant.title : ''}
                        {product.productVariant && product.gemstone ? ` (${product.gemstone.title})` : product.gemstone?.title}
                        {product.productVariant && product.diamond ? ` (${product.diamond.carat} Carat ${product.diamond.ShapeMaster ? product.diamond.ShapeMaster.shape : ''})` : (product.diamond ? ` ${product.diamond.carat} Carat ${product.diamond.ShapeMaster ? product.diamond.ShapeMaster.shape : ''}` : '')}
                        {!product.productVariant && !product.gemstone && !product.diamond ? 'No details available' : ''}
                      </TableCell>

                      <TableCell className={classes.noUnderline}>
                        {`${product.productVariant ? product.productVariant.totalPrice : ''}`}
                        {product.productVariant ? product.gemstone && !product.diamond && `(${product.gemstone.price})` : product.gemstone?.price}
                        {product.productVariant ? !product.gemstone && product.diamond && ` (${product.diamond.price})` : product.diamond?.price}
                      </TableCell>
                      <TableCell className={classes.noUnderline}>
                        {product.quantity}
                      </TableCell>
                      <TableCell className={classes.noUnderline}>
                        {product.orderStatus}
                      </TableCell>
                      <TableCell className={classes.noUnderline}>
                        {product.productVariant && product.gemstone ?
                          ((product.productVariant.totalPrice || 0) + product.gemstone.price) * product.quantity :
                          product.productVariant ?
                            (product.productVariant.totalPrice || 0) * product.quantity :
                            product.gemstone ?
                              product.gemstone.price * product.quantity :
                              product.diamond ?
                                product.diamond.price * product.quantity :
                                ''}
                      </TableCell>
                      <TableCell className={classes.noUnderline}>
                        <IconButton onClick={(e) => getProductDetail(product.id)}>
                          <Icon color="error">remove_red_eye</Icon>
                        </IconButton>
                      </TableCell>

                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              alignItems: "baseline",
              marginTop: "25px",
              marginBottom: "25px",
            }}
          >
            <div className="main-billing-address-div">
              <Typography
                className={classes.billing}
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Billing Address :
              </Typography>
              <Typography className={classes.billing}>
                {orderDetail.order?.customer?.billing_addressLine1}
              </Typography>
              <Typography className={classes.billing}>
                {orderDetail.order?.customer.billing_addressLine2}
              </Typography>
              <Typography className={classes.billing}>
                {orderDetail.order?.customer.billing_city +
                  "," +
                  orderDetail.order?.customer.billing_state}
              </Typography>
              <Typography className={classes.billing}>
                {orderDetail.order?.customer.billing_country +
                  "," +
                  orderDetail.order?.customer.billing_pincode}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
              className="pricing-main-div"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "45%",
                  alignItems: "center",
                }}
              >
                <Typography
                  className={classes.billing}
                  style={{
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "#000000d9",
                  }}
                >
                  Sub Total :
                </Typography>
                <Typography
                  className={classes.billing}
                  style={{
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  ₹{totalSubtotal}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "45%",
                  alignItems: "center",
                }}
              >
                <Typography
                  className={classes.billing}
                  style={{
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "#000000d9",
                  }}
                >
                  Discount :
                </Typography>
                <Typography
                  className={classes.billing}
                  style={{
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  - ₹{0}
                </Typography>
              </div>
              {/* <Divider /> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "45%",
                  alignItems: "center",
                  paddingTop: "6px",
                  borderTop: "1px solid #8080802b",
                }}
              >
                <Typography
                  className={classes.billing}
                  style={{
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "#000000d9",
                  }}
                >
                  Estimate Total *:
                </Typography>
                <Typography
                  className={classes.billing}
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  ₹{orderDetail.order?.payableAmount}
                </Typography>
              </div>
            </div>
          </div>
          {orderTracking && orderTracking.length > 0 ? (
            <Box>
              <Typography variant="h6" className={classes.billing}>
                Order Tracking
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={`${classes.tableHeader} ${classes.noUnderline}`}
                    >
                      Sr No.
                    </TableCell>
                    <TableCell
                      className={`${classes.tableHeader} ${classes.noUnderline}`}
                    >
                      Order Date
                    </TableCell>
                    <TableCell
                      className={`${classes.tableHeader} ${classes.noUnderline}`}
                    >
                      Description
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderTracking && orderTracking.map((order, index) => (
                    <TableRow key={index} className={classes.tableRow}>
                      <TableCell className={`${classes.noUnderline}`}>
                        {index + 1}
                      </TableCell>
                      <TableCell className={classes.noUnderline}>
                        {moment(order.updatedAt).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell className={classes.noUnderline}>
                        {order.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Typography variant="h6" className={classes.billing}>
              No order tracking data available.
            </Typography>
          )}
        </Box>
      </div>
      {
        findProduct &&
        <ProductDetail
          open={findProduct}
          togglePopup={() => {
            toggleGemstonePopup();
          }}
          productDetailData={productDetail}
        />
      }
    </Container>
  );
};

export default FindOneOrderDetail;
