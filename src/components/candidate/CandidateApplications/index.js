import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../../context/userContext";
import { db } from "../../../FirebaseConfig";
import CommonTable from "../../common/CommonTable";


const columns=[
  {
    name:"Company Name",
    dataKey:"companyName",
    sx:{
      width:"25%"
    }
  },
  {
    name:"Job Title",
    dataKey:"jobTitle",
    sx:{
      width:"35%"
    }
  },
  {
    name:"Applied Date",
    dataKey:"createdAt",
    sx:{
      width:"30%"
    }
  },
  {
    name:"Status",
    dataKey:"status",
    sx:{
      width:"10%"
    }

  }

]

function CandidateApplications() {
  const [state, dispatch] = useContext(userContext);
  const [applications, setApplications] = useState(null);
  const fetch = async () => {
    // get all the docs from the applications collection where the candidateId is the same as the current user
    const q = await query(
      collection(db, "applications"),
      where("candidateId", "==", state.userInfo.uid)
    );
    await onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setApplications(data);
      console.log(data);
    });
  };
  useEffect(() => {
    fetch();
  }, []);
  return applications && applications.length === 0 ? (
    <div className="text-center">No applications found</div>
  ) : applications && applications.length > 0 ? (
    <div>
      <CommonTable
      data={applications}
      columns={columns}
      />  
    </div>
  ) : (
    <div className="text-center">Loading...</div>
  );
}

export default CandidateApplications;
