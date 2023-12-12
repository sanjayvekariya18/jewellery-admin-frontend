import React, { useState } from 'react'
import Validators from '../../../../../../../components/validations/Validator';
import ThemeDialog from '../../../../../../../components/UI/Dialog/ThemeDialog';
import { Box, Button } from '@mui/material';
import Textinput from '../../../../../../../components/UI/TextInput';
import { apiConfig } from '../../../../../../../config';
import { API } from '../../../../../../../services';

const rules = {
    sku: 'required'
}

export default function AddPinDialog({ onClose, isOpen, onSave }) {
    const [formState, setFormState] = useState({
        sku: "6fb43203-5671-4a88-81e9-698508f7116f"
    });

    const onChange = ({ target: { name, value } }) => {
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (data) => {
        API.post(apiConfig.productBySku, {
            sku: [data?.sku]
        })
            .then((res) => {
                const product = res[0]
                onSave({
                    ...product,
                    product_img: `${apiConfig.publicURL}/productsFiles/${product?.Product?.stockId}/${product?.sku}/main.jpg`
                })
            })
    };

    return (
        <Validators formData={formState} rules={rules}>
            {({ onSubmit, errors }) => (
                <ThemeDialog
                    title="Add Pin"
                    isOpen={isOpen}
                    maxWidth="sm"
                    onClose={onClose}
                    actionBtns={
                        <>
                            <Box>
                                <Button
                                    style={{ marginLeft: "20px" }}
                                    variant="outlined"
                                    color="secondary"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    style={{ marginLeft: "20px" }}
                                    type="button"
                                    variant="contained"
                                    color="success"
                                    onClick={() => onSubmit(handleSubmit)}
                                >
                                    Save
                                </Button>
                            </Box>
                        </>
                    }
                >
                    <Box>
                        <Textinput
                            size="medium"
                            label="Product Sku"
                            value={formState?.sku || ""}
                            onChange={onChange}
                            type="text"
                            name="sku"
                            fullWidth
                            error={errors?.sku}
                            sx={{ mb: 2, mt: 1, width: "100%" }}
                        />
                    </Box>
                </ThemeDialog>
            )}
        </Validators>
    )
}
