import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";

const initialValues = {
  id: "",
  gold_price: "",
  platinum_price: "",
  silver_price: "",
};

const MetalPriceMasterDetails = ({ open, togglePopup, userData }) => {
  const [formState, setFormState] = useState({ ...initialValues });

  const rules = {
    gold_price: "required",
    platinum_price: "required",
    silver_price: "required",
  };

  // -------------------------------- handle Submit Lab Master ----------------------
  const handleSubmit = (data) => {
    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === ""
        ? apiConfig.metalPrice
        : `${apiConfig.metalPrice}/${data.id}`;

    API[data.id === "" ? "post" : "put"](apiUrl, fd)
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
          title={"Edit Metal Price"}
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
            name="gold_price"
            label="Gold Price"
            value={formState.gold_price}
            onChange={onChange}
            error={errors?.gold_price}
            sx={{ mb: 2, mt: 1, width: "100%" }}
          />
          <Textinput
            size="small"
            type="text"
            name="platinum_price"
            label="Platinum Name"
            value={formState.platinum_price}
            onChange={onChange}
            error={errors?.platinum_price}
            sx={{ mb: 2, mt: 1, width: "100%" }}
          />
          <Textinput
            size="small"
            type="text"
            name="silver_price"
            label="Silve Price"
            value={formState.silver_price}
            onChange={onChange}
            error={errors?.silver_price}
            sx={{ mb: 2, mt: 1, width: "100%" }}
          />
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default MetalPriceMasterDetails;
