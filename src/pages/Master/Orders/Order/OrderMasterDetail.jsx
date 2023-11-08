import React, { useState, useCallback } from 'react';
import Validators from '../../../../components/validations/Validator';
import ThemeDialog from '../../../../components/UI/Dialog/ThemeDialog';
import { Box, Button } from "@mui/material";
import { API, HELPER } from '../../../../services';
import { apiConfig } from '../../../../config';
import Textinput from '../../../../components/UI/TextInput';
import Textarea from '../../../../components/UI/Textarea';

// ----------initialValues----------------------------------------------------
const initialValues = {
    id: "",
    orderId: "",
    cancelReason: "",
    cancelAmount: "",
};


const OrderMasterDetail = ({ open, togglePopup, userData }) => {
    const [formState, setFormState] = useState({ ...initialValues });


    const onChange = useCallback((e) => {
        setFormState((prevProps) => {
            return {
                ...prevProps,
                [e.target.name]: e.target.value,
            };
        });
    }, []);
    const handleSubmit = (data) => {
        const apiUrl =
            data.id === "" ? apiConfig.cancelOrder : `${apiConfig.cancelOrder}/${data.id}`;

        API[data.id === "" ? "post" : "put"](apiUrl, data)
            .then(() => {
                HELPER.toaster.success(
                    data.id === "" ? "Record created" : "Record saved"
                );
                togglePopup();
            })
            .catch((err) => {
                if (
                    err.status === 400 ||
                    err.status === 401 ||
                    err.status === 409 ||
                    err.status === 403
                ) {
                    HELPER.toaster.error(err.errors.message);
                } else if (err.status === 422) {
                    if (err.errors.carat && err.errors.carat.length > 0) {
                        HELPER.toaster.error(err.errors.carat[0]);
                    } else {
                        HELPER.toaster.error("An error occurred with the carat field.");
                    }
                } else {
                    console.error(err);
                }
            });
    };
    return (
        <Validators formData={formState}>
            {({ onSubmit, errors, resetValidation }) => (
                <ThemeDialog
                    title={`${formState?.id === "" ? "Order" : "Edit"} Cancel`}
                    isOpen={open}
                    onClose={() => {
                        togglePopup();
                        resetValidation();
                    }}
                    actionBtns={
                        <Box>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    togglePopup();
                                    resetValidation();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                style={{ marginLeft: "20px" }}
                                type="submit"
                                variant="contained"
                                color="success"
                                onClick={() => onSubmit(handleSubmit)}
                            >
                                Save
                            </Button>
                        </Box>
                    }
                >
                    <Textinput
                        size="small"
                        type="number"
                        name="OrderId"
                        label="Order Number"
                        placeholder="Enter Order Number"
                        value={formState.orderId}
                        onChange={onChange}
                        error={errors?.orderId}
                        sx={{ mb: 0, mt: 1, width: "100%" }}
                    />
                    <Textarea
                        size="small"
                        name="cancel reason"
                        type="text"
                        maxLength={255}
                        minRows={3}
                        maxRows={3}
                        placeholder="Enter cancel reason"
                        value={formState.cancelReason}
                        onChange={onChange}
                    />
                     <Textinput
                        size="small"
                        type="number"
                        name="OrderId"
                        label="Cancel Amount"
                        placeholder="Enter Cancel Amount"
                        value={formState.cancelAmount}
                        onChange={onChange}
                        error={errors?.cancelAmount}
                        sx={{ mb: 0, mt: 1, width: "100%" }}
                    />

                </ThemeDialog>
            )}
        </Validators>
    );
}

export default OrderMasterDetail;
