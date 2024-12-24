import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Card, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { useTranslation } from "react-i18next";
import useFetch from "use-http";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import { routes } from "../../routes";
import { acquireToken, Token, tokens } from "../../auth/auth-utils";
import { useHideNavbar } from "../../hooks/use-hide-navbar";
import { setUserId } from "../../redux/slices/userSlice";
import mainLogo from "../../assets/main-logo.png";
import Loader from "../loader/Loader";

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("pages/signin");
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { post, response, loading } = useFetch("/auth");
  const dispatch = useDispatch();

  useHideNavbar();

  useEffect(() => {
    acquireToken().then((value) => {
      if (value) {
        const decoded = jwtDecode<Token>(value);
        dispatch(setUserId(decoded._id));
        navigate(routes.home);
      }
    });
  }, []);

  const signin = async () => {
    const resTokens = await post("/login", { email, password });
    if (response.ok) {
      tokens.access.set(resTokens.accessToken);
      tokens.refresh.set(resTokens.refreshToken);
      dispatch(setUserId(resTokens.userId));
      navigate(routes.home);
    } else {
      setErrorMessage("Username or password are incorrect!");
    }
  };

  const handleSubmit = async (e: any) => {
    setErrorMessage("");
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please insert all fields!");
    } else {
      await signin();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container justifyContent="center">
      <Card sx={{ minWidth: 300, width: 700, m: 4 }}>
        <Grid container direction="column" justifyContent="center" margin={2}>
          <Grid item>
            <img
              style={{ maxWidth: "100%" }}
              src={mainLogo}
              alt="logo"
              width="450"
            />
          </Grid>
          <Grid item>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container direction="column">
                <Grid item mt={1} xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    error={emailError}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) {
                        setEmailError(false);
                      }
                    }}
                  />
                </Grid>
                <Grid item margin={1} xs={12}>
                  <TextField
                    label="Password"
                    type="password"
                    error={passwordError}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) {
                        setPasswordError(false);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} alignSelf="center">
                  {errorMessage && (
                    <Alert severity="error">{errorMessage}</Alert>
                  )}
                </Grid>
                <Grid item margin={1} xs={12}>
                  <Button variant="contained" type="submit">
                    Sign In
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item margin={1} xs={12}>
            <Button
              variant="text"
              onClick={() => navigate(routes.signup)}
              style={{ textTransform: "none" }}
            >
              Not a member yet? Sign up here!
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default LandingPage;
