import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig, appConfig } from "../../../../config";
import ReactSelect from "../../../../components/UI/ReactSelect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";
import moment from "moment";
import CommonButton from "../../../../components/UI/CommonButton";

const initialValues = {
  id: "",
  category_id: "",
  title: "",
  content: "",
  publish_date: "",
  image: "",
};

const BlogMasterDetails = ({
  open,
  togglePopup,
  userData,
  blogCategoryData,
  callBack
}) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [isLoader, setIsLoader] = useState(false);

  const rules = {
    category_id: "required",
    title: "required",
    content: "required",
    publish_date: "required",
    image: "mimes:png,jpg,jpeg,svg,webp|max_file_size:1048576",
  };

  const handleSubmit = (data) => {
    setIsLoader(true);

    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === ""
        ? apiConfig.blog
        : apiConfig.blogId.replace(":id", data.blog_id);

    API[data.id === "" ? "post" : "put"](apiUrl, fd)
      .then(() => {
        HELPER.toaster.success(
          data.id === "" ? "Record created" : "Record saved"
        );
        togglePopup();
        callBack();
      })
      .catch((err) => {
        if (
          err.status === 400 ||
          err.status === 401 ||
          err.status === 409 ||
          err.status === 422 ||
          err.status === 403 ||
          err.status === 500
        ) {
          HELPER.toaster.error(err.errors.message);
        } else {
          HELPER.toaster.error(err)
        }
      })
      .finally(() => {
        setIsLoader(false);
        callBack();
      });
  };

  const onChange = ({ target: { value, name } }) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (open === true && userData !== null) {
      userData.image = HELPER.getImageUrl(userData.featured_image);
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open, userData]);

  // -------------------- React Quil --------------------

  const onChangeQuill = (value) => {
    setFormState((prev) => ({
      ...prev,
      content: value,
    }));
  };
  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
      ],
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  let _sortOptions = blogCategoryData.map((option) => ({
    label: option.category_name,
    value: option.category_id,
  }));

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={`${formState?.id === "" ? "Add" : "Edit"} Blog`}
          isOpen={open}
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          maxWidth="md"
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
                    <label className="label-class">Image</label>
                    <ImgUploadBoxInput
                      name="image"
                      onChange={onChange}
                      value={formState?.image}
                      label={"Image"}
                    />
                  </div>
                  <div>
                    {errors?.image && (
                      <p
                        className="text-error"
                        style={{ padding: "0", margin: "0" }}
                      >
                        The image must be a file of type png,jpg,jpeg,svg,webp
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
              </div>
            </>
          }
        >
          <ReactSelect
            label={"Category Name"}
            placeholder="Select Category Name"
            options={_sortOptions}
            value={formState.category_id}
            onChange={onChange}
            name="category_id"
            error={errors?.category_id}
          />
          <div className="text-input-top">
            <Textinput
              size="small"
              type="text"
              name="title"
              label="Title"
              placeholder="Enter Title"
              value={formState.title}
              onChange={onChange}
              error={errors?.title}
              sx={{ mb: 0, width: "100%" }}
            />
          </div>
          <div className="text-input-top">
            <Textinput
              size="small"
              type="date"
              value={moment(formState.publish_date).format(
                appConfig.dateDisplayEditFormat
              )}
              name="publish_date"
              placeholder="Enter Date"
              // value={formState.publish_date}
              onChange={onChange}
              // error={errors?.publish_date}
              sx={{ mb: 0, width: "100%" }}
            />
            {errors?.publish_date && (
              <p className="text-error">Date Is required</p>
            )}
          </div>
          <div className="text-input-top">
            <label className="label-class">Blog Content</label>
            <div className="snow-editor " style={{ marginTop: "10px" }}>
              <ReactQuill
                value={formState.content}
                style={{ height: "250px", marginBottom: "50px" }}
                onChange={onChangeQuill}
                modules={modules}
                formats={formats}
              />
              {errors?.content && (
                <p className="text-error">Blog Content Is required</p>
              )}
            </div>
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default BlogMasterDetails;
