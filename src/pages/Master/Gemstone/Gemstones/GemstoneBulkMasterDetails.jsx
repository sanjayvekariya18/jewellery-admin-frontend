import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import { apiConfig } from "../../../../config";
import UploadButton from "../../../../components/UI/UploadButton";

const initialValues = {
  gemstoneData: "",
};

const GemstoneBulkMasterDetails = ({ open, togglePopup }) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [errorModel, setErrorModel] = useState(false);
  const [err, setErr] = useState();
  const [errorState, setErrorState] = useState({});

  const rules = {
    gemstoneData: "required",
  };
  const [isLoader, setIsLoader] = useState(false);

  const handleSubmit = (data) => {
    setIsLoader(true);
    API.post(apiConfig.gemstoneBulk, data, {
      headers: {
        "Content-Type": `multipart/form-data;`,
      },
    })
      .then((res) => {
        HELPER.toaster.success("GemStone Bulk added successfully");
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
            error.errors && error.errors.message ? error.errors.message : error
          );
          setErrorModel(true);
        }
      })
      .finally(() => {
        setIsLoader(false);
      });
  };

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title="Add Gem Stone Bulk"
          isOpen={open}
          maxWidth="xs"
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          actionBtns={
            <>
              <Box>
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
                  onClick={() => onSubmit(handleSubmit)}
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
                  {Object.keys(errorState).length > 0 ? (
                    Object.keys(errorState).map((errorCode, index) => (
                      <div key={index}>
                        <h2
                          className="text-error"
                          style={{ fontSize: "18px", fontWeight: "500" }}
                        >
                          Stock No : {errorCode}
                        </h2>
                        <ul>
                          {errorState[errorCode].map(
                            (errorMessageObj, index) => (
                              <li key={index}>
                                {Object.keys(errorMessageObj)[0]} :{" "}
                                <span>{Object.values(errorMessageObj)[0]}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ))
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
            <UploadButton
              onChange={(selectedFile) => {
                setFormState((prevProps) => {
                  return {
                    ...prevProps,
                    gemstoneData: selectedFile,
                  };
                });
              }}
            />
            {errors?.gemstoneData && (
              <p
                className="text-error"
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                File field is required
              </p>
            )}
          </Box>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default GemstoneBulkMasterDetails;
