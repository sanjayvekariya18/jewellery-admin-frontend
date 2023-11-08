import React, { useState, useCallback } from "react";
import Validators from "../../../../components/validations/Validator";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import { apiConfig } from "../../../../config";
import Textinput from "../../../../components/UI/TextInput";

const ApproveCancelOrder = ({ open, togglePopup, userData }) => {
  const initialValues = {
    orderId: userData,
    cancelAmount: "",
  };
    const rules = {
    cancelAmount: "required",
  };
  const [formState, setFormState] = useState({ ...initialValues });

  const onChange = useCallback((e) => {
    setFormState((prevProps) => {
      return {
        ...prevProps,
        [e.target.name]: e.target.value,
      };
    });
  }, []);

  const handleSubmit = (data) => {
    API.put(apiConfig.approveCancelOrder, data)
      .then((res) => {
        HELPER.toaster.success(res.message);
        togglePopup();
      })
      .catch((e) => {
        HELPER.toaster.error(e);
      });
  };
  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={`${
            formState?.id === "" ? "Order" : "Edit"
          } Approve Cancel Order`}
          isOpen={open}
          maxWidth="sm"
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
            type="number"
            name="cancelAmount"
            label="Cancel Amount"
            placeholder="Enter Cancel Amount"
            value={formState.cancelAmount}
            onChange={onChange}
            error={errors?.cancelAmount}
            sx={{ mb: 0, mt: 1, width: "100%" }}
          />
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default ApproveCancelOrder;
