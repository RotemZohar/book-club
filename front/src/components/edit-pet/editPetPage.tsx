import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import useFetch from "use-http";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate, useNavigationType, useParams } from "react-router-dom";
import Loader from "../loader/Loader";
import { RootState } from "../../redux/store";
import { storage } from "../../firebase";
import { routes } from "../../routes";

const petEditPage = () => {
  const { put, get, response, loading } = useFetch("/pet");
  const { petId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.userReducer._id);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<any>();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [snackMessage, setSnackMessage] = useState("");
  const [openSnack, setSnackOpen] = React.useState(false);
  const [progress, setProgress] = useState(100);

  const navToPet = () => {
    navigate(`/pet/${petId}`);
  };

  useEffect(() => {
    get(`/${petId}`)
      .then((pet) => {
        setName(pet.name);
        setHeight(pet.height);
        setWeight(pet.weight);
        setImgUrl(pet.imgUrl);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSnackClick = () => {
    setSnackOpen(true);
  };

  const handleSnackClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const editPetServer = async (firebaseImageUrl = "") => {
    await put(`/${petId}`, {
      name,
      height,
      weight,
      imgUrl: firebaseImageUrl,
    });

    if (response.data === "Edited") {
      navigate(-1);
    } else {
      setSnackMessage("Error occurred");
      handleSnackClick();
    }
  };

  const editPet = async () => {
    // Upload image
    if (!imageUrl) {
      editPetServer();
    } else {
      const storageRef = ref(storage, `petsImages/${userId}/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageUrl);

      await uploadTask.on(
        "state_changed",
        (snapshot: { bytesTransferred: number; totalBytes: number }) => {
          const progressTemp = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progressTemp);
        },
        (error: any) => {
          console.log(error);
        },
        async () => {
          const firebaseUrlTemp = await getDownloadURL(uploadTask.snapshot.ref);
          editPetServer(firebaseUrlTemp);
        }
      );
    }
  };

  const onUploadPicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setImageUrl(event.target.files[0]);
      setImgUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleSnackClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const onSubmit = async (e: any) => {
    e.preventDefault();
    editPet();
  };

  if (loading || progress !== 100) {
    return <Loader />;
  }

  return (
    <Grid container justifyContent="center">
      <Card sx={{ width: 600, minHeight: 300, m: 3 }}>
        <CardHeader title="Edit Pet" />
        <Divider />
        <Grid item mt={2}>
          <Avatar
            src={imgUrl}
            alt="X"
            sx={{ width: 160, height: 160, m: "auto", mb: 2 }}
          />
        </Grid>
        <Box component="form" onSubmit={onSubmit} m={2}>
          <Grid
            style={{
              display: "inline-flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <TextField
              value={name}
              label="Name"
              type="string"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              value={height}
              label="Height"
              type="number"
              onChange={(e) => setHeight(e.target.value)}
              InputProps={{
                inputProps: { min: 0, max: 200 },
                endAdornment: (
                  <InputAdornment position="end">cm</InputAdornment>
                ),
              }}
            />
            <TextField
              value={weight}
              label="Weight"
              type="number"
              onChange={(e) => setWeight(e.target.value)}
              InputProps={{
                inputProps: { min: 0, max: 200 },
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
            />
            <Grid item margin={1}>
              <Button startIcon={<AddAPhotoIcon />} component="label">
                Upload Picture
                <input type="file" hidden onChange={onUploadPicture} />
              </Button>
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-end">
            <Grid item margin={1}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Grid>

            <Snackbar
              open={openSnack}
              autoHideDuration={3000}
              message={snackMessage}
              onClose={handleSnackClose}
              action={action}
            />
          </Grid>
        </Box>
        <Backdrop open={progress !== 100}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Card>
    </Grid>
  );
};

export default petEditPage;
