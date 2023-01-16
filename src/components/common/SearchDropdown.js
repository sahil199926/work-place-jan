import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Stack } from "@mui/system";
import { Avatar, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
function SearchDropdown({ dropdowndata, onChange, values, handleDelete,disabled }) {
  return (
    <>
      <Autocomplete
        fullWidth
        disabled={disabled}
        disablePortal
        id="combo-box-demo"
        size="small"
        onChange={(e, newval) => onChange(newval)}
        options={dropdowndata}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
      <Stack direction="row" spacing={1} sx={{marginTop:'10px'}}>
        {values.length > 0 &&
          values.map((item, index) => {
            return (
              <Chip
                avatar={
                  <DeleteIcon
                    sx={{
                      cursor: "pointer",
                      color: "red",
                    }}
                    onClick={() => handleDelete(item)}
                  />
                }
                // onClick={handleClick}
                variant="outlined"
                label={item}
              />
            );
          })}
      </Stack>
    </>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top

export default SearchDropdown;
