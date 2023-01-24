import { Button, Grid } from "@mui/material";
import React from "react";
import JobForm from "./JobForm";
import Sidebar from "./Sidebar";
function EmployerJobs() {
  const [mobileFormView, setMobileFormView] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState(null);
  return (
    <Grid
      sx={{
        margin: "10px auto",
      }}
      container
    >
      <Grid
        sx={{
          display: { xs: mobileFormView ? "none" : "block", sm: "block" },
        }}
        item
        xs={12}
        md={3}
      >
        <Sidebar setMobileFormView={setMobileFormView}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        />
      </Grid>
      <Grid
        sx={{
         
          display: { xs: mobileFormView ? "block" : "none", sm: "block" },
        }}
        item
        xs={12}
        md={9}
      >
        <JobForm setMobileFormView={setMobileFormView} selectedJob={selectedJob}   setSelectedJob={setSelectedJob} />
      </Grid>
    </Grid>
  );
}

export default EmployerJobs;
