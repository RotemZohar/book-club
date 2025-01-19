import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Club } from "../../types/club";

interface ReadingTimelineProps {
  club: Club | null;
}

const ReadingTimeline = (props: ReadingTimelineProps) => {
  const { club } = props;

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  const genericStepTimeline = (text: string, secondaryText: string) => (
    <TimelineItem>
      <TimelineOppositeContent color="text.secondary">
        {secondaryText}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot variant="outlined" />
        {text !== "Finish" ? <TimelineConnector /> : <></>}
      </TimelineSeparator>
      <TimelineContent>{text}</TimelineContent>
    </TimelineItem>
  );

  return (
    <Timeline>
      {genericStepTimeline(
        "Start",
        formatDate(new Date(club?.books[0].startDate!))
      )}
      {genericStepTimeline(
        "Finish",
        formatDate(new Date(club?.books[0].endDate!))
      )}
    </Timeline>
  );
};

export default ReadingTimeline;
