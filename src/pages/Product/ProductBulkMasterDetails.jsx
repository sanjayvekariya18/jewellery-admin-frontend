import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../services";
import { apiConfig } from "../../config";
import ThemeDialog from "../../components/UI/Dialog/ThemeDialog";
import Validators from "../../components/validations/Validator";
import ReactSelect from "../../components/UI/ReactSelect";
import FileDrop from "../../components/UI/FileDrop";

const ProductBulkMasterDetails = ({ open, togglePopup, callBack }) => {
  const [errorModel, setErrorModel] = useState(false);
  const [err, setErr] = useState("");
  const [errorState, setErrorState] = useState({});
  const [category, setCategory] = useState([]);
  const [store, setStore] = useState("");
  // const [isLoader, setIsLoader] = useState(false);
  const [formState, setFormState] = useState({ productData: null });
  const [selectedFile, setSelectedFile] = useState(null);
  const rules = {
    productData: "required",
  };

  // Fetch category data on component mount
  useEffect(() => {
    API.get(apiConfig.category).then((res) => {
      setCategory(res.rows);
    })
      .catch(() => { })
  }, []);

  // Map category data for ReactSelect component
  const _sortOptionsCategory = category.map((option) => ({
    label: option.name,
    value: option.id,
  }));

  // Handle file download
  const handleDownload = () => {
    if (store && category.length > 0) {
      const foundCategory = category.find((item) => item.id === store);
      if (foundCategory) {
        const categoryName = foundCategory.name;
        API.getExcel(apiConfig.productDownload.replace(":id", store))
          .then((res) => {
            const blob = new Blob([res.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const fileName = `${categoryName} Template.xlsx`;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch((error) => {
            console.error("Error downloading file:", error);
          });
      }
    }
  };

  // Handle file upload submit
  const handleSubmit = () => {
    if (selectedFile) {
      // setIsLoader(true);
      const formData = new FormData();
      formData.append("productData", selectedFile);

      API.post(apiConfig.productBulk, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          HELPER.toaster.success("ProductData added successfully");
          togglePopup();
          callBack();
        })
        .catch((error) => {
          HELPER.toaster.error("Please Check your Excel sheet...");
          if (
            error.errors &&
            error.errors.message &&
            typeof error.errors.message === "object"
          ) {
            setErrorState(error.errors.message);
            setErrorModel(true);
          } else {
            setErr(
              error.errors && error.errors.message
                ? error.errors.message
                : error
            );
            setErrorModel(true);
          }
        })
        .finally(() => {
          // setIsLoader(false);
        });
    }
  };

  const onFileSelected = (selectedFile) => {
    setSelectedFile(selectedFile);
  };

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title="Add Product Bulk"
          maxWidth="sm"
          isOpen={open}
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          actionBtns={
            <>
              <Box>
                <Button
                  style={{ marginLeft: "0px" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                  disabled={!store}
                >
                  Download
                </Button>
                <Button
                  style={{ marginLeft: "20px" }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    togglePopup();
                    resetValidation();
                    setFormState({ productData: null });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={selectedFile === null ? true : false}
                  style={{ marginLeft: "20px" }}
                  type="submit"
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </Box>
              <ThemeDialog
                isOpen={errorModel}
                onClose={() => setErrorModel(false)}
                title="Error"
                maxWidth="sm"
                actionBtns={
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setErrorModel(false);
                      togglePopup();
                    }}
                  >
                    Close
                  </Button>
                }
              >
                <div>
                  <ul>
                    {Object.entries(errorState).map(([key, value]) => {
                      if (Object.keys(value).length > 0) {
                        return (
                          <li key={key} style={{ listStyleType: "none", textTransform: "capitalize", border: "1px dashed #000", marginBottom: "10px" }}>
                            <h2 style={{ borderBottom: "1px dashed #000", padding: "10px 10px 7px", margin: "0px" }}>{key}</h2>
                            {Object.keys(value).map((errorKey, index) => (
                              <ul key={index} style={{ paddingLeft: "50px" }}>
                                {Array.isArray(value[errorKey]) && (
                                  <li key={index} style={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    color: "#D22B2B",
                                    marginBottom: "6px",
                                    listStyleType: "square",

                                    textTransform: "capitalize"
                                  }}>
                                    <b>Row No:- {errorKey}</b>
                                  </li>
                                )}
                                {Array.isArray(value[errorKey]) ? (
                                  <ul>
                                    {value[errorKey].map((error, i) =>
                                      Object.entries(error).map(([k, v]) => (
                                        <li key={i} style={{
                                        }}>
                                          {k}: {v}
                                        </li>
                                      ))
                                    )}
                                  </ul>
                                ) : (
                                  <li> {value[errorKey]}</li>
                                )}
                              </ul>
                            ))}
                          </li>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </ul>
                  <p style={{ fontSize: "18px", fontWeight: "500", color: "#D22B2B" }}>
                    {err}
                  </p>
                </div>
              </ThemeDialog>
            </>
          }
        >
          <Box>
            <div>
              <ReactSelect
                label={"Category"}
                placeholder="Select Category"
                options={_sortOptionsCategory}
                value={_sortOptionsCategory.find(
                  (option) => option.value === store
                )}
                onChange={(selectedSort) => {
                  const selectedId = selectedSort.target.value;
                  setStore(selectedId);
                }}
                name="choices-multi-default"
              />
            </div>
            <FileDrop
              onFileSelected={onFileSelected}
              accept={[
                ".xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              ]}
              icon="cloud_upload"
              label="Drag & drop an Excel file here, or click to select one"
            />
          </Box>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default ProductBulkMasterDetails;
