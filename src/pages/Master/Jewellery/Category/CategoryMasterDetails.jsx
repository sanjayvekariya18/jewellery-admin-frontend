import { Box, Button, Icon, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { API, HELPER } from "../../../../services";
import { apiConfig } from "../../../../config";
import Textinput from "../../../../components/UI/TextInput";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import { Table } from "@mui/material";

const CategoryMasterDetails = ({
  open,
  togglePopup,
  userData,
  fullWidth,
  maxWidth,
}) => {
  const [selected, setSelected] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [sortNo, setSortNo] = useState("");
  const [sortNo2, setSortNo2] = useState("");

  const [options, setOptions] = useState([]);
  const [select, setSelect] = useState([]);

  const [dataList, setDataList] = useState([]);
  const [dataList2, setDataList2] = useState([]);

  // -------------intialization
  const initialValues = {
    id: "",
    name: "",
    details: "",
    imgUrl: "",
    logoUrl: "",
    attributes: dataList,
    productDetails: dataList2,
  };

  // console.log(dataList, "datalist");
  const url = apiConfig.category;

  const [formState, setFormState] = useState({
    ...initialValues,
  });
  // console.log(formState, "formState");

  const rules = {
    name: "required",
    attributes: "required",
    productDetails: "required",
  };
  const handleSubmit = async (values) => {
    // console.log(values, "validate");
    const updatedFormState = {
      ...formState,
      attributes: JSON.stringify(dataList),
      productDetails: JSON.stringify(dataList2),
    };

    API.post(url, updatedFormState)
      .then((res) => {
        HELPER.toaster.success("Record created");
        togglePopup();
        setFormState("");
        setDataList("");
        setDataList2("");
      })
      .catch((err) => {
        console.log(err, "err");
        HELPER.toaster.error(err.errors.message);
      });
  };

  // const handleSubmit = async (data) => {
  //   console.log(data,"data");
  //   const fd = new FormData();
  //   console.log(fd,"fd");
  //   for (const field in data) {
  //     fd.append(field, data[field]);
  //   }
  //   const apiUrl =
  //     data.id === "" ? apiConfig.category : `${apiConfig.category}/${data.id}`;
  //   const updatedFormState = {
  //     ...formState,
  //     attributes: JSON.stringify(dataList),
  //     productDetails: JSON.stringify(dataList2),
  //   };

  //   API[data.id === "" ? "post" : "put"](apiUrl, fd, updatedFormState)
  //     .then(() => {
  //       HELPER.toaster.success(
  //         data.id === "" ? "Record created" : "Record saved"
  //       );
  //       togglePopup();
  //       setDataList('')
  //     })
  //     .catch((e) => {
  //       HELPER.toaster.error(e.errors.message)
  //     });

  // };

  // const handleSubmit = (data) => {
  //   const fd = new FormData();
  //   for (const field in data) {
  //     fd.append(field, data[field]);
  //   }
  //   const apiUrl =
  //     data.id === "" ? apiConfig.shape : `${apiConfig.shape}/${data.id}`;

  //   API[data.id === "" ? "post" : "put"](apiUrl, fd)
  //     .then(() => {
  //       HELPER.toaster.success(
  //         data.id === "" ? "Record created" : "Record saved"
  //       );
  //       togglePopup();
  //     })
  //     .catch((e) => HELPER.toaster.error(e.errors.message));
  // };
  useEffect(() => {
    if (open === true && userData !== null) {
      userData.imgUrl = HELPER.getImageUrl(userData.imgUrl);
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open, userData]);

  const onChange = ({ target: { value, name } }) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    API.get(apiConfig.attributes).then((res) => {
      const optionsFromApi = res.rows.map((row) => ({
        label: row.name,
        value: row.id,
      }));
      setOptions(optionsFromApi);
    });
  }, []);

  useEffect(() => {
    API.get(apiConfig.productDetails).then((res) => {
      setProductDetails(res.rows);
    });
  }, []);

  useEffect(() => {
    API.get(apiConfig.productDetails).then((res) => {
      const optionsFromApi = res.rows.map((row) => ({
        label: row.detailName,
        value: row.id,
      }));
      setSelect(optionsFromApi);
    });
  }, []);

  const handleLogSelectedOption = () => {
    if (selected.length > 0) {
      const selectedOption = selected[0];
      const combinedData = {
        attributeId: selectedOption.value,
        sortNo: sortNo,
      };
      setDataList((prevDataList) => {
        const newDataList = [...prevDataList, combinedData];
        return newDataList;
      });
    }
  };
  const handleLogSelectedOption2 = () => {
    if (selected2.length > 0) {
      const selectedOption = selected2[0];
      const combinedData = {
        productDetailsId: selectedOption.value,
        sortNo: sortNo2,
      };
      setDataList2((prevDataList) => {
        const newDataList = [...prevDataList, combinedData];
        return newDataList;
      });
    }
  };

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors }) => {
        return (
          <ThemeDialog
            title={`${formState?.id === "" ? "Add" : "Edit"} Category`}
            isOpen={open}
            onClose={togglePopup}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            actionBtns={
              <>
                <Box>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={togglePopup}
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
            <>
              <Textinput
                size="small"
                type="text"
                name="name"
                label="Name"
                value={formState.name}
                onChange={onChange}
                error={errors?.name}
                sx={{ mb: 2, mt: 1, width: "100%" }}
              />
              <Textinput
                type="text"
                name="details"
                label="Details"
                value={formState.details}
                onChange={onChange}
                sx={{ mb: 2, mt: 1, ml: 0.5, width: "100%" }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignContent: "center",
                  flexWrap: "unset",
                }}
              >
                <Box sx={{ marginRight: "30px" }}>
                  <p> Image</p>
                  <ImgUploadBoxInput
                    name="imgUrl"
                    onChange={onChange}
                    value={formState?.imgUrl}
                    label={"imgUrl"}
                  />
                </Box>
                <Box>
                  <p> Logo Image</p>
                  <ImgUploadBoxInput
                    name="logoUrl"
                    onChange={onChange}
                    value={formState?.logoUrl}
                    label={"logoUrl"}
                  />
                </Box>
              </Box>
              <div>
                <div>
                  <Table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700 whitespace-nowrap">
                    <thead className="" style={{ background: "#F3F3F9" }}>
                      <tr>
                        <th className="table-th">Attributes</th>
                        <th className="table-th">Sort No</th>
                        <th className="table-th">Save</th>
                        <th className="table-th">Delete</th>
                        <th className="table-th">+</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataList &&
                        dataList.map((data, index) => (
                          <tr key={index}>
                            <td>{data.attributeId}</td>
                            <td>{data.sortNo}</td>
                          </tr>
                        ))}
                      <tr>
                        <td>
                          <select
                            value={
                              selected && selected.length > 0
                                ? selected[0].value
                                : ""
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
                          <Textinput
                            size="small"
                            type="text"
                            name="sortNo"
                            label="sortNo"
                            value={sortNo}
                            onChange={(e) => setSortNo(e.target.value)}
                            sx={{ mb: 2, mt: 1, width: "100%" }}
                            required
                          />
                        </td>
                        <td>
                          <IconButton>
                            <Icon
                              color="success"
                              onClick={handleLogSelectedOption}
                            >
                              save
                            </Icon>
                          </IconButton>
                        </td>
                        <td>
                          <IconButton>
                            <Icon color="error">close</Icon>
                          </IconButton>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700 whitespace-nowrap">
                    <thead className="" style={{ background: "#F3F3F9" }}>
                      <tr>
                        <th className="table-th">Product Details</th>
                        <th className="table-th">Sort No</th>
                        <th className="table-th">Save</th>
                        <th className="table-th">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select
                            value={
                              selected2 && selected2.length > 0
                                ? selected2[0].value
                                : ""
                            }
                            onChange={(e) =>
                              setSelected2([
                                {
                                  value: e.target.value,
                                  label: e.target.value,
                                },
                              ])
                            }
                          >
                            <option value="">Select an option</option>
                            {select.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <Textinput
                            size="small"
                            type="text"
                            name="sortNo"
                            label="sortNo"
                            value={sortNo2}
                            onChange={(e) => setSortNo2(e.target.value)}
                            sx={{ mb: 2, mt: 1, width: "100%" }}
                          />
                        </td>
                        <td>
                          <IconButton>
                            <Icon
                              color="success"
                              onClick={handleLogSelectedOption2}
                            >
                              save
                            </Icon>
                          </IconButton>
                        </td>
                        <td>
                          <IconButton>
                            <Icon color="error">close</Icon>
                          </IconButton>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </>
          </ThemeDialog>
        );
      }}
    </Validators>
  );
};

export default CategoryMasterDetails;
