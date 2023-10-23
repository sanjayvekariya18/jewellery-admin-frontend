import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import { apiConfig } from "../../../../config";
import UploadButton from "../../../../components/UI/UploadButton";

const initialValues = {
    gemstoneData: "",
};

const GemstoneBulkMasterDetails = ({ open, togglePopup }) => {
    const [formState, setFormState] = useState({ ...initialValues });
    const [errorModel, setErrorModel] = useState(false);
    const [errorState, setErrorState] = useState({});

    const rules = {
        gemstoneData: "required",
    };
    const [isLoader, setIsLoader] = useState(false);

    const handleSubmit = (data) => {
        setIsLoader(true);
        API.post(apiConfig.gemstoneBulk, data, {
            headers: {
                "Content-Type": `multipart/form-data;`,
            },
        })
            .then((res) => {
                HELPER.toaster.success("GemStone Bulk added successfully");
            })
            .catch((error) => {
                HELPER.toaster.error("Please Check your Excel sheet...");
                if (error.errors && error.errors.message) {
                    setErrorState(error.errors.message);
                    setErrorModel(true);
                }
            })
            .finally(() => {
                setIsLoader(false);
            });
    };

    return (
        <Validators formData={formState} rules={rules}>
            {({ onSubmit, errors, resetValidation }) => (
                <ThemeDialog
                    title="Add Gemstone Bulk"
                    isOpen={open}
                    maxWidth="xs"
                    onClose={() => {
                        togglePopup();
                        resetValidation();
                    }}
                    actionBtns={
                        <>
                            <Box>
                                <UploadButton
                                    onChange={(selectedFile) => {
                                        setFormState((prevProps) => {
                                            return {
                                                ...prevProps,
                                                gemstoneData: selectedFile,
                                            };
                                        });
                                    }}
                                />
                                {errors?.gemstoneData && (
                                    <p className="text-error">File field is required</p>
                                )}
                            </Box>
                            <Box>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                        togglePopup();
                                        resetValidation();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    color="primary"
                                    onClick={() => onSubmit(handleSubmit)}
                                >
                                    Save
                                </Button>
                            </Box>

                            <ThemeDialog
                                isOpen={errorModel}
                                onClose={() => setErrorModel(false)}
                                title="Error"
                                maxWidth="sm"
                                actionBtns={
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setErrorModel(false);
                                        }}
                                    >
                                        Okay
                                    </Button>
                                }
                            >
                                <div>
                                    {Object.keys(errorState).length > 0 ? (
                                        Object.keys(errorState).map((errorCode, index) => (
                                            <div key={index}>
                                                <h2>Stock No: {errorCode}</h2>
                                                <ul>
                                                    {errorState[errorCode].map((errorMessageObj, index) => (
                                                        <li key={index}>
                                                            {Object.keys(errorMessageObj)[0]}   : <span>{Object.values(errorMessageObj)[0]}</span>
                                                        </li>

                                                    ))}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No errors to display</p>
                                    )}

                                </div>
                            </ThemeDialog>
                        </>
                    }
                ></ThemeDialog>
            )}
        </Validators>
    );
};

export default GemstoneBulkMasterDetails;
