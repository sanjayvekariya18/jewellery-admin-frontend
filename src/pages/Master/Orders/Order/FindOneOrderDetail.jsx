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
import { apiConfig, appConfig } from "../../../../config";
import { Breadcrumb, Container } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import ProductDetail from "./ProductDetail";

const useStyles = makeStyles((theme) => ({
  table: {
    tableLayout: "fixed",
    width: "100%",
    textDecoration: "none",
    boxShadow: "none",
    border: "1px solid #8080801c",
  },
  productCell: {
    width: "55%",
    background: "white",
  },
  priceCell: {
    width: "10%",
    background: "white",
  },
  quantityCell: {
    width: "10%",
    background: "white",
  },
  statusCell: {
    width: "10%",
    background: "white",
  },
  totalCell: {
    width: "10%",
    background: "white",
  },
  actionCell: {
    width: "10%",
    background: "white",
  },
  tableHeader: {
    color: theme.palette.common.black,
    letterSpacing: 2,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    // background: "#0505051a",
    borderBottom: "1px solid #8080804f",
    borderLeft: "1px solid white",
    borderRight: "1px solid white",
    background: "white",
  },

  billing: {
    color: theme.palette.common.black,
    letterSpacing: 2,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  tableRow: {
    backgroundColor: "#ffffff",
    border: "1px solid #ffffff",
  },

  noUnderline: {
    textDecoration: "none",
    outline: "none",
  },
}));
// const useStyles = makeStyles((theme) => ({
//   table: {
//     tableLayout: "fixed",
//     width: "100%",
//   },
//   tableRow: {
//     backgroundColor: theme.palette.background.default,
//   },
//   productCell: {
//     width: "25%",
//   },
//   priceCell: {
//     width: "15%",
//   },
//   quantityCell: {
//     width: "15%",
//   },
//   statusCell: {
//     width: "15%",
//   },
//   totalCell: {
//     width: "15%",
//   },
// }));

const FindOneOrderDetail = () => {
  const { Id } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [findProduct, setFindProduct] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(apiConfig.findOrder.replace(":Id", Id)).then((res) => {
      setLoading(false);
      setOrderDetail(res);
    })
      .catch((e) => {
        setLoading(false)
      })

  }, []);

  const toggleGemstonePopup = () => {
    if (findProduct) {
      setProductDetail(null); // Reset gemStoneData when closing the modal
    }
    setFindProduct(!findProduct); // Toggle modal visibility
  };
  const productData = orderDetail.orderProducts;
  const orderTracking = orderDetail.orderTracking;
  const classes = useStyles();
  const totalSubtotal =
    productData &&
    productData.reduce((accumulator, product) => {
      const subtotal =
        product.productVariant && product.gemstone
          ? ((product.productVariant.totalPrice || 0) +
            product.gemstone.price) *
          product.quantity
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
      // Clone the original element
      const clone = element.cloneNode(true);

      // Exclude elements with the specified class in the clone
      const elementsToExclude = clone.querySelectorAll(
        ".thead-second-width-action-35"
      );
      elementsToExclude.forEach((el) => el.remove());

      // Generate and save the PDF from the clone
      html2pdf().from(clone).save();
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
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.orders },
            { name: "Order", path: pageRoutes.master.orders.orderPage },
            { name: "Order Detail" },
          ]}
        />
        <div>
          <Button variant="contained" onClick={generatePDF}>
            Generate PDF
          </Button>
        </div>
      </Box>
      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto",
          alignItems: "baseline",
          marginBottom: "10px",
          paddingBottom: "10px",
          borderBottom: " 1px solid #8080802b",
        }}
      >
        <div className="main-billing-address-div">
          <Typography
            className={classes.billing}
            style={{
              fontSize: "15px",
              fontWeight: "500",
              paddingBottom: "5px",
            }}
          >
            Order Number
          </Typography>
          <Typography
            className={classes.billing}
            style={{ paddingBottom: "0px", paddingTop: "0px" }}
          >
            # {orderDetail.order?.orderNo}
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
              alignItems: "center",
            }}
          >
            <Typography
              className={classes.billing}
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#000000d9",
                paddingBottom: "0",
              }}
            >
              Order Status :
            </Typography>
            <Typography
              className={classes.billing}
              style={{
                fontSize: "14px",
                fontWeight: "400",
                paddingBottom: "0",
              }}
            >
              {orderDetail.order?.status}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              className={classes.billing}
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#000000d9",
              }}
            >
              Order Date :
            </Typography>
            <Typography
              className={classes.billing}
              style={{
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              {moment(orderDetail.order?.updatedAt).format(
                appConfig.dateDisplayFormat
              )}
            </Typography>
          </div>
        </div>
      </div> */}
      {
        loading ? (
          <div style={{ margin: "40px  auto", textAlign: "center" }}>
            <img
              src="../../../../../../assets/loading.gif"
              alt=""
              srcSet=""
              height={28}
              width={28}
            />
          </div>
        ) : (
          <>
            <div
              id="order-details"
              style={{
                margin: "20px",
                padding: "20px",
                background: "#00060c03",
                border: "1px solid #00060c0f",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto",
                  alignItems: "baseline",
                  // paddingTop: "10px",
                  // paddingBottom: "10px",
                  // borderTop: " 1px solid #8080802b",
                  // borderBottom: " 1px solid #8080802b",
                  marginBottom: "25px",
                }}
              >
                <div className="main-billing-address-div">
                  <Typography
                    className={classes.billing}
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      paddingBottom: "0",
                    }}
                  >
                    Bill From
                  </Typography>

                  <Typography
                    className={classes.billing}
                    style={{ paddingBottom: "0px", color: "#000000de" }}
                  >
                    <span
                      style={{
                        color: "#000000",
                      }}
                    >
                      Name :
                    </span>{" "}
                    {` `}
                    {orderDetail.order?.customer?.fullName}
                  </Typography>
                  <Typography
                    className={classes.billing}
                    style={{
                      paddingBottom: "0px",
                      paddingTop: "6px",
                      color: "#000000de",
                    }}
                  >
                    <span
                      style={{
                        color: "#000000",
                      }}
                    >
                      Email :
                    </span>
                    {` `}

                    {orderDetail.order?.customer?.email}
                  </Typography>
                  <Typography
                    style={{
                      paddingBottom: "0px",
                      paddingTop: "6px",
                      color: "#000000",
                    }}
                    className={classes.billing}
                  >
                    <span
                      style={{
                        color: "#000000",
                      }}
                    >
                      {" "}
                      Address :{" "}
                    </span>
                    {orderDetail.order?.customer?.billing_addressLine1}
                    {` `}
                    {orderDetail.order?.customer.billing_addressLine2}
                  </Typography>
                  <Typography
                    className={classes.billing}
                    style={{
                      paddingBottom: "0px",
                      paddingTop: "5px",
                      color: "#000000",
                    }}
                  >
                    {orderDetail.order?.customer.billing_city +
                      "," +
                      orderDetail.order?.customer.billing_state +
                      "," +
                      orderDetail.order?.customer.billing_country +
                      "," +
                      orderDetail.order?.customer.billing_pincode}
                  </Typography>

                  <Typography
                    className={classes.billing}
                    style={{
                      paddingBottom: "0px",
                      paddingTop: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <span
                      style={{
                        color: "#000000",
                      }}
                    >
                      {" "}
                      Phone Number :
                    </span>{" "}
                    {orderDetail.order?.customer.telephone}
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
                  <Typography
                    className={classes.billing}
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      paddingBottom: "5px",
                    }}
                  >
                    Order Info
                  </Typography>

                  <Typography
                    className={classes.billing}
                    style={{
                      paddingBottom: "0px",
                      paddingTop: "6px",
                      color: "#000000de",
                    }}
                  >
                    <span
                      style={{
                        color: "#000000",
                      }}
                    >
                      Order Number :
                    </span>
                    {` `}

                    {orderDetail.order?.orderNo}
                  </Typography>
                  <Typography
                    className={classes.billing}
                    style={{
                      paddingBottom: "0px",
                      paddingTop: "6px",
                      color: "#000000de",
                    }}
                  >
                    <span
                      style={{
                        color: "#000000",
                      }}
                    >
                      Order Status :
                    </span>
                    {` `}

                    {orderDetail.order?.status}
                  </Typography>

                  <Typography
                    className={classes.billing}
                    style={{
                      paddingBottom: "0px",
                      paddingTop: "6px",
                      color: "#000000de",
                    }}
                  >
                    <span
                      style={{
                        color: "#000000",
                      }}
                    >
                      Order Date :
                    </span>
                    {` `}

                    {moment(orderDetail.order?.updatedAt).format(
                      appConfig.dateDisplayFormat
                    )}
                  </Typography>
                </div>
              </div>
              <div>
                <Box>
                  <TableContainer component={Paper}>
                    <Table
                      className={classes.table}
                      aria-label="product orders table main-order-details-table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              paddingLeft: "20px",
                              paddingTop: "11px",
                              paddingBottom: "11px",
                            }}
                            className={`${classes.tableHeader} ${classes.noUnderline} common-width-apply-th`}
                          >
                            Product
                          </TableCell>
                          <TableCell
                            className={`${classes.tableHeader} ${classes.noUnderline} thead-second-width-action`}
                            style={{
                              paddingLeft: "0",
                              paddingTop: "11px",
                              paddingBottom: "11px",
                            }}
                          >
                            Price
                          </TableCell>
                          <TableCell
                            className={`${classes.tableHeader} ${classes.noUnderline}  thead-second-width-action`}
                            style={{
                              paddingLeft: "0",
                              paddingTop: "11px",
                              paddingBottom: "11px",
                            }}
                          >
                            Quantity
                          </TableCell>
                          <TableCell
                            className={`${classes.tableHeader} ${classes.noUnderline}  thead-second-width-action`}
                            style={{
                              paddingLeft: "0",
                              paddingTop: "11px",
                              paddingBottom: "11px",
                            }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            className={`${classes.tableHeader} ${classes.noUnderline} thead-second-width-action`}
                            style={{
                              paddingLeft: "0",
                              paddingTop: "11px",
                              paddingBottom: "11px",
                            }}
                          >
                            Total
                          </TableCell>
                          <TableCell
                            className={`${classes.tableHeader} ${classes.noUnderline} thead-second-width-action-35`}
                            style={{
                              paddingLeft: "0",
                              paddingTop: "11px",
                              paddingBottom: "11px",
                            }}
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productData &&
                          productData.map((product, index) => {
                            return (
                              <TableRow key={index} className={classes.tableRow}>
                                <TableCell
                                  className={`${classes.noUnderline}  product-th-tag`}
                                >
                                  {product.productVariant
                                    ? product.productVariant.title
                                    : ""}
                                  {product.productVariant && product.gemstone
                                    ? ` (${product.gemstone.title})`
                                    : product.gemstone?.title}
                                  {product.productVariant && product.diamond
                                    ? ` (${product.diamond.carat} Carat ${product.diamond.ShapeMaster
                                      ? product.diamond.ShapeMaster.shape
                                      : ""
                                    })`
                                    : product.diamond
                                      ? ` ${product.diamond.carat} Carat ${product.diamond.ShapeMaster
                                        ? product.diamond.ShapeMaster.shape
                                        : ""
                                      }`
                                      : ""}
                                  {!product.productVariant &&
                                    !product.gemstone &&
                                    !product.diamond
                                    ? "No details available"
                                    : ""}
                                </TableCell>

                                <TableCell className={classes.noUnderline}>
                                  {`${product.productVariant
                                    ? product.productVariant.totalPrice
                                    : ""
                                    }`}
                                  {product.productVariant
                                    ? product.gemstone &&
                                    !product.diamond &&
                                    `(${product.gemstone.price})`
                                    : product.gemstone?.price}
                                  {product.productVariant
                                    ? !product.gemstone &&
                                    product.diamond &&
                                    ` (${product.diamond.price})`
                                    : product.diamond?.price}
                                </TableCell>
                                <TableCell className={classes.noUnderline}>
                                  {product.quantity}
                                </TableCell>
                                <TableCell className={classes.noUnderline}>
                                  {product.orderStatus}
                                </TableCell>
                                <TableCell className={classes.noUnderline}>
                                  {product.productVariant && product.gemstone
                                    ? ((product.productVariant.totalPrice || 0) +
                                      product.gemstone.price) *
                                    product.quantity
                                    : product.productVariant
                                      ? (product.productVariant.totalPrice || 0) *
                                      product.quantity
                                      : product.gemstone
                                        ? product.gemstone.price * product.quantity
                                        : product.diamond
                                          ? product.diamond.price * product.quantity
                                          : ""}
                                </TableCell>
                                <TableCell className="main-icon-details-button thead-second-width-action-35">
                                  <IconButton
                                    onClick={(e) => getProductDetail(product.id)}
                                  >
                                    <Icon color="error">remove_red_eye</Icon>
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      paddingTop: "15px",
                      marginRight: "5px",
                    }}
                    className="pricing-main-div"
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "250px",
                      }}
                    >
                      <Typography
                        className={classes.billing}
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#000000d9",
                          paddingBottom: "0",
                        }}
                      >
                        Sub Total :
                      </Typography>
                      <Typography
                        className={classes.billing}
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          paddingBottom: "0",
                        }}
                      >
                        ${totalSubtotal}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "0",
                        width: "250px",
                      }}
                    >
                      <Typography
                        className={classes.billing}
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#000000d9",
                          paddingBottom: "10px",
                        }}
                      >
                        Discount :
                      </Typography>
                      <Typography
                        className={classes.billing}
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          paddingBottom: "10px",
                        }}
                      >
                        - ${0}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "6px",
                        width: "250px",
                        borderTop: "1px solid #8080802b",
                      }}
                    >
                      <Typography
                        className={classes.billing}
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#000000d9",
                          paddingTop: "3px",
                        }}
                      >
                        Estimate Total *:
                      </Typography>
                      <Typography
                        className={classes.billing}
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          paddingTop: "3px",
                        }}
                      >
                        ${orderDetail.order?.payableAmount}
                      </Typography>
                    </div>
                  </div>

                  {orderTracking && orderTracking.length > 0 ? (
                    <Box>
                      <Typography
                        variant="h5"
                        className={classes.billing}
                        style={{
                          fontSize: "17px",
                          fontWeight: "500",
                          marginBottom: "10px",
                        }}
                      >
                        Order Tracking
                      </Typography>
                      <Table
                        className={classes.table}
                        aria-label="product orders table main-order-details-table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell
                              style={{
                                paddingLeft: "20px",
                                paddingTop: "11px",
                                paddingBottom: "11px",
                              }}
                              className={`${classes.tableHeader} ${classes.noUnderline} common-width-apply-th`}
                            >
                              Sr No.
                            </TableCell>
                            <TableCell
                              style={{
                                paddingLeft: "20px",
                                paddingTop: "11px",
                                paddingBottom: "11px",
                              }}
                              className={`${classes.tableHeader} ${classes.noUnderline} common-width-apply-th`}
                            >
                              Order Date
                            </TableCell>
                            <TableCell
                              style={{
                                paddingLeft: "20px",
                                paddingTop: "11px",
                                paddingBottom: "11px",
                              }}
                              className={`${classes.tableHeader} ${classes.noUnderline} common-width-apply-th`}
                            >
                              Description
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderTracking &&
                            orderTracking.map((order, index) => (
                              <TableRow key={index} className={classes.tableRow}>
                                <TableCell className={`${classes.noUnderline}  `}>
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
                    <>
                      <></>
                      {/* <Typography
                  variant="h6"
                  className={classes.billing}
                  style={{
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  No order tracking data available.
                </Typography> */}
                    </>
                  )}
                </Box>
              </div>
            </div>
          </>
        )
      }

      {
        findProduct && (
          <ProductDetail
            open={findProduct}
            togglePopup={() => {
              toggleGemstonePopup();
            }}
            productDetailData={productDetail}
          />
        )
      }
    </Container >
  );
};

export default FindOneOrderDetail;
