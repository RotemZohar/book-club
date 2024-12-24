import { Preview } from "@mui/icons-material";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "use-http";
import { routes } from "../../routes";
import { User } from "../../types/user";
import AddUsers from "../add-users/AddUsers";
import Loader from "../loader/Loader";
import MultipleSelect from "../multiple-select/MultipleSelect";

function CreateGroupPage() {
  const [name, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [stage, setStage] = useState(0);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const navigate = useNavigate();

  const { post } = useFetch("/group");
  const { data: petsList, loading } = useFetch("/user/pets", {}, []);

  const onSubmit = () => {
    if (!name || !description || selectedPets.length === 0) {
      alert("Please insert all required fields!");
    } else {
      post("/", {
        name,
        description,
        users: users.map((user) => user._id),
        pets: selectedPets,
      })
        .then(() => {
          navigate(routes.groups);
        })
        .catch((error) => {
          console.log(error);
          alert("Something went wrong with saving the group");
        });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main>
      <Grid container justifyContent="center">
        <Card sx={{ width: 400, minHeight: 250, m: 3 }}>
          <CardHeader title="Create New Group" />
          <Divider />
          {stage === 0 && (
            <Grid
              m={2}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label htmlFor="group">Group name*:</label>
                <TextField
                  style={{ display: "inline" }}
                  id="group"
                  variant="standard"
                  value={name}
                  required
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <TextField
                value={description}
                multiline
                minRows={3}
                maxRows={10}
                required
                onChange={(e) => setDescription(e.target.value)}
                label="Description"
              />
              {petsList && (
                <MultipleSelect
                  selectOptions={petsList}
                  selectedArr={selectedPets}
                  setSelectedArr={setSelectedPets}
                  label="Select Pets*"
                />
              )}
              <Grid container justifyContent="flex-end">
                <Button
                  onClick={() => {
                    setStage(1);
                  }}
                  style={{ alignSelf: "end" }}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          )}
          {stage === 1 && (
            <Grid
              m={2}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Typography variant="h6">Add Users</Typography>
              <Grid item m={2}>
                <AddUsers
                  selectedUsers={users}
                  onAddUser={(newUser) => {
                    setUsers((prevUsers) => {
                      if (
                        prevUsers.findIndex(
                          (user) => user._id === newUser._id
                        ) === -1
                      ) {
                        return [...prevUsers, newUser];
                      }
                      return prevUsers;
                    });
                  }}
                  onDeleteUser={(userId) => {
                    setUsers((prev) => {
                      const remove = prev.findIndex(
                        (user) => user._id === userId
                      );
                      return prev.splice(remove);
                    });
                  }}
                />
              </Grid>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Button
                    onClick={() => {
                      setStage(0);
                    }}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={onSubmit}>
                    Create
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Card>
      </Grid>
    </main>
  );
}

export default CreateGroupPage;
