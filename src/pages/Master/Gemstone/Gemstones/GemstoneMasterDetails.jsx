import React, { useCallback, useEffect, useState } from "react";
import Validators from "../../../../components/validations/Validator";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig, appConfig } from "../../../../config";
import { API, HELPER } from "../../../../services";
import ReactSelect from "../../../../components/UI/ReactSelect";
import Textarea from "../../../../components/UI/Textarea";

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
  price: "",
};

const GemstoneMasterDetails = ({ open, togglePopup, userData }) => {
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

  // ------------------Get Shape API --------------------------------

  useEffect(() => {
    API.get(apiConfig.shapeList, { is_public_url: true })
      .then((res) => {
        setShapMaster(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // ------------------------Shape Options --------------------------------
  let _sortOptionsShap = shapMaster.map((option) => ({
    label: option.shape,
    value: option.id,
  }));

  // -----------------handle Submitted------------------------
  const handleSubmit = (data) => {
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

  // -----------------Gemstonetype Options ----------------
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

  // ---------------------Origin Options --------------------
  const sortOptionsOrigin = [
    { label: "Lab", value: "Lab" },
    { label: "Natural", value: "Natural" },
  ];

  let _sortOptionsOrigin = sortOptionsOrigin.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  // -------------------Color Options ----------------
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
              <Button
                style={{ marginLeft: "20px" }}
                type="submit"
                variant="contained"
                color="success"
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
            label="Stock Id"
            placeholder="Enter Stock Id"
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
                type="number"
                name="carat"
                label="Carat"
                placeholder="Enter Carat"
                value={formState.carat}
                onChange={onChange}
                error={errors?.carat}
                sx={{ mb: 0, width: "100%" }}
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
                placeholder="Origin name"
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
                type="text"
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
                type="text"
                name="mLength"
                label="Maximum Length"
                placeholder="Enter Maximum Length"
                value={formState.mLength}
                onChange={onChange}
                error={errors?.mLength}
                sx={{ mb: 0, width: "100%" }}
              />
            </div>
            <div className="text-input-top">
              <Textinput
                size="small"
                type="text"
                name="mWidth"
                label="Maximum Width"
                placeholder="Enter Maximum Width"
                value={formState.mWidth}
                onChange={onChange}
                error={errors?.mWidth}
                sx={{ mb: 0, width: "100%" }}
              />
            </div>
            <div className="text-input-top">
              <Textinput
                size="small"
                type="text"
                name="mDepth"
                label="Maximum Depth"
                placeholder="Enter Maximum Depth"
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
