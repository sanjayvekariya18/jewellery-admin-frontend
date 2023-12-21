import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import Textarea from "../../../../components/UI/Textarea";
import { Select } from "react-select-virtualized";
import error400cover from "../../../../assets/no-data-found-page.png";
import CommonButton from "../../../../components/UI/CommonButton";

const AttributesMasterDetails = ({
  open,
  togglePopup,
  userData,
  editAttributeSingleData,
  callBack
}) => {
  const [selected, setSelected] = useState([]);
  const [sortNo, setSortNo] = useState("false");
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  const [formState, setFormState] = useState({
    id: "",
    name: "",
    details: "",
    imgUrl: "",
    logoUrl: "",
    options: [],
  });

  const rules = {
    name: "required",
    options: "required",
    imgUrl: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
    logoUrl: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
  };

  const handleSubmit = (data) => {
    setIsLoader(true);

    const fd = new FormData();

    for (const field in data) {
      if (field !== "options") {
        fd.append(field, data[field]);
      }
    }

    const optionsArray = data.options.map((option) => ({
      optionId: option.optionId,
      isDefault: option.isDefault,
    }));

    fd.append("options", JSON.stringify(optionsArray));

    const apiUrl =
      data.id === ""
        ? apiConfig.attributes
        : apiConfig.attributesId.replace(":id", data.id);

    API[data.id === "" ? "post" : "put"](apiUrl, fd)
      .then((res) => {
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
          HELPER.toaster.error(err)
        }
      })
      .finally(() => {
        setIsLoader(false);
      });
    // .catch((e) => HELPER.toaster.error(e.errors.message));
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
    API.get(apiConfig.optionsList, { is_public_url: true })
    .then((res) => {
      const optionsFromApi = res.map((row) => ({
        label: row.name,
        value: row.id,
      }))

      setOptions(optionsFromApi);

      setFormState((prevFormState) => ({
        ...prevFormState,
        options: optionsFromApi,
      }));
    })
    .catch(() => { })
  }, []);

  const handleLogSelectedOption = () => {
    if (selected) {
      const selectedValue = selected.value;

      // Check if the selected option is "true"
      const isTrueOption = sortNo === "true";

      // Check if a "True" option already exists in the entire array
      const trueOptionExists = formState.options.some(
        (option) => option.isDefault === "true"
      );

      if (isTrueOption) {
        // If the selected option is "true"
        if (trueOptionExists) {
          // Change any existing "true" option to "false"
          formState.options = formState.options.map((option) => ({
            ...option,
            isDefault: "false",
          }));
        }
      }

      const combinedData = {
        optionId: selectedValue,
        isDefault: sortNo,
      };

      setFormState((prevFormState) => ({
        ...prevFormState,
        options: [...prevFormState.options, combinedData],
      }));

      setSelected(null);
      setSortNo("false"); // Reset the Select to "False" after adding the option
    }
  };
  const handleRemoveOption = (index) => {
    if (formState.options[index].isDefault === "true") {
      setSortNo("false"); // Reset the Select to "False" when removing a "True" option
    }
    setFormState((prevFormState) => ({
      ...prevFormState,
      options: prevFormState.options.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    if (open === true) {
      if (userData !== null) {
        // Handle image URLs for userData
        userData.imgUrl = HELPER.getImageUrl(userData.imgUrl);
        userData.logoUrl = HELPER.getImageUrl(userData.logoUrl);

        const mappedOptions = (
          editAttributeSingleData?.AttributesOptions || []
        ).map((option) => ({
          optionId: option.optionId,
          isDefault: option.isDefault ? "true" : "false",
        }));

        const options = mappedOptions.map((mappedOption) => ({
          optionId: mappedOption.optionId,
          isDefault: mappedOption.isDefault,
        }));

        setFormState((prevFormState) => ({
          ...prevFormState,
          ...userData,
          options: options,
        }));
      } else {
        // Set default form state when userData is null
        setFormState({
          id: "",
          name: "",
          details: "",
          imgUrl: "",
          logoUrl: "",
          options: [],
        });
      }
    }
  }, [open, userData, editAttributeSingleData]);

  const getSelectedOptionLabel = (optionId) => {
    const selectedOption = options.find((option) => option.value === optionId);
    return selectedOption ? selectedOption.label : "";
  };

  const filterOptions = () => {
    return options.filter((option) => {
      const optionValue = option.value;
      const isOptionSelected = formState.options.some(
        (selectedOption) => selectedOption.optionId === optionValue
      );
      return !isOptionSelected;
    });
  };

  // Update filteredOptions when options or selected values change
  useEffect(() => {
    setFilteredOptions(filterOptions());
  }, [options, formState.options]);
 
  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          maxWidth="md"
          title={`${formState?.id === "" ? "Add" : "Edit"} Attributes`}
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
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      marginRight: "20px",
                      display: "flex",
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
                      display: "flex",
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
          <Textinput
            type="text"
            name="name"
            label="Attribute Name"
            value={formState.name}
            onChange={onChange}
            error={errors?.name}
            sx={{ mb: 0, mt: 1, width: "100%" }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "12px",
              alignItems: "center",
            }}
            className="text-input-top"
          >
            <div>
              <Select
                value={selected}
                options={filteredOptions}
                onChange={(selectedOption) => setSelected(selectedOption)}
                isSearchable={true}
                placeholder="Select Option"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={sortNo === "true"}
                onChange={(e) => {
                  setSortNo(e.target.checked ? "true" : "false");
                }}
               
                color="primary"
                id="isDefault-label"
              />
              <label
                className="label-class"
                htmlFor="isDefault-label"
                style={{
                  cursor: "pointer",
                  fontWeight: "400",
                  fontSize: "16px",
                }}
              >
                {" "}
                Is Default
              </label>
            </div>
            <div
              style={{
                border: "1px solid #cccccc",
                padding: "0px 0px 4px 4px",
                borderRadius: "5px",
                width: "39px",
                height: "39px",
              }}
            >
              <IconButton onClick={handleLogSelectedOption}>
                <Icon color="success">save</Icon>
              </IconButton>
            </div>
          </div>
          <div>
            <TableContainer
              component={Paper}
              className="text-input-top"
              style={{ maxHeight: "230px", overflow: "auto" }}
            >
              <Table className="min-w-full">
                <TableHead
                  style={{
                    background: "#e0e2e8",
                    position: "sticky",
                    top: "0",
                    zIndex: 99,
                  }}
                >
                  <TableRow>
                    <TableCell
                      style={{ paddingLeft: "20px", fontSize: "14px" }}
                    >
                      Options
                    </TableCell>
                    <TableCell style={{ fontSize: "14px" }}>
                      Is Default
                    </TableCell>
                    <TableCell style={{ fontSize: "14px" }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formState.options && formState.options.length > 0 ? (
                    formState.options.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ paddingLeft: "20px" }}>
                          {getSelectedOptionLabel(data.optionId)}
                        </TableCell>
                        <TableCell style={{ padding: "0px" }}>
                          <IconButton>
                            <Icon
                              color={
                                data.isDefault === "true" ? "success" : "error"
                              }
                            >
                              {data.isDefault === "true"
                                ? "check_circle"
                                : "cancel"}
                            </Icon>
                          </IconButton>
                        </TableCell>
                        <TableCell style={{ padding: "0px" }}>
                          <IconButton onClick={() => handleRemoveOption(index)}>
                            <Icon color="error">delete</Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        style={{ textAlign: "center", color: "red" }}
                      >
                        <img
                          src={error400cover}
                          width="150px"
                          alt="No data found"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div>
              {errors?.options && (
                <p className="text-error" style={{ marginTop: "5px" }}>
                  Options is required.
                </p>
              )}
            </div>
          </div>

          <div className="text-input-top">
            <Textarea
              size="small"
              name="details"
              type="text"
              maxLength={255}
              minRows={3}
              maxRows={3}
              placeholder="Enter Attributes Details"
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

export default AttributesMasterDetails;
