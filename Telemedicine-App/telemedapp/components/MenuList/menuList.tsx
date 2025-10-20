import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";

const MenuList = ({
  linkTo,
  linkName,
  text,
  onSignOut,
}: {
  linkTo: string[];
  linkName: string[];
  text: React.ReactNode;
  onSignOut?: () => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {text}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {linkName.map((name, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClose();
              if (name === "Sign Out" && onSignOut) {
                onSignOut(); // Call sign out when "Sign Out" is clicked
              }
            }}
          >
            {name === "Sign Out" ? (
              name
            ) : (
              <Link href={linkTo[index]}>{name}</Link>
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MenuList;
