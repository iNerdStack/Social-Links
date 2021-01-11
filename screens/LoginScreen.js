import React, { useState, useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
  TextInput,
} from "react-native";
import {
  Text,
  Input,
  Icon,
  Layout,
  Button,
  Spinner,
  Divider,
} from "@ui-kitten/components";

import { AuthContext } from "../src/AuthProvider";
import { GlobalContext } from "../src/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
const LoginIcon = (props) => <Icon {...props} name="log-in-outline" />;

export default function SignupScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { showToast } = useContext(GlobalContext);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isloading, setIsloading] = useState(false);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const LogIn = async () => {
    setIsloading(true);
    const loginResponse = await login(email, password);

    if (loginResponse.type === "success") {
      showToast(loginResponse.message);
      setIsloading(false);
      setTimeout(() => {
        navigation.replace("MainHome");
      }, 1000);
    } else {
      setIsloading(false);
      showToast(JSON.stringify(loginResponse.message));
    }
  };

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

            <Text category="h2">Welcome Back,</Text>
            <Text
              category="h6"
              style={{
                color: "grey",
              }}
            >
              Sign in to continue
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
                  onChangeText={(email) => setEmail(email)}
                />
                {/* <Icon
                  style={styles.icon}
                  name="person-outline"
                  fill="#000000"
                /> */}
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
                  onChangeText={(password) => setPassword(password)}
                />
                {/* <TouchableOpacity onPress={toggleSecureEntry}>
                  <Icon
                    style={styles.icon}
                    name={secureTextEntry ? "eye-off" : "eye"}
                    fill="#000000"
                    onPress={toggleSecureEntry}
                  />
                </TouchableOpacity> */}
              </View>
            </Layout>
            <Layout style={{ flexDirection: "row-reverse", marginBottom: 10 }}>
              <Text
                category="h6"
                style={{
                  color: "grey",
                }}
              >
                Forgot Password?
              </Text>
            </Layout>

            <Button
              style={styles.submitButton}
              onPress={LogIn}
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
                    style={{ color: "#5b4883", marginLeft: 5, marginTop: 5 }}
                  >
                    Please wait
                  </Text>
                </Layout>
              ) : (
                <Text style={styles.submitButtonText} category="h6">
                  Sign In
                </Text>
              )}
            </Button>
          </Layout>
          <Layout
            style={{
              justifyContent: "center",
              flexDirection: "row",
              margin: 30,
            }}
          >
            <Text style={{ color: "grey", marginRight: 3 }} category="h6">
              New Here?
            </Text>
            <Text
              style={{ color: "#9082ff" }}
              category="h6"
              onPress={() => {
                navigation.navigate("Signup");
              }}
            >
              Sign Up
            </Text>
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
