import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch(
        "http://192.168.29.216:8000/friend-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentUserId, selectedUserId }),
        }
      );
      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

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
        {/* <Text>User</Text> */}
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ marginTop: 4 }}>{item.email}</Text>
      </View>

      <Pressable
        onPress={() => sendFriendRequest(userId, item._id)}
        style={{
          backgroundColor: "orange",
          borderRadius: 6,
          padding: 10,
          width: 105,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Add Friend</Text>
      </Pressable>
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
