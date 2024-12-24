import * as React from "react";
import Box from "@mui/material/Box";
import {
  CardHeader,
  Divider,
  Grid,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";
import useFetch from "use-http";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { RootState } from "../../redux/store";
import Loader from "../loader/Loader";
import { Pet, Task } from "../../types/pet";
import TaskItem from "./taskItem";
import noTasks from "../../assets/no-tasks.png";
import tasksLogo from "../../assets/todays-tasks.png";

const HomePage = () => {
  const userId = useSelector((state: RootState) => state.userReducer._id);
  const {
    data: todayTasksByPet = [],
    loading: loadingTasks,
    error: tasksError,
  } = useFetch<any[]>(`/user/${userId}/today-tasks`, {}, [userId]);
  const { put } = useFetch("/pet");
  const { data: user } = useFetch<{ name: string }>(`/user/${userId}`, {}, []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const todayTasks = useMemo(
    () =>
      todayTasksByPet
        .map((pet) =>
          pet.tasks.map((task: any) => ({
            ...task,
            pet,
          }))
        )
        .flat()
        .sort((a, b) => a.dateFrom.localeCompare(b.dateFrom)),
    [todayTasksByPet]
  );

  const tasksAmount = todayTasks.length;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleTodo = async (petId: string, taskId: string, status: boolean) => {
    const editStatus = await put(`/${petId}/${taskId}/changeStatus`, {
      isCompleted: status,
    });

    if (editStatus === "Changed") {
      const currentPet = todayTasksByPet.find((pet: Pet) => pet._id === petId);
      const currentTask = currentPet.tasks.find(
        (task: Task) => task._id === taskId
      );
      currentTask.isCompleted = status;
    }
  };

  if (loadingTasks) {
    return <Loader />;
  }

  if (tasksError) {
    return <Typography sx={{ fontSize: "26px" }}>Error occured</Typography>;
  }

  if (todayTasksByPet.length === 0) {
    return (
      <Grid item xs={12} mt={2}>
        <img
          src={noTasks}
          style={{ maxWidth: "100%" }}
          alt="You have no tasks for today"
          width="450"
        />
      </Grid>
    );
  }

  return (
    <Box>
      <Grid container justifyContent="center">
        <Grid item xs={12} mt={2} mb={1}>
          <img
            src={tasksLogo}
            style={{ maxWidth: "100%" }}
            alt="You have no tasks for today"
            width="450"
          />
        </Grid>
        <Paper
          sx={{
            width: "100%",
            maxWidth: 550,
            bgcolor: "background.paper",
            borderRadius: 5,
            elevation: 3,
            mb: 3,
          }}
        >
          <CardHeader
            title={<Typography>Hello, {user?.name || ""}!</Typography>}
            subheader="Let's see what we need to do today..."
          />
          <Divider />
          {todayTasks
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((task: any) => (
              <TaskItem pet={task.pet} task={task} toggleTodo={toggleTodo} />
            ))}
          <Divider />
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={tasksAmount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Box>
  );
};

export default HomePage;
