import React from "react";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import {
  Box,
  Button,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Table,
  TableBody,
  Typography,
  Divider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";

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

const FindOneOrderDetail = ({ open, togglePopup, userData }) => {
  console.log(userData.orderProducts, "userData");
  const productData = userData.orderProducts;
  const orderTracking = userData.orderTracking;
  const classes = useStyles();
  const totalSubtotal = productData.reduce((accumulator, product) => {
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

  return (
    <ThemeDialog
      title="Order Details"
      isOpen={open}
      fullWidth
      maxWidth="lg"
      onClose={() => {
        togglePopup();
      }}
      actionBtns={
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              togglePopup();
            }}
          >
            Close
          </Button>
        </Box>
      }
    >
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

              </TableRow>
            </TableHead>
            <TableBody>

              {productData.map((product, index) => {
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
              {userData.order.customer.billing_addressLine1}
            </Typography>
            <Typography className={classes.billing}>
              {userData.order.customer.billing_addressLine2}
            </Typography>
            <Typography className={classes.billing}>
              {userData.order.customer.billing_city +
                "," +
                userData.order.customer.billing_state}
            </Typography>
            <Typography className={classes.billing}>
              {userData.order.customer.billing_country +
                "," +
                userData.order.customer.billing_pincode}
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
                ₹{userData.order.payableAmount}
              </Typography>
            </div>
          </div>
        </div>
        {orderTracking.length > 0 ? (
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
                {orderTracking.map((order, index) => (
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
    </ThemeDialog>
  );
};

export default FindOneOrderDetail;
