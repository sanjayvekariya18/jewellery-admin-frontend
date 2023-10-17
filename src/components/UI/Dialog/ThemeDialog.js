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
  maxWidth = "lg",
  fullWidth = true,
  actionBtns,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth} aria-labelledby="form-dialog-title"  >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>{actionBtns}</DialogActions>
    </Dialog >
  );
}
