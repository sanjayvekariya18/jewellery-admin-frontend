import React from "react";
import { HELPER } from "../../services";
import { Box, Icon, IconButton } from "@mui/material";
import Textinput from "./TextInput";
import ValidationMessages from "../validations/ValidationMessages";

export default function ImgUploadBoxInput({
  error,
  name,
  onChange,
  value,
  label,
  ...rest
}) {
  const randomStr = () => {
    return Math.random(10).toString().slice(2);
  };
  let randomId = "file_upload_" + randomStr();

  return (
    <>
      <Box sx={{ display: "flex", alignContent: "center", flexWrap: "unset" }}>
        <Textinput
          size="small"
          type="file"
          onChange={onChange}
          id={randomId}
          name={name}
          inputProps={{ accept: "image/*" }}
          sx={{ mt: 1, mb: 2, display: "none" }}
          {...rest}
        />
        <label htmlFor={randomId}>
          <IconButton
            color="primary"
            component="span"
            className="button"
            aria-label="Upload picture"
            disableRipple={true}
          >
            {value !== null ? (
              <Box
                id={`image_${randomStr()}`}
                component="img"
                sx={{
                  height: 40,
                  width: 40,
                  maxHeight: { xs: 25, md: 50 },
                  maxWidth: { xs: 25, md: 50 },
                  ...(Boolean(error) && {
                    border: "2px solid #FF3D57",
                  }),
                }}
                src={
                  typeof value == "string" ? value : URL.createObjectURL(value)
                }
                onError={(e) => {
                  e.target.src = "/assets/camera.svg";
                }}
              />
            ) : (
              <Icon style={{ fontSize: "40px" }}>photo_camera</Icon>
            )}
          </IconButton>
        </label>
        {Boolean(!HELPER.isEmpty(error)) && (
          <>
            <ValidationMessages errors={error} label={label} />
          </>
        )}
      </Box>
    </>
  );
}
