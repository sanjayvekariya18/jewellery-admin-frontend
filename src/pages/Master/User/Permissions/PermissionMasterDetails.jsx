import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";

const initialValues = {
  id: "",
  permissionName: "",
  permissionGroup: "",
};

const PermissionMasterDetails = ({ open, togglePopup, userData }) => {
  const [formState, setFormState] = useState({ ...initialValues });

  const rules = {
    permissionName: "required",
    permissionGroup: "required",
  };

  // -------------------------------- handle Submit Permission Master ----------------------
  // const handleSubmit = (data) => {
  //   const fd = new FormData();
  //   for (const field in data) {
  //     fd.append(field, data[field]);
  //   }
  //   const apiUrl = apiConfig.permission;

  //   API["post"](apiUrl)
  //     .then(() => {
  //       HELPER.toaster.success("Record created");
  //       togglePopup();
  //     })
  //     .catch((e) => HELPER.toaster.error(e.errors.message));
  // };

  const handleSubmit = (data) => {
    API.post(apiConfig.permission, data)
      .then((res) => {
        HELPER.toaster.success("Record created");
        togglePopup();
      })
      .catch((err) => {
        if (
          err.status === 400 ||
          err.status === 401 ||
          err.status === 409 ||
          err.status === 422 ||
          err.status === 403
        ) {
          HELPER.toaster.error(err.errors.message);
        } else {
          HELPER.toaster.error(err)
        }
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
          title={"Add Permission"}
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
                style={{ marginRight: "20px" }}
                onClick={() => {
                  togglePopup();
                  resetValidation();
                }}
              >
                Cancel
              </Button>
              <Button
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
            name="permissionName"
            label="Permission Name"
            value={formState.permissionName}
            onChange={onChange}
            error={errors?.permissionName}
            sx={{ mb: 2, mt: 1, width: "100%" }}
          />
          <Textinput
            size="small"
            type="text"
            name="permissionGroup"
            label="Permission Group"
            value={formState.permissionGroup}
            onChange={onChange}
            error={errors?.permissionGroup}
            sx={{ mb: 2, mt: 1, width: "100%" }}
          />
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default PermissionMasterDetails;
