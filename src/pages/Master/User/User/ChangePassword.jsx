import React, { useState } from "react";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import { apiConfig } from "../../../../config";
import { API } from "../../../../services";
import { toaster } from "../../../../services/helper";
import Textinput from "../../../../components/UI/TextInput";
import { Button } from "@mui/material";

const ChangePassword = ({ open, togglePopup }) => {
  const [isLoader, setIsLoader] = useState(false);

  //  -------------formState --------------
  const [formState, setFormState] = useState({
    oldPassword: "",
    newPassword: "",
  });

  //  -------------Validation --------------
  const rules = {
    oldPassword: "required",
    newPassword: "required",
  };

  //  -------------handle Change Password --------------
  const handleSubmit = (data) => {
    setIsLoader(true);
    API.put(apiConfig.changePassword, data)
      .then((res) => {
        toaster.success("Change Password successfully");
        togglePopup();
      })
      .catch((err) => {
        if (
          err.status === 400 ||
          err.status === 401 ||
          err.status === 409 ||
          err.status === 403 ||
          err.status === 422 ||
          err.status === 500
        ) {
          toaster.error(err.errors.message);
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoader(false);
      });
  };

  // -----------------onChange--------------------
  const onChange = ({ target: { value, name } }) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ThemeDialog
      title={"Change Password"}
      isOpen={open}
      onClose={() => {
        togglePopup();
      }}
    >
      <Validators formData={formState} rules={rules}>
        {({ onSubmit, errors }) => {
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(handleSubmit);
              }}
              action="#"
            >
              <Textinput
                label="Old Password"
                value={formState.oldPassword}
                name="oldPassword"
                // placeholder="Enter Old Password"
                error={errors?.oldPassword}
                type="password"
                onChange={onChange}
                sx={{
                  mb: 2,
                  mt: 1,
                  width: "100%",
                  border: "1px solid #c4c4c4",
                  borderRadius: "5px",
                }}
              />

              <Textinput
                size="small"
                label={"New Password"}
                value={formState.newPassword}
                name="newPassword"
                placeholder="Enter New Password"
                error={errors?.newPassword}
                type="password"
                onChange={onChange}
                sx={{
                  mb: 2,
                  mt: 1,
                  width: "100%",
                  border: "1px solid #c4c4c4",
                  borderRadius: "5px",
                }}
              />
              <div className="mt-4">
                <Button
                  loader={isLoader}
                  color="success"
                  variant="contained"
                  sx={{ width: "20%", borderRadius: 0 }}
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          );
        }}
      </Validators>
    </ThemeDialog>
  );
};

export default ChangePassword;
