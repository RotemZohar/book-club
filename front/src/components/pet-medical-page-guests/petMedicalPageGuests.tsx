import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useFetch from "use-http";
import { useNavigate, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import moment from "moment";
import {
  Backdrop,
  Card,
  CardMedia,
  Grid,
  SpeedDial,
  SpeedDialAction,
  Tab,
  Tabs,
} from "@mui/material";
import { useMemo, useState } from "react";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import SpeedDialIcon from "@mui/material/SpeedDialIcon";

import LoginIcon from "@mui/icons-material/Login";
import { Treatment } from "../../types/pet";
import TabPanel from "../tab-panel/TabPanel";
import { useHideNavbar } from "../../hooks/use-hide-navbar";
import { User } from "../../types/user";
import Loader from "../loader/Loader";
import medicalLogo from "../../assets/med-history.png";
import carersLogo from "../../assets/pet-carer.png";
import { routes } from "../../routes";

const PetMedicalPageGuests = () => {
  const [value, setValue] = useState(0);
  const { petId } = useParams();
  const options = {};
  const { data, loading, error } = useFetch(
    `/auth/${petId}/medical/guests`,
    options,
    [petId]
  );
  const [imageOpen, setImageOpen] = useState(false);
  const navigate = useNavigate();

  useHideNavbar();

  const petMedical = useMemo(() => {
    if (!data) {
      return [];
    }
    data.medical.sort((a: any, b: any) => moment(b.date).diff(moment(a.date)));
    return data;
  }, [data]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
      {error && error.message}
      {petMedical && petMedical.medical && (
        <>
          <Grid container justifyContent="center">
            <Card
              sx={{
                width: 600,
                m: 3,
              }}
            >
              <Grid style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={petMedical.imgUrl}
                  alt={petMedical.name}
                  onClick={() => setImageOpen(true)}
                />
                <Grid
                  style={{
                    position: "absolute",
                    top: 1,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100%",
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: "bold",
                      color: "#ffffff",
                      fontSize: "24px",
                    }}
                  >
                    {petMedical.name}
                  </Typography>
                </Grid>
              </Grid>

              <Tabs value={value} onChange={handleChange} variant="fullWidth">
                <Tab
                  label="Medical History"
                  icon={<MedicalServicesIcon />}
                  iconPosition="start"
                />
                <Tab
                  label="Owners"
                  icon={<ContactMailIcon />}
                  iconPosition="start"
                />
              </Tabs>
              <TabPanel value={value} index={0}>
                <Grid item xs={12} mb={2}>
                  <img
                    src={medicalLogo}
                    alt="medical history"
                    width="500"
                    style={{ maxWidth: "100%" }}
                  />
                </Grid>
                <TableContainer>
                  <Paper variant="outlined">
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">
                            <Typography variant="button">Treatment</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="button">Date</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {petMedical.medical.map((row: Treatment) => (
                          <TableRow
                            key={row._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="center">
                              {row.treatment}
                            </TableCell>
                            <TableCell align="center">
                              {moment(row.date).format("DD-MM-YYYY")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </TableContainer>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Grid item xs={12} mb={2}>
                  <img
                    src={carersLogo}
                    alt="pet-carers"
                    width="500"
                    style={{ maxWidth: "100%" }}
                  />
                </Grid>
                <TableContainer>
                  <Paper variant="outlined">
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">
                            <Typography variant="button">Name</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="button">Email</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {petMedical.members.map((row: User) => (
                          <TableRow
                            key={row._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">
                              <a href={`mailto:${row.email}`}>{row.email}</a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </TableContainer>
              </TabPanel>
            </Card>
          </Grid>
          <Backdrop
            open={imageOpen}
            onClick={() => setImageOpen((prev) => !prev)}
          >
            <img
              src={petMedical.imgUrl}
              alt="Pet"
              style={{ maxWidth: "60%", maxHeight: "90%", aspectRatio: "auto" }}
            />
          </Backdrop>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            <SpeedDialAction
              key="login"
              icon={<LoginIcon />}
              tooltipTitle="Login"
              tooltipOpen
              onClick={() => navigate(routes.signin)}
            />
            <SpeedDialAction
              key="signup"
              tooltipTitle="Signup"
              icon={<PersonAddAltIcon />}
              tooltipOpen
              onClick={() => navigate(routes.signup)}
            />
          </SpeedDial>
        </>
      )}
    </Box>
  );
};
export default PetMedicalPageGuests;
