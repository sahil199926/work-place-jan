import { Divider } from "@mui/material";
import React from "react";
import moment from "moment";
import { Timestamp } from "firebase/firestore";
function EmpJobCard({item,selectedJob, setSelectedJob}) {
  const {
    jobTitle,
    createdAt,
    jobLocation,
    jobType,
   
    jobId,
  } = item;
  return (
    <div>
      <div
        onClick={() =>
          setSelectedJob(item)
        }
        className={`job-card ${
          jobId === selectedJob?.jobId ? "selected-card" : ""
        } `}
      >
        <div className="job-last-edit">
          Last Edited {new Date(createdAt.seconds * 1000).toLocaleDateString()}
        </div>
        <div className="job-card-details-item">
          <div className="job-card-title">{jobTitle}</div>
          <div className="job-card-location">{jobLocation}</div>
          <div className="job-card-location">Job Type {jobType}</div>
        </div>
        <p>
          <Divider />
        </p>
      </div>
    </div>
  );
}

export default EmpJobCard;
