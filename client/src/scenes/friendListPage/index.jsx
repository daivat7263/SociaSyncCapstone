import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Navbar from 'scenes/navbar';
import FriendListWidget from "scenes/widgets/FriendListWidget";

const FriendListPage = ({ userId }) => {
  const user = useSelector((state) => state.user);
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const[friends, setFriends] = useState([]);

  const token = useSelector((state) => state.token);
  
  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${user._id}/allusers`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log('all ' ,data);
    (setFriends({ friends: data }));
  };
  useEffect(() => {
    getFriends();
  }, []);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap="2rem"
        justifyContent="center"
      >
        <div>
          <FriendListWidget userId={user._id} />
        </div>
      </Box>
    </Box>
  );
};

export default FriendListPage;
