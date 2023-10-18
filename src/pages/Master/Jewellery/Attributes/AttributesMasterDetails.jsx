import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig, appConfig } from "../../../../config";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import Select from "react-select";
import Textarea from "../../../../components/UI/Textarea";

const initialValues = {
  id: "",
  name: "",
  details: "",
  imgUrl: "",
  logoUrl: "",
  options: [],
};

const AttributesMasterDetails = ({ open, togglePopup, userData, callBack }) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [optionId, setOptionId] = useState([]);

  const rules = {
    name: "required",
    options: "required",
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
        ? apiConfig.attributes
        : `${apiConfig.attributes}/${data.id}`;

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
      userData.image = HELPER.getImageUrl(userData.imgUrl);
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open]);

  useEffect(() => {
    API.get(apiConfig.options, {
      rowsPerPage: appConfig.defaultPerPage,
      page: 0,
    })
      .then((res) => {
        setOptionId(res.rows);
        callBack();
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  let _sortOptions = optionId.map((option) => ({
    label: option.name,
    value: option.id,
    // isDefault: true,
  }));

  // console.log(formState, "formState");

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={`${formState?.id === "" ? "Add" : "Edit"} Attibutes`}
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
                  }}
                >
                  <label>Logo Image</label>
                  <ImgUploadBoxInput
                    name="logoUrl"
                    onChange={onChange}
                    value={formState?.logoUrl}
                    label={"Logo Image"}
                  />
                </div>
                <div>
                  <label>Image</label>
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
            </div>
          }
        >
          {" "}
          <Textinput
            type="text"
            name="name"
            label="Attribute Name"
            value={formState.name}
            onChange={onChange}
            error={errors?.name}
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
          <div style={{ height: "200px" }}>
            <Select
              placeholder="Select Sub Category Name"
              options={_sortOptions}
              isMulti
              // value={_sortOptions.filter((option) =>
              //   formState.options.includes(option.value)
              // )}
              value={formState.options}
              onChange={(selectedOptions) => {
                setFormState((prevProps) => {
                  return {
                    ...prevProps,
                    options: selectedOptions,
                  };
                });
              }}
              name="options"
            />
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default AttributesMasterDetails;
