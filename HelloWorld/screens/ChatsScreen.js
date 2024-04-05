import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState, useContext, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import UserChat from "../components/UserChat";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
// import axios from "axios";
import "core-js/stable/atob";
import { io } from "socket.io-client";

var ENDPOINT = "http://192.168.4.244:8000";
var socket, selectedChatCompare;

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  // useEffect(() => {
  // socket = io(ENDPOINT);
  //   socket.emit("setup", userId);
  //   //  socket.on("connected", () => setSocketConnected(true));
  // }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Swift Chatss</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      // console.log(token);
      const decodedToken = jwtDecode(token);
      // console.log(decodedToken, "hey");
      const userId = decodedToken.userId;
      // console.log(userId);
      setUserId(userId);

      // axios
      //   .get(`http://192.168.1.4:8000/users/${userId}`)
      //   .then((response) => {
      //     // console.log(response);
      //     setUsers(response.data);
      //     console.log(response.data);
      //     setLoading(false);
      //   })
      //   .catch((error) => {
      //     console.log("Error ", error);
      //   });
      // };
      // const acceptedFriendsList = async () => {
      try {
        const response = await fetch(
          `http://192.168.4.244:8000/accepted-friends/${userId}`
        );
        console.log(userId);
        const data = await response.json();
        console.log("response", response);
        setAcceptedFriends(data);
      } catch (error) {
        console.log("error", error);
      }
    };
    // acceptedFriendsList();
    fetchUsers();
  }, []);
  console.log("accpted friends", acceptedFriends);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {acceptedFriends.map((item, index) => (
          <UserChat key={index} item={item} />
        ))}
      </Pressable>
    </ScrollView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({});
