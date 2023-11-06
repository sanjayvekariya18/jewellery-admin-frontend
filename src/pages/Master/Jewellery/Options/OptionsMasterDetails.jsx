import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import Textarea from "../../../../components/UI/Textarea";

const initialValues = {
  id: "",
  name: "",
  imgUrl: "",
  logoUrl: "",
  details: "",
};

const OptionsMasterDetails = ({ open, togglePopup, userData }) => {
  const [formState, setFormState] = useState({ ...initialValues });

  const rules = {
    name: "required",
    imgUrl: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
    logoUrl: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
  };

  const handleSubmit = (data) => {
    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === "" ? apiConfig.options : `${apiConfig.options}/${data.id}`;

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
      userData.imgUrl = HELPER.getImageUrl(userData.imgUrl);
      userData.logoUrl = HELPER.getImageUrl(userData.logoUrl);
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open]);

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={`${formState?.id === "" ? "Add" : "Edit"} Options`}
          isOpen={open}
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          actionBtns={
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex ",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex ",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      marginRight: "20px",
                      display: "flex ",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <label className="label-class">Logo Image</label>
                    <ImgUploadBoxInput
                      name="logoUrl"
                      onChange={onChange}
                      value={formState?.logoUrl}
                      label={"Logo Image"}
                    />
                  </div>
                  <div
                    style={{
                      marginRight: "20px",
                      display: "flex ",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <label className="label-class">Image</label>
                    <ImgUploadBoxInput
                      name="imgUrl"
                      onChange={onChange}
                      value={formState?.imgUrl}
                      label={"Image"}
                    />
                  </div>
                </div>
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
              </div>
              <div>
                <div>
                  {errors?.logoUrl && (
                    <p
                      className="text-error"
                      style={{ padding: "0", margin: "0" }}
                    >
                      The logo Url must be a file of type png,jpg,jpeg,svg,webp
                    </p>
                  )}
                </div>
                <div>
                  {errors?.imgUrl && (
                    <p
                      className="text-error"
                      style={{ padding: "0", margin: "0" }}
                    >
                      The image Url must be a file of type png,jpg,jpeg,svg,webp
                    </p>
                  )}
                </div>
              </div>
            </div>
          }
        >
          {" "}
          <div>
            <Textinput
              type="text"
              name="name"
              label="Option Name"
              placeholder="Enter Option Name"
              value={formState.name}
              error={errors?.name}
              onChange={onChange}
              sx={{ mb: 0, mt: 1, width: "100%" }}
            />
          </div>
          <div className="text-input-top">
            <Textarea
              size="small"
              name="details"
              type="text"
              maxLength={255}
              minRows={3}
              maxRows={3}
              placeholder="Enter Option Details"
              value={formState.details}
              onChange={onChange}
              sx={{ mb: 1.5 }}
            />
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default OptionsMasterDetails;
