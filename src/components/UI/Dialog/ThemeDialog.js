import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function ThemeDialog({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = "md",
  fullWidth = true,
  actionBtns,
  className 
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      className={className}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" className="model-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }} className="model-footer">{actionBtns}</DialogActions>
    </Dialog>
  );
}
