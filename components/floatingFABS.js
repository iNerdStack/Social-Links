import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import {
  Layout,
  Text,
  useTheme,
  Avatar,
  Button,
  Icon,
} from "@ui-kitten/components";
import { AuthContext } from "../src/AuthProvider";

export const FloatingFABS = ({ navigation }) => {
  const { logout, user } = useContext(AuthContext);
  const [showAllFABs, setshowAllFabs] = useState(false);

  const Logout = async () => {
    const logoutResponse = await logout();

    if (logoutResponse.type === "success") {
      showToast(logoutResponse.message);
    } else {
      showToast(JSON.stringify(logoutResponse.message));
    }
  };

  return (
    <Layout
      style={{
        position: "absolute",
        bottom: 15,
        right: 15,
      }}
    >
      {showAllFABs ? (
        <Layout style={{ justifyContent: "space-between" }}>
          <Layout
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Text
              category="s2"
              style={{ paddingRight: 10, fontSize: 15, marginBottom: 5 }}
            >
              Create Groups
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.2)",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
                backgroundColor: "#5b4883",
                borderRadius: 50,
                marginBottom: 10,
              }}
              onPress={() => {
                navigation.navigate("CreateGroup");
                setshowAllFabs(false);
              }}
            >
              <Icon
                name="people-outline"
                style={styles.icon}
                size={30}
                fill="white"
              />
            </TouchableOpacity>
          </Layout>
          <Layout
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Text style={{ paddingRight: 10, fontSize: 15, marginBottom: 5 }}>
              Log Out
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.2)",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
                backgroundColor: "#5b4883",
                borderRadius: 50,
                marginBottom: 10,
              }}
              onPress={() => {
                Logout();
                setshowAllFabs(false);
              }}
            >
              <Icon name="log-in-outline" style={styles.icon} fill="white" />
            </TouchableOpacity>
          </Layout>
        </Layout>
      ) : (
        <Layout></Layout>
      )}

      <Layout
        style={{
          flexDirection: "row-reverse",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            width: 60,
            height: 60,
            backgroundColor: "#5b4883",
            borderRadius: 50,
          }}
          onPress={() => {
            setshowAllFabs(!showAllFABs);
          }}
        >
          <Icon
            name={showAllFABs ? "close-outline" : "message-square-outline"}
            style={styles.icon}
            size={showAllFABs ? "large" : 30}
            fill="white"
          />
        </TouchableOpacity>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
