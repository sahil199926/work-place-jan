import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../FirebaseConfig";
import CandidateJobCard from "./CandidateJobCard";
import Loadingprofile from "../../common/skeleton/Loadingprofile";
function CandidateJobs() {
  const [allJobs, setAllJobs] = useState(null);
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
  return !allJobs ? (
    <div>
      <Loadingprofile fields={4} height={250} />
    </div>
  ) : allJobs.length === 0 ? (
    <div>nodata</div>
  ) : (
    <div>
      {allJobs.map((job) => {
        return <CandidateJobCard
        key={job.jobId}
        job={job} />;
      })}
    </div>
  );
}

export default CandidateJobs;
