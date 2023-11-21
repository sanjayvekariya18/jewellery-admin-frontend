import React from "react";
import ThemeDialog from "./ThemeDialog";
import { Button, CircularProgress } from "@mui/material";

export default function SearchFilterDialog({
  isOpen,
  onClose,
  children,
  search,
  reset,
  loader,
  maxWidth = "md",
}) {
  return (
    <>
      <ThemeDialog
        title={"Search Filter"}
        isOpen={isOpen}
        onClose={onClose}
        maxWidth={maxWidth}
        actionBtns={
          <>
            <Button variant="contained" color="secondary" onClick={reset}>
              {loader ? (
                <CircularProgress size={24} thickness={5} color="inherit" />
              ) :
                "Reset"
              }
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={search}
            >
              Search
            </Button>
          </>
        }
      >
        {children}
      </ThemeDialog>
    </>
  );
}
