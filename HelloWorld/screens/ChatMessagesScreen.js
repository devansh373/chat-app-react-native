import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useContext, useLayoutEffect, useEffect } from "react";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const ChatMessagesScreen = () => {
  const navigation = useNavigation();
  const [showEmojiSelector, setShowEmojiSelecotr] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const route = useRoute();
  const { recepientId } = route.params;
  const [recepientData, setRecepientData] = useState();
  const handleEmojiPress = () => setShowEmojiSelecotr(!showEmojiSelector);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.4:8000/messages/${userId}/${recepientId}`
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

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.4:8000/user/${recepientId}`
        );
        const data = await response.json();
        setRecepientData(data);
      } catch (error) {
        console.log("error in fetching data", error);
      }
    };
    fetchRecepientData();
  }, []);

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);
      // check if msg type is image or text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpeg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }
      const response = await fetch("http://192.168.1.4:8000/messages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("ok");
        setMessage("");
        setSelectedImage("");
        fetchMessages();
      }
    } catch (error) {
      console.log("error in sending the messagee ", error);
    }
  };
  console.log("messagesssss ", messages);
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: recepientData?.image }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                resizeMode: "cover",
              }}
            />
            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
              {recepientData?.name}
            </Text>
          </View>
        </View>
      ),
    });
  }, [recepientData]);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result, result.assets[0].uri);
    if (!result.canceled) {
      handleSend("image", result.assets[0].uri);
    }
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView>
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "orange",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      },
                ]}
              >
                <Text style={{ fontSize: 15, textAlign: "left" }}>
                  {item.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 11,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timestamp)}
                </Text>
              </Pressable>
            );
          }
          if (item.messageType === "image") {
            const baseUrl =
              "C:/Users/admin/Desktop/chat-app/HelloWorld/api/files/";
            const imageUrl = item.imageUrl;
            const fileName = imageUrl.split("\\").pop();
            // const source = { uri: baseUrl + fileName };
            const uri = `file:///C:/Users/admin/Desktop/chat-app/HelloWorld/api/files/${fileName}`;
            console.log("source", uri);

            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "orange",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      },
                ]}
              >
                <View>
                  <Image
                    source={{
                      uri,
                    }}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                    // onError={(error) => console.log("Image load error:", error)}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      marginTop: 5,
                      color: "gray",
                    }}
                  >
                    {formatTime(item?.timestamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="black"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message"
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="black" />
          <Feather name="mic" size={24} color="black" />
        </View>
        <Pressable
          onPress={() => handleSend("text")}
          style={{
            backgroundColor: "aqua",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prev) => prev + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
