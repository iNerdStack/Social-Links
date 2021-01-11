import React, { useState, useContext } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
} from "react-native";
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
const LoginIcon = (props) => <Icon {...props} name="log-in-outline" />;

export default function SignupScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
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

  const Register = async () => {
    setIsloading(true);
    const registerResponse = await register(username, email, password);

    if (registerResponse.type === "success") {
      showToast(registerResponse.message);
      setIsloading(false);
      setTimeout(() => {
        navigation.replace("MainHome");
      }, 1000);
    } else {
      setIsloading(false);
      showToast(JSON.stringify(registerResponse.message));
    }
  };

  return (
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
                onChangeText={(email) => setEmail(email)}
              />
            </View>
          </Layout>
          <Layout style={{ flexDirection: "column", marginVertical: 15 }}>
            <Text category="h6">Username</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={(username) => {
                  let formatUsername = username.replace(" ", "_");
                  setUsername(formatUsername);
                }}
              />
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
            </View>
          </Layout>
          <Button
            style={styles.submitButton}
            onPress={Register}
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
                <Text style={{ color: "#5b4883", marginLeft: 5, marginTop: 4 }}>
                  Please wait
                </Text>
              </Layout>
            ) : (
              <Text style={styles.submitButtonText} category="h6">
                Sign Up
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
