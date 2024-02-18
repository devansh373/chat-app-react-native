import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import UserChat from "../components/UserChat";

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        await fetch(`http://192.168.1.3:8000/accepted-friends/${userId}`)
          .then((response) => response.json())
          .then((response) => {
            setAcceptedFriends(response);
            console.log(response);
          });
      } catch (error) {
        console.log(error);
      }
    };
    acceptedFriendsList();
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
