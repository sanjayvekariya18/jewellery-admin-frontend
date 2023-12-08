import React, { useState, useCallback } from "react";
import Validators from "../../../../components/validations/Validator";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
import { API, HELPER } from '../../../../services';
import { apiConfig } from '../../../../config';
import Textinput from '../../../../components/UI/TextInput';


const OrderMasterDetail = ({ open, togglePopup, userData ,callBack}) => {
  // initialValues define 
  const initialValues = {
    orderId: userData,
    cancelReason: "",
    cancelAmount: "",
  };

  // validators define
  const rules = {
    cancelAmount: "required",
    cancelReason: "required",
  };

  // formstate define
  const [formState, setFormState] = useState({ ...initialValues });

  // onChange define
  const onChange = useCallback((e) => {
    setFormState((prevProps) => {
      return {
        ...prevProps,
        [e.target.name]: e.target.value,
      };
    });
  }, []);

  // andle submit of cancel Order
  const handleSubmit = (data) => {
    API.post(apiConfig.cancelOrder, data)
      .then((res) => {
        HELPER.toaster.success(res.message);
        togglePopup();
        callBack();
      })
      .catch((e) => {
        HELPER.toaster.error(e);
      });
  };
  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={"Cancel Order"}
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

          <div className="text-input-top">
            <Textinput
              multiline={true}
              size="small"
              label="Order Cancel Reason"
              name="cancelReason"
              type="text"
              placeholder="Enter Order Cancel Reason"
              value={formState.cancelReason}
              error={errors?.cancelReason}
              onChange={onChange}
              sx={{ mb: 0, width: "100%" }}
            />
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default OrderMasterDetail;
