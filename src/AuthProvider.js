import React, { createContext, useState, useContext } from "react";
import * as firebase from "firebase";
import "firebase/firestore";
import { GlobalContext } from "./GlobalProvider";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { storeUsername, clearUsername } = useContext(GlobalContext);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await firebase
              .auth()
              .signInWithEmailAndPassword(email, password)
              .then(async () => {
                const query = await firebase
                  .firestore()
                  .collection("USERS")
                  .where("email", "==", email.toLowerCase())
                  .get();

                if (!query.empty) {
                  const snapshot = query.docs[0];
                  const data = snapshot.data();
                  storeUsername(snapshot.data().username);
                } else {
                  // not found
                }
              });

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

            //Create user info collection
            await firebase.firestore().collection("USERS").add({
              userid: firebase.auth().currentUser.uid,
              username: username,
              email: email.toLowerCase(),
            });
            storeUsername(username);
            return { type: "success", message: "Signup Successfully" };
          } catch (error) {
            return { type: "failed", message: error.message };
          }
        },
        logout: async () => {
          try {
            await firebase.auth().signOut();
            clearUsername();
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
