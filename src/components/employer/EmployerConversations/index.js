import { Grid } from "@mui/material";
import { addDoc, collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../../context/userContext";
import { db } from "../../../FirebaseConfig";
import ConversationSidebar from "../../common/conversationfiles/ConversationSidebar";
import ConversationTextArea from "../../common/conversationfiles/ConversationTextArea";
function EmployerConversations() {
  const [state, dispatch] = useContext(userContext);
  const [lastMessages, setLastMessages] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState({});
  const [mobileViewSidebar, setMobileViewSidebar] = useState(true);
  const [conversationMessages, setConversationMessages] = useState(null);
  const fetchLastMessages = async () => {
    // fetch all the documents from the collection lastMessages where the employerId is the same as the current user
    const q = await query(
      collection(db, "lastMessage"),
      where("companyId", "==", state.userInfo.uid)
    );
    onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      console.log(data);
      setLastMessages(data);
    });
  };
  useEffect(() => {
    fetchLastMessages();
  }, []);

  //fetch all the messages from the collection messages where the conversationId is the same as the selectedMessage.conversationId
  useEffect(() => {
    if (selectedMessage.conversationId) {
      fetchAllConversationMessages();
      setMobileViewSidebar(false);
    }
  }, [selectedMessage]);
  const fetchAllConversationMessages = async () => {
    const q = await query(
      collection(db, "conversations"),
      where("conversationId", "==", selectedMessage.conversationId)
    );
    onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      console.log(data);
      setConversationMessages(data);
    });
  };
  const onSend = async (...props) => {
    const [text, conversationId,lastmessageId] = props;
    // add a new document to the collection conversations
    // update the lastMessage collection

    const message={
      message:text,
      conversationId,
      userId:state.userInfo.uid,
      createdAt:new Date(),
    }
    await addDoc(collection(db, "conversations"), message);
    
    await setDoc(doc(db, "lastMessage", lastmessageId), {
      message: text,
      createdAt: new Date(),
    },{merge:true})

  }
  return (
    <Grid 
    sx={{
      height:'90vh',
    }}
    container>
      <Grid
      sx={{
        display:{xs:mobileViewSidebar?'block':'none',md:'block'}

         

      }}
      item xs={12} md={4}>
        <ConversationSidebar
                nameField="candidateName"
          selectedMessage={selectedMessage}
          setSelectedMessage={setSelectedMessage}
          lastMessages={lastMessages}
        />
      </Grid>
      <Grid
      sx={{
        display:{xs:mobileViewSidebar?'none':'block',md:'block'},
        height:'90vh',
      }}
      item xs={12} md={8}>
        <ConversationTextArea
        onSend={onSend}

        selectedMessage={selectedMessage}
        conversationMessages={conversationMessages}
        header={selectedMessage?.candidateName}
        setMobileViewSidebar={
          setMobileViewSidebar
        }
        />
      </Grid>
    </Grid>
  );
}

export default EmployerConversations;
