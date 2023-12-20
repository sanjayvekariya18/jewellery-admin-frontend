import React, { useEffect, useState } from "react";
import { API, HELPER } from "../../../../services";
import { apiConfig } from "../../../../config";
import Validators from "../../../../components/validations/Validator";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Textinput from "../../../../components/UI/TextInput";
import { Box, Button } from "@mui/material";
import CommonButton from "../../../../components/UI/CommonButton";


const initialValues = {
    slider_id: "",
    name: ""

}
const SliderMasterDetail = ({ open, togglePopup, callBack, userData }) => {
    const [isLoader, setIsLoader] = useState(false);

    //  -------------formState --------------
    const [formState, setFormState] = useState({
        ...initialValues
    });
    useEffect(() => {
        if (open === true && userData !== null) {
            userData.image_url = HELPER.getImageUrl(userData.image_url);
            userData.thumbnail_image = HELPER.getImageUrl(userData.thumbnail_image);
            setFormState(userData);
        } else {
            setFormState({ ...initialValues });
        }
    }, [open]);
    //  -------------Validation --------------
    const rules = {
        name: "required"
    };

    //  --------------handle onSubmit Slider  --------------
    const handleSubmit = (data) => {
        setIsLoader(true);

        const fd = new FormData();
        for (const field in data) {
            fd.append(field, data[field]);
        }
        const apiUrl =
            data.slider_id === "" ? apiConfig.slider : `${apiConfig.slider}/${data.slider_id}`;

        API[data.slider_id === "" ? "post" : "put"](apiUrl, fd)
            .then(() => {
                HELPER.toaster.success(
                    data.slider_id === "" ? "Record created" : "Record saved"
                );
                togglePopup();
                callBack()
            })
            .catch((e) => HELPER.toaster.error(e.errors.message))
            .finally(() => {
                setIsLoader(false);
                callBack();
            });
    };
    // -------------------onChange---------------------
    const onChange = ({ target: { value, name } }) => {
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <Validators formData={formState} rules={rules}>
                {({ onSubmit, errors, resetValidation }) => (
                    <ThemeDialog
                        title={`${formState?.slider_id === "" ? "Add" : "Edit"} Slider`}
                        isOpen={open}
                        maxWidth='sm'
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
                        <Textinput
                            label={"Slider Name"}
                            value={formState.name}
                            error={errors?.name}
                            name="name"
                            placeholder="Enter Slider Name"
                            onChange={onChange}
                            style={{ width: "100%" }}
                            autoFocus={true} 
                        />

                    </ThemeDialog>

                )}
            </Validators>
        </>
    );
};

export default SliderMasterDetail;
