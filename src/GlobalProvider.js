import React, { createContext, useState } from "react";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
  return (
    <GlobalContext.Provider
      value={{
        showToast: (value) => {
          ToastAndroid.show(value, ToastAndroid.SHORT);
        },
        storeUsername: async (value) => {
          try {
            await AsyncStorage.setItem("@username", value);
          } catch (e) {
            // saving error
          }
        },
        getUsername: async () => {
          try {
            const value = await AsyncStorage.getItem("@username");
            if (value !== null) {
              // value previously stored
              return value;
            } else {
              return { msg: "nothing" };
            }
          } catch (e) {
            return { e };
            // error reading value
          }
        },
        clearUsername: async () => {
          try {
            await AsyncStorage.removeItem("@username");
          } catch (e) {
            // saving error
          }
        },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
