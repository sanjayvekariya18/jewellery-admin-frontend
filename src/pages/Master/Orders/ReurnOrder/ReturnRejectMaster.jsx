import React, { useState, useCallback } from "react";
import Validators from "../../../../components/validations/Validator";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
import { API, HELPER } from '../../../../services';
import { apiConfig } from '../../../../config';
import Textinput from "../../../../components/UI/TextInput";
import CommonButton from "../../../../components/UI/CommonButton";

const ReturnRejectMaster = ({ open, togglePopup, userData, callBack }) => {
    const initialValues = {
        returnOrderProductIds: userData,
        rejectReason: "",
        status: "reject",
    };
    // validator
    const rules = {
        rejectReason: "required",
    };
    const [formState, setFormState] = useState({ ...initialValues });
    const [isLoader, setIsLoader] = useState(false);

    // handle submitting
    const handleSubmit = (data) => {
        setIsLoader(true);
        API.put(apiConfig.changeReturnOrderStatus, data)
            .then((res) => {
                HELPER.toaster.success(res.message);
                togglePopup();
                callBack();
            })
            .catch((e) => {
                HELPER.toaster.error(e.errors.returnOrderProductIds[0]);
            })
            .finally(() => {
                setIsLoader(false);
            });
    };

    // onChange Defined
    const onChange = useCallback((e) => {
        setFormState((prevProps) => {
            return {
                ...prevProps,
                [e.target.name]: e.target.value,
            };
        });
    }, []);
    return (
        <Validators formData={formState} rules={rules}>
            {({ onSubmit, errors, resetValidation }) => (
                <ThemeDialog
                    title={`${formState?.id === "" ? "Return" : "Edit"} Order`}
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
                                style={{ marginLeft: "20px" }}
                                loader={isLoader}
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


                    <div className="text-input-top">
                        <Textinput
                            multiline={true}
                            size="small"
                            label="Order Reject Request"
                            name="rejectReason"
                            type="text"
                            placeholder="Enter Order Reject Request"
                            value={formState.rejectReason}
                            error={errors?.rejectReason}
                            onChange={onChange}
                            sx={{ mb: 0, width: "100%" }}
                        />
                    </div>
                </ThemeDialog>
            )}
        </Validators>
    );
}

export default ReturnRejectMaster;
