import React from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { Delete, Person } from "@mui/icons-material"; // Import the Person icon

const MessageItem = ({ message, onDelete }) => {
  if (!message) {
    return null;
  }

  const { senderName, text } = message;

  const handleDelete = () => {
    // Pass the message or its ID to the parent component for deletion
    onDelete(message);
  };

  return (
    <Box mb={2} display="flex" alignItems="center" p={2} borderRadius={8} bgcolor="#f0f0f0">
      {/* Use the Person icon for the Avatar */}
      <Avatar sx={{ marginRight: 2 }}>
        {senderName ? senderName[0] : <Person />}
      </Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {senderName}
        </Typography>
        <Typography variant="body1">{text}</Typography>
      </Box>
      <IconButton onClick={handleDelete} color="error" aria-label="delete">
        <Delete />
      </IconButton>
    </Box>
  );
};

export default MessageItem;
