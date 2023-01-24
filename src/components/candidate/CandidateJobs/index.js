import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../../FirebaseConfig";
import CandidateJobCard from "./CandidateJobCard";
import Loadingprofile from "../../common/skeleton/Loadingprofile";
import { userContext } from "../../../context/userContext";
import { v4 as uuidv4 } from "uuid";
import toastMessage from "../../../util/toastMessage";

function CandidateJobs() {
  const [allJobs, setAllJobs] = useState(null);
  const [state, dispatch] = useContext(userContext);
  const fetchAllJobs = async () => {
    //call firebase to get all the jobs with the employer id is the same as the current user

    const q = query(collection(db, "jobs"));

    const querySnapshot = await getDocs(q);
    const alljobs = [];
    querySnapshot.forEach((doc) => {
      alljobs.push(doc.data());
    });
    setAllJobs(alljobs);
    console.log(alljobs);
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);
  const applyJob = async (job) => {
    console.log(job);
    const candidateId = state.userInfo.uid;
    const applicationId = uuidv4();

    //add a check to see if the user has already applied for this job
    //? get all the docs from the applications collection where the candidateId is the same as the current user.
    //? from that list of docs, check if the jobId is the same as the job that the user is trying to apply for
    //? if the jobId is the same, then the user has already applied for this job show a message saying "you have already applied for this job"
    //? if the jobId is not the same, then the user has not applied for this job, so we can proceed to apply for this job

    try {
      const q = query(
        collection(db, "applications"),
        where("candidateId", "==", candidateId)
      );
      const querySnapshot = await getDocs(q);
      const allApplications = [];
      querySnapshot.forEach((doc) => {
        allApplications.push(doc.data());
      });

      let exist = allApplications.find(
        (application) => application.jobId === job.jobId
      );
      if (exist) {
        toastMessage({
          message: "You have already applied for this job",
          type: "warning",
        });
        return;
      }

      // fetch candidate info from the users collection
    } catch (err) {
      console.log(err);
    }
    var resume = "";
    try {
      const data = await getDoc(doc(db, "userInfo", candidateId));
      console.log(data.data());
      resume = data.data().resume;
    } catch (err) {
      console.log(err, "error while fetching candidate info");
    }

    // call firbase and we will add this application to application collection
    const data = {
      jobId: job.jobId,
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      jobLocation: job.jobLocation,
      companyId: job.companyId,
      candidateId: candidateId,
      applicationId: applicationId,
      candidateName: state.userInfo.displayName,
      candidateEmail: state.userInfo.email,
      createdAt: new Date().toISOString(),
      resume,
      status: "applied",
    };
    //call firebase
    try {
      await setDoc(doc(db, "applications", applicationId), data);
      toastMessage({
        message: "Applied successfully",
        type: "success",
      });
    } catch (err) {
      console.log(err);
      toastMessage({
        message: "Something went wrong",
        type: "error",
      });
    }
  };
  return !allJobs ? (
    <div>
      <Loadingprofile fields={4} height={250} />
    </div>
  ) : allJobs.length === 0 ? (
    <div>nodata</div>
  ) : (
    <div>
      {allJobs.map((job) => {
        return (
          <CandidateJobCard key={job.jobId} applyJob={applyJob} job={job} />
        );
      })}
    </div>
  );
}

export default CandidateJobs;
