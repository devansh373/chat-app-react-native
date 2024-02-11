import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "core-js/stable/atob";
import User from "../components/User";
// import { decode } from "base-64";

// global.atob = decode;

// import { MaterialIcons } from "@expo/vector-icons";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Swift Chatss</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          <MaterialIcons name="people-outline" size={24} color="black" />
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

      axios
        .get(`http://192.168.29.216:8000/users/${userId}`)
        .then((response) => {
          // console.log(response);
          setUsers(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error ", error);
        });
    };
    fetchUsers();
  }, []);
  console.log("Users ", users);
  // console.log(userId);

  return (
    <View>
      <View style={{ padding: 10 }}>
        {!loading &&
          users.map((item, index) => <User key={index} item={item} />)}
      </View>
      {/* <Text>HomeScreennn</Text> */}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
