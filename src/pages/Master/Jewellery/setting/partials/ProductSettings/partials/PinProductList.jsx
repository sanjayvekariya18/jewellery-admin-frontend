import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Divider } from '@mui/material';
import PinDropIcon from '@mui/icons-material/PinDrop';
import CancelIcon from '@mui/icons-material/Cancel';



export default function PinProductList(props) {
    const {
        products, 
        selectedProduct, 
        onSelectProduct, 
        removeProduct
    } = props

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {products.map((product) => (
                <>
                    <ListItem className={selectedProduct == product?.sku ? 'active-product' : ''} onClick={() => {
                        onSelectProduct(product?.sku)
                    }}>
                        <ListItemAvatar>
                            <Avatar>
                                <PinDropIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={product?.title} secondary={`$${product?.totalPrice}`} />
                        <CancelIcon onClick={() => {
                            removeProduct(product?.sku)
                        }} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </>
            ))}
        </List>
    )
}
