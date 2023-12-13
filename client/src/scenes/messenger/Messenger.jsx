import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Navbar from "scenes/navbar";
import { Box, Grid, TextField, Button, useMediaQuery } from "@mui/material";
import MessageItem from "components/MessageItem";
import FriendSelector from "./FriendSelector";
import { useSelector } from 'react-redux';
import { styled } from "@mui/system";

const StyledMessengerContainer = styled(Box)({
  background: "#f8f9fa",
  minHeight: "100vh",
});

const StyledChatContainer = styled(Box)({
  background: "#ffffff",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  marginTop: "65px",
  marginRight: "25px",
});

const StyledChatHeader = styled(Box)({
  background: "#007bff",
  color: "#ffffff",
  padding: "15px",
  borderBottom: "1px solid #dee2e6",
  borderRadius: "10px 10px 0 0",
});

const StyledMessageContainer = styled(Box)({
  maxHeight: "400px",
  overflowY: "auto",
  padding: "20px",
});

const StyledMessageInputForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  padding: "15px",
  borderTop: "1px solid #dee2e6",
  borderRadius: "0 0 10px 10px",
  alignItems: "flex-end",
});

const Messenger = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const matches = useMediaQuery("(min-width:600px)");
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const socket = io("http://localhost:3001");

  const fetchUserMessages = async () => {
    try {
      if (selectedFriend) {
        const response = await fetch(
          `http://localhost:3001/message/${user._id}/user/${selectedFriend._id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        setMessages(data);
        console.log(data);
      }
    } catch (error) {
      console.error('Error fetching user messages:', error);
    }
  };

  useEffect(() => {
    fetchUserMessages();

    // Join a room specific to the user ID when connecting to Socket.IO
    socket.emit('join', { userId: user._id });

    return () => {
      socket.disconnect();
    };
  }, []); // Fetch user messages and connect to Socket.IO when the component mounts

   const deleteMessage = async (deletedMessage) => {
    try {
      // Send a request to the server to delete the message
      const response = await fetch(
          `http://localhost:3001/message/${deletedMessage._id}/delete`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

      if (response.ok) {
        // Update the state to reflect the deleted message
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== deletedMessage._id)
        );
        console.log('Message deleted successfully:', deletedMessage);
      } else {
        console.error('Failed to delete message:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  useEffect(() => {
    if (selectedFriend) {
      // Listen for real-time updates only for the selected friend
      socket.on(`message:${selectedFriend._id}`, (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      // Clean up socket event listener when component unmounts
      socket.off(`message`);
    };
  }, [selectedFriend]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!selectedFriend) {
      console.error("Please select a friend to send a message to.");
      return;
    }

    // Emit the message to the specific recipient
    socket.emit("message", {
      text: inputMessage,
      sender: user._id,
      recipient: selectedFriend._id,
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputMessage, sender: user._id, recipient: selectedFriend._id },
    ]);
    setInputMessage("");
  };

  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
    fetchUserMessages();
    if (friend) {
      // Join a room specific to the selected friend
      socket.emit('join', { userId: user._id, room: friend._id });
    }
  };

  return (
   <StyledMessengerContainer>
      <Navbar />
      <Grid container>
        <Grid item xs={12} md={3}>
          <FriendSelector userId={user._id} onSelectFriend={handleFriendSelect} />
        </Grid>
        <Grid item xs={12} md={9}>
          <StyledChatContainer>
            <StyledChatHeader>
              <h2 style={{ margin: 0 }}>
                Chatting with {selectedFriend && `${selectedFriend.firstName} ${selectedFriend.lastName}`}
              </h2>
            </StyledChatHeader>
            <StyledMessageContainer>
              {messages.map((message, index) => (
                message ? (
                  <MessageItem key={index} message={message} onDelete={() => deleteMessage(message)} />
                ) : null
              ))}
            </StyledMessageContainer>
            <StyledMessageInputForm onSubmit={sendMessage}>
              <TextField
                fullWidth
                label="Enter your message"
                variant="outlined"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, marginLeft: "auto" }} 
                style={{ color: 'white', backgroundColor: '#007bff' }}
              >
                Send
              </Button>
            </StyledMessageInputForm>
          </StyledChatContainer>
        </Grid>
      </Grid>
    </StyledMessengerContainer>
  );
};

export default Messenger;
