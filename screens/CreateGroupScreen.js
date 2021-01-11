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
  const { getUsername, showToast } = useContext(GlobalContext);
  const [username, setUsername] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const { user } = useContext(AuthContext);

  const LoadingIndicator = (props) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size="small" status="info" />
    </View>
  );
  useEffect(() => {
    async function userName() {
      const getuser = await getUsername();
      setUsername(getuser);
    }

    userName();
  }, []);

  async function handleButtonPress() {
    if (roomName.length > 0) {
      setIsloading(true);
      await firebase
        .firestore()
        .collection("THREADS")
        .add({
          name: roomName,
          latestMessage: {
            text: `${username} created the group ${roomName}.`,
            createdAt: new Date().getTime(),
          },
        })
        .then((docRef) => {
          docRef.collection("MESSAGES").add({
            text: `${username} created the group ${roomName}.`,
            createdAt: new Date().getTime(),
            system: true,
          });
          setIsloading(false);
          showToast("Group created successfully");
          navigation.navigate("Home");
        });
    } else {
      showToast("Enter a group name");
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
              <Text category="h6">Create Group</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setRoomName(text)}
                />
                {/* <Icon
                  style={styles.icon}
                  name="person-outline"
                  fill="#000000"
                /> */}
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
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },

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
