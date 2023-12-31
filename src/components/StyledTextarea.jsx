import styled from "@emotion/styled";
import { TextareaAutosize } from "@mui/material";

export default styled(TextareaAutosize)(
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