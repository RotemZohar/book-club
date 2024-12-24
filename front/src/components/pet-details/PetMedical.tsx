import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import QrIcon from "@mui/icons-material/QrCode";
import moment from "moment";
import useFetch from "use-http";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactDOM from "react-dom";
import QRcode from "qrcode.react";
import { Treatment } from "../../types/pet";

const PetMedical = (props: { medical: Treatment[] }) => {
  const navigate = useNavigate();
  const { medical } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [addTreatmentOpen, setTreatmentOpen] = React.useState(false);
  const [showQrOpen, setShowQrOpen] = React.useState(false);
  const [treatment, setTreatment] = useState("");
  const [treatmentDate, setTreatmentDate] = useState("");
  const [medicalTreatments, setMedicalTreatments] = useState<Treatment[]>([]);
  const { petId } = useParams();
  const [qr] = useState(`${petId}/medical/guests`);
  const { put, del, response } = useFetch("/pet");

  useEffect(() => {
    setMedicalTreatments(medical);
  }, [medical]);

  const handleAddTreatmentOpen = () => {
    setTreatmentOpen(true);
  };

  const handleAddTreatmentClose = () => {
    setTreatmentOpen(false);
  };

  const handleShowQrOpen = () => {
    setShowQrOpen(true);
  };

  const handleShowQrClose = () => {
    setShowQrOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const navPetMedicalPage = () => {
    navigate(`../${qr}`, { replace: true });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!medical) {
    return (
      <div>
        <Typography sx={{ fontSize: "26px" }}>
          No tasks have been assigned yet
        </Typography>
      </div>
    );
  }

  const addTreatment = async () => {
    setTreatmentOpen(false);

    const date = moment(treatmentDate, "YYYY-MM-DD").toDate();

    const newTreatment = await put(`/${petId}/add-treatment`, {
      treatment,
      date,
    }).then((newTreatmentResponse) => {
      setMedicalTreatments((prevState) => [
        ...prevState,
        { _id: newTreatmentResponse, treatment, date },
      ]);
    });
  };

  const deleteMedical = async (medicalId: string) => {
    const deletedMedical = await del(`/${petId}/${medicalId}`);
    if (response.data === "Deleted") {
      let newMedical = [...medicalTreatments];
      newMedical = newMedical.filter((item) => item._id !== medicalId);
      setMedicalTreatments(newMedical);
    }
  };

  return (
    <Box>
      <Paper variant="outlined">
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Treatments</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center"> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicalTreatments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {row.treatment}
                    </TableCell>
                    <TableCell align="center">
                      {moment(row.date).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="close"
                        onClick={() => deleteMedical(row._id)}
                      >
                        <Tooltip title="Delete">
                          <DeleteIcon />
                        </Tooltip>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={medical.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Grid container justifyContent="space-around" mt={2}>
        <Tooltip arrow title="Add Treatment">
          <Fab
            onClick={handleAddTreatmentOpen}
            color="primary"
            aria-label="add"
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <Tooltip arrow title="Generate QRcode">
          <Fab onClick={handleShowQrOpen} color="primary" aria-label="add">
            <QrIcon />
          </Fab>
        </Tooltip>
      </Grid>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={showQrOpen}
        onClose={handleShowQrClose}
      >
        <DialogTitle>Pet Medical Page For Guests</DialogTitle>
        <Divider />
        <DialogContent>
          <QRcode
            id="petMedicalQrGuests"
            value={`${window.location.origin}/${qr}`}
            size={260}
            includeMargin
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleShowQrClose}>Close</Button>
          <Button variant="contained" onClick={navPetMedicalPage}>
            Go
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={addTreatmentOpen}
        onClose={handleAddTreatmentClose}
      >
        <DialogTitle>Add Medical Treatment</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            required
            margin="dense"
            id="name"
            label="Treatment"
            type="string"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              setTreatment(e.target.value);
            }}
          />
          <TextField
            required
            margin="dense"
            id="date"
            label="TreatmentDate"
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              setTreatmentDate(e.target.value);
            }}
          />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={handleAddTreatmentClose}>Cancel</Button>
          <Button variant="contained" onClick={addTreatment}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PetMedical;
