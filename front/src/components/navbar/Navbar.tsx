import {
  AppBar,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Toolbar,
  Tooltip,
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SettingsIcon from "@mui/icons-material/Settings";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "use-http";
import calendarPng from "../../assets/calendar.png";
import userPng from "../../assets/user.png";
import myPetsPng from "../../assets/leash.png";
import groupsPng from "../../assets/veterinary.png";
import { routes } from "../../routes";
import logoPng from "../../assets/logo.png";
import { tokens } from "../../auth/auth-utils";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { post } = useFetch("/auth");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navToGroups = () => {
    navigate(routes.groups);
  };

  const navToPets = () => {
    navigate(routes.pets);
  };

  const navToEditDetails = () => {
    navigate(routes.editDetals);
  };
  const navToCalendar = () => {
    navigate(routes.calendar);
  };

  const logout = () => {
    post("/logout").then(() => {
      tokens.access.delete();
      tokens.refresh.delete();
      navigate(routes.signin);
    });
  };

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <IconButton disableRipple onClick={() => navigate(routes.home)}>
              <img src={logoPng} height="40" alt="logo" />
            </IconButton>
          </Grid>
          <Grid item>
            <Grid container justifyContent="space-around">
              <Grid item>
                <IconButton onClick={navToCalendar}>
                  <Tooltip title="Calender">
                    <img src={calendarPng} height="40" alt="calendar" />
                  </Tooltip>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={navToPets}>
                  <Tooltip title="My Pets">
                    <img src={myPetsPng} height="40" alt="pets" />
                  </Tooltip>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={navToGroups}>
                  <Tooltip title="My Groups">
                    <img src={groupsPng} height="40" alt="groups" />
                  </Tooltip>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={handleClick}>
                  {/* TODO: put the user's profile picture */}
                  <Tooltip title="Account">
                    <img src={userPng} height="40" alt="general" />
                  </Tooltip>
                </IconButton>
                {/* TODO: redirect to the right pages */}
                <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
                  <MenuList dense>
                    <MenuItem
                      onClick={() => {
                        navigate(routes.home);
                        handleClose();
                      }}
                    >
                      <ListItemIcon>
                        <FormatListBulletedIcon />
                      </ListItemIcon>
                      Today&apos;s Tasks
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={navToEditDetails}>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      Update Profile
                    </MenuItem>
                    <MenuItem onClick={logout}>
                      <ListItemIcon>
                        <PowerSettingsNewIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
