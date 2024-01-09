import React, { useCallback, useEffect, useState } from "react";
import Validators from "../../components/validations/Validator";
import ThemeDialog from "../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
import Textinput from "../../components/UI/TextInput";
import { API, HELPER } from "../../services";
import { apiConfig } from "../../config";
import ReactSelect from "../../components/UI/ReactSelect";
import Textarea from "../../components/UI/Textarea";
import CommonButton from "../../components/UI/CommonButton";

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

const ColorDiamondMasterDetails = ({ open, togglePopup, userData, callBack }) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [shapMaster, setShapMaster] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  // validation
  const rules = {
    stockId: "required",
    origin: "required",
    carat: "required",
    shape: "required",
    color: "required",
    price: "required|numeric|min:1",
    clarity: "required",
    colorName: "required",
    intensity: "required",
    mDepth: "numeric|min:0",
    mLength: "numeric|min:0|required",
    mWidth: "numeric|min:0|required",
  };


  // Onchange define
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
    setIsLoader(true);

    let formateFields = ["carat", "mDepth", "mLength", "mWidth"];
    let _data = { ...data };
    formateFields.forEach((field) => {
      _data[field] = parseFloat(_data[field]);
    });
    const apiUrl =
      data.id === ""
        ? apiConfig.coloredDiamond
        : `${apiConfig.coloredDiamond}/${data.id}`;

    API[data.id === "" ? "post" : "put"](apiUrl, _data)
      .then(() => {
        HELPER.toaster.success(
          data.id === "" ? "Record created" : "Record saved"
        );
        togglePopup();
        callBack();
      })
      .catch((err) => {
        if (
          err.status === 400 ||
          err.status === 401 ||
          err.status === 409 ||
          err.status === 403
        ) {
          HELPER.toaster.error(err.errors.message);
        } else if (err.status === 422) {
          if (err.errors) {
            Object.keys(err.errors).forEach(key => {
              if (err.errors[key] && err.errors[key].length > 0) {
                HELPER.toaster.error(`${key}: ${err.errors[key][0]}`);
              }
            });
          } else {
            HELPER.toaster.error(err.errors);
          }
        } else {
          HELPER.toaster.error(err)
        }
      })
      .finally(() => {
        setIsLoader(false);
      });
  };

  // ------------------Get Shap API --------------------------------

  useEffect(() => {
    API.get(apiConfig.shapeList, { is_public_url: true })
      .then((res) => {
        setShapMaster(res);
      })
      .catch(() => { });
  }, []);

  // -------------------Shap options --------------------------------
  let _sortOptionsShap = shapMaster.map((option) => ({
    label: option.shape,
    value: option.id,
  }));

  // ------------------Option Color---------------
  const sortOptionsColor = [
    { label: "Blue", value: "BLUE" },
    { label: "White", value: "WHITE" },
    { label: "Green", value: "GREEN" },
    { label: "Pink", value: "PINK" },
    { label: "Teal", value: "TEAL" },
    { label: "Purple", value: "PURPLE" },
    { label: "Peach", value: "PEACH" },
    { label: "Yellow", value: "YELLOW" },
    { label: "Orange", value: "ORANGE" },
    { label: "Other", value: "OTHER" },
  ];

  let _sortOptionsColor = sortOptionsColor.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  // ------------------Option Intensity---------------
  const sortOptionsIntensity = [
    { label: "Faint", value: "FAINT" },
    { label: "Very Light", value: "VERY LIGHT" },
    { label: "Light", value: "LIGHT" },
    { label: "Fancy", value: "FANCY" },
    { label: "Intense", value: "INTENSE" },
    { label: "Vivid", value: "VIVID" },
    { label: "Deep", value: "DEEP" },
    { label: "Dark", value: "DARK" },
  ];

  let _sortOptionsIntensity = sortOptionsIntensity.map((option) => ({
    label: option.label,
    value: option.value,
  }));
  // ------------------Option clarity---------------

  // const sortOptionDclarity = [
  //   { label: "FL", value: "0" },
  //   { label: "IF", value: "1" },
  //   { label: "VVS1", value: "2" },
  //   { label: "VVS2", value: "3" },
  //   { label: "VS1", value: "4" },
  //   { label: "VS2", value: "5" },
  //   { label: "SI1", value: "6" },
  //   { label: "SI2", value: "7" },
  //   { label: "I1", value: "8" },
  //   { label: "I2", value: "9" },
  //   { label: "I3", value: "10" },
  // ];

  // let _sortOptionsDclarity = sortOptionDclarity.map((option) => ({
  //   label: option.label,
  //   value: option.value,
  // }));


  // --------------------Option Origin
  const sortOptionsOrigin = [
    { label: "Lab", value: "Lab" },
    { label: "Natural", value: "Natural" },
  ];
  let _sortOptionsOrigin = sortOptionsOrigin.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  // useEffect of a data show
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr ",
              alignItems: "baseline",
              gap: "12px",
            }}
          // className="text-input-top"
          >
            <Textinput
              size="small"
              type="text"
              name="stockId"
              label="Stock Number"
              placeholder="Enter Stock Number"
              value={formState.stockId}
              onChange={onChange}
              error={errors?.stockId}
              sx={{ mb: 0, mt: 1, width: "100%" }}
            />
            <Textinput
              size="small"
              type="number"
              name="carat"
              label="Carat"
              placeholder="Enter Carat"
              value={formState.carat}
              onChange={onChange}
              error={errors?.carat}
              sx={{ mb: 0, mt: 1, width: "100%" }}
            />
          </div>

          <div className="text-input-top">
            <Textinput
              size="small"
              type="text"
              name="title"
              label="Title"
              placeholder="Enter Title"
              value={formState.title}
              onChange={onChange}
              error={errors?.title}
              sx={{ mb: 0, width: "100%" }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr ",
              gap: "12px",
            }}
            className="text-input-top"
          >
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
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              alignItems: "end"
            }}
            className="text-input-top"
          >
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
            {/* <ReactSelect
              label={"Clarity"}
              placeholder="Select Clarity"
              options={_sortOptionsDclarity}
              value={formState.clarity}
              onChange={onChange}
              name="clarity"
              id="idStatus"
              error={errors?.clarity}
            /> */}
            <Textinput
              size="small"
              type="text"
              name="clarity"
              label="Clarity"
              placeholder="Enter Clarity"
              value={formState.clarity}
              onChange={onChange}
              error={errors?.clarity}
              sx={{ mb: 0, width: "100%" }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
              gap: "12px",
            }}
            className="text-input-top"
          >
            <Textinput
              size="small"
              type="text"
              name="colorName"
              label="Color Name"
              placeholder="Enter Color Name"
              value={formState.colorName}
              onChange={onChange}
              onKeyPress={(event) => {
                const pattern = /^[a-zA-Z]+$/;
                if (!pattern.test(event.key)) {
                  event.preventDefault();
                }
              }}
              error={errors?.colorName}
              sx={{ mb: 0, width: "100%" }}
            />

            <Textinput
              size="small"
              type="number"
              name="mLength"
              label="M-Length"
              placeholder="Enter M-Length"
              value={formState.mLength}
              onChange={onChange}
              error={errors?.mLength}
              sx={{ mb: 0, width: "100%" }}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <Textinput
              size="small"
              type="number"
              name="mWidth"
              label="M-Width"
              placeholder="Enter M-Width"
              value={formState.mWidth}
              onChange={onChange}
              error={errors?.mWidth}
              sx={{ mb: 0, width: "100%" }}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <Textinput
              size="small"
              type="number"
              name="mDepth"
              label="M-Depth"
              placeholder="Enter M-Depth"
              value={formState.mDepth}
              onChange={onChange}
              error={errors?.mDepth}
              sx={{ mb: 0, width: "100%" }}
              InputProps={{ inputProps: { min: 0 } }}
            />

            <Textinput
              size="small"
              type="number"
              name="price"
              label="Price"
              placeholder="Enter Price"
              value={formState.price}
              onChange={onChange}
              // error={errors?.price ? true : false}
              error={errors?.price}
              sx={{ mb: 0, width: "100%" }}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </div>
          <div className="text-input-top">
            <Textarea
              size="small"
              type="text"
              name="description"
              maxLength={255}
              minRows={3}
              maxRows={3}
              placeholder="Enter Colored Diamond Details"
              value={formState.description}
              onChange={onChange}
              sx={{ mb: 1.5 }}
            />
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default ColorDiamondMasterDetails;
