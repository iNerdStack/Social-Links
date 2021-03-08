import React, { createContext, useState, useContext } from "react";
import * as firebase from "firebase";
import "firebase/firestore";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        username,
        setUsername,
        login: async (email, password) => {
          try {
            await firebase.auth().signInWithEmailAndPassword(email, password);

            return { type: "success", message: "Login Successfully" };
          } catch (error) {
            return { type: "failed", message: error.message };
          }
        },
        register: async (username, email, password) => {
          try {
            await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password);

            //Create user info collection & register username
            let batch = firebase.firestore().batch();
            let createUser = firebase
              .firestore()
              .collection("USERS")
              .doc(firebase.auth().currentUser.uid);

            batch.set(createUser, {
              userid: firebase.auth().currentUser.uid,
              username: username.toLowerCase(),
              email: email.toLowerCase(),
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            let createUsername = firebase
              .firestore()
              .collection("USERNAMES")
              .doc(username.toLowerCase());

            batch.set(createUsername, {
              username: username.toLowerCase(),
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            await batch.commit();
            setUsername(username.toLowerCase());
            return { type: "success", message: "Signup Successfully" };
          } catch (error) {
            return {
              type: "failed",
              message: error.message ? error.message : error,
            };
          }
        },
        logout: async () => {
          try {
            await firebase.auth().signOut();
            setUsername("");
            return { type: "success", message: "Logged Out Successfully" };
          } catch (error) {
            return { type: "failed", message: "error" };
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
