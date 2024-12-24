import {
  Button,
  Divider,
  Grid,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function CalendarEvent(props: {
  eventInfo: any;
  editTask: any;
  deleteTask: any;
  changeCompleteStatus: any;
}) {
  const { eventInfo, editTask, deleteTask, changeCompleteStatus } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeCompleteStatus = () => {
    const { petId, taskId, isCompleted } = eventInfo.event.extendedProps;
    changeCompleteStatus({ petId, taskId, isCompleted: !isCompleted });
  };

  const handleDeleteTask = () => {
    const { petId, taskId } = eventInfo.event.extendedProps;
    deleteTask({ petId, taskId });
  };

  const handleEditTask = () => {
    const { petId, taskId } = eventInfo.event.extendedProps;
    editTask({ petId, taskId });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div style={{ width: "100%" }}>
      <Tooltip title="Press For Details">
        <button
          style={{
            padding: 2,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            backgroundColor: eventInfo.event.backgroundColor,
            border: eventInfo.event.backgroundColor,
            width: "100%",
          }}
          aria-describedby={id}
          onClick={handleClick}
          type="button"
        >
          <img
            src={eventInfo.event.extendedProps.imgUrl}
            title={eventInfo.event.extendedProps.name}
            height="25"
            width="25"
            alt="calendar"
            style={{ borderRadius: 50 }}
          />
          <span style={{ marginLeft: 5, color: "white" }}>
            {eventInfo.event.title}
          </span>
        </button>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Grid
          sx={{
            maxWidth: 450,
            minWidth: 300,
            padding: "1rem",
            border: `3px solid ${eventInfo.event.backgroundColor}`,
          }}
        >
          <Button
            variant="contained"
            onClick={handleChangeCompleteStatus}
            style={{
              backgroundColor: eventInfo.event.backgroundColor,
            }}
          >
            {eventInfo.event.extendedProps.isCompleted
              ? "Mark as Not Completed"
              : "Mark as Completed"}
          </Button>
          <Grid>
            <Typography
              variant="subtitle2"
              style={{ fontWeight: "bold" }}
              sx={{ mt: 2 }}
            >
              {moment(eventInfo.event.start).format("DD/MM/YYYY HH:mm")} -{" "}
              {moment(eventInfo.event.end).format("DD/MM/YYYY HH:mm")}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              {eventInfo.event.extendedProps.description}
            </Typography>
          </Grid>
          <Grid container justifyContent="space-between" mt={1}>
            <IconButton onClick={handleDeleteTask}>
              <Tooltip title="Delete">
                <DeleteIcon style={{ marginRight: "auto" }} />
              </Tooltip>
            </IconButton>
            <IconButton onClick={handleEditTask}>
              <Tooltip title="Edit">
                <EditIcon style={{ marginLeft: "auto" }} />
              </Tooltip>
            </IconButton>
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
}

export default CalendarEvent;
