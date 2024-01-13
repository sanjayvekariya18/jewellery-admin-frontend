import React, { useCallback, useEffect, useState } from 'react';
import ReactSelect from '../../components/UI/ReactSelect';
import Textinput from '../../components/UI/TextInput';
import { API, HELPER } from '../../services';
import { apiConfig } from '../../config';
import { Box, Button } from "@mui/material";
import Validators from '../../components/validations/Validator';
import ThemeDialog from '../../components/UI/Dialog/ThemeDialog';
import CommonButton from '../../components/UI/CommonButton';

const initialValues = {
    id: "",
    tax_type: "STATE",
    country_id: "",
    country_name: "",
    state_id: "",
    state_name: "",
    tax_rate: "",
};

const TaxMaterDetails = ({ open,
    togglePopup,
    userData,
    callBack }) => {
    const rules = {
        tax_type: "required",
        tax_rate: "required",
    };

    const [formState, setFormState] = useState({ ...initialValues });
    const [isLoader, setIsLoader] = useState(false);
    const [stateMaster, setStateMaster] = useState([]);
    const [countryMaster, setCountryMaster] = useState([]);
    const onChange = useCallback((e) => {
        setFormState((prevProps) => {
            return {
                ...prevProps,
                [e.target.name]: e.target.value,
            };
        });
    }, []);

    useEffect(() => {
        API.get(`${apiConfig.listStates}?countryId=${formState.country_id}`, { is_public_url: true })
            .then((res) => {
                setStateMaster(res);
            })
            .catch(() => { });
    }, [formState.country_id]);


    // ------------------- State  options find --------------------------------
    let _sortOptionsState = stateMaster.map((option) => ({
        label: option.name,
        value: option.id,
    }));

    useEffect(() => {
        API.get(`${apiConfig.listCountry}?searchTxt=`, { is_public_url: true })
            .then((res) => {
                setCountryMaster(res);
            })
            .catch(() => { });
    }, []);
    // ------------------- State  options find --------------------------------
    let _sortOptionsCountry = countryMaster.map((option) => ({
        label: option.name,
        value: option.id,
    }));
    // -------------------Lab options --------------------------------

    const handleSubmit = (data) => {
        setIsLoader(true);

        const _data = new FormData();

        for (const field in data) {
            // Check if the field value is null
            if (data[field] !== null) {
                _data.append(field, data[field]);
            }
        }
        const apiUrl =
            data.id === ""
                ? apiConfig.taxes
                : `${apiConfig.taxes}/${data.id}`;

        API[data.id === "" ? "post" : "put"](apiUrl, _data)
            .then(() => {
                HELPER.toaster.success(
                    data.id === "" ? "Record created" : "Record saved"
                );
                togglePopup();
                callBack();
                setFormState("")
            })
            .catch((err) => {
                if (err.status === 422 && err.errors) {
                    Object.keys(err.errors).forEach((key) => {
                        HELPER.toaster.error(`${key}: ${err.errors[key][0]}`);
                    });
                } else if (
                    err.status === 400 ||
                    err.status === 401 ||
                    err.status === 409 ||
                    err.status === 422 ||
                    err.status === 403
                ) {
                    HELPER.toaster.error(err.errors.message);
                } else {
                    HELPER.toaster.error(err);
                }
            })
            .finally(() => {
                setIsLoader(false);
            });
    };
    useEffect(() => {
        if (open === true && userData !== null) {
            setFormState(userData);
        } else {
            setFormState({ ...initialValues });
        }
    }, [open, userData]);
    return (
        <>
            <Validators formData={formState} rules={rules}>
                {({ onSubmit, errors, resetValidation }) => (
                    <ThemeDialog
                        title={`${formState?.id === "" ? "Add" : "Edit"} Tax Details`}
                        isOpen={open}
                        maxWidth="sm"
                        onClose={() => {
                            togglePopup();
                            resetValidation();
                        }}
                        className="product-details-select-box"
                        actionBtns={
                            <>
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
                            </>
                        }
                    >
                        <div>
                          
                                <div>
                                    <div style={{ marginTop: "10px" }}>
                                        <ReactSelect
                                            className="tax-select-design"
                                            label={"Country"}
                                            placeholder={"Select Country"}
                                            options={_sortOptionsCountry}
                                            value={formState.country_id}
                                            onChange={onChange}
                                            name="country_id"
                                            id="idStatus"
                                            styles={{ width: "50%" }}
                                            error={errors?.country_id}
                                        />
                                    </div>
                                    <div style={{ marginTop: "10px" }}>
                                        <ReactSelect
                                            className="tax-select-design"
                                            label={"State"}
                                            placeholder={"Select State"}
                                            options={_sortOptionsState}
                                            value={formState.state_id}
                                            onChange={onChange}
                                            name="state_id"
                                            id="idStatus"
                                            styles={{ width: "50%" }}
                                            error={errors?.state_id}
                                        />
                                    </div>
                                    <div style={{ marginTop: "5px" }}>
                                        <Textinput
                                            variant="standard"
                                            size="small"
                                            type="number"
                                            name="tax_rate"
                                            label="Rate"
                                            value={formState.tax_rate}
                                            onChange={onChange}
                                            sx={{ mb: 0, mt: 1, width: "100%" }}
                                            error={errors?.tax_rate}
                                        />
                                    </div>
                                </div>
                        </div>
                    </ThemeDialog>
                )}
            </Validators>
        </>
    );
}

export default TaxMaterDetails;
