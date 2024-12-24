import {
  Chip,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import React, { FormEvent, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import useFetch from "use-http";
import { User } from "../../types/user";

interface AddUsersProps {
  selectedUsers: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

function AddUsers({ onAddUser, selectedUsers, onDeleteUser }: AddUsersProps) {
  const [searchValue, setSearchValue] = useState("");
  const { get, data } = useFetch<User[]>("/user/search");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (searchValue) {
      get(searchValue);
    }
  };

  return (
    <div style={{ flexDirection: "column", alignSelf: "center" }}>
      <form onSubmit={onSubmit}>
        <FormControl>
          <InputLabel>Search User</InputLabel>
          <Input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            required
            endAdornment={
              <IconButton type="submit">
                <SearchIcon />
              </IconButton>
            }
          />
        </FormControl>

        {data && (
          <List>
            {data.map((user) => (
              <ListItemButton key={user._id} onClick={() => onAddUser(user)}>
                <ListItem>{user.name}</ListItem>
              </ListItemButton>
            ))}
          </List>
        )}
      </form>
      <Grid container justifyContent="center" mt={2}>
        {selectedUsers.map((user) => (
          <Chip
            key={user._id}
            label={user.name}
            onDelete={() => onDeleteUser(user._id)}
          />
        ))}
      </Grid>
    </div>
  );
}

export default AddUsers;
