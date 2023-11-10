import React from 'react';
import ThemeDialog from '../../../../components/UI/Dialog/ThemeDialog';
import { Box, Button, TableCell, TableContainer, TableHead, TableRow, Paper, Table, TableBody, Typography, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';


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
        '&:nth-of-type(odd)': {
            backgroundColor: '#f9f9f9',
        },
    },
    noUnderline: {
        textDecoration: 'none'
    },
}));

const FindOneOrderDetail = ({ open, togglePopup, userData }) => {
    console.log(userData.orderProducts, "userData");
    const productData = userData.orderProducts
    const classes = useStyles();

    return (
        <ThemeDialog
            title={"Order Details"}
            isOpen={open}
            fullWidth
            maxWidth='lg'
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
                    <Table className={classes.table} aria-label="product orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={`${classes.tableHeader} ${classes.noUnderline}`}>Product</TableCell>
                                <TableCell className={`${classes.tableHeader} ${classes.noUnderline}`}>Price</TableCell>
                                <TableCell className={`${classes.tableHeader} ${classes.noUnderline}`}>Quantity</TableCell>
                                <TableCell className={`${classes.tableHeader} ${classes.noUnderline}`}>Total</TableCell>
                                <TableCell className={`${classes.tableHeader} ${classes.noUnderline}`}>Status</TableCell>
                                <TableCell className={`${classes.tableHeader} ${classes.noUnderline}`}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productData.map((product, index) => (
                                <TableRow key={index} className={classes.tableRow}>
                                    <TableCell className={`${classes.tableHeader} ${classes.noUnderline}`}>{product.title}</TableCell>
                                    <TableCell className={classes.noUnderline}>{product.makingPrice}</TableCell>
                                    <TableCell className={classes.noUnderline}>{product.quantity}</TableCell>
                                    <TableCell className={classes.noUnderline}>{product.totalPrice}</TableCell>
                                    <TableCell className={classes.noUnderline}>{product.orderStatus}</TableCell>
                                    <TableCell className={classes.noUnderline}>{/* Add your action component here */}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <Box>

                            <TableRow>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>Billing Address:</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>{userData.order.customer.billing_addressLine1}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>{userData.order.customer.billing_addressLine2}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>{userData.order.customer.billing_city + "," + userData.order.customer.billing_state}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>{userData.order.customer.billing_country + "," + userData.order.customer.billing_pincode}</TableCell>
                            </TableRow>



                            <TableRow>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>Sub Total:</TableCell>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>₹{userData.order.total}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>Discount:</TableCell>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>- ₹{0}</TableCell>
                            </TableRow>
                            <Divider></Divider>
                            <TableRow>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>Estimate Total*:</TableCell>
                                <TableCell className={`${classes.billing} ${classes.noUnderline}`}>₹{userData.order.payableAmount}</TableCell>
                            </TableRow>


                        </Box>
                    </Table>
                </TableContainer>
            </Box>


        </ThemeDialog>
    );
}

export default FindOneOrderDetail;
