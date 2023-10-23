import React, { useState } from "react";
import { API, HELPER } from "../../../services";
import { apiConfig } from "../../../config";
import Validators from "../../../components/validations/Validator";
import ThemeDialog from "../../../components/UI/Dialog/ThemeDialog";
import { Box, Button } from "@mui/material";
// import { Box, Button } from "@mui/material";
// import { API, HELPER } from "../../../../services";
// import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
// import Validators from "../../../../components/validations/Validator";
// import { apiConfig } from "../../../../config";
// import UploadButton from "../../../../components/UI/UploadButton";
import UploadButton from "../../../components/UI/UploadButton";

const initialValues = {
  diamondData: ""
};

const DiamondBulkMasterDetails = ({
  open,
  togglePopup,
}) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [errorModel, setErrorModel] = useState(false);
  const [errorState, setErrorState] = useState({});

  const rules = {
    diamondData: "required"
  };
  const [isLoader, setIsLoader] = useState(false);

  const handleSubmit = (data) => {
    setIsLoader(true);
    API.post(apiConfig.diamondsBulk, data, {
      headers: {
        "Content-Type": `multipart/form-data;`,
      },
    })
      .then((res) => {
        HELPER.toaster.success("Diamond Bulk added successfully");
        togglePopup()
      })
      .catch((error) => {
        HELPER.toaster.error(error.errors.message);
        HELPER.toaster.error("Please Check your Excel sheet...");
        if (error.errors && error.errors.message) {
          setErrorState(error.errors.message);
          setErrorModel(true);
        }
      })
      .finally(() => {
        setIsLoader(false);
      });
  };
  console.log(errorState, "error1");

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title="Add Diamond Bulk"
          isOpen={open}
          maxWidth="xs"
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          actionBtns={
            <>
              <Box>
                <UploadButton
                  onChange={(selectedFile) => {
                    setFormState((prevProps) => {
                      return {
                        ...prevProps,
                        diamondData: selectedFile,
                      };
                    });
                  }}
                />
                {errors?.diamondData && <p className="text-error">File field is required</p>}
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    togglePopup();
                    resetValidation();
                    setFormState("")
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

              <ThemeDialog isOpen={errorModel} onClose={() => setErrorModel(false)} title="Error" maxWidth="sm" actionBtns={<Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setErrorModel(false);
                  togglePopup();
                }}
              >
                Okay
              </Button>}>
                {/* <div>
                  {Object.keys(errorState).length > 0 ? (
                    Object.keys(errorState).map((errorCode, index) => (
                      <div key={index}>
                        <h2>Stock No: {errorCode}</h2>
                        <ul>
                          {errorState[errorCode].map((errorMessageObj, index) => (
                            <li key={index}>
                              {Object.keys(errorMessageObj)[0]}   : <span>{Object.values(errorMessageObj)[0]}</span>
                            </li>

                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p>No errors to display</p>
                  )}

                </div> */}
              </ThemeDialog>
            </>
          }
        >
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default DiamondBulkMasterDetails;

