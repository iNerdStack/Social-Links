import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { StyleSheet } from "react-native";

//screens
import CreateGroupScreen from "../screens/CreateGroupScreen";
import SearchScreen from "../screens/SearchScreen";
import ChatScreen from "../screens/ChatScreen";
import GroupScreen from "../screens/GroupScreen";
import GroupsScreen from "../screens/GroupsScreen";
import UsersScreen from "../screens/UsersScreen";
import MainScreen from "../screens/MainScreen";

// create two new instances
const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

function ChatApp() {
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
        name="Homes"
        component={MainScreen}
        options={({ route }) => ({
          headerShown: false,
          // title: route.params.thread.name,
        })}
      />
      <ChatAppStack.Screen
        name="Search"
        component={SearchScreen}
        options={({ route }) => ({
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
      <ModalStack.Screen name="Rooms" component={GroupsScreen} />
      <ModalStack.Screen name="Users" component={UsersScreen} />
      <ModalStack.Screen
        name="Room"
        component={GroupScreen}
        options={({ route }) => ({
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          // title: route.params.thread.name,
        })}
      />
      <ModalStack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          // title: route.params.thread.name,
        })}
      />
      <ModalStack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
        options={({ route }) => ({
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          // title: route.params.thread.name,
        })}
      />
    </ModalStack.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
  },
});
