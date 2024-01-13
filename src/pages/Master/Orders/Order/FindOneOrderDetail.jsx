import React, { useEffect, useState } from "react";
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
import { downloadFile, isEmpty } from "../../../../services/helper";

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
    // paddingBottom: 10,
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

const FindOneOrderDetail = () => {
  const { Id } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [findProduct, setFindProduct] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});
  const [loading, setLoading] = useState(true);


  // useEffect of a findOrder api
  useEffect(() => {
    setLoading(true);
    API.get(apiConfig.findOrder.replace(":Id", Id))
      .then((res) => {
        setLoading(false);
        setOrderDetail(res);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  // ToggleGemstonePopup open 
  const toggleGemstonePopup = () => {
    if (findProduct) {
      setProductDetail(null); // Reset gemStoneData when closing the modal
    }
    setFindProduct(!findProduct); // Toggle modal visibility
  };
  // Order Product data display variable
  const productData = orderDetail.orderProducts;
  // Order Tracking  data display variable
  const orderTracking = orderDetail.orderTracking;
  // using style variable
  const classes = useStyles();

  // getProductDetail model open
  const getProductDetail = (id) => {
    // API.get(apiConfig.findProductDetail.replace(":id", id)).then((res) => {
    setFindProduct(true);
    setProductDetail(id);
    // });
  };

  // downloadInvoice file 
  const downloadInvoice = () => {
    downloadFile(`${apiConfig.downloadInvoice}/${Id}`, {
      file_name: 'order-invoice.pdf'
    }).then(() => { }).catch(() => { })
  };
  // refund the order
  const isReturned =
    productData &&
    productData.some(
      (product) => product.OrderReturn?.status === "refund"
    );

  // refundAmount of the order
  const refundAmount =
    productData &&
    productData.reduce((accumulator, product) => {
      if (product.OrderReturn?.status === "refund") {
        return accumulator + (product.OrderReturn?.refundAmount || 0);
      }
      return accumulator;
    }, 0);


  const generateProductField = (product, type) => {
    const getOtherDetailsHtml = (otherDetails) => {
      let _details = ''
      const __prepare = (type) => {
        switch (type) {
          case 'neckleces_chain_width':
            return `<div><strong style="margin-left: 10px;">Neckleces chain width:-  </strong><span>${otherDetails?.neckleces_chain_width}</span></div><br />`

          case 'ring_size':
            return `<div><strong style="margin-left: 10px;">Ring size:-  </strong><span>${otherDetails?.ring_size}</span></div><br />`

          default:
            break;
        }
      }

      Object.entries(otherDetails).forEach(([key]) => {
        _details += __prepare(key);
      })

      return _details;
    }

    switch (type) {
      case "type":
        let type = ''

        if ((product.productVariant && product.diamond) || (product.productVariant && product.gemstone) || product.productVariant) {
          type = 'Jewellery'
        } else if (product.diamond) {
          type = 'Diamond'
        } else if (product.gemstone) {
          type = 'Gemstone'
        }

        return type;

      case "title":
        let title = product.productVariant
          ? `<div class="mb-2  product-name-responsive"><b>Product :-</b> ${product.productVariant.title}</div>`
          : "";
        let diamondDetails = "";
        let gemstoneTitle = "";
        let engraving = ""
        let meta = "";

        if (product.productVariant && product.diamond) {
          diamondDetails = `<div class="mb-2"><b>Diamond</b> :- (${product.diamond.carat} Carat ${product.diamond.ShapeMaster
            ? product.diamond.ShapeMaster.shape
            : ""
            } Diamond)</div>`;
        } else if (product.productVariant && product.gemstone) {
          gemstoneTitle = product.gemstone
            ? `<div class="mb-2"><b>Gemstone</b> :- (${product.gemstone.title} Gemstone)</div>`
            : "";
        } else if (product.diamond) {
          diamondDetails = `<div class="mb-2"><b>Diamond</b> :-  ${product.diamond.carat} Carat ${product.diamond.ShapeMaster
            ? product.diamond.ShapeMaster.shape
            : ""
            } Diamond</div>`;
        } else if (product.gemstone) {
          gemstoneTitle = product.gemstone
            ? `<div class="mb-2"><b>Gemstone</b> :- ${product.gemstone.title} Gemstone</div>`
            : "";
        }

        // if (!isEmpty(product?.engraving)) {
        //   engraving += ` <div class="mb-2">
        //     <strong>Engraving Detail</strong> <br /> 
        //     &nbsp; <strong>Font:- </strong>${product?.engraving?.font}  <br />
        //     &nbsp; <strong>Text:- </strong>${product?.engraving?.text}
        //   </div>`
        // }
        if (!isEmpty(product?.engraving)) {
          const font = product?.engraving?.font; // Use Avenir Medium as the default font
          const engravingText = product?.engraving?.text; // Use 'Default Text' if none is specified

          engraving += `<div>
              <strong style="margin-left: -50px;">Engraving Detail</strong> <br /> 
              <strong style="margin-left: -40px;">Text:-  </strong><span style="font-family: ${font === "Lucida Calligraphy W01" ? font : ""};">${engravingText}</span>
          </div>`;
        }

        if (!isEmpty(product?.meta)) {

          meta += ` <div>
					<strong style="margin-left: -140px">Other Details</strong>
					${getOtherDetailsHtml(product?.meta)}
				</div>`;
        }

        return `${title}  ${gemstoneTitle}${diamondDetails}${engraving}${meta}`;

      // case "price":
      //   let priceVariant = product.productVariant
      //     ? `<div>$${product.productVariant.totalPrice}</div>`
      //     : "";
      //   let gemstonePrice = "";
      //   let diamondPrice = "";
      //   let engravingPrice = "";

      //   if (product.productVariant && product.diamond) {
      //     diamondPrice = `<div>($${product.diamond.price || 0})</div>`;
      //   } else if (product.productVariant && product.gemstone) {
      //     gemstonePrice = `<div>($${product.gemstone.price || 0})</div>`;
      //   } else if (product.diamond) {
      //     diamondPrice = `<div>${product.diamond.price || 0}</div>`;
      //   } else if (product.gemstone) {
      //     gemstonePrice = `<div>${product.gemstone.price || 0}</div>`;
      //   }

      //   if (!isEmpty(product?.engraving)) {
      //     engravingPrice += `<div style="margin-top: 8px;">$${+product?.engraving?.price}</div>`
      //   }

      //   return `<div style="line-height: 2; position: absolute; top: 5px;">${priceVariant}${gemstonePrice}${diamondPrice}${engravingPrice}</div>`;
      case "price":
        let total = 0;
        if (product.productVariant) {
          total += +product.productVariant.totalPrice || 0;
        }
        if (product.diamond) {
          total += +product.diamond.price || 0;
        } else if (product.gemstone) {
          total += +product.gemstone.price || 0;
        }
        if (!isEmpty(product?.engraving)) {
          total += +product?.engraving?.price || 0;
        }
        return `<div style="">$${total}</div>`;


      case "total_price":
        let totalPrice = 0;
        if (product.productVariant && product.gemstone) {
          totalPrice = (
            ((product.productVariant.totalPrice || 0) +
              product.gemstone.price) *
            product.quantity
          );
        } else if (product.productVariant && product.diamond) {
          totalPrice = (
            ((product.productVariant.totalPrice || 0) +
              product.diamond.price) *
            product.quantity
          );
        }
        else if (product.productVariant) {
          totalPrice = (product.productVariant.totalPrice || 0) * product.quantity;
        } else if (product.gemstone) {
          totalPrice = product.gemstone.price * product.quantity;
        } else if (product.diamond) {
          totalPrice = product.diamond.price * product.quantity;
        } else {
          totalPrice = 0;
        }

        if (!isEmpty(product?.engraving)) {
          totalPrice += +product?.engraving?.price;
        }

        return `$${totalPrice}`;

      default:
        break;
    }
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
          <Button variant="contained" onClick={downloadInvoice}>
            Download invoice
          </Button>
        </div>
      </Box>
      {loading ? (
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
                  {orderDetail.order?.status ? orderDetail.order.status.charAt(0).toUpperCase() + orderDetail.order.status.slice(1) : ''}
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
                    appConfig.dateAndTimeDisplayFormat
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
                          Type
                        </TableCell>
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
                          className={`${classes.tableHeader} ${classes.noUnderline} thead-second-width-action-35 thead-second-width-action-35-res`}
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
                                style={{ paddingLeft: "20px" }}
                                className={`${classes.noUnderline}  product-th-tag inline-height-1`}
                                dangerouslySetInnerHTML={{ __html: generateProductField(product, "type") }}
                              >
                              </TableCell>
                              <TableCell
                                className={`${classes.noUnderline}  product-th-tag inline-height-1`}
                                dangerouslySetInnerHTML={{ __html: generateProductField(product, "title") }}
                              >
                              </TableCell>

                              <TableCell className={`${classes.noUnderline} inline-height-1 position-relative align-center`} dangerouslySetInnerHTML={{ __html: generateProductField(product, "price") }}>
                              </TableCell>
                              <TableCell className={`${classes.noUnderline} inline-height-1`}>
                                {product.quantity}
                              </TableCell>
                              <TableCell className={`${classes.noUnderline} inline-height-1`}>
                                {orderDetail.order?.status ? orderDetail.order.status.charAt(0).toUpperCase() + orderDetail.order.status.slice(1) : ''}

                              </TableCell>
                              <TableCell className={`${classes.noUnderline} inline-height-1`} dangerouslySetInnerHTML={{ __html: generateProductField(product, "total_price") }}>
                              </TableCell>
                              <TableCell className="main-icon-details-button thead-second-width-action-35">
                                <IconButton
                                  onClick={(e) => getProductDetail(product.id)}
                                >
                                  <Icon color="primary">remove_red_eye</Icon>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* <div
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

                    <Typography></Typography>
                    <Typography
                      className={classes.billing}
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        paddingBottom: "0",
                      }}
                    >
                      ${orderDetail.order?.payableAmount}
                    </Typography>
                  </div>

                  {isReturned && (
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
                          paddingTop: "3px",
                        }}
                      >
                        Refund amount:
                      </Typography>
                      <Typography
                        className={classes.billing}
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          paddingTop: "3px",
                          borderBottom: "1px solid #a3a3a3",
                        }}
                      >
                        - ${refundAmount}
                      </Typography>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "6px",
                      width: "250px",
                      borderBottom: "1px solid #80808063",
                    }}
                  >
                    <Typography
                      className={classes.billing}
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#000000d9",

                      }}
                    >
                      Tax :
                    </Typography>
                    <Typography
                      className={classes.billing}
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        width: "76px"
                      }}
                    >
                      ${orderDetail.order?.tax}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "6px",
                      width: "250px",

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
                      ${isReturned
                        ? orderDetail.order?.payableAmount - refundAmount
                        : orderDetail.order?.payableAmount}
                    </Typography>
                  </div>
                </div> */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div>
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
                        color: "#000000d9",
                        paddingBottom: "0",
                        borderBottom: "1px solid #80808078"
                      }}
                    >
                      Tax :
                    </Typography>
                    <Typography
                      className={classes.billing}
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#000000d9",
                      }}
                    >
                      Estimate Total *:
                    </Typography>

                  </div>
                  <div>
                    <Typography
                      className={classes.billing}
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        paddingBottom: "0",
                      }}
                    >
                      ${orderDetail.order?.payableAmount}
                    </Typography>
                    {isReturned && (
                      <div>
                        <Typography
                          className={classes.billing}
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            paddingTop: "3px",
                            borderBottom: "1px solid #a3a3a3",
                          }}
                        >
                          - ${refundAmount}
                        </Typography>
                      </div>
                    )}
                    <Typography
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        width: "76px",
                        paddingBottom: "0 !important",
                        borderBottom: "1px solid #80808078"
                      }}
                      className={classes.billing}
                    >
                      ${orderDetail.order?.tax}
                    </Typography>
                    <Typography
                      className={classes.billing}
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        paddingTop: "3px",
                      }}
                    >
                      ${isReturned
                        ? orderDetail.order?.payableAmount - refundAmount
                        : orderDetail.order?.payableAmount}
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
                            Status
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
                              <TableCell
                                className={`${classes.noUnderline} product-th-tag `}
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell
                                className={`${classes.noUnderline} product-th-tag`}
                              >
                                {order.status}
                              </TableCell>
                              <TableCell
                                className={`${classes.noUnderline} product-th-tag`}
                              >
                                {/* {moment(order.updatedAt)} */}
                                {moment(order?.updatedAt).format(
                                  appConfig.dateAndTimeDisplayFormat
                                )}
                              </TableCell>
                              <TableCell
                                className={`${classes.noUnderline}  product-th-tag `}
                              >
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

      {/*ProductDetail in model open  */}
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
