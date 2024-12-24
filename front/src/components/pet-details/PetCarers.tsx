import {
  Box,
  Divider,
  Fab,
  Grid,
  IconButton,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import { Member } from "../../types/pet";
import AddUsers from "../add-users/AddUsers";
import { User } from "../../types/user";
import { RootState } from "../../redux/store";

interface PetCarersProps {
  carers: Member[];
  onDeleteUser: (userId: string) => void;
  onAddUser: (userId: User) => void;
}

const PetCarers: React.FC<PetCarersProps> = ({
  carers,
  onDeleteUser,
  onAddUser,
}) => {
  const currentUserId = useSelector(
    (state: RootState) => state.userReducer._id
  );
  const [addUsers, setAddUsers] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (addUsers) {
    return (
      <div style={{ position: "relative" }}>
        <IconButton
          onClick={() => setAddUsers(false)}
          style={{ position: "absolute", left: 0 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <div>
          <Typography variant="h4">Update users</Typography>
          <AddUsers
            selectedUsers={carers}
            onAddUser={onAddUser}
            onDeleteUser={onDeleteUser}
          />
        </div>
      </div>
    );
  }

  return (
    <Box>
      <Paper variant="outlined">
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center"> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carers.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="center">
                    {row._id !== currentUserId ? (
                      <IconButton
                        id={row._id}
                        onClick={() => onDeleteUser(row._id)}
                      >
                        <Tooltip title="Delete">
                          <DeleteIcon />
                        </Tooltip>
                      </IconButton>
                    ) : (
                      ""
                    )}
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
          count={carers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Grid container justifyContent="center" mt={3}>
        <Tooltip arrow title="Add Carers">
          <Fab
            onClick={() => setAddUsers((prev) => !prev)}
            color="primary"
            aria-label="add"
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Grid>
    </Box>
  );
};
export default PetCarers;
