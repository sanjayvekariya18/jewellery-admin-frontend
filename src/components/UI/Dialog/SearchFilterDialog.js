import React from "react";
import ThemeDialog from "./ThemeDialog";
import { Button } from "@mui/material";

export default function SearchFilterDialog({
  isOpen,
  onClose,
  children,
  search,
  reset,
}) {
  return (
    <>
      <ThemeDialog
        title={"Search Filter"}
        isOpen={isOpen}
        onClose={onClose}
        actionBtns={
          <>
            <Button variant="outlined" color="secondary" onClick={reset}>
              Reset
            </Button>
            <Button type="submit" color="primary" onClick={search}>
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
