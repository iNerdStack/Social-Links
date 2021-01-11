import React from "react";
import { Dimensions, StyleSheet, ImageBackground, Image } from "react-native";
import { Text, Icon, Button, Layout } from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("screen");

const GridIcon = (props) => <Icon {...props} name="grid-outline" />;

const SettingsIcon = (props) => (
  <Icon {...props} name="color-palette-outline" />
);

const MenuIcon = (props) => <Icon {...props} name="menu-outline" />;

const LoginScreen = ({ navigation }) => (
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
          marginBottom: 50,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <Text
          category="h2"
          style={{
            color: "black",
            marginTop: 80,
          }}
        >
          Social Links
        </Text>
        <Text
          category="c1"
          style={{
            color: "grey",
          }}
        >
          Meet New People. Build Connections
        </Text>
        <Image
          source={require("../assets/img/welcome.jpg")}
          style={{
            flex: 1,
            width: "100%",
            resizeMode: "contain",
            justifyContent: "flex-end",
          }}
        ></Image>

        <Layout
          style={{
            justifyContent: "center",
            padding: 10,
            backgroundColor: "transparent",
            width: 350,
          }}
        >
          <Button
            status="success"
            style={{ margin: 10, borderRadius: 12, backgroundColor: "#f484b0" }}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Button>
          <Button
            style={{ margin: 10, borderRadius: 12 }}
            onPress={() => navigation.navigate("Signup")}
          >
            Sign Up
          </Button>
        </Layout>
        <Text
          category="s2"
          style={{
            color: "grey",
            textAlign: "center",
          }}
        >
          By signing up you accept our terms & condition {"\n"} and Privacy
          Policy
        </Text>
      </Layout>
    </Layout>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  MainContainer: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: "#e5e5e5",
  },
  GridViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    margin: 2,
    backgroundColor: "#FFFFFF",
  },
  GridViewTextLayout: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    color: "#fff",
    padding: 10,
  },
  imageThumbnail: {
    resizeMode: "cover",
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
  },
});

export default LoginScreen;
