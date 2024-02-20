import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";

const ImageComp = ({ fileName }) => {
  const [imageUri, setImageUri] = useState("");
  setImageUri(
    `file:///C:/Users/admin/Desktop/chat-app/HelloWorld/api/files/${fileName}`
  );
  return (
    <View>
      <Image
        source={{ uri: imageUri }}
        style={{ width: 200, height: 200, borderRadius: 7 }}
      />
    </View>
  );
};

export default ImageComp;

const styles = StyleSheet.create({});
