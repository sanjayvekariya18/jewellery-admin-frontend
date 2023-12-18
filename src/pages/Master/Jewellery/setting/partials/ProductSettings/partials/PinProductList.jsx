import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Divider } from '@mui/material';
import PinDropIcon from '@mui/icons-material/PinDrop';
import CancelIcon from '@mui/icons-material/Cancel';
import { makeStyles } from '@material-ui/core/styles';



export default function PinProductList(props) {
    const {
        products,
        selectedProduct,
        onSelectProduct,
        removeProduct
    } = props

    const handleSelectProduct = (sku) => {
        if (selectedProduct !== sku) {
            onSelectProduct(sku);
        } else {
            console.log('Product is already selected');
        }
    };
    const useStyles = makeStyles((theme) => ({
        redText: {
          color: '#00A300',
          marginTop:"5px"
        },
      }));
    const classes = useStyles();
    return (
        <div className='pin_box'>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {products.map((product) => (
                    <>
                        <ListItem
                            className={selectedProduct === product.sku ? 'active-product' : ''}
                            onClick={() => handleSelectProduct(product.sku)}
                        >
                            <ListItemAvatar>
                                <Avatar  style={{backgroundColor:"red"}}>
                                    <PinDropIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={product?.title} secondary={`$${product?.totalPrice}`}  classes={{ secondary: classes.redText }}/>
                            <CancelIcon style={{ color: "#1976D2" }} onClick={() => {
                                removeProduct(product?.sku)
                            }} />
                        </ListItem>
                        {/* <Divider variant="inset" component="li" /> */}

                    </>
                ))}
            </List>
        </div>
    )
}
