import React, { useCallback, useEffect, useState } from 'react';
import {
    FormControlLabel,
    Radio,
    RadioGroup,
    Button
} from "@mui/material";
import Textinput from '../../../../../components/UI/TextInput';
import ReactSelect from '../../../../../components/UI/ReactSelect';
import { API } from '../../../../../services';
import { apiConfig } from '../../../../../config';

const initialValues = {
    shape: "",
    rate: "",
};
const TaxPriceSetting = () => {
    const [formState, setFormState] = useState({ ...initialValues });
    const [selectedOption, setSelectedOption] = useState('state');
    const [zipCodeOption, setZipcodeOption] = useState('specific');
    const [shapMaster, setShapMaster] = useState([]);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleChangeSpecific = (event) => {
        setZipcodeOption(event.target.value);
    };
    const onChange = useCallback((e) => {
        setFormState((prevProps) => {
            return {
                ...prevProps,
                [e.target.name]: e.target.value,
            };
        });
    }, []);
    useEffect(() => {
        API.get(apiConfig.shapeList, { is_public_url: true })
            .then((res) => {
                setShapMaster(res);
            })
            .catch(() => { });
    }, []);

    // ------------------- Shap options --------------------------------
    let _sortOptionsShap = shapMaster.map((option) => ({
        label: option.shape,
        value: option.id,
    }));
    // -------------------Lab options --------------------------------

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className='tax_heading'>
                <div>
                    <p>Create Tax</p>
                </div>
                <div>
                    <Button
                        color='primary'
                        variant='outlined'
                    >
                        View Tax
                    </Button>
                </div>
            </div>
            <div className='d-flex' style={{ marginBottom: "10px" }}>
                <div style={{ marginTop: "15px", display: "flex" }}>
                    <p style={{ marginBottom: "20px", color: "gray", fontSize: "14px" }}>Select Tax Type</p>
                    <RadioGroup
                        row
                        aria-label="position"
                        name="isActive"
                        value={selectedOption}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            value="state"
                            labelPlacement="end"
                            control={<Radio color="primary" style={{ marginLeft: '40px' }} />}
                            label="State"
                        />
                        <FormControlLabel
                            value="zipcode"
                            label="ZipCode"
                            labelPlacement="end"
                            control={<Radio color="primary" style={{ marginLeft: '40px' }} />}
                        />
                    </RadioGroup>
                </div>
            </div>
            <div>
                {selectedOption === 'state' && (
                    <div style={{ width: "50%" }}>
                        {/* Render text boxes for state */}
                        <ReactSelect
                            className="tax-select-design"
                            label={"State"}
                            placeholder={"Select State"}
                            options={_sortOptionsShap}
                            value={formState.shape}
                            onChange={onChange}
                            name="shape"
                            id="idStatus"
                            styles={{ width: "50%" }}
                        // error={errors?.shape}
                        />
                        <div style={{ marginTop: "15px" }}>
                            <Textinput
                                variant="standard"
                                size="small"
                                type="number"
                                name="rate"
                                label="Rate"
                                value={formState.rate}
                                onChange={onChange}
                                // error={errors?.rate}
                                sx={{ mb: 0, mt: 1, width: "100%" }}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div>
                {selectedOption === 'zipcode' && (
                    <div style={{ width: "50%" }}>
                        <div className='d-flex'>
                            <p style={{ marginBottom: "20px", color: "gray", fontSize: "14px" }}>ZipCode Type</p>
                            <RadioGroup
                                row
                                aria-label="position"
                                name="isActive"
                                value={zipCodeOption}
                                onChange={handleChangeSpecific}
                            >
                                <FormControlLabel
                                    value="specific"
                                    labelPlacement="end"
                                    control={<Radio color="primary" style={{ marginLeft: '45px' }} />}
                                    label="Specific"
                                />
                                <FormControlLabel
                                    value="range"
                                    labelPlacement="end"
                                    control={<Radio color="primary" style={{ marginLeft: '45px' }} />}
                                    label="Range"
                                />
                            </RadioGroup>
                        </div>
                    </div>
                )}
            </div >
            <div>
                {!selectedOption === 'state' && zipCodeOption === 'specific' && (
                    <div style={{ width: "50%" }}>
                        <div style={{ marginTop: "15px" }}>
                            <Textinput
                                size="small"
                                type="number"
                                name="zipcode"
                                variant="standard"
                                label="ZipCode"

                                value={formState.rate}
                                onChange={onChange}
                                // error={errors?.rate}
                                sx={{ mb: 0, mt: 1, width: "100%" }}
                            />
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <Textinput
                                variant="standard"
                                size="small"
                                type="number"
                                name="rate"
                                label="Rate"
                                value={formState.rate}
                                onChange={onChange}
                                // error={errors?.rate}
                                sx={{ mb: 0, mt: 1, width: "100%" }}
                            />
                        </div>
                    </div>
                )}

            </div>
            {selectedOption === 'zipcode' && zipCodeOption === 'specific' && (
                <div style={{ width: "50%" }}>
                    <div style={{ marginTop: "15px" }}>
                        <Textinput
                            size="small"
                            type="number"
                            name="zipcode"
                            variant="standard"
                            label="ZipCode"

                            value={formState.rate}
                            onChange={onChange}
                            // error={errors?.rate}
                            sx={{ mb: 0, mt: 1, width: "100%" }}
                        />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                        <Textinput
                            size="small"
                            variant="standard"
                            type="number"
                            name="rate"
                            label="Rate"

                            value={formState.rate}
                            onChange={onChange}
                            // error={errors?.rate}
                            sx={{ mb: 0, mt: 1, width: "100%" }}
                        />
                    </div>
                </div>
            )}
            <div>
                {selectedOption === 'zipcode' && zipCodeOption === 'range' && (
                    <>
                        <div style={{ display: "flex", width: "100%" }}>
                            <div style={{ marginTop: "15px" }}>
                                <Textinput
                                    size="small"
                                    type="number"
                                    variant="standard"
                                    name="zipcode"
                                    label="From ZipCode"

                                    value={formState.rate}
                                    onChange={onChange}
                                    // error={errors?.rate}
                                    sx={{ mb: 0, mt: 1, width: "400px" }}
                                />
                            </div>
                            <div style={{ marginTop: "15px", marginLeft: "25px" }}>
                                <Textinput
                                    size="small"
                                    variant="standard"
                                    type="number"
                                    name="rate"
                                    label="To ZipCode"

                                    value={formState.rate}
                                    onChange={onChange}
                                    // error={errors?.rate}
                                    sx={{ mb: 0, mt: 1, width: "400px" }}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <Textinput
                                size="small"
                                type="number"
                                variant="standard"
                                name="rate"
                                label="Rate"

                                value={formState.rate}
                                onChange={onChange}
                                // error={errors?.rate}
                                sx={{ mb: 0, mt: 1, width: "34%" }}
                            />
                        </div>
                    </>
                )}
            </div>

            <div style={{ marginTop: "40px" }}>
                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                // onClick={() => {
                //     onSubmit(handleSubmit)
                // }}
                >
                    Save
                </Button>
            </div>
        </>
    );
}

export default TaxPriceSetting;
