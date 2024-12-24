import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  TextField,
  Tooltip,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import useFetch from "use-http";
import { RootState } from "../../redux/store";
import { setUsername } from "../../redux/slices/userSlice";

const EditDetailsPage = () => {
  const { put, response } = useFetch("/user");
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.userReducer._id);
  const userName = useSelector((state: RootState) => state.userReducer.name);
  const [name, setName] = useState(userName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openSnack, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  let passNotMatchText = "";

  const [validLength, setValidLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [upperCase, setUpperCase] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const [isStrong, setIsStrong] = useState(true);
  const requiredLength = 8;

  useEffect(() => {
    setValidLength(password.length >= requiredLength);
    setUpperCase(password.toLowerCase() !== password);
    setLowerCase(password.toUpperCase() !== password);
    setHasNumber(/\d/.test(password));
  }, [password]);

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

  const checkPasswordsMatch = () => {
    if (password === confirmPassword) {
      passNotMatchText = "";
      return true;
    }
    passNotMatchText = "Passwords must match";
    return false;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!isStrong) {
      alert("Password is not strong enough");
    } else if (checkPasswordsMatch() === true) {
      await put(`/${userId}/edit`, {
        name,
        password,
      });
      dispatch(setUsername(name));

      if (response.data === "Edited") {
        setSnackMessage("Details changed");
        handleSnackClick();
      } else {
        setSnackMessage("Error occurred");
        handleSnackClick();
      }
    }
  };

  return (
    <Grid container justifyContent="center">
      <Card sx={{ minWidth: 300, width: 700, m: 4 }}>
        <CardHeader title="Update Profile" />
        <Box component="form" onSubmit={onSubmit} mb={2}>
          <Grid container direction="column">
            <Grid item margin={1} xs={12}>
              <TextField
                value={name}
                label="Name"
                type="string"
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item margin={1} xs={12}>
              <Tooltip
                title="Passwords must be at least 8 characters long, include at least one number, and include both lower and upper case characters."
                arrow
              >
                <TextField
                  value={password}
                  label="Password"
                  type="password"
                  error={!isStrong}
                  helperText={isStrong ? "" : "Password is not strong enough"}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() =>
                    setIsStrong(
                      validLength && hasNumber && upperCase && lowerCase
                    )
                  }
                />
              </Tooltip>
            </Grid>
            <Grid item margin={1} xs={12}>
              <TextField
                value={confirmPassword}
                label="Confirm password"
                type="password"
                error={checkPasswordsMatch() === false}
                helperText={passNotMatchText}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid item margin={1} xs={12}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
              <Snackbar
                open={openSnack}
                autoHideDuration={3000}
                message="Details changed"
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

export default EditDetailsPage;
