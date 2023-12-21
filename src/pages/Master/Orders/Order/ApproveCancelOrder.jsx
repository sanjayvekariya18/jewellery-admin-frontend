import React, { useState, useCallback } from "react";
import Validators from "../../../../components/validations/Validator";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import { apiConfig } from "../../../../config";
import Textinput from "../../../../components/UI/TextInput";
import ThemeRadioGroup from "../../../../components/UI/ThemeRadioGroup";
import CommonButton from "../../../../components/UI/CommonButton";

const ApproveCancelOrder = ({ open, togglePopup, userData, callBack }) => {
  // initialValues 
  const initialValues = {
    orderId: userData,
    cancelAmount: "",
    status: "approve",
    rejectReason: ""
  };

  const [formState, setFormState] = useState({ ...initialValues });
  const [isLoader, setIsLoader] = useState(false);

  // validatation
  const rules = {
    ...(formState.status === 'approve' && {
      cancelAmount: "required",
    }),
    ...(formState.status === 'reject' && {
      rejectReason: "required",
    }),
  };

  // onChange define
  const onChange = useCallback((e) => {
    setFormState((prevProps) => {
      return {
        ...prevProps,
        [e.target.name]: e.target.value,
      };
    });
  }, []);

  // handleSubmit define
  const handleSubmit = (data) => {
    setIsLoader(true);
    API.put(apiConfig.approveOrRejectCancelOrder, data)
      .then((res) => {
        HELPER.toaster.success(res.message);
        togglePopup();
        callBack();
      })
      .catch((e) => {
        HELPER.toaster.error(e);
      })
      .finally(() => {
        setIsLoader(false);
      });
  };
  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={"Approve or reject request"}
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
              {/* <Button
                style={{ marginLeft: "20px" }}
                type="submit"
                variant="contained"
                color="success"
                onClick={() => onSubmit(handleSubmit)}
              >
                Save
              </Button> */}
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
          <ThemeRadioGroup
            name="status"
            value={formState?.status}
            onChange={(e) => onChange({
              target: {
                name: 'status',
                value: e.target.value
              }
            })}
            options={[
              {
                label: "Approve",
                value: "approve",
                color: "success",
              },
              {
                label: "Reject",
                value: "reject",
                color: "error",
              },
            ]}
          />

          {formState.status === 'approve'
            ? <Textinput
              size="small"
              type="number"
              name="cancelAmount"
              label="Cancel Amount"
              placeholder="Enter Cancel Amount"
              value={formState.cancelAmount}
              onChange={onChange}
              error={errors?.cancelAmount}
              sx={{ mb: 0, mt: 1, width: "100%" }}
            /> :
            <Textinput
              size="small"
              type="text"
              name="rejectReason"
              label="Reject Reason"
              placeholder="Enter Reject Reason"
              value={formState.rejectReason}
              onChange={onChange}
              error={errors?.rejectReason}
              sx={{ mb: 0, mt: 1, width: "100%" }}
            />
          }

        </ThemeDialog>
      )}
    </Validators>
  );
};

export default ApproveCancelOrder;
