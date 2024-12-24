import {
  Box,
  Button,
  Dialog,
  Divider,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  isCompleted: boolean;
}

function UpdateTaskDialog(props: {
  onClose: any;
  updateTask: any;
  open: boolean;
  task?: Task;
  petsList: { _id: string; name: string }[];
  selectedPetId?: string;
}) {
  const { onClose, updateTask, open, task, petsList, selectedPetId } = props;

  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(moment().add(1, "hours").toDate());
  const [isCompleted, setIsCompleted] = useState(false);
  const [petId, setPetId] = useState<string>("");
  const [titleError, setTitleError] = useState(false);
  const [datesError, setDatesError] = useState(
    moment(dateFrom).isSameOrAfter(moment(dateTo))
  );

  useEffect(() => {
    setTaskId(task ? task._id : "");
    setTitle(task ? task.title : "");
    setDescription(task ? task.description : "");
    setDateFrom(task ? moment(task.dateFrom).toDate() : new Date());
    setDateTo(task ? new Date(task.dateTo) : moment().add(1, "hours").toDate());
    setIsCompleted(task ? task.isCompleted : false);
    setPetId(task && selectedPetId ? selectedPetId : "");
    setTitleError(false);
    setTitleError(false);
  }, [open]);

  const closeDialog = () => {
    onClose();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTask({
      _id: taskId,
      title,
      description,
      dateFrom,
      dateTo,
      petId,
      isCompleted,
    });
    onClose();
  };

  return (
    <Dialog onClose={closeDialog} open={open} maxWidth="sm">
      <DialogTitle style={{ textAlign: "center" }}>
        {taskId ? "Edit Task" : "Add Task"}
      </DialogTitle>
      <Divider />
      <Box component="form" onSubmit={onSubmit}>
        <Grid container justifyContent="center" mt={1.5} mb={1.5}>
          <Grid item margin={1} xs={10.3}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTitleError(!title)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              helperText={titleError ? "Please insert title" : ""}
              error={titleError}
            />
          </Grid>
          <Grid item margin={1} xs={5}>
            <TextField
              label="From"
              type="datetime-local"
              value={moment(dateFrom).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) => setDateFrom(new Date(e.target.value))}
              onBlur={() =>
                setDatesError(moment(dateFrom).isSameOrAfter(moment(dateTo)))
              }
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              helperText={datesError ? "Dates range not valid" : ""}
              error={datesError}
            />
          </Grid>
          <Grid item margin={1} xs={5}>
            <TextField
              label="To"
              type="datetime-local"
              value={moment(dateTo).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) => setDateTo(new Date(e.target.value))}
              onBlur={() =>
                setDatesError(moment(dateFrom).isSameOrAfter(moment(dateTo)))
              }
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              helperText={datesError ? "Dates range not valid" : ""}
              error={datesError}
            />
          </Grid>
          <Grid item margin={1} xs={10.3}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              maxRows={7}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {!taskId && (
            <Grid item margin={1} xs={10.3}>
              <TextField
                label="Pet"
                select
                fullWidth
                value={petId}
                required
                onChange={(e) => setPetId(e.target.value)}
              >
                {petsList?.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
        </Grid>
        <Divider />
        <Grid container justifyContent="flex-end">
          <Grid item margin={2}>
            <Button variant="contained" type="submit">
              {taskId ? "Update" : "Add"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default UpdateTaskDialog;
