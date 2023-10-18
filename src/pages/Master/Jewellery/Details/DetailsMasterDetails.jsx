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
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    togglePopup();
                    resetValidation();
                  }}
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
          <ReactSelect
            label={"Product Details Group Name"}
            placeholder="Select Product Details Group Name"
            options={_sortOptions}
            value={formState.detailsGroupId}
            onChange={onChange}
            name="detailsGroupId"
            error={errors?.detailsGroupId}
          />
          <Textinput
            size="small"
            type="text"
            name="detailName"
            label="Detail Name"
            value={formState.detailName}
            onChange={onChange}
            error={errors?.detailName}
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
            onChange={onChange}
            sx={{ mb: 1.5 }}
          />
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default DetailsMasterDetails;
