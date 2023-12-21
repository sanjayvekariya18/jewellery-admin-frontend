import { Box, Button } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import Validators from "../../../../../../components/validations/Validator";
import { Link } from "react-router-dom";
import { pageRoutes } from "../../../../../../constants/routesList";
import Draggable from 'react-draggable';
import Textinput from "../../../../../../components/UI/TextInput";
import ThemeSwitch from "../../../../../../components/UI/ThemeSwitch";
import TooltipButton from "../../../../../../components/UI/TooltipButton";
import ImgUploadBoxInput from "../../../../../../components/UI/ImgUploadBoxInput";
import { API, HELPER } from "../../../../../../services";
import { apiConfig } from "../../../../../../config";
import AddPinDialog from "./partials/AddPinDialog";
import PinProductList from "./partials/PinProductList";
import _ from "lodash";

const rules = {
    title: 'required',
    description: 'required',
    shop_now_url: 'url',
    main_img: 'required|mimes:png,jpg,jpeg|max_file_size:1048576',
}

export default function ProductSettings({ callback, homeProduct }) {
    const [step, setStep] = useState(1);
    const [formState, setFormState] = useState({
        description: "",
        img_height: "",
        img_width: "",
        shop_now_url: '',
        title: "",
        point_coordinates: [],
        admin_point_coordinates: [],
        loggedInUserId: "",
        main_img: "",
        is_visible: false,
        ...homeProduct
    });

    const [state, setState] = useState({
        isPinClicked: false,
        products: [],
        isOpenPinModel: false,
        selectedProduct: ""
    });

    useEffect(() => {
        if (!HELPER.isEmpty(homeProduct) && !HELPER.isEmpty(homeProduct?.admin_point_coordinates)) {
            getProductsBySkys(homeProduct?.admin_point_coordinates)
        }
    }, [homeProduct])

    const getProductsBySkys = (admin_point_coordinates) => {
        const skus = _.map(admin_point_coordinates, 'sku')
        API.post(apiConfig.productBySku, {
            sku: skus
        })
            .then((products) => {
                const _products = products.map((product) => {
                    return {
                        ...product,
                        product_img: `${apiConfig.publicURL}/productsFiles/${product?.Product?.stockId}/${product?.sku}/main.jpg`
                    }
                })

                changeState({
                    products: _products
                })
            })
            .catch(() => { })
    }

    const changeState = (obj) => {
        setState((prevState) => ({
            ...prevState,
            ...obj
        }));
    };

    const changeFormState = (obj) => {
        setFormState((prevState) => ({
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

    const onClickNextBtn = () => {
        setStep((prev) => prev + 1)
    };

    const handleSubmit = () => {
        const formData = new FormData()

        for (const key in formState) {
            if (Object.hasOwnProperty.call(formState, key)) {
                let element = formState[key];
                if (['admin_point_coordinates', 'point_coordinates'].includes(key) && element) {
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
            .catch(() => { })
    };

    const onStopDrag = (event, _sku) => {
        const img = document.getElementById('image_product')
        const circle = document.getElementsByClassName('draggable_handle')[0];

        const imageWidth = img.clientWidth;
        const imageHeight = img.clientHeight;

        const imageRect = img.getBoundingClientRect();
        const x = event.clientX - imageRect.left;
        const y = event.clientY - imageRect.top;

        // Update circle position
        const offsetX = x - (circle.offsetWidth / 2);
        const offsetY = y - (circle.offsetHeight / 2);

        const adminPointCoordinates = formState.admin_point_coordinates.map((item) => {
            if (item?.sku == _sku) {
                return {
                    ...item,
                    x: offsetX + 2,
                    y: offsetY + 2
                }
            }

            return item;
        })

        const pointCoordinates = adminPointCoordinates.map((item) => {
            return {
                ...item,
                x: ((item.x) / imageWidth) * 100,
                y: ((item.y + 5) / imageHeight) * 100
            }
        })

        changeFormState({
            admin_point_coordinates: adminPointCoordinates,
            point_coordinates: pointCoordinates
        })
    }

    const onRemoveProduct = (_sku) => {
        let _products = state?.products.filter(e => e.sku != _sku)
        const adminPointCoordinates = formState.admin_point_coordinates.filter(e => e.sku != _sku)
        const pointCoordinates = formState.point_coordinates.filter(e => e.sku != _sku)

        changeState({
            products: _products,
        })

        changeFormState({
            admin_point_coordinates: adminPointCoordinates,
            point_coordinates: pointCoordinates
        })
    }

    const findPointCoorBySku = (_sku) => {
        if (!HELPER.isEmpty(formState?.admin_point_coordinates)) {
            const { sku, ...rest } = formState?.admin_point_coordinates.find(e => e.sku == _sku)
            return rest;
        }
        return { x: 0, y: 0 }
    }

    const tooltipContent = (product) => {
        return (
            <>
            <div className="main-thumb">
                <div className="item-thumb">
                    <Link to={`${pageRoutes.productVariantId}/${product?.id}`}>
                        <img src={product?.product_img} />
                    </Link>
                </div>
                <div className="content-lookbook-bottom">
                    <div className="item-title">
                        <a href="#!">{product?.title}</a>
                    </div>
                    <div className="price">
                        <div className="total_price ribbon ribbon-top-right"><span>${product?.totalPrice}</span></div>
                    </div>
                </div>
                </div>
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
                            <Textinput
                                id="outlined-multiline-static"
                                label="Description"
                                multiline
                                fullWidth
                                name="description"
                                rows={5}
                                maxLength={255}
                                onChange={onChange}
                                value={formState.description}
                                sx={{ mb: 1.5 }}
                            />
                            <Textinput
                                size="medium"
                                label="Shop now link"
                                value={formState?.shop_now_url || ""}
                                onChange={onChange}
                                type="text"
                                name="shop_now_url"
                                fullWidth
                                error={errors?.shop_now_url}
                                sx={{ mb: 2, mt: 1, width: "100%" }}
                            />
                            <div style={{ display: "flex" }}>
                                <div>
                                    <label className="label-class">Main Image</label>
                                    <ImgUploadBoxInput
                                        name="main_img"
                                        onChange={onChange}
                                        value={HELPER.getImageUrl(formState?.main_img) || ''}
                                        label={"Main Image"}
                                        error={errors?.main_img}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                                    <label className="label-class" style={{ marginBottom: "10px" }}>Visible</label>
                                    <ThemeSwitch
                                        name={"is_visible"}
                                        checked={HELPER._bool(formState?.is_visible)}
                                        value={HELPER._bool(formState?.is_visible)}
                                        color="warning"
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
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
                        <div style={{ display: "flex" }}>
                            <div style={{ marginRight: "20px" }}>
                                <Textinput
                                    size="small"
                                    label="Main Image Hight"
                                    value={formState?.img_height || ""}
                                    onChange={onChange}
                                    type="number"
                                    name="img_height"
                                    sx={{ mb: 2, mt: 1 }}
                                />
                            </div>
                            <div style={{ marginRight: "20px" }}>
                                <Textinput
                                    size="small"
                                    label="Main Image Width"
                                    value={formState?.img_width || ""}
                                    onChange={onChange}
                                    type="number"
                                    name="img_width"
                                    sx={{ mb: 2, mt: 1 }}
                                />
                            </div>
                            <div style={{ marginRight: "20px", marginTop: "12px" }}>

                                {/* <PinDropIcon color={state?.isPinClicked ? 'info' : 'default'} onClick={() => {
                                    changeState({
                                        isPinClicked: !state?.isPinClicked
                                    })
                                }} /> */}

                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        changeState({
                                            isOpenPinModel: true
                                        })
                                    }}
                                >
                                    Add Pin
                                </Button>

                            </div>
                        </div>
                        <br />

                        <div style={{ display: 'flex', alignContent: 'center', gap: '10px' }}>
                            {formState?.main_img && (
                                <div style={{ position: 'relative', width: `${formState?.img_width}px` }}>
                                    {!HELPER.isEmpty(state?.products) && state?.products.map((product, i) => (
                                        <Draggable
                                            key={i}
                                            handle=".draggable_handle"
                                            defaultPosition={{ x: 0, y: 0 }}
                                            position={findPointCoorBySku(product?.sku)}
                                            bounds="parent"
                                            scale={1}
                                            onStop={(event) => onStopDrag(event, product?.sku)}>
                                            <div className="draggable_handle" style={{
                                                position: "absolute",
                                                cursor: 'pointer'
                                            }}>
                                                <TooltipButton title={tooltipContent(product)} placement="right" arrow={false}>
                                                    <div className={`pulse-base pulse-circle ${state?.selectedProduct == product?.sku ? 'active-pin' : ''}`}>+</div>
                                                </TooltipButton>
                                            </div>
                                        </Draggable>
                                    ))}


                                    <Box
                                        style={{ cursor: state?.isPinClicked ? 'all-scroll' : 'auto' }}
                                        id={`image_product`}
                                        component="img"
                                        sx={{
                                            height: `${formState?.img_height}px`,
                                            width: `${formState?.img_width}px`,
                                        }}
                                        src={typeof formState.main_img == 'string' ? HELPER.getImageUrl(formState.main_img) : URL.createObjectURL(formState.main_img)}
                                        onError={(e) => {
                                            e.target.src = "/assets/camera.svg";
                                        }}
                                    />
                                </div>
                            )}

                            <div>
                                <PinProductList 
                                    products={state?.products} 
                                    selectedProduct={state?.selectedProduct}
                                    onSelectProduct={(sku) => {
                                        changeState({
                                            selectedProduct: sku
                                        })
                                    }}
                                    removeProduct={onRemoveProduct}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                <div style={{ display: "flex", paddingTop: "10px" }}>
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
                        style={{ marginLeft: "10px" }}
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div >
            </>
        );
    };

    return (
        <>
            <form>
                {step == 1
                    ? firstStepComponent()
                    : secondStepComponent()}
            </form>

            <AddPinDialog isOpen={state?.isOpenPinModel}
                onClose={() => {
                    changeState({
                        isOpenPinModel: false
                    })
                }} onSave={(data) => {
                    changeFormState({
                        admin_point_coordinates: [...formState.admin_point_coordinates, {
                            x: 10,
                            y: 10,
                            sku: data.sku
                        }]
                    })

                    changeState({
                        isOpenPinModel: false,
                        products: [...state.products,
                            data],
                        selectedProduct: data.sku
                    })
                }} />
        </>
    );
}
