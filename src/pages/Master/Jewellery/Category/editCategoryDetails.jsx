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
  // Card,
  Paper,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { API, HELPER } from "../../../../services";
import { apiConfig } from "../../../../config";
import Textinput from "../../../../components/UI/TextInput";
import Validators from "../../../../components/validations/Validator";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import { Select } from "react-select-virtualized"; // Import Select from react-select-virtualized
import { useNavigate, useParams } from "react-router-dom";
import { pageRoutes } from "../../../../constants/routesList";
import { Breadcrumb, Container } from "../../../../components";
import Textarea from "../../../../components/UI/Textarea";
import error400cover from "../../../../assets/no-data-found-page.png";
import ReactDragListView from "react-drag-listview";
const EditCategoryMasterDetails = () => {
  const [selected, setSelected] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [select, setSelect] = useState([]);
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState([]);

  // -------------initialization
  const initialValues = {
    id: "",
    name: "",
    details: "",
    imgUrl: "",
    logoUrl: "",
    attributes: [],
    productDetails: [],
  };

  const [formState, setFormState] = useState({
    ...initialValues,
  });

  const rules = {
    name: "required",
    attributes: "required",
    productDetails: "required",
    imgUrl: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
    logoUrl: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
  };

  useEffect(() => {
    // Make the API call
    API.get(apiConfig.categoryId.replace(":id", id))
      .then((res) => {
        setCategoryData(res);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleSubmit = (data) => {
    const fd = new FormData();
    const filteredAttributes = formState.attributes.map(
      ({ attributeId, sortNo }) => ({
        attributeId,
        sortNo,
      })
    );
    const filteredProductDetails = formState.productDetails.map(
      ({ productDetailsId, sortNo }) => ({
        productDetailsId,
        sortNo,
      })
    );
    fd.append("attributes", JSON.stringify(filteredAttributes));
    fd.append("productDetails", JSON.stringify(filteredProductDetails));
    for (const field in data) {
      if (field !== "attributes" && field !== "productDetails") {
        fd.append(field, data[field]);
      }
    }
    const apiUrl = apiConfig.categoryId.replace(":id", id);

    API.put(apiUrl, fd)
      .then((res) => {
        HELPER.toaster.success("Record saved");
        setTimeout(() => {
          navigate(pageRoutes.master.jewellery.category);
        }, 300);
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

  useEffect(() => {
    if (
      categoryData &&
      categoryData.attributes &&
      categoryData.productDetails
    ) {
      categoryData.imgUrl = HELPER.getImageUrl(categoryData.imgUrl);
      categoryData.logoUrl = HELPER.getImageUrl(categoryData.logoUrl);

      const attributesData = categoryData.attributes.map((row) => ({
        attributeId: row.attributeId,
        sortNo: row.sortNo,
      }));

      // Product Details
      const productDetailsData = categoryData.productDetails.map((row) => ({
        productDetailsId: row.productDetailsId,
        sortNo: row.sortNo,
      }));

      setFormState({
        ...categoryData,
        attributes: attributesData, // Populate attributes from the loaded data
        productDetails: productDetailsData, // Populate productDetails from the loaded data
      });
    } else {
      setFormState({ ...initialValues });
    }
  }, [categoryData]);

  const onChange = useCallback((e) => {
    setFormState((prevProps) => {
      return {
        ...prevProps,
        [e.target.name]: e.target.value,
      };
    });
  }, []);

  const attributesListData = () => {
    API.get(apiConfig.attributesList, { is_public_url: true }).then((res) => {
      const optionsFromApi = res.map((row) => ({
        label: row.name,
        value: row.id,
      }));
      setOptions(optionsFromApi);
    });
  };
  const productDetailsListData = () => {
    API.get(apiConfig.productDetailsList, { is_public_url: true }).then(
      (res) => {
        setProductDetails(res);
        const selectOptions = res.map((row) => ({
          label: row.detailName,
          value: row.id,
        }));
        setSelect(selectOptions);
      }
    );
  };

  useEffect(() => {
    attributesListData();
    productDetailsListData();
  }, []);

  const handleLogSelectedOption = () => {
    if (selected.length > 0) {
      const selectedOption = selected[0];
      const combinedData = {
        attributeId: selectedOption.value,
        sortNo: parseInt(formState.attributes.length) + 1,
      };
      setFormState((prevFormState) => ({
        ...prevFormState,
        attributes: [...prevFormState.attributes, combinedData],
      }));
      setSelected([]);
    }
  };

  const handleLogSelectedOption2 = () => {
    if (selected2.length > 0) {
      const selectedOption = selected2[0];
      const newProductDetail = {
        productDetailsId: selectedOption.value,
        sortNo: parseInt(formState.productDetails.length) + 1, // Parse to integer
      };
      setFormState((prevFormState) => ({
        ...prevFormState,
        productDetails: [...prevFormState.productDetails, newProductDetail],
      }));
      setSelected2([]);
    }
  };
  //----------------------------Attributes --------------------
  const getAttributesLabel = (id) => {
    const selectedOption = options.find((option) => option.value === id);
    return selectedOption ? selectedOption.label : "";
  };
  const handleRemoveOptionAttributes = (index) => {
    const updatedAttributes = [...formState.attributes];
    updatedAttributes.splice(index, 1); // Remove the item at the specified index
    updateAttributesSortNo(updatedAttributes);
    setFormState((prevFormState) => ({
      ...prevFormState,
      attributes: updatedAttributes,
    }));
  };
  //----------------------------ProductDetails --------------------

  const getProductDetailsLabel = (productDetailsId) => {
    const selectedOption = productDetails.find(
      (option) => option.id === productDetailsId
    );
    return selectedOption ? selectedOption.detailName : "";
  };
  const handleRemoveProductDetails = (index) => {
    const updatedProductDetails = [...formState.productDetails];
    updatedProductDetails.splice(index, 1); // Remove the item at the specified index
    updateProductDetailsSortNo(updatedProductDetails);
    setFormState((prevFormState) => ({
      ...prevFormState,
      productDetails: updatedProductDetails,
    }));
  };
  const updateAttributesSortNo = (updatedAttributes) => {
    // Recalculate the sortNo for the product details
    updatedAttributes.forEach((data, index) => {
      data.sortNo = parseInt(index) + 1; // Parse to integer
    });
  };
  const handleDragEnd = (fromIndex, toIndex) => {
    // Ensure that the dragged row is within bounds
    if (
      fromIndex >= 0 &&
      fromIndex < formState.attributes.length &&
      toIndex >= 0 &&
      toIndex < formState.attributes.length
    ) {
      const updatedAttributes = [...formState.attributes];
      const [draggedItem] = updatedAttributes.splice(fromIndex, 1);
      updatedAttributes.splice(toIndex, 0, draggedItem);
      updateAttributesSortNo(updatedAttributes);
      setFormState((prevFormState) => ({
        ...prevFormState,
        attributes: updatedAttributes,
      }));
      HELPER.toaster.success("Row moved successfully");
    }
  };
  const updateProductDetailsSortNo = (updatedProductDetails) => {
    // Recalculate the sortNo for the product details
    updatedProductDetails.forEach((data, index) => {
      data.sortNo = parseInt(index) + 1; // Parse to integer
    });
  };
  const handleProductDetailsDragEnd = (fromIndex, toIndex) => {
    if (
      fromIndex >= 0 &&
      fromIndex < formState.productDetails.length &&
      toIndex >= 0 &&
      toIndex < formState.productDetails.length
    ) {
      const updatedProductDetails = [...formState.productDetails];
      const [draggedItem] = updatedProductDetails.splice(fromIndex, 1);
      updatedProductDetails.splice(toIndex, 0, draggedItem);

      updateProductDetailsSortNo(updatedProductDetails);

      setFormState((prevFormState) => ({
        ...prevFormState,
        productDetails: updatedProductDetails,
      }));
      HELPER.toaster.success("Row moved successfully");
    }
  };

  // console.log(formState, "---------formState");
  return (
    <Container>
      <Validators formData={formState} rules={rules}>
        {({ onSubmit, errors, resetValidation }) => {
          return (
            <div title={`${formState?.id === "" ? "Add" : "Edit"} Category`}>
              <Box className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Masters", path: pageRoutes.master.user.user },
                    {
                      name: "Category",
                      path: pageRoutes.master.jewellery.category,
                    },
                    { name: "Update" },
                  ]}
                />
              </Box>
              <>
                <Textinput
                  size="small"
                  type="text"
                  name="name"
                  label="Category Name"
                  placeholder="Enter Category Name"
                  value={formState.name}
                  onChange={onChange}
                  error={errors?.name}
                  sx={{ mb: 0, width: "60%" }}
                />
                <div>
                  <div>
                    <div
                      style={{
                        marginTop: "15px",
                        marginBottom: "15px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "18px",
                          fontWeight: "500",
                        }}
                      >
                        Attributes
                      </label>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr  auto",
                        gap: "12px",
                        width: "35%",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <Select
                          placeholder="Select Attributes"
                          options={options}
                          isSearchable
                          value={selected[0] || ""}
                          onChange={(option) => setSelected([option])}
                        />
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
                    {/* Attributes Table */}
                    <ReactDragListView onDragEnd={handleDragEnd}>
                      {/* {categoryData && categoryData.length > 0 ? ( */}
                      <div>
                        <TableContainer
                          component={Paper}
                          className="text-input-top"
                          style={{
                            maxHeight: "450px",
                            overflow: "auto",
                            width: "60%",
                            cursor: "pointer",
                          }}
                        >
                          <Table>
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
                                  style={{
                                    paddingLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  Attributes
                                </TableCell>
                                <TableCell
                                  style={{
                                    paddingLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  Sort No
                                </TableCell>
                                <TableCell
                                  style={{
                                    paddingLeft: "20px",
                                    fontSize: "14px",
                                  }}
                                >
                                  Delete
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {formState.attributes &&
                              formState.attributes.length > 0 ? (
                                formState.attributes.map((data, index) => (
                                  <TableRow key={index}>
                                    <TableCell style={{ paddingLeft: "20px" }}>
                                      {getAttributesLabel(data.attributeId)}
                                    </TableCell>
                                    <TableCell style={{ paddingLeft: "20px" }}>
                                      {data.sortNo}
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        padding: "0px 0px 0px 20px",
                                      }}
                                    >
                                      <IconButton
                                        onClick={() =>
                                          handleRemoveOptionAttributes(index)
                                        }
                                      >
                                        <Icon
                                          color="error"
                                          style={{ padding: "0" }}
                                        >
                                          delete
                                        </Icon>
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={3}
                                    style={{
                                      textAlign: "center",
                                      color: "red",
                                    }}
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
                      </div>
                      {/* ) : ( */}
                      {/* <p>No data found</p> */}
                      {/* )} */}
                    </ReactDragListView>
                  </div>
                  <div>
                    <div
                      style={{
                        marginTop: "15px",
                        marginBottom: "15px",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "18px",
                          fontWeight: "500",
                        }}
                      >
                        Product Details
                      </label>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr  auto",
                        gap: "12px",
                        width: "35%",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <Select
                          placeholder="Select Product Details"
                          options={select}
                          isSearchable
                          value={selected2[0] || ""}
                          onChange={(option) => setSelected2([option])}
                        />
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
                        <IconButton onClick={handleLogSelectedOption2}>
                          <Icon color="success">save</Icon>
                        </IconButton>
                      </div>
                    </div>
                    <ReactDragListView onDragEnd={handleProductDetailsDragEnd}>
                      {/* {categoryData && categoryData.length > 0 ? ( */}
                      <TableContainer
                        component={Paper}
                        className="text-input-top"
                        style={{
                          maxHeight: "450px",
                          overflow: "auto",
                          width: "60%",
                          cursor: "pointer",
                        }}
                      >
                        <Table>
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
                                style={{
                                  paddingLeft: "20px",
                                  fontSize: "14px",
                                }}
                              >
                                Product Details
                              </TableCell>
                              <TableCell
                                style={{
                                  paddingLeft: "20px",
                                  fontSize: "14px",
                                }}
                              >
                                Sort No
                              </TableCell>
                              <TableCell
                                style={{
                                  paddingLeft: "20px",
                                  fontSize: "14px",
                                }}
                              >
                                Delete
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {formState.productDetails &&
                            formState.productDetails.length > 0 ? (
                              formState.productDetails.map((data, index) => (
                                <TableRow key={index}>
                                  <TableCell style={{ paddingLeft: "20px" }}>
                                    {getProductDetailsLabel(
                                      data.productDetailsId
                                    )}
                                  </TableCell>
                                  <TableCell style={{ paddingLeft: "20px" }}>
                                    {data.sortNo}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      padding: "0px 0px 0px 20px",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() =>
                                        handleRemoveProductDetails(index)
                                      }
                                    >
                                      <Icon
                                        color="error"
                                        style={{ padding: "0" }}
                                      >
                                        delete
                                      </Icon>
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  style={{
                                    textAlign: "center",
                                    color: "red",
                                  }}
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
                      {/* ) : ( */}
                      {/* <p>No data found</p> */}
                      {/* )} */}
                    </ReactDragListView>
                  </div>
                </div>
                <div className="text-input-top" style={{ width: "60%" }}>
                  <Textarea
                    size="small"
                    name="details"
                    type="text"
                    maxLength={255}
                    minRows={3}
                    maxRows={3}
                    placeholder="Enter Category Details"
                    value={formState.details}
                    onChange={onChange}
                    sx={{ mb: 1.5 }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "60%",
                  }}
                  className="text-input-top"
                >
                  <div
                    style={{
                      display: "flex",
                      alignContent: "center",
                    }}
                  >
                    <div
                      style={{
                        marginRight: "20px",
                        display: "flex",
                        alignContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <label className="label-class">Logo Image</label>
                      <ImgUploadBoxInput
                        name="logoUrl"
                        onChange={onChange}
                        value={formState?.logoUrl}
                        label="Logo Image"
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
                      style={{ marginLeft: "20px", width: "150px" }}
                      type="submit"
                      variant="contained"
                      color="success"
                      onClick={() => onSubmit(handleSubmit)}
                    >
                      Save
                    </Button>
                  </Box>
                </div>
              </>
            </div>
          );
        }}
      </Validators>
    </Container>
  );
};

export default EditCategoryMasterDetails;
