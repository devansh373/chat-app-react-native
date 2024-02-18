import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { Entypo, Feather } from "@expo/vector-icons";

const ChatMessagesScreen = () => {
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView>{/* All the chat msgs */}</ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: 25,
        }}
      >
        <Entypo
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="black"
        />
        <TextInput
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
          <Entypo name="camera" size={24} color="black" />
          <Feather name="mic" size={24} color="black" />
          <Pressable
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
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
