import { Box, Button, InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import { API, HELPER } from "../../../../services";
import { apiEndPoint } from "../../../../constants/routesList";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "./../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";

// inital data
const initialValues = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  profile: "",
};

const UserMasterDetails = ({ open, togglePopup, userData }) => {
  const url = apiEndPoint.user;

  //  -------------formState --------------
  const [formState, setFormState] = useState({
    ...initialValues,
  });
  //  -------------Validation --------------
  const rules = {
    firstName: "required",
    lastName: "required",
    email: "required|email",
    profile: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
  };

  //  --------------handle onSubmit   --------------
  const handleSubmit = (data) => {
    const fd = new FormData();

    for (const field in data) {
      fd.append(field, data[field]);
    }
    if (data.id === "") {
      API.post(url, fd)
        .then(() => {
          HELPER.toaster.success("Record created");
          togglePopup();
        })
        .catch((e) => HELPER.toaster.error(e.errors.message));
    } else {
      API.put(`${url}/${data.id}`, fd)
        .then(() => {
          HELPER.toaster.success("Record saved");
          togglePopup();
        })
        .catch((e) => {
          HELPER.toaster.error(e.errors.message);
        });
    }
  };

  const onChange = ({ target: { value, name } }) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (open === true && userData !== null) {
      userData.profile = HELPER.getImageUrl(userData.image);
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open]);

  return (
    <>
      <Validators formData={formState} rules={rules}>
        {({ onSubmit, errors, resetValidation }) => {
          return (
            <ThemeDialog
              title={`${formState?.id === "" ? "Add" : "Edit"} User`}
              isOpen={open}
              maxWidth="sm"
              onClose={() => {
                togglePopup();
                resetValidation();
              }}
              actionBtns={
                <>
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
                        alignItems: "baseline",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex ",
                          alignItems: "center",
                          flexDirection: "column",
                          // padding: "0px",
                        }}
                      >
                        <label className="label-class">Profile</label>
                        <ImgUploadBoxInput
                          name="profile"
                          onChange={onChange}
                          value={formState?.profile}
                          // error={errors?.profile}
                          label={"Profile Image"}
                        />
                      </div>
                      <div>
                        {errors?.profile && (
                          <p
                            className="text-error"
                            style={{ padding: "0", margin: "0" }}
                          >
                            The Profile image must be a file of type
                            png,jpg,jpeg,svg,webp
                          </p>
                        )}
                      </div>
                    </div>
                    <Box>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          togglePopup();
                          resetValidation();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        style={{ marginLeft: "20px" }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={() => onSubmit(handleSubmit)}
                      >
                        Save
                      </Button>
                    </Box>
                  </div>
                </>
              }
            >
              <>
                <Textinput
                  size="small"
                  type="text"
                  name="firstName"
                  label="First Name"
                  placeholder="Enter First Name"
                  value={formState.firstName}
                  onChange={onChange}
                  error={errors?.firstName}
                  sx={{ mb: 0, mt: 1, width: "100%" }}
                />
                <div className="text-input-top">
                  <Textinput
                    type="text"
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter Last Name"
                    value={formState.lastName}
                    onChange={onChange}
                    error={errors?.lastName}
                    sx={{ mb: 0, width: "100%" }}
                  />
                </div>
                <div className="text-input-top">
                  <Textinput
                    fullWidth={true}
                    size="small"
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Enter Email"
                    value={formState.email}
                    onChange={onChange}
                    error={errors?.email}
                    sx={{ mb: 0 }}
                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="start">@</InputAdornment>
                    //   ),
                    // }}
                  />
                </div>
              </>
            </ThemeDialog>
          );
        }}
      </Validators>
    </>
  );
};

export default UserMasterDetails;
