import React from "react";
import { CircularProgress, Button } from "@mui/material";

const CommonButton = ({ onClick, loader, children, ...rest }) => {
  return (
    <Button variant="contained" color="success" onClick={onClick} {...rest}>
      {loader ? (
        <CircularProgress size={24} thickness={5} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );
};

export default CommonButton;
