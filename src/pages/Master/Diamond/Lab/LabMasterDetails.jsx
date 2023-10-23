import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "./../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";
import Textarea from "../../../../components/UI/Textarea";

const initialValues = {
  id: "",
  labName: "",
  details: "",
};

const LabMasterDetails = ({ open, togglePopup, userData }) => {
  const [formState, setFormState] = useState({ ...initialValues });

  const rules = {
    labName: "required",
  };

  // -------------------------------- handle Submit Lab Master ----------------------
  const handleSubmit = (data) => {
    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === "" ? apiConfig.lab : `${apiConfig.lab}/${data.id}`;

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
          title={`${formState?.id === "" ? "Add" : "Edit"} Lab`}
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
            name="labName"
            label="Enter Lab Name"
            value={formState.labName}
            onChange={onChange}
            error={errors?.labName}
            sx={{ mb: 2, mt: 1, width: "100%" }}
          />
          <Textarea
            size="small"
            name="details"
            type="text"
            maxLength={255}
            minRows={3}
            maxRows={3}
            placeholder="Details"
            value={formState.details}
            onChange={onChange}
            sx={{ mb: 1.5 }}
          />
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default LabMasterDetails;
