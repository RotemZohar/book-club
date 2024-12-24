import * as React from "react";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import useFetch from "use-http";
import Fab from "@mui/material/Fab";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SendIcon from "@mui/icons-material/Send";
import GroupsIcon from "@mui/icons-material/Groups";
import { useState } from "react";
import { Group } from "../../types/group";
import { RootState } from "../../redux/store";
import { routes } from "../../routes";
import Loader from "../loader/Loader";
import groupsLogo from "../../assets/mygroups.png";
import noGroups from "../../assets/no-groups.png";

const GroupsPage = () => {
  const userId = useSelector((state: RootState) => state.userReducer._id);
  const options = {};
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: groups = [], loading } = useFetch(
    `/user/${userId}/groups`,
    options,
    [userId]
  );
  const navigate = useNavigate();

  const navToGroup = (group: Group) => {
    navigate(`/group/${group._id}`);
  };

  const addGroup = () => {
    navigate(routes.createGroup);
  };

  if (loading) {
    return <Loader />;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (groups.length === 0) {
    return (
      <Grid container justifyContent="center">
        <Card sx={{ width: 500, m: 3 }}>
          <Grid item xs={12}>
            <img
              src={noGroups}
              style={{ maxWidth: "100%" }}
              alt="You have no groups yet"
              width="350"
            />
          </Grid>
          <Grid item m={3}>
            <Button
              variant="text"
              onClick={addGroup}
              style={{ textTransform: "none" }}
              startIcon={<SendIcon />}
            >
              Click here to create your first group!
            </Button>
          </Grid>
        </Card>
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} mt={2}>
        <img
          src={groupsLogo}
          style={{ maxWidth: "100%" }}
          alt="my groups"
          width="380"
        />
      </Grid>
      <Paper
        sx={{
          width: "100%",
          maxWidth: 480,
          bgcolor: "background.paper",
          borderRadius: 5,
          elevation: 3,
        }}
      >
        {groups
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((group: Group) => (
            <Grid key={group._id}>
              <ListItem ContainerComponent="div" disablePadding>
                <ListItemButton
                  sx={{ height: 80 }}
                  alignItems="center"
                  onClick={() => navToGroup(group)}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={group.name}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    >
                      <GroupsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={group.name}
                    secondary={`Members: ${group.members.length}`}
                  />
                </ListItemButton>
              </ListItem>
              <Divider />
            </Grid>
          ))}
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={groups.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Grid item xs={12} m={2}>
        <Tooltip arrow title="Add Group">
          <Fab onClick={addGroup} color="primary" aria-label="add">
            <GroupAddIcon />
          </Fab>
        </Tooltip>
      </Grid>
    </Grid>
  );
};
export default GroupsPage;
