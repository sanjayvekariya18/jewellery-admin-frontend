import { Box, Button } from "@mui/material";
import React, { useEffect } from "react";
import Textinput from "../../../../../components/UI/TextInput";
import Textarea from "../../../../../components/UI/Textarea";
import ThemeSwitch from "../../../../../components/UI/ThemeSwitch";
import ImgUploadBoxInput from "../../../../../components/UI/ImgUploadBoxInput";
import { useState } from "react";
import PinDropIcon from '@mui/icons-material/PinDrop';
import TooltipButton from "../../../../../components/UI/TooltipButton";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { API, HELPER } from "../../../../../services";
import Validators from "../../../../../components/validations/Validator";
import { apiConfig } from "../../../../../config";

const rules = {
    title: 'required',
    description: 'required',
    product_sku: 'required',
    main_img: 'required|mimes:png,jpg,jpeg|max_file_size:1048576',
}

export default function ProductSettings({ callback, homeProduct }) {
    const [step, setStep] = useState(1);
    const [formState, setFormState] = useState({
        description: "", 
        img_height: "", 
        img_width: "",
        product_sku: "", 
        title: "", 
        point_coordinates: null, 
        loggedInUserId: "", 
        main_img: "",
        is_visible: false,
        ...homeProduct
    });

    const [state, setState] = useState({
        isPinClicked: false,
        productDetail: null
    });

    useEffect(() => {
        setFormState(homeProduct)
    }, [homeProduct])


    const changeState = (obj) => {
        setState((prevState) => ({
            ...prevState,
            ...obj
        }));
    };

    const onChange = ({ target: { name, value } }) => {
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const getImgCoordinates = ({ nativeEvent: { offsetX, offsetY } }) => {
        if (state?.isPinClicked) {
            onChange({
                target: {
                    name: 'point_coordinates',
                    value: {
                        x: offsetX,
                        y: offsetY
                    }
                }
            })
        }
    };

    const onClickNextBtn = (data) => {
        setStep((prev) => prev + 1)

        API.get(apiConfig.productBySku.replace(':sku', data?.product_sku))
            .then((res) => {
                changeState({
                    productDetail: {
                        ...res,
                        product_img: `${apiConfig.publicURL}/productsFiles/${res?.Product?.stockId}/${res?.sku}/main.jpg`
                    }
                })
            })
    };

    const handleSubmit = () => {
        const formData = new FormData()
        for (const key in formState) {
            if (Object.hasOwnProperty.call(formState, key)) {
                let element = formState[key];
                if (key == 'point_coordinates' && element) {
                    element = JSON.stringify(element)
                }
                formData.append(key, element)
            }
        }

        API.post(apiConfig.saveAppSettingsHomeProduct, formData)
            .then((res) => {
                setStep(1)
                HELPER.toaster.success('Home Product updated!')
                callback()
            })
    };

    const tooltipContent = () => {
        return (
            <>
                {state?.productDetail && (
                    <>
                        <div className="item-thumb">
                            <a href="#">
                                <img src={state?.productDetail?.product_img} />
                            </a>
                        </div>
                        <div className="content-lookbook-bottom">
                            <div className="item-title">
                                <a href="#!">{state?.productDetail?.title}</a>
                            </div>
                            <span className="price">
                                <ins>
                                    <span>${state?.productDetail?.totalPrice}</span>
                                </ins>
                            </span>
                        </div>
                    </>
                )}

            </>
        )
    };

    const firstStepComponent = () => {
        return (
            <Validators formData={formState} rules={rules}>
                {({ onSubmit, errors }) => {
                    return (
                        <>
                            <Textinput
                                size="medium"
                                label="Title"
                                value={formState?.title || ""}
                                onChange={onChange}
                                type="text"
                                name="title"
                                fullWidth
                                error={errors?.title}
                                sx={{ mb: 2, mt: 1, width: "100%" }}
                            />

                            <Textarea
                                size="small"
                                type="text"
                                label={'Description'}
                                name="description"
                                maxLength={255}
                                minRows={3}
                                maxRows={3}
                                placeholder="Enter Description"
                                value={formState?.description}
                                onChange={onChange}
                                error={errors?.description}
                                sx={{ mb: 1.5 }}
                            />

                            <Textinput
                                size="medium"
                                label="Product Sku"
                                value={formState?.product_sku || ""}
                                onChange={onChange}
                                type="text"
                                name="product_sku"
                                fullWidth
                                error={errors?.product_sku}
                                sx={{ mb: 2, mt: 1, width: "100%" }}
                            />

                            <label className="label-class">Main Image</label>
                            <ImgUploadBoxInput
                                name="main_img"
                                onChange={onChange}
                                value={HELPER.getImageUrl(formState?.main_img) || ''}
                                label={"Main Image"}
                                error={errors?.main_img}
                            />

                            <label className="label-class">Visible</label>
                            <ThemeSwitch
                                name={"is_visible"}
                                checked={formState?.is_visible}
                                color="warning"
                                onChange={onChange}
                            />
                            <br />
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    onSubmit(onClickNextBtn)
                                }}
                            >
                                Next
                            </Button>
                        </>
                    );
                }}
            </Validators>

        );
    };

    const secondStepComponent = () => {
        return (
            <>
                <div className="customize-settings">
                    <div className="product-setting-details">
                        <Textinput
                            size="medium"
                            label="Main Image Hight"
                            value={formState?.img_height || ""}
                            onChange={onChange}
                            type="number"
                            name="img_height"
                            sx={{ mb: 2, mt: 1, width: "100%" }}
                        />

                        <Textinput
                            size="medium"
                            label="Main Image Width"
                            value={formState?.img_width || ""}
                            onChange={onChange}
                            type="number"
                            name="img_width"
                            sx={{ mb: 2, mt: 1, width: "100%" }}
                        />

                        <PinDropIcon color={state?.isPinClicked ? 'info' : 'default'} onClick={() => {
                            changeState({
                                isPinClicked: !state?.isPinClicked
                            })
                        }} />

                        <br />

                        {formState?.main_img && (
                            <div style={{ position: 'relative' }}>
                                {!HELPER.isEmpty(formState?.point_coordinates) && (
                                    <div style={{
                                        position: "absolute",
                                        left: `${formState?.point_coordinates?.x - 10}px`,
                                        top: `${formState?.point_coordinates?.y - 10}px`
                                    }}>
                                        <TooltipButton title={tooltipContent()} placement="right" arrow={false}>
                                            <AddCircleOutlineIcon />
                                        </TooltipButton>
                                    </div>
                                )}

                                <Box
                                    style={{ cursor: state?.isPinClicked ? 'all-scroll' : 'auto' }}
                                    id={`image_product`}
                                    component="img"
                                    sx={{
                                        height: `${formState?.img_height}px`,
                                        width: `${formState?.img_width}px`,
                                    }}
                                    src={typeof formState.main_img == 'string' ? HELPER.getImageUrl(formState.main_img) : URL.createObjectURL(formState.main_img)}
                                    onClick={getImgCoordinates}
                                    onError={(e) => {
                                        e.target.src = "/assets/camera.svg";
                                    }}
                                />
                            </div>
                        )}

                    </div>
                </div>

                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setStep((prev) => prev - 1);
                    }}
                >
                    Previous
                </Button>

                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </>
        );
    };

    return (
        <form>
            {step == 1
                ? firstStepComponent()
                : secondStepComponent()}
        </form>
    );
}