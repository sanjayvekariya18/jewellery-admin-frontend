import { Box, Icon, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";

const ITEM_HEIGHT = 48;

function MaxHeightMenu({ optionsMenu }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <Box>
      <IconButton
        aria-label="More"
        aria-owns={open ? "long-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Icon>more_vert</Icon>
      </IconButton>

      <Menu
        open={open}
        id="long-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 4.5, width: 200 } }}
      >
        {optionsMenu.map((optionItem) => (
          <MenuItem
            key={optionItem.key}
            onClick={() => {
              optionItem.onClick();
              handleClose(); // Close the menu after an option is clicked
            }}
          >
            {optionItem.key}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default MaxHeightMenu;
