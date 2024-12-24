import { Box, Button, Card, Grid, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetch from "use-http";
import { useHideNavbar } from "../../hooks/use-hide-navbar";
import signupLogo from "../../assets/signup-logo.png";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validLength, setValidLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [upperCase, setUpperCase] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const [match, setMatch] = useState(true);
  const [isStrong, setIsStrong] = useState(true);
  const [requiredLength, setRequiredLength] = useState(8);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post } = useFetch("/auth");
  useHideNavbar();

  useEffect(() => {
    setValidLength(password.length >= requiredLength);
    setUpperCase(password.toLowerCase() !== password);
    setLowerCase(password.toUpperCase() !== password);
    setHasNumber(/\d/.test(password));
  }, [password, requiredLength, confirmPassword]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!email || !password || !name) {
      alert("Please insert all fields!");
    } else if (!isStrong) {
      alert("Password is not strong enough");
    } else {
      post("/signup", { email, password, name })
        .then((res) => {
          if (res === "Created") {
            navigate("/");
          } else {
            alert("Email already exists!");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <Grid container justifyContent="center">
      <Card sx={{ minWidth: 300, width: 700, m: 4 }}>
        <Grid container direction="column" justifyContent="center" margin={2}>
          <Grid item>
            <img
              src={signupLogo}
              style={{ maxWidth: "100%" }}
              alt="logo"
              width="400"
            />
          </Grid>
          <Grid item>
            <Box component="form" onSubmit={onSubmit}>
              <Grid container direction="column">
                <Grid item mt={1} xs={12}>
                  <TextField
                    required
                    value={name}
                    label="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item mt={1} xs={12}>
                  <TextField
                    required
                    value={email}
                    label="Email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item mt={1} xs={12}>
                  <Tooltip
                    title="Passwords must be at least 8 characters long, include at least one number, and include both lower and upper case characters."
                    arrow
                  >
                    <TextField
                      required
                      value={password}
                      label="Password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() =>
                        setIsStrong(
                          validLength && hasNumber && upperCase && lowerCase
                        )
                      }
                      error={!isStrong}
                      helperText={
                        isStrong ? "" : "Password is not strong enough."
                      }
                    />
                  </Tooltip>
                </Grid>
                <Grid item margin={1} xs={12}>
                  <TextField
                    required
                    value={confirmPassword}
                    label="Confirm Password"
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() =>
                      setMatch(!!password && password === confirmPassword)
                    }
                    error={!match}
                    helperText={match ? "" : "Passwords must match!"}
                  />
                </Grid>
                <Grid item margin={1} xs={12}>
                  <Button variant="contained" type="submit">
                    Create user
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default SignUpPage;
