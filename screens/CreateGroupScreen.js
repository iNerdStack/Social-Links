import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import {
  Text,
  Input,
  Button,
  Icon,
  Layout,
  Spinner,
} from "@ui-kitten/components";
import { AuthContext } from "../src/AuthProvider";
import { GlobalContext } from "../src/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import * as firebase from "firebase";
import "firebase/firestore";

const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;

export default function CreateGroupScreen({ navigation }) {
  const [roomName, setRoomName] = useState("");
  const { showAlert } = useContext(GlobalContext);

  const [isloading, setIsloading] = useState(false);
  const { user, username } = useContext(AuthContext);

  async function handleButtonPress() {
    if (roomName.length >= 3) {
      setIsloading(true);
      await firebase
        .firestore()
        .collection("GROUPS")
        .add({
          name: roomName,
          createdBy: username,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          latestMessage: [],
        })
        .then(() => {
          setIsloading(false);
          showAlert("Group created successfully");
          navigation.navigate("Home");
        });
    } else {
      showAlert("Group name must be more than 3 characters");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Layout
        style={{
          flex: 1,
          backgroundColor: "transparent",
        }}
      >
        <Button
          accessoryLeft={BackIcon}
          appearance="ghost"
          status="info"
          style={{ paddingLeft: 15, height: 50, width: 50 }}
          onPress={() => navigation.goBack()}
        />
        <Layout
          style={{
            flex: 1,
            marginHorizontal: 20,
          }}
        >
          <Layout style={{ height: 250, marginBottom: 35, marginTop: 60 }}>
            <Layout
              style={{ flex: 1, justifyContent: "flex-end", marginTop: 10 }}
            >
              <Image
                source={require("../assets/img/create-group.png")}
                style={{
                  flex: 1,
                  width: "100%",
                  resizeMode: "contain",
                  justifyContent: "flex-end",
                }}
              ></Image>
            </Layout>
          </Layout>
          <Layout>
            <Layout style={{ flexDirection: "column", marginVertical: 15 }}>
              <Text category="h6">Group Name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={roomName}
                  onChangeText={(text) => {
                    if (text.length <= 25) {
                      setRoomName(text);
                    }
                  }}
                />
              </View>
            </Layout>

            <Button
              style={styles.submitButton}
              onPress={() => handleButtonPress()}
              disabled={isloading}
            >
              {isloading ? (
                <Layout
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    backgroundColor: "transparent",
                  }}
                >
                  <Spinner />
                  <Text
                    style={{ color: "#5b4883", marginLeft: 5, marginTop: 4 }}
                  >
                    Please wait
                  </Text>
                </Layout>
              ) : (
                <Text style={styles.submitButtonText} category="h6">
                  Create Group
                </Text>
              )}
            </Button>
          </Layout>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    justifyContent: "center",
    zIndex: 1,
  },
  input: {
    fontSize: 18,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
    height: 40,
    borderWidth: 1,
    borderColor: "white",
    borderBottomColor: "#C0C0C0",
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    paddingVertical: 0,
    paddingLeft: 0,
    padding: 0,
  },
  icon: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 90,
    height: 90,
    zIndex: 999,
  },
  submitButton: {
    borderRadius: 0,
    padding: 10,
    alignItems: "center",
    height: 60,
  },
  submitButtonText: {
    color: "white",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
});
