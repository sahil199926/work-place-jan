import { Skeleton } from "@mui/material";
import React from "react";

function Loadingprofile({ fields, height }) {
  let list = [...Array(fields).keys()];

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: " 50px auto",
      }}
    >
      {list.map((item,i) => {
        return (
          <Skeleton
            key={i}
            sx={{
              margin: "auto",
              maxWidth: "90%",
            }}
            height={height || 50}
            animation="wave"
          />
        );
      })}
    </div>
  );
}

export default Loadingprofile;
