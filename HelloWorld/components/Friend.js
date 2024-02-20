import { StyleSheet, Text, View, Image } from "react-native";
import React, { useLayoutEffect } from "react";

const Friend = ({ item }) => {
  console.log(item);
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "cover",
        }}
      />

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ marginTop: 4 }}>{item.email}</Text>
      </View>
    </View>
  );
};

export default Friend;

const styles = StyleSheet.create({});
