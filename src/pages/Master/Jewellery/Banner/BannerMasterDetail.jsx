import React, { useCallback, useEffect, useState } from 'react';
import Validators from '../../../../components/validations/Validator';
import ThemeDialog from '../../../../components/UI/Dialog/ThemeDialog';
import { Box, Button, InputLabel } from "@mui/material";
import CommonButton from '../../../../components/UI/CommonButton';
import { API, HELPER } from '../../../../services';
import { apiConfig } from '../../../../config';
import Textinput from '../../../../components/UI/TextInput';
import ThemeSwitch from '../../../../components/UI/ThemeSwitch';
import ImgUploadBoxInput from '../../../../components/UI/ImgUploadBoxInput';
const BannerMasterDetail = ({ open, togglePopup, userData, callBack }) => {
  const [isLoader, setIsLoader] = useState(false);
  const initialValues = {
    banner_id: "",
    title: "",
    sub_title: "",
    image_url: "",
    button_txt: "",
    button_url: "",
    is_clickable: 0,
    show_button: 0,
    thumbnail_image: ""
  }
  //  -------------formState --------------
  const [formState, setFormState] = useState({
    ...initialValues
  });
  //  -------------Validation --------------

  const rules = {
    button_txt:
      formState.is_clickable == 1 ? "required" : formState.is_clickable == 0,
    button_url:
      formState.is_clickable == 1 ? "required" : formState.is_clickable == 0,

    image_url: "required",
    // menu_id: "required"
  };
  useEffect(() => {
    if (open === true && userData !== null) {
      userData.image_url = HELPER.getImageUrl(userData?.image_url);
      userData.thumbnail_image = HELPER.getImageUrl(userData?.thumbnail_image);
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open]);

  //  --------------handle onSubmit Banner  --------------
  const handleSubmit = (data) => {
    setIsLoader(true);

    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.banner_id === "" ? apiConfig.banner : `${apiConfig.banner}/${data.banner_id}`;

    API[data.banner_id === "" ? "post" : "put"](apiUrl, fd)
      .then(() => {
        HELPER.toaster.success(
          data.banner_id === "" ? "Record created" : "Record saved"
        );
        togglePopup();
        callBack();
      })
      .catch((e) =>
        HELPER.toaster.error(e.errors.message))
      .finally(() => {
        setIsLoader(false);
      });
  };

  // -------------onChange---------------------
  const onChange = ({ target: { value, name } }) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={`${formState?.banner_id === "" ? "Add" : "Edit"} Banner`}
          isOpen={open}
          maxWidth='sm'
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          actionBtns={
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
              <CommonButton
                style={{ marginLeft: "20px" }}
                loader={isLoader}
                type="submit"
                variant="contained"
                color="success"
                onClick={() => onSubmit(handleSubmit)}
              >
                Save
              </CommonButton>
            </Box>
          }
        >
          <Textinput
            label={"Banner Title"}
            value={formState.title}
            name="title"
            placeholder="Enter Banner Title"
            onChange={onChange}
            style={{ width: "100%" }}

          />
          <Textinput
            label={"Sub Title"}
            value={formState.sub_title}
            name="sub_title"
            placeholder="Enter Sub Title"
            onChange={onChange}
            style={{ width: "100%" }}
          />
          <label className="label-class">Profile</label>
          <ImgUploadBoxInput
            name="image_url"
            onChange={onChange}
            value={formState?.image_url}
            // error={errors?.profile}
            label={"image_url"}
          />
          {errors?.image_url && (
            <span style={{ color: "red" }}>Image Is required</span>
          )}

          <div className="mb-3">
            <InputLabel className="form-label" style={{ marginTop: "8px" }}>Thumbnail</InputLabel>
            <ImgUploadBoxInput
              name="thumbnail_image"
              onChange={onChange}
              value={formState?.thumbnail_image}
              // error={errors?.profile}
              label={"thumbnail Image"}
            />
          </div>
          <Textinput
            style={{ width: "100%" }}
            label={"Button Text"}
            value={formState.button_txt}
            error={errors?.button_txt}
            name="button_txt"
            placeholder="Enter Button Text"
            onChange={onChange}
          />

          <Textinput
            style={{ width: "100%" }}
            label={"Button URL"}
            value={formState.button_url}
            error={errors?.button_url}
            name="button_url"
            placeholder="Enter Button URL"
            onChange={onChange}
          />
          <div style={{ display: "flex" }}>
            <div className="mb-3" style={{ marginRight: "20px" }}>
              <InputLabel className="form-label">Is Clickeble</InputLabel>
              {/* <Switch
                name="is_clickable"
                value={formState.is_clickable}
                onChange={onChange}
              /> */}
              <ThemeSwitch
                checked={formState.is_clickable}
                value={formState.is_clickable}
                color="warning"
                onChange={(e) => {
                  setFormState((prev) => ({
                    ...prev,
                    is_clickable: e.target.checked
                  }))
                }}

              />
            </div>
            <div className="mb-3">
              <InputLabel className="form-label">Show Button</InputLabel>
              <ThemeSwitch
                checked={formState.show_button}
                value={formState.show_button}
                color="warning"
                onChange={(e) => {
                  setFormState((prev) => ({

                    ...prev,
                    show_button: e.target.checked
                  }))
                }}
              />
            </div>
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
}

export default BannerMasterDetail;
