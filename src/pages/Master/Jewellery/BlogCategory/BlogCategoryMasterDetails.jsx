import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";
import Textarea from "../../../../components/UI/Textarea";
import CommonButton from "../../../../components/UI/CommonButton";

const initialValues = {
  id: "",
  category_name: "",
  description: "",
};

const BlogCategoryMasterDetails = ({ open, togglePopup, userData }) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [isLoader, setIsLoader] = useState(false);

  const rules = {
    category_name: "required",
  };

  const handleSubmit = (data) => {
    setIsLoader(true);

    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === ""
        ? apiConfig.blogCategory
        : apiConfig.blogCategoryId.replace(":id", data.category_id);

    API[data.id === "" ? "post" : "put"](apiUrl, fd)
      .then(() => {
        HELPER.toaster.success(
          data.id === "" ? "Record created" : "Record saved"
        );
        togglePopup();
      })
      .catch((err) => {
        if (
          err.status === 400 ||
          err.status === 401 ||
          err.status === 409 ||
          err.status === 422 ||
          err.status === 403 ||
          err.status === 500
        ) {
          HELPER.toaster.error(err.errors.message);
        } else {
          console.error(err);
        }
      })
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
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open, userData]);

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={`${formState?.id === "" ? "Add" : "Edit"} Blog Category`}
          isOpen={open}
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          maxWidth="sm"
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
            type="text"
            name="category_name"
            label="Category Name"
            placeholder="Enter Category Name"
            value={formState.category_name}
            onChange={onChange}
            error={errors?.category_name}
            sx={{ mb: 0, mt: 1, width: "100%" }}
          />

          <div className="text-input-top">
            <Textarea
              size="small"
              name="description"
              type="text"
              maxLength={255}
              minRows={3}
              maxRows={3}
              placeholder="Enter Description"
              value={formState.description}
              onChange={onChange}
              sx={{ mb: 1.5 }}
            />
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default BlogCategoryMasterDetails;
