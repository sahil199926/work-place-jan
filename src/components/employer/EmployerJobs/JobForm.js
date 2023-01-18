import { Collections, FileUpload } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  primaryRole,
  skills,
  jobType,
  currency,
  jobLocation,
  experience,
} from "../../../constant";
import Dropdown from "../../common/Dropdown";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import SearchDropdown from "../../common/SearchDropdown";
import { db } from "../../../FirebaseConfig";
import toastMessage from "../../../util/toastMessage";
import { userContext } from "../../../context/userContext";
function JobForm({ selectedJob, setSelectedJob,setMobileFormView }) {
  const [isEdit, setIsEdit] = useState(selectedJob ? true : false);
  const [state, dispatch] = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [jobData, setJobdata] = useState({
    jobTitle: "", //
    jobType: "", //
    jobLocation: "", //
    jobDescription: "", //
    primaryRole: "", //
    yearsOfExperience: "", //
    salaryRange: {
      //
      min: "",
      max: "",
      currency: "",
    },
    skills: [],
  });

  useEffect(() => {
    if (selectedJob) {
      setMobileFormView(true);
      setJobdata(selectedJob);
      setIsEdit(false);
    } else {
      setJobdata({
        jobTitle: "", //
        jobType: "", //
        jobLocation: "", //
        jobDescription: "", //
        primaryRole: "", //
        yearsOfExperience: "", //
        salaryRange: {
          //
          min: "",
          max: "",
          currency: "",
        },
        skills: [],
      });
      setIsEdit(true);
    }
  }, [selectedJob]);

  const handleSkills = (newval) => {
    console.log(newval);
    if (jobData.skills.includes(newval.value)) return;
    else {
      setJobdata({ ...jobData, skills: [...jobData.skills, newval.value] });
    }
  };
  const handleDelete = (item) => {
    setJobdata({
      ...jobData,
      skills: jobData.skills.filter((skill) => skill !== item),
    });
  };
  const submit = async (e) => {
    const jobId = selectedJob ? selectedJob.jobId : uuidv4();
    e.preventDefault();
    setLoading(true);
    var employerData;
    console.log(jobData);
    //get company imformation
    try {
      console.log(state.userInfo.uid);
      const q = query(
        collection(db, "userInfo"),
        where("userId", "==", state.userInfo.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        employerData = doc.data();
      });
      console.log(employerData);
    } catch (err) {
      console.log(err);
      toastMessage({
        type: "error",
        message: "Something went wrong in fetching employer data",
      });
    }

    // add job to firebase store
    try {
      const data = {
        ...jobData,
        createdAt: new Date(),
        companyId: state.userInfo.uid,
        companyName: employerData.companyName,
        companyLogo: employerData.companyLogo,
        companyTagline: employerData.companyTagline,
        industryType: employerData.industryType,
      };
      await setDoc(doc(db, "jobs", jobId), {
        ...data,
        jobId,
      });
      toastMessage({
        type: "success",
        message: selectedJob
          ? "job updated successfully"
          : "Job added successfully",
      });
      setLoading(false);
      setSelectedJob(data);
    } catch (err) {
      console.log(err);
      toastMessage({
        type: "error",
        message: "Something went wrong",
      });
    }
  };
  return (
    <form onSubmit={(e) => submit(e)}>
      <Grid className="onboarding-container" container spacing={3}>
        <Grid
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
          item
          xs={12}
        >
          {
            <Button
              variant="contained"
              color="primary"
              sx={{
                marginRight: "10px",
                display:{xs:'block',sm:'none'}
              }}
              onClick={() =>setMobileFormView(false) }
            >
              back
            </Button>
          }
          {selectedJob && (
            <Button
              variant="contained"
              color="primary"
              sx={{
                marginRight: "10px",
              }}
              onClick={() => setIsEdit((p) => !p)}
            >
              {isEdit ? "cancel" : "Edit"}
            </Button>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">Job Title</div>
          <TextField
            disabled={!isEdit}
            size="small"
            fullWidth
            value={jobData.jobTitle}
            required
            onChange={(e) =>
              setJobdata({ ...jobData, jobTitle: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">Job Type</div>
          <Dropdown
            disabled={!isEdit}
            dropdowndata={jobType}
            onChange={(newval) => setJobdata({ ...jobData, jobType: newval })}
            value={jobData.jobType}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">Job Location</div>
          <Dropdown
            disabled={!isEdit}
            dropdowndata={jobLocation}
            onChange={(newval) =>
              setJobdata({ ...jobData, jobLocation: newval })
            }
            value={jobData.jobLocation}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">primary Role</div>
          <Dropdown
            disabled={!isEdit}
            dropdowndata={primaryRole}
            onChange={(newval) =>
              setJobdata({ ...jobData, primaryRole: newval })
            }
            value={jobData.primaryRole}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <div className="label">Years of Experience</div>
          <Dropdown
            disabled={!isEdit}
            dropdowndata={experience}
            onChange={(newval) =>
              setJobdata({ ...jobData, yearsOfExperience: newval })
            }
            value={jobData.yearsOfExperience}
          />
        </Grid>

        <Grid item xs={12}>
          <div className="label">Salary Range</div>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Dropdown
                disabled={!isEdit}
                dropdowndata={currency}
                onChange={(newval) =>
                  setJobdata({
                    ...jobData,
                    salaryRange: { ...jobData.salaryRange, currency: newval },
                  })
                }
                value={jobData.salaryRange.currency}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled={!isEdit}
                size="small"
                fullWidth
                value={jobData.salaryRange.min}
                onChange={(e) =>
                  setJobdata({
                    ...jobData,
                    salaryRange: {
                      ...jobData.salaryRange,
                      min: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled={!isEdit}
                size="small"
                fullWidth
                value={jobData.salaryRange.max}
                onChange={(e) =>
                  setJobdata({
                    ...jobData,
                    salaryRange: {
                      ...jobData.salaryRange,
                      max: e.target.value,
                    },
                  })
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div className="label">Job Description</div>
          <TextField
            disabled={!isEdit}
            multiline
            rows={4}
            size="small"
            fullWidth
            value={jobData.jobDescription}
            onChange={(e) =>
              setJobdata({
                ...jobData,
                jobDescription: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <div className="label">skills</div>
          <SearchDropdown
            disabled={!isEdit}
            dropdowndata={skills}
            onChange={(newval) => handleSkills(newval)}
            values={jobData.skills}
            handleDelete={handleDelete}
          />
        </Grid>
        <Grid item xs={12}>
          {isEdit && (
            <Button
              className="submit-btn"
              disabled={
                jobData.name === "" ||
                jobData.email === "" ||
                jobData.phoneNumber === "" ||
                jobData.primaryRole === "" ||
                jobData.resume === "" ||
                jobData.skills.length === 0 ||
                loading === true
              }
              variant="contained"
              type="submit"
              color="primary"
            >
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export default JobForm;

// job title
// job type
// job location
// job description
// primaary role
// years of experience
// salary range
// skills
