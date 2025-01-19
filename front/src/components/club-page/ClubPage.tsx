import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Club } from "../../types/club";
import ClubDetails from "./ClubDetails";
import BookInfo from "./BookInfo";
import ReadingTimeline from "./ReadingTimeline";

const ClubPage = () => {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getClub = async (clubId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACK_API}/club/${clubId}`
      );
      setClub(response.data);
      setLoading(false);
    } catch (error: any) {
      console.log(
        error.response?.data.error ?? error.message ?? "An error occurred"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    getClub("678bf3136c38a9ac79277095"); // TODO: GET ACTUAL ID
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Grid
      container
      spacing={1}
      direction={"row"}
      sm={11}
      display={"flex"}
      justifySelf={"center"}
      mt={1}
    >
      <Grid item sm={4}>
        <ClubDetails club={club} />
      </Grid>
      <Grid item sm={8}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Currently Reading
            </Typography>
            <Divider />
            <BookInfo club={club} />
          </CardContent>
        </Card>
        <Card sx={{ mt: 1 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Reading Timeline
            </Typography>
            <Divider />
            <ReadingTimeline club={club} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ClubPage;
