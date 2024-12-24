import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import useFetch from "use-http";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../routes";

const GroupEditPage = () => {
  const { put, get, response } = useFetch("/group");
  const { groupId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnack, setSnackOpen] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    get(`/${groupId}`)
      .then((group) => {
        setName(group.name);
        setDescription(group.description);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSnackClick = () => {
    setSnackOpen(true);
  };

  const handleSnackClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleSnackClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const onSubmit = async (e: any) => {
    e.preventDefault();
    await put(`/${groupId}`, {
      name,
      description,
    });

    if (response.data === "Edited") {
      navigate(-1);
    } else {
      setSnackMessage("Error occurred");
      handleSnackClick();
    }
  };

  return (
    <Grid container justifyContent="center">
      <Card sx={{ width: 600, minHeight: 300, m: 3 }}>
        <CardHeader title="Edit Group Details" />
        <Divider />
        <Box component="form" onSubmit={onSubmit} m={2}>
          <Grid
            style={{
              display: "inline-flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <TextField
              id="group"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Group Name"
            />
            <TextField
              value={description}
              multiline
              minRows={3}
              maxRows={10}
              onChange={(e) => setDescription(e.target.value)}
              label="Description"
            />
            <Grid item margin={1} xs={12}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
              <Snackbar
                open={openSnack}
                autoHideDuration={3000}
                message={snackMessage}
                onClose={handleSnackClose}
                action={action}
              />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
};

export default GroupEditPage;
