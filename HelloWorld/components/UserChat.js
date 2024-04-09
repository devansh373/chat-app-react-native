import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import { io } from "socket.io-client";

var ENDPOINT = "http://192.168.4.244:8000";
var socket, selectedChatCompare;

const UserChat = ({ item }) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.2:8000/messages/${userId}/${item._id}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  // useEffect(() => {
  //   socket = io(ENDPOINT);
  //   socket.emit("setup", userId);
  //   //  socket.on("connected", () => setSocketConnected(true));
  // }, []);

  const getLastMessage = () => {
    const textMessages = messages.filter(
      (message) => message.messageType === "text"
    );
    return textMessages[textMessages.length - 1];
  };

  const lastMessage = getLastMessage();
  // console.log(messages, lastMessage);
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("Messages", {
          recepientId: item._id,
        });
        // socket.emit("join chat", item._id, userId);
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "black",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}
    >
      <Image
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "cover",
        }}
        source={{ uri: item?.image }}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
        <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
          {lastMessage ? lastMessage.message : "Start the convo!"}
        </Text>
      </View>

      <View>
        <Text style={{ fontSize: 11, fontWeight: "400", color: "grey" }}>
          {formatTime(lastMessage?.timestamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
