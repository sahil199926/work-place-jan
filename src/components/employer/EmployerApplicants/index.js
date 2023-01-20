import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../../context/userContext";
import { db } from "../../../FirebaseConfig";
import CommonTable from "../../common/CommonTable";
import toastMessage from '../../../util/toastMessage'

const columns=[
  {
    name:"Candidate Name",
    dataKey:"candidateName",
    sx:{
      width:"15%"
    }
  },
  {
    name:"Job Title",
    dataKey:"jobTitle",
    sx:{
      width:"15%",
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    }
  },
  {
    name:"Email",
    dataKey:"candidateEmail",
    sx:{
      width:"18%"
    }
  },
  {
    name:"Resume",
    dataKey:"resume",
    sx:{
      width:"10%",
      textAlign:"center"
    },
    type:'file'
  },
  {
    name:"Applied Date",
    dataKey:"createdAt",
    sx:{
      width:"15%"
    },
    type:'date'
  },
  {
    name:"Status",
    dataKey:"status",
    sx:{
      width:"25%",
      display:"flex",
    },
    type:'button'

  }

]

function EmployerApplicants() {
  const [state, dispatch] = useContext(userContext);
  const [applications, setApplications] = useState(null);
  const fetch = async () => {
    // get all the docs from the applications collection where the candidateId is the same as the current user
    const q = await query(
      collection(db, "applications"),
      where("companyId", "==", state.userInfo.uid)
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

  const handleClick = async(row,actionType) => {
    console.log(row,actionType);
    if(actionType==='reject'){
      //delete the application from the applications collection
      try{
      await deleteDoc(doc(db, "applications", row.applicationId));
      toastMessage({
        message:'Application deleted successfully',
        type:'success'
      })
      }
      catch(err){
        toastMessage({
          message:'Error while deleting the application',
          type:'error'
        })
      }
      
    }
  }
  return applications && applications.length === 0 ? (
    <div className="text-center">No applications found</div>
  ) : applications && applications.length > 0 ? (
    <div>
      <CommonTable
      data={applications}
      columns={columns}
      onRowClick={handleClick}
      />  
    </div>
  ) : (
    <div className="text-center">Loading...</div>
  );
}

export default EmployerApplicants