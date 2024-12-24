import React from "react";
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
  Tooltip,
  Divider,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

const PetTasks = (props: { tasks: any[] }) => {
  const { tasks } = props;
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

  // TODO: Use moment
  const dateFormat = (date: string) => {
    const match = date.match(
      /(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}):(\d{2}):(\d{2})(.(\d+))?/
    );

    if (!match) return null;

    const [, year, month, day, hours, minutes, seconds, , millseconds] = match;

    return `${hours}:${minutes} ${day}.${month}.${year}`;
  };

  if (!tasks) {
    // TODO: Use I18N
    return (
      <div>
        <Typography sx={{ fontSize: "26px" }}>
          No tasks have been asigned yet
        </Typography>
      </div>
    );
  }

  return (
    <Paper variant="outlined" sx={{ maxWidth: 500 }}>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Start Time</TableCell>
              <TableCell align="center">End Time</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks
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
                    {row.title}
                  </TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center">{dateFormat(row.dateFrom)}</TableCell>
                  <TableCell align="center">{dateFormat(row.dateTo)}</TableCell>
                  <TableCell align="center">
                    {row.isCompleted ? (
                      <Tooltip title="Completed">
                        <DoneIcon color="success" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="To Do">
                        <PriorityHighIcon color="error" />
                      </Tooltip>
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
        count={tasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default PetTasks;
