import React from "react";
import { TextField } from "@mui/material";
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
  ...rest
}) => {
  //  const displayValue = value !== null && value !== undefined ? value : 0;

  // Check if the type is "number" and the value is 0, then display "0"
  const displayValue = type === "number" && value === 0 ? "0" : value;
  return (
    <div className="mb-3">
      <TextField
        size="small"
        focused={focused}
        error={error ? true : false}
        sx={{ mb: 2, mt: 1, ml: 0.5, width: "49.5%" }}
        type={type}
        {...rest}
        label={label}
        placeholder={placeholder}
        readOnly={readonly}
        // value={value ? value : ""}
        value={
          displayValue !== null && displayValue !== undefined
            ? displayValue
            : ""
        }
        disabled={disabled}
        inputProps={{ min: "0" }}
        id={id}
        onChange={(event) => {
          if (type == "file") {
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
        // invalid={error ? true : false}
      />

      <ValidationMessages errors={error} label={label} />
    </div>
  );
};

export default Textinput;
