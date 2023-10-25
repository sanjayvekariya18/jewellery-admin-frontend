import React from "react";
import ThemeDialog from "./ThemeDialog";
import { Button } from "@mui/material";

export default function SearchFilterDialog({
  isOpen,
  onClose,
  children,
  search,
  reset,
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
              Reset
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
