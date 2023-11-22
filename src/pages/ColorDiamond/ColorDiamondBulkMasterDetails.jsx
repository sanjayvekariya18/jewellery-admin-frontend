import React, { useState } from "react";
import Validators from "../../components/validations/Validator";
import ThemeDialog from "../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../services";
import { apiConfig } from "../../config";
import FileDrop from "../../components/UI/FileDrop";
import { API_BASE_URL_IMG } from "../../constants/config";

const initialValues = {
  colorDiamond: "",
};

const ColorDiamondBulkMasterDetails = ({ open, togglePopup }) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [errorModel, setErrorModel] = useState(false);
  const [err, setErr] = useState();
  const [errorState, setErrorState] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const rules = {
    colorDiamond: "required",
  };
  const [isLoader, setIsLoader] = useState(false);

  const handleSubmit = () => {
    if (selectedFile) {
      setIsLoader(true);
      const formData = new FormData();
      formData.append("colorDiamond", selectedFile);

      API.post(apiConfig.ColoredBulk, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          HELPER.toaster.success("ColoredBulk Bulk added successfully");
          setSelectedFile(null);
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
  const handleDownload = () => {
    const fileURL = `${API_BASE_URL_IMG}/excelTemplate/Colored_Diamond_Data.xlsx`;
    window.open(fileURL, "_blank");
  };
  const onFileSelected = (selectedFile) => {
    setSelectedFile(selectedFile);
  };
  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title="Add Colored Diamond Bulk"
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
          <Box>
            <FileDrop
              onFileSelected={onFileSelected}
              selectedFileNameRemove={selectedFile}
              accept={[
                ".xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              ]}
              icon="cloud_upload"
              label={`Drag & drop an Excel file here, or click to select one ${
                selectedFile === null ? "" : ` (${selectedFile.name})`
              }`}
            />
          </Box>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default ColorDiamondBulkMasterDetails;
