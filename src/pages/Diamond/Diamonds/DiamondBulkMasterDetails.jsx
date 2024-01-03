import React, { useState } from "react";
import { API, HELPER } from "../../../services";
import { apiConfig, appConfig } from "../../../config";
import Validators from "../../../components/validations/Validator";
import ThemeDialog from "../../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
import FileDrop from "../../../components/UI/FileDrop";
import CommonButton from "../../../components/UI/CommonButton";

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
  const [isLoader, setIsLoader] = useState(false);

  // validator Js 
  const rules = {
    diamondData: "required",
  };

  // handleSubmit function of a diamond
  const handleSubmit = () => {
    setIsLoader(true);
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
        })
        .finally(() => {
          setIsLoader(false);
        });
    }
  };

  // handleDownload in a diamond data 
  const handleDownload = () => {
    const fileURL = `${appConfig.host}/excelTemplate/Diamond_Data.xlsx`;
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
               
                <CommonButton
                   disabled={selectedFile === null ? true : false}
                  style={{ marginLeft: "20px" }}
                  loader={isLoader}
                  type="submit"
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                >
                  Save
                </CommonButton>
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
                        <div key={i} style={{ border: "1px dashed #000", marginBottom: "10px" }}>
                          <h4 style={{ borderBottom: "1px dashed #000", fontSize: "18px", padding: "10px 10px 7px", margin: "0px" }}>
                            Stock No:
                            <span style={{ color: "#D22B2B" }}>
                              <>
                                {errorCode}
                              </>
                            </span>
                          </h4>
                          <ul>
                            {errorState[errorCode].map(
                              (errorMessageObj, index) => (
                                <li key={index} style={{
                                  fontSize: "16px",
                                  fontWeight: "500",
                                  color: "#D22B2B",
                                  marginBottom: "6px",
                                  listStyleType: "square",
                                  textTransform: "capitalize"
                                }}>
                                  {Object.keys(errorMessageObj)[0]}
                                  <br />
                                  <span style={{
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    color: "#000",
                                    listStyleType: "circle",
                                  }}>
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
                    <p style={{ fontSize: "18px", fontWeight: "500", color: "#D22B2B" }}>
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
          <div>
            {isLoader === true ? <div style={{ marginTop: "20px", textAlign: "center" }}>
              <img
                src="../../../../../../assets/loading.gif"
                alt=""
                srcSet=""
                height={28}
                width={28}
              />
            </div> : null}
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default DiamondBulkMasterDetails;
