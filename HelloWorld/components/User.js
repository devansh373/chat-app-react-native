import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendsRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.2:8000/friend-requests/sent/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setFriendRequests(data);
        } else {
          console.log("error", response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.2:8000/friends/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setUserFriends(data);
        } else {
          console.log("error", response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserFriends();
  }, []);

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://192.168.1.2:8000/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });
      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // console.log("requests sent", friendsRequests);
  // console.log("friends", userFriends);
  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View>
        <Image
          source={{ uri: item.image }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
        />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ marginTop: 4 }}>{item.email}</Text>
      </View>

      {userFriends.includes(item._id) ? (
        <Pressable
          // onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "orange",
            borderRadius: 6,
            padding: 10,
            width: 105,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Friends</Text>
        </Pressable>
      ) : requestSent ||
        friendsRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          // onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "orange",
            borderRadius: 6,
            padding: 10,
            width: 105,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "orange",
            borderRadius: 6,
            padding: 10,
            width: 105,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Add Friend
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
