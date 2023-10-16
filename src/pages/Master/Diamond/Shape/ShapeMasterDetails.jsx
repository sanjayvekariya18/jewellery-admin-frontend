import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "./../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import Textarea from "../../../../components/UI/Pagination/Textarea";
import { apiConfig } from "../../../../config";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";

const initialValues = {
  id: "",
  shape: "",
  description: "",
  image: "",
  rankk: "",
};

const ShapeMasterDetails = ({ open, togglePopup, userData }) => {
  const [formState, setFormState] = useState({ ...initialValues });

  const rules = {
    shape: "required",
  };

  const handleSubmit = (data) => {
    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === "" ? apiConfig.shape : `${apiConfig.shape}/${data.id}`;

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

  const onChangeTextarea = useCallback(
    (e) => {
      setFormState((prevProps) => {
        return {
          ...prevProps,
          [e.target.name]: e.target.value,
        };
      });
    },
    [formState]
  );

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
          title={`${formState?.id === "" ? "Add" : "Edit"} Shape`}
          isOpen={open}
          onClose={togglePopup}
          actionBtns={
            <>
              <ImgUploadBoxInput
                name="image"
                onChange={onChange}
                value={formState?.image}
                label={"Image"}
              />
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
            </>
          }
        >
          {" "}
          <Textinput
            type="text"
            name="rankk"
            label="Rank"
            value={formState.rankk}
            onChange={onChange}
            sx={{ mb: 2, mt: 1, width: "100%" }}
          />
          <Textinput
            type="text"
            name="shape"
            label="Shap"
            value={formState.shape}
            onChange={onChange}
            error={errors?.shape}
            sx={{ mb: 2, mt: 1, width: "100%" }}
          />
          <Textarea
            size="small"
            name="description"
            type="text"
            maxLength={255}
            minRows={3}
            maxRows={3}
            placeholder="Details"
            value={formState.description}
            onChange={onChangeTextarea}
            sx={{ mb: 1.5 }}
          />
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default ShapeMasterDetails;
