import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "./../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import Textarea from "../../../../components/UI/Textarea";
import ReactSelect from "../../../../components/UI/ReactSelect";
import CommonButton from "../../../../components/UI/CommonButton";

const initialValues = {
  id: "",
  detailsGroupId: "",
  detailName: "",
  details: "",
  logoUrl: "",
};

const DetailsMasterDetails = ({
  open,
  togglePopup,
  userData,
  productDetailsGroupId,
  callBack,
}) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [isLoader, setIsLoader] = useState(false);

  const rules = {
    detailsGroupId: "required",
    detailName: "required",
    logoUrl: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
  };

  const handleSubmit = (data) => {
    setIsLoader(true);

    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === ""
        ? apiConfig.productDetails
        : `${apiConfig.productDetails}/${data.id}`;

    API[data.id === "" ? "post" : "put"](apiUrl, fd)
      .then(() => {
        HELPER.toaster.success(
          data.id === "" ? "Record created" : "Record saved"
        );
        togglePopup();
        callBack();
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
          HELPER.toaster.error(err);
        }
      })
      .finally(() => {
        setIsLoader(false);
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
      userData.logoUrl = HELPER.getImageUrl(userData.logoUrl);
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open, userData]);

  let _sortOptions = productDetailsGroupId.map((option) => ({
    label: option.groupName,
    value: option.id,
  }));

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={`${formState?.id === "" ? "Add" : "Edit"} Product Details`}
          isOpen={open}
          maxWidth="sm"
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
                    }}
                  >
                    <label className="label-class">Image</label>
                    <ImgUploadBoxInput
                      name="logoUrl"
                      onChange={onChange}
                      value={formState?.logoUrl}
                      label={"logo Image"}
                    />
                  </div>
                  <div>
                    {errors?.logoUrl && (
                      <p
                        className="text-error"
                        style={{ padding: "0", margin: "0" }}
                      >
                        The logo Image must be a file of type
                        png,jpg,jpeg,svg,webp
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
          <ReactSelect
            label={"Product Details Group Name"}
            placeholder="Select Product Details Group Name"
            options={_sortOptions}
            value={formState.detailsGroupId}
            onChange={onChange}
            name="detailsGroupId"
            error={errors?.detailsGroupId}
          />
          <div className="text-input-top">
            <Textinput
              size="small"
              type="text"
              name="detailName"
              label="Detail Name"
              placeholder="Enter Detail Name"
              value={formState.detailName}
              onChange={onChange}
              error={errors?.detailName}
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
              placeholder="Details"
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

export default DetailsMasterDetails;
