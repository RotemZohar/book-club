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

const HomePage = () => <>This is the home!</>;

export default HomePage;
