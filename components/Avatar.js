import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@ui-kitten/components";
export default function ProfileAvatar(props) {
  const blac = "black";

  let colors = [
    "#806fe8",
    "#eeb44f",
    "#f05050",
    "#627a89",
    "#2cc66c",
    "#008290",
    "#aeda09",
  ];

  colors[Math.floor(props.name.length / 2) - 1];

  return (
    <View
      style={{
        ...styles.profile,
        backgroundColor: colors[Math.floor(props.name.length / 2) - 1],
      }}
    >
      <Text category="s2" style={styles.text}>
        {props.name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    height: 55,
    width: 55,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 23,
  },
});
