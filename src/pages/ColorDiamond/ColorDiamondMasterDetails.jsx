import React, { useCallback, useEffect, useState } from 'react';
import Validators from '../../components/validations/Validator';
import ThemeDialog from '../../components/UI/Dialog/ThemeDialog';
import { Box, Button } from '@mui/material';
import Textinput from '../../components/UI/TextInput';
import { API, HELPER } from '../../services';
import { apiConfig } from '../../config';
import ReactSelect from '../../components/UI/ReactSelect';

// ----------initialValues----------------------------------------------------
const initialValues = {
    id: "",
    stockId: "",
    title: "",
    description: "",
    origin: "",
    carat: "",
    shape: "",
    color: "",
    colorName: "",
    intensity: "",
    clarity: "",
    mLength: "",
    mWidth: "",
    mDepth: "",
    price: "",
};

const ColorDiamondMasterDetails = ({
    open,
    togglePopup,
    userData
}) => {
    const [formState, setFormState] = useState({ ...initialValues });
    const [shapMaster, setShapMaster] = useState([]);


    const rules = {
        stockId: "required",
        origin: "required",
        carat: "required",
        shape: "required",
        color: "required",
        price: "required",
    };

    const onChange = useCallback((e) => {
        setFormState((prevProps) => {
            return {
                ...prevProps,
                [e.target.name]: e.target.value,
            };
        });
    }, []);

    // -------- handleSubmit-------------
    const handleSubmit = (data) => {
        let formateFields = ['carat', 'mDepth', 'mLength', 'mWidth'];
        let _data = { ...data }
        formateFields.forEach(field => {
            _data[field] = parseFloat(_data[field]);
        });
        const apiUrl =
            data.id === "" ? apiConfig.coloredDiamond : `${apiConfig.coloredDiamond}/${data.id}`;

        API[data.id === "" ? "post" : "put"](apiUrl, _data)
            .then(() => {
                HELPER.toaster.success(
                    data.id === "" ? "Record created" : "Record saved"
                );
                togglePopup();
            })
            .catch((e) => HELPER.toaster.error(e.errors.message));
    };

    // ------------------Get Shap API --------------------------------

    useEffect(() => {
        API.get(apiConfig.shapeList, { is_public_url: true })
            .then((res) => {
                setShapMaster(res);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [])

    // -------------------Shap options --------------------------------
    let _sortOptionsShap = shapMaster.map((option) => ({
        label: option.shape,
        value: option.id,
    }));

    // ------------------Option Color---------------
    const sortOptionsColor = [
        { label: "Blue", value: "Blue" },
        { label: "White", value: "White" },
        { label: "Green", value: "Green" },
        { label: "Pink", value: "Pink" },
        { label: "Teal", value: "Teal" },
        { label: "Purple", value: "Purple" },
        { label: "Peach", value: "Peach" },
        { label: "Yellow", value: "Yellow" },
        { label: "Orange", value: "Orange" },
        { label: "Other", value: "Other" },
    ];

    let _sortOptionsColor = sortOptionsColor.map((option) => ({
        label: option.label,
        value: option.value,
    }));
    // ------------------Option Intensity---------------
    const sortOptionsIntensity = [
        { label: "Faint", value: "Faint" },
        { label: "Very Light", value: "Very Light" },
        { label: "Light", value: "Light" },
        { label: "Fancy", value: "Fancy" },
        { label: "Intense", value: "Intense" },
        { label: "Vivid", value: "Vivid" },
        { label: "Deep", value: "Deep" },
        { label: "Dark", value: "Dark" },
    ];

    let _sortOptionsIntensity = sortOptionsIntensity.map((option) => ({
        label: option.label,
        value: option.value,
    }));
    // ------------------Option clarity---------------

    const sortOptionDclarity = [
        { label: "FL", value: "0" },
        { label: "IF", value: "1" },
        { label: "VVS1", value: "2" },
        { label: "VVS2", value: "3" },
        { label: "VS1", value: "4" },
        { label: "VS2", value: "5" },
        { label: "SI1", value: "6" },
        { label: "SI2", value: "7" },
        { label: "I1", value: "8" },
        { label: "I2", value: "9" },
        { label: "I3", value: "10" },
    ];

    let _sortOptionsDclarity = sortOptionDclarity.map((option) => ({
        label: option.label,
        value: option.value,
    }));


    // ------------------Option Origin---------------
    const sortOptionsOrigin = [
        { label: "Lab", value: "Lab" },
        { label: "Natural", value: "Natural" }
    ];

    let _sortOptionsOrigin = sortOptionsOrigin.map((option) => ({
        label: option.label,
        value: option.value,
    }));
    useEffect(() => {
        if (open === true && userData !== null) {
            setFormState(userData);
        } else {
            setFormState({ ...initialValues });
        }
    }, [open, userData]);
    return (
        <Validators formData={formState} rules={rules}>
            {({ onSubmit, errors, resetValidation }) => (
                <ThemeDialog
                    title={`${formState?.id === "" ? "Add" : "Edit"} Colored Diamond`}
                    isOpen={open}
                    onClose={() => {
                        togglePopup();
                        resetValidation();
                    }}
                    actionBtns={
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
                                onClick={() => onSubmit(handleSubmit)
                                }
                            >
                                Save
                            </Button>
                        </Box>
                    }
                >
                    <Textinput
                        size="small"
                        type="text"
                        name="stockId"
                        label="stock Id"
                        value={formState.stockId}
                        onChange={onChange}
                        error={errors?.stockId}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />
                    <Textinput
                        size="small"
                        type="text"
                        name="title"
                        label="Title"
                        value={formState.title}
                        onChange={onChange}
                        error={errors?.title}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />
                    <Textinput
                        size="small"
                        type="text"
                        name="description"
                        label="description"
                        value={formState.description}
                        onChange={onChange}
                        error={errors?.description}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />
                    <ReactSelect
                        label={"Enter Origin"}
                        placeholder="Select Origin"
                        options={_sortOptionsOrigin}
                        value={formState.origin}
                        onChange={onChange}
                        name="origin"
                        id="idStatus"
                        error={errors?.origin}
                    />
                    <Textinput
                        size="small"
                        type="text"
                        name="carat"
                        label="carat"
                        value={formState.carat}
                        onChange={onChange}
                        error={errors?.carat}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />
                    <ReactSelect
                        label={"Enter Shape"}
                        placeholder="Select Shape"
                        options={_sortOptionsShap}
                        value={formState.shape}
                        onChange={onChange}
                        name="shape"
                        id="idStatus"
                        error={errors?.shape}
                    />
                    <ReactSelect
                        label={"Enter Color"}
                        placeholder="Select Color"
                        options={_sortOptionsColor}
                        value={formState.color}
                        onChange={onChange}
                        name="color"
                        id="idStatus"
                        error={errors?.color}
                    />
                    <Textinput
                        size="small"
                        type="text"
                        name="colorName"
                        label="colorName"
                        value={formState.colorName}
                        onChange={onChange}
                        error={errors?.colorName}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />
                    <ReactSelect
                        label={"Enter Intensity"}
                        placeholder="Select Intensity"
                        options={_sortOptionsIntensity}
                        value={formState.intensity}
                        onChange={onChange}
                        name="intensity"
                        id="idStatus"
                        error={errors?.intensity}
                    />
                    <ReactSelect
                        label={"Clarity"}
                        placeholder="Select Clarity"
                        options={_sortOptionsDclarity}
                        value={formState.clarity}
                        onChange={onChange}
                        name="clarity"
                        id="idStatus"
                        error={errors?.clarity}
                    />
                    <Textinput
                        size="small"
                        type="text"
                        name="mLength"
                        label="mLength"
                        value={formState.mLength}
                        onChange={onChange}
                        error={errors?.mLength}
                        sx={{ mb: 2, mt: 1, width: "100%" }}

                    />
                    <Textinput
                        size="small"
                        type="text"
                        name="mWidth"
                        label="mWidth"
                        value={formState.mWidth}
                        onChange={onChange}
                        error={errors?.mWidth}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />
                    <Textinput
                        size="small"
                        type="text"
                        name="mDepth"
                        label="mDepth"
                        value={formState.mDepth}
                        onChange={onChange}
                        error={errors?.mDepth}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />
                    <Textinput
                        size="small"
                        type="text"
                        name="price"
                        label="price"
                        value={formState.price}
                        onChange={onChange}
                        error={errors?.price}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />

                </ThemeDialog>
            )}
        </Validators>
    );
}

export default ColorDiamondMasterDetails;
