// FriendSelector.jsx

import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Card, CardContent, CardActionArea, Avatar, styled } from "@mui/material";
import { useSelector } from 'react-redux';
import UserImage from "../../components/UserImage";

const StyledFriendSelector = styled(Box)({
  maxWidth: "300px",
  margin: "0 auto",
  paddingTop: "20px",
});

const StyledFriendCard = styled(Card)({
  cursor: "pointer",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
  borderRadius: "10px",
  marginBottom: "10px",
});

const StyledCardActionArea = styled(CardActionArea)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const StyledUserImage = styled(UserImage)({
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  marginBottom: "10px",
  paddingTop: "20px",
});

const FriendSelector = ({ userId, onSelectFriend }) => {
  const { palette } = useTheme();
  const [friends, setFriends] = useState([]);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const getFriends = async () => {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setFriends(data);
    };

    getFriends();
  }, [userId, token]);

  const handleFriendClick = (friend) => {
    onSelectFriend(friend);
  };

  return (
    <StyledFriendSelector>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem", textAlign: "center" }}
      >
        Select a Friend
      </Typography>
      {friends.map((friend) => (
        <StyledFriendCard key={friend._id} onClick={() => handleFriendClick(friend)}>
          <StyledCardActionArea>
            <StyledUserImage image={friend.picturePath} />
            <CardContent>
              <Typography variant="subtitle1" textAlign="center">{`${friend.firstName} ${friend.lastName}`}</Typography>
            </CardContent>
          </StyledCardActionArea>
        </StyledFriendCard>
      ))}
    </StyledFriendSelector>
  );
};

export default FriendSelector;
