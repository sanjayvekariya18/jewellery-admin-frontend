import React from "react";
import { TextareaAutosize } from "@mui/material";
import styled from "@emotion/styled";
import ValidationMessages from "../validations/ValidationMessages";

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    width: 100%;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 5px 5px 0 5px;
    // color: ${theme.palette.mode === "dark" ? "#afb8c1" : "#24292f"};
    // background: ${theme.palette.mode === "dark" ? "#24292f" : "#fff"};
    border: 1px solid #0000003b;
  
    &:hover {
      border-color: #34314c;
    }
  
    &:focus {
      border-color: '#1976D2';
      box-shadow: 0 0 0 2px #1976D2;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const styles = {
  error: {
    border: '1px solid red'
  }
}

const Textarea = ({
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
  ...rest
}) => {
  return (
    <div className="mb-3">
      <StyledTextarea
        size="small"
        name={name}
        className={`${error ? 'textInput-error' : ''}`}
        type="text"
        maxLength={255}
        minRows={3}
        maxRows={3}
        placeholder={placeholder}
        value={value}
        label={label}
        onChange={onChange}
        sx={{ mb: 1.5 }}
      />

      <ValidationMessages errors={error} label={label} />
    </div>
  );
};

export default Textarea;
