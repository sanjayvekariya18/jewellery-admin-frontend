import React, { useCallback, useState } from 'react';
import ThemeDialog from '../../../../components/UI/Dialog/ThemeDialog';
import Validators from '../../../../components/validations/Validator';
import Textinput from '../../../../components/UI/TextInput';
import { API, HELPER } from '../../../../services';
import { apiConfig } from '../../../../config';
import { Box, Button } from "@mui/material";
import CommonButton from '../../../../components/UI/CommonButton';


const RefundAmountReturnOrder = ({ open, togglePopup, userData, callBack }) => {
    // initialValues 
    const initialValues = {
        returnProductId: userData,
        refundAmount: "",
    };
    // validator
    const rules = {
        refundAmount: "required",
    };
    const [formState, setFormState] = useState({ ...initialValues });
    const [isLoader, setIsLoader] = useState(false);

    // onChange define
    const onChange = useCallback((e) => {
        setFormState((prevProps) => {
            return {
                ...prevProps,
                [e.target.name]: e.target.value,
            };
        });
    }, []);

    // handleSubmit define
    const handleSubmit = (data) => {
        setIsLoader(true);
        API.post(apiConfig.refundReturnOrder, data)
            .then((res) => {
                HELPER.toaster.success(res);
                togglePopup();
                callBack();
            })
            .catch((e) => {
                HELPER.toaster.error(e.errors.message);
            })
            .finally(() => {
                setIsLoader(false);
            });
    };
    return (
        <Validators formData={formState} rules={rules}>
            {({ onSubmit, errors, resetValidation }) => (
                <ThemeDialog
                    title={"Refund Amount"}
                    isOpen={open}
                    maxWidth="sm"
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
                                         <CommonButton

                              loader={isLoader}
                                style={{ marginLeft: "20px" }}
                                type="submit"
                                variant="contained"
                                color="success"
                                onClick={() => onSubmit(handleSubmit)}
                            >
                                Save
                            </CommonButton>
                        </Box>
                    }
                >
                    <Textinput
                        size="small"
                        type="number"
                        name="refundAmount"
                        label="Refund Amount"
                        placeholder="Enter Refund Amount"
                        value={formState.refundAmount}
                        onChange={onChange}
                        error={errors?.refundAmount}
                        sx={{ mb: 0, mt: 1, width: "100%" }}
                    />
                </ThemeDialog>
            )}
        </Validators>
    );
}

export default RefundAmountReturnOrder;
