import { addDoc, collection, deleteDoc, doc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../../context/userContext";
import { db } from "../../../FirebaseConfig";
import CommonTable from "../../common/CommonTable";
import toastMessage from '../../../util/toastMessage'
import Loadingprofile from "../../common/skeleton/Loadingprofile";
import {v4 as uuidv4} from 'uuid'
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
      width:"15%",
      overflow: 'hidden',
      textOverflow: 'ellipsis'
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
      width:"10%",
    }
  },
  {
    name:"action",
    dataKey:"status",
    sx:{
      width:"20%",
      display:"flex",
      textAlign:"center",
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
    else{
      // update the status of the application to accepted
      try{
        await updateDoc(doc(db, "applications", row.applicationId), {
          status: "accepted",
        },{merge:true});
       
      }
      catch(err){
        toastMessage({
          message:'Error while updating the application',
          type:'error'
        })
        console.log(err);
      }
      // create a doc inside lastMessages collection with the candidateId, companyId, jobId ,conversationId, lastMessage, createdAt
      const conversationId=uuidv4()
      const lastmessageId=uuidv4()
      const message=`hey ${row.candidateName} we have accepted Your application for the job ${row.jobTitle}`
      const data={
        candidateId:row.candidateId,
        companyId:row.companyId,
        jobId:row.jobId,
        conversationId,
        message,
        createdAt:new Date(),
        candidateName:row.candidateName,
        companyName:row.companyName,
        lastmessageId
      }
      try{
        await setDoc(doc(db,'lastMessage',lastmessageId), {
          ...data
        });
      }
      catch(err){
        console.log(err);
      }
      // create a doc inside conversations collection with the conversationId, createdAt.userId, message
      try{
        await addDoc(collection(db, "conversations"), {
          conversationId,
          createdAt:new Date(),
          userId:state.userInfo.uid,
          message,
        });
        toastMessage({
          message:'Application updated successfully',
          type:'success'
        })
      }
      catch(err){
        toastMessage({
          message:'Error while creating the conversation',
          type:'error'
        })
        console.log(err);
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
    <div className="text-center"><Loadingprofile fields={5} height={80}/></div>
  );
}

export default EmployerApplicants