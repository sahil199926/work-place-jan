import moment from "moment";
import React from "react";
import Loadingprofile from "../../common/skeleton/Loadingprofile";
import "./conversation.css";
function ConversationSidebar({ lastMessages,selectedMessage, setSelectedMessage,nameField }) {
  return lastMessages && lastMessages.length === 0 ? (
    <div>No conversations yet</div>
  ) : lastMessages && lastMessages.length > 0 ? (
    <div>
      {lastMessages.map((item, i) => {
        return (
          <div
          onClick={()=>setSelectedMessage(item)}
          key={i} className={`conversation__sidebar__item ${selectedMessage.conversationId===item.conversationId&&'conversation__sidebar__item_selected'} `}>
            <div>
              <div>{item[nameField]}</div>
              <div>
                {moment(item.createdAt.toDate()).startOf("hour").fromNow()}
              </div>
            </div>
            <div>{item.message}</div>
          </div>
        );
      })}
    </div>
  ) : (
    <div>
      <Loadingprofile fields={6} height={80} />
    </div>
  );
}

export default ConversationSidebar;
