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
import React, {
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
// import * as ImagePicker from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { io } from "socket.io-client";
// import ImageComp from "../components/ImageComp";

var ENDPOINT = "http://192.168.4.244:8000";
var socket, selectedChatCompare;
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
  // const [currentImageUri, setCurrentImageUri] = useState("");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
    // socket.emit("join chat", item._id, userId);
  }, []);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userId);
    //  socket.on("connected", () => setSocketConnected(true));
  }, []);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("message recieved worked", newMessageRecieved);
      // if (
      //   !selectedChatCompare ||
      //   selectedChatCompare._id !== newMessageRecieved.chat._id
      // ) {
      //   // notification
      // } else {
      // setMessages([...messages, newMessageRecieved]);
      // }
    });
  });
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };
  useEffect(() => {
    (async () => {
      const permissionStatus =
        await ImagePicker.getMediaLibraryPermissionsAsync();
      const statusP = await MediaLibrary.requestPermissionsAsync();
      // console.log("permissionStatus", permissionStatus);
      // console.log("statusP", statusP);
    })();
  }, []);
  // useEffect(() => {
  //   const imageMessages = messages.filter(
  //     (item) => item.messageType === "image"
  //   );
  //   if (imageMessages.length > 0) {
  //     const imageUrl = imageMessages[0].imageUrl; // Assuming you want to get the URL of the first image
  //     const fileName = imageUrl.split("\\").pop();
  //     const uri = `file:///C:/Users/admin/Desktop/chat-app/HelloWorld/api/files/${fileName}`;
  //     console.log("source", uri);
  //     setCurrentImageUri(uri);
  //   }
  // }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.4.244:8000/messages/${userId}/${recepientId}`
      );
      const data = await response.json();
      socket.emit("join chat", recepientId, userId);
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
          `http://192.168.4.244:8000/user/${recepientId}`
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
      console.log(userId, recepientId);
      // check if msg type is image or text
      if (messageType === "image") {
        console.log("inside handlesend", imageUri);
        formData.append("messageType", "image");
        formData.append("imageUri", imageUri);
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpeg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
        console.log(message);
      }
      const response = await fetch("http://192.168.4.244:8000/messages", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        socket.emit("new message", data, recepientId);
        console.log("ok");
        setMessage("");
        setSelectedImage("");
        fetchMessages();
      }
    } catch (error) {
      console.log("error in sending the messagee ", error);
    }
  };
  // console.log("messagesssss ", selectedMessages);
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
          {selectedMessages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
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
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="arrow-redo-sharp" size={24} color="black" />
            <Ionicons name="arrow-undo-sharp" size={24} color="black" />
            <FontAwesome name="star" size={24} color="black" />
            <MaterialIcons
              name="delete"
              size={24}
              color="black"
              onPress={() => deleteMessages(selectedMessages)}
            />
          </View>
        ) : null,
    });
  }, [recepientData, selectedMessages]);

  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch("http://192.168.4.244:8000/deleteMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });
      if (response.ok) {
        setSelectedMessages((prevMessages) =>
          prevMessages.filter((id) => !messageIds.includes(id))
        );
        fetchMessages();
      } else {
        console.log("error deleting msgs ", response.status);
      }
    } catch (error) {
      console.log("error deleting msgs ", error);
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log("rsult", result, result.assets[0].uri);
    if (!result.cancelled) {
      handleSend("image", result.assets[0].uri);
      // setCurrentImageUri(result.assets[0].uri);
    }
  };
  const handleSelectMessage = (message) => {
    const isSelected = selectedMessages.includes(message._id);
    if (isSelected) {
      setSelectedMessages((prevMessages) =>
        prevMessages.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((prevMessages) => [...prevMessages, message._id]);
    }
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectedMessages.includes(item._id);
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
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
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: isSelected ? "right" : "left",
                  }}
                >
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
            // const baseUrl =
            //   "C:/Users/admin/Desktop/chat-app/HelloWorld/api/files/";
            const imageUrl = item.imageUrl;
            const fileName = imageUrl.split("\\").pop();
            // console.log(item);
            // console.log("Image URrL:", item.imageUri, fileName);
            // console.log("filename", fileName);
            const uri = fileName;
            // const uri = `C:/Users/admin/Desktop/chat-app/HelloWorld/api/files/${fileName}`;
            // console.log("source", uri);
            // setImageUri(uri);

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
                  {/* <ImageComp fileName={fileName} /> */}

                  <Image
                    source={{
                      uri,
                      // uri: currentImageUri,
                    }}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                    // onError={(error) => console.log("Image load error:", error)} */}
                  />

                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      marginTop: 5,
                      color: "white",
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
