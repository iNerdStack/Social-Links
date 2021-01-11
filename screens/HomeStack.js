import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";

//screens
import CreateGroupScreen from "./CreateGroupScreen";
import ChatScreen from "./ChatScreen";
import GroupScreen from "./GroupScreen";
import GroupsScreen from "./GroupsScreen";
import UsersScreen from "./UsersScreen";
import MenuScreen from "./MenuScreen";
import { Layout, Text, Icon, Button } from "@ui-kitten/components";
import { withStyles, useTheme } from "@ui-kitten/components";

// create two new instances
const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const MenuIcon = (props) => <Icon {...props} name="menu-2-outline" />;
const BackIcon = (props) => <Icon {...props} name="arrow-back-outline" />;

function ChatApp() {
  const theme = useTheme();
  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ffffff",
          elevation: 0,
          shadowOpacity: 0,
          headerShown: false,
        },
        headerTintColor: "#9082ff",
        headerTitleStyle: {
          fontSize: 23,
        },
      }}
    >
      <ChatAppStack.Screen
        name="Home"
        component={MenuScreen}
        options={({ route }) => ({
          headerShown: false,
          // title: route.params.thread.name,
        })}
      />
    </ChatAppStack.Navigator>
  );
}

export default function HomeStack() {
  return (
    <ModalStack.Navigator headerMode="none" mode="modal">
      <ModalStack.Screen name="ChatApp" component={ChatApp} />
      <ModalStack.Screen
        name="Rooms"
        component={GroupsScreen}
        options={({ route }) => ({
          // title: route.params.thread.name,
        })}
      />
      <ModalStack.Screen
        name="Users"
        component={UsersScreen}
        options={({ route }) => ({
          transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS,
          // title: route.params.thread.name,
        })}
      />
      <ModalStack.Screen
        name="Room"
        component={GroupScreen}
        options={({ route }) => ({
          // title: route.params.thread.name,
          title: "Group",
        })}
      />
      <ModalStack.Screen name="Chat" component={ChatScreen} />
      <ModalStack.Screen name="CreateGroup" component={CreateGroupScreen} />
    </ModalStack.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
  },
});
