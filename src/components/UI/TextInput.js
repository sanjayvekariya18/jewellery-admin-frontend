import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ValidationMessages from "../validations/ValidationMessages";

const Textinput = ({
  type,
  label,
  placeholder = "",
  className = "",
  name,
  readonly,
  value,
  error,
  icon,
  disabled,
  id,
  onChange,
  focused,
  multiline = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Check if the type is "number" and the value is 0, then display "0"
  const displayValue = type === "number" && value === 0 ? "0" : value;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-3">
      <TextField
        size="small"
        focused={focused}
        error={error ? true : false}
        sx={{ mb: 2, mt: 1, ml: 0.5, width: "49.5%" }}
        type={showPassword ? "text" : type} // Dynamically set the type
        {...rest}
        label={label}
        placeholder={placeholder}
        readOnly={readonly}
        value={
          displayValue !== null && displayValue !== undefined
            ? displayValue
            : ""
        }
        disabled={disabled}
        multiline={multiline}
        rows={4}

        inputProps={{
          min: "0",
          accept: "image/png,image/jpg,image/jpeg,image/webp,image/svg",
        }}
        id={id}
        onChange={(event) => {
          if (type === "file") {
            onChange({
              target: {
                name,
                value: event.target.files[0],
              },
            });
          } else {
            onChange(event);
          }
        }}
        name={name}
        InputProps={{
          endAdornment: type === "password" && (
            <InputAdornment position="end">
              <div
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer", paddingTop: "5px" }}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </div>
            </InputAdornment>
          ),
        }}
      />
      <ValidationMessages errors={error} label={label} />
    </div>
  );
};

export default Textinput;
