import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Icon, IconButton, Table } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import Textarea from "../../../../components/UI/Textarea";

const AttributesMasterDetails = ({
  open,
  togglePopup,
  userData,
  editAttributeSingleData,
}) => {
  const [selected, setSelected] = useState([]);
  const [sortNo, setSortNo] = useState("");
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);
  const [trueSelected, setTrueSelected] = useState(false);

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
    imgUrl: "mimes:png,jpg,jpeg|max_file_size:1048576",
    logoUrl: "mimes:png,jpg,jpeg|max_file_size:1048576",
  };

  const handleSubmit = (data) => {
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
    API.get(apiConfig.optionsList, { is_public_url: true }).then((res) => {
      const optionsFromApi = res.map((row) => ({
        label: row.name,
        value: row.id,
      }));
      setOptions(optionsFromApi);

      setFormState((prevFormState) => ({
        ...prevFormState,
        options: optionsFromApi,
      }));
    });
  }, []);

  const handleLogSelectedOption = () => {
    if (selected.length > 0) {
      const selectedOption = selected[0];

      if (selectedOption.value === "true" && trueSelected) {
        setError("Only one 'True' option is allowed.");
      } else {
        setError(null);
        if (selectedOption.value === "true") {
          setTrueSelected(true);
        }

        const combinedData = {
          optionId: selectedOption.value,
          isDefault: sortNo,
        };
        setFormState((prevFormState) => ({
          ...prevFormState,
          options: [...prevFormState.options, combinedData],
        }));
        setSelected([]);
        setSortNo("");
      }
    }
  };

  const handleRemoveOption = (index) => {
    if (formState.options[index].isDefault === "true") {
      setTrueSelected(false);
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

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={`${formState?.id === "" ? "Add" : "Edit"} Attributes`}
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
          <Table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700 whitespace-nowrap">
            <thead className="" style={{ background: "#F3F3F9" }}>
              <tr>
                <th className="table-th">Options</th>
                <th className="table-th">Is Default</th>
                <th className="table-th">Close</th>
              </tr>
            </thead>
            <tbody>
              {formState.options &&
                formState.options.map((data, index) => (
                  <tr key={index}>
                    <td>{getSelectedOptionLabel(data.optionId)}</td>
                    <td>{data.isDefault}</td>
                    <td>
                      <IconButton onClick={() => handleRemoveOption(index)}>
                        <Icon color="error">close</Icon>
                      </IconButton>
                    </td>
                  </tr>
                ))}
              <tr>
                <td>
                  <select
                    value={
                      selected && selected.length > 0 ? selected[0].value : ""
                    }
                    onChange={(e) =>
                      setSelected([
                        {
                          value: e.target.value,
                          label: e.target.value,
                        },
                      ])
                    }
                  >
                    <option value="">Select an option</option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    name="sortNo"
                    value={sortNo}
                    onChange={(e) => setSortNo(e.target.value)}
                    sx={{ mb: 2, mt: 1, width: "100%" }}
                    required
                  >
                    <option value="">Select Is Default</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </td>
                <td>
                  <IconButton onClick={handleLogSelectedOption}>
                    <Icon color="success">save</Icon>
                  </IconButton>
                </td>
              </tr>
              {error && (
                <tr>
                  <td colSpan="3" style={{ color: "red" }}>
                    {error}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default AttributesMasterDetails;
