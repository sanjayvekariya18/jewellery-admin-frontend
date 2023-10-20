import React, { useCallback, useEffect, useState } from 'react';
import Validators from '../../../../components/validations/Validator';
import ThemeDialog from '../../../../components/UI/Dialog/ThemeDialog';
import { Box, Button } from '@mui/material';
import Textinput from '../../../../components/UI/TextInput';
import { apiConfig, appConfig } from '../../../../config';
import { API, HELPER } from '../../../../services';
import ReactSelect from '../../../../components/UI/ReactSelect';

// ----------initialValues----------------------------------------------------
const initialValues = {
    id: "",
    stockId: "",
    gemstoneType: "",
    title: "",
    description: "",
    origin: "",
    carat: "",
    shape: "",
    color: "",
    clarity: "",
    mLength: "",
    mWidth: "",
    mDepth: "",
    price: ""
};

const GemstoneMasterDetails = ({
    open,
    togglePopup,
    userData
}) => {
    const [formState, setFormState] = useState({ ...initialValues });
    const [shapMaster, setShapMaster] = useState([]);

    const rules = {
        stockId: "required",
        gemstoneType: "required",
        origin: "required",
        shape: "required",
        color: "required",
        price: "required",
    };

    // ------------------Get Shap API --------------------------------

    useEffect(() => {
        API.get(apiConfig.shape, {
            // rowsPerPage: appConfig.defaultPerPage,
            // page: 0,
        })
            .then((res) => {
                setShapMaster(res);
                // paginate();
            })
            .catch((err) => {
                console.error(err);
            });
    }, [])
    const handleSubmit = (data) => {
        let formateFields = ['carat', 'mDepth', 'mLength', 'mWidth'];
        let _data = { ...data }
        formateFields.forEach(field => {
            _data[field] = parseFloat(_data[field]);
        });

        const apiUrl =
            data.id === "" ? apiConfig.gemstone : `${apiConfig.gemstone}/${data.id}`;

        API[data.id === "" ? "post" : "put"](apiUrl, _data)
            .then(() => {
                HELPER.toaster.success(
                    data.id === "" ? "Record created" : "Record saved"
                );
                togglePopup();
            })
            .catch((e) => HELPER.toaster.error(e.errors.message));
    };
    const onChange = useCallback((e) => {
        setFormState((prevProps) => {
            return {
                ...prevProps,
                [e.target.name]: e.target.value,
            };
        });
    }, []);

    const sortOptionsGemstoneType = [
        { label: "Moissanite", value: "Moissanite" },
        { label: "Sapphire", value: "Sapphire" },
        { label: "ColoredDiamond", value: "ColoredDiamond" },
        { label: "Emerald", value: "Emerald" },
        { label: "Aquamarine", value: "Aquamarine" },
        { label: "Morganite", value: "Morganite" },
        { label: "Alexandrite", value: "Alexandrite" },
        { label: "Ruby", value: "Ruby" },
        { label: "Tanzanite", value: "Tanzanite" },
        { label: "Tourmaline", value: "Tourmaline" },
        { label: "Amethyst", value: "Amethyst" },
        { label: "Garnet", value: "Garnet" },
        { label: "Spinel", value: "Spinel" },
        { label: "Peridot", value: "Peridot" },
        { label: "Citrine", value: "Citrine" },
        { label: "Other", value: "Other" },
    ];

    let _sortOptionsGemstoneType = sortOptionsGemstoneType.map((option) => ({
        label: option.label,
        value: option.value,
    }));

    const sortOptionsOrigin = [
        { label: "Lab", value: "Lab" },
        { label: "Natural", value: "Natural" }
    ];

    let _sortOptionsOrigin = sortOptionsOrigin.map((option) => ({
        label: option.label,
        value: option.value,
    }));

    let _sortOptionsShap = shapMaster.map((option) => ({
        label: option.shape,
        value: option.id,
    }));


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
                    title={`${formState?.id === "" ? "Add" : "Edit"} Gemstone`}
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
                                onClick={() => onSubmit(handleSubmit)}
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
                    <ReactSelect
                        label={"Enter Gemstone Type"}
                        placeholder="Select Gemstone Type"
                        options={_sortOptionsGemstoneType}
                        value={formState.gemstoneType}
                        onChange={onChange}
                        name="gemstoneType"
                        id="idStatus"
                        error={errors?.gemstoneType}
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
                        label="Description"
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
                        name="clarity"
                        label="clarity"
                        value={formState.clarity}
                        onChange={onChange}
                        error={errors?.clarity}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
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
                        label="Price"
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

export default GemstoneMasterDetails;
