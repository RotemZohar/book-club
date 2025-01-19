import { Box, Button, CardMedia, Typography } from "@mui/material";
import { Club } from "../../types/club";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

interface BookInfoProps {
  club: Club | null;
}

const BookInfo = (props: BookInfoProps) => {
  const { club } = props;

  const url = club?.books[club?.books.length - 1].previewLink;

  const openSample = () => {
    window.open(url, "_blank")?.focus();
  };

  const noBooks = (
    <Box flexDirection={"column"} sx={{ m: 2 }}>
      <AutoStoriesIcon color="disabled" fontSize="large" />
      <Typography variant="body1">
        This book club doesn't have any books yet.
      </Typography>
      <Button>Start Reading Together</Button>
    </Box>
  );

  const currentBook = (
    <Box
      display="flex"
      flexDirection={"row"}
      alignItems={"flex-end"}
      justifyContent={"center"}
      sx={{ m: 2 }}
    >
      <CardMedia
        component="img"
        sx={{ width: 100 }}
        image={club?.books[club?.books.length - 1].cover}
        alt={`${club?.books[club?.books.length - 1].title} book cover`}
      />
      <Box
        display="flex"
        flexDirection={"column"}
        alignItems={"flex-start"}
        sx={{ ml: 2 }}
      >
        <Typography component="div" variant="subtitle1">
          {club?.books[club?.books.length - 1].title}
        </Typography>
        <Typography
          variant="subtitle2"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {club?.books[club?.books.length - 1].author}
        </Typography>
        {url ? (
          <Button variant="contained" sx={{ m: 2 }} onClick={openSample}>
            Read Sample
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled
            sx={{ m: 2 }}
            onClick={openSample}
          >
            No Sample Available
          </Button>
        )}
      </Box>
    </Box>
  );

  return club?.books.length === 0 ? noBooks : currentBook;
};

export default BookInfo;
