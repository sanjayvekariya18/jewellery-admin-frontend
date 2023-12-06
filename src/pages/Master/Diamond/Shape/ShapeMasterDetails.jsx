import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "./../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import Textarea from "../../../../components/UI/Textarea";
import CommonButton from "../../../../components/UI/CommonButton";

const initialValues = {
  id: "",
  shape: "",
  description: "",
  image: "",
  rankk: "",
};

const ShapeMasterDetails = ({ open, togglePopup, userData ,callBack}) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [isLoader, setIsLoader] = useState(false);

  const rules = {
    rankk: "required|integer",
    shape: "required",
    image: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
  };

  const handleSubmit = (data) => {
    setIsLoader(true);

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
        callBack();
      })
      .catch((e) => HELPER.toaster.error(e.errors.message))
      .finally(() => {
        setIsLoader(false);
        callBack();
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
      userData.image = HELPER.getImageUrl(userData.imgUrl);
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open]);

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          maxWidth="sm"
          title={`${formState?.id === "" ? "Add" : "Edit"} Shape`}
          isOpen={open}
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          actionBtns={
            <>
              <div
                style={{
                  display: "flex ",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* <label className="label-class">Image</label> */}
                <div
                  style={{
                    display: "flex ",
                    alignItems: "baseline",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex ",
                      alignItems: "center",
                      flexDirection: "column",
                      // padding: "0px",
                    }}
                  >
                    <label className="label-class">Image</label>
                    <ImgUploadBoxInput
                      name="image"
                      onChange={onChange}
                      value={formState?.image}
                      label={"Image"}
                    />
                  </div>
                  <div>
                    {errors?.image && (
                      <p
                        className="text-error"
                        style={{ padding: "0", margin: "0" }}
                      >
                        The image must be a file of type png,jpg,jpeg,svg,webp
                      </p>
                    )}
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
              </div>
            </>
          }
        >
          <Textinput
            type="number"
            name="rankk"
            label="Rank"
            placeholder="Enter Rank"
            value={formState.rankk}
            onChange={onChange}
            error={errors?.rankk}
            sx={{ mb: 0, mt: 1, width: "100%" }}
          />
          <div className="text-input-top">
            <Textinput
              type="text"
              name="shape"
              label="Shap"
              placeholder="Enter Shap"
              value={formState.shape}
              onChange={onChange}
              error={errors?.shape}
              sx={{ mb: 0, width: "100%" }}
            />
          </div>
          <div className="text-input-top">
            <Textarea
              size="small"
              name="description"
              type="text"
              maxLength={255}
              minRows={3}
              maxRows={3}
              placeholder="Enter Shape Description"
              value={formState.description}
              onChange={onChange}
            />
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default ShapeMasterDetails;
