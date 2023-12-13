import React, { useState } from "react";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import { apiConfig } from "../../../../config";
import { API, HELPER } from "../../../../services";
import { toaster } from "../../../../services/helper";
import Textinput from "../../../../components/UI/TextInput";
import { Button } from "@mui/material";

const ChangePassword = ({ open, togglePopup }) => {
  const [isLoader, setIsLoader] = useState(false);

  // Form state
  const [formState, setFormState] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Validation rules
  const rules = {
    oldPassword: "required",
    newPassword: "required",
  };

  // Handle Change Password
  const handleSubmit = (data) => {
    setIsLoader(true);
    API.put(apiConfig.changePassword, data)
      .then((res) => {
        toaster.success("Change Password successfully");
        togglePopup();
      })
      .catch((err) => {
        if ([400, 409, 403, 422, 500].includes(err.status)) {
          HELPER.toaster.error(err.errors.message);
        } else if (err.status === 401) {
          HELPER.toaster.error(err.errors);
        } else {
          HELPER.toaster.error(err)
        }
      })
      .finally(() => {
        setIsLoader(false);
      });
  };

  // Handle input changes
  const onChange = ({ target: { value, name } }) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title="Change Password"
          isOpen={open}
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          maxWidth="sm"
          actionBtns={
            <>
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
            </>
          }
        >
          <div className="change-password-component">
            <Textinput
              label="Old Password"
              value={formState.oldPassword}
              placeholder="Enter Old Password"
              name="oldPassword"
              error={errors?.oldPassword}
              type="password"
              onChange={onChange}
              sx={{ mb: 0, mt: 1, width: "100%" }}
            />

            <div className="text-input-top ">
              <Textinput
                label="New Password"
                name="newPassword"
                value={formState.newPassword}
                type="password"
                placeholder="Enter New Password"
                onChange={onChange}
                sx={{ mb: 0, width: "100%" }}
                error={errors?.newPassword}
              />
            </div>
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default ChangePassword;
