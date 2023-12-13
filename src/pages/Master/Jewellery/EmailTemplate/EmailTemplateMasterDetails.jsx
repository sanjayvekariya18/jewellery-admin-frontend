import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { API, HELPER } from "../../../../services";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import { apiConfig } from "../../../../config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import CommonButton from "../../../../components/UI/CommonButton";

function generateUniqueKey() {
  return new Date().getTime().toString();
}
const initialValues = {
  id: "",
  template_name: "",
  subject: "",
  body: "",
  key: generateUniqueKey(),
};

const EmailTemplateMasterDetails = ({ open, togglePopup, userData, callBack }) => {
  const [formState, setFormState] = useState({ ...initialValues });
  const [isLoader, setIsLoader] = useState(false);

  const rules = {
    template_name: "required",
    subject: "required",
    body: "required",
  };

  const handleSubmit = (data) => {
    setIsLoader(true);

    const fd = new FormData();
    for (const field in data) {
      fd.append(field, data[field]);
    }
    const apiUrl =
      data.id === ""
        ? apiConfig.emailTemplate
        : apiConfig.emailTemplateId.replace(":id", data.template_id);

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
      setFormState(userData);
    } else {
      setFormState({ ...initialValues });
    }
  }, [open, userData]);

  // -------------------- React Quil --------------------

  const onChangeQuill = (value) => {
    setFormState((prev) => ({
      ...prev,
      body: value,
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
        ["link"],
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

  return (
    <Validators formData={formState} rules={rules}>
      {({ onSubmit, errors, resetValidation }) => (
        <ThemeDialog
          title={`${formState?.id === "" ? "Add" : "Edit"} Email Template`}
          isOpen={open}
          onClose={() => {
            togglePopup();
            resetValidation();
          }}
          maxWidth="md"
          actionBtns={
            <>
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
            </>
          }
        >
          <Textinput
            size="small"
            type="text"
            name="template_name"
            label="Template Name"
            placeholder="Enter Template Name"
            value={formState.template_name}
            onChange={onChange}
            error={errors?.template_name}
            sx={{ mb: 0, mt: 1, width: "100%" }}
          />
          <div className="text-input-top">
            <Textinput
              size="small"
              type="text"
              name="subject"
              label="Subject Name"
              placeholder="Enter Subject Name"
              value={formState.subject}
              onChange={onChange}
              error={errors?.subject}
              sx={{ mb: 0, width: "100%" }}
            />
          </div>
          <div className="text-input-top">
            <label className="label-class">Body</label>
            <div className="snow-editor " style={{ marginTop: "10px" }}>
              <ReactQuill
                value={formState.body}
                style={{ height: "250px", marginBottom: "50px" }}
                onChange={onChangeQuill}
                modules={modules}
                formats={formats}
              />
              {errors?.body && <p className="text-error">Body Is required</p>}
            </div>
          </div>
        </ThemeDialog>
      )}
    </Validators>
  );
};

export default EmailTemplateMasterDetails;
