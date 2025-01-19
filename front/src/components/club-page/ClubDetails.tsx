import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Book, Club, Member } from "../../types/club";

interface ClubDetailsProps {
  club: Club | null;
}

const ClubDetails = (props: ClubDetailsProps) => {
  const { club } = props;

  // TODO: ACTION
  const joinButton = (
    <Button variant="outlined" aria-label="join">
      Join
    </Button>
  );

  // TODO: ACTION
  const leaveButton = (
    <Tooltip title="Leave Club">
      <Button variant="outlined" aria-label="leave" color="error">
        <LogoutIcon />
      </Button>
    </Tooltip>
  );

  const isUserAMember = (_id: string) => {
    return club?.members.some((member: Member) => member._id === _id);
  };

  return (
    <Card sx={{ justifyContent: "flex-start" }}>
      <CardHeader
        action={
          isUserAMember("6786bb1804d07c0dc59d9be4") ? leaveButton : joinButton // TODO: CHECK ACTUAL USER
        }
        title={club?.name}
        subheader={club?.description}
      />
      <Divider />
      <CardContent>
        <Container>
          <AvatarGroup total={club?.members.length} max={3}>
            {club?.members.map((member: Member) => (
              <Avatar key={member._id} alt={member.name} />
            ))}
          </AvatarGroup>
          <Typography variant="caption">{`${club?.members.length} Members`}</Typography>
        </Container>
        <Divider />
        <Typography component="div">Previous Books</Typography>
        <Box display={"flex"} flexDirection={"row"}>
          {club?.books.map((book: Book) => (
            <Box sx={{ mx: 0.5, mt: 2 }}>
              <img src={book.cover} width={70} />
            </Box>
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small">Invite Friends</Button>
      </CardActions>
    </Card>
  );
};

export default ClubDetails;
