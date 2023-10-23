import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig, appConfig } from "../../../../config";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import Textarea from "../../../../components/UI/Textarea";
import ReactSelect from "../../../../components/UI/ReactSelect";

const initialValues = {
  id: "",
  categoryId: "",
  name: "",
  imgUrl: "",
  logoUrl: "",
  details: "",
};

const SubcategoryMasterDetails = ({
  open,
  togglePopup,
  userData,
  callBack,
}) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [categoryId, setCategoryId] = useState([]);

  const rules = {
    name: "required",
    categoryId: "required",
    imgUrl: "mimes:png,jpg,jpeg|max_file_size:1048576",
    logoUrl: "mimes:png,jpg,jpeg|max_file_size:1048576",
  };

  const handleSubmit = (data) => {
    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === ""
        ? apiConfig.subCategory
        : `${apiConfig.subCategory}/${data.id}`;

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

  useEffect(() => {
    API.get(apiConfig.category, {
      rowsPerPage: appConfig.defaultPerPage,
      page: 0,
    })
      .then((res) => {
        setCategoryId(res.rows);
        callBack();
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  let _sortOptions = categoryId.map((option) => ({
    label: option.name,
    value: option.id,
  }));

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={`${formState?.id === "" ? "Add" : "Edit"} Sub Category`}
          isOpen={open}
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          actionBtns={
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
                  alignContent: "center",
                }}
              >
                <div
                  style={{
                    marginRight: "20px",
                    display: "flex ",
                    alignContent: "center",
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
                <div>
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
          }
        >
          <ReactSelect
            label="Category Name"
            placeholder="Select Category Name"
            options={_sortOptions}
            value={formState.categoryId}
            onChange={onChange}
            name="categoryId"
            error={errors?.categoryId}
          />{" "}
          <div className="text-input-top">
            <Textinput
              type="text"
              name="name"
              label="Sub Category Name"
              placeholder="Enter Option Name"
              value={formState.name}
              error={errors?.name}
              onChange={onChange}
              sx={{ mb: 0, width: "100%" }}
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

export default SubcategoryMasterDetails;
