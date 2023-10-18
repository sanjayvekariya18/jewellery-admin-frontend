import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../services";
import ThemeDialog from "../../components/UI/Dialog/ThemeDialog";
import Validators from "../../components/validations/Validator";
import Textinput from "../../components/UI/TextInput";
import { apiConfig } from "../../config";


const initialValues = {
  discount: ""
};

const DiscountDetails = ({ open, togglePopup, userData }) => {
  const [formState, setFormState] = useState({ ...initialValues });

  const rules = {
    discount: "required",
  };

  const handleSubmit = (data) => {
    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === "" ? apiConfig.diamondDiscount : `${apiConfig.diamondDiscount}/${data.id}`;

    API[data.id === "" ? "post" : "put"](apiUrl, fd)
      .then(() => {
        HELPER.toaster.success(
          data.id === "" ? "Record created" : "Record saved"
        );
        togglePopup();
      })
      .catch((e) => HELPER.toaster.error(e.errors.message));
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
      {({ onSubmit, errors }) => (
        <ThemeDialog
          title={`Edit Discount`}
          isOpen={open}
          onClose={togglePopup}
          actionBtns={
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={togglePopup}
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
            name="discount"
            label="discount"
            value={formState.discount}
            onChange={onChange}
            error={errors?.discount}
            sx={{ mb: 2, mt: 1, width: "50%" }}
          />
         
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default DiscountDetails;
