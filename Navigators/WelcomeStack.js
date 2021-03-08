import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeStack from "./HomeStack";
import MainScreen from "../screens/MainScreen";
import Loading from "../components/Loading";
import { AuthContext } from "../src/AuthProvider";
import * as firebase from "firebase";

const Stack = createStackNavigator();

export default function MyStack() {
  const { user, setUser, username, setUsername, logout } = useContext(
    AuthContext
  );
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  async function loadUsername() {
    //get username on app load and call it only once

    if (firebase.auth().currentUser && username === "") {
      await firebase
        .firestore()
        .collection("USERS")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((docRef) => {
          setUsername(docRef.data().username);
          if (initializing) setInitializing(false);
          setLoading(false);
        })
        .catch((error) => {
          //if error while getting username, then logout
          logout();
        });
    } else {
      if (initializing) setInitializing(false);
      setLoading(false);
    }
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    loadUsername();
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
          <Stack.Screen name="Home" component={HomeStack} />
        ) : (
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        )}

        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
