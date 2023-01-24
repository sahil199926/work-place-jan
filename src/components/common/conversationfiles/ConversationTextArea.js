import { Button, Grid, TextareaAutosize, TextField } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { userContext } from "../../../context/userContext";
import "./conversation.css";
import SendIcon from "@mui/icons-material/Send";
function ConversationTextArea({
  setMobileViewSidebar,
  conversationMessages,
  onSend,
  selectedMessage,
  header
}) {
  const [state, dispatch] = useContext(userContext);
  const [sortedMessages, setSortedMessages] = React.useState([]);
  const [text, setText] = React.useState("");
  const textAreaRef = React.useRef(null);
  useEffect(() => {
    if (conversationMessages) {
      setSortedMessages(
        conversationMessages.sort((a, b) => {
          return a.createdAt.toDate() - b.createdAt.toDate();
        })
      );
    }
  }, [conversationMessages]);

  const godown = () => {
    textAreaRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };
  return conversationMessages && conversationMessages.length > 0 ? (
    <div className="conversation__textArea">
      <h1>
        <Button
          sx={{
            display: { xs: "block", sm: "none" },
          }}
          onClick={() => setMobileViewSidebar(true)}
        >
          Back
        </Button>
        {header}
      </h1>
      <h2 ref={textAreaRef}>
        {sortedMessages.map((item, i) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent:
                  state.userInfo.uid === item.userId
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <div
                style={{
                  margin: "10px",
                  background: " #EAEAEA",
                  borderRadius: "16px",
                  padding: "10px",
                }}
                key={i}
                className="conversation__textArea__message"
              >
                <div>{item.message}</div>
                <div className="conversation__textArea__message__time">
                  {moment(item.createdAt.toDate()).format("hh:mm:A")}
                </div>
              </div>
            </div>
          );
        })}
      </h2>
      <p>
        <Grid container >
          <Grid item xs={8} sm={10}>
            <TextField
              fullWidth
              multiline
              required
              rowsMin={3}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <Button
              sx={{
                marginLeft: "10px",
                width: "80px",
                height: "50px",
                background: "#fff",
                border: "1px solid #0000002e",
                borderRadius: "13px",
              }}
              onClick={() => {
                if (text) {
                  onSend(
                    text,
                    selectedMessage.conversationId,
                    selectedMessage.lastmessageId
                  );
                }
              }}
            >
              <SendIcon />
            </Button>
          </Grid>
        </Grid>
      </p>
    </div>
  ) : conversationMessages && conversationMessages.length === 0 ? (
    <div>No messages</div>
  ) : (
    <div>select a conversation to see the messages</div>
  );
}

export default ConversationTextArea;
