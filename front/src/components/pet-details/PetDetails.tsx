import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import {
  IconButton,
  Tab,
  Tabs,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
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
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import useFetch, { CachePolicies } from "use-http";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Member, Pet as petDetails } from "../../types/pet";
import PetTasks from "./PetTasks";
import PetCarers from "./PetCarers";
import PetMedical from "./PetMedical";
import TabPanel from "../tab-panel/TabPanel";
import PetGroups from "./petGroups";
import { User } from "../../types/user";
import Loader from "../loader/Loader";
import { RootState } from "../../redux/store";

const getAge = (birthdate: Date) => {
  const today = new Date();
  birthdate = new Date(birthdate);
  const age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    return age - 1;
  }
  return age;
};

const PetDetails = () => {
  const navigate = useNavigate();
  const { get, loading, error } = useFetch("/pet", {
    cachePolicy: CachePolicies.NO_CACHE,
  });
  const currentUserId = useSelector(
    (state: RootState) => state.userReducer._id
  );
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [details, setDetails] = useState<petDetails>();
  const [leavePetModal, setLeavePetModal] = useState(false);
  const { petId } = useParams();
  const { del, put } = useFetch("/pet", {
    cachePolicy: CachePolicies.NO_CACHE,
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLeavePetOpen = () => {
    setLeavePetModal(true);
  };

  const handleLeavePetClose = () => {
    setLeavePetModal(false);
  };

  useEffect(() => {
    get(`/${petId}`)
      .then((pet) => {
        setDetails(pet);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onDeleteUser = (userId: string) => {
    del(`/${details!._id}/user/${userId}`).then((res) => {
      if (res === "OK") {
        setDetails((prev) => {
          const ind = prev!.members.findIndex((mem) => mem._id === userId);
          return { ...prev!, members: prev!.members.splice(ind) };
        });
      }
    });
  };

  const onAddUser = (user: User) => {
    if (!details?.members.find((member) => member._id === user._id)) {
      put(`/${details!._id}/user/${user._id}`).then((res) => {
        setDetails((prev) => ({ ...prev!, members: [...prev!.members, res] }));
      });
    }
  };

  const navToEdit = () => {
    navigate(`/pet/${petId}/edit`);
  };

  if (loading) {
    <Loader />;
  }

  return (
    <>
      {error && error.message}
      {details && (
        <Grid container justifyContent="center">
          <Card sx={{ minWidth: 600, minHeight: 400, m: 3 }}>
            <CardHeader
              avatar={
                <Avatar
                  src={details.imgUrl}
                  sx={{ width: 160, height: 160 }}
                  alt={details.name}
                />
              }
              title={
                <Grid>
                  <Typography variant="h2" align="left">
                    {details.name}
                  </Typography>
                </Grid>
              }
              subheader={
                <Grid container>
                  <Typography variant="h5" align="left">
                    {details.breed}, {getAge(details.birthdate)}
                  </Typography>
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
                    handleLeavePetOpen();
                  }}
                >
                  <ListItemIcon>
                    <PersonRemoveIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Leave Pet</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
            <Grid container direction="row" mb={2}>
              <Typography variant="body1" ml={5}>
                Height: {details.height} cm
              </Typography>
              <Typography variant="body1" ml={5}>
                Weight: {details.weight} kg
              </Typography>
            </Grid>
            <Divider />
            <CardContent>
              <Grid container justifyContent="center">
                <Tabs value={value} onChange={handleChange} variant="fullWidth">
                  <Tab label="Medical" />
                  <Tab label="Carers" />
                  <Tab label="Tasks" />
                  <Tab label="Groups" />
                </Tabs>
              </Grid>
              <TabPanel value={value} index={0}>
                <PetMedical medical={details.medical} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <PetCarers
                  carers={details.members}
                  onDeleteUser={onDeleteUser}
                  onAddUser={onAddUser}
                />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <PetTasks tasks={details.tasks} />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <PetGroups groups={details.groups} />
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      )}

      <Dialog open={leavePetModal} onClose={handleLeavePetClose} maxWidth="xs">
        <DialogTitle style={{ fontWeight: "bold" }}>
          <WarningIcon fontSize="large" color="error" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will permanently remove you from being a carer of this
            pet. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleLeavePetClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleLeavePetClose();
              onDeleteUser(currentUserId);
              navigate(-1);
            }}
          >
            Leave Pet
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PetDetails;
