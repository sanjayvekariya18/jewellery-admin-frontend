import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../services";
import { apiConfig } from "../../config";
import ThemeDialog from "../../components/UI/Dialog/ThemeDialog";
import Validators from "../../components/validations/Validator";
import ReactSelect from "../../components/UI/ReactSelect";
import { DropzoneArea } from "material-ui-dropzone";
const rules = {
  productData: "required",
};
const ProductBulkMasterDetails = ({ open, togglePopup }) => {
  const [errorModel, setErrorModel] = useState(false);
  const [err, setErr] = useState();
  const [errorState, setErrorState] = useState({});
  const [category, setCategory] = useState([]);
  const [store, setStore] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [formState, setFormState] = useState({ productData: null });
  const [selectedFile, setSelectedFile] = useState(null);

  // category wise select
  useEffect(() => {
    API.get(apiConfig.category).then((res) => {
      setCategory(res.rows);
    });
  }, []);

  let _sortOptionsCategory = category.map((option) => ({
    label: option.name,
    value: option.id,
  }));

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

  // file download handle change
  const handleFileChange = (files) => {
    setSelectedFile(files[0]);
  };

  //  file upload handle submit
  const handleSubmit = () => {
    if (selectedFile) {
      setIsLoader(true);
      const formData = new FormData();
      formData.append("productData", selectedFile);

      API.post(apiConfig.productBulk, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          HELPER.toaster.success("ProductData added successfully");
          togglePopup();
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
          setIsLoader(false);
        });
    }
  };

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title="Add Product Bulk"
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
                >
                  Download
                </Button>
                <Button
                  style={{ marginLeft: "10px" }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    togglePopup();
                    resetValidation();
                    setFormState("");
                  }}
                >
                  Cancel
                </Button>
                <Button
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
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setErrorModel(false);
                      togglePopup();
                    }}
                  >
                    Okay
                  </Button>
                }
              >
                <div>
                  <ul>
                    {Object.entries(errorState).map(([key, value]) => {
                      if (Object.keys(value).length > 0) {
                        return (
                          <li key={key}>
                            <h2>{key}</h2>
                            {Object.keys(value).map((errorKey, index) => (
                              <ul key={index}>
                                {Array.isArray(value[errorKey]) && (
                                  <li
                                    className="text-error"
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    <b>Row No:- {errorKey}</b>
                                  </li>
                                )}
                                {Array.isArray(value[errorKey]) ? (
                                  <ul>
                                    {value[errorKey].map((error, i) =>
                                      Object.entries(error).map(([k, v]) => (
                                        <li key={i}>
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
                  <p
                    className="text-error"
                    style={{ fontSize: "18px", fontWeight: "500" }}
                  >
                    {" "}
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
            {/* <br /> */}

            <div style={{ marginTop: "15px" }}>
              <DropzoneArea
                onChange={handleFileChange}
                acceptedFiles={[
                  ".xlsx",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ]}
                showPreviewsInDropzone
                dropzoneText="Drag and drop your file here or click"
                filesLimit={1}
              />
            </div>
          </Box>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default ProductBulkMasterDetails;
