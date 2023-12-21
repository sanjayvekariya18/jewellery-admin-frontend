import React, { useEffect, useState, useCallback } from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig, appConfig } from "../../../../config";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import Textarea from "../../../../components/UI/Textarea";
import ReactSelect from "../../../../components/UI/ReactSelect";
import CommonButton from "../../../../components/UI/CommonButton";

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
  const [isLoader, setIsLoader] = useState(false);

  const rules = {
    name: "required",
    categoryId: "required",
    imgUrl: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
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
        ? apiConfig.subCategory
        : `${apiConfig.subCategory}/${data.id}`;

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
      userData.imgUrl = HELPER.getImageUrl(userData.imgUrl);
      userData.logoUrl = HELPER.getImageUrl(userData.logoUrl);
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open]);

  const fetchCategories = () => {
    API.get(apiConfig.listCategory, { is_public_url: true })
      .then((res) => {
        setCategoryId(res);
      })
      .catch(() => { });
  };
  useEffect(() => {
    fetchCategories();
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
                    alignContent: "center",
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
              <div>
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
                <div>
                  {errors?.imgUrl && (
                    <p
                      className="text-error"
                      style={{ padding: "0", margin: "0" }}
                    >
                      The image must be a file of type png,jpg,jpeg,svg,webp
                    </p>
                  )}
                </div>
              </div>
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
