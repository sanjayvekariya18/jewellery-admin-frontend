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
  actionBtns,
  maxWidth = 'sm',
  fullWidth = true
}) {
  return (
    <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>{actionBtns}</DialogActions>
    </Dialog>
  );
}
