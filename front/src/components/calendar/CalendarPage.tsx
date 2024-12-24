import React, { useEffect, useState } from "react";
import FullCalendar, { EventInput } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import useFetch from "use-http";
import { useSelector } from "react-redux";
import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as _ from "lodash";
import { RootState } from "../../redux/store";
import CalendarEvent from "./CalendarEvent";
import Loader from "../loader/Loader";
import UpdateTaskDialog from "./UpdateTaskDialog";
import "./Calendar.css";

interface Task {
  _id: string;
  title: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  isCompleted: boolean;
}

function convertTaskToCalendarEvent(
  petTasks: { _id: string; name: string; imgUrl: string; tasks: Task[] }[]
) {
  const events: EventInput[] = [];
  petTasks?.forEach((pet) => {
    pet.tasks?.forEach((task) => {
      let backgroundColor = "#3788d8"; // blue
      if (task.isCompleted) {
        backgroundColor = "darkgreen";
      } else if (new Date(task.dateTo).getTime() < Date.now()) {
        backgroundColor = "darkred";
      }
      events.push({
        title: task.title,
        start: task.dateFrom,
        end: task.dateTo,
        backgroundColor,
        extendedProps: {
          taskId: task._id,
          petId: pet._id,
          name: pet.name,
          imgUrl: pet.imgUrl,
          description: task.description,
          isCompleted: task.isCompleted,
        },
      });
    });
  });
  return events;
}

function CalendarPage() {
  const [petTasks, setPetTasks] = useState<
    { _id: string; name: string; imgUrl: string; tasks: Task[] }[]
  >([]);
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedTaskData, setSelectedTaskData] =
    useState<{ petId: string | undefined; task: Task | undefined }>();
  const userId = useSelector((state: RootState) => state.userReducer._id);

  const { get, loading } = useFetch("/user");
  const { put, del } = useFetch("/pet");

  const fetchUserTasks = () => {
    get(`/${userId}/tasks`)
      .then((res) => {
        setPetTasks(res?.petTasks);
        setCalendarEvents(convertTaskToCalendarEvent(res?.petTasks));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const openDialog = () => {
    setSelectedTaskData(undefined);
    setDialogOpen(true);
  };

  const handleEditTask = (data: { petId: string; taskId: string }) => {
    const task = petTasks
      ?.find((p) => p._id === data.petId)
      ?.tasks?.find((t) => t._id === data.taskId);
    setSelectedTaskData({ petId: data.petId, task });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUpdateTask = (task: {
    _id: string;
    title: string;
    description: string;
    dateFrom: Date;
    dateTo: Date;
    petId: string;
    isCompleted: boolean;
  }) => {
    put(`/${task.petId}/task${task._id ? `/${task._id}` : ``}`, {
      title: task.title,
      description: task.description,
      dateFrom: new Date(task.dateFrom).toISOString(),
      dateTo: new Date(task.dateTo).toISOString(),
      isCompleted: task.isCompleted,
    })
      .then((res) => {
        if (res === "Created" || res === "Updated") {
          fetchUserTasks();
        } else {
          alert(`Error: ${res}`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert(`Error: ${err}`);
      });
  };

  const handleDeleteTask = (data: { petId: string; taskId: string }) => {
    del(`/${data.petId}/task/${data.taskId}`)
      .then((res) => {
        if (res === "Deleted") {
          fetchUserTasks();
        } else {
          alert(`Error: ${res}`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert(`Error: ${err}`);
      });
  };

  const handleChangeCompleteStatus = (data: {
    petId: string;
    taskId: string;
    isCompleted: boolean;
  }) => {
    const task = petTasks
      ?.find((p) => p._id === data.petId)
      ?.tasks?.find((t) => t._id === data.taskId);

    if (task) {
      handleUpdateTask({
        _id: data.taskId,
        title: task.title,
        description: task.description,
        dateFrom: task.dateFrom,
        dateTo: task.dateTo,
        petId: data.petId,
        isCompleted: data.isCompleted,
      });
    }
  };

  const renderEventContent = (eventInfo: EventInput) => (
    <CalendarEvent
      eventInfo={eventInfo}
      editTask={handleEditTask}
      deleteTask={handleDeleteTask}
      changeCompleteStatus={handleChangeCompleteStatus}
    />
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
      <div style={{ padding: "2rem" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          height={650}
          fixedWeekCount={false}
          events={calendarEvents}
          eventContent={renderEventContent}
        />
      </div>
      <Tooltip arrow title="Add Task">
        <Fab
          onClick={openDialog}
          color="primary"
          aria-label="add"
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            zIndex: 1,
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <UpdateTaskDialog
        open={dialogOpen}
        task={selectedTaskData?.task}
        onClose={handleDialogClose}
        updateTask={handleUpdateTask}
        petsList={_.uniq(
          petTasks?.map((pet) => ({ _id: pet._id, name: pet.name }))
        )}
        selectedPetId={selectedTaskData?.petId}
      />
    </Box>
  );
}

export default CalendarPage;
