import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../services";
import ThemeDialog from "../../components/UI/Dialog/ThemeDialog";
import Validators from "../../components/validations/Validator";
import Textinput from "../../components/UI/TextInput";
import { apiConfig } from "../../config";
import CommonButton from "../../components/UI/CommonButton";

const initialValues = {
  discount: "",
};

const DiscountDetails = ({ open, togglePopup, userData }) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [isLoader, setIsLoader] = useState(false);

  const rules = {
    discount: "required|numeric|between:0,100",
  };

  const handleSubmit = (data) => {
    setIsLoader(true);

    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === ""
        ? apiConfig.diamondDiscount
        : `${apiConfig.diamondDiscount}/${data.id}`;

    API[data.id === "" ? "post" : "put"](apiUrl, fd)
      .then(() => {
        HELPER.toaster.success(
          data.id === "" ? "Record created" : "Record saved"
        );
        togglePopup();
      })
      .catch((e) => HELPER.toaster.error(e.errors.message))
      .finally(() => {
        setIsLoader(false);
      });
  };

  const onChange = ({ target: { value, name } }) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (open === true && userData !== null) {
      userData.profile = HELPER.getImageUrl(userData.image);
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open]);

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          maxWidth="sm"
          title={`Edit Discount`}
          isOpen={open}
          onClose={togglePopup}
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
            type="number"
            name="discount"
            label="Discount"
            placeholder="Enter Discount"
            value={formState.discount}
            onChange={onChange}
            error={errors?.discount}
            sx={{ mb: 0, mt: 1, width: "100%" }}
          />
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default DiscountDetails;
