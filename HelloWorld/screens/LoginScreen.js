import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          navigation.replace("Home");
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email,
      password,
    };

    axios
      .post("http://192.168.29.1:8000/login", user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);

        navigation.replace("Home");
      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid email or password");
        console.log("Login error", error);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: 600, color: "blue" }}>
            Sign In
          </Text>
          <Text style={{ fontSize: 17, fontWeight: 600, marginTop: 15 }}>
            Sign In to your Account
          </Text>
        </View>
        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: 600 }}>Email</Text>
            <TextInput
              style={{
                fontSize: 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={"black"}
              placeholder="Enter your email"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 600 }}>Password</Text>
            <TextInput
              style={{
                fontSize: 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              placeholderTextColor={"black"}
              placeholder="Enter your password"
            />
          </View>
          <Pressable
            onPress={handleLogin}
            style={{
              width: 200,
              backgroundColor: "blue",
              padding: 15,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Login
            </Text>
          </Pressable>
          <Pressable
            style={{ marginTop: 15 }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
