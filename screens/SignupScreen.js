import React, { useState, useContext, useRef } from "react";
import { StyleSheet, TextInput, View, Image, ScrollView } from "react-native";
import {
  Text,
  Input,
  Icon,
  Layout,
  Button,
  Spinner,
} from "@ui-kitten/components";

import { AuthContext } from "../src/AuthProvider";
import { GlobalContext } from "../src/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import * as firebase from "firebase";
import "firebase/firestore";

export default function SignupScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { showAlert } = useContext(GlobalContext);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isloading, setIsloading] = useState(false);
  const [correctUsername, setCorrectUsername] = useState(false);
  const [showUsernameError, setshowUsernameError] = useState(false);

  const scrollRef = useRef();

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const CheckUsername = (username) => {
    var re = /^[a-zA-Z0-9_]{3,}[a-zA-Z]+[0-9]*$/;
    return re.test(username);
  };

  const ValidateAllFields = () => {
    if (CheckUsername(username) == true && email != "" && password != "") {
      return true;
    } else {
      return false;
    }
  };

  const QueryRegistration = async () => {
    const registerResponse = await register(username, email, password);

    if (registerResponse.type === "success") {
      showAlert(registerResponse.message);
      setIsloading(false);
      setTimeout(() => {
        navigation.replace("Home");
      }, 1000);
    } else {
      setIsloading(false);
      showAlert(JSON.stringify(registerResponse.message));
    }
  };

  const ValidateRegister = async () => {
    if (ValidateAllFields() === false) {
      showAlert(
        "Validation failed: Please ensure all fields are filled properly"
      );
      return;
    }

    setIsloading(true);

    await firebase
      .firestore()
      .collection("USERNAMES")
      .doc(username.toLowerCase())
      .get()
      .then((docRef) => {
        if (docRef.data()) {
          showAlert("Username has been taken");
          setIsloading(false);
        } else {
          QueryRegistration();
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        ref={scrollRef}
        keyboardShouldPersistTaps={true}
        onContentSizeChange={(contentWidth, contentHeight) => {
          scrollRef.current.scrollToEnd({ animated: true });
        }}
        showsVerticalScrollIndicator={false}
      >
        <Layout
          style={{
            flex: 1,
          }}
        >
          <Layout
            style={{
              flex: 1,
              marginHorizontal: 20,
            }}
          >
            <Layout style={{ height: 250, marginBottom: 35 }}>
              <Layout style={{ flex: 1, justifyContent: "flex-end" }}>
                <Image
                  source={require("../assets/logo-transparent.png")}
                  style={{
                    width: 80,
                    height: 80,
                    resizeMode: "contain",
                    marginBottom: 10,
                  }}
                ></Image>
              </Layout>

              <Text category="h2">Create Account</Text>
              <Text
                category="h6"
                style={{
                  color: "grey",
                }}
              >
                Sign up with your details
              </Text>
            </Layout>
            <Layout>
              <Layout style={{ flexDirection: "column", marginVertical: 15 }}>
                <Text category="h6">Email</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                      setEmail(text);
                    }}
                    onChangeText={(email) => {
                      setEmail(email);
                    }}
                  />
                </View>
              </Layout>

              <Layout style={{ flexDirection: "column", marginVertical: 15 }}>
                <Text category="h6">Username</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={{
                      ...styles.input,
                      color: correctUsername ? "black" : "red",
                    }}
                    value={username}
                    onChangeText={(username) => {
                      let formatUsername = username.replace(" ", "_");
                      if (formatUsername.length <= 15) {
                        setUsername(formatUsername);
                      }

                      if (CheckUsername(username)) {
                        setCorrectUsername(true);
                        setshowUsernameError(false);
                      } else {
                        setCorrectUsername(false);
                        setshowUsernameError(true);
                      }
                    }}
                  />
                  {showUsernameError ? (
                    <Layout
                      style={{
                        height: 40,
                        flexDirection: "row",
                        paddingTop: 5,
                        width: "100%",
                      }}
                    >
                      <Icon
                        fill="red"
                        style={styles.errorIcon}
                        name="alert-circle-outline"
                      />

                      <Text
                        category="s2"
                        style={{
                          color: "red",
                          flexShrink: 1,
                        }}
                      >
                        5-15 alphanumeric characters, "_" is allowed between
                        name
                      </Text>
                    </Layout>
                  ) : null}
                </View>
              </Layout>

              <Layout style={{ flexDirection: "column", marginVertical: 15 }}>
                <Text category="h6">Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={secureTextEntry}
                    onChangeText={(text) => {
                      setPassword(text);
                    }}
                    onChangeText={(password) => {
                      setPassword(password);
                    }}
                  />
                </View>
              </Layout>

              <View>
                <Button
                  style={styles.submitButton}
                  onPress={ValidateRegister}
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
                        style={{
                          color: "#5b4883",
                          marginLeft: 5,
                          marginTop: 4,
                        }}
                      >
                        Please wait
                      </Text>
                    </Layout>
                  ) : (
                    <Text style={styles.submitButtonText} category="h6">
                      Sign Up
                    </Text>
                  )}
                </Button>
              </View>
            </Layout>
            <Layout
              style={{
                justifyContent: "center",
                flexDirection: "row",
                margin: 30,
              }}
            >
              <Text style={{ color: "grey", marginRight: 3 }} category="h6">
                Already A User?
              </Text>
              <Text
                style={{ color: "#9082ff" }}
                category="h6"
                onPress={() => {
                  navigation.navigate("Login");
                }}
              >
                Sign In
              </Text>
            </Layout>
          </Layout>
        </Layout>
      </ScrollView>
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
  errorIcon: {
    width: 15,
    height: 15,
    marginHorizontal: 4,
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
