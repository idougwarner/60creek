import React, { useState } from "react";
import { Button, Dropdown, DropdownButton, FormControl } from "react-bootstrap";
import "./Messages.scss";

const Messages = () => {
  const [messages, setMessages] = useState([
    {
      time: new Date(2020, 11, 15, 12, 19),
      type: "Text",
      message:
        "A message asking if they’re interested in selling their oil rights.",
      sender: "me",
    },
    {
      time: new Date(2020, 11, 15, 12, 20),
      type: "Text",
      message: "A message expressing interest in selling their oil rights.",
      sender: "user",
    },
  ]);
  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <div className="message-type active">Messages</div>
          <div className="message-type">Emails</div>
        </div>
        <DropdownButton
          variant="light"
          className="more-menu-btn"
          title={<img src="/assets/icons/more.svg" />}
        >
          <Dropdown.Item>
            <img src="/assets/icons/excel.svg" className="item-icon" /> Excel
          </Dropdown.Item>
          <Dropdown.Item>
            <img src="/assets/icons/csv.svg" className="item-icon" /> CSV
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <div className="messages-container">
        {messages.map((item, idx) => (
          <div
            className={"message-item" + (item.sender === "me" ? " sent" : "")}
          >
            <div className="time">
              {new Date(item.time).toLocaleString()} via {item.type}
            </div>
            <div className="message">{item.message}</div>
          </div>
        ))}
      </div>
      <div className="d-flex">
        <img
          src="/assets/icons/attach.svg"
          className="attach-file mr-3 clickable"
        />
        <FormControl placeholder="Enter your message here" className="mr-3" />
        <Button>SEND</Button>
      </div>
    </>
  );
};

export default Messages;
