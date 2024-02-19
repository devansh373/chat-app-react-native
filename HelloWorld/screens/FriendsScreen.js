import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";
const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.4:8000/friend-request/${userId}`
      );
      console.log(response);
      if (response.status === 200) {
        const freindRequestsData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));
        setFriendRequests(freindRequestsData);
        console.log(friendRequests, freindRequestsData, "hey");
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(userId);

  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      <Text>Your Friend Requests</Text>
      {friendRequests.length > 0 &&
        friendRequests.map((item, index) => (
          <FriendRequest
            key={index}
            item={item}
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
          />
        ))}
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
