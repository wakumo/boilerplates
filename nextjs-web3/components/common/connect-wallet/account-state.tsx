import { Button, Menu, MenuItem } from "@mui/material";
import React, { MouseEventHandler, useState } from "react";

export interface AccountStateProps {
  account: any;
  disconnect: MouseEventHandler<HTMLAnchorElement>;
}

export default function AccountState({
  account,
  disconnect,
}: AccountStateProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {`${account?.substring(0, 5)}...${account?.substring(
          account.length - 4
        )}`}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={disconnect} href="">
          Disconnect
        </MenuItem>
      </Menu>
    </>
  );
}
