import { Grid } from "@mui/material";
import React from "react";
import "./candidatejob.css";
function CandidateJobCard({ job,applyJob}) {
  const {
    companyLogo,
    companyName,
    companyTagline,
    createdAt,
    industryType,
    jobDescription,
    jobId,
    jobLocation,
    jobTitle,
    jobType,
    primaryRole,
    salaryRange,
    yearsOfExperience,
  } = job;
  return (
    <div className="candidate-job-card">
      <Grid container spacing={2}>
        <Grid item xs={3} sm={2}>
          <img width="100%" src={companyLogo} alt="company logo" />
        </Grid>
        <Grid className="candidate-job-card__company-title" item xs={9} sm={10}>
          <div>{companyName}</div>
          <div>{companyTagline}</div>
          <div>Industry type {industryType}</div>
        </Grid>
      </Grid>

      <Grid
        sx={{
          margin: "10px 0",
          border: "1px solid #D4D4D4",
          borderRadius: "7px",
          padding: "5px",
          alignItems: "center",
        }}
        container
      >
        <Grid item xs={12} md={3} >
          <div className="jobtitle">{jobTitle}</div>
        </Grid>
        <Grid className="candidate-job-card__job-info" item xs={12} md={6}>
          {"- "} <div>{jobLocation} </div>
          <div>
            {" • "} {salaryRange.min} - {salaryRange.max}
          </div>
        </Grid>
        <Grid
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
        item xs={12} md={3}>
          <button
          onClick={()=>applyJob(job)}
          className="candidate-job-card__apply-btn">Apply</button>
        </Grid>
      </Grid>
    </div>
  );
}

export default CandidateJobCard;
