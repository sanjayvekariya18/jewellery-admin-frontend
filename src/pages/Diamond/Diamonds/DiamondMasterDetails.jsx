

import { useState, useCallback, useEffect } from "react";
import { apiConfig } from "../../../config";
import { API, HELPER } from "../../../services";
import Validators from "../../../components/validations/Validator";
import ThemeDialog from "../../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from '@mui/material';
import Textinput from "../../../components/UI/TextInput";
import ReactSelect from "../../../components/UI/ReactSelect";

// ----------initialValues----------------------------------------------------
const initialValues = {
    id: "",
    stockId: "",
    carat: "",
    shape: "",
    color: "",
    clarity: "",
    cut: "",
    origin: "",
    fluorescence: "",
    mLength: "",
    mWidth: "",
    mDepth: "",
    table: "",
    depth: "",
    symmetry: "",
    polish: "",
    girdle: "",
    culet: "",
    labId: "",
    certificateNo: "",
    price: "",
};

const DiamondMasterDetails = ({
    open,
    togglePopup,
    userData
}) => {
    const [formState, setFormState] = useState({ ...initialValues });
    const [shapMaster, setShapMaster] = useState([]);
    const [labMaster, setLabMaster] = useState([]);

    const rules = {
        stockId: "required",
        carat: "required",
        shape: "required",
        color: "required",
        clarity: "required",
        origin: "required",
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

    // ------------------Get Lab API --------------------------------

    useEffect(() => {
        API.get(apiConfig.labList, { is_public_url: true })
            .then((res) => {
                setLabMaster(res);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [])

    // -------------------Lab options --------------------------------
    let _sortOptionsLab = labMaster.map((option) => ({
        label: option.labName,
        value: option.id,
    }));


    // -------- handleSubmit-------------
    const handleSubmit = (data) => {
        let formateFields = ['carat', 'mDepth', 'mLength', 'mWidth'];
        let _data = { ...data }
        formateFields.forEach(field => {
            _data[field] = parseFloat(_data[field]);
        });
        const apiUrl =
            data.id === "" ? apiConfig.diamonds : `${apiConfig.diamonds}/${data.id}`;

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

    // ------------------Option Color---------------
    const sortOptionDcolor = [
        { label: "D", value: "0" },
        { label: "E", value: "1" },
        { label: "F", value: "2" },
        { label: "G", value: "3" },
        { label: "H", value: "4" },
        { label: "I", value: "5" },
        { label: "J", value: "6" },
        { label: "K", value: "7" },
        { label: "L", value: "8" },
        { label: "MN", value: "9" },
        { label: "OP", value: "10" },
    ]
    let _sortOptionsDcolor = sortOptionDcolor.map((option) => ({
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
    ]

    let _sortOptionsDclarity = sortOptionDclarity.map((option) => ({
        label: option.label,
        value: option.value,
    }));


    // ------------------Option Cut---------------
    const sortOptionsDcut = [
        { label: "Super_Ideal", value: "0" },
        { label: "Ideal", value: "1" },
        { label: "Very_Good", value: "2" },
        { label: "Good", value: "3" },
        { label: "Fair", value: "4" },
        { label: "Poor", value: "5" }
    ];

    let _sortOptionsDcut = sortOptionsDcut.map((option) => ({
        label: option.label,
        value: option.value,
    }));


    // ------------------Option Symmetry---------------
    const sortOptionsDsymmetry = [
        { label: "Excellent", value: "0" },
        { label: "Very_Good", value: "1" },
        { label: "Good", value: "2" },
    ];
    let _sortOptionsDsymmetry = sortOptionsDsymmetry.map((option) => ({
        label: option.label,
        value: option.value,
    }));


    // ------------------Option Fluoresecence---------------

    const sortOptionsDfluorescence = [
        { label: "None", value: "0" },
        { label: "Faint", value: "1" },
        { label: "Medium", value: "2" },
        { label: "Stong", value: "3" },
        { label: "Very_Strong", value: "4" },
    ];

    let _sortOptionsDfluorescence = sortOptionsDfluorescence.map((option) => ({
        label: option.label,
        value: option.value,
    }));

    // ------------------Option Girdle---------------
    const sortOptionsDgirdle = [
        { label: "Extremely thin", value: "EXTREMELY_THIN" },
        { label: "Very thin", value: "VERY_THIN" },
        { label: "Thin or Medium", value: "THIN_MEDIUM" },
        { label: "Slightly thick or thick", value: "SLIGHTLY_THICK_THICK" },
        { label: "Extremely thick", value: "EXTREMELY_THICK" },
    ];

    let _sortOptionsDgirdle = sortOptionsDgirdle.map((option) => ({
        label: option.label,
        value: option.value,
    }));
    // ------------------Option Culet---------------

    const sortOptionsDculet = [
        { label: "None", value: "NONE" },
        { label: "Very Small", value: "VERY_SMALL" },
        { label: "Small", value: "SMALL" },
        { label: "Medium", value: "MEDIUM" },
        { label: "Slightly Large", value: "SLIGHTLY_LARGE" },
        { label: "Large", value: "LARGE" },
        { label: "Very Large", value: "VERY_LARGE" },
        { label: "Extremely Large", value: "EXTREMELY_LARGE" },

    ];
    let _sortOptionsDculet = sortOptionsDculet.map((option) => ({
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
    // ------------------Option Polish---------------
    const sortOptionsDpolish = [
        { label: "Excellent", value: "0" },
        { label: "Very_Good", value: "1" },
        { label: "Good", value: "2" },
    ]
    let _sortOptionsDpolish = sortOptionsDpolish.map((option) => ({
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
                        options={_sortOptionsDcolor}
                        value={formState.color}
                        onChange={onChange}
                        name="color"
                        id="idStatus"
                        error={errors?.color}
                    />
                    <ReactSelect
                        label={"Enter Clarity"}
                        placeholder="Select Clarity"
                        options={_sortOptionsDclarity}
                        value={formState.clarity}
                        onChange={onChange}
                        name="clarity"
                        id="idStatus"
                        error={errors?.clarity}
                    />
                    <ReactSelect
                        label={"Enter Cut"}
                        placeholder="Select Cut"
                        options={_sortOptionsDcut}
                        value={formState.cut}
                        onChange={onChange}
                        name="cut"
                        id="idStatus"
                        error={errors?.cut}
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
                    <ReactSelect
                        label={"Enter Fluorescence"}
                        placeholder="Select Fluorescence"
                        options={_sortOptionsDfluorescence}
                        value={formState.fluorescence}
                        onChange={onChange}
                        name="fluorescence"
                        id="idStatus"
                        error={errors?.fluorescence}
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
                        name="table"
                        label="table"
                        value={formState.table}
                        onChange={onChange}
                        error={errors?.table}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />

                    <Textinput
                        size="small"
                        type="text"
                        name="depth"
                        label="depth"
                        value={formState.depth}
                        onChange={onChange}
                        error={errors?.depth}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />
                    <ReactSelect
                        label={"Enter Symmetry"}
                        placeholder="Select Symmetry"
                        options={_sortOptionsDsymmetry}
                        value={formState.symmetry}
                        onChange={onChange}
                        name="symmetry"
                        id="idStatus"
                        error={errors?.symmetry}
                    />

                    <ReactSelect
                        label={"Enter Polish"}
                        placeholder="Select Polish"
                        options={_sortOptionsDpolish}
                        value={formState.polish}
                        onChange={onChange}
                        name="polish"
                        id="idStatus"
                        error={errors?.polish}
                    />
                    <ReactSelect
                        label={"Enter Girdle"}
                        placeholder="Select Girdle"
                        options={_sortOptionsDgirdle}
                        value={formState.girdle}
                        onChange={onChange}
                        name="girdle"
                        id="idStatus"
                        error={errors?.girdle}
                    />

                    <ReactSelect
                        label={"Enter Cultet"}
                        placeholder="Select Cultet"
                        options={_sortOptionsDculet}
                        value={formState.culet}
                        onChange={onChange}
                        name="culet"
                        id="idStatus"
                        error={errors?.culet}
                    />

                    <ReactSelect
                        label={"Enter Lab"}
                        placeholder="Select Lab"
                        options={_sortOptionsLab}
                        value={formState.labId}
                        onChange={onChange}
                        name="labId"
                        id="idStatus"
                        error={errors?.labId}
                    />

                    <Textinput
                        size="small"
                        type="text"
                        name="certificateNo"
                        label="certificateNo"
                        value={formState.certificateNo}
                        onChange={onChange}
                        error={errors?.certificateNo}
                        sx={{ mb: 2, mt: 1, width: "100%" }}
                    />
                </ThemeDialog>
            )}
        </Validators>
    );
}

export default DiamondMasterDetails;
