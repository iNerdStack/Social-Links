import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Layout,
  Text,
  useTheme,
  Avatar,
  Button,
  Icon,
} from "@ui-kitten/components";
import UsersScreen from "./UsersScreen";
import GroupsScreen from "./GroupsScreen";
import FirstScreen from "./FirstScreen";
import { FloatingFABS } from "../components/floatingFABS";

const initialLayout = { width: Dimensions.get("window").width };

const SearchIcon = (props) => <Icon {...props} name="search-outline" />;
export default function MenuScreen({ navigation }) {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "first", title: "Recent" },
    { key: "second", title: "Members" },
    { key: "third", title: "Groups" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <FirstScreen navigation={navigation} />;
      case "second":
        return <UsersScreen navigation={navigation} />;
      case "third":
        return <GroupsScreen navigation={navigation} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: theme["color-info-500"], margin: 3 }}>
          {route.title}
        </Text>
      )}
      {...props}
      indicatorStyle={{
        backgroundColor: theme["color-info-500"],
        width: "20%",
        left: "7%",
        alignItems: "center",
      }}
      style={{ backgroundColor: "white" }}
    />
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Layout
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: 15,
          marginBottom: 10,
        }}
        v
      >
        <Button
          accessoryLeft={SearchIcon}
          appearance="ghost"
          status="info"
          size="large"
        />
        <Text
          category="h3"
          style={{
            paddingTop: 10,
            color: theme["color-info-800"],
          }}
        >
          Chats
        </Text>
        <Avatar
          size="medium"
          source={require("../assets/img/default.png")}
          style={{ marginRight: 17, marginLeft: 12 }}
        />
      </Layout>

      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />

      <FloatingFABS navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
