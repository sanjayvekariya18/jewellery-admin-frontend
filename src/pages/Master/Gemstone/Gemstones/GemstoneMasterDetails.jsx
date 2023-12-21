import React, { useCallback, useEffect, useState } from "react";
import Validators from "../../../../components/validations/Validator";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";
import { API, HELPER } from "../../../../services";
import ReactSelect from "../../../../components/UI/ReactSelect";
import Textarea from "../../../../components/UI/Textarea";
import CommonButton from "../../../../components/UI/CommonButton";

// ----------initialValues-------------------------
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
  price: "",
};

const GemstoneMasterDetails = ({ open, togglePopup, userData, callBack }) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [shapMaster, setShapMaster] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  const rules = {
    stockId: "required",
    gemstoneType: "required",
    origin: "required",
    shape: "required",
    color: "required", 
    price: "required|numeric|min:1",
    mDepth: "numeric|min:0",
    mLength: "numeric|min:0|required",
    mWidth: "numeric|min:0|required",

  };

  // ------------------Get Shape API --------------------------------
  useEffect(() => {
    API.get(apiConfig.shapeList, { is_public_url: true })
      .then((res) => {
        setShapMaster(res);
      })
      .catch(() => { });
  }, []);

  // ------------------------Shape Options --------------------------------
  let _sortOptionsShap = shapMaster.map((option) => ({
    label: option.shape,
    value: option.id,
  }));

  // ----------------- handle Submitted ------------------------
  const handleSubmit = (data) => {
    setIsLoader(true);

    let formateFields = ["carat", "mDepth", "mLength", "mWidth"];
    let _data = { ...data };
    formateFields.forEach((field) => {
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
          if (err.errors.carat && err.errors.carat.length > 0) {
            HELPER.toaster.error(err.errors.carat[0]);
          } else {
            HELPER.toaster.error("An error occurred with the carat field.");
          }
        } else {
          HELPER.toaster.error(err)
        }
      })
      .finally(() => {
        setIsLoader(false);
      });
  };

  const onChange = useCallback((e) => {
    setFormState((prevProps) => {
      return {
        ...prevProps,
        [e.target.name]: e.target.value,
      };
    });
  }, []);

  // ----------------- Gemstonetype Options ----------------

  const sortOptionsGemstoneType = [
    { label: "Moissanite", value: "Moissanite" },
    { label: "Sapphire", value: "Sapphire" },
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

  // --------------------- Origin Options --------------------
  const sortOptionsOrigin = [
    { label: "Lab", value: "Lab" },
    { label: "Natural", value: "Natural" },
  ];

  let _sortOptionsOrigin = sortOptionsOrigin.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  // ------------------- Color Options ----------------
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
          title={`${formState?.id === "" ? "Add" : "Edit"} Gem Stone`}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr ",
              alignItems: "baseline",
              gap: "12px",
            }}
          >
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
            <div className="text-input-top">
              <Textinput
                size="small"
                type="number"  // Change the type to "text" instead of "number"
                name="carat"
                label="Carat"
                placeholder="Enter Carat"
                value={formState.carat}
                onChange={onChange}
                error={errors?.carat}
                sx={{ mb: 0, width: "100%" }}
                inputProps={{ step: "any" }}
              />

            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr ",
              alignItems: "baseline",
              gap: "12px",
            }}
          >
            <div className="text-input-top">
              <ReactSelect
                label={"Select Gemstone Type"}
                placeholder="Gemstone Type"
                options={_sortOptionsGemstoneType}
                value={formState.gemstoneType}
                onChange={onChange}
                name="gemstoneType"
                id="idStatus"
                error={errors?.gemstoneType}
              />
            </div>
            <div className="text-input-top">
              <ReactSelect
                label={"Select Shape Name"}
                placeholder="Shape Name"
                options={_sortOptionsShap}
                value={formState.shape}
                onChange={onChange}
                name="shape"
                id="idStatus"
                error={errors?.shape}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr ",
              alignItems: "baseline",
              gap: "12px",
            }}
          >
            <div className="text-input-top">
              <ReactSelect
                label={"Select Color"}
                placeholder="Color Name"
                options={_sortOptionsColor}
                value={formState.color}
                onChange={onChange}
                name="color"
                id="idStatus"
                error={errors?.color}
              />
            </div>
            <div className="text-input-top">
              <ReactSelect
                label={"Select Origin"}
                placeholder="Origin Name"
                options={_sortOptionsOrigin}
                value={formState.origin}
                onChange={onChange}
                name="origin"
                id="idStatus"
                error={errors?.origin}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr ",
              alignItems: "baseline",
              gap: "12px",
            }}
          >
            <div className="text-input-top">
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
            <div className="text-input-top">
              <Textinput
                size="small"
                type="number"
                name="price"
                label="Price"
                placeholder="Enter Price"
                value={formState.price}
                onChange={onChange}
                error={errors?.price}
                sx={{ mb: 0, width: "100%" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr ",
              gap: "12px",
            }}
          >
            <div className="text-input-top">
              <Textinput
                size="small"
                type="number"
                name="mLength"
                label="mLength"
                placeholder="Enter mLength"
                value={formState.mLength}
                onChange={onChange}
                error={errors?.mLength}
                sx={{ mb: 0, width: "100%" }}
              />
            </div>
            <div className="text-input-top">
              <Textinput
                size="small"
                type="number"
                name="mWidth"
                label="mWidth"
                placeholder="Enter mWidth"
                value={formState.mWidth}
                onChange={onChange}
                error={errors?.mWidth}
                sx={{ mb: 0, width: "100%" }}
              />
            </div>
            <div className="text-input-top">
              <Textinput
                size="small"
                type="number"
                name="mDepth"
                label="mDepth"
                placeholder="Enter mDepth"
                value={formState.mDepth}
                onChange={onChange}
                error={errors?.mDepth}
                sx={{ mb: 0, width: "100%" }}
              />
            </div>
          </div>
          <div className="text-input-top">
            <Textarea
              size="small"
              type="text"
              name="description"
              maxLength={255}
              minRows={3}
              maxRows={3}
              placeholder="Enter Gem Stone Details"
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

export default GemstoneMasterDetails;
