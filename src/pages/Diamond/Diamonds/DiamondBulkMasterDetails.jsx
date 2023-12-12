import React, { useState } from "react";
import { API, HELPER } from "../../../services";
import { apiConfig } from "../../../config";
import Validators from "../../../components/validations/Validator";
import ThemeDialog from "../../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
import FileDrop from "../../../components/UI/FileDrop";
import { API_BASE_URL_IMG } from "../../../constants/config";

// intialValues define
const initialValues = {
  gemstoneData: "",
};

const DiamondBulkMasterDetails = ({ open, togglePopup, callBack }) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [errorModel, setErrorModel] = useState(false);
  const [err, setErr] = useState();
  const [errorState, setErrorState] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  // validator Js 
  const rules = {
    diamondData: "required",
  };

  // handleSubmit function of a diamond
  const handleSubmit = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("diamondData", selectedFile);

      API.post(apiConfig.diamondsBulk, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          HELPER.toaster.success("DiamondsBulk Bulk added successfully");
          setSelectedFile(null);
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
        });
    }
  };

  // handleDownload in a diamond data 
  const handleDownload = () => {
    const fileURL = `${API_BASE_URL_IMG}/excelTemplate/Diamond_Data.xlsx`;
    window.open(fileURL, "_blank");
  };
  const onFileSelected = (selectedFile) => {
    setSelectedFile(selectedFile);
  };
  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title="Add Diamond Bulk"
          isOpen={open}
          maxWidth="sm"
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
                  style={{ marginLeft: "20px" }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    togglePopup();
                    resetValidation();
                    setFormState("");
                    setSelectedFile(null);
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
                onClose={() => {
                  setErrorModel(false);
                  togglePopup();
                }}
                title="Error"
                maxWidth="sm"
                actionBtns={
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setErrorModel(false);
                      setSelectedFile(null);
                    }}
                  >
                    Close
                  </Button>
                }
              >
                <div>
                  {Object.keys(errorState).length > 0 ? (
                    Object.keys(errorState).map((errorCode, i) => {
                      return (
                        <div key={i}>
                          <h2
                            className="text-error"
                            style={{ fontSize: "18px", fontWeight: "500" }}
                          >
                            Stock No: {errorCode}
                          </h2>
                          <ul>
                            {errorState[errorCode].map(
                              (errorMessageObj, index) => (
                                <li key={index}>
                                  {Object.keys(errorMessageObj)[0]} :{" "}
                                  <span>
                                    {Object.values(errorMessageObj)[0]}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      );
                    })
                  ) : (
                    <p
                      className="text-error"
                      style={{ fontSize: "18px", fontWeight: "500" }}
                    >
                      {err}
                    </p>
                  )}
                </div>
              </ThemeDialog>
            </>
          }
        >

          {/* file drag and drop code */}
          <Box>
            <FileDrop
              onFileSelected={onFileSelected}
              selectedFileNameRemove={selectedFile}
              accept={[
                ".xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              ]}
              icon="cloud_upload"
              label={`Drag & drop an Excel file here, or click to select one ${selectedFile === null ? "" : ` (${selectedFile.name})`
                }`}
            />
          </Box>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default DiamondBulkMasterDetails;
