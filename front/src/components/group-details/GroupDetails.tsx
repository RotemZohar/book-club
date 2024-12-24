import React, { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Box,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WarningIcon from "@mui/icons-material/Warning";
import LogoutIcon from "@mui/icons-material/Logout";
import useFetch from "use-http";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TabPanel from "../tab-panel/TabPanel";
import GroupCarers from "./GroupCarers";
import GroupPets from "./GroupPets";
import Loader from "../loader/Loader";
import { User } from "../../types/user";
import { Pet } from "../../types/pet";
import { RootState } from "../../redux/store";

const GroupDetails = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const currentUserId = useSelector(
    (state: RootState) => state.userReducer._id
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [carers, setCarers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [leaveGroupModal, setLeaveGroupModal] = useState(false);
  const { post, del } = useFetch("/group");
  const {
    data: details,
    loading,
    error,
  } = useFetch(`/group/${groupId}`, {}, [groupId]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (details) {
      setCarers(details.members);
      setPets(details.pets);
    }
  }, [details]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleLeaveGroupOpen = () => {
    setLeaveGroupModal(true);
  };

  const handleLeaveGroupClose = () => {
    setLeaveGroupModal(false);
  };

  const navToEdit = () => {
    navigate(`/group/${groupId}/edit`);
  };

  const deleteUserFromGroup = async (userId: string) => {
    const data = await del(`/${groupId}/user/${userId}`);
    if (data === "Deleted") {
      details.members = details.members.filter(
        (member: User) => member._id !== userId
      );

      details.members = [...details.members];
      setCarers(details.members);
    }
  };

  const addUserToGroup = async (users: User[]) => {
    if (users.length === 0) {
      alert("Please add some members!");
    } else {
      const data = await post(`/${groupId}/Users`, {
        usersIds: users,
      });

      users.forEach((user) => {
        details.members.push(user);
      });

      details.members = [...details.members];
      setCarers(details.members);
    }
  };

  const deletePetFromGroup = async (petId: string) => {
    const data = await del(`/${groupId}/pet/${petId}`);
    if (data === "Deleted") {
      details.pets = details.pets.filter((pet: Pet) => pet._id !== petId);
      details.members = [...details.members];
      setPets(details.pets);
    }
  };

  const addPetToGroup = async (petsToAdd: Pet[]) => {
    if (petsToAdd.length === 0) {
      alert("Please add some pets!");
    } else {
      const arr: Pet[] = [];
      const newPetsToAdd = petsToAdd.reduce((prevVal, pet) => {
        const isExists =
          details.pets.findIndex((cp: Pet) => cp._id === pet._id) !== -1;
        if (!isExists) {
          prevVal.push(pet);
        }
        return prevVal;
      }, arr);

      if (newPetsToAdd.length) {
        await post(`/${groupId}/Pets`, {
          petsIds: newPetsToAdd.map((pet) => pet._id),
        });

        newPetsToAdd.forEach((pet) => {
          details.pets.push(pet);
        });

        details.pets = [...details.pets];
        setPets(details.pets);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
      {error && error.message}
      {details && (
        <Grid container justifyContent="center">
          <Card
            sx={{
              width: 600,
              minHeight: 400,
              m: 3,
            }}
          >
            <CardHeader
              title={
                <Grid container m={1}>
                  <Typography
                    variant="h4"
                    align="left"
                    sx={{ fontWeight: "bold" }}
                  >
                    {details.name}
                  </Typography>
                </Grid>
              }
              subheader={
                <Grid container m={1}>
                  <Typography align="left">{details.description}</Typography>
                </Grid>
              }
              action={
                <Grid container>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon fontSize="large" />
                  </IconButton>
                </Grid>
              }
            />
            <Menu open={openMenu} onClose={handleMenuClose} anchorEl={anchorEl}>
              <MenuList dense>
                <MenuItem
                  onClick={() => {
                    navToEdit();
                    handleMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit Details</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLeaveGroupOpen();
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Leave Group</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
            <Divider />
            <CardContent>
              <Grid container justifyContent="center">
                <Tabs value={value} onChange={handleChange} variant="fullWidth">
                  <Tab label="Pets" />
                  <Tab label="Carers" />
                </Tabs>
              </Grid>
              <TabPanel value={value} index={0}>
                <GroupPets
                  pets={pets}
                  deletePetFromGroup={deletePetFromGroup}
                  addPetsToGroup={addPetToGroup}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <GroupCarers
                  carers={carers}
                  deleteUserFromGroup={deleteUserFromGroup}
                  addUserToGroup={addUserToGroup}
                />
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      )}

      <Dialog
        open={leaveGroupModal}
        onClose={handleLeaveGroupClose}
        maxWidth="xs"
      >
        <DialogTitle style={{ fontWeight: "bold" }}>
          <WarningIcon fontSize="large" color="error" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will permanently remove you from this group. Are you
            sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleLeaveGroupClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              handleLeaveGroupClose();
              await deleteUserFromGroup(currentUserId);
              navigate(-1);
            }}
          >
            Leave Group
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupDetails;
