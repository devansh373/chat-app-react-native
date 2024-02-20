import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext, useState, useLayoutEffect } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";
import Friend from "../components/Friend";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequests, setFriendRequests] = useState([]);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Friends</Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <AntDesign
            name="plussquareo"
            size={24}
            color="black"
            onPress={() => navigation.navigate("Friend Requests")}
          />
        </View>
      ),
    });
  }, []);
  useEffect(() => {
    // fetchFriendRequests();
    fetchFriends();
  }, []);
  const fetchFriends = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.4:8000/accepted-friends/${userId}`
      );
      console.log(userId);
      const data = await response.json();
      console.log("response", response);
      setAcceptedFriends(data);
    } catch (error) {
      console.log("error", error);
    }
  };
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
      {/* <Text>Your Friend Requests</Text> */}
      {/* {friendRequests.length > 0 &&
        friendRequests.map((item, index) => (
          <FriendRequest
            key={index}
            item={item}
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
          />
        ))} */}
      {acceptedFriends.length > 0 &&
        acceptedFriends.map((item, index) => (
          <Friend key={index} item={item} />
        ))}
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
