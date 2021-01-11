import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./ChatScreen";
import WelcomeScreen from "./WelcomeScreen";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import HomeStack from "./HomeStack.js";
import CreateGroupScreen from "./CreateGroupScreen";
import MenuScreen from "./MenuScreen";
import Loading from "../components/Loading";
import { AuthContext } from "../src/AuthProvider";
import * as firebase from "firebase";

const Stack = createStackNavigator();

export default function MyStack() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    setLoading(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal" headerMode="none">
        {user ? (
          <Stack.Screen name="MainHome" component={HomeStack} />
        ) : (
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        )}

        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
