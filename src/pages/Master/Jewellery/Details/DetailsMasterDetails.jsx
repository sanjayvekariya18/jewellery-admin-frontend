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
}) => {
  const [formState, setFormState] = useState({ ...initialValues });

  const rules = {
    detailsGroupId: "required",
    detailName: "required",
  };

  const handleSubmit = (data) => {
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
          console.error(err);
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
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          actionBtns={
            <>
              <ImgUploadBoxInput
                name="logoUrl"
                onChange={onChange}
                value={formState?.logoUrl}
                error={errors?.logoUrl}
                label={"logo Image"}
              />
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
