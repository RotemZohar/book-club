import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { StringLiteralLike } from "typescript";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface ListItem {
  _id: string;
  name: string;
}

interface MultipleSelectProps {
  selectOptions: ListItem[];
  selectedArr: string[];
  setSelectedArr: (selected: string[]) => void;
  label?: string;
}

export default function MultipleSelect({
  selectOptions,
  selectedArr,
  setSelectedArr,
  label,
}: MultipleSelectProps) {
  const theme = useTheme();

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;

    setSelectedArr(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl fullWidth>
        {label && <InputLabel>{label}</InputLabel>}
        <Select
          multiple
          value={selectedArr}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => {
                const text = selectOptions.find((op) => op._id === value);
                return <Chip key={value} label={text?.name} />;
              })}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {selectOptions.map((option) => (
            <MenuItem
              key={option._id}
              value={option._id}
              style={getStyles(option.name, selectedArr, theme)}
            >
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
